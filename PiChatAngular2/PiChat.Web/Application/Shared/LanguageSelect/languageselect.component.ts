import { Component } from "@angular/core";
import { TranslateService, TranslatePipe } from 'ng2-translate/ng2-translate';
import { MdIcon, MdIconRegistry } from '@angular2-material/icon';
import { SharedProperties } from "../sharedproperties.service";

@Component({
    selector: "language-select",
    templateUrl: "/Application/Shared/LanguageSelect/languageselect.component.html",
    directives: [
        MdIcon
    ],
    providers: [
        MdIconRegistry,
    ],
    pipes: [
        TranslatePipe
    ]
})
export class LanguageSelectComponent {
    constructor(private sharedProperties: SharedProperties, public translateService: TranslateService) {
    }

    changeLanguage(lang: string) {
        this.sharedProperties.setCurrentLanguage(lang);
        this.translateService.use(lang);
    }
}