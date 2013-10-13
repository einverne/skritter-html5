/**
 * @param grunt
 * @author Joshua McFarland
 */
module.exports = function(grunt) {
    
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        clean: {
            'android-build': {
                src: ['../build/cordova/www/'],
                options: {
                    force: true
                }
            },
            'android-install': {
                src: ['../build/'],
                options: {
                    force: true
                }
            },
            rmdir: {
                src: ['../build/'],
                options: {
                    force: true
                }
            }
        },
        copy: {
            'android-build': {
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
            },
            'android-install': {
                files: [
                    {expand: true, cwd: '../cordova/android/',  src: ['**'], dest: '../build/cordova/platforms/android/'}
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
        shell: {// Task
            'cordova-android': {
                command: [
                    'cd ../build/cordova/',
                    'cordova build android',
                    'cordova run android'
                ].join('&&')
            },
            'cordova-android-install': {
                command: [
                    'cd ../',
                    'mkdir build',
                    'cd build/',
                    'cordova create cordova com.inkren.skritter Skritter',
                    'cd cordova',
                    'cordova platforms add android',
                    'cordova build android',
                    'cordova plugin add org.apache.cordova.media'
                ].join('&&')
            }
        
        },
        yuidoc: {
            compile: {
                name: '<%= pkg.name %>',
                description: '<%= pkg.description %>',
                version: '<%= pkg.version %>',
                options: {
                    paths: 'js/app',
                    outdir: '../build/docs'
                }
            }
        }
    });
    
    grunt.loadNpmTasks('grunt-contrib-clean');
    grunt.loadNpmTasks('grunt-contrib-copy');
    grunt.loadNpmTasks('grunt-contrib-jshint');
    grunt.loadNpmTasks('grunt-contrib-requirejs');
    grunt.loadNpmTasks('grunt-contrib-yuidoc');
    grunt.loadNpmTasks('grunt-shell');
    
    grunt.registerTask('android-build', ['jshint', 'clean:android-build', 'copy:android-build', 'shell:cordova-android']);
    grunt.registerTask('android-install', ['clean:android-install', 'shell:cordova-android-install', 'copy:android-install', 'android-build']);
    grunt.registerTask('docs', ['yuidoc']);
    grunt.registerTask('hint', ['jshint']);
};