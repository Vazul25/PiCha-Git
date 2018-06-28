///<summary>
///A service which connects the shared properties of the site mostly handles the diffenet group arrays,
///and the functions which must be reached from everywhere 
///</summary>
var SharedProperties = (function () {
    function SharedProperties($window, $rootScope, SignalRService, md5) {
        this.$window = $window;
        this.$rootScope = $rootScope;
        this.SignalRService = SignalRService;
        this.md5 = md5;
        this.serverUrl = "http://localhost:31725/";
        this.requestsCounter = 0; //Counts the pending http requests
        this.imageRequestsCounter = 0; //Counts the pending http gets to api/getimagebyid/{id}
        this.myGroups = []; //csoportok, amiben tag vagyok, Role >= Member
        this.adminedGroups = []; //csoportok amit létrehoztam -> Role >= Admin
        this.otherGroups = []; //minden egyéb csoport -> Role < Member
        this.waitingForResp = false; //disables the buttons while there is a http request pending
    }
    SharedProperties.prototype.getServerUrl = function () {
        return this.serverUrl;
    };
    SharedProperties.prototype.getProfile = function () {
        return this.profile;
    };
    SharedProperties.prototype.getAccessToken = function () {
        return this.profile.accessToken;
    };
    SharedProperties.prototype.getUserEmail = function () {
        return this.profile.email;
    };
    SharedProperties.prototype.getUserName = function () {
        return this.profile.name;
    };
    SharedProperties.prototype.getUserEmailHash = function () {
        return this.profile.emailHash;
    };
    ///<summary>
    ///Changes the username, and stores it in the session storage
    ///</summary>
    ///<param name="newName"> The new name to which we update the old in the session storage</param>
    SharedProperties.prototype.changeUserName = function (newName) {
        this.$window.sessionStorage.setItem('username', newName);
        this.profile.name = newName;
    };
    ///<summary>
    ///Stores the login data in the session storage 
    ///</summary>
    ///<param name="newAccessToken"> Name of the user </param>
    ///<param name="email">Email of the user</param>
    ///<param name="name">  Access token of the user  </param>
    SharedProperties.prototype.login = function (newAccessToken, email, name) {
        this.$window.sessionStorage.setItem('token', newAccessToken);
        this.$window.sessionStorage.setItem('useremail', email);
        this.$window.sessionStorage.setItem('username', name);
        this.profile = {
            accessToken: newAccessToken,
            email: email,
            name: name,
            emailHash: this.md5.createHash(email || '')
        };
    };
    ///<summary>
    ///Resets the session storage on logout
    ///</summary>
    SharedProperties.prototype.logout = function () {
        this.$window.sessionStorage.setItem('token', "");
        this.$window.sessionStorage.setItem('useremail', "");
        this.$window.sessionStorage.setItem('username', "");
        this.profile = undefined;
    };
    ///<summary>
    ///Returns true if the user is loged in and refreshes the user data 
    //if its undefined but there is an access token in the session storage
    ///</summary>
    SharedProperties.prototype.isUserLoggedIn = function () {
        if (this.profile != undefined && this.profile.accessToken != "") {
            return true;
        }
        else if (this.$window.sessionStorage.getItem('token') != null && this.$window.sessionStorage.getItem('token') != "") {
            this.profile = {
                accessToken: this.$window.sessionStorage.getItem('token'),
                email: this.$window.sessionStorage.getItem('useremail'),
                name: this.$window.sessionStorage.getItem('username'),
                emailHash: this.md5.createHash(this.$window.sessionStorage.getItem('useremail') || '')
            };
            return true;
        }
        return false;
    };
    ///<summary>
    ///Increases the requestCounter if the given url is matched by one of the watched requests, sets waitingForResp
    ///</summary>
    ///<param name="url"> The url we try to match to the watched  </param>
    SharedProperties.prototype.increaseRequestsCounter = function (url) {
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
    };
    ///<summary>
    ///Decreses the requestCounter if the given url is matched by one of the watched requests, sets waitingForResp
    ///</summary>
    ///<param name="url"> The url we try to match to the watched  </param>
    SharedProperties.prototype.decreaseRequestsCounter = function (url) {
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
    };
    ///<summary>
    //Sets the   myGroups and admined groups arrays based on the groups array passed as parameter,
    ///and subscribes to the groups in signalerr
    ///Broadcasts message about the change
    ///</summary>
    ///<param name="groups"> Sets the arrays based on this param  </param>
    SharedProperties.prototype.setMyGroups = function (groups) {
        var _this = this;
        this.myGroups = [];
        this.adminedGroups = [];
        var signalrRooms = [];
        //sets the arrays
        groups.forEach(function (item, index) {
            var group = {
                id: item.id,
                name: item.name,
                ownerName: item.ownerName,
                description: item.description,
                role: item.role,
                isPrivate: item.isPrivate,
                picturesCount: item.picturesCount,
                membersCount: item.membersCount
            };
            _this.myGroups.push(group);
            signalrRooms.push(item.id);
            if (group.role >= GroupMembershipRole.Administrator) {
                _this.adminedGroups.push(group);
            }
        });
        //Joins to the signalerr groups
        if (signalrRooms.length > 0) {
            ///Reconects to signalerr if we are not connected
            if (this.SignalRService.getConnectionStatus() == SignalRStatus.Disconnected) {
                this.SignalRService.restartPiChat().done(function () {
                    console.log("SignalR connection restarted!");
                    _this.SignalRService.setConnectionStatus(SignalRStatus.Connected);
                    _this.SignalRService.joinToGroups(signalrRooms);
                }).fail(function () {
                    _this.SignalRService.setConnectionStatus(SignalRStatus.Disconnected);
                    console.error("SignalR error");
                });
            }
            else {
                this.SignalRService.joinToGroups(signalrRooms);
            }
        }
        this.$rootScope.$broadcast('sharedPropertiesGroupsChanged');
    };
    ///<summary>
    ///Sets the   otherGroups array based on the groups array passed as parameter.
    ///Broadcasts message about the change
    ///</summary>
    ///<param name="groups"> Sets the arrays based on this param  </param>
    SharedProperties.prototype.setOtherGroups = function (groups) {
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
    };
    ///<summary>
    //Pushes the group into otherGroups.
    //Broadcasts message about the change
    ///</summary>
    ///<param name="group"> The group which we want to add </param>
    SharedProperties.prototype.addOtherGroup = function (group) {
        var group = {
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
    };
    ///<summary>
    ///Pushes the groups into otherGroups.
    ///Broadcasts message about the change
    ///</summary>
    ///<param name="groups"> The groups which we want to add </param>
    SharedProperties.prototype.addOtherGroups = function (groups) {
        var _this = this;
        groups.forEach(function (item, index) {
            var group = {
                id: item.id,
                name: item.name,
                ownerName: item.ownerName,
                description: item.description,
                role: item.role,
                isPrivate: item.isPrivate,
                picturesCount: item.picturesCount,
                membersCount: item.membersCount
            };
            _this.otherGroups.push(group);
        });
        this.$rootScope.$broadcast('sharedPropertiesGroupsChanged');
    };
    ///<summary>
    ///Pushes the group into myGroups and adminedGroups, and joins the signalerr group too.
    ///Broadcasts message about the change
    ///Called after creating a new group
    ///</summary>
    ///<param name="newGroup"> The group which we want to add </param>
    SharedProperties.prototype.createGroup = function (newGroup) {
        var group = {
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
    };
    ///<summary>
    ///Removes a group from every of the 3 arrays that it's in
    ///Broadcasts message about the change
    ///</summary>
    ///<param name="groupId"> Specifies the group which we want to remove</param>
    SharedProperties.prototype.removeGroup = function (groupId) {
        var otherGroupsIndex = -1;
        this.otherGroups.forEach(function (group, index) {
            if (group.id == groupId) {
                otherGroupsIndex = index;
            }
        });
        if (otherGroupsIndex > -1) {
            this.otherGroups.splice(otherGroupsIndex, 1);
        }
        var adminedGroupsIndex = -1;
        this.adminedGroups.forEach(function (group, index) {
            if (group.id == groupId) {
                adminedGroupsIndex = index;
            }
        });
        if (adminedGroupsIndex > -1) {
            this.adminedGroups.splice(adminedGroupsIndex, 1);
        }
        var myGroupsIndex = -1;
        this.myGroups.forEach(function (group, index) {
            if (group.id == groupId) {
                myGroupsIndex = index;
            }
        });
        if (myGroupsIndex > -1) {
            this.myGroups.splice(myGroupsIndex, 1);
            this.SignalRService.leaveGroup(groupId);
        }
        this.$rootScope.$broadcast('sharedPropertiesGroupsChanged');
    };
    SharedProperties.prototype.getMyGroups = function () {
        return this.myGroups;
    };
    SharedProperties.prototype.getAdminedGroups = function () {
        return this.adminedGroups;
    };
    SharedProperties.prototype.getOtherGroups = function () {
        return this.otherGroups;
    };
    ///<summary>
    ///Called when we subscribe to a group,  if the group isn't private it adds the group to  myGroups and deletes it from othergroups
    /// else only sets the membership to pending
    ///Broadcasts message about the change
    ///</summary>
    ///<param name="groupToSubscribe"> Specifies the group which we want to subscibe to</param>
    SharedProperties.prototype.subscribeToGroup = function (groupToSubscribe) {
        var _this = this;
        this.otherGroups.forEach(function (group, index) {
            if (group.id == groupToSubscribe.id) {
                if (group.isPrivate) {
                    group.role = GroupMembershipRole.Pending;
                }
                else {
                    group.role = GroupMembershipRole.Member;
                    _this.addMyGroup(group);
                    var otherGroupsIndex = -1;
                    _this.otherGroups.forEach(function (group, index) {
                        if (group.id == groupToSubscribe.id) {
                            otherGroupsIndex = index;
                        }
                    });
                    if (otherGroupsIndex > -1) {
                        _this.otherGroups.splice(otherGroupsIndex, 1);
                    }
                    _this.$rootScope.$broadcast('sharedPropertiesGroupsChanged');
                }
            }
        });
    };
    ///<summary>
    ///Calls removeMyGroup
    ///</summary>
    ///<param name="groupId"> Specifies the group which we want to unsubscibe from</param>
    SharedProperties.prototype.unsubscribeFromGroup = function (groupId) {
        this.removeMyGroup(groupId);
    };
    SharedProperties.prototype.changeGroupName = function (groupId, newName) {
        this.myGroups.forEach(function (group, index) {
            if (group.id == groupId) {
                group.name = newName;
            }
        });
        this.otherGroups.forEach(function (group, index) {
            if (group.id == groupId) {
                group.name = newName;
            }
        });
        this.$rootScope.$broadcast('sharedPropertiesGroupsChanged');
    };
    SharedProperties.prototype.changeGroupDescription = function (groupId, newDescription) {
        this.myGroups.forEach(function (group, index) {
            if (group.id == groupId) {
                group.description = newDescription;
            }
        });
        this.otherGroups.forEach(function (group, index) {
            if (group.id == groupId) {
                group.description = newDescription;
            }
        });
        this.$rootScope.$broadcast('sharedPropertiesGroupsChanged');
    };
    /**
     * Private functions
     */
    SharedProperties.prototype.addMyGroup = function (group) {
        //var newGroup = <IGroup>{ Id: group.Id, Name: group.Name, OwnerName: group.OwnerName, Description: group.Description, Role: group.Role, IsPrivate: group.IsPrivate, PicturesCount: group.PicturesCount, MembersCount: group.MembersCount };
        this.myGroups.push(group);
        if (group.role == GroupMembershipRole.Owner) {
            this.adminedGroups.push(group);
        }
        this.SignalRService.joinToGroup(group.id);
        this.$rootScope.$broadcast('sharedPropertiesGroupsChanged');
    };
    SharedProperties.prototype.removeMyGroup = function (groupId) {
        var _this = this;
        var adminedGroupsIndex = -1;
        this.adminedGroups.forEach(function (group, index) {
            if (group.id == groupId) {
                adminedGroupsIndex = index;
            }
        });
        if (adminedGroupsIndex > -1) {
            this.adminedGroups.splice(adminedGroupsIndex, 1);
        }
        var myGroupsIndex = -1;
        this.myGroups.forEach(function (group, index) {
            if (group.id == groupId) {
                myGroupsIndex = index;
                group.role = GroupMembershipRole.NotMember;
                _this.otherGroups.push(group);
            }
        });
        if (myGroupsIndex > -1) {
            this.myGroups.splice(myGroupsIndex, 1);
            this.SignalRService.leaveGroup(groupId);
            this.$rootScope.$broadcast('sharedPropertiesGroupsChanged');
        }
    };
    SharedProperties.$inject = ["$window", "$rootScope", "SignalRService", "md5"];
    return SharedProperties;
})();
//# sourceMappingURL=SharedProperties.js.map