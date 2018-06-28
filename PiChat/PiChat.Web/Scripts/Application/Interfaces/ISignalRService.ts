///<summary>
///Interface for the signalerr
///</summary>
interface SignalR {
    piChatHub: SignalRHubProxy;
}

///<summary>
///Interface for the signalerr's proxy
///</summary>
interface SignalRHubProxy {
    client: SignalRClient;
    server: SignalRServer;
}

///<summary>
///Interface for the signalerr's client side
///</summary>
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

///<summary>
///Interface for the signalerr server
///</summary>
interface SignalRServer {
    joinToGroup: (id: number) => JQueryPromise<void>;
    joinToGroups: (groupsId: Array<number>) => JQueryPromise<void>;
    leaveGroup: (id: number) => JQueryPromise<void>;
    sendNewGroupToOthers: (group: IGroup) => JQueryPromise<void>;
}

///<summary>
///Interface for the signalerr service
///</summary>
interface ISignalRService {
    startPiChat: () => JQueryPromise<any>;
    stopPiChat: () => void;
    restartPiChat: () => JQueryPromise<any>;
    setConnectionStatus: (newStatus: SignalRStatus) => void;
    getConnectionStatus: () => SignalRStatus;
    sendNewGroupToOthers: (group: IGroup) => void;
    joinToGroup: (id: number) => void;
    joinToGroups: (groupsId: Array<number>) => void;
    leaveGroup: (id: number) => void;
}