///<summary>
///A service which can be used to 
///get the members of a group, or grant admin to a user
///</summary>
var GroupMemberService = (function () {
    function GroupMemberService($http) {
        this.$http = $http;
    }
    ///<summary>
    ///Gets the members of a group specified by groupId
    ///trough a http.get call
    ///</summary>
    ///<param name="groupId">Specifies the group which members we want to query</param>
    GroupMemberService.prototype.getMembers = function (groupId) {
        return this.$http.get("api/Group/GetGroupMembers/" + groupId);
    };
    ///<summary>
    ///Grants admin privilages to a member of the group
    ///trough a http.post call
    ///</summary>
    ///<param name="member">Specifies the member which the user wants to give admin privilages to</param>
    GroupMemberService.prototype.grantAdmin = function (member) {
        return this.$http.post("api/Membership/GrantAdmin", member);
    };
    GroupMemberService.$inject = ["$http"];
    return GroupMemberService;
})();
//# sourceMappingURL=GroupMemberService.js.map