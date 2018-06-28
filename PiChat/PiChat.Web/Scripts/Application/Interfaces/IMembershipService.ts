///<summary>
///Interface for the membership model
///</summary>
interface IMembership {
    joinerName: string;
    ownerName: string;
    groupName: string;
    groupMembershipId: number;

}

///<summary>
///Interface for the membership service
///</summary>
interface IMembershipService {
    getRequests: () => ng.IHttpPromise<IMembership[]>;
    acceptRequests: (membershipId: number) => ng.IHttpPromise<any>;
    rejectRequests: (membershipId: number) => ng.IHttpPromise<any>;
    getIndexInMemberships(groups: IMembership[], id: number): number;
}