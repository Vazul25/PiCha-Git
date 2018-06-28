# Angular2 - CustomHttp

(Angular-os http interceptor Angular2-ben)

### 1. CustomHttp osztály létrehozása
```typescript
import { HTTP_PROVIDERS, Http, Request, RequestOptionsArgs, Response, XHRBackend, RequestOptions, ConnectionBackend, Headers } from '@angular/http';
import { Observable } from 'rxjs/Observable';

export class CustomHttp extends Http {
    constructor(backend: ConnectionBackend, defaultOptions: RequestOptions) {
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
        //ha error van, akkor a complete nem fut le, azért kell 2 helyen csökkenteni
        return observable.do(
            (res: Response) => {}, 
            (error: Response) => {}, 
            () => {
        });
    }

    addAuthorizationHeader(options: RequestOptionsArgs): RequestOptionsArgs {
        if (options == null) {
            options = new RequestOptions();
        }
        if (options.headers == null) {
            options.headers = new Headers();
        }

        options.headers.append('Authorization', 'Bearer ' + 'token');

        return options;
    }
}
```

### 2. Regisztrálás a bootstrap fájlban
```typescript
import { bootstrap } from '@angular/platform-browser-dynamic';
import { provide } from '@angular/core';
import { HTTP_PROVIDERS, Http, Request, RequestOptionsArgs, Response, XHRBackend, RequestOptions, ConnectionBackend, Headers } from '@angular/http';
import { App } from './app.component';
import { CustomHttp } from './Shared/customhttp';
...

bootstrap(App, [
    ...
    HTTP_PROVIDERS,
    ...
    provide(Http, {
        useFactory: (xhrBackend: XHRBackend, requestOptions: RequestOptions) => new CustomHttp(xhrBackend, requestOptions),
        deps: [XHRBackend, RequestOptions]
    }),
    ...
]);
```

### 3. Használat

**Folyt. köv.**