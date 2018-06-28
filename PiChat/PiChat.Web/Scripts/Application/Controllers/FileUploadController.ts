///<summary>
/// Controller of the picture uploader site
///</summary>
class FileUploadController {
    files: File[];                  // pictures which I want to upload
    myGroups: IGroup[];             // groups, where I'm a member
    selectedItem: IGroup = null;    // selected group where I want to upload pictures
    searchText: string;            // the filter in the field to search between my groups

    static $inject = ["$window", "Upload", "GroupService", "$mdDialog", "$scope", "$rootScope", "SharedProperties", "$translate", "PopupDialogService"]
    constructor(private $window: ng.IWindowService,
        private Upload: angular.angularFileUpload.IUploadService,
        private GroupService: IGroupService,
        private $mdDialog: ng.material.IDialogService,
        private $scope: ng.IScope,
        private $rootScope: ng.IRootScopeService,
        private SharedProperties: ISharedProperties,
        private $translate: angular.translate.ITranslateService,
        private PopupDialogService: IPopupDialogService) {
         
        // if there's any change in the groups where I'm a member,
        // then applyAsync gets them again
        $rootScope.$on('sharedPropertiesGroupsChanged', (event, args) => {
            // Todo apply assync nem biztos hogy kell sőt valszeg nem, de tán így kevesebb volt mikor nem jött meg a group időzítési hiba miatt
            this.$scope.$applyAsync(a => {
                this.myGroups = SharedProperties.getMyGroups();
            });
        });
    };

    ///<summary>
    ///Uploads files to the server, it makes sure that a correct group was selected and there are indeed files to upload.
    /// Shows a popup dialog to notify of errors and if it was a success or not
    ///</summary>
    ///<param name="files"> The files which will be uploaded</param> 
    uploadFiles = (files: File[]) => {
        console.log(this.selectedItem)
        if (this.selectedItem == null) {
            if (this.getSelectedItemByName()) {

                this.showGroupAlert(null);
                return;
            }
        }

        if (files == null) {
            this.showFileAlert(null);
            return;
        }

        this.myUpload(files);
        this.reset();
    }
 
    ///<summary>
    ///Uploads only one file  which is given in the preview list to the server, it makes sure that a correct group was selected and there are indeed a file to upload.
    /// Shows a popup dialog to notify of errors and if it was a success or not
    ///</summary>
    ///<param name="file"> The file which will be uploaded</param> 
    uploadFile = (file: File) => {

        if (this.selectedItem == null) {
            if (this.getSelectedItemByName()) {

                this.showGroupAlert(null);
                return;
            }
        }

        if (file == null) {
            this.showFileAlert(null);
            return;
        }

        var files = [file];
        this.myUpload(files);
    }

    ///<summary>
    ///Removes a file from the preview list
    ///</summary>
    ///<param name="file"> The file which will be removed</param> 
    remove = (file: File) => {
        var index = this.files.indexOf(file);
        console.log("remove index: " + index);
        this.files.splice(index, 1);
    }

    ///<summary>
    /// Does the uploading of the chosen file(s) 
    /// uses ng-upload
    ///</summary>
    ///<param name="files"> The files which will be uploaded</param> 
    myUpload = (files: File[]) => {

        this.Upload.upload(<angular.angularFileUpload.IFileUploadConfigFile>
            {
                url: "/api/Image/Add/" + this.selectedItem.id,
                data: { file: files }
            }).then((response) => {

                this.showSuccessAlert(null);
                console.log("Success");
                //ez így nagyon ronda, de elég sok fölös kód kéne a szépítéshez
                if (files.length === 1) {
                    this.remove(files[0]);
                }
                else {
                    this.reset();
                }
            }, (err) => {
                console.log("Error status: " + err.status);
                this.showFileAlert(null);
            });
    }

    ///<summary>
    /// At the site loading, the program gets all of my groups
    /// from the common data in shared properties
    ///</summary>
    //Todo peti ezt majd megoldod https értesítéssel ugye?
    $onInit = () => {
        this.$scope.$applyAsync(a => {
            this.myGroups = this.SharedProperties.getMyGroups();
        });
    }

    ///<summary>
    /// Searches for the group from my groups
    /// where I want to upload files.
    /// If we did not select it from the autocomplete list, we must set the selected item by group name,
    /// this happens only if the selected item is null while trying to upload a file.
    ///</summary>
    getSelectedItemByName() {
        console.log(this.selectedItem)
        this.myGroups.forEach(i => {
            if (i.name == this.searchText) {
                this.selectedItem = i;
            }
        });
        console.log(this.selectedItem)
        return this.selectedItem == null;
    }

    ///<summary>
    /// Shows up an alert if we gave a bad or notexisting group
    ///</summary>
    showGroupAlert(ev: Event) {
        this.PopupDialogService.showErrorAlert(this.$translate.instant('gerr2'), this.$translate.instant('gerr1'));
    }

    ///<summary>
    /// Shows up an alert if we didn't choose files or there's a problem with uploading
    ///<summary>
    showFileAlert(ev: Event) {
        this.PopupDialogService.showErrorAlert(this.$translate.instant('ferr2'), this.$translate.instant('ferr1'));
    }

    ///<summary>
    /// Shows up an alert if the uploading was successful
    ///<summary>
    showSuccessAlert(ev: Event) {
        this.PopupDialogService.showErrorAlert(this.$translate.instant('suc2'), this.$translate.instant('suc1'));
    }

    ///<summary>
    /// Deletes the list of uploadable files if we reset them
    /// or the uploading was finished
    ///<summary>
    reset() {
        this.files = [];
    }
}