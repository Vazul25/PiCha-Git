///<summary>
///Interface for the profile model
///</summary>
interface IProfile {
    accessToken: string,
    email: string,
    name: string,
    emailHash: string
}

///<summary>
///Interface for the profile service
///</summary>
interface IProfileService {
    getUserData: () => ng.IHttpPromise<IProfile>;
    changePassword: (oldPassword: string, newPassword: string, newPasswordConfirm: string) => ng.IHttpPromise<any>;
    changeName: (newName: string) => ng.IHttpPromise<any>;
}