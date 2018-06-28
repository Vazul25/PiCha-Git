/// <reference path="../../typings/jquery/jquery.d.ts" />

///<summary>
///Handles the display and data concerning the users profile
///</summary>
class ProfileController {
    adminedGroups: IGroup[];//Groups that the user owns
    profile: IProfile;//The user's profile data
    requests: IMembership[];//The join request to groups which can be granted or declined by the user

    static $inject = ["$scope", "$rootScope", "SharedProperties", "ProfileService", "GroupService", "SignalRService", "MembershipService", "PopupDialogService", "$translate"]
    constructor(private $scope: ng.IScope,
        private $rootScope: ng.IRootScopeService,
        private SharedProperties: ISharedProperties,
        private ProfileService: IProfileService,
        private GroupService: IGroupService,
        private SignalRService: ISignalRService,
        private MembershipService: IMembershipService,
        private PopupDialogService: IPopupDialogService,
        private $translate: angular.translate.ITranslateService
    ) {

        $rootScope.$on('sharedPropertiesGroupsChanged', (event, args) => {
            this.adminedGroups = SharedProperties.getAdminedGroups();
        });
    }

    ///<summary>
    ///Initializes the data trough services 
    ///</summary>
    $onInit = () => {
        this.profile = this.SharedProperties.getProfile();
        this.adminedGroups = this.SharedProperties.getAdminedGroups();
        this.MembershipService.getRequests().then(resp => this.requests = resp.data);
    }

    ///<summary>
    ///Shows a popup window for changing the name of the user trough PopupDialogService
    ///</summary>   
    ///<param name="event">Specifies the target event <param>
    showChangeNameDialog = (event: MouseEvent) => {
        this.PopupDialogService.showChangeNameDialog(event).then((newName: string) => {
            this.ProfileService.changeName(newName).then(() => {
                this.SharedProperties.changeUserName(newName);
            }, (error) => {
                this.PopupDialogService.showErrorAlert(this.$translate.instant('msg11'), this.$translate.instant('err6'))
            });
        });
    }

    ///<summary>
    ///Shows a popup window for changing the password of the user trough PopupDialogService
    ///</summary>   
    ///<param name="event">Specifies the target event <param>
    showChangePasswordDialog = (event: MouseEvent) => {
        this.PopupDialogService.showChangePasswordDialog(event).then((result) => {
            this.ProfileService.changePassword(result.oldPassword, result.newPassword, result.newPasswordConfirm).then((result) => {
            }, (error) => {
                this.PopupDialogService.showErrorAlert(this.$translate.instant('msg10') + ": " + error.data.Message, this.$translate.instant('err6'));

            });
        });
    }

    ///<summary>
    ///Gets the joinRequest from the server  trough MembershipService
    ///</summary> 
    getRequests = () => {
        this.MembershipService.getRequests().then(resp => this.requests = resp.data);
    }

    ///<summary>
    ///Starts a http post to grant member role to the user who made the request trough MembershipService
    ///</summary> 
    ///<param name="membershipId">Specifies a membership which role will be set to member <param>
    acceptRequest = (membershipId: number) => {
        this.MembershipService.acceptRequests(membershipId).then(
            resp => {
                var index = this.MembershipService.getIndexInMemberships(this.requests, membershipId);
                this.requests.splice(index, 1);
            }, err => {
                this.PopupDialogService.showErrorAlert(this.$translate.instant('err3'), this.$translate.instant('err6'));
            })
    }

    ///<summary>
    ///Starts a http call to delete a membership where the role of the user who made the request is pending trough MembershipService
    ///</summary> 
    ///<param name="membershipId">Specifies a membership which will be deleted<param>
    rejectRequest = (membershipId: number) => {
        this.MembershipService.rejectRequests(membershipId).then(
            resp => {
                var index = this.MembershipService.getIndexInMemberships(this.requests, membershipId);
                this.requests.splice(index, 1);
            }, err => {
                this.PopupDialogService.showErrorAlert(this.$translate.instant('err4'), this.$translate.instant('err6'));

            })
    }

    ///<summary>
    ///Shows a popup window for creating a group trough PopupDialogService
    ///</summary>   
    ///<param name="event">Specifies the target event <param>
    showCreateGroupDialog = (event: MouseEvent) => {
        this.PopupDialogService.showCreateGroupDialog(event).then((result) => {
            this.GroupService.createGroup(result.groupName, result.isPrivate).then(resp => {
                this.SharedProperties.createGroup(resp.data);
                this.SignalRService.sendNewGroupToOthers(resp.data);
            },
                (err) => {
                    this.PopupDialogService.showErrorAlert(this.$translate.instant('msg9'), this.$translate.instant('err6'));
                });
        });
    }

    ///<summary>
    ///Shows a popup window for deleting a group trough PopupDialogService
    ///</summary>   
    ///<param name="event">Specifies the target event <param>
    ///<param name="group">Specifies the group which the user wants to delete <param>
    showDeleteGroupDialog(event: MouseEvent, group: IGroup) {
        this.PopupDialogService.showDeleteGroupDialog(event).then(() => {
            this.GroupService.deleteGroup(group.id).then(resp => {
            }, (err) => {
                this.PopupDialogService.showErrorAlert(this.$translate.instant('err5'), this.$translate.instant('err6'));
            });
        });
    }

    ///<summary>
    ///Shows a popup window for renaming a group trough PopupDialogService
    ///</summary>   
    ///<param name="event">Specifies the target event <param>
    ///<param name="groupId">Specifies the group which the user wants to rename <param>
    showRenameGroupDialog(event: MouseEvent, groupId: number) {
        this.PopupDialogService.showRenameGroupDialog(event).then((newName: string) => {
            this.GroupService.renameGroup(groupId, newName).then(null, (err) => {
                this.PopupDialogService.showErrorAlert(this.$translate.instant('msg8'), this.$translate.instant('err6'));
            })
        });
    }

    //<summary>
    ///Shows a popup window for changing the description of a group trough PopupDialogService
    ///</summary>   
    ///<param name="event">Specifies the target event <param>
    ///<param name="groupId">Specifies the group that the user wants to change description of  <param>
    showChangeDescriptionDialog(event: MouseEvent, groupId: number) {
        this.PopupDialogService.showChangeGroupDescriptionDialog(event).then((newDescription: string) => {
            this.GroupService.changeDescription(groupId, newDescription);
        });
    }
}