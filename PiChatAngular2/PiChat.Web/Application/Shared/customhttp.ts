import { HTTP_PROVIDERS, Http, Request, RequestOptionsArgs, Response, XHRBackend, RequestOptions, ConnectionBackend, Headers } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import { SharedProperties } from './sharedproperties.service';
import { LoadingIndicatorService } from './LoadingIndicator/loadingindicator.service';
import { ToastService } from './toast.service';

export class CustomHttp extends Http {
    private currentPendingRequests: number = 0;

    constructor(backend: ConnectionBackend, defaultOptions: RequestOptions, private sharedProperties: SharedProperties, private loadingIndicatorService: LoadingIndicatorService, private toastService: ToastService) {
        super(backend, defaultOptions);
    }

    request(url: string | Request, options?: RequestOptionsArgs): Observable<Response> {
        options = this.addAuthorizationHeader(options);

        return this.intercept(super.request(url, options));
    }

    get(url: string, options?: RequestOptionsArgs): Observable<Response> {
        options = this.addAuthorizationHeader(options);

        return this.intercept(super.get(url, options));
    }

    post(url: string, body: string, options?: RequestOptionsArgs): Observable<Response> {
        options = this.addAuthorizationHeader(options);

        return this.intercept(super.post(url, body, options));
    }

    put(url: string, body: string, options?: RequestOptionsArgs): Observable<Response> {
        options = this.addAuthorizationHeader(options);

        return this.intercept(super.put(url, body, options));
    }

    delete(url: string, options?: RequestOptionsArgs): Observable<Response> {
        options = this.addAuthorizationHeader(options);

        return this.intercept(super.delete(url, options));
    }

    intercept(observable: Observable<Response>): Observable<Response> {
        this.increaseRequestCounter();

        //ha error van, akkor a complete nem fut le, azért kell 2 helyen csökkenteni
        return observable.do((res: Response) => {
        }, (error: Response) => {
            this.decreaseRequestCounter();
            var errorResponse = JSON.parse(error.text());
            var errorMessage: string = errorResponse.message || errorResponse.error_description || (this.sharedProperties.getCurrentLanguage() == 'en' ? "Something went wrong!" : "Hiba történt!");
            this.toastService.showErrorMessage(errorMessage);
        }, () => {
            this.decreaseRequestCounter();
        });
    }

    addAuthorizationHeader(options: RequestOptionsArgs): RequestOptionsArgs {
        if (options == null) {
            options = new RequestOptions();
        }
        if (options.headers == null) {
            options.headers = new Headers();
        }

        if (this.sharedProperties.getAccessToken() != undefined) {
            options.headers.append('Authorization', 'Bearer ' + this.sharedProperties.getAccessToken());
        }

        return options;
    }

    increaseRequestCounter() {
        if (this.currentPendingRequests == 0) {
            this.loadingIndicatorService.showLoadingIndicator();
            this.sharedProperties.waitingForResp = true;
        }
        this.currentPendingRequests += 1;
    }

    decreaseRequestCounter() {
        if (this.currentPendingRequests > 0) {
            this.currentPendingRequests -= 1;
        }

        if (this.currentPendingRequests == 0) {
            this.loadingIndicatorService.hideLoadingIndicator();
            this.sharedProperties.waitingForResp = false;
        }
    }
}