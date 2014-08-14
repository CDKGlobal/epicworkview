angular.module('WorkView').factory('FullscreenFactory', function() {
    var fullscreen = false;
    return {
        getFullscreen: function() {
            return fullscreen;
        },
        toggleFullscreen: function() {
            fullscreen = !fullscreen;
        }
    };
});