/// <reference path="../../typings/jquery/jquery.d.ts" />
///<summary>
/// Controller of the group site and handles groups in the app
///</summary>
var GroupController = (function () {
    function GroupController($scope, $rootScope, GroupService, SharedProperties, SignalRService, PopupDialogService, $translate) {
        var _this = this;
        this.$scope = $scope;
        this.$rootScope = $rootScope;
        this.GroupService = GroupService;
        this.SharedProperties = SharedProperties;
        this.SignalRService = SignalRService;
        this.PopupDialogService = PopupDialogService;
        this.$translate = $translate;
        this.filter = ""; // the filter to search between groups in which I'm not member
        this.isMyGroupsVisible = true; // a button decides if my groups appear on the site or not
        // on the site loading, it gets the lists of the groups
        // and decides if Show more is needed
        this.$onInit = function () {
            _this.otherGroups = _this.SharedProperties.getOtherGroups();
            _this.myGroups = _this.SharedProperties.getMyGroups();
            if (_this.otherGroups.length == 25)
                _this.hasMore = true;
        };
        ///<summary>
        /// Gets all of the other groups on HTTP GET request through a service
        /// and if another 25 groups came then shows Show more button
        ///</summary>
        this.getGroups = function () {
            _this.GroupService.getGroups().then(function (resp) {
                _this.SharedProperties.setOtherGroups(resp.data);
                console.log(resp.data);
                console.log(_this.otherGroups);
                if (resp.data.length == 25)
                    _this.hasMore = true;
                console.log("Has More: " + _this.hasMore);
            });
        };
        ///<summary>
        ///Gets the groups from the other groups which satisfy the filter
        ///</summary>
        this.getFilteredGroups = function () {
            console.log("getting filtered groups by :" + _this.filter);
            _this.GroupService.getFilteredGroups(_this.filter).then(function (resp) {
                _this.SharedProperties.setOtherGroups(resp.data);
                console.log(resp.data);
                console.log(_this.otherGroups);
                if (resp.data.length == 25)
                    _this.hasMore = true;
                console.log("Has more: " + _this.hasMore);
            });
        };
        ///<summary>
        ///Decides depending on the filter, that if is it a filtered search
        ///or is it a request for all of the other groups
        ///</summary>
        this.getGroupsSwitch = function () {
            if (_this.filter == "") {
                _this.getGroups();
            }
            else
                _this.getFilteredGroups();
        };
        ///<summary>
        ///Gets new 25 groups from the other groups if we click Show more button
        ///</summary>
        this.showMore = function () {
            // if there's no filter just get all other groups
            if (_this.filter == "") {
                // and the other groups list is not empty
                if (_this.otherGroups != null && _this.otherGroups.length > 0) {
                    _this.GroupService.getMoreGroupsFromId(_this.otherGroups[_this.otherGroups.length - 1].id).then(function (resp) {
                        _this.$scope.$applyAsync(function (apl) {
                            // update the common properties to get these later too
                            _this.SharedProperties.addOtherGroups(resp.data);
                        });
                        // maybe there are another 25 groups or not
                        if (resp.data.length != 25)
                            _this.hasMore = false;
                    });
                }
            }
            else {
                // and the other groups list is not empty
                if (_this.otherGroups != null && _this.otherGroups.length > 0) {
                    _this.GroupService.getMoreFilteredGroupsFromId(_this.filter, _this.otherGroups[_this.otherGroups.length - 1].id).then(function (resp) {
                        _this.$scope.$applyAsync(function (apl) {
                            // update the common properties to get these later too
                            _this.SharedProperties.addOtherGroups(resp.data);
                        });
                        // maybe there are another 25 groups or not
                        if (resp.data.length != 25)
                            _this.hasMore = false;
                    });
                }
            }
        };
        ///<summary>
        /// Calls a service to make the user to join to the given group
        /// Subscribe button calls it
        ///</summary>
        this.joinGroup = function (group) {
            _this.GroupService.joinGroup(group.id).then(function (resp) {
                // common data updates with this change
                _this.$scope.$applyAsync(function (ap) {
                    _this.SharedProperties.subscribeToGroup(group);
                });
            }, function (err) {
                // calls an error popup through a service
                _this.PopupDialogService.showErrorAlert(_this.$translate.instant('errX'), _this.$translate.instant('err1'));
            });
        };
        ///<summary>
        /// Calls a service to make the user to leave the given group
        /// Unsubscribe button calls it
        ///</summary>
        this.leaveGroup = function (group) {
            _this.GroupService.leaveGroup(group.id).then(function (resp) {
                // common data updates with this change
                _this.$scope.$applyAsync(function (ap) {
                    _this.SharedProperties.unsubscribeFromGroup(group.id);
                });
            }, function (err) {
                // calls an error popup through a service
                _this.PopupDialogService.showErrorAlert(_this.$translate.instant('errX'), _this.$translate.instant('err2'));
            });
        };
        // if there's a change in the memberships of the groups,
        // then applyAsync gets my groups and other groups again
        // and decides if Show more is needed
        $rootScope.$on('sharedPropertiesGroupsChanged', function (event, args) {
            //todo ha peti kész a https frissítéssel akkor ide se kell apply assync majd szerintem
            _this.$scope.$applyAsync(function (a) {
                _this.otherGroups = SharedProperties.getOtherGroups();
                _this.myGroups = SharedProperties.getMyGroups();
                if (_this.otherGroups.length == 25)
                    _this.hasMore = true;
            });
        });
        // responsible of enabling tooltips on the site
        $(document).ready(function () {
            $('[data-toggle="tooltip"]').tooltip();
        });
    }
    ///<summary>
    ///Shows up memberlist of a group if we click on the card of it
    ///</summary>
    GroupController.prototype.showMemberList = function (event, group) {
        this.PopupDialogService.showMemberListDialog(event, group);
    };
    ///<summary>
    /// changes the arrow on the opening-closing window
    /// which contains he list of my groups, JQuery
    ///</summary>
    GroupController.prototype.toogleMyGroupsContainer = function () {
        this.isMyGroupsVisible = !this.isMyGroupsVisible;
        if (this.isMyGroupsVisible)
            $('#toogle-my-groups-container span').removeClass('glyphicon-chevron-down').addClass('glyphicon-chevron-up');
        else
            $('#toogle-my-groups-container span').removeClass('glyphicon-chevron-up').addClass('glyphicon-chevron-down');
    };
    GroupController.$inject = ["$scope", "$rootScope", "GroupService", "SharedProperties", "SignalRService", "PopupDialogService", "$translate"];
    return GroupController;
})();
//# sourceMappingURL=GroupController.js.map