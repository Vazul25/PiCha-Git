import { Component, OnInit } from '@angular/core';
import { ROUTER_DIRECTIVES }  from '@angular/router';
import { TranslateService } from 'ng2-translate/ng2-translate';

import { LoginComponent } from "./Login/login.component";
import { RegisterComponent } from "./Register/register.component";
import { HomeComponent } from "./Home/home.component";
import { ProfileComponent } from "./Profile/profile.component";
import { ImagesComponent } from "./Images/images.component";
import { GroupsComponent } from "./Groups/groups.component";
import { UploadImageComponent } from "./UploadImage/uploadimage.component";
import { LanguageSelectComponent } from "./Shared/LanguageSelect/languageselect.component";
import { LoadingIndicatorComponent } from "./Shared/LoadingIndicator/loadingindicator.component";
import { SharedProperties } from "./Shared/sharedproperties.service";

@Component({
    selector: 'pichat-app',
    templateUrl: '/Application/app.component.html',
    directives: [
        ROUTER_DIRECTIVES
    ],
    precompile: [
        LoginComponent,
        RegisterComponent,
        HomeComponent,
        ProfileComponent,
        ImagesComponent,
        GroupsComponent,
        UploadImageComponent,
        LanguageSelectComponent,
        LoadingIndicatorComponent
    ]
})

export class App implements OnInit {
    constructor(private translateService: TranslateService, private sharedProperties: SharedProperties) {
        translateService.setDefaultLang('en');
        this.sharedProperties.loadCurrentLanguage();
        this.translateService.use(this.sharedProperties.getCurrentLanguage());
    }

    ngOnInit() {
    }
}