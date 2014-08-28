describe('Unit: EpicInfoAnimation Tests', function() {
	
	var done;
	
    beforeEach(module('WorkView'));
    
    beforeEach(function() {
    	done = jasmine.createSpy('done spy');
    	spyOn(jQuery.fn, "css");
    	spyOn(jQuery.fn, "animate");
    });
    
    it('can get an instance of the epic info animation', inject(function(EpicInfoAnimation) {
    	expect(EpicInfoAnimation).toBeDefined();
    }));
    
    it('has an enter function that calls done', inject(function(EpicInfoAnimation) {
    	EpicInfoAnimation().enter(null, done);
    	expect(jQuery.fn.css).not.toHaveBeenCalled();
    	expect(jQuery.fn.animate).not.toHaveBeenCalled();
    	expect(done).toHaveBeenCalled();
    }));
    
    it('has a leave function that calls done', inject(function(EpicInfoAnimation) {
    	EpicInfoAnimation().leave(null, done);
    	expect(jQuery.fn.css).not.toHaveBeenCalled();
    	expect(jQuery.fn.animate).not.toHaveBeenCalled();
    	expect(done).toHaveBeenCalled();
    }));
    
    it('has a move function that calls done', inject(function(EpicInfoAnimation) {
    	EpicInfoAnimation().move(null, done);
    	expect(jQuery.fn.css).not.toHaveBeenCalled();
    	expect(jQuery.fn.animate).not.toHaveBeenCalled();
    	expect(done).toHaveBeenCalled();
    }));
    
    it('should change css styles and animate before the ng-hide class is added', inject(function(EpicInfoAnimation) {
    	EpicInfoAnimation().beforeAddClass(null, 'ng-hide', done);
    	expect(jQuery.fn.css).toHaveBeenCalled();
    	expect(jQuery.fn.animate).toHaveBeenCalled();
    }));
    
    it('should change css styles and animate after the ng-hide class is removed', inject(function(EpicInfoAnimation) {
    	EpicInfoAnimation().removeClass(null, 'ng-hide', done);
    	expect(jQuery.fn.css).toHaveBeenCalled();
    	expect(jQuery.fn.animate).toHaveBeenCalled();
    }));
});