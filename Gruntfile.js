module.exports = function(grunt) {

    // Project configuration.
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        concat: {
            options: {
                separator: ';'
            },
            dist: {
                src: ['js/utility/*.js',
                      'js/controllers/*.js',
                      'js/interfaces/*.js',
                      'js/models/*.js',
                      'js/services/*.js',
                      'js/directives/*.js',
                      'js/filters/*.js',
                      'js/animations/*.js',
                      'js/app.js',
                      'js/shared.js'
                ],
                dest: 'dist/js/all.js'
            }
        },
        exec: {
            patch_splunk: {
                command: 'patch node_modules/splunk-sdk/lib/platform/node/node_http.js < splunk_ssl_fix.patch',
                stdout: true,
                stderr: true
            }
        },
        sass: {
            dist: {
                files: {
                    "dist/css/style.css": ["css/*.scss"]
                }
            }
        },
        karma: {
            unit: {
                configFile: 'monty.conf.js',
                singleRun: true,
                browsers: ['Chrome', 'Firefox']
            }
        },
        jshint: {
            all: ['Gruntfile.js', 'js/**/*.js', 'server.js'],
            options: {
                // only to support legacy files copied from generated typescript.
                // once those files are converted to common angular files this can be removed
                '-W004': true
            }
        },
        nodeunit: {
            all: ['js/test/server/*_test.js']
        },
        watch: {
            files: ['js/**/*.js', 'css/**/*.scss', 'js/test/**/*.js', 'js/app.js', 'partials/**/*.html', 'index.html'],
            tasks: ['concat', 'sass'],
            options: {
                livereload: true
            }
        }
    });

    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-contrib-concat');
    grunt.loadNpmTasks('grunt-contrib-sass');
    grunt.loadNpmTasks('grunt-contrib-jshint');
    grunt.loadNpmTasks('grunt-karma');
    grunt.loadNpmTasks('grunt-contrib-nodeunit');
    grunt.loadNpmTasks('grunt-exec');

    // custom targets
    grunt.registerTask('default', ['concat', 'sass']);
    grunt.registerTask('build', ['default']);
    grunt.registerTask('test', ['karma', 'nodeunit', 'jshint']);
};
