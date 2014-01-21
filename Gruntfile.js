/**
 * @param grunt
 * @author Joshua McFarland
 */

module.exports = function(grunt) {
    
    var paths = {
        //directories
        templates: '../../templates',
        //libraries
        async: '../libs/async',
        backbone: '../libs/backbone-1.1.0.min',
        base64: '../libs/base64',
        bootstrap: '../../bootstrap/js/bootstrap.min',
        'bootstrap.switch': '../../bootstrap/components/switch/js/bootstrap-switch.min',
        'createjs.easel': '../libs/createjs.easel-NEXT.min',
        'createjs.tween': '../libs/createjs.tween-NEXT.min',
        'hammer': '../libs/hammer-1.0.6.min',
        'indexeddb.shim': '../libs/indexeddb.shim',
        jquery: '../libs/jquery-1.10.2.min',
        'jquery.indexeddb': '../libs/jquery.indexeddb',
        'leap': '../libs/leap.min',
        lodash: '../libs/lodash-2.4.1.compat.min',
        moment: '../libs/moment-2.5.0',
        'require.text': '../libs/require.text-2.0.10'
    };

    var shim = {
        backbone: {
            deps: ['jquery', 'lodash', 'require.text'],
            exports: 'Backbone'
        },
        bootstrap: ['jquery'],
        'bootstrap.switch': ['jquery'],
        jquery: {
            exports: '$'
        },
        'jquery.indexeddb': ['indexeddb.shim', 'jquery'],
        lodash: {
            exports: '_'
        }
    };
    
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        clean: {
            'build': {
                src: ['build/www/'],
                options: {
                    force: true
                }
            }
        },
        copy: {
            'public_html': {
                files: [
                    {expand: true, cwd: 'public_html/', src: [
                            '**'
                        ], dest: 'build/www/'}
                ]
            }
        },
        jshint: {
            all: ['Gruntfile.js', 'public_html/js/app/**/*.js']
        },
        manifest: {
            generate: {
                options: {
                    basePath: "public_html/",
                    cache: ["index.html"],
                    network: ["*"],
                    preferOnline: false,
                    verbose: false,
                    timestamp: true,
                    exclude: ['manifest.webapp', 'package.json', 'skritter.appcache', 'version.json']
                },
                src: [
                    "*.*",
                    "**/*.css",
                    "**/*.eot",
                    "**/*.html",
                    "**/*.js",
                    "**/*.otf",
                    "**/*.png",
                    "**/*.svg",
                    "**/*.woff"
                ],
                dest: "public_html/skritter.appcache"
            },
            optimized: {
                options: {
                    basePath: "build/www/",
                    cache: ["index.html"],
                    network: ["*"],
                    preferOnline: false,
                    verbose: false,
                    timestamp: true,
                    exclude: ['manifest.webapp', 'package.json', 'skritter.appcache', 'version.json']
                },
                src: [
                    "*.*",
                    "**/*.css",
                    "**/*.eot",
                    "**/*.html",
                    "**/*.js",
                    "**/*.otf",
                    "**/*.png",
                    "**/*.svg",
                    "**/*.woff"
                ],
                dest: "build/www/skritter.appcache"
            }
        },
        replace: {
            'compiled-version': {
                options: {
                    variables: {
                        'version': '<%= pkg.version %>',
                        'date': new Date().toUTCString().substr(0, 25)
                    }
                },
                files: [
                    {src: 'Application.js', dest: 'build/www/js/app/', expand: true, cwd: 'build/www/js/app/'},
                    {src: 'package.json', dest: 'build/www/', expand: true, cwd: 'build/www/'},
                    {src: 'version.json', dest: 'build/www/', expand: true, cwd: 'build/www/'}
                ]
            },
            'copy-version': {
                options: {
                    variables: {
                        'version': '<%= pkg.version %>',
                        'date': new Date().toUTCString().substr(0, 25)
                    }
                },
                files: [
                    {src: 'Settings.js', dest: 'build/www/js/app/model/', expand: true, cwd: 'build/www/js/app/model/'},
                    {src: 'package.json', dest: 'build/www/', expand: true, cwd: 'build/www/'},
                    {src: 'version.json', dest: 'build/www/', expand: true, cwd: 'build/www/'}
                ]
            }
        },
        requirejs: {
            compile: {
                options: {
                    appDir: "public_html/",
                    baseUrl: "js/app/",
                    dir: "build/www/",
                    fileExclusionRegExp: /\.mp3$/,
                    generateSourceMaps: true,
                    keepBuildDir: false,
                    modules: [
                        {
                            name: 'Application'
                        },
                        {
                            name: 'Jasmine'
                        }
                    ],
                    optimize: 'uglify2',
                    optimizeCss: 'standard',
                    paths: paths,
                    preserveLicenseComments: false,
                    removeCombined: true,
                    shim: shim
                }
            },
            combined: {
                options: {
                    appDir: "public_html/",
                    baseUrl: "js/app/",
                    dir: "build/www/",
                    fileExclusionRegExp: /\.mp3$/,
                    generateSourceMaps: false,
                    keepBuildDir: false,
                    modules: [
                        {
                            name: 'Application'
                        },
                        {
                            name: 'Jasmine'
                        }
                    ],
                    optimize: 'none',
                    optimizeCss: 'standard',
                    paths: paths,
                    preserveLicenseComments: false,
                    removeCombined: true,
                    shim: shim
                }
            }
        },
        yuidoc: {
            compile: {
                name: '<%= pkg.appName %>: Documentation',
                description: '<%= pkg.description %>',
                version: '<%= pkg.version %>',
                options: {
                    paths: 'public_html/js/app',
                    outdir: 'build/docs',
                    themedir: 'yuidoc'
                }
            },
            'www': {
                name: '<%= pkg.appName %>: Documentation',
                description: '<%= pkg.description %>',
                version: '<%= pkg.version %>',
                options: {
                    paths: 'public_html/js/app',
                    outdir: 'build/www/docs',
                    themedir: 'yuidoc'
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
    grunt.loadNpmTasks('grunt-replace');
    grunt.loadNpmTasks('grunt-shell');

    grunt.registerTask('appcache', ['manifest:generate']);
    grunt.registerTask('docs', ['yuidoc']);
    grunt.registerTask('hint', ['jshint']);
    grunt.registerTask('build-combined', ['jshint', 'clean:build', 'requirejs:combined', 'replace:compiled-version', 'manifest:optimized', 'yuidoc:www']);
    grunt.registerTask('build-optimized', ['jshint', 'clean:build', 'requirejs', 'replace:compiled-version', 'manifest:optimized', 'yuidoc:www']);
    grunt.registerTask('build-copy', ['jshint', 'clean:build', 'copy:public_html', 'replace:copy-version', 'manifest:optimized', 'yuidoc:www']);
};