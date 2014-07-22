module.exports = function(grunt) {

  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),

    jshint: {
        all: ['src/main/resources/js/*.js']
    },

    //Interface with the Karma test runner
    //See: https://github.com/karma-runner/grunt-karma
    karma: {
        unit: {
            configFile: 'src/test/resources/karma.config.js',
            colors: false,
            singleRun: true,
            browsers: ['PhantomJS']
        }
    },
  
    //protractor - run acceptance tests
	// See: https://github.com/teerapap/grunt-protractor-runner
    protractor: {
    	options: {
    		keepAlive: false, //if this is true then our builds won't fail on errors
    		configFile: "src/test/resources/protractor_conf.js",
    		noColor: false, // If true, protractor will not use colors in its output.
    		args: {
    			// Arguments passed to the command
    		}
    	}
    }
  
  });

  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-karma');
  grunt.loadNpmTasks('grunt-protractor-runner');

  grunt.registerTask('default', []);
  grunt.registerTask('ut', ['karma:unit', 'jshint']);
  grunt.registerTask('it', ['protractor']);

};