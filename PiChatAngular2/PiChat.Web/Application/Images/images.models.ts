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