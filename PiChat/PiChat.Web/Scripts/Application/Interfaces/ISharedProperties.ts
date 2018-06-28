///<summary>
///Interface for the shared properties service
///</summary>
interface ISharedProperties {
    waitingForResp: boolean;

    getServerUrl: () => string;
    getProfile: () => IProfile;
    getAccessToken: () => string;
    getUserEmail: () => string;
    getUserName: () => string;
    getUserEmailHash: () => string;
    changeUserName: (newName: string) => void;
    login: (newAccessToken: string, email: string, name: string) => void;
    logout: () => void;
    isUserLoggedIn: () => boolean;
    increaseRequestsCounter: (url: string) => void;
    decreaseRequestsCounter: (url: string) => void;
    setMyGroups: (groups: IGroup[]) => void;
    setOtherGroups: (groups: IGroup[]) => void;
    addOtherGroup: (group: IGroup) => void;
    addOtherGroups: (groups: IGroup[]) => void;
    createGroup: (newGroup: IGroup) => void;
    removeGroup: (groupId: number) => void;
    getMyGroups: () => IGroup[];
    getAdminedGroups: () => IGroup[];
    getOtherGroups: () => IGroup[];
    subscribeToGroup: (groupToSubscribe: IGroup) => void;
    unsubscribeFromGroup: (id: number) => void;
    changeGroupName: (groupId: number, newName: string) => void;
    changeGroupDescription: (groupId: number, newDescription: string) => void;
}