import { bootstrap } from '@angular/platform-browser-dynamic';
import { provide } from '@angular/core';
import { HTTP_PROVIDERS, Http, Request, RequestOptionsArgs, Response, XHRBackend, RequestOptions, ConnectionBackend, Headers } from '@angular/http';
import { TRANSLATE_PROVIDERS, TranslateService, TranslateLoader, MissingTranslationHandler } from 'ng2-translate/ng2-translate';
import { App } from './app.component';
import { disableDeprecatedForms, provideForms } from '@angular/forms';

import { appRouterProviders }   from './app.routes';
import { SharedProperties } from "./Shared/sharedproperties.service";
import { CustomHttp } from "./Shared/customhttp";
import { CustomTranslateLoader } from "./Shared/customtranslateloader.service";
import { CustomMissingTranslationHandler } from "./Shared/custommissingtranslationhandler.service";
import { AuthGuard } from "./Shared/auth-guard.service";
import { InverseAuthGuard } from "./Shared/inverse-auth-guard.service";
import { ToastService } from "./Shared/toast.service";
import { MD5Service } from './Shared/md5.service';
import { SignalRService } from './Shared/signalr.service';
import { LoadingIndicatorService } from './Shared/LoadingIndicator/loadingindicator.service';
import { ImagesGridService } from './Images/imagesgrid.service';

bootstrap(App, [
    appRouterProviders,
    HTTP_PROVIDERS,
    SharedProperties,
    {
        provide: TranslateLoader,
        useFactory: (http: Http) => new CustomTranslateLoader(http),
        deps: [Http]
    },
    {
        provide: MissingTranslationHandler,
        useClass: CustomMissingTranslationHandler
    },
    TranslateService,
    AuthGuard,
    InverseAuthGuard,
    ToastService,
    MD5Service,
    SignalRService,
    LoadingIndicatorService,
    ImagesGridService,
    disableDeprecatedForms(),
    provideForms(),
    provide(Http, {
        useFactory: (xhrBackend: XHRBackend, requestOptions: RequestOptions, sharedProperties: SharedProperties, loadingIndicatorService: LoadingIndicatorService, toastService: ToastService) => new CustomHttp(xhrBackend, requestOptions, sharedProperties, loadingIndicatorService, toastService),
        deps: [XHRBackend, RequestOptions, SharedProperties, LoadingIndicatorService, ToastService]
    })
]);