///<reference path="./groupmembershiprole.models.ts"/>

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