import { Injectable } from '@angular/core';
import { Http, Response, Headers } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import 'rxjs/Rx';
import { SharedProperties } from "../Shared/sharedproperties.service";

@Injectable()
export class LoginService {
    constructor(private http: Http, private sharedProperties: SharedProperties) {
    }

    login(email: string, password: string) {
        let headers = new Headers();
        headers.append('Content-Type', 'application/x-www-form-urlencoded');
        return this.http.post(this.sharedProperties.getServerUrl() + "Token", "grant_type=password&username=" + email + "&password=" + password, {
            headers: headers
        }).toPromise();
    }
}