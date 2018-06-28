var SharedProperties = (function () {
    function SharedProperties($window) {
        this.$window = $window;
        this.serverUrl = "http://localhost:31725/";
        this.accessToken = "";
        this.currentUserName = "";
    }
    SharedProperties.prototype.getServerUrl = function () {
        return this.serverUrl;
    };
    SharedProperties.prototype.getAccessToken = function () {
        return this.accessToken;
    };
    SharedProperties.prototype.getCurrentUserName = function () {
        return this.currentUserName;
    };
    SharedProperties.prototype.login = function (newAccessToken, userName) {
        this.$window.localStorage.setItem('token', newAccessToken);
        this.accessToken = newAccessToken;
        this.currentUserName = userName;
    };
    SharedProperties.prototype.logout = function () {
        this.$window.localStorage.setItem('token', "");
        this.accessToken = "";
        this.currentUserName = "";
        console.log(this.$window.localStorage.getItem('token'));
    };
    SharedProperties.$inject = ["$window"];
    return SharedProperties;
})();
//# sourceMappingURL=SharedProperties.js.map