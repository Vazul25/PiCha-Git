///<summary>
///Interface for the image model
///</summary>
interface IImage {
    imageId: number;
    ownerName: string;
    groupName: string;
    description: string;
    uploadTime: Date;
    isMine: boolean;
}

///<summary>
///Interface for the image service
///</summary>
interface IImageService {
    getFirstTenImagesOfAll: () => ng.IHttpPromise<IImage[]>;
    getNextTenImagesOfAll: (ImageId: number) => ng.IHttpPromise<IImage[]>;
    getFirstTenImagesOfGroup: (groupId: number) => ng.IHttpPromise<IImage[]>;
    getNextTenImagesOfGroup: (groupId: number, imageId: number) => ng.IHttpPromise<IImage[]>;
    changeDescription: (imageId: number, description: string) => ng.IHttpPromise<any>;
    deleteImage: (imageId: number) => ng.IHttpPromise<any>;
}