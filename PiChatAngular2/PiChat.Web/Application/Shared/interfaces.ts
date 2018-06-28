interface SignalR {
    piChatHub: SignalRHubProxy;
}

interface SignalRHubProxy {
    client: SignalRClient;
    server: SignalRServer;
}

interface SignalRClient {
    debugMessage: (message: string) => void;
    showNewImages: (images: IImage[]) => void;
    showNewGroup: (group: IGroup) => void;
    changeGroupDescription: (groupId: number, newDescription: string) => void;
    changeGroupName: (groupId: number, newName: string) => void;
    deleteGroup: (groupId: number) => void;
    changeImageDescription: (imageId: number, newDescription: string) => void;
    deleteImage: (imageId: number) => void;
}

interface SignalRServer {
    joinToGroup: (id: number) => JQueryPromise<void>;
    joinToGroups: (groupsId: Array<number>) => JQueryPromise<void>;
    leaveGroup: (id: number) => JQueryPromise<void>;
    sendNewGroupToOthers: (group: IGroup) => JQueryPromise<void>;
}

interface IGroupMember {
    email: string;
    name: string;
    role: GroupMembershipRole;
    groupId: number;
    emailHash: string;
}

interface JQuery {
    pinto: any;
    select2: any;
}