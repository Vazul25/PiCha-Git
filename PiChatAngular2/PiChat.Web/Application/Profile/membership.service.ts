import { Injectable } from '@angular/core';
import { Http, Response } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import 'rxjs/Rx';

@Injectable()
export class MembershipService {
    constructor(private http: Http) { }

    private extractData(res: Response) {
        let data = res.json();
        return (data || {});
    }

    getRequests() {
        return this.http.get("api/Membership/GetRequests")
            .map(this.extractData)
            .toPromise();
    }

    acceptRequests(membershipId: number) {
        return this.http.post("api/Membership/AcceptRequest?membershipId=" + membershipId, null)
            .toPromise();
    }

    rejectRequests(membershipId: number) {
        return this.http.post("api/Membership/RejectRequest?membershipId=" + membershipId, null)
            .toPromise();
    }
}