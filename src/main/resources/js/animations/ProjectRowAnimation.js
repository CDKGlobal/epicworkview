angular.module('WorkView').animation('.project-row', ['$rootScope', '$timeout', 'ProjectsFactory', function($rootScope, $timeout, projectsFactory) {
	
	/*
	 * Move animations for an individual project
	 */
	
	// move up
	function animateUp(element, top) {
		jQuery(element).css({
			top:top + 'px'
		});
		jQuery(element.firstElementChild).animate({
			'background-color':'#6C3'
		}, 2000);
		jQuery(element).animate({
			left:'4%'
		}, 2000, function() {
			animateUp2(element);
		});
	}
	
	function animateUp2(element) {
		jQuery(element).css({
			'z-index':1
		});
		jQuery(element).animate({
			top:0
		}, 2000, function() {
			animateUp3(element);
		});
	}
	
	function animateUp3(element) {
		jQuery(element).css({
			'z-index':''
		});
		jQuery(element.firstElementChild).animate({
			'background-color':'#FFF'
		}, 2000);
		jQuery(element).animate({
			left:0
		}, 2000);
	}
	
	// move down
	function animateDown(element, top) {
		jQuery(element).css({
			top:top + 'px'
		});
		jQuery(element.firstElementChild).animate({
			'background-color':'#C64343'
		}, 2000);
		jQuery(element).animate({
			left:'-4%'
		}, 2000, function() {
			animateDown2(element);
		});
	}
	
	function animateDown2(element) {
		jQuery(element).animate({
			top:0
		}, 2000, function() {
			animateDown3(element);
		});
	}
	
	function animateDown3(element) {
		jQuery(element.firstElementChild).animate({
			'background-color':'#FFF'
		}, 2000);
		jQuery(element).animate({
			left:0
		}, 2000);
	}
	
	// animate all projects
	// calculate positions based off original offsets and new offsets
	$rootScope.$on('animateProjects', function(event) {
		var projectTimestamps = projectsFactory.getProjectTimestamps();
		if (!jQuery.isEmptyObject(projectTimestamps)) {
			var topHeight = 0;
			var projectOffsets = {};
			
			// get list of project offsets
			for (var project in projectTimestamps) {
				projectOffsets[project] = jQuery('#' + project).offset().top;
			}
			
			// loop through all projects in dom
			var projectElements = jQuery('#projects').children();
			for (var i = 1; i < projectElements.length; i++) {
				var domElement = projectElements[i];
				
				// set height of top of page if this is first element
				if (i === 1) {
					topHeight = jQuery(domElement).offset().top;
				}
				
				// if this is an updated project, animate up
				if (domElement.id in projectTimestamps) {
					var updatedTime = projectTimestamps[domElement.id];
					offsetAbove = 0;
					
					// find total height above this that is also animating up
					for (var id in projectTimestamps) {
						if (projectTimestamps[id] > updatedTime) {
							offsetAbove += jQuery('#' + id).outerHeight(true);
						}
					}
					animateUp(domElement, jQuery(domElement).offset().top - topHeight - offsetAbove);
				} else {
					// element not in offset list, so animate down
					var elementOffset = jQuery(domElement).offset().top;
					var newOffset = 0;
					
					// find total height below this that is moving up
					for (var offsetId in projectOffsets) {
						console.log(jQuery(projectOffsets[offsetId]));
						if (projectOffsets[offsetId] > elementOffset) {
							newOffset -= jQuery('#' + offsetId).outerHeight(true);
						}
					}
					
					// only animate down if something below is moving up
					if (newOffset !== 0) {
						animateDown(domElement, newOffset);
					}
				}
			}
		}
	});
	
	return {
		enter : function(element, done) {
			done();
		},

		leave : function(element, done) {
			done();
		},

		// ng-move animation
		move : function(element, done) {
			done();
		},
		
		// ng-hide animation
		beforeAddClass : function(element, className, done) {
			if(className == 'ng-hide') {
				var maxHeight = jQuery(element).outerHeight() + 'px';
				jQuery(element).css({
					overflow:'hidden',
					'max-height':maxHeight
				});
				jQuery(element).animate({
					'max-height':0
				}, done);
			}
			else {
				done();
			}
		},
		
		// ng-show animation
		removeClass : function(element, className, done) {
			if(className == 'ng-hide') {
				var maxHeight = jQuery(element).outerHeight() + 'px';
				element.css({
					'max-height':0
				});
				jQuery(element).animate({
					'max-height':'400px'
				}, 1000, done);
			}
			else {
				done();
			}
			
			// onDone callback
			return function(isCancelled) {
				// reset max height
            	jQuery(element).css({
					'max-height':'none'
				});
            	if (isCancelled) {
            		jQuery(element).stop();
            	}
            };
		}
	};
}]);