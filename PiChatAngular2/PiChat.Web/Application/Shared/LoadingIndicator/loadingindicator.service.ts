import { Injectable } from '@angular/core';

@Injectable()
export class LoadingIndicatorService {
    constructor() {
    }

    showLoadingIndicator() {
        $('#loading-indicator').show();
    }

    hideLoadingIndicator() {
        $('#loading-indicator').hide();
    }
}