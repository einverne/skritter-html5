/**
 * @param grunt
 * @author Joshua McFarland
 */
module.exports = function(grunt) {

    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        clean: {
            'www-build': {
                src: ['build/www/'],
                options: {
                    force: true
                }
            }
        },
        copy: {
            'www-build': {
                files: [
                    {expand: true, cwd: 'public_html/', src: [
                            'js/lib/**',
                            'media/**'
                        ], dest: 'build/www/'}
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
                src: ['public_html/js/app/**/*.js']
            }
        },
        manifest: {
            generate: {
                options: {
                    basePath: "public_html/",
                    cache: ["index.html"],
                    network: ["*"],
                    preferOnline: false,
                    verbose: false,
                    timestamp: true
                },
                src: [
                    "**/*.png",
                    "css/**/*.js",
                    "js/**/*.js",
                    "media/**/*.eot",
                    "media/**/*.svg",
                    "media/**/*.ttf",
                    "media/**/*.woff",
                    "template/**/*.html"
                ],
                dest: "public_html/skritter.appcache"
            },
            'generate-www': {
                    options: {
                        basePath: "build/www/",
                        cache: ["index.html"],
                        network: ["*"],
                        preferOnline: false,
                        verbose: false,
                        timestamp: true
                    },
                    src: [
                        "**/*.png",
                        "css/**/*.js",
                        "js/**/*.js",
                        "media/**/*.eot",
                        "media/**/*.svg",
                        "media/**/*.ttf",
                        "media/**/*.woff",
                        "template/**/*.html"
                    ],
                    dest: "build/www/skritter.appcache"
            }
        },
        requirejs: {
            compile: {
                options: {
                    appDir: "public_html/",
                    baseUrl: "js/app/",
                    dir: "build/www/",
                    keepBuildDir: false,
                    fileExclusionRegExp: /^(config.xml|index-cordova.html)$/,
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
                        'indexeddb.shim': '../lib/indexeddb.shim-0.1.2.min',
                        jquery: '../lib/jquery-1.10.2.min',
                        'jquery.hammer': '../lib/jquery.hammerjs-1.0.5.min',
                        'jquery.indexeddb': '../lib/jquery.indexeddb',
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
                        lodash: {
                            exports: '_'
                        }
                    }
                }
            }
        },
        shell: {},
        yuidoc: {
            compile: {
                name: '<%= pkg.name %>',
                description: '<%= pkg.description %>',
                version: '<%= pkg.version %>',
                options: {
                    paths: 'public_html/js/app',
                    outdir: 'build/docs'
                }
            },
            'compile-www': {
                name: '<%= pkg.name %>',
                description: '<%= pkg.description %>',
                version: '<%= pkg.version %>',
                options: {
                    paths: 'public_html/js/app',
                    outdir: 'build/www/docs'
                }
            }
        }
    });

    grunt.loadNpmTasks('grunt-contrib-clean');
    grunt.loadNpmTasks('grunt-contrib-copy');
    grunt.loadNpmTasks('grunt-contrib-jshint');
    grunt.loadNpmTasks('grunt-contrib-requirejs');
    grunt.loadNpmTasks('grunt-contrib-yuidoc');
    grunt.loadNpmTasks('grunt-manifest');
    grunt.loadNpmTasks('grunt-shell');

    grunt.registerTask('docs', ['yuidoc']);
	grunt.registerTask('cache-manifest', ['manifest']);
    grunt.registerTask('hint', ['jshint']);    
    grunt.registerTask('www-build', ['jshint', 'clean:www-build', 'requirejs', 'manifest:generate-www', 'yuidoc:compile-www']);
};