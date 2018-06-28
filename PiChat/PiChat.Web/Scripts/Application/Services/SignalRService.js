/// <reference path="../../typings/jquery/jquery.d.ts" />
var SignalRService = (function () {
    function SignalRService($rootScope) {
        var _this = this;
        this.$rootScope = $rootScope;
        this.connectionStatus = SignalRStatus.Disconnected;
        this.piChat = $.connection.piChatHub;
        this.piChat.client.debugMessage = function (message) {
            console.log("DebugMessage: ", message);
        };
        this.piChat.client.showNewImages = function (images) {
            _this.$rootScope.$broadcast('signalRShowNewImages', { images: images });
        };
        this.piChat.client.showNewGroup = function (group) {
            _this.$rootScope.$broadcast('signalRShowNewGroup', { group: group });
        };
        this.piChat.client.changeGroupDescription = function (groupId, newDescription) {
            _this.$rootScope.$broadcast('signalRChangeGroupDescription', { groupId: groupId, newDescription: newDescription });
        };
        this.piChat.client.changeGroupName = function (groupId, newName) {
            _this.$rootScope.$broadcast('signalRChangeGroupName', { groupId: groupId, newName: newName });
        };
        this.piChat.client.deleteGroup = function (groupId) {
            _this.$rootScope.$broadcast('signalRDeleteGroup', { groupId: groupId });
        };
        this.piChat.client.changeImageDescription = function (imageId, newDescription) {
            _this.$rootScope.$broadcast('signalRChangeImageDescription', { imageId: imageId, newDescription: newDescription });
        };
        this.piChat.client.deleteImage = function (imageId) {
            _this.$rootScope.$broadcast('signalRDeleteImage', { imageId: imageId });
        };
    }
    SignalRService.prototype.startPiChat = function () {
        this.piChatHub = $.connection.hub;
        //this.piChatHub.logging = true;
        $.connection.hub.error(function (error) {
            console.log('SignalR error: ' + error);
        });
        return this.piChatHub.start();
    };
    SignalRService.prototype.stopPiChat = function () {
        console.log("SignalR connection ended!");
        this.piChatHub.stop();
    };
    SignalRService.prototype.restartPiChat = function () {
        return this.startPiChat();
    };
    SignalRService.prototype.setConnectionStatus = function (newStatus) {
        this.connectionStatus = newStatus;
    };
    SignalRService.prototype.getConnectionStatus = function () {
        return this.connectionStatus;
    };
    SignalRService.prototype.sendNewGroupToOthers = function (group) {
        console.log("signalR sendNewGroupToOthers", this.piChat);
        this.piChat.server.sendNewGroupToOthers(group);
    };
    SignalRService.prototype.joinToGroup = function (id) {
        var _this = this;
        this.piChat.server.joinToGroup(id).done(function () {
            _this.$rootScope.$broadcast('updateImages');
        });
    };
    SignalRService.prototype.joinToGroups = function (groupsId) {
        this.piChat.server.joinToGroups(groupsId);
    };
    SignalRService.prototype.leaveGroup = function (id) {
        var _this = this;
        this.piChat.server.leaveGroup(id).done(function () {
            _this.$rootScope.$broadcast('updateImages');
        });
    };
    SignalRService.$inject = ["$rootScope"];
    return SignalRService;
})();
//# sourceMappingURL=SignalRService.js.map