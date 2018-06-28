///<summary>
///A directive which placed on an element as an atribute can call custom function on enter press
///</summary>
var InputEnterHandlerDirective = (function () {
    function InputEnterHandlerDirective() {
        this.restrict = 'A';
    }
    InputEnterHandlerDirective.instance = function () {
        return new InputEnterHandlerDirective;
    };
    InputEnterHandlerDirective.prototype.link = function (scope, elements, attrs) {
        elements.bind("keydown keypress", function (event) {
            if (event.which === 13) {
                scope.$apply(function () {
                    scope.$eval(attrs['myEnter']);
                });
                event.preventDefault();
            }
        });
    };
    return InputEnterHandlerDirective;
})();
//# sourceMappingURL=InputEnterHandlerDirective.js.map