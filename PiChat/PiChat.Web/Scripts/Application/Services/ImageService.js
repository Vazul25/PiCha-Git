///<summary>
///A service which can get images
///delete them or change their description
///</summary>
var ImageService = (function () {
    function ImageService($http, $q) {
        this.$http = $http;
        this.$q = $q;
    }
    ///<summary>
    ///Gets the first 10  images from all groups in which the user is at least a member 
    ///trough a http.get call
    ///</summary>     
    ImageService.prototype.getFirstTenImagesOfAll = function () {
        return this.$http.get("api/Image/GetNextTenImages/");
    };
    ///<summary>
    ///Gets the next 10  images from all groups in which the user is at least a member 
    ///starting from the id (not included) ordered descending by upload time 
    ///trough a http.get call
    ///</summary>
    ///<param name="id">Specifies the image from which we want to start taking the next 10 </param>
    ImageService.prototype.getNextTenImagesOfAll = function (id) {
        return this.$http.get("api/Image/GetNextTenImages/" + id);
    };
    ///<summary>
    ////Gets the next 10  images from  the group given by groupId 
    ///starting from the imageId (not included) ordered descending by upload time 
    ///trough a http.get call
    ///</summary>
    ///<param name="groupId">Specifies the group from which we want to get the next 10 images</param>
    ///<param name="imageId">Specifies the image from which we want to start taking the next 10 images</param>
    ImageService.prototype.getNextTenImagesOfGroup = function (groupId, imageId) {
        return this.$http.get("api/Image/GetNextTenImagesOfGroup/" + groupId + "/" + imageId);
    };
    ///<summary>
    ////Gets the first 10  images from  the group given by groupId 
    ///trough a http.get call
    ///</summary>
    ///<param name="groupId">Specifies the group from which we want to get the 10 images</param>
    ImageService.prototype.getFirstTenImagesOfGroup = function (groupId) {
        return this.$http.get("api/Image/GetNextTenImagesOfGroup/" + groupId);
    };
    ///<summary>
    ///Changes the description of the image
    ///trough a http.post call
    ///</summary>
    ///<param name="imageId">Specifies the image   whiches description we want to change</param>
    ///<param name="newDescription">Specifies the new description to which we want to change the old one</param>
    ImageService.prototype.changeDescription = function (imageId, newDescription) {
        return this.$http.post("api/Image/ChangeDescription", { imageId: imageId, newDescription: newDescription });
    };
    ///<summary>
    ///Delete an image
    ///trough a http.delete call
    ///</summary>
    ///<param name="imageId">Specifies the image which we want to delete</param>
    ImageService.prototype.deleteImage = function (id) {
        return this.$http.delete("api/Image/DeleteImage/" + id);
    };
    ImageService.$inject = ["$http", "$q"];
    return ImageService;
})();
//# sourceMappingURL=ImageService.js.map