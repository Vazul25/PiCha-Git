///<summary>
///A service which handles most of the http request's
///concerning the groups. 
///ex: geting the first 25 of the groups then the next filtered or unfiltered,
///changing the description, name of a group, deleting a group
///subscribing and unsubscribing
///</summary>
var GroupService = (function () {
    function GroupService($http, $q) {
        this.$http = $http;
        this.$q = $q;
    }
    ///<summary>
    ///Gets all of the groups in which the user at least a member,
    ///trough a http.get call
    ///</summary>
    GroupService.prototype.getMyGroups = function () {
        return this.$http.get("api/Group/GetMyGroups");
    };
    ///<summary>
    ///Gets the first 25  groups in which the user is not a member yet,
    ///ordered descending by upload time 
    ///</summary>
    GroupService.prototype.getGroups = function () {
        return this.$http.get("api/Group/GetGroups");
    };
    ///<summary>
    ///Gets the next 25  groups in which the user is not a member yet, 
    ///starting from the groupId (not included) ordered descending by upload time 
    ///trough a http.get call
    ///</summary>
    ///<param name="groupId">Specifies the group from which we want to start taking the next 25 group</param>
    GroupService.prototype.getMoreGroupsFromId = function (groupId) {
        return this.$http.get("api/Group/GetMoreGroupsFromId/" + groupId);
    };
    ///<summary>
    ///Gets the first 25  groups in which the user is not a member yet, 
    ///ordered descending by upload time  and only if 
    ///the groups name or description contains the filter string
    ///</summary>
    ///<param name="filter">Specifies the filter which we look for in the name or description of a group</param>
    GroupService.prototype.getFilteredGroups = function (filter) {
        return this.$http.get("api/Group/GetFilteredGroups/" + filter);
    };
    ///<summary>
    ///Gets the next 25  groups in which the user is not a member yet, 
    ///ordered descending by upload time  and only if 
    ///the groups name or description contains the filter string,
    ///starting from the groupId (not included) ordered descending by upload time 
    ///trough a http.get call
    ///</summary>
    ///<param name="filter">Specifies the filter which we look for in the name or description of a group</param>
    GroupService.prototype.getMoreFilteredGroupsFromId = function (filter, groupId) {
        return this.$http.get("api/Group/GetMoreFilteredGroupsFromId/" + filter + "/" + groupId);
    };
    ///<summary>
    ///Creates a new group with the given parameters
    ///trough a http.post call
    ///</summary>
    ///<param name="groupName">Specifies the new group's name</param>
    ///<param name="isPrivate">Specifies wether the new group is private or not</param>
    GroupService.prototype.createGroup = function (name, isPrivate) {
        return this.$http.post("api/Group/CreateGroup", { name: name, isPrivate: isPrivate });
    };
    ///<summary>
    ///Joins into a group, if the group is private our role will be pending
    ///else it will be member
    ///trough a http.post call
    ///</summary>
    ///<param name="groupId">Specifies the group which the user wants to join to  </param>
    GroupService.prototype.joinGroup = function (groupId) {
        return this.$http.post("api/Group/JoinGroup", { groupId: groupId });
    };
    ///<summary>
    ///Leaves a group
    ///</summary>
    ///<param name="groupId">Specifies the group which the user wants to leave</param>
    GroupService.prototype.leaveGroup = function (groupId) {
        return this.$http.post("api/Group/LeaveGroup", { groupId: groupId });
    };
    ///<summary>
    ///Gets the members of a group specified by groupId
    ///trough a http.post call
    ///</summary>
    ///<param name="groupId">Specifies the group which members we want to query</param>
    GroupService.prototype.renameGroup = function (groupId, newName) {
        return this.$http.post("api/Group/RenameGroup", { groupId: groupId, newName: newName });
    };
    ///<summary>
    ///Gets the members of a group specified by groupId
    ///trough a http.post call
    ///</summary>
    ///<param name="groupId">Specifies the group which members we want to query</param>
    GroupService.prototype.changeDescription = function (groupId, newDescription) {
        return this.$http.post("api/Group/ChangeDescription", { groupId: groupId, newDescription: newDescription });
    };
    ///<summary>
    ///Deletes a group
    ///trough a http.delete call
    ///</summary>
    ///<param name="groupId">Specifies the group which we want to delete</param>
    GroupService.prototype.deleteGroup = function (groupId) {
        return this.$http.delete("api/Group/DeleteGroup/" + groupId);
    };
    GroupService.$inject = ["$http", "$q"];
    return GroupService;
})();
//# sourceMappingURL=GroupService.js.map