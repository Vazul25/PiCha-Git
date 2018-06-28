import { Injectable, EventEmitter } from '@angular/core';

@Injectable()
export class SignalRService {
    private piChat: SignalRHubProxy;
    private piChatHub: SignalR.Hub.Connection;
    private connectionStatus: SignalRStatus = SignalRStatus.Disconnected;

    public newImagesUploaded$: EventEmitter<IImage[]>;
    public newGroupCreated$: EventEmitter<IGroup>;
    public groupDescriptionChanged$: EventEmitter<{}>;
    public groupNameChanged$: EventEmitter<{}>;
    public groupDeleted$: EventEmitter<number>;
    public imageDescriptionChanged$: EventEmitter<{}>;
    public imageDeleted$: EventEmitter<{}>;

    constructor() {
        this.piChat = $.connection.piChatHub;

        this.newImagesUploaded$ = new EventEmitter<IImage[]>();
        this.newGroupCreated$ = new EventEmitter<IGroup>();
        this.groupDescriptionChanged$ = new EventEmitter();
        this.groupNameChanged$ = new EventEmitter();
        this.groupDeleted$ = new EventEmitter<number>();
        this.imageDescriptionChanged$ = new EventEmitter();
        this.imageDeleted$ = new EventEmitter();

        this.piChat.client.debugMessage = (message: string) => {
            //console.log("SignalR DebugMessage: ", message);
        };

        this.piChat.client.showNewImages = (images: IImage[]) => {
            this.newImagesUploaded$.emit(images);
        };

        this.piChat.client.showNewGroup = (group: IGroup) => {
            this.newGroupCreated$.emit(group);
        };

        this.piChat.client.changeGroupDescription = (groupId: number, newDescription: string) => {
            this.groupDescriptionChanged$.emit({ groupId: groupId, newDescription: newDescription });
        };

        this.piChat.client.changeGroupName = (groupId: number, newName: string) => {
            this.groupNameChanged$.emit({ groupId: groupId, newName: newName });
        };

        this.piChat.client.deleteGroup = (groupId: number) => {
            this.groupDeleted$.emit(groupId);
        };

        this.piChat.client.changeImageDescription = (imageId: number, newDescription: string) => {
            this.imageDescriptionChanged$.emit({ imageId: imageId, newDescription: newDescription });
        };

        this.piChat.client.deleteImage = (imageId: number) => {
            this.imageDeleted$.emit(imageId);
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

    restartPiChat(): JQueryPromise<any> {
        return this.startPiChat();
    }

    setConnectionStatus(newStatus: SignalRStatus) {
        this.connectionStatus = newStatus;
    }

    getConnectionStatus(): SignalRStatus {
        return this.connectionStatus;
    }

    sendNewGroupToOthers(group: IGroup) {
        this.piChat.server.sendNewGroupToOthers(group);
    }

    joinToGroup(id: number) {
        this.piChat.server.joinToGroup(id).done();
    }

    joinToGroups(groupsId: Array<number>) {
        this.piChat.server.joinToGroups(groupsId);
    }

    leaveGroup(id: number) {
        this.piChat.server.leaveGroup(id).done();
    }
}