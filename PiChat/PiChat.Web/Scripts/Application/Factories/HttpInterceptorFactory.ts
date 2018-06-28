//TODO - normális interfészek keresése 
// solved --- Ihttppromisecallbackarg
//Todo comment
interface IConfig {
    headers: any;
    url: string;
}

interface IResponse {
    status: number;
    config: any;
    data: { Message: string };
    statusText: string;
}

class HttpInterceptorFactory implements ng.IHttpInterceptor {
    static $inject = ["$window", "$q", "SharedProperties"]
    constructor(private $window: ng.IWindowService, private $q: ng.IQService, private SharedProperties: ISharedProperties) {
        return this;
    }

    request = (config: ng.IRequestConfig) => {
        var requestUrl = config.url;
        this.SharedProperties.increaseRequestsCounter(requestUrl);

        config.headers = config.headers || {};
        if (this.$window.sessionStorage.getItem('token')) {
            config.headers["Authorization"] = 'Bearer ' + this.$window.sessionStorage.getItem('token');
        }
        return config || this.$q.when(config);
    }

    response = (response: IResponse) => {
        var requestUrl = response.config.url;
        this.SharedProperties.decreaseRequestsCounter(requestUrl);

        return response || this.$q.when(response);
    }

    responseError = (response: IResponse) => {
        var requestUrl = response.config.url;
        this.SharedProperties.decreaseRequestsCounter(requestUrl);
        
        return this.$q.reject(response);
    }
}