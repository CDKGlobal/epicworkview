(
    function() {
        angular.module('WorkView').directive('modal', function() {
            return {
                restrict: 'E',
                transclude: true,
                template: '<div class="windowView" id="windowBackground"></div><div ng-transclude class="windowView"></div>'
            };
        });
    }()
);