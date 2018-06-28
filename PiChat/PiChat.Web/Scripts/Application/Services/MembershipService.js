///<summary>
///A service which gets the membership requests 
///which then can be accepted or rejected by the user 
///</summary>
var MembershipService = (function () {
    function MembershipService($http, $q) {
        this.$http = $http;
        this.$q = $q;
    }
    ///<summary>
    ///Accepts a membership request, trough a http.post call
    ///</summary>
    ///<param name="membershipId">Specifies the membership which we want to set the role to member</param>
    MembershipService.prototype.acceptRequests = function (membershipId) {
        return this.$http.post("api/Membership/AcceptRequest?membershipId=" + membershipId, null);
    };
    ///<summary>
    ///Reject a membership request, trough a http.post call
    ///</summary>
    ///<param name="membershipId">Specifies the membership which we want to delete</param>
    MembershipService.prototype.rejectRequests = function (membershipId) {
        return this.$http.post("api/Membership/RejectRequest?membershipId=" + membershipId, null);
    };
    ///<summary>     
    ///Gets the membership requests for the user to accept or reject
    ///trough a http.get call
    ///</summary>
    MembershipService.prototype.getRequests = function () {
        return this.$http.get("api/Membership/GetRequests");
    };
    ///<summary>
    ///Returns the index of a membership in the groups array, given by its id
    ///</summary>
    ///<param name="memberships">Specifies the array in which we want to find the membership</param>
    ///<param name="membershipId">Specifies the memberships id that we want to find in the array</param>
    MembershipService.prototype.getIndexInMemberships = function (memberships, membershipId) {
        var index = -1;
        memberships.forEach(function (g, j) {
            if (g.groupMembershipId == membershipId)
                index = j;
        });
        return index;
    };
    MembershipService.$inject = ["$http", "$q"];
    return MembershipService;
})();
//# sourceMappingURL=MembershipService.js.map