///<summary>
///A service which connects the shared properties of the site mostly handles the diffenet group arrays,
///and the functions which must be reached from everywhere 
///</summary>
class SharedProperties implements ISharedProperties {
    private serverUrl: string = "http://localhost:31725/";
    private profile: IProfile;//Profile data of the current user

    private requestsCounter: number = 0;//Counts the pending http requests
    private imageRequestsCounter: number = 0;//Counts the pending http gets to api/getimagebyid/{id}

    private myGroups: IGroup[] = [];        //csoportok, amiben tag vagyok, Role >= Member
    private adminedGroups: IGroup[] = [];     //csoportok amit létrehoztam -> Role >= Admin
    private otherGroups: IGroup[] = [];     //minden egyéb csoport -> Role < Member

    public waitingForResp: boolean = false; //disables the buttons while there is a http request pending

    static $inject = ["$window", "$rootScope", "SignalRService", "md5"];
    constructor(private $window: ng.IWindowService,
        private $rootScope: ng.IRootScopeService,
        private SignalRService: ISignalRService,
        private md5: any) {
    }

    getServerUrl() {
        return this.serverUrl;
    }

    getProfile() {
        return this.profile;
    }

    getAccessToken() {
        return this.profile.accessToken;
    }

    getUserEmail() {
        return this.profile.email;
    }

    getUserName() {
        return this.profile.name;
    }

    getUserEmailHash() {
        return this.profile.emailHash;
    }

    ///<summary>
    ///Changes the username, and stores it in the session storage
    ///</summary>
    ///<param name="newName"> The new name to which we update the old in the session storage</param>
    changeUserName(newName: string) {
        this.$window.sessionStorage.setItem('username', newName);
        this.profile.name = newName;
    }

    ///<summary>
    ///Stores the login data in the session storage 
    ///</summary>
    ///<param name="newAccessToken"> Name of the user </param>
    ///<param name="email">Email of the user</param>
    ///<param name="name">  Access token of the user  </param>
    login(newAccessToken: string, email: string, name: string) {
        this.$window.sessionStorage.setItem('token', newAccessToken);
        this.$window.sessionStorage.setItem('useremail', email);
        this.$window.sessionStorage.setItem('username', name);

        this.profile = <IProfile>{
            accessToken: newAccessToken,
            email: email,
            name: name,
            emailHash: this.md5.createHash(email || '')
        };
    }

    ///<summary>
    ///Resets the session storage on logout
    ///</summary>
    logout() {
        this.$window.sessionStorage.setItem('token', "");
        this.$window.sessionStorage.setItem('useremail', "");
        this.$window.sessionStorage.setItem('username', "");
        this.profile = undefined;
    }

    ///<summary>
    ///Returns true if the user is loged in and refreshes the user data 
    //if its undefined but there is an access token in the session storage
    ///</summary>
    isUserLoggedIn() {
        if (this.profile != undefined && this.profile.accessToken != "") {
            return true;
        } else if (this.$window.sessionStorage.getItem('token') != null && this.$window.sessionStorage.getItem('token') != "") {
            this.profile = <IProfile>{
                accessToken: this.$window.sessionStorage.getItem('token'),
                email: this.$window.sessionStorage.getItem('useremail'),
                name: this.$window.sessionStorage.getItem('username'),
                emailHash: this.md5.createHash(this.$window.sessionStorage.getItem('useremail') || '')
            };
            return true;
        }

        return false;
    }

