(
    function() {
        console.log(angular.module('myApp'));
        console.log(angular.module('myApp').directive('modal', function() {
            return {
                restrict: 'E',
                transclude: true,
                template: '<div class="windowView" id="windowBackground"></div><div ng-transclude class="windowView"></div>'
            };
        }));
    }()
);