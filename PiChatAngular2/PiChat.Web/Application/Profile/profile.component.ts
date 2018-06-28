import { Component, EventEmitter, OnInit, OnDestroy, ViewChild } from "@angular/core";
import { TranslateService, TranslatePipe } from 'ng2-translate/ng2-translate';
import { MD_CARD_DIRECTIVES } from '@angular2-material/card';
import { MD_BUTTON_DIRECTIVES } from '@angular2-material/button';
import { MD_CHECKBOX_DIRECTIVES } from '@angular2-material/checkbox';
import { MD_INPUT_DIRECTIVES } from '@angular2-material/input';
import { MD_TABS_DIRECTIVES } from '@angular2-material/tabs';
import { NgForm, REACTIVE_FORM_DIRECTIVES } from '@angular/forms';
import { MODAL_DIRECTIVES, ModalComponent  } from 'ng2-bs3-modal/ng2-bs3-modal';
import { SharedProperties } from "../Shared/sharedproperties.service";
import { SignalRService } from "../Shared/signalr.service";
import { ProfileService } from './profile.service';
import { GroupService } from '../Groups/groups.service';
import { MembershipService } from './membership.service';
import { ToastService } from "../Shared/toast.service";
import * as _ from 'lodash';
import { FormGroup, FormControl, Validators, FormBuilder } from '@angular/forms';
import {Match} from "../Shared/mymatch.directive";

@Component({
    selector: "profile",
    templateUrl: "/Application/Profile/profile.component.html",
    directives: [
        MD_CARD_DIRECTIVES,
        MD_BUTTON_DIRECTIVES,
        MD_CHECKBOX_DIRECTIVES,
        MD_INPUT_DIRECTIVES,
        MD_TABS_DIRECTIVES,
        REACTIVE_FORM_DIRECTIVES,
        MODAL_DIRECTIVES,
        [Match]
    ],
    providers: [
        ProfileService,
        MembershipService
    ],
    pipes: [TranslatePipe]
})

export class ProfileComponent implements OnInit, OnDestroy {
    profile: IProfile;
    adminedGroups: IGroup[] = [];
    requests: IMembership[] = [];

    @ViewChild('createNewGroupModal') createNewGroupModal: ModalComponent;
    @ViewChild('changeGroupNameModal') changeGroupNameModal: ModalComponent;
    @ViewChild('changeGroupDescriptionModal') changeGroupDescriptionModal: ModalComponent;
    @ViewChild('deleteGroupModal') deleteGroupModal: ModalComponent;
    @ViewChild('changeUserNameModal') changeUserNameModal: ModalComponent;
    @ViewChild('changeUserPasswordModal') changeUserPasswordModal: ModalComponent;
    changeUserPasswordForm: FormGroup;

    newUserName: string = "";
    currentPassword: FormControl = new FormControl();
    newPassword: FormControl = new FormControl();
    newPasswordConfirm: FormControl = new FormControl();
    selectedGroupId: number = -1;
    newGroupName: string = "";
    newGroupDescription: string = "";
    isNewGroupPrivate: boolean = false;

    private adminedGroupsChangedSubscription: EventEmitter<any>;

    constructor(private sharedProperties: SharedProperties,
        private toastService: ToastService,
        private profileService: ProfileService,
        private groupService: GroupService,
        private membershipService: MembershipService,
        private signalrService: SignalRService,
        public translate: TranslateService,
        private fb: FormBuilder) {
       
        this.subscribeToEvents();
        this.changeUserPasswordForm = fb.group({
            "newPassword": this.newPassword,
            "newPasswordConfirm": this.newPasswordConfirm,
            "currentPassword": this.currentPassword
        });
    }

    ngOnInit() {
        this.profile = this.sharedProperties.getProfile();
        this.adminedGroups = this.sharedProperties.getAdminedGroups();
        this.getRequests();
    }

    ngOnDestroy() {
        this.adminedGroupsChangedSubscription.unsubscribe();
    }

    subscribeToEvents() {
        this.adminedGroupsChangedSubscription = this.sharedProperties.myGroupsChanged$.subscribe(() => {
            this.adminedGroups = this.sharedProperties.getAdminedGroups();
        });
    }

    changeUserName() {
        this.profileService.changeName(this.newUserName).then(() => {
            this.toastService.showSuccessMessage(this.translate.instant('suc5') + this.newUserName + "'!");
            this.sharedProperties.changeUserName(this.newUserName);

            this.changeUserNameModal.close();
            this.newUserName = "";
        });
    }

    changeUserPassword() {
        this.profileService.changePassword(this.currentPassword.value, this.newPassword.value, this.newPasswordConfirm.value).then(() => {
            this.toastService.showSuccessMessage(this.translate.instant('suc6'));
            this.changeUserPasswordModal.close();

            this.currentPassword.value = "";
            this.newPassword.value = "";
            this.newPasswordConfirm.value = "";
        
        });
    }

    createGroup() {
        this.groupService.createGroup(this.newGroupName, this.isNewGroupPrivate).then(group => {
            this.toastService.showSuccessMessage(this.translate.instant('suc7') + this.newGroupName + "'!");
            this.sharedProperties.addCreatedGroup(group);

            this.signalrService.sendNewGroupToOthers(group);

            this.createNewGroupModal.close();
            this.newGroupName = "";
            this.isNewGroupPrivate = false;
        });
    }

    setSelectedGroupIndex(id: number) {
        this.selectedGroupId = id;
    }

    changeGroupName() {
        this.groupService.renameGroup(this.selectedGroupId, this.newGroupName).then(() => {
            this.toastService.showSuccessMessage(this.translate.instant('suc8') + this.newGroupName + "'!");

            this.changeGroupNameModal.close();
            this.newGroupName = "";
            this.selectedGroupId = -1;
        });
    }

    changeGroupDescription() {
        this.groupService.changeDescription(this.selectedGroupId, this.newGroupDescription).then(() => {
            this.toastService.showSuccessMessage(this.translate.instant('suc9') + this.newGroupDescription + "'!");

            this.changeGroupDescriptionModal.close();
            this.newGroupDescription = "";
            this.selectedGroupId = -1;
        });
    }

    deleteGroup() {
        this.groupService.deleteGroup(this.selectedGroupId).then(() => {
            this.toastService.showSuccessMessage(this.translate.instant('suc10'));

            this.signalrService.leaveGroup(this.selectedGroupId);

            this.deleteGroupModal.close();
            this.selectedGroupId = -1;
        });
    }

    getRequests() {
        this.membershipService.getRequests().then((requests: IMembership[]) => {
            this.requests = requests;
        });
    }

    acceptRequest(membershipId: number) {
        this.membershipService.acceptRequests(membershipId).then(() => {
            _.remove(this.requests, function (r) { return r.groupMembershipId == membershipId; });
            this.toastService.showSuccessMessage(this.translate.instant('suc11'));
        });
    }

    rejectRequest(membershipId: number) {
        this.membershipService.rejectRequests(membershipId).then(() => {
            _.remove(this.requests, function (r) { return r.groupMembershipId == membershipId; });
            this.toastService.showSuccessMessage(this.translate.instant('suc12'));
        });
    }
}