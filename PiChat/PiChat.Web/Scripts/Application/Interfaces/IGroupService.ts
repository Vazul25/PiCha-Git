///<summary>
///Interface for the group model
///</summary>
interface IGroup {
    id: number;
    name: string;
    ownerName: string;
    description: string;
    role: GroupMembershipRole;
    isPrivate: boolean;
    picturesCount: number;
    membersCount: number;
}

///<summary>
///Interface for the Group service
///</summary>
interface IGroupService {
    getMyGroups: () => ng.IHttpPromise<IGroup[]>;
    getGroups: () => ng.IHttpPromise<IGroup[]>;
    getMoreGroupsFromId: (groupId: number) => ng.IHttpPromise<IGroup[]>;
    getFilteredGroups: (filter: string) => ng.IHttpPromise<IGroup[]>;
    getMoreFilteredGroupsFromId: (filter: string, lastId: number) => ng.IHttpPromise<IGroup[]>;
    createGroup: (groupName: string, isPrivate: boolean) => ng.IHttpPromise<IGroup>;
    joinGroup: (groupId: number) => ng.IHttpPromise<any>;
    leaveGroup: (groupId: number) => ng.IHttpPromise<any>;
    renameGroup: (groupId: number, newName: string) => ng.IHttpPromise<any>;
    changeDescription: (groupId: number, newDesc: string) => ng.IHttpPromise<any>;
    deleteGroup: (groupId: number) => ng.IHttpPromise<any>;
}