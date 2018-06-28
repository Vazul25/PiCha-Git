import { Injectable, EventEmitter } from '@angular/core';
import { MD5Service } from './md5.service';
import { SignalRService } from './signalr.service';
import { ToastService } from './toast.service';
import * as _ from 'lodash';

@Injectable()
export class SharedProperties {
    private serverUrl: string = "http://localhost:31725/";
    private currentLanguage: string = "en";
    private profile: IProfile = undefined;

    private myGroups: IGroup[] = [];        //csoportok, amiben tag vagyok, Role >= Member
    private adminedGroups: IGroup[] = [];     //csoportok amit létrehoztam -> Role >= Admin
    private otherGroups: IGroup[] = [];     //minden egyéb csoport -> Role < Member

    public myGroupsChanged$: EventEmitter<any>;
    public otherGroupsChanged$: EventEmitter<any>;

    public waitingForResp: boolean = false; //disables the buttons while there is a http request pending

    constructor(private md5Service: MD5Service, private signalrService: SignalRService, private toastService: ToastService) {
        this.myGroupsChanged$ = new EventEmitter();
        this.otherGroupsChanged$ = new EventEmitter();
    }

    loadCurrentLanguage() {
        this.currentLanguage = localStorage.getItem("lang") || "en";
    }

    getCurrentLanguage() {
        return this.currentLanguage;
    }

    setCurrentLanguage(lang: string) {
        localStorage.setItem("lang", lang);
        this.currentLanguage = lang;
    }

    getServerUrl() {
        return this.serverUrl;
    }

    login(newAccessToken: string, email: string, name: string) {
        sessionStorage.setItem('token', newAccessToken);
        sessionStorage.setItem('useremail', email);
        sessionStorage.setItem('username', name);

        this.profile = <IProfile>{
            accessToken: newAccessToken,
            email: email,
            name: name,
            emailHash: this.md5Service.createHash(email)
        };
    }

    logout() {
        sessionStorage.setItem('token', "");
        sessionStorage.setItem('useremail', "");
        sessionStorage.setItem('username', "");
        this.profile = undefined;
    }

    isUserLoggedIn() {
        if (this.profile != undefined && this.profile.accessToken != "") {
            return true;
        } else if (sessionStorage.getItem('token') != null && sessionStorage.getItem('token') != "") {
            this.profile = <IProfile>{
                accessToken: sessionStorage.getItem('token'),
                email: sessionStorage.getItem('useremail'),
                name: sessionStorage.getItem('username'),
                emailHash: this.md5Service.createHash(sessionStorage.getItem('useremail'))
            };
            return true;
        }

        return false;
    }

    getProfile(): IProfile {
        return this.profile;
    }

    getUserName(): string {
        return this.profile.name;
    }

    getAccessToken(): string {
        if (this.profile != undefined) {
            return this.profile.accessToken;
        }

        return undefined;
    }

    changeUserName(newName: string) {
        sessionStorage.setItem('username', newName);
        this.profile.name = newName;
    }

    setMyGroups(groups: IGroup[]) {
        this.myGroups = [];
        this.adminedGroups = [];

        var signalrRooms: number[] = [];
        groups.forEach((group, index) => {
            this.myGroups.push(group);
            signalrRooms.push(group.id);

            if (group.role >= GroupMembershipRole.Administrator) {
                this.adminedGroups.push(group);
            }
        });

        if (signalrRooms.length > 0) {
            ///Reconects to SignalR if we are not connected
            if (this.signalrService.getConnectionStatus() == SignalRStatus.Disconnected) {
                this.signalrService.restartPiChat().done(() => {
                    console.log("SignalR connection restarted!");
                    this.signalrService.setConnectionStatus(SignalRStatus.Connected);
                    this.signalrService.joinToGroups(signalrRooms);
                }).fail(() => {
                    this.signalrService.setConnectionStatus(SignalRStatus.Disconnected);
                    console.error("SignalR error");
                });
            } else {
                this.signalrService.joinToGroups(signalrRooms);
            }
        }

        this.myGroupsChanged$.emit("");
    }

