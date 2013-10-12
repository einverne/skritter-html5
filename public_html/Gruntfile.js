/**
 * @param grunt
 * @author Joshua McFarland
 */
module.exports = function(grunt) {
    
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        copy: {
            'android': {
                files: [
                    {expand: true, cwd: './',  src: [
                            'config.xml',
                            'index.html',
                            'index-cordova.html',
                            'css/**',
                            'js/**',
                            'media/**', 
                            'template/**'
                        ], dest: '../build/cordova/www/'}
                ]
            }
        },
        jshint: {
            ignore_warning: {
                options: {
                    /*'-W058': true,
                    '-W082': true,*/
                    '-W083': true,
                    '-W099': true
                },
                src: ['js/app/**/*.js']
            }
        },
        yuidoc: {
            compile: {
                name: '<%= pkg.name %>',
                description: '<%= pkg.description %>',
                version: '<%= pkg.version %>',
                options: {
                    paths: 'js/app',
                    outdir: '../docs'
                }
            }
        }
    });
    
    grunt.loadNpmTasks('grunt-contrib-copy');
    grunt.loadNpmTasks('grunt-contrib-jshint');
    grunt.loadNpmTasks('grunt-contrib-requirejs');
    grunt.loadNpmTasks('grunt-contrib-yuidoc');
    
    grunt.registerTask('android', ['jshint', 'copy:android']);
    grunt.registerTask('docs', ['yuidoc']);
    grunt.registerTask('hint', ['jshint']);
};