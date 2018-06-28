//TESTING ONLY ATM
var infiniteItems = (function () {
    function infiniteItems($timeout, ImageService) {
        this.$timeout = $timeout;
        this.ImageService = ImageService;
    }
    infiniteItems.prototype.getItemAtIndex = function (index) {
        if (index > this.numLoaded_) {
            this.fetchMoreItems_(index);
            return null;
        }
        return index;
    };
    infiniteItems.prototype.fetchMoreItems_ = function (index) {
        var _this = this;
        if (this.toLoad_ < index) {
            this.toLoad_ += 5;
            this.ImageService.getUserImages().then(function (resp) {
                _this.items = _this.items.concat(resp.data);
                _this.numLoaded_ = _this.toLoad_;
            });
        }
    };
    infiniteItems.prototype.getLength = function () {
        return this.numLoaded_ + 5;
    };
    infiniteItems.$inject = ["$timeout", "ImageService"];
    return infiniteItems;
})();
//# sourceMappingURL=infiniteItems.js.map