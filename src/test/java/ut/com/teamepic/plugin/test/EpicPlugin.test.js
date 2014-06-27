
describe('ProjectController', function(){
    var scope;//we'll use this scope in our tests
 
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
    describe("Filter pop-up", function() {
    	var e = jasmine.createSpyObj('e', [ 'stopPropagation' ]);
	    it('should not initially show filter', function(){
	        expect(scope.filter).toBeFalsy();
	    });
	    it('should show filter after toggling filter', function(){
	    	scope.toggleFilter(e);
	    	expect(scope.filter).toBeTruthy();
	    });
	    it('should not propagate while toggling the filter', function(){
	    	scope.toggleFilter(e);
	    	expect(e.stopPropagation).toHaveBeenCalled();
	    });
    });
});