///<summary>
///A service which can pop up general 
///or specialized dialog windows 
///</summary>
var PopupDialogService = (function () {
    function PopupDialogService($mdDialog, $window, $translate) {
        var _this = this;
        this.$mdDialog = $mdDialog;
        this.$window = $window;
        this.$translate = $translate;
        ///<summary>
        ///Shows a specialized popup window for changing user's password,
        ///uses ProfileChangePasswordDialogController controller
        ///and ProfileChangePasswordDialog View
        ///</summary>   
        ///<param name="event">Specifies the target event <param>
        this.showChangePasswordDialog = function (event) {
            return _this.$mdDialog.show({
                controller: ProfileChangePasswordDialogController,
                controllerAs: 'profileChangePasswordDialogCtrl',
                templateUrl: '/View/ProfileChangePasswordDialog',
                parent: angular.element(document.body),
                targetEvent: event,
                bindToController: true,
                clickOutsideToClose: true
            });
        };
        ///<summary>
        ///Shows a specialized popup window for deleting groups 
        ///</summary>   
        ///<param name="event">Specifies the target event <param>
        //unnecesary, could be done with showConfirmDialog, but makes code more readable elsewhere --vazul
        this.showDeleteGroupDialog = function (event) {
            var confirm = _this.$mdDialog.confirm()
                .title(_this.$translate.instant('que1'))
                .textContent(_this.$translate.instant('que6'))
                .ariaLabel(_this.$translate.instant('que7'))
                .targetEvent(event)
                .ok(_this.$translate.instant('que4'))
                .cancel(_this.$translate.instant('que5'));
            return _this.$mdDialog.show(confirm);
        };
        ///<summary>
        ///Shows a specialized popup window for changing the name of the user,
        ///uses ProfileChangeNameDialogController controller 
        ///and ProfileChangeNameDialog View
        ///</summary>   
        ///<param name="event">Specifies the target event <param>
        this.showChangeNameDialog = function (event) {
            return _this.$mdDialog.show({
                controller: ProfileChangeNameDialogController,
                controllerAs: 'profileChangeNameDialogCtrl',
                templateUrl: '/View/ProfileChangeNameDialog',
                parent: angular.element(document.body),
                targetEvent: event,
                bindToController: true,
                clickOutsideToClose: true
            });
        };
        ///<summary>
        ///Shows a specialized popup window for changing the name of a group,
        ///uses GroupChangeNameDialogController controller 
        ///and GroupChangeNameDialog View
        ///</summary>   
        ///<param name="event">Specifies the target event <param>
        this.showRenameGroupDialog = function (event) {
            return _this.$mdDialog.show({
                controller: GroupChangeNameDialogController,
                controllerAs: 'groupChangeNameDialogCtrl',
                templateUrl: '/View/GroupChangeNameDialog',
                parent: angular.element(document.body),
                targetEvent: event,
                bindToController: true,
                clickOutsideToClose: true
            });
        };
        ///<summary>
        ///Shows a specialized popup window for changing the description of a group,
        ///uses GroupChangeDescriptionDialogController controller 
        ///and GroupChangeDescriptionDialog View
        ///</summary>   
        ///<param name="event">Specifies the target event <param>
        this.showChangeGroupDescriptionDialog = function (event) {
            return _this.$mdDialog.show({
                controller: GroupChangeDescriptionDialogController,
                controllerAs: 'groupChangeDescriptionDialogCtrl',
                templateUrl: '/View/GroupChangeDescriptionDialog',
                parent: angular.element(document.body),
                targetEvent: event,
                bindToController: true,
                clickOutsideToClose: true
            });
        };
        ///<summary>
        ///Shows a specialized popup window for listing the members of a group,
        ///uses MemberListController controller and GroupMemberList View
        ///</summary>   
        ///<param name="event">Specifies the target event <param>
        this.showMemberListDialog = function (event, group) {
            return _this.$mdDialog.show({
                controller: MemberListController,
                controllerAs: 'GroupMemberListCtlr',
                templateUrl: '/View/GroupMemberList',
                parent: angular.element(document.body),
                targetEvent: event,
                bindToController: true,
                clickOutsideToClose: true,
                locals: {
                    group: group
                }
            });
        };
    }
    ///<summary>
    ///Shows a generic popup window, with the content and title passed as parameters
    ///</summary>   
    ///<param name="text">Specifies the text content of the popup window <param>
    ///<param name="title">Specifies the title of the popup window<param>
    PopupDialogService.prototype.showErrorAlert = function (text, title) {
        return this.$mdDialog.show(this.$mdDialog.alert()
            .parent(angular.element(document.querySelector('body')))
            .clickOutsideToClose(true)
            .title(title)
            .textContent(text)
            .ariaLabel(this.$translate.instant('err'))
            .ok(this.$translate.instant('ok1')));
    };
    ///<summary>
    ///Shows a specialized popup window for creating groups,
    ///uses GroupCreateDialog controller and GroupCreateDialog View
    ///</summary>   
    ///<param name="event">Specifies the target event <param>
    PopupDialogService.prototype.showCreateGroupDialog = function (event) {
        return this.$mdDialog.show({
            controller: GroupCreateDialogController,
            controllerAs: 'groupCreateDialogCtrl',
            templateUrl: '/View/GroupCreateDialog',
            parent: angular.element(document.body),
            targetEvent: event,
            bindToController: true,
            clickOutsideToClose: true
        });
    };
    ///<summary>
    ///Shows a generic confirm popup window, with the content and title passed as parameters  
    ///</summary>   
    ///<param name="content">Specifies the text content of the popup window <param>
    ///<param name="title">Specifies the title of the popup window<param>
    ///<param name="targetEvent">Specifies the target event <param>
    PopupDialogService.prototype.showConfirmDialog = function (title, content, targetEvent) {
        return this.$mdDialog.show(this.$mdDialog.confirm()
            .title(title)
            .textContent(content)
            .targetEvent(targetEvent)
            .ok(this.$translate.instant('que4'))
            .cancel(this.$translate.instant('que5')));
    };
    ///<summary>
    ///Shows a specialized popup window for changing the description of an image,
    ///uses ImageChangeDescriptionDialogController controller
    ///and ImageChangeDescriptionDialog View
    ///</summary>   
    ///<param name="event">Specifies the target event <param>
    PopupDialogService.prototype.showChangeImageDescriptionDialog = function (event, useFullScreen) {
        if (useFullScreen === void 0) { useFullScreen = false; }
        return this.$mdDialog.show({
            controller: ImageChangeDescriptionDialogController,
            controllerAs: 'imageChangeDescriptionDialogCtrl',
            templateUrl: '/View/ImageChangeDescriptionDialog',
            parent: angular.element(document.body),
            targetEvent: event,
            bindToController: true,
            clickOutsideToClose: true,
            fullscreen: useFullScreen
        });
    };
    PopupDialogService.$inject = ["$mdDialog", "$window", "$translate"];
    return PopupDialogService;
})();
//# sourceMappingURL=PopupDialogService.js.map