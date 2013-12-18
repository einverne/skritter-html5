/**
 * @param grunt
 * @author Joshua McFarland
 */

var paths = {
    //directories
    templates: '../../templates',
    specs: '../../tests/specs/',
    //libraries
    async: '../libs/async',
    backbone: '../libs/backbone-1.1.0',
    base64: '../libs/base64',
    bootstrap: '../../bootstrap/js/bootstrap',
    'createjs.easel': '../libs/createjs.easel-NEXT.min',
    'createjs.tween': '../libs/createjs.tween-NEXT.min',
    'indexeddb.shim': '../libs/indexeddb.shim',
    jasmine: '../../tests/libs/jasmine',
    'jasmine-html': '../../tests/libs/jasmine-html',
    jquery: '../libs/jquery-2.0.3',
    'jquery.hammer': '../libs/jquery.hammer-1.0.5',
    'jquery.indexeddb': '../libs/jquery.indexeddb',
    lodash: '../libs/lodash-2.4.1',
    'lz-string': '../libs/lz-string-1.3.3',
    moment: '../libs/moment-2.4.0',
    'require.text': '../libs/require.text-2.0.10'
};

var shim = {
    backbone: {
        deps: ['jquery', 'lodash', 'require.text'],
        exports: 'Backbone'
    },
    bootstrap: ['jquery'],
    'jasmine-html': {
        deps: ['jasmine', 'jquery'],
        exports: 'jasmine'
    },
    jquery: {
        exports: '$'
    },
    'jquery.indexeddb': ['jquery'],
    lodash: {
        exports: '_'
    }
};

module.exports = function(grunt) {
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
                    timestamp: false
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
            'optimized': {
                options: {
                    basePath: "build/www/",
                    cache: ["index.html"],
                    network: ["*"],
                    preferOnline: false,
                    verbose: false,
                    timestamp: true
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
                        'version': '<%= pkg.version %>'
                    }
                },
                files: [
                    {src: 'Application.js', dest: 'build/www/js/app/', expand: true, cwd: 'build/www/js/app/'}
                ]
            },
            'copy-version': {
                options: {
                    variables: {
                        'version': '<%= pkg.version %>'
                    }
                },
                files: [
                    {src: 'Settings.js', dest: 'build/www/js/app/model/', expand: true, cwd: 'build/www/js/app/model/'}
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

    grunt.registerTask('appcache', ['manifest']);
    grunt.registerTask('docs', ['yuidoc']);
    grunt.registerTask('hint', ['jshint']);
    grunt.registerTask('build-combined', ['jshint', 'clean:build', 'requirejs:combined', 'replace:compiled-version', 'manifest:optimized', 'yuidoc:www']);
    grunt.registerTask('build-optimized', ['jshint', 'clean:build', 'requirejs', 'replace:compiled-version', 'manifest:optimized', 'yuidoc:www']);
    grunt.registerTask('build-copy', ['jshint', 'clean:build', 'copy:public_html', 'replace:copy-version', 'yuidoc:www']);
};