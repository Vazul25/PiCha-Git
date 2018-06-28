import { Injectable } from '@angular/core';
import { Router, CanActivate } from '@angular/router';
import { SharedProperties } from './sharedproperties.service';
import { ToastService } from "./toast.service";

@Injectable()
export class InverseAuthGuard implements CanActivate {
    constructor(private router: Router, private sharedProperties: SharedProperties, private toastService: ToastService) {
    }

    canActivate() {
        if (this.sharedProperties.isUserLoggedIn()) {
            this.router.navigate(['/home']);
            return false;
        }

        return true;
    }
}