///<summary>
///A directive which placed on an element as an atribute can call custom function on enter press
///</summary>
class InputEnterHandlerDirective implements ng.IDirective {
    static instance(): ng.IDirective {
        return new InputEnterHandlerDirective;
    }

    restrict = 'A';

    link(scope: ng.IScope, elements: ng.IAugmentedJQuery, attrs: ng.IAttributes) {
        elements.bind("keydown keypress", function (event) {
            if (event.which === 13) {
                scope.$apply(function () {
                    scope.$eval(attrs['myEnter']);
                });

                event.preventDefault();
            }
        });
    }
}