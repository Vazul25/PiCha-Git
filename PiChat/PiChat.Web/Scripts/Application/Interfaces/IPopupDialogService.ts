///<summary>
///Interface for the popupdialog service
///</summary>
interface IPopupDialogService {
    showErrorAlert: (text: string, title: string) => ng.IPromise<any>;
    showCreateGroupDialog: (event: MouseEvent) => ng.IPromise<ICreateGroupDialogModel>;
    showChangePasswordDialog: (event: MouseEvent) => ng.IPromise<IChangePasswordDialogModel>;
    showDeleteGroupDialog: (event: MouseEvent) => ng.IPromise<any>;
    showChangeNameDialog: (event: MouseEvent) => ng.IPromise<string>;
    showRenameGroupDialog: (event: MouseEvent) => ng.IPromise<string>;
    showChangeGroupDescriptionDialog: (event: MouseEvent) => ng.IPromise<string>;
    showMemberListDialog: (event: MouseEvent, group: IGroup) => ng.IPromise<any>;
    showConfirmDialog: (title: string, content: string, targetEvent: MouseEvent) => ng.IPromise<any>;
    showChangeImageDescriptionDialog: (event: MouseEvent, useFullScreen: boolean) => ng.IPromise<string>;
}

///<summary>
///Interface for the create group dialog's model 
///</summary>
interface ICreateGroupDialogModel {
    groupName: string;
    isPrivate: boolean;
}

///<summary>
///Interface for the change password dialog's model 
///</summary>
interface IChangePasswordDialogModel {
    oldPassword: string;
    newPassword: string;
    newPasswordConfirm: string;
}