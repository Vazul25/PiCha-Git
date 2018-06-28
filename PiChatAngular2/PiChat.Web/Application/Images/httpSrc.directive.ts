import {Directive, provide} from '@angular/core';
import {ElementRef} from    '@angular/core';
import {OnInit} from    '@angular/core';
import {BrowserXhr} from  "@angular/http";
import {CustomBrowserXhr} from "./CustomBrowserXhr"
import {HTTP_PROVIDERS, Http, Request, RequestOptionsArgs, Response, RequestOptions, Headers } from '@angular/http';
import { ImagesGridService } from '../Images/imagesgrid.service';

@Directive({
    selector: "[myHttpSrc]",
    providers: [HTTP_PROVIDERS, provide(BrowserXhr, { useClass: CustomBrowserXhr })],
    inputs: ['objectURL:myHttpSrc']
})
export class HttpSrcDirective {
    objectURL: string;

    constructor(private http: Http, private imagesGridService: ImagesGridService, private el: ElementRef) {
    }

    //todo on destroy revoke
    ngOnInit(): any {
        //this.objectURL = this.el.nativeElement.attributes.myhttpsrc.nodeValue;
        let headers = new Headers();
        var options = new RequestOptions();
        options.headers = headers;
        headers.append("Authorization", 'Bearer ' + sessionStorage.getItem("token"));
        this.imagesGridService.increaseImagesLoadingCounter();
        this.http.get(this.objectURL, options).toPromise()
            .then(resp => {
                var body = resp._body;
                var blob = new Blob([new Uint8Array(resp._body)], { type: resp.headers.get('Content-Type') });
                this.objectURL = URL.createObjectURL(blob);
                this.el.nativeElement.attributes.src.nodeValue = this.objectURL;
                this.imagesGridService.decreaseImagesLoadingCounter();
            }, (err) => {
                this.imagesGridService.decreaseImagesLoadingCounter();
            });
    }
}

