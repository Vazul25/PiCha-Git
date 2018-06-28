///<summary>
///A service which handles http calls concerning the profile
///</summary>
var ProfileService = (function () {
    function ProfileService($http, $q) {
        this.$http = $http;
        this.$q = $q;
    }
    ///<summary>
    //Gets the user data, trough a http get
    ///</summary>
    ProfileService.prototype.getUserData = function () {
        return this.$http.get("api/Account/GetUserData");
    };
    ///<summary>
    ///Changes the user's password trough a http post.
    ///</summary>
    ///<param name="oldPassword">The current password of the user</param>
    ///<param name="newPassword">The new password of the user 
    ////                         to which we want to change the old< /param>
    ///<param name="newPasswordConfirm">Confirmation password for the newPassword, they must match</param>
    ProfileService.prototype.changePassword = function (oldPassword, newPassword, newPasswordConfirm) {
        return this.$http.post("api/Account/ChangePassword", { oldPassword: oldPassword, newPassword: newPassword, newPasswordConfirm: newPasswordConfirm });
    };
    ///<summary>
    ///Changes the user's name trough a http post.
    ///</summary>
    ///<param name="newName">The new name which we want to change the old to</param>
    ProfileService.prototype.changeName = function (newName) {
        return this.$http.post("api/Account/ChangeName", { newName: newName });
    };
    ProfileService.$inject = ["$http", "$q"];
    return ProfileService;
})();
//# sourceMappingURL=ProfileService.js.map