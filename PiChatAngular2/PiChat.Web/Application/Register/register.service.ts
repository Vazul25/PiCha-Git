import { Injectable } from '@angular/core';
import { Http, Response } from '@angular/http';
import { Observable }     from 'rxjs/Observable';
import 'rxjs/Rx';
import { SharedProperties } from "../Shared/sharedproperties.service";

///<summary>
///A service which can get images
///delete them or change their description
///</summary>
@Injectable()
export class RegisterService {
    constructor(private http: Http, private sharedProperties: SharedProperties) {
    }

    register(name: string, email: string, password: string, passwordConfirm: string) {
        return this.http.post(this.sharedProperties.getServerUrl() + "api/Account/Register", { name, email, password, passwordConfirm }).toPromise();
    }
}