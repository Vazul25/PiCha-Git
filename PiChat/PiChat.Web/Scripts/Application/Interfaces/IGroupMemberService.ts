///<summary>
///Interface for the group member data model
///</summary>
interface IGroupMember {
    email: string;
    name: string;
    role: GroupMembershipRole;
    groupId: number;
    emailHash: string;
}

///<summary>
///Interface for the GroupMember service
///</summary>
interface IGroupMemberService {
    getMembers: (groupId: number) => ng.IHttpPromise<IGroupMember[]>;
    grantAdmin: (member: IGroupMember) => ng.IHttpPromise<any>;
}