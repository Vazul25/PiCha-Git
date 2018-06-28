import { Component, OnInit } from "@angular/core";
import { ROUTER_DIRECTIVES, Router } from "@angular/router";
import { TranslateService, TranslatePipe } from 'ng2-translate/ng2-translate';
import { MD_CARD_DIRECTIVES } from '@angular2-material/card';
import { MD_BUTTON_DIRECTIVES } from '@angular2-material/button';
import { MD_INPUT_DIRECTIVES } from '@angular2-material/input';
import { MD_TOOLBAR_DIRECTIVES } from '@angular2-material/toolbar';
import { NgForm, REACTIVE_FORM_DIRECTIVES } from '@angular/forms';
import { LanguageSelectComponent } from "../Shared/LanguageSelect/languageselect.component";
import { LoadingIndicatorComponent } from "../Shared/LoadingIndicator/loadingindicator.component";
import { RegisterService } from './register.service';
import { ToastService } from "../Shared/toast.service";
import { FormGroup, FormControl, Validators, FormBuilder } from '@angular/forms';
import {Match} from "../Shared/mymatch.directive";
import {EmailValidator} from "../Shared/validateEmail.directive";
@Component({
    selector: "register",
    templateUrl: "/Application/Register/register.component.html",
    directives: [
        ROUTER_DIRECTIVES,
        MD_CARD_DIRECTIVES,
        MD_BUTTON_DIRECTIVES,
        MD_INPUT_DIRECTIVES,
        MD_TOOLBAR_DIRECTIVES,
        REACTIVE_FORM_DIRECTIVES,
        LanguageSelectComponent,
        LoadingIndicatorComponent,
        [Match],
        [EmailValidator]
    ],
    providers: [
        RegisterService
    ],
    pipes: [TranslatePipe]
})

export class RegisterComponent implements OnInit {
    name: FormControl = new FormControl();
    email: FormControl = new FormControl();
    password: FormControl = new FormControl();
    passwordConfirm: FormControl = new FormControl();
    registerForm: FormGroup;
    constructor(private router: Router, private registerService: RegisterService, private fb: FormBuilder, private toastService: ToastService, public translate: TranslateService) {
        this.registerForm = fb.group({
            "name": this.name,
            "email": this.email,
            "password": this.password,
            "passwordConfirm": this.passwordConfirm
        });
        
    }

    ngOnInit() {
        
    }

    register() {
        this.registerService.register(this.name.value, this.email.value, this.password.value, this.passwordConfirm.value).then((resp: any) => {
            this.toastService.showSuccessMessage(this.translate.instant('suc13') + "\n" + this.translate.instant('suc14'));
            this.router.navigate(['/login']);
        });
    }
}