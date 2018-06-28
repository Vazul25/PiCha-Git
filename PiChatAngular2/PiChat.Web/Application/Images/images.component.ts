import { Component, EventEmitter, OnInit, OnDestroy, ViewChild } from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import { TranslateService, TranslatePipe } from 'ng2-translate/ng2-translate';
import { MD_CARD_DIRECTIVES } from '@angular2-material/card';
import { MD_BUTTON_DIRECTIVES } from '@angular2-material/button';
import { MD_INPUT_DIRECTIVES } from '@angular2-material/input';
import { NG2_DROPDOWN_DIRECTIVES } from 'ng2-material-dropdown';
import { MODAL_DIRECTIVES, ModalComponent } from 'ng2-bs3-modal/ng2-bs3-modal';
import { SharedProperties } from "../Shared/sharedproperties.service";
import { SignalRService } from "../Shared/signalr.service";
import { ImagesService } from './images.service';
import { HttpSrcDirective } from "./httpSrc.directive";
import { ToastService } from "../Shared/toast.service";
import { ImagesGridService } from './imagesgrid.service';
import * as _ from 'lodash';

@Component({
    selector: "images",
    templateUrl: "/Application/Images/images.component.html",
    providers: [ImagesService],
    directives: [
        MD_CARD_DIRECTIVES,
        MD_BUTTON_DIRECTIVES,
        MD_INPUT_DIRECTIVES,
        NG2_DROPDOWN_DIRECTIVES,
        MODAL_DIRECTIVES,
        HttpSrcDirective
    ],
    pipes: [TranslatePipe]
})

export class ImagesComponent implements OnInit, OnDestroy {
    myGroupsChangedSubscription: EventEmitter<any>;
    newImagesUploadedSubscription: EventEmitter<any>;
    imageDescriptionChangedSubscription: EventEmitter<any>;
    imageDeletedSubscription: EventEmitter<any>;
    myGroups: IGroup[] = [];
    images: Array<IImage> = [];
    selectedGroupsId: number = -1;
    selectedGroupsName: string = this.translate.instant('all');
    selectedSize: string = this.translate.instant('md');
    hasMore: boolean = true;
    batchSize: number = 10;
    selectedItem: Event;
    newImageDescription: string = "";
    selectedImageId: number = 0;

    @ViewChild('deleteImageModal') deleteImageModal: ModalComponent;
    @ViewChild('changeImageDescriptionModal') changeImageDescriptionModal: ModalComponent;

    constructor(private route: ActivatedRoute, private sharedProperties: SharedProperties, private signalrService: SignalRService, private ImagesService: ImagesService, private toastService: ToastService, public translate: TranslateService, private imagesGridService: ImagesGridService) {
        this.myGroupsChangedSubscription = this.sharedProperties.myGroupsChanged$.subscribe(() => {
            this.myGroups = this.sharedProperties.getMyGroups();

            //Todo lehetne olyat hogy mikor kivágnak minket egy csoportból amit épp nézünk, akkor frisítse az oldalt.
        });

        this.newImagesUploadedSubscription = this.signalrService.newImagesUploaded$.subscribe((images: IImage[]) => {
            images.forEach((image) => {
                this.images.unshift(image);
            });
        });

        this.imageDescriptionChangedSubscription = this.signalrService.imageDescriptionChanged$.subscribe((event: any) => {
            let changedImage = _.find(this.images, (iterator) => { return iterator.imageId == event.imageId; });
            if (changedImage != null) {
                changedImage.description = event.newDescription;
            }
        });

        this.imageDeletedSubscription = this.signalrService.imageDeleted$.subscribe((imageId: number) => {
            _.remove(this.images, (iterator) => { return iterator.imageId == imageId; });
            this.imagesGridService.formatGrid();
        });
    }

    selectedGroupChanged(groupId: number) {
        this.selectedGroupsId = groupId;
        this.selectedGroupsName = this.getGroupNameByGroupId(groupId);
        if (groupId == -1) this.getImages();
        else this.getImagesByGroup(groupId)
    }

    getGroupNameByGroupId(groupId: number) {
        if (groupId == -1) {
            return "All";
        }
        else {
            return _.find(this.myGroups, (g: IGroup) => {
                return g.id == groupId;
            }).name;
        }
    }

    ngOnInit() {
        this.myGroups = this.sharedProperties.getMyGroups()
        this.getImages();
    }

    getImages() {
        this.ImagesService.getFirstTenImagesOfAll().then(resp => {
            this.images = resp;
            if (this.images.length == this.batchSize)
                this.hasMore = true;
            else this.hasMore = false;
        });
    }

    ///<summary>
    ///Gets the first 10 images of a group trough the image service, and sets the images,hasMore variables
    ///</summary>
    getImagesByGroup(groupId: number) {
        this.ImagesService.getFirstTenImagesOfGroup(groupId).then(resp => {
            this.images = resp;

            if (this.images.length == this.batchSize)
                this.hasMore = true;
            else this.hasMore = false;
        });
    }

    ///<summary>
    ///Gets the next 10 images, if the selectedGroup variable is not null then of a given group else from all groups
    ///trough the image service and concatanates it to the images variable also sets hasMore variable
    ///</summary>
    showMore() {
        // if we want all the pictures to show
        if (this.selectedGroupsId == -1) {
            if (this.images != null && this.images.length > 0) {
                this.ImagesService.getNextTenImagesOfAll(this.images[this.images.length - 1].imageId).then(resp => {

                    this.images = this.images.concat(resp)

                    // if there's no more 10 pictures to load in
                    if (resp.length != this.batchSize)
                        this.hasMore = false;
                });
            }
        }
        // if we want to show pictures just from one of the pictures
        else {
            if (this.images != null && this.images.length > 0) {
                this.ImagesService.getNextTenImagesOfGroup(this.selectedGroupsId, this.images[this.images.length - 1].imageId).then(resp => {

                    this.images = this.images.concat(resp)

                    // if there's no more 10 pictures to load in
                    if (resp.length != this.batchSize)
                        this.hasMore = false;
                });
            }
        }
    }

    ngOnDestroy() {
        this.myGroupsChangedSubscription.unsubscribe();
        this.imageDeletedSubscription.unsubscribe();
        this.imageDescriptionChangedSubscription.unsubscribe();
        this.newImagesUploadedSubscription.unsubscribe();
    }

    setImageId(id: number) {
        this.selectedImageId = id;
    }

    deleteImage() {
        this.ImagesService.deleteImage(this.selectedImageId).then(() => {
            this.toastService.showSuccessMessage(this.translate.instant('suc3'));
            this.deleteImageModal.close();
            this.selectedImageId = 0;
        });
    }

    changeImageDescription() {
        this.ImagesService.changeDescription(this.selectedImageId, this.newImageDescription).then(() => {
            this.toastService.showSuccessMessage(this.translate.instant('suc4'));
            this.changeImageDescriptionModal.close();
            this.selectedImageId = 0;
            this.newImageDescription = "";
        });
    }

    selectImageSize(size: string) {
        switch (size) {
            case 'large':
                this.selectedSize = this.translate.instant('lg');
                break;
            case 'small':
                this.selectedSize = this.translate.instant('sm');
                break;
            default:
                this.selectedSize = this.translate.instant('md');
                break;
        }
        this.imagesGridService.setImageSize(size);
    }
}