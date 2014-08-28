describe('Unit: ProjectRowAnimation Tests', function() {
	
	var done;
	
    beforeEach(module('WorkView'));
    
    beforeEach(function() {
    	done = jasmine.createSpy('done spy');
    	spyOn(jQuery.fn, "css");
    	spyOn(jQuery.fn, "animate");
    });
    
    it('can get an instance of the project row animation', inject(function(ProjectRowAnimation) {
    	expect(ProjectRowAnimation).toBeDefined();
    }));
    
    it('has an enter function that calls done', inject(function(ProjectRowAnimation) {
    	ProjectRowAnimation().enter(null, done);
    	expect(jQuery.fn.css).not.toHaveBeenCalled();
    	expect(jQuery.fn.animate).not.toHaveBeenCalled();
    	expect(done).toHaveBeenCalled();
    }));
    
    it('has a leave function that calls done', inject(function(ProjectRowAnimation) {
    	ProjectRowAnimation().leave(null, done);
    	expect(jQuery.fn.css).not.toHaveBeenCalled();
    	expect(jQuery.fn.animate).not.toHaveBeenCalled();
    	expect(done).toHaveBeenCalled();
    }));
    
    it('has a move function that calls done', inject(function(ProjectRowAnimation) {
    	ProjectRowAnimation().move(null, done);
    	expect(jQuery.fn.css).not.toHaveBeenCalled();
    	expect(jQuery.fn.animate).not.toHaveBeenCalled();
    	expect(done).toHaveBeenCalled();
    }));
    
    it('should change css styles and animate before the ng-hide class is added', inject(function(ProjectRowAnimation) {
    	ProjectRowAnimation().beforeAddClass(null, 'ng-hide', done);
    	expect(jQuery.fn.css).toHaveBeenCalled();
    	expect(jQuery.fn.animate).toHaveBeenCalled();
    }));
    
    it('should change css styles and animate after the ng-hide class is removed', inject(function(ProjectRowAnimation) {
    	ProjectRowAnimation().removeClass(null, 'ng-hide', done);
    	expect(jQuery.fn.css).toHaveBeenCalled();
    	expect(jQuery.fn.animate).toHaveBeenCalled();
    }));
    
    it('should animate when animate projects is given two updated projects and one not updated', inject(function(ProjectRowAnimation) {
    	spyOn(jQuery.fn, "offset").andReturn({top: 0});
    	spyOn(jQuery.fn, "outerHeight").andReturn(0);
    	var mockChild = {children:[{children:[null, null, null]}, null]}
    	spyOn(jQuery.fn, "children").andReturn([{id:0, firstElementChild:mockChild}, 
    	                                        {id:100, firstElementChild:mockChild}, 
    	                                        {id:101, firstElementChild:mockChild},
    	                                        {id:102, firstElementChild:mockChild}]);
    	ProjectRowAnimation().animateAllProjects({100 : 100, 101 : 101});
    	expect(jQuery.fn.css).toHaveBeenCalled();
    	expect(jQuery.fn.animate).toHaveBeenCalled();
    }));
    
    it('should animate when animate projects is given only one updated project', inject(function(ProjectRowAnimation) {
    	spyOn(jQuery.fn, "offset").andReturn({top: 0});
    	spyOn(jQuery.fn, "outerHeight").andReturn(0);
    	var mockChild = {children:[{children:[null, null, null]}, null]}
    	spyOn(jQuery.fn, "children").andReturn([{id:0, firstElementChild:mockChild}, 
    	                                        {id:100, firstElementChild:mockChild}]);
    	ProjectRowAnimation().animateAllProjects({100 : 100});
    	expect(jQuery.fn.css).toHaveBeenCalled();
    	expect(jQuery.fn.animate).toHaveBeenCalled();
    }));
    
    it('should not animate when animate projects is given only one non-updated project', inject(function(ProjectRowAnimation) {
    	spyOn(jQuery.fn, "offset").andReturn({top: 0});
    	spyOn(jQuery.fn, "outerHeight").andReturn(0);
    	var mockChild = {children:[{children:[null, null, null]}, null]}
    	spyOn(jQuery.fn, "children").andReturn([{id:0, firstElementChild:mockChild}, 
    	                                        {id:100, firstElementChild:mockChild}]);
    	ProjectRowAnimation().animateAllProjects();
    	expect(jQuery.fn.css).not.toHaveBeenCalled();
    	expect(jQuery.fn.animate).not.toHaveBeenCalled();
    }));
});