module.exports = function(grunt) {
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        jshint: {
            options: {
                ignores: [
                    'src/main/resources/js/*.min.js'
                ]
            },
            all: [
                'src/main/resources/js/*.js'
            ]
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
        },
        autoprefixer: {
            options: {
                browsers: ['> 1%', 'last 2 versions', 'Firefox ESR', 'Opera 12.1', 'ie >= 9']
            },
            epic_plugin: {
                src: 'src/main/resources/css/EpicPlugin.css',
                dest: 'src/main/resources/css/EpicPlugin.prefixed.css'
            },
            epic_details: {
                src: 'src/main/resources/css/EpicDetails.css',
                dest: 'src/main/resources/css/EpicDetails.prefixed.css'
            }
        }
    });

    grunt.loadNpmTasks('grunt-contrib-jshint');
    grunt.loadNpmTasks('grunt-karma');
    grunt.loadNpmTasks('grunt-protractor-runner');
    grunt.loadNpmTasks('grunt-autoprefixer');

    grunt.registerTask('default', []);
    grunt.registerTask('ut', ['karma:unit', 'jshint', 'autoprefixer']);
    grunt.registerTask('it', ['protractor']);
    grunt.registerTask('autoprefix', ['autoprefixer']);
    grunt.registerTask('lint', ['jshint']);
};