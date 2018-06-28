/// <reference path="../../typings/jquery/jquery.d.ts" />

// REVIEW: ennek saját d.ts fájlban volna a helye, mert így mindenhol látszik, pedig itt van definiálva.
// to use these JQuery methods in TypeScript
interface JQuery {
    pinto: any;
}

///<summary>
/// The controller that handles the displaying, deleting, renameing,
/// filtering by groups, description changeing and magnification of the images
///</summary>
class ImageListController {
    selectedGroup: number = -1;                                                 // actually selected groups id for filtering purposes, -1 means "All"
    selectedImageSize: string = 'medium';                                       // actually selected size of the displaying images
    hasMore: boolean;                                                           // boolean signaling whether the server has more images to show, show more button hides if this is true
    mycustomFullscreen: boolean = this.$mdMedia('xs') || this.$mdMedia('sm');   // dialog size config
    images: Array<IImage> = [];                                                 // the array which contains the information of the images that were loaded in
    myGroups: Array<IGroup> = [];                                               // the array which contains our groups in which we can view the images

    static $inject = ["$scope", "$rootScope", "$mdDialog", "$mdMedia", "SharedProperties", "ImageService", "GroupService", "$translate", "PopupDialogService"];
    constructor(private $scope: ng.IScope,
        private $rootScope: ng.IRootScopeService,
        private $mdDialog: ng.material.IDialogService,
        private $mdMedia: ng.material.IMedia,
        private SharedProperties: ISharedProperties,
        private ImageService: ImageService,
        private GroupService: GroupService,
        private $translate: angular.translate.ITranslateService,
        private PopupDialogService: IPopupDialogService) {


        //Subscribe to signalerr event, to display newly uploaded images in real time
        $rootScope.$on('signalRShowNewImages', (event, args) => {
            if (this.selectedGroup == -1) {
                args.images.forEach((image: IImage, index: number) => {
                    this.$scope.$applyAsync(() => {
                        this.images.unshift(image);
                    });
                });
            }
        });
         //Subscribe to signalerr event, to display newly updated image description in real time
        $rootScope.$on('signalRChangeImageDescription', (event, args) => {
            this.images.forEach((image, index) => {
                if (image.imageId == args.imageId) {
                    this.$scope.$applyAsync(() => {
                        image.description = args.newDescription;
                        this.refreshImagesGrid();
                    });
                }
            });
        });
            //Subscribe to signalerr event, to delete newly deleted images from our array in real time
        $rootScope.$on('signalRDeleteImage', (event, args) => {
            var imageIndex = -1;
            this.images.forEach((image, index) => {
                if (image.imageId == args.imageId) {
                    imageIndex = index;
                }
            });

            if (imageIndex > -1) {
                this.$scope.$applyAsync(() => {
                    this.images.splice(imageIndex, 1);
                    this.refreshImagesGrid();
                });
            }
        });
        //Subscribe to signalerr event, to refresh images  
        $rootScope.$on('updateImages', (event, args) => {
            this.selectedGroup = -1;
            this.getImages();
        });
        //Subscribe to signalerr event, to refresh groups when there is any change in them 
        $rootScope.$on('sharedPropertiesGroupsChanged', (event, args) => {
            this.myGroups = this.SharedProperties.getMyGroups();
        });
        //Subscribe to signalerr event, to refresh images when they are finished downloading
        $rootScope.$on('sharedPropertiesImagesLoaded', (event, args) => {
            this.refreshImagesGrid();
        });
    }

    ///<summary>
    ///Gets the data on initialization 
    ///</summary>
    $onInit = () => {
        this.getImages();
        this.myGroups = this.SharedProperties.getMyGroups();
    }

    ///<summary>
    /// Refreshes the image grid to display the images in an ordered manner
    ///</summary>
    refreshImagesGrid() {
        var scrollYPos = window.scrollY;
        setTimeout(() => {
            var itemWidth = $('.grid-sizer').width() - 10;
            $(".grid").pinto({
                itemWidth: itemWidth
            });

            window.scroll(0, scrollYPos);
        }, 100);
    }

