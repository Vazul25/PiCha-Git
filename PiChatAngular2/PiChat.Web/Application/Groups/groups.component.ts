/// <reference path="../../Scripts/typings/jquery/jquery.d.ts" />

import { Component, OnInit, ViewChild, OnDestroy, EventEmitter } from "@angular/core";
import {Control} from "@angular/common";
import { ActivatedRoute } from "@angular/router";
import { TranslateService, TranslatePipe } from 'ng2-translate/ng2-translate';
import { MD_BUTTON_DIRECTIVES } from '@angular2-material/button';
import { MD_GRID_LIST_DIRECTIVES } from '@angular2-material/grid-list';
import { MD_INPUT_DIRECTIVES } from '@angular2-material/input';
import { MdIcon, MdIconRegistry } from '@angular2-material/icon';
import { MD_TOOLBAR_DIRECTIVES } from '@angular2-material/toolbar';
import { SharedProperties } from "../Shared/sharedproperties.service";
import { GroupService } from './groups.service';
import { SignalRService } from '../Shared/signalr.service';
import { MODAL_DIRECTIVES, ModalComponent  } from 'ng2-bs3-modal/ng2-bs3-modal';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/debounceTime';
import * as _ from 'lodash';
import { MD5Service } from '../Shared/md5.service';
import { NgForm, REACTIVE_FORM_DIRECTIVES } from '@angular/forms';

@Component({
    selector: "groups",
    templateUrl: "/Application/Groups/groups.component.html",
    styleUrls: ["/Application/Groups/groups.component.css"],
    directives: [
        MD_BUTTON_DIRECTIVES,
        MD_GRID_LIST_DIRECTIVES,
        MD_INPUT_DIRECTIVES,
        MD_TOOLBAR_DIRECTIVES,
        MdIcon,
        MODAL_DIRECTIVES,
        REACTIVE_FORM_DIRECTIVES
    ],
    providers: [MdIconRegistry],
    pipes: [TranslatePipe]
})

export class GroupsComponent implements OnInit {
    isMyGroupsVisible: boolean = true;  // a button decides if my groups appear on the site or not
    hasMore: boolean = false;           // tells if there are more groups which can be get
    filter: string = "";                // the filter to search between groups in which I'm not member
    otherGroups: IGroup[] = [];         // groups where I'm not a member
    myGroups: IGroup[] = [];            // groups where I'm a member
    @ViewChild('listMembersModal') listMembersModal: ModalComponent;

    members: IGroupMember[];
    groupOfListing: IGroup;
    searchText: string;
    term: Control = new Control();
    filteredMembers: IGroupMember[];
    filterControl: Control = new Control();

    private newGroupCreatedSubscription: EventEmitter<any>;
    private myGroupsChangedSubscription: EventEmitter<any>;
    private otherGroupsChangedSubscription: EventEmitter<any>;

    constructor(private route: ActivatedRoute, private groupService: GroupService, private sharedProperties: SharedProperties, public translate: TranslateService, private MD5Service: MD5Service, private signalrService: SignalRService) {
        //todo leiratkozni destruktorban
        this.term.valueChanges
            .debounceTime(500)
            .subscribe((term: any) => {
                this.filteredMembers = [];
                if (!this.term.value) this.filteredMembers = this.members;
                else {
                    this.members.forEach(item => {
                        if (item.name.toUpperCase().indexOf(this.term.value.toUpperCase()) != -1) this.filteredMembers.push(item);
                    });
                }
            });

        this.newGroupCreatedSubscription = this.signalrService.newGroupCreated$.subscribe((group: IGroup) => {
            this.otherGroups.push(group);
        });

        this.filterControl.valueChanges
            .debounceTime(2000)
            .subscribe((newValue: any) => {
                this.filter = newValue;
                this.getGroupsSwitch();
            });

        this.otherGroupsChangedSubscription = this.sharedProperties.otherGroupsChanged$.subscribe(() => {
            this.otherGroups = this.sharedProperties.getOtherGroups();
        });

        this.myGroupsChangedSubscription = this.sharedProperties.myGroupsChanged$.subscribe(() => {
            this.myGroups = this.sharedProperties.getMyGroups();
        });
    }

