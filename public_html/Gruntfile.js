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
                src: ['../build/cordova/'],
                options: {
                    force: true
                }
            },
            'www-build': {
                src: ['../build/www/'],
                options: {
                    force: true
                }
            }
        },
        copy: {
            'android-build': {
                files: [
                    {expand: true, cwd: './', src: [
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
                    {expand: true, cwd: '../cordova/android/', src: ['**'], dest: '../build/cordova/platforms/android/'}
                ]
            },
            'www-build': {
                files: [
                    {expand: true, cwd: './', src: [
                            'js/lib/**',
                            'media/**'
                        ], dest: '../build/www/'}
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
        requirejs: {
            compile: {
                options: {
                    appDir: "./",
                    baseUrl: "js/app/",
                    dir: "../build/www/",
                    fileExclusionRegExp: /^(media|node_modules)$/,
                    keepBuildDir: true,
                    name: "Application",
                    removeCombined: true,
                    paths: {
//directories
                        component: 'view/component',
                        media: '../../media',
                        prompt: 'view/prompt',
                        template: '../../template',
                        //libraries
                        async: '../lib/async',
                        backbone: '../lib/backbone-1.1.0.min',
                        base64: '../lib/base64',
                        bootstrap: '../lib/bootstrap-3.0.0.min',
                        'createjs.easel': '../lib/createjs.easeljs-0.7.0.min',
                        'createjs.preload': '../lib/createjs.preloadjs-0.4.0.min',
                        'createjs.sound': '../lib/createjs.soundjs-0.5.0.min',
                        'createjs.tween': '../lib/createjs.tweenjs-0.5.0.min',
                        jquery: '../lib/jquery-1.10.2.min',
                        'jquery.hammer': '../lib/jquery.hammerjs-1.0.5.min',
                        'jquery.indexeddb': '../lib/jquery.indexeddb',
                        leap: '../lib/leap',
                        lodash: '../lib/lodash.compat-2.2.1.min',
                        'require.text': '../lib/require.text-2.0.10'
                    },
                    shim: {
                        backbone: {
                            deps: ['jquery', 'lodash', 'require.text'],
                            exports: 'Backbone'
                        },
                        bootstrap: {
                            deps: ['jquery']
                        },
                        jquery: {
                            exports: '$'
                        },
                        'jquery.hammer': {
                            deps: ['jquery']
                        },
                        'jquery.indexeddb': {
                            deps: ['jquery']
                        },
                        leap: {
                            exports: 'Leap'
                        },
                        lodash: {
                            exports: '_'
                        }
                    }
                }
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
    grunt.registerTask('www-build', ['jshint', 'clean:www-build', 'requirejs', 'copy:www-build']);
};