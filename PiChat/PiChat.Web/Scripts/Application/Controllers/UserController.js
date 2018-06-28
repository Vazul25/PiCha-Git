/// <reference path="../../typings/jquery/jquery.d.ts" />
var UserController = (function () {
    function UserController($scope, $http, $rootRouter, SharedProperties, SignalRService) {
        this.$http = $http;
        this.$rootRouter = $rootRouter;
        this.SharedProperties = SharedProperties;
        this.SignalRService = SignalRService;
        this.userEmail = "testuser1@pichat.hu";
        this.password = "Password1";
    }
    UserController.prototype.login = function () {
        var _this = this;
        this.$http({
            method: 'POST',
            url: this.SharedProperties.getServerUrl() + "Token",
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
            data: "grant_type=password&username=" + this.userEmail + "&password=" + this.password
        }).success(function (data, status, headers, config) {
            _this.SharedProperties.login(data.access_token, data.userName);
            _this.$rootRouter.navigate(['Home']);
        }).error(function (data, status, header, config) {
            console.error("UserController login() error: ", data);
        });
    };
    UserController.$inject = ["$scope", "$http", "$rootRouter", "SharedProperties", "SignalRService"];
    return UserController;
})();
//# sourceMappingURL=UserController.js.map