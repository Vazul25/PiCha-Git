///<summary>
///A service which can pop up general 
///or specialized dialog windows 
///</summary>
class PopupDialogService implements IPopupDialogService {
    static $inject = ["$mdDialog", "$window", "$translate"];
    constructor(
        private $mdDialog: ng.material.IDialogService,
        private $window: ng.IWindowService,
        private $translate: angular.translate.ITranslateService) {
    }

    ///<summary>
    ///Shows a generic popup window, with the content and title passed as parameters
    ///</summary>   
    ///<param name="text">Specifies the text content of the popup window <param>
    ///<param name="title">Specifies the title of the popup window<param>
    showErrorAlert(text: string, title: string) {

        return this.$mdDialog.show(
            this.$mdDialog.alert()
                .parent(angular.element(document.querySelector('body')))
                .clickOutsideToClose(true)
                .title(title)
                .textContent(text)
                .ariaLabel(this.$translate.instant('err'))
                .ok(this.$translate.instant('ok1'))
        );
    }

    ///<summary>
    ///Shows a specialized popup window for creating groups,
    ///uses GroupCreateDialog controller and GroupCreateDialog View
    ///</summary>   
    ///<param name="event">Specifies the target event <param>
    showCreateGroupDialog(event: MouseEvent): ng.IPromise<ICreateGroupDialogModel> {
        return this.$mdDialog.show(<ng.material.IDialogOptions>{
            controller: GroupCreateDialogController,
            controllerAs: 'groupCreateDialogCtrl',
            templateUrl: '/View/GroupCreateDialog',
            parent: angular.element(document.body),
            targetEvent: event,
            bindToController: true,
            clickOutsideToClose: true
        });
    }
    
    ///<summary>
    ///Shows a specialized popup window for changing user's password,
    ///uses ProfileChangePasswordDialogController controller
    ///and ProfileChangePasswordDialog View
    ///</summary>   
    ///<param name="event">Specifies the target event <param>
    showChangePasswordDialog = (event: MouseEvent): ng.IPromise<IChangePasswordDialogModel> => {
        return this.$mdDialog.show(<ng.material.IDialogOptions>{
            controller: ProfileChangePasswordDialogController,
            controllerAs: 'profileChangePasswordDialogCtrl',
            templateUrl: '/View/ProfileChangePasswordDialog',
            parent: angular.element(document.body),
            targetEvent: event,
            bindToController: true,
            clickOutsideToClose: true
        });
    }
    
    ///<summary>
    ///Shows a specialized popup window for deleting groups 
    ///</summary>   
    ///<param name="event">Specifies the target event <param>
    
    //unnecesary, could be done with showConfirmDialog, but makes code more readable elsewhere --vazul
    showDeleteGroupDialog = (event: MouseEvent): ng.IPromise<any> => {
        var confirm = this.$mdDialog.confirm()
            .title(this.$translate.instant('que1'))
            .textContent(this.$translate.instant('que6'))
            .ariaLabel(this.$translate.instant('que7'))
            .targetEvent(event)
            .ok(this.$translate.instant('que4'))
            .cancel(this.$translate.instant('que5'));
        return this.$mdDialog.show(confirm);
    }
    
    ///<summary>
    ///Shows a generic confirm popup window, with the content and title passed as parameters  
    ///</summary>   
    ///<param name="content">Specifies the text content of the popup window <param>
    ///<param name="title">Specifies the title of the popup window<param>
    ///<param name="targetEvent">Specifies the target event <param>
    showConfirmDialog(title: string, content: string, targetEvent: MouseEvent) {
        return this.$mdDialog.show(this.$mdDialog.confirm()
            .title(title)
            .textContent(content)
            .targetEvent(targetEvent)
            .ok(this.$translate.instant('que4'))
            .cancel(this.$translate.instant('que5')));
    }
    
    ///<summary>
    ///Shows a specialized popup window for changing the name of the user,
    ///uses ProfileChangeNameDialogController controller 
    ///and ProfileChangeNameDialog View
    ///</summary>   
    ///<param name="event">Specifies the target event <param>
    showChangeNameDialog = (event: MouseEvent): ng.IPromise<string> => {
        return this.$mdDialog.show(<ng.material.IDialogOptions>{
            controller: ProfileChangeNameDialogController,
            controllerAs: 'profileChangeNameDialogCtrl',
            templateUrl: '/View/ProfileChangeNameDialog',
            parent: angular.element(document.body),
            targetEvent: event,
            bindToController: true,
            clickOutsideToClose: true
        });
    }
    
    ///<summary>
    ///Shows a specialized popup window for changing the name of a group,
    ///uses GroupChangeNameDialogController controller 
    ///and GroupChangeNameDialog View
    ///</summary>   
    ///<param name="event">Specifies the target event <param>
    showRenameGroupDialog = (event: MouseEvent): ng.IPromise<string>=> {
        return this.$mdDialog.show(<ng.material.IDialogOptions>{
            controller: GroupChangeNameDialogController,
            controllerAs: 'groupChangeNameDialogCtrl',
            templateUrl: '/View/GroupChangeNameDialog',
            parent: angular.element(document.body),
            targetEvent: event,
            bindToController: true,
            clickOutsideToClose: true
        });
    }
    
    ///<summary>
    ///Shows a specialized popup window for changing the description of a group,
    ///uses GroupChangeDescriptionDialogController controller 
    ///and GroupChangeDescriptionDialog View
    ///</summary>   
    ///<param name="event">Specifies the target event <param>
    showChangeGroupDescriptionDialog = (event: MouseEvent): ng.IPromise<string>=> {
        return this.$mdDialog.show(<ng.material.IDialogOptions>{
            controller: GroupChangeDescriptionDialogController,
            controllerAs: 'groupChangeDescriptionDialogCtrl',
            templateUrl: '/View/GroupChangeDescriptionDialog',
            parent: angular.element(document.body),
            targetEvent: event,
            bindToController: true,
            clickOutsideToClose: true
        });
    }
    
    ///<summary>
    ///Shows a specialized popup window for listing the members of a group,
    ///uses MemberListController controller and GroupMemberList View
    ///</summary>   
    ///<param name="event">Specifies the target event <param>
    showMemberListDialog = (event: MouseEvent, group: IGroup): ng.IPromise<any>=> {
        return this.$mdDialog.show(<ng.material.IDialogOptions>{
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
    }
    
    ///<summary>
    ///Shows a specialized popup window for changing the description of an image,
    ///uses ImageChangeDescriptionDialogController controller
    ///and ImageChangeDescriptionDialog View
    ///</summary>   
    ///<param name="event">Specifies the target event <param>
    showChangeImageDescriptionDialog(event: MouseEvent, useFullScreen: boolean = false) {

        return this.$mdDialog.show(<ng.material.IDialogOptions>{
            controller: ImageChangeDescriptionDialogController,
            controllerAs: 'imageChangeDescriptionDialogCtrl',
            templateUrl: '/View/ImageChangeDescriptionDialog',
            parent: angular.element(document.body),
            targetEvent: event,
            bindToController: true,
            clickOutsideToClose: true,
            fullscreen: useFullScreen
        })
    }
}