///<summary>
///A service which handles http calls concerning the profile
///</summary>
import { Injectable } from '@angular/core';
import { Http, Response } from '@angular/http';
import { Observable }     from 'rxjs/Observable';
import 'rxjs/Rx';

@Injectable()
export class ProfileService {
    constructor(private http: Http) { }

    ///<summary>
    ///Changes the user's password trough a http post.
    ///</summary>
    ///<param name="oldPassword">The current password of the user</param>
    ///<param name="newPassword">The new password of the user 
    ////                         to which we want to change the old< /param>
    ///<param name="newPasswordConfirm">Confirmation password for the newPassword, they must match</param>
    changePassword(oldPassword: string, newPassword: string, newPasswordConfirm: string) {
        return this.http.post("api/Account/ChangePassword", { oldPassword, newPassword, newPasswordConfirm }).toPromise();
    }

    ///<summary>
    ///Changes the user's name trough a http post.
    ///</summary>
    ///<param name="newName">The new name which we want to change the old to</param>
    changeName(newName: string) {
        return this.http.post("api/Account/ChangeName", { newName }).toPromise();
    }
}