    ///<summary>
    ///Increases the requestCounter if the given url is matched by one of the watched requests, sets waitingForResp
    ///</summary>
    ///<param name="url"> The url we try to match to the watched  </param>
    increaseRequestsCounter(url: string) {
        if (url.indexOf("Image/GetImage") > -1) {
            this.imageRequestsCounter += 1;
        }

        if (url.indexOf('Group/CreateGroup') > -1 || url.indexOf('Group/JoinGroup') > -1 || url.indexOf('Group/LeaveGroup') > -1
            || url.indexOf('Group/RenameGroup') > -1 || url.indexOf('Group/ChangeDescription') > -1 || url.indexOf('Group/DeleteGroup') > -1
            || url.indexOf('Image/ChangeDescription') > -1 || url.indexOf('Image/DeleteImage') > -1
            || url.indexOf('Account/ChangeName') > -1 || url.indexOf('Account/ChangePassword') > -1) {

            if (this.requestsCounter == 0) {
                this.waitingForResp = true;
            }

            this.requestsCounter += 1;
        }
    }

    ///<summary>
    ///Decreses the requestCounter if the given url is matched by one of the watched requests, sets waitingForResp
    ///</summary>
    ///<param name="url"> The url we try to match to the watched  </param>
    decreaseRequestsCounter(url: string) {
        if (url.indexOf("Image/GetImage") > -1) {
            this.imageRequestsCounter -= 1;
            if (this.imageRequestsCounter == 0) {
                this.$rootScope.$broadcast('sharedPropertiesImagesLoaded');
            }
        }

        if (url.indexOf('Group/CreateGroup') > -1 || url.indexOf('Group/JoinGroup') > -1 || url.indexOf('Group/LeaveGroup') > -1
            || url.indexOf('Group/RenameGroup') > -1 || url.indexOf('Group/ChangeDescription') > -1 || url.indexOf('Group/DeleteGroup') > -1
            || url.indexOf('Image/ChangeDescription') > -1 || url.indexOf('Image/DeleteImage') > -1
            || url.indexOf('Account/ChangeName') > -1 || url.indexOf('Account/ChangePassword') > -1) {

            this.requestsCounter -= 1;

            if (this.requestsCounter == 0) {
                this.waitingForResp = false;
            }
        }
    }

    ///<summary>
    //Sets the   myGroups and admined groups arrays based on the groups array passed as parameter,
    ///and subscribes to the groups in signalerr
    ///Broadcasts message about the change
    ///</summary>
    ///<param name="groups"> Sets the arrays based on this param  </param>
    setMyGroups(groups: IGroup[]) {
        this.myGroups = [];
        this.adminedGroups = [];

        var signalrRooms: Array<number> = [];
        //sets the arrays
        groups.forEach((item, index) => {
            var group = <IGroup>{
                id: item.id,
                name: item.name,
                ownerName: item.ownerName,
                description: item.description,
                role: item.role,
                isPrivate: item.isPrivate,
                picturesCount: item.picturesCount,
                membersCount: item.membersCount
            };
            this.myGroups.push(group);
            signalrRooms.push(item.id);

            if (group.role >= GroupMembershipRole.Administrator) {
                this.adminedGroups.push(group);
            }
        });
        //Joins to the signalerr groups
        if (signalrRooms.length > 0) {
            ///Reconects to signalerr if we are not connected
            if (this.SignalRService.getConnectionStatus() == SignalRStatus.Disconnected) {
                this.SignalRService.restartPiChat().done(() => {
                    console.log("SignalR connection restarted!");
                    this.SignalRService.setConnectionStatus(SignalRStatus.Connected);
                    this.SignalRService.joinToGroups(signalrRooms);
                }).fail(() => {
                    this.SignalRService.setConnectionStatus(SignalRStatus.Disconnected);
                    console.error("SignalR error");
                });
            } else {
                this.SignalRService.joinToGroups(signalrRooms);
            }
        }

            this.$rootScope.$broadcast('sharedPropertiesGroupsChanged');
    }

