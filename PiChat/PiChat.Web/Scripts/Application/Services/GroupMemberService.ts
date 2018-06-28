///<summary>
///A service which can be used to 
///get the members of a group, or grant admin to a user
///</summary>
class GroupMemberService implements IGroupMemberService {
    static $inject = ["$http"]
    constructor(private $http: ng.IHttpService) { }

    ///<summary>
    ///Gets the members of a group specified by groupId
    ///trough a http.get call
    ///</summary>
    ///<param name="groupId">Specifies the group which members we want to query</param>
    getMembers(groupId: number): ng.IHttpPromise<IGroupMember[]> {
        return this.$http.get("api/Group/GetGroupMembers/" + groupId);
    }

    ///<summary>
    ///Grants admin privilages to a member of the group
    ///trough a http.post call
    ///</summary>
    ///<param name="member">Specifies the member which the user wants to give admin privilages to</param>
    grantAdmin(member: IGroupMember): ng.IHttpPromise<any> {
        return this.$http.post("api/Membership/GrantAdmin", member);
    }
}