///<summary>
///A directive which placed on an element as an atribute can call custom function on enter press
///</summary>
class PopularGroupDirective implements ng.IDirective {
    static instance(): ng.IDirective {
        return new PopularGroupDirective;
    }

    restrict = 'A';

    link(scope: ng.IScope, elements: ng.IAugmentedJQuery, attrs: ng.IAttributes, controller: GroupController) {
        scope.$watch(attrs['popularGroupDirective'], function (value) {
            elements.css('background-color', (value >= 3 ? '#66ff66' : 'white'));
        });
    }
}