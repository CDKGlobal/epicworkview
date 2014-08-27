/*
 * Animations for project rows
 */
angular.module('WorkView').animation('.project-row', ['$rootScope', '$timeout', 'ProjectsFactory', function($rootScope, $timeout, projectsFactory) {
	
	// number of pixels for a row to be animating in order to simplify the animation
	var simplifyHeight = 1600;
	
	/*
	 * Move animations for an individual row
	 * Rows moving up slide turn green, slide to the right, move up, and slide back in. 
	 * Rows moving down turn red, slide left, move down, and slide back in. 
	 * If simplify is true, then rows animate faster
	 */
	function animate(element, top, up, simplify) {
		var backgroundColor = up ? '#6C3' : '#C64343';
		var leftOffset = up ? '4%' : '-4%';
		var zIndex = up ? 11 : 10;
		var time = simplify ? 500 : 1500;
		jQuery(element).css({
			top:top + 'px',
			'z-index':zIndex
		});
		jQuery(element.firstElementChild).animate({
			'background-color':backgroundColor
		}, time);
		jQuery(element.firstElementChild.children[1]).animate({
			opacity:0
		}, time);
		jQuery(element.firstElementChild.children[0].children[2]).animate({
			opacity:0
		}, time);
		jQuery(element).animate({
			left:leftOffset
		}, time, function() {
			animate2(element, up, simplify);
		});
	}
	
	function animate2(element, up, simplify) {
		var easing = simplify ? 'easeOutQuint' : 'swing';
		jQuery(element).animate({
			top:0
		}, 2000, easing, function() {
			animate3(element, up);
		});
	}
	
	function animate3(element, up) {
		jQuery(element.firstElementChild).animate({
			'background-color':'#FFF'
		}, 1500);
		jQuery(element.firstElementChild.children[1]).animate({
			opacity:1
		}, 1500);
		jQuery(element.firstElementChild.children[0].children[2]).animate({
			opacity:1
		}, 1500);
		jQuery(element).animate({
			left:0
		}, 1500, function() {
			animationCleanup(element);
		});
	}
	
	function animationCleanup(element) {
		jQuery(element).css({
			'z-index':''
		});
	}
	
	// animate all projects
	// calculate positions based off original offsets and new offsets
	$rootScope.$on('animateProjects', function(event) {
		var projectTimestamps = projectsFactory.getProjectTimestamps();
		if (!jQuery.isEmptyObject(projectTimestamps)) {
			var topHeight = 0;
			var projectOffsets = {};
			var simplify = false;
			
			// get list of project offsets
			for (var project in projectTimestamps) {
				var offset = jQuery('#' + project).offset().top;
				if (offset > simplifyHeight) {
					simplify = true;
				}
				projectOffsets[project] = offset;
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
					animate(domElement, jQuery(domElement).offset().top - topHeight - offsetAbove, true, simplify);
				} else {
					// element not in offset list, so animate down
					var elementOffset = jQuery(domElement).offset().top;
					var newOffset = 0;
					
					// find total height below this that is moving up
					for (var offsetId in projectOffsets) {
						if (projectOffsets[offsetId] > elementOffset) {
							newOffset -= jQuery('#' + offsetId).outerHeight(true);
						}
					}
					
					// only animate down if something below is moving up and not simplifying animation
					if (newOffset !== 0 && !simplify) {
						animate(domElement, newOffset, false, false);
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