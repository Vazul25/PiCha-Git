import { Component, OnInit } from "@angular/core";
import { ROUTER_DIRECTIVES, Router } from "@angular/router";
import { TranslateService, TranslatePipe } from 'ng2-translate/ng2-translate';
import { MD_CARD_DIRECTIVES } from '@angular2-material/card';
import { MD_BUTTON_DIRECTIVES } from '@angular2-material/button';
import { MD_INPUT_DIRECTIVES } from '@angular2-material/input';
import { MD_TOOLBAR_DIRECTIVES } from '@angular2-material/toolbar';
import { NgForm, REACTIVE_FORM_DIRECTIVES } from '@angular/forms';
import { MODAL_DIRECTIVES } from 'ng2-bs3-modal/ng2-bs3-modal';
import { LanguageSelectComponent } from "../Shared/LanguageSelect/languageselect.component";
import { LoadingIndicatorComponent } from "../Shared/LoadingIndicator/loadingindicator.component";
import { SharedProperties } from "../Shared/sharedproperties.service";
import { LoginService } from "./login.service";
import { SignalRService } from '../Shared/signalr.service';

@Component({
    selector: "login",
    templateUrl: "/Application/Login/login.component.html",
    directives: [
        ROUTER_DIRECTIVES,
        MD_CARD_DIRECTIVES,
        MD_BUTTON_DIRECTIVES,
        MD_INPUT_DIRECTIVES,
        MD_TOOLBAR_DIRECTIVES,
        REACTIVE_FORM_DIRECTIVES,
        MODAL_DIRECTIVES,
        LanguageSelectComponent,
        LoadingIndicatorComponent
    ],
    providers: [
        LoginService
    ],
    pipes: [TranslatePipe]
})

export class LoginComponent implements OnInit {
    email: string = "testuser1@pichat.hu";
    password: string = "Password1";

    constructor(private router: Router, private sharedProperties: SharedProperties, private loginService: LoginService, private signalrService: SignalRService, public translate: TranslateService) {
    }

    ngOnInit() {
    }

    login() {
        this.loginService.login(this.email, this.password).then((resp: any) => {
            var userData = JSON.parse(resp._body);
            this.sharedProperties.login(userData.access_token, userData.email, userData.name);

            this.signalrService.startPiChat().done(() => {
                console.log("SignalR connection started!");
                this.signalrService.setConnectionStatus(SignalRStatus.Connected);
                this.router.navigate(['/home']);
            }).fail(() => {
                this.signalrService.setConnectionStatus(SignalRStatus.Disconnected);
                console.error("SignalR error");
            });
        }, (error: any) => {
            console.error("LoginComponent login() error: ", error);
        });
    }
}