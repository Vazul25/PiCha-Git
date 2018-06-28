var HttpInterceptorFactory = (function () {
    function HttpInterceptorFactory($window, $q, SharedProperties) {
        var _this = this;
        this.$window = $window;
        this.$q = $q;
        this.SharedProperties = SharedProperties;
        this.request = function (config) {
            var requestUrl = config.url;
            _this.SharedProperties.increaseRequestsCounter(requestUrl);
            config.headers = config.headers || {};
            if (_this.$window.sessionStorage.getItem('token')) {
                config.headers["Authorization"] = 'Bearer ' + _this.$window.sessionStorage.getItem('token');
            }
            return config || _this.$q.when(config);
        };
        this.response = function (response) {
            var requestUrl = response.config.url;
            _this.SharedProperties.decreaseRequestsCounter(requestUrl);
            return response || _this.$q.when(response);
        };
        this.responseError = function (response) {
            var requestUrl = response.config.url;
            _this.SharedProperties.decreaseRequestsCounter(requestUrl);
            return _this.$q.reject(response);
        };
        return this;
    }
    HttpInterceptorFactory.$inject = ["$window", "$q", "SharedProperties"];
    return HttpInterceptorFactory;
})();
//# sourceMappingURL=HttpInterceptorFactory.js.map