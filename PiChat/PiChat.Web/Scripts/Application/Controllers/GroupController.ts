/// <reference path="../../typings/jquery/jquery.d.ts" />

// to use tooltip JQuery method in TypeScript
interface JQuery {
    tooltip: any;
}

///<summary>
/// Controller of the group site and handles groups in the app
///</summary>
class GroupController {
    hasMore: boolean;                   // tells if there are more groups which can be get
    filter: string = "";                // the filter to search between groups in which I'm not member
    isMyGroupsVisible: boolean = true;  // a button decides if my groups appear on the site or not

    otherGroups: IGroup[];              // groups where I'm not a member
    myGroups: IGroup[];                 // groups where I'm a member

    static $inject = ["$scope", "$rootScope", "GroupService", "SharedProperties", "SignalRService", "PopupDialogService", "$translate"]
    constructor(private $scope: ng.IScope,
        private $rootScope: ng.IRootScopeService,
        private GroupService: IGroupService,
        private SharedProperties: ISharedProperties,
        private SignalRService: ISignalRService,
        private PopupDialogService: IPopupDialogService,
        private $translate: angular.translate.ITranslateService) {

        // if there's a change in the memberships of the groups,
        // then applyAsync gets my groups and other groups again
        // and decides if Show more is needed
        $rootScope.$on('sharedPropertiesGroupsChanged', (event, args) => {
            //todo ha peti kész a https frissítéssel akkor ide se kell apply assync majd szerintem
            this.$scope.$applyAsync(a => {
                this.otherGroups = SharedProperties.getOtherGroups();
                this.myGroups = SharedProperties.getMyGroups();
                if (this.otherGroups.length == 25) this.hasMore = true;
            });
        });

        // responsible of enabling tooltips on the site
        $(document).ready(() => {
            $('[data-toggle="tooltip"]').tooltip();
        });
    }

    // on the site loading, it gets the lists of the groups
    // and decides if Show more is needed
    $onInit = () => {
        this.otherGroups = this.SharedProperties.getOtherGroups();
        this.myGroups = this.SharedProperties.getMyGroups();
        if (this.otherGroups.length == 25) this.hasMore = true;
    }

    ///<summary>
    /// Gets all of the other groups on HTTP GET request through a service
    /// and if another 25 groups came then shows Show more button
    ///</summary>
    getGroups = () => {
        this.GroupService.getGroups().then(resp => {
            this.SharedProperties.setOtherGroups(resp.data);
            console.log(resp.data);
            console.log(this.otherGroups);
            if (resp.data.length == 25)
                this.hasMore = true;
            console.log("Has More: " + this.hasMore);
        });
    }

    ///<summary>
    ///Shows up memberlist of a group if we click on the card of it
    ///</summary>
    showMemberList(event: MouseEvent, group: IGroup) {
        this.PopupDialogService.showMemberListDialog(event, group);
    }

    ///<summary>
    ///Gets the groups from the other groups which satisfy the filter
    ///</summary>
    getFilteredGroups = () => {
        console.log("getting filtered groups by :" + this.filter);

        this.GroupService.getFilteredGroups(this.filter).then(resp => {
            this.SharedProperties.setOtherGroups(resp.data);
            console.log(resp.data);
            console.log(this.otherGroups);
            if (resp.data.length == 25)
                this.hasMore = true;
            console.log("Has more: " + this.hasMore);
        });
    }

    ///<summary>
    ///Decides depending on the filter, that if is it a filtered search
    ///or is it a request for all of the other groups
    ///</summary>
    getGroupsSwitch = () => {
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
                this.GroupService.getMoreGroupsFromId(this.otherGroups[this.otherGroups.length - 1].id).then(resp => {
                    this.$scope.$applyAsync(apl => {
                        // update the common properties to get these later too
                        this.SharedProperties.addOtherGroups(resp.data);
                    });

                    // maybe there are another 25 groups or not
                    if (resp.data.length != 25)
                        this.hasMore = false;
                });
            }
        }
        // if it's a filtered search between the other groups
        else {
            // and the other groups list is not empty
            if (this.otherGroups != null && this.otherGroups.length > 0) {
                this.GroupService.getMoreFilteredGroupsFromId(this.filter, this.otherGroups[this.otherGroups.length - 1].id).then(resp => {
                    this.$scope.$applyAsync(apl => {
                        // update the common properties to get these later too
                        this.SharedProperties.addOtherGroups(resp.data);
                    });

                    // maybe there are another 25 groups or not
                    if (resp.data.length != 25)
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
        this.GroupService.joinGroup(group.id).then(resp => {
            // common data updates with this change
            this.$scope.$applyAsync
                (ap => {
                    this.SharedProperties.subscribeToGroup(group);
                })
        }, (err) => {
            // calls an error popup through a service
            this.PopupDialogService.showErrorAlert(this.$translate.instant('errX'), this.$translate.instant('err1'));
        });
    }

    ///<summary>
    /// Calls a service to make the user to leave the given group
    /// Unsubscribe button calls it
    ///</summary>
    leaveGroup = (group: IGroup) => {
        this.GroupService.leaveGroup(group.id).then(resp => {
            // common data updates with this change
            this.$scope.$applyAsync
                (ap => {
                    this.SharedProperties.unsubscribeFromGroup(group.id);
                })
        }, (err) => {
            // calls an error popup through a service
            this.PopupDialogService.showErrorAlert(this.$translate.instant('errX'), this.$translate.instant('err2'));
        });
    }

    ///<summary>
    /// changes the arrow on the opening-closing window
    /// which contains he list of my groups, JQuery
    ///</summary>
    toogleMyGroupsContainer() {
        this.isMyGroupsVisible = !this.isMyGroupsVisible;
        if (this.isMyGroupsVisible)
            $('#toogle-my-groups-container span').removeClass('glyphicon-chevron-down').addClass('glyphicon-chevron-up');
        else
            $('#toogle-my-groups-container span').removeClass('glyphicon-chevron-up').addClass('glyphicon-chevron-down');
    }
}