    ///<summary>
    ///Gets the first 10 images without filter trough the image service, and sets the images,hasMore variables
    ///</summary>
    getImages() {
        this.ImageService.getFirstTenImagesOfAll().then(resp => {
            this.images = resp.data;

            if (this.images.length == 10)
                this.hasMore = true;
        });
    }

    ///<summary>
    ///Gets the first 10 images of a group trough the image service, and sets the images,hasMore variables
    ///</summary>
    getImagesByGroup(groupId: number) {
        this.ImageService.getFirstTenImagesOfGroup(groupId).then(resp => {
            this.images = resp.data;

            if (this.images.length == 10)
                this.hasMore = true;
        });
    }

    ///<summary>
    ///Gets the next 10 images, if the selectedGroup variable is not null then of a given group else from all groups
    ///trough the image service and concatanates it to the images variable also sets hasMore variable
    ///</summary>
    showMore() {
        console.log(this.selectedGroup);
        // if we want all the pictures to show
        if (this.selectedGroup == -1) {
            if (this.images != null && this.images.length > 0) {
                this.ImageService.getNextTenImagesOfAll(this.images[this.images.length - 1].imageId).then(resp => {
                    this.$scope.$applyAsync(apl => {
                        this.images = this.images.concat(resp.data)
                    });
                    // if there's no more 10 pictures to load in
                    if (resp.data.length != 10)
                        this.hasMore = false;
                });
            }
        }
        // if we want to show pictures just from one of the pictures
        else {
            if (this.images != null && this.images.length > 0) {
                this.ImageService.getNextTenImagesOfGroup(this.selectedGroup, this.images[this.images.length - 1].imageId).then(resp => {
                    this.$scope.$applyAsync(apl => {
                        this.images = this.images.concat(resp.data)
                    });
                    // if there's no more 10 pictures to load in
                    if (resp.data.length != 10)
                        this.hasMore = false;
                });
            }
        }
    }

    ///<summary>
    ///Sets the image size trough jquery to small medium or large 
    ///</summary>
    ///<param name="selectedSize">A string that specifies the wished display size of the image, "small","large" or by default medium <param>
    setImageSize(selectedSize: string) {
        switch (selectedSize) {
            case 'large':
                $('.grid-sizer').width("100%")
                break;
            case 'small':
                $('.grid-sizer').width("33.33%")
                break;
            default:
                $('.grid-sizer').width("50%")
        }

        this.refreshImagesGrid();
    }

    ///<summary>
    ///Shows a popup window for changing the description of a given image, trough the PopupDialogService
    ///</summary>
    ///<param name="imageId">Specifies the image <param>
    ///<param name="event">Specifies the target event <param>
    showChangeDescriptionDialog(event: MouseEvent, imageId: number) {
        var useFullScreen = (this.$mdMedia('xs') || this.$mdMedia('sm') || this.$mdMedia('md') || this.$mdMedia('lg'));
        this.PopupDialogService.showChangeImageDescriptionDialog(event, useFullScreen).then((newDescription: string) => {
            this.ImageService.changeDescription(imageId, newDescription).then(resp => { }, err => {
                this.PopupDialogService.showErrorAlert(this.$translate.instant('msg7') + " " + this.$translate.instant('errY'), this.$translate.instant('err6'));
            });
        });

        
    }

    ///<summary>
    ///Shows a popup window for deleting a given image, trough the PopupDialogService
    ///</summary>
    ///<param name="imageId">Specifies the image <param>
    ///<param name="event">Specifies the target event <param>
    showDeleteImageDialog(event: MouseEvent, imageId: number) {
        this.PopupDialogService.showConfirmDialog(this.$translate.instant('que1'), this.$translate.instant('que2'), event).then(() => {
            this.ImageService.deleteImage(imageId).then(resp => { }, err => {
                this.PopupDialogService.showErrorAlert(this.$translate.instant('msg7') + " " + this.$translate.instant('errY'), this.$translate.instant('err7'));
            });
        });
    }
}