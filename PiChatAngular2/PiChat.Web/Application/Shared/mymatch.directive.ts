import {Directive, OnDestroy} from '@angular/core';
import {NG_VALIDATORS, FormControl} from '@angular/forms';
import {forwardRef} from '@angular/core';
import 'rxjs/Rx'; 
import { Subscription } from 'rxjs/Subscription';

@Directive({
    selector:  '[mymatch][formControl]',
    providers: [
        { provide: NG_VALIDATORS, useExisting: forwardRef(() => Match), multi: true }
    ],
     inputs: ['toMatch:mymatch']
})
export class Match {
    toMatch: FormControl;
    validator: Function;
    isInitiated: boolean = false;
    toMatchChangedSubscription: Subscription;
    constructor() {}

    validate(c: FormControl) {
        if (!this.isInitiated) {
            this.toMatchChangedSubscription=this.toMatch.valueChanges.subscribe(() => { c.updateValueAndValidity(); });
            this.isInitiated = true;
        }
        return c.value === this.toMatch.value ? null : {
            mymatch: {
                valid: false
            }
        };
    }
    ngOnDestroy() {
        this.toMatchChangedSubscription.unsubscribe();
        
    }
}