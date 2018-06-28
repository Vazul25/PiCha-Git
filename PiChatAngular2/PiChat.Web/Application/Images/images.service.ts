import { Injectable } from '@angular/core';
import { Http, Response } from '@angular/http';
import { Observable }     from 'rxjs/Observable';
import 'rxjs/Rx';

///<summary>
///A service which can get images
///delete them or change their description
///</summary>
@Injectable()
export class ImagesService {
    constructor(private http: Http) { }

    private extractData(res: Response) {
        let body = res.json();
        return (body || {}) as IImage[];
    }


    ///<summary>
    ///Gets the first 10  images from all groups in which the user is at least a member 
    ///trough a http.get call
    ///</summary>     
    getFirstTenImagesOfAll(): Promise<IImage[]> {


        return this.http.get("api/Image/GetNextTenImages/").map(this.extractData).toPromise();
    }

    ///<summary>
    ///Gets the next 10  images from all groups in which the user is at least a member 
    ///starting from the id (not included) ordered descending by upload time 
    ///trough a http.get call
    ///</summary>
    ///<param name="id">Specifies the image from which we want to start taking the next 10 </param>
    getNextTenImagesOfAll(id: number): Promise<IImage[]> {
        return this.http.get("api/Image/GetNextTenImages/" + id).map(this.extractData).toPromise();
    }

    ///<summary>
    ////Gets the next 10  images from  the group given by groupId 
    ///starting from the imageId (not included) ordered descending by upload time 
    ///trough a http.get call
    ///</summary>
    ///<param name="groupId">Specifies the group from which we want to get the next 10 images</param>
    ///<param name="imageId">Specifies the image from which we want to start taking the next 10 images</param>
    getNextTenImagesOfGroup(groupId: number, imageId: number): Promise<IImage[]> {
        return this.http.get("api/Image/GetNextTenImagesOfGroup/" + groupId + "/" + imageId).map(this.extractData).toPromise();
    }

    ///<summary>
    ////Gets the first 10  images from  the group given by groupId 
    ///trough a http.get call
    ///</summary>
    ///<param name="groupId">Specifies the group from which we want to get the 10 images</param>
    getFirstTenImagesOfGroup(groupId: number): Promise<IImage[]> {
        return this.http.get("api/Image/GetNextTenImagesOfGroup/" + groupId).map(this.extractData).toPromise();
    }

    ///<summary>
    ///Changes the description of the image
    ///trough a http.post call
    ///</summary>
    ///<param name="imageId">Specifies the image   whiches description we want to change</param>
    ///<param name="newDescription">Specifies the new description to which we want to change the old one</param>
    changeDescription(imageId: number, newDescription: string) {
        return this.http.post("api/Image/ChangeDescription", { imageId, newDescription }).toPromise();
    }

    ///<summary>
    ///Delete an image
    ///trough a http.delete call
    ///</summary>
    ///<param name="imageId">Specifies the image which we want to delete</param>
    deleteImage(id: number) {
        return this.http.delete("api/Image/DeleteImage/" + id).toPromise();
    }
}