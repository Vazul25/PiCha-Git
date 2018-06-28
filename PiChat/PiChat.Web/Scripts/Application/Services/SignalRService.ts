/// <reference path="../../typings/jquery/jquery.d.ts" />

class SignalRService implements ISignalRService {
    private piChat: SignalRHubProxy;
    private piChatHub: SignalR.Hub.Connection;
    private connectionStatus: SignalRStatus = SignalRStatus.Disconnected;

    static $inject = ["$rootScope"]
    constructor(private $rootScope: ng.IRootScopeService) {
        this.piChat = $.connection.piChatHub;

        this.piChat.client.debugMessage = (message: string) => {
            console.log("DebugMessage: ", message);
        };

        this.piChat.client.showNewImages = (images: Array<IImage>) => {
            this.$rootScope.$broadcast('signalRShowNewImages', { images: images });
        };

        this.piChat.client.showNewGroup = (group: IGroup) => {
            this.$rootScope.$broadcast('signalRShowNewGroup', { group: group });
        };

        this.piChat.client.changeGroupDescription = (groupId: number, newDescription: string) => {
            this.$rootScope.$broadcast('signalRChangeGroupDescription', { groupId: groupId, newDescription: newDescription });
        };

        this.piChat.client.changeGroupName = (groupId: number, newName: string) => {
            this.$rootScope.$broadcast('signalRChangeGroupName', { groupId: groupId, newName: newName });
        };

        this.piChat.client.deleteGroup = (groupId: number) => {
            this.$rootScope.$broadcast('signalRDeleteGroup', { groupId: groupId });
        };

        this.piChat.client.changeImageDescription = (imageId: number, newDescription: string) => {
            this.$rootScope.$broadcast('signalRChangeImageDescription', { imageId: imageId, newDescription: newDescription });
        };

        this.piChat.client.deleteImage = (imageId: number) => {
            this.$rootScope.$broadcast('signalRDeleteImage', { imageId: imageId });
        };
    }

    startPiChat(): JQueryPromise<any> {
        this.piChatHub = $.connection.hub;
        //this.piChatHub.logging = true;

        $.connection.hub.error((error) => {
            console.log('SignalR error: ' + error)
        });
        
        return this.piChatHub.start();
    }

    stopPiChat() {
        console.log("SignalR connection ended!");
        this.piChatHub.stop();
    }

    restartPiChat() {
        return this.startPiChat();
    }

    setConnectionStatus(newStatus: SignalRStatus) {
        this.connectionStatus = newStatus;
    }

    getConnectionStatus(): SignalRStatus {
        return this.connectionStatus;
    }

    sendNewGroupToOthers(group: IGroup) {
        console.log("signalR sendNewGroupToOthers", this.piChat);
        this.piChat.server.sendNewGroupToOthers(group);
    }

    joinToGroup(id: number) {
        this.piChat.server.joinToGroup(id).done(() => {
            this.$rootScope.$broadcast('updateImages');
        });
    }

    joinToGroups(groupsId: Array<number>) {
        this.piChat.server.joinToGroups(groupsId);
    }

    leaveGroup(id: number) {
        this.piChat.server.leaveGroup(id).done(() => {
            this.$rootScope.$broadcast('updateImages');
        });
    }
}