    ///<summary>
    ///Sets the   otherGroups array based on the groups array passed as parameter.
    ///Broadcasts message about the change
    ///</summary>
    ///<param name="groups"> Sets the arrays based on this param  </param>
    setOtherGroups(groups: IGroup[]) {
    
        //this.otherGroups = [];
        //groups.forEach((item, index) => {
        //    var group = <IGroup>{
        //        Id: item.Id,
        //        Name: item.Name,
        //        OwnerName: item.OwnerName,
        //        Description: item.Description,
        //        Role: item.Role, IsPrivate:
        //        item.IsPrivate, PicturesCount:
        //        item.PicturesCount,
        //        MembersCount: item.MembersCount
        //    };
        //    this.otherGroups.push(group);
        //});

        //setTimeout(() => {
        //    this.$rootScope.$broadcast('sharedPropertiesGroupsChanged');
        //}, 200);

        this.otherGroups = groups;

            this.$rootScope.$broadcast('sharedPropertiesGroupsChanged');
    }

    ///<summary>
    //Pushes the group into otherGroups.
    //Broadcasts message about the change
    ///</summary>
    ///<param name="group"> The group which we want to add </param>
    addOtherGroup(group: IGroup) {
        var group = <IGroup>{
            id: group.id,
            name: group.name,
            ownerName: group.ownerName,
            description: group.description,
            role: group.role,
            isPrivate: group.isPrivate,
            picturesCount: group.picturesCount,
            membersCount: group.membersCount
        };
        this.otherGroups.push(group);

            this.$rootScope.$broadcast('sharedPropertiesGroupsChanged');
    }

    ///<summary>
    ///Pushes the groups into otherGroups.
    ///Broadcasts message about the change
    ///</summary>
    ///<param name="groups"> The groups which we want to add </param>
    addOtherGroups(groups: IGroup[]) {
        groups.forEach((item, index) => {
            var group = <IGroup>{
                id: item.id,
                name: item.name,
                ownerName: item.ownerName,
                description: item.description,
                role: item.role,
                isPrivate: item.isPrivate,
                picturesCount: item.picturesCount,
                membersCount: item.membersCount
            };
            this.otherGroups.push(group);
        });

            this.$rootScope.$broadcast('sharedPropertiesGroupsChanged');
    }

    ///<summary>
    ///Pushes the group into myGroups and adminedGroups, and joins the signalerr group too.
    ///Broadcasts message about the change
    ///Called after creating a new group
    ///</summary>
    ///<param name="newGroup"> The group which we want to add </param>
    createGroup(newGroup: IGroup) {
        var group = <IGroup>{
            id: newGroup.id,
            name: newGroup.name,
            ownerName: newGroup.ownerName,
            description: newGroup.description,
            role: newGroup.role,
            isPrivate: newGroup.isPrivate,
            picturesCount: newGroup.picturesCount,
            membersCount: newGroup.membersCount
        };
        this.myGroups.push(group);
        this.adminedGroups.push(group);

        this.SignalRService.joinToGroup(group.id);

            this.$rootScope.$broadcast('sharedPropertiesGroupsChanged');
    }

    ///<summary>
    ///Removes a group from every of the 3 arrays that it's in
    ///Broadcasts message about the change
    ///</summary>
    ///<param name="groupId"> Specifies the group which we want to remove</param>
    removeGroup(groupId: number) {
        var otherGroupsIndex = -1;
        this.otherGroups.forEach((group, index) => {
            if (group.id == groupId) {
                otherGroupsIndex = index;
            }
        });
        if (otherGroupsIndex > -1) {
            this.otherGroups.splice(otherGroupsIndex, 1);
        }

        var adminedGroupsIndex = -1;
        this.adminedGroups.forEach((group, index) => {
            if (group.id == groupId) {
                adminedGroupsIndex = index;
            }
        });
        if (adminedGroupsIndex > -1) {
            this.adminedGroups.splice(adminedGroupsIndex, 1);
        }

        var myGroupsIndex = -1;
        this.myGroups.forEach((group, index) => {
            if (group.id == groupId) {
                myGroupsIndex = index;
            }
        });
        if (myGroupsIndex > -1) {
            this.myGroups.splice(myGroupsIndex, 1);
            this.SignalRService.leaveGroup(groupId);
        }

            this.$rootScope.$broadcast('sharedPropertiesGroupsChanged');
    }

