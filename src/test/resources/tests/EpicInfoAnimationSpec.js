describe('Unit: EpicInfoAnimation Tests', function() {
	
	var animate,
		document,
		window,
		rootScope;
	
	beforeEach(module('WorkView'));
	
	beforeEach(inject(function($animate, $document, $window, $rootScope) {
        animate = $animate;
        document = $document;
        window = $window;
        rootScope = $rootScope;
	}));
	
	it('should animate when hidden', function() {
		var element = jQuery('.epic-info').first();
		expect(element.css('height')).not.toBeDefined();
		animate.addClass(element, 'ng-hide');
		waits(500);
	    runs(function() {
	    	
	    });
	});
});