    setOtherGroups(groups: IGroup[]) {
        this.otherGroups = groups;

        this.otherGroupsChanged$.emit("");
    }

    addCreatedGroup(createdGroup: IGroup) {
        this.myGroups.push(createdGroup);
        this.adminedGroups.push(createdGroup);

        this.signalrService.joinToGroup(createdGroup.id);

        this.myGroupsChanged$.emit("");
    }

    addOtherGroup(group: IGroup) {
        this.otherGroups.push(group);

        this.otherGroupsChanged$.emit("");
    }

    addOtherGroups(groups: IGroup[]) {
        groups.forEach((group, index) => {
            this.otherGroups.push(group);
        });

        this.otherGroupsChanged$.emit("");
    }

    removeGroup(groupId: number) {
        var deletedOtherGroups = _.remove(this.otherGroups, function (g) { return g.id == groupId; });
        var deletedAdminedGroups = _.remove(this.adminedGroups, function (g) { return g.id == groupId; });

        var deletedMyGroups = _.remove(this.myGroups, function (g) { return g.id == groupId; });
        if (deletedMyGroups.length == 1) {
            this.signalrService.leaveGroup(deletedMyGroups[0].id);
        }

        this.myGroupsChanged$.emit("");
        this.otherGroupsChanged$.emit("");
    }

    getMyGroups(): IGroup[] {
        return this.myGroups;
    }

    getAdminedGroups(): IGroup[] {
        return this.adminedGroups;
    }

    getOtherGroups() {
        return this.otherGroups;
    }

    subscribeToGroup(groupToSubscribe: IGroup) {
        if (groupToSubscribe.isPrivate) {
            groupToSubscribe.role = GroupMembershipRole.Pending;
        } else {
            var deletedOtherGroups = _.remove(this.otherGroups, groupToSubscribe);

            groupToSubscribe.role = GroupMembershipRole.Member;
            this.myGroups.push(groupToSubscribe);
            this.signalrService.joinToGroup(groupToSubscribe.id);
        }

        this.myGroupsChanged$.emit("");
        this.otherGroupsChanged$.emit("");
    }

    unsubscribeFromGroup(groupId: number) {
        var deletedAdminedGroups = _.remove(this.adminedGroups, function (g) { return g.id == groupId; });

        var deletedMyGroups = _.remove(this.myGroups, function (g) { return g.id == groupId; });
        if (deletedMyGroups.length == 1) {
            deletedMyGroups[0].role = GroupMembershipRole.NotMember;
            this.otherGroups.push(deletedMyGroups[0]);
        }

        this.signalrService.leaveGroup(groupId);

        this.myGroupsChanged$.emit("");
        this.otherGroupsChanged$.emit("");
    }

    changeGroupName(groupId: number, newName: string) {
        var myGroup = _.find(this.myGroups, function (g) { return g.id == groupId; });
        if (myGroup != undefined) {
            myGroup.name = newName;
        }

        var otherGroup = _.find(this.otherGroups, function (g) { return g.id == groupId; });
        if (otherGroup != undefined) {
            otherGroup.name = newName;
        }

        this.myGroupsChanged$.emit("");
        this.otherGroupsChanged$.emit("");
    }

    changeGroupDescription(groupId: number, newDescription: string) {
        var myGroup = _.find(this.myGroups, function (g) { return g.id == groupId; });
        if (myGroup != undefined) {
            myGroup.description = newDescription;
        }

        var otherGroup = _.find(this.otherGroups, function (g) { return g.id == groupId; });
        if (otherGroup != undefined) {
            otherGroup.description = newDescription;
        }

        this.myGroupsChanged$.emit("");
        this.otherGroupsChanged$.emit("");
    }
}