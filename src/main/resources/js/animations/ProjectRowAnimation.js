angular.module('WorkView').animation('.project-row', [function() {
	
	// return the height of the given element
	function getElemHeight(elem) {
		return jQuery(elem).outerHeight();
	}
	
	return {
		enter : function(element, done) {
			done();
		},

		leave : function(element, done) {
			done();
		},

		// ng-move animation
		move : function(element, done) {
			var maxHeight = getElemHeight(element) + 'px';
			jQuery(element).css({
				position:'relative',
				opacity:0,
				'max-height':0
			});
			jQuery(element.context.firstElementChild).css({
				'background-color':'#6C3'
			});
			jQuery(element.context.firstElementChild).animate({
				'background-color':'white'
			}, 2000);
			jQuery(element).animate({
				opacity:1,
				'max-height':maxHeight
			}, 1000, done);
			
			// onDone callback
			return function() {
				// reset max height
            	jQuery(element).css({
					'max-height':'none'
				});
            };
		},
		
		// ng-hide animation
		beforeAddClass : function(element, className, done) {
			if(className == 'ng-hide') {
				var maxHeight = getElemHeight(element) + 'px';
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
				var maxHeight = getElemHeight(element) + 'px';
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