///<summary>
///Controller which handles the displaying of the members of a given group, and granting them administrator privilages
///</summary>
var MemberListController = (function () {
    function MemberListController($scope, GroupMemberService, md5, PopupDialogService, $translate) {
        this.$scope = $scope;
        this.GroupMemberService = GroupMemberService;
        this.md5 = md5;
        this.PopupDialogService = PopupDialogService;
        this.$translate = $translate;
        this.getMembers();
    }
    ///<summary>
    ///Gets the members belonging to the group
    ///</summary>
    MemberListController.prototype.getMembers = function () {
        var _this = this;
        this.GroupMemberService.getMembers(this.group.id).then(function (resp) {
            _this.members = resp.data;
            _this.members.forEach(function (m) {
                m.emailHash = _this.md5.createHash(m.email || '');
            });
        }, function (err) {
        });
    };
    ///<summary>
    ///Grants admin rights to a member
    ///</summary>
    ///<param  name="member">Specifies the member to whom we want to give admin rights</param>
    MemberListController.prototype.grantAdmin = function (member) {
        var _this = this;
        this.GroupMemberService.grantAdmin(member).then(function (resp) {
            console.log(_this.members[_this.members.indexOf(member)].role);
            _this.members[_this.members.indexOf(member)].role = GroupMembershipRole.Administrator;
            console.log(_this.members[_this.members.indexOf(member)].role);
        }, function (err) {
            _this.PopupDialogService.showErrorAlert(_this.$translate.instant('errZ'), _this.$translate.instant('err8'));
        });
    };
    MemberListController.$inject = ["$scope", "GroupMemberService", "md5", "PopupDialogService", "$translate"];
    return MemberListController;
})();
//# sourceMappingURL=MemberListController.js.map