import { Component, OnInit } from "@angular/core";
import { CORE_DIRECTIVES, FORM_DIRECTIVES, NgClass, NgStyle } from '@angular/common';
import { ActivatedRoute } from "@angular/router";
import { TranslateService, TranslatePipe } from 'ng2-translate/ng2-translate';
import { MD_BUTTON_DIRECTIVES } from "@angular2-material/button";   // hátha kell
import { MD_INPUT_DIRECTIVES } from "@angular2-material/input";   // hátha kell
import {FILE_UPLOAD_DIRECTIVES, FileUploader} from 'ng2-file-upload/ng2-file-upload';
import {ImagePreview} from "./myImagePreview.directive";
import { SharedProperties } from "../Shared/sharedproperties.service";
const URL = '/api/Image';
import * as _ from 'lodash';
@Component({
    selector: "uploadimage",
    templateUrl: "/Application/UploadImage/uploadimage.component.html",
    directives: [
        FILE_UPLOAD_DIRECTIVES,
        NgClass,
        NgStyle,
        CORE_DIRECTIVES,
        FORM_DIRECTIVES,
        ImagePreview
    ],
    pipes: [TranslatePipe]
})

export class UploadImageComponent implements OnInit {
    constructor(private route: ActivatedRoute, private SharedProperties: SharedProperties, public translate: TranslateService) {
    }

    myGroups: IGroup[] = [];        // groups, where I"m a member
    selectedItem: IGroup = null;    // selected group where I want to upload pictures
    searchText: string;             // the filter in the field to search between my groups
    groupSelected: boolean = false;
    
    public uploader: FileUploader = new FileUploader({ url: URL, authToken: 'Bearer ' + sessionStorage.getItem("token") });
    public hasBaseDropZoneOver: boolean = false;
    public hasAnotherDropZoneOver: boolean = false;

    public fileOverBase(e: any): void {
        this.hasBaseDropZoneOver = e;
    }

    public fileOverAnother(e: any): void {
        this.hasAnotherDropZoneOver = e;
    }

    ///<summary>
    /// At the site loading, the program gets all of my groups
    /// from the common data in shared properties
    ///</summary>
    ngOnInit() {
        this.myGroups = this.SharedProperties.getMyGroups();

        $('.group-select').select2({
            placeholder: this.translate.instant('sgu'),
            data: this.formatGroupsToSelect2()
        });

        $(".group-select").on('change', () => {
            var selectedGroupId = $('.group-select').val();
            this.uploader.queue.forEach(fileItem => {
                if (fileItem.isUploaded) 
              //  fileItem.uploader.options.url = (URL + "/Add/" + selectedGroupId);
                fileItem.url = (URL + "/Add/" + selectedGroupId);
                
            })
            _.remove(this.uploader.queue, (item) => { return item.isUploaded;});
            this.uploader.setOptions({
                url: (URL + "/Add/" + selectedGroupId),
                authToken: 'Bearer ' + sessionStorage.getItem("token"),
                filters: [{
                    fn: (item: File) => {
                        return item.size < 1024 * 1024 * 40 && (item.type.indexOf("image") != -1);
                    }
                }]
            })
            this.groupSelected = true;
        });
    }

    formatGroupsToSelect2() {
        var data: any[] = [];
        this.myGroups.forEach((item: IGroup, index: number) => {
            data.push({ id: item.id, text: item.name });
        });

        return data;
    }
 
    ///<summary>
    /// Searches for the group from my groups
    /// where I want to upload files.
    /// If we did not select it from the autocomplete list, we must set the selected item by group name,
    /// this happens only if the selected item is null while trying to upload a file.
    ///</summary>
    // lehet erre nem is lesz szükség?
    getSelectedItemByName() {
        this.myGroups.forEach(i => {
            if (i.name == this.searchText) {
                this.selectedItem = i;
            }
        });
        return this.selectedItem == null;
    }
}
