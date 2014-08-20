// Karma configuration
// Generated on Fri Jun 27 2014 15:02:58 GMT-0700 (PDT)

module.exports = function(config) {
  config.set({

    // base path that will be used to resolve all patterns (eg. files, exclude)
    basePath: '',


    // frameworks to use
    // available frameworks: https://npmjs.org/browse/keyword/karma-adapter
    frameworks: ['jasmine'],


    // list of files / patterns to load in the browser
    files: [
      'libs/angular.js',//angular need to be loaded before everything
      'libs/**/*.js',
      '../../main/resources/js/factories/DateFactory.js',
      '../java/ut/com/cobalt/jira/plugin/epic/test/*Spec.js',
      'tests/**/*.js',
      '../../main/resources/js/**/*.js'
    ],


    // list of files to exclude
    exclude: [
      
    ],

    plugins:[
     'karma-jasmine',
     'karma-junit-reporter',
     'karma-coverage',
     'karma-phantomjs-launcher',
     'karma-chrome-launcher'
    ],

    // preprocess matching files before serving them to the browser
    // available preprocessors: https://npmjs.org/browse/keyword/karma-preprocessor
    preprocessors: {
      '../../main/resources/js/**/*.js': 'coverage'
    },

    coverageReporter: {
      type: 'lcov',
      dir: '../../../target/coverage/',
      subdir: '.'
    },

    junitReporter: {
        outputFile: '../../../target/surefire-reports/test-results.xml'
    },


    // test results reporter to use
    // possible values: 'dots', 'progress'
    // available reporters: https://npmjs.org/browse/keyword/karma-reporter
    reporters: ['progress', 'junit', 'coverage'],

    // web server port
    port: 9876,


    // enable / disable colors in the output (reporters and logs)
    colors: true,


    // level of logging
    // possible values: config.LOG_DISABLE || config.LOG_ERROR || config.LOG_WARN || config.LOG_INFO || config.LOG_DEBUG
    logLevel: config.LOG_INFO,


    // enable / disable watching file and executing tests whenever any file changes
    autoWatch: true,


    // start these browsers
    // available browser launchers: https://npmjs.org/browse/keyword/karma-launcher
    //browsers: ['PhantomJS'],
    browsers: ['Chrome'],


    // Continuous Integration mode
    // if true, Karma captures browsers, runs the tests and exits
    singleRun: false
  });
};
