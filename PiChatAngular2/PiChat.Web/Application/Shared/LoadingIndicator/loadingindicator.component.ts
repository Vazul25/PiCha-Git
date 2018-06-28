import { Component } from "@angular/core";
import { MD_PROGRESS_CIRCLE_DIRECTIVES } from '@angular2-material/progress-circle';

@Component({
    selector: "loading-indicator",
    templateUrl: "/Application/Shared/LoadingIndicator/loadingindicator.component.html",
    styleUrls: [
        "Application/Shared/LoadingIndicator/loadingindicator.component.css"
    ],
    directives: [
        MD_PROGRESS_CIRCLE_DIRECTIVES
    ]
})
export class LoadingIndicatorComponent {
    constructor() {
    }
}