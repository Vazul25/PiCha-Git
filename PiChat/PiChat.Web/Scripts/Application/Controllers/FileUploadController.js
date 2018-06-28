///<summary>
/// Controller of the picture uploader site
///</summary>
var FileUploadController = (function () {
    function FileUploadController($window, Upload, GroupService, $mdDialog, $scope, $rootScope, SharedProperties, $translate, PopupDialogService) {
        var _this = this;
        this.$window = $window;
        this.Upload = Upload;
        this.GroupService = GroupService;
        this.$mdDialog = $mdDialog;
        this.$scope = $scope;
        this.$rootScope = $rootScope;
        this.SharedProperties = SharedProperties;
        this.$translate = $translate;
        this.PopupDialogService = PopupDialogService;
        this.selectedItem = null; // selected group where I want to upload pictures
        ///<summary>
        ///Uploads files to the server, it makes sure that a correct group was selected and there are indeed files to upload.
        /// Shows a popup dialog to notify of errors and if it was a success or not
        ///</summary>
        ///<param name="files"> The files which will be uploaded</param> 
        this.uploadFiles = function (files) {
            console.log(_this.selectedItem);
            if (_this.selectedItem == null) {
                if (_this.getSelectedItemByName()) {
                    _this.showGroupAlert(null);
                    return;
                }
            }
            if (files == null) {
                _this.showFileAlert(null);
                return;
            }
            _this.myUpload(files);
            _this.reset();
        };
        ///<summary>
        ///Uploads only one file  which is given in the preview list to the server, it makes sure that a correct group was selected and there are indeed a file to upload.
        /// Shows a popup dialog to notify of errors and if it was a success or not
        ///</summary>
        ///<param name="file"> The file which will be uploaded</param> 
        this.uploadFile = function (file) {
            if (_this.selectedItem == null) {
                if (_this.getSelectedItemByName()) {
                    _this.showGroupAlert(null);
                    return;
                }
            }
            if (file == null) {
                _this.showFileAlert(null);
                return;
            }
            var files = [file];
            _this.myUpload(files);
        };
        ///<summary>
        ///Removes a file from the preview list
        ///</summary>
        ///<param name="file"> The file which will be removed</param> 
        this.remove = function (file) {
            var index = _this.files.indexOf(file);
            console.log("remove index: " + index);
            _this.files.splice(index, 1);
        };
        ///<summary>
        /// Does the uploading of the chosen file(s) 
        /// uses ng-upload
        ///</summary>
        ///<param name="files"> The files which will be uploaded</param> 
        this.myUpload = function (files) {
            _this.Upload.upload({
                url: "/api/Image/Add/" + _this.selectedItem.id,
                data: { file: files }
            }).then(function (response) {
                _this.showSuccessAlert(null);
                console.log("Success");
                //ez így nagyon ronda, de elég sok fölös kód kéne a szépítéshez
                if (files.length === 1) {
                    _this.remove(files[0]);
                }
                else {
                    _this.reset();
                }
            }, function (err) {
                console.log("Error status: " + err.status);
                _this.showFileAlert(null);
            });
        };
        ///<summary>
        /// At the site loading, the program gets all of my groups
        /// from the common data in shared properties
        ///</summary>
        //Todo peti ezt majd megoldod https értesítéssel ugye?
        this.$onInit = function () {
            _this.$scope.$applyAsync(function (a) {
                _this.myGroups = _this.SharedProperties.getMyGroups();
            });
        };
        // if there's any change in the groups where I'm a member,
        // then applyAsync gets them again
        $rootScope.$on('sharedPropertiesGroupsChanged', function (event, args) {
            // Todo apply assync nem biztos hogy kell sőt valszeg nem, de tán így kevesebb volt mikor nem jött meg a group időzítési hiba miatt
            _this.$scope.$applyAsync(function (a) {
                _this.myGroups = SharedProperties.getMyGroups();
            });
        });
    }
    ;
    ///<summary>
    /// Searches for the group from my groups
    /// where I want to upload files.
    /// If we did not select it from the autocomplete list, we must set the selected item by group name,
    /// this happens only if the selected item is null while trying to upload a file.
    ///</summary>
    FileUploadController.prototype.getSelectedItemByName = function () {
        var _this = this;
        console.log(this.selectedItem);
        this.myGroups.forEach(function (i) {
            if (i.name == _this.searchText) {
                _this.selectedItem = i;
            }
        });
        console.log(this.selectedItem);
        return this.selectedItem == null;
    };
    ///<summary>
    /// Shows up an alert if we gave a bad or notexisting group
    ///</summary>
    FileUploadController.prototype.showGroupAlert = function (ev) {
        this.PopupDialogService.showErrorAlert(this.$translate.instant('gerr2'), this.$translate.instant('gerr1'));
    };
    ///<summary>
    /// Shows up an alert if we didn't choose files or there's a problem with uploading
    ///<summary>
    FileUploadController.prototype.showFileAlert = function (ev) {
        this.PopupDialogService.showErrorAlert(this.$translate.instant('ferr2'), this.$translate.instant('ferr1'));
    };
    ///<summary>
    /// Shows up an alert if the uploading was successful
    ///<summary>
    FileUploadController.prototype.showSuccessAlert = function (ev) {
        this.PopupDialogService.showErrorAlert(this.$translate.instant('suc2'), this.$translate.instant('suc1'));
    };
    ///<summary>
    /// Deletes the list of uploadable files if we reset them
    /// or the uploading was finished
    ///<summary>
    FileUploadController.prototype.reset = function () {
        this.files = [];
    };
    FileUploadController.$inject = ["$window", "Upload", "GroupService", "$mdDialog", "$scope", "$rootScope", "SharedProperties", "$translate", "PopupDialogService"];
    return FileUploadController;
})();
//# sourceMappingURL=FileUploadController.js.map