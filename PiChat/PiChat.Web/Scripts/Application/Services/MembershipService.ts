///<summary>
///A service which gets the membership requests 
///which then can be accepted or rejected by the user 
///</summary>
class MembershipService implements IMembershipService {
    static $inject = ["$http", "$q"];
    constructor(private $http: ng.IHttpService,
        private $q: ng.IQService) {

    }

    ///<summary>
    ///Accepts a membership request, trough a http.post call
    ///</summary>
    ///<param name="membershipId">Specifies the membership which we want to set the role to member</param>
    acceptRequests(membershipId: number) {
        return this.$http.post("api/Membership/AcceptRequest?membershipId=" + membershipId, null);
    }

    ///<summary>
    ///Reject a membership request, trough a http.post call
    ///</summary>
    ///<param name="membershipId">Specifies the membership which we want to delete</param>
    rejectRequests(membershipId: number) {
        return this.$http.post("api/Membership/RejectRequest?membershipId=" + membershipId, null);
    }

    ///<summary>     
    ///Gets the membership requests for the user to accept or reject
    ///trough a http.get call
    ///</summary>
    getRequests() {
        return this.$http.get("api/Membership/GetRequests");
    }

    ///<summary>
    ///Returns the index of a membership in the groups array, given by its id
    ///</summary>
    ///<param name="memberships">Specifies the array in which we want to find the membership</param>
     ///<param name="membershipId">Specifies the memberships id that we want to find in the array</param>
    getIndexInMemberships(memberships: IMembership[], membershipId: number): number {
        var index = -1;
        memberships.forEach((g, j) => {
            if (g.groupMembershipId == membershipId) index = j;
        });
        return index;
    }
}