    getMyGroups() {
        return this.myGroups;
    }

    getAdminedGroups() {
        return this.adminedGroups;
    }

    getOtherGroups() {
        return this.otherGroups;
    }

    ///<summary>
    ///Called when we subscribe to a group,  if the group isn't private it adds the group to  myGroups and deletes it from othergroups
    /// else only sets the membership to pending
    ///Broadcasts message about the change
    ///</summary>
    ///<param name="groupToSubscribe"> Specifies the group which we want to subscibe to</param>
    subscribeToGroup(groupToSubscribe: IGroup) {
        this.otherGroups.forEach((group, index) => {
            if (group.id == groupToSubscribe.id) {
                if (group.isPrivate) {
                    group.role = GroupMembershipRole.Pending;
                }
                else {
                    group.role = GroupMembershipRole.Member;
                    this.addMyGroup(group);

                    var otherGroupsIndex = -1;
                    this.otherGroups.forEach((group, index) => {
                        if (group.id == groupToSubscribe.id) {
                            otherGroupsIndex = index;
                        }
                    });
                    if (otherGroupsIndex > -1) {
                        this.otherGroups.splice(otherGroupsIndex, 1);
                    }

                        this.$rootScope.$broadcast('sharedPropertiesGroupsChanged');
                }
            }
        });
    }

    ///<summary>
    ///Calls removeMyGroup
    ///</summary>
    ///<param name="groupId"> Specifies the group which we want to unsubscibe from</param>
    unsubscribeFromGroup(groupId: number) {
        this.removeMyGroup(groupId);
    }

    changeGroupName(groupId: number, newName: string) {
        this.myGroups.forEach((group, index) => {
            if (group.id == groupId) {
                group.name = newName;
            }
        });

        this.otherGroups.forEach((group, index) => {
            if (group.id == groupId) {
                group.name = newName;
            }
        });

            this.$rootScope.$broadcast('sharedPropertiesGroupsChanged');
    }

    changeGroupDescription(groupId: number, newDescription: string) {
        this.myGroups.forEach((group, index) => {
            if (group.id == groupId) {
                group.description = newDescription;
            }
        });

        this.otherGroups.forEach((group, index) => {
            if (group.id == groupId) {
                group.description = newDescription;
            }
        });

            this.$rootScope.$broadcast('sharedPropertiesGroupsChanged');
    }

    /**
     * Private functions
     */
    addMyGroup(group: IGroup) {
        //var newGroup = <IGroup>{ Id: group.Id, Name: group.Name, OwnerName: group.OwnerName, Description: group.Description, Role: group.Role, IsPrivate: group.IsPrivate, PicturesCount: group.PicturesCount, MembersCount: group.MembersCount };
        this.myGroups.push(group);

        if (group.role == GroupMembershipRole.Owner) {
            this.adminedGroups.push(group);
        }

        this.SignalRService.joinToGroup(group.id);

            this.$rootScope.$broadcast('sharedPropertiesGroupsChanged');
    }

    removeMyGroup(groupId: number) {
        var adminedGroupsIndex = -1;
        this.adminedGroups.forEach((group, index) => {
            if (group.id == groupId) {
                adminedGroupsIndex = index;
            }
        });
        if (adminedGroupsIndex > -1) {
            this.adminedGroups.splice(adminedGroupsIndex, 1);
        }

        var myGroupsIndex = -1;
        this.myGroups.forEach((group, index) => {
            if (group.id == groupId) {
                myGroupsIndex = index;

                group.role = GroupMembershipRole.NotMember;
                this.otherGroups.push(group);
            }
        });
        if (myGroupsIndex > -1) {
            this.myGroups.splice(myGroupsIndex, 1);

            this.SignalRService.leaveGroup(groupId);

                this.$rootScope.$broadcast('sharedPropertiesGroupsChanged');
        }
    }
}