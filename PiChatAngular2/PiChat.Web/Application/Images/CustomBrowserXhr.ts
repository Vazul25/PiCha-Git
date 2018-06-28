import { Injectable } from '@angular/core';
import {BrowserXhr} from '@angular/http';
//import { SharedProperties } from "../Shared/sharedproperties.service";

@Injectable()
export class CustomBrowserXhr extends BrowserXhr {
    constructor(/*private SharedProperties: SharedProperties*/) { super();  }
    build(): any {
        let xhr = super.build();

        xhr.responseType = 'arraybuffer';
        return <any>(xhr);
    }
}
