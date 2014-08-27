/*
 * Epic info dropdown animations
 */
angular.module('WorkView').animation('.epic-info', function() {
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
			if(className === 'ng-hide') {
				var maxHeight = jQuery(element).outerHeight() + 'px';
				jQuery(element).css({
					overflow:'hidden',
					height:maxHeight
				});
				jQuery(element).animate({
					height:0
				}, 400, done);
			}
			else {
				done();
			}
		},
		
		// ng-show animation
		removeClass : function(element, className, done) {
			if(className === 'ng-hide') {
				element.css({
					height:'',
					'max-height':0
				});
				jQuery(element).animate({
					'max-height':'800px'
				}, 1200, done);
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
});