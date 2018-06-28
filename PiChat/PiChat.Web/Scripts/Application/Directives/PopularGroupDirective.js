///<summary>
///A directive which placed on an element as an atribute can call custom function on enter press
///</summary>
var PopularGroupDirective = (function () {
    function PopularGroupDirective() {
        this.restrict = 'A';
    }
    PopularGroupDirective.instance = function () {
        return new PopularGroupDirective;
    };
    PopularGroupDirective.prototype.link = function (scope, elements, attrs, controller) {
        scope.$watch(attrs['popularGroupDirective'], function (value) {
            elements.css('background-color', (value >= 3 ? '#66ff66' : 'white'));
        });
    };
    return PopularGroupDirective;
})();
//# sourceMappingURL=PopularGroupDirective.js.map