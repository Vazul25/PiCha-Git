import { Injectable } from '@angular/core';
import { Router, CanActivate } from '@angular/router';
import { TranslateService } from 'ng2-translate/ng2-translate';
import { SharedProperties } from './sharedproperties.service';
import { ToastService } from "./toast.service";

@Injectable()
export class AuthGuard implements CanActivate {
    constructor(private router: Router, private sharedProperties: SharedProperties, private toastService: ToastService, private translate: TranslateService) {
    }

    canActivate() {
        if (this.sharedProperties.isUserLoggedIn()) {
            var userName: string = this.sharedProperties.getUserName();
            this.translate.get('wel').toPromise().then((text: any) => this.toastService.showSuccessMessage(text + userName + "!"));
            return true;
        }
        
        this.translate.get('suc14').toPromise().then((text: any) => this.toastService.showInfoMessage(text));
        this.router.navigate(['/login']);
        return false;
    }
}