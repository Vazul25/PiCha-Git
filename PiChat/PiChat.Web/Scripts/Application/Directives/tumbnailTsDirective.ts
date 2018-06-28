//TODO HELP BOSSMAN
class tumbnailTsDirective implements ng.IDirective {
    static instance($window: ng.IWindowService): ng.IDirective {
        return new tumbnailTsDirective($window);
    }

    static $inject = ["$window"]
    constructor(public $window: any) {

    }

    helper: any = {

        support: !!(this.$window.FileReader && this.$window.CanvasRenderingContext2D),
        isFile: function (item: any) {
            return angular.isObject(item) && item instanceof this.$window.File;
        },
        isImage: function (file: any) {
            var type = '|' + file.type.slice(file.type.lastIndexOf('/') + 1) + '|';
            return '|jpg|png|jpeg|bmp|gif|'.indexOf(type) !== -1;
        }
    }
    restrict = 'A';
    template = '<canvas/>';
    link(scope: ng.IScope, element: ng.IAugmentedJQuery, attributes: ng.IAttributes & { ngThumb: any }) {
        if (!this.helper.support) return;

        var params = scope.$eval(attributes.ngThumb);

        if (!this.helper.isFile(params.file)) return;
        if (!this.helper.isImage(params.file)) return;

        var canvas = element.find('canvas');
        var reader = new FileReader();

        reader.onload = onLoadFile;
        reader.readAsDataURL(params.file);

        function onLoadFile(event: any) {
            var img = new Image();
            img.onload = onLoadImage;
            img.src = event.target.result;
        }

        function onLoadImage() {
            var width = params.width || this.width / this.height * params.height;
            var height = params.height || this.height / this.width * params.width;
            canvas.attr({ width: width, height: height });
            (canvas[0] as HTMLCanvasElement).getContext('2d').drawImage(this, 0, 0, width, height);
        }
    }
}
