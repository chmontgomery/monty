// Karma configuration
// Generated on Tue Mar 26 2013 11:05:14 GMT-0500 (CDT)


// base path, that will be used to resolve files and exclude
basePath = '';


// list of files / patterns to load in the browser
files = [
  JASMINE,
  JASMINE_ADAPTER,
  'bower_components/jquery/jquery.min.js',
  'bower_components/angular/angular.min.js',
  'bower_components/angular-ui/build/angular-ui.min.js',
  'bower_components/angular-mocks/angular-mocks.js',
  'bower_components/moment/min/moment.min.js',
  'dist/js/all.js',
  'js/test/browser/**/*.js'
];


// list of files to exclude
exclude = [
];


// test results reporter to use
// possible values: 'dots', 'progress', 'junit'
reporters = ['progress'];


// web server port
port = 9876;


// cli runner port
runnerPort = 9100;


// enable / disable colors in the output (reporters and logs)
colors = true;


// level of logging
// possible values: LOG_DISABLE || LOG_ERROR || LOG_WARN || LOG_INFO || LOG_DEBUG
logLevel = LOG_INFO;


// enable / disable watching file and executing tests whenever any file changes
autoWatch = true;


// Start these browsers, currently available:
// - Chrome
// - ChromeCanary
// - Firefox
// - Opera
// - Safari (only Mac)
// - PhantomJS
// - IE (only Windows)
browsers = ['Chrome'];


// If browser does not capture in given timeout [ms], kill it
captureTimeout = 60000;


// Continuous Integration mode
// if true, it capture browsers, run tests and exit
singleRun = false;
