/// <reference path="../../typings/jquery/jquery.d.ts" />
///<summary>
///Handles the display and data concerning the users profile
///</summary>
var ProfileController = (function () {
    function ProfileController($scope, $rootScope, SharedProperties, ProfileService, GroupService, SignalRService, MembershipService, PopupDialogService, $translate) {
        var _this = this;
        this.$scope = $scope;
        this.$rootScope = $rootScope;
        this.SharedProperties = SharedProperties;
        this.ProfileService = ProfileService;
        this.GroupService = GroupService;
        this.SignalRService = SignalRService;
        this.MembershipService = MembershipService;
        this.PopupDialogService = PopupDialogService;
        this.$translate = $translate;
        ///<summary>
        ///Initializes the data trough services 
        ///</summary>
        this.$onInit = function () {
            _this.profile = _this.SharedProperties.getProfile();
            _this.adminedGroups = _this.SharedProperties.getAdminedGroups();
            _this.MembershipService.getRequests().then(function (resp) { return _this.requests = resp.data; });
        };
        ///<summary>
        ///Shows a popup window for changing the name of the user trough PopupDialogService
        ///</summary>   
        ///<param name="event">Specifies the target event <param>
        this.showChangeNameDialog = function (event) {
            _this.PopupDialogService.showChangeNameDialog(event).then(function (newName) {
                _this.ProfileService.changeName(newName).then(function () {
                    _this.SharedProperties.changeUserName(newName);
                }, function (error) {
                    _this.PopupDialogService.showErrorAlert(_this.$translate.instant('msg11'), _this.$translate.instant('err6'));
                });
            });
        };
        ///<summary>
        ///Shows a popup window for changing the password of the user trough PopupDialogService
        ///</summary>   
        ///<param name="event">Specifies the target event <param>
        this.showChangePasswordDialog = function (event) {
            _this.PopupDialogService.showChangePasswordDialog(event).then(function (result) {
                _this.ProfileService.changePassword(result.oldPassword, result.newPassword, result.newPasswordConfirm).then(function (result) {
                }, function (error) {
                    _this.PopupDialogService.showErrorAlert(_this.$translate.instant('msg10') + ": " + error.data.Message, _this.$translate.instant('err6'));
                });
            });
        };
        ///<summary>
        ///Gets the joinRequest from the server  trough MembershipService
        ///</summary> 
        this.getRequests = function () {
            _this.MembershipService.getRequests().then(function (resp) { return _this.requests = resp.data; });
        };
        ///<summary>
        ///Starts a http post to grant member role to the user who made the request trough MembershipService
        ///</summary> 
        ///<param name="membershipId">Specifies a membership which role will be set to member <param>
        this.acceptRequest = function (membershipId) {
            _this.MembershipService.acceptRequests(membershipId).then(function (resp) {
                var index = _this.MembershipService.getIndexInMemberships(_this.requests, membershipId);
                _this.requests.splice(index, 1);
            }, function (err) {
                _this.PopupDialogService.showErrorAlert(_this.$translate.instant('err3'), _this.$translate.instant('err6'));
            });
        };
        ///<summary>
        ///Starts a http call to delete a membership where the role of the user who made the request is pending trough MembershipService
        ///</summary> 
        ///<param name="membershipId">Specifies a membership which will be deleted<param>
        this.rejectRequest = function (membershipId) {
            _this.MembershipService.rejectRequests(membershipId).then(function (resp) {
                var index = _this.MembershipService.getIndexInMemberships(_this.requests, membershipId);
                _this.requests.splice(index, 1);
            }, function (err) {
                _this.PopupDialogService.showErrorAlert(_this.$translate.instant('err4'), _this.$translate.instant('err6'));
            });
        };
        ///<summary>
        ///Shows a popup window for creating a group trough PopupDialogService
        ///</summary>   
        ///<param name="event">Specifies the target event <param>
        this.showCreateGroupDialog = function (event) {
            _this.PopupDialogService.showCreateGroupDialog(event).then(function (result) {
                _this.GroupService.createGroup(result.groupName, result.isPrivate).then(function (resp) {
                    _this.SharedProperties.createGroup(resp.data);
                    _this.SignalRService.sendNewGroupToOthers(resp.data);
                }, function (err) {
                    _this.PopupDialogService.showErrorAlert(_this.$translate.instant('msg9'), _this.$translate.instant('err6'));
                });
            });
        };
        $rootScope.$on('sharedPropertiesGroupsChanged', function (event, args) {
            _this.adminedGroups = SharedProperties.getAdminedGroups();
        });
    }
    ///<summary>
    ///Shows a popup window for deleting a group trough PopupDialogService
    ///</summary>   
    ///<param name="event">Specifies the target event <param>
    ///<param name="group">Specifies the group which the user wants to delete <param>
    ProfileController.prototype.showDeleteGroupDialog = function (event, group) {
        var _this = this;
        this.PopupDialogService.showDeleteGroupDialog(event).then(function () {
            _this.GroupService.deleteGroup(group.id).then(function (resp) {
            }, function (err) {
                _this.PopupDialogService.showErrorAlert(_this.$translate.instant('err5'), _this.$translate.instant('err6'));
            });
        });
    };
    ///<summary>
    ///Shows a popup window for renaming a group trough PopupDialogService
    ///</summary>   
    ///<param name="event">Specifies the target event <param>
    ///<param name="groupId">Specifies the group which the user wants to rename <param>
    ProfileController.prototype.showRenameGroupDialog = function (event, groupId) {
        var _this = this;
        this.PopupDialogService.showRenameGroupDialog(event).then(function (newName) {
            _this.GroupService.renameGroup(groupId, newName).then(null, function (err) {
                _this.PopupDialogService.showErrorAlert(_this.$translate.instant('msg8'), _this.$translate.instant('err6'));
            });
        });
    };
    //<summary>
    ///Shows a popup window for changing the description of a group trough PopupDialogService
    ///</summary>   
    ///<param name="event">Specifies the target event <param>
    ///<param name="groupId">Specifies the group that the user wants to change description of  <param>
    ProfileController.prototype.showChangeDescriptionDialog = function (event, groupId) {
        var _this = this;
        this.PopupDialogService.showChangeGroupDescriptionDialog(event).then(function (newDescription) {
            _this.GroupService.changeDescription(groupId, newDescription);
        });
    };
    ProfileController.$inject = ["$scope", "$rootScope", "SharedProperties", "ProfileService", "GroupService", "SignalRService", "MembershipService", "PopupDialogService", "$translate"];
    return ProfileController;
})();
//# sourceMappingURL=ProfileController.js.map