    ngOnInit() {
        this.otherGroups = this.sharedProperties.getOtherGroups();
        this.myGroups = this.sharedProperties.getMyGroups();
        if (this.otherGroups.length == 25)
            this.hasMore = true;
    }

    ngOnDestroy() {
        this.otherGroupsChangedSubscription.unsubscribe();
        this.myGroupsChangedSubscription.unsubscribe();
        this.newGroupCreatedSubscription.unsubscribe();
    }

    ///<summary>
    /// Gets all of the other groups on HTTP GET request through a service
    /// and if another 25 groups came then shows Show more button
    ///</summary>
    getGroups() {
        this.groupService.getGroups().then(groups => {
            this.sharedProperties.setOtherGroups(groups);
            if (groups.length == 25)
                this.hasMore = true;
        });
    }

    ///<summary>
    ///Gets the groups from the other groups which satisfy the filter
    ///</summary>
    getFilteredGroups() {
        this.groupService.getFilteredGroups(this.filter).then(groups => {
            this.sharedProperties.setOtherGroups(groups);
            if (groups.length == 25)
                this.hasMore = true;
        });
    }

    ///<summary>
    ///Decides depending on the filter, that if is it a filtered search
    ///or is it a request for all of the other groups
    ///</summary>
    getGroupsSwitch() {
        if (this.filter == "") {
            this.getGroups();
        }
        else this.getFilteredGroups();
    }

    ///<summary>
    ///Gets new 25 groups from the other groups if we click Show more button
    ///</summary>
    showMore = () => {
        // if there's no filter just get all other groups
        if (this.filter == "") {
            // and the other groups list is not empty
            if (this.otherGroups != null && this.otherGroups.length > 0) {
                this.groupService.getMoreGroupsFromId(this.otherGroups[this.otherGroups.length - 1].id).then(groups => {
                    this.sharedProperties.addOtherGroups(groups);

                    // maybe there are another 25 groups or not
                    if (groups.length != 25)
                        this.hasMore = false;
                });
            }
        }
        // if it's a filtered search between the other groups
        else {
            // and the other groups list is not empty
            if (this.otherGroups != null && this.otherGroups.length > 0) {
                this.groupService.getMoreFilteredGroupsFromId(this.filter, this.otherGroups[this.otherGroups.length - 1].id).then(groups => {
                    this.sharedProperties.addOtherGroups(groups);

                    // maybe there are another 25 groups or not
                    if (groups.length != 25)
                        this.hasMore = false;
                });
            }
        }
    }

    ///<summary>
    /// Calls a service to make the user to join to the given group
    /// Subscribe button calls it
    ///</summary>
    joinGroup = (group: IGroup) => {
        this.groupService.joinGroup(group.id).then((resp: any) => {
            this.sharedProperties.subscribeToGroup(group);
        });
    }

    ///<summary>
    /// Calls a service to make the user to leave the given group
    /// Unsubscribe button calls it
    ///</summary>
    leaveGroup = (group: IGroup) => {
        this.groupService.leaveGroup(group.id).then((resp: any) => {
            this.sharedProperties.unsubscribeFromGroup(group.id);
        });
    }

    ///<summary>
    ///Gets the members belonging to the group
    ///</summary>
    getMembers(group: IGroup): void {
        this.groupOfListing = group;
        this.members = [];
        this.filteredMembers = [];
        this.groupService.getMembers(group.id).then(
            resp => {
                this.members = resp;
                this.members.forEach(m => {
                    m.emailHash = this.MD5Service.createHash(m.email || '')
                });
                this.filteredMembers = (this.filteredMembers || []).concat(this.members);
            });
    }

    ///<summary>
    ///Grants admin rights to a member
    ///</summary>
    ///<param  name="member">Specifies the member to whom we want to give admin rights</param>
    grantAdmin(member: IGroupMember) {
        this.groupService.grantAdmin(member).then((resp) => {
            this.members[this.members.indexOf(member)].role = GroupMembershipRole.Administrator;
        });
    }
}