import { Component, OnInit, OnDestroy, EventEmitter } from "@angular/core";
import { ROUTER_DIRECTIVES, Router } from "@angular/router";
import { TranslateService, TranslatePipe } from 'ng2-translate/ng2-translate';
import { MD_BUTTON_DIRECTIVES } from '@angular2-material/button';
import { MdIcon, MdIconRegistry } from '@angular2-material/icon';
import { MD_TABS_DIRECTIVES } from '@angular2-material/tabs';
import { MD_TOOLBAR_DIRECTIVES } from '@angular2-material/toolbar';
import { LanguageSelectComponent } from "../Shared/LanguageSelect/languageselect.component";
import { LoadingIndicatorComponent } from "../Shared/LoadingIndicator/loadingindicator.component";
import { SharedProperties } from "../Shared/sharedproperties.service";
import { GroupService } from '../Groups/groups.service';
import { SignalRService } from '../Shared/signalr.service';

@Component({
    selector: "home",
    templateUrl: "/Application/Home/home.component.html",
    directives: [
        ROUTER_DIRECTIVES,
        MD_BUTTON_DIRECTIVES,
        MdIcon,
        MD_TABS_DIRECTIVES,
        MD_TOOLBAR_DIRECTIVES,
        LanguageSelectComponent,
        LoadingIndicatorComponent
    ],
    providers: [
        MdIconRegistry,
        GroupService
    ],
    pipes: [TranslatePipe]
})

export class HomeComponent implements OnInit {
    selectedTabIndex: number = 0;
    isTabsHidden: boolean = false;

    private groupDescriptionChangedSubscription: EventEmitter<any>;
    private groupNameChangedSubscription: EventEmitter<any>;
    private groupDeletedSubscription: EventEmitter<any>;

    constructor(private router: Router, private sharedProperties: SharedProperties, private groupService: GroupService, private signalrService: SignalRService, public translate: TranslateService) {
        this.groupDescriptionChangedSubscription = this.signalrService.groupDescriptionChanged$.subscribe((event: any) => {
            this.sharedProperties.changeGroupDescription(event.groupId, event.newDescription);
        });

        this.groupNameChangedSubscription = this.signalrService.groupNameChanged$.subscribe((event: any) => {
            this.sharedProperties.changeGroupName(event.groupId, event.newName);
        });

        this.groupDeletedSubscription = this.signalrService.groupDeleted$.subscribe((groupId: number) => {
            this.sharedProperties.removeGroup(groupId);
        });
    }

    ngOnInit() {
        this.sharedProperties.isUserLoggedIn();

        var url: string = window.location.href;
        if (url.indexOf('/groups') > -1) {
            this.selectedTabIndex = 1;
        } else if (url.indexOf('/upload') > -1) {
            this.selectedTabIndex = 2;
        } else if (url.indexOf('/profile') > -1) {
            this.isTabsHidden = true;
        }

        this.getGroups();
    }

    ngOnDestroy() {
        this.groupDescriptionChangedSubscription.unsubscribe();
        this.groupNameChangedSubscription.unsubscribe();
        this.groupDeletedSubscription.unsubscribe();
    }

    selectTab() {
        switch (this.selectedTabIndex) {
            case 1:
                this.router.navigate(['/home/groups']);
                break;
            case 2:
                this.router.navigate(['/home/upload']);
                break;
            default:
                this.router.navigate(['/home/imagelist']);
        }
    }

    showProfilePage() {
        this.isTabsHidden = true;
        this.router.navigate(['/home/profile']);
    }

    hideProfilePage() {
        this.isTabsHidden = false;
        switch (this.selectedTabIndex) {
            case 1:
                this.router.navigate(['/home/groups']);
                break;
            case 2:
                this.router.navigate(['/home/upload']);
                break;
            default:
                this.router.navigate(['/home/imagelist']);
        }
    }

    logout() {
        this.sharedProperties.logout();
        this.signalrService.stopPiChat();
        this.router.navigate(['/login']);
    }

    getGroups() {
        this.groupService.getMyGroups().then(groups => {
            this.sharedProperties.setMyGroups(groups);
        });

        this.groupService.getGroups().then(groups => {
            this.sharedProperties.setOtherGroups(groups);
        });
    }
}