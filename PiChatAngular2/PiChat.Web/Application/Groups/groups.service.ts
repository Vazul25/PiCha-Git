import { Injectable } from '@angular/core';
import { Http, Response, Headers, RequestOptions } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import 'rxjs/Rx';

@Injectable()
export class GroupService {
    constructor(private http: Http) {

    }

    private extractData(res: Response) {
        let data = res.json();
        return (data || {});
    }

    ///<summary>
    ///Gets all of the groups in which the user at least a member,
    ///trough a http.get call
    ///</summary>
    getMyGroups(): Promise<IGroup[]> {
        return this.http.get("api/Group/GetMyGroups")
            .map(this.extractData)
            .toPromise();
    }

    ///<summary>
    ///Gets the first 25  groups in which the user is not a member yet,
    ///ordered descending by upload time 
    ///</summary>
    getGroups(): Promise<IGroup[]> {
        return this.http.get("api/Group/GetGroups")
            .map(this.extractData)
            .toPromise();
    }

    ///<summary>
    ///Gets the next 25  groups in which the user is not a member yet, 
    ///starting from the groupId (not included) ordered descending by upload time 
    ///trough a http.get call
    ///</summary>
    ///<param name="groupId">Specifies the group from which we want to start taking the next 25 group</param>
    getMoreGroupsFromId(groupId: number): Promise<IGroup[]> {
        return this.http.get("api/Group/GetMoreGroupsFromId/" + groupId)
            .map(this.extractData)
            .toPromise();
    }

    ///<summary>
    ///Gets the first 25  groups in which the user is not a member yet, 
    ///ordered descending by upload time  and only if 
    ///the groups name or description contains the filter string
    ///</summary>
    ///<param name="filter">Specifies the filter which we look for in the name or description of a group</param>
    getFilteredGroups(filter: string): Promise<IGroup[]> {
        return this.http.get("api/Group/GetFilteredGroups/" + filter)
            .map(this.extractData)
            .toPromise();
    }

    ///<summary>
    ///Gets the next 25  groups in which the user is not a member yet, 
    ///ordered descending by upload time  and only if 
    ///the groups name or description contains the filter string,
    ///starting from the groupId (not included) ordered descending by upload time 
    ///trough a http.get call
    ///</summary>
    ///<param name="filter">Specifies the filter which we look for in the name or description of a group</param>
    getMoreFilteredGroupsFromId(filter: string, groupId: number): Promise<IGroup[]> {
        return this.http.get("api/Group/GetMoreFilteredGroupsFromId/" + filter + "/" + groupId)
            .map(this.extractData)
            .toPromise();
    }

    ///<summary>
    ///Creates a new group with the given parameters
    ///trough a http.post call
    ///</summary>
    ///<param name="groupName">Specifies the new group's name</param>
    ///<param name="isPrivate">Specifies wether the new group is private or not</param>
    createGroup(name: string, isPrivate: boolean) {
        return this.http.post("api/Group/CreateGroup", { name, isPrivate })
            .map(this.extractData)
            .toPromise();
    }

    ///<summary>
    ///Joins into a group, if the group is private our role will be pending
    ///else it will be member
    ///trough a http.post call
    ///</summary>
    ///<param name="groupId">Specifies the group which the user wants to join to  </param>
    joinGroup(groupId: number) {
        return this.http.post("api/Group/JoinGroup", { groupId })
            .toPromise();
    }

    ///<summary>
    ///Leaves a group
    ///</summary>
    ///<param name="groupId">Specifies the group which the user wants to leave</param>
    leaveGroup(groupId: number) {
        return this.http.post("api/Group/LeaveGroup", { groupId })
            .toPromise();
    }

    ///<summary>
    ///Gets the members of a group specified by groupId
    ///trough a http.post call
    ///</summary>
    ///<param name="groupId">Specifies the group which members we want to query</param>
    renameGroup(groupId: number, newName: string) {
        return this.http.post("api/Group/RenameGroup", { groupId, newName })
            .toPromise();
    }

    ///<summary>
    ///Gets the members of a group specified by groupId
    ///trough a http.post call
    ///</summary>
    ///<param name="groupId">Specifies the group which members we want to query</param>
    changeDescription(groupId: number, newDescription: string) {
        return this.http.post("api/Group/ChangeDescription", { groupId, newDescription })
            .toPromise();
    }

    ///<summary>
    ///Deletes a group
    ///trough a http.delete call
    ///</summary>
    ///<param name="groupId">Specifies the group which we want to delete</param>
    deleteGroup(groupId: number) {
        return this.http.delete("api/Group/DeleteGroup/" + groupId)
            .toPromise();
    }

    ///<summary>
    ///Gets the members of a group specified by groupId
    ///trough a http.get call
    ///</summary>
    ///<param name="groupId">Specifies the group which members we want to query</param>
    getMembers(groupId: number): Promise<IGroupMember[]>{
        return this.http.get("api/Group/GetGroupMembers/" + groupId).map((resp) => resp.json() as IGroupMember[]).toPromise();
    }

    ///<summary>
    ///Grants admin privilages to a member of the group
    ///trough a http.post call
    ///</summary>
    ///<param name="member">Specifies the member which the user wants to give admin privilages to</param>
    grantAdmin(member: IGroupMember) {
        return this.http.post("api/Membership/GrantAdmin", member).toPromise();
}
    private handleError(error: any) {
        console.error('An error occured', error);
        return Promise.reject(error.message || error);
    }
}