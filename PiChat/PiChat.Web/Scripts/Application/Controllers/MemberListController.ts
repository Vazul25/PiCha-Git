///<summary>
///Controller which handles the displaying of the members of a given group, and granting them administrator privilages
///</summary>
class MemberListController {
    searchText: string; //Users can be filtered by name with this bound to an input field
    group: IGroup;//Data of the group which members we are listing
    members: IGroupMember[]; //The members of the group
    static $inject = ["$scope", "GroupMemberService", "md5", "PopupDialogService", "$translate"]
    constructor(
        public $scope: ng.IScope,
        private GroupMemberService: IGroupMemberService,
        private md5: any,
        private PopupDialogService: IPopupDialogService,
        private $translate: angular.translate.ITranslateService
    ) {
        this.getMembers();
    }

    ///<summary>
    ///Gets the members belonging to the group
    ///</summary>
    getMembers(): void {
        this.GroupMemberService.getMembers(this.group.id).then(
            resp => {
                this.members = resp.data;
                this.members.forEach(m => {
                    m.emailHash = this.md5.createHash(m.email || '')
                })
            },
            (err) => {

            });
    }

    ///<summary>
    ///Grants admin rights to a member
    ///</summary>
    ///<param  name="member">Specifies the member to whom we want to give admin rights</param>
    grantAdmin(member: IGroupMember) {
        this.GroupMemberService.grantAdmin(member).then((resp) => {
            console.log(this.members[this.members.indexOf(member)].role);

            this.members[this.members.indexOf(member)].role = GroupMembershipRole.Administrator;
            console.log(this.members[this.members.indexOf(member)].role);
        },
            (err) => {
                this.PopupDialogService.showErrorAlert(this.$translate.instant('errZ'), this.$translate.instant('err8'));
            });
    }
}