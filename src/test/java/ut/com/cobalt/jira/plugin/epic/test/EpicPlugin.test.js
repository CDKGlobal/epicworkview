describe('ProjectController', function(){
    var scope;//we'll use this scope in our tests
    
    var app = angular.module("EpicPlugin", []);
    
    //mock Application to allow us to inject our own dependencies
    beforeEach(angular.mock.module('EpicPlugin'));
    //mock the controller for the same reason and include $rootScope and $controller
    beforeEach(angular.mock.inject(function($rootScope, $controller){
        //create an empty scope
        scope = $rootScope.$new();
        //declare the controller and inject our empty scope
        $controller('ProjectController', {$scope: scope});
    }));
    // tests start here
    it('should not initially be full screen', function(){
        expect(scope.isFullScreen).toBeFalsy();
    });
});