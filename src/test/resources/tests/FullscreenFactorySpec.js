describe('Unit: FullscreenFactory Tests', function() {
    beforeEach(module('WorkView'));

    it('can get an instance of the fullscreen factory', inject(function(FullscreenFactory){
        expect(FullscreenFactory).toBeDefined();
    }));

    it('should initialize fullscreen to be false', inject(function(FullscreenFactory) {
        expect(FullscreenFactory.getFullscreen()).toBeFalsy();
    }));

    it('should flip the fullscreen value on toggle', inject(function(FullscreenFactory) {
        FullscreenFactory.toggleFullscreen();
        expect(FullscreenFactory.getFullscreen()).toBeTruthy();
        FullscreenFactory.toggleFullscreen();
        expect(FullscreenFactory.getFullscreen()).toBeFalsy();
    }));
});