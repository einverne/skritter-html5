/**
 * @param grunt
 * @author Joshua McFarland
 */

module.exports = function(grunt) {
    
    var paths = {
        //directories
        templates: '../../templates',
        spec: '../../tests/spec/',
        //libraries
        async: '../libs/async',
        hammer: '../libs/hammer-1.0.6.min',
        moment: '../libs/moment-2.5.0',
        'require.text': '../libs/require.text-2.0.10'
    };
    
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        clean: {
            build: {
                src: ['build/www/'],
                options: {
                    force: true
                }
            },
            cordova: {
                src: ['build/cordova/www/'],
                options: {
                    force: true
                }
            }
        },
        copy: {
            'public_html-cordova': {
                files: [
                    {expand: true, cwd: 'public_html/', src: [
                            '**'
                        ], dest: 'build/cordova/www/'}
                ]
            },
            'public_html-www': {
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
                    exclude: ['skritter.appcache', 'version.json']
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
                    exclude: ['skritter.appcache', 'version.json']
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
                    {src: 'Application.js', dest: 'build/www/js/app/', expand: true, cwd: 'build/www/js/app/'}
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
                            name: 'Libraries'
                        }
                    ],
                    optimize: 'uglify2',
                    optimizeCss: 'standard',
                    paths: paths,
                    preserveLicenseComments: false,
                    removeCombined: true
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
                            name: 'Libraries'
                        }
                    ],
                    optimize: 'none',
                    optimizeCss: 'standard',
                    paths: paths,
                    preserveLicenseComments: false,
                    removeCombined: true
                }
            },
            cordova: {
                options: {
                    appDir: "public_html/",
                    baseUrl: "js/app/",
                    dir: "build/cordova/www/",
                    fileExclusionRegExp: /\.mp3$/,
                    generateSourceMaps: false,
                    keepBuildDir: false,
                    modules: [
                        {
                            name: 'Application'
                        },
                        {
                            name: 'Libraries'
                        }
                    ],
                    optimize: 'none',
                    optimizeCss: 'standard',
                    paths: paths,
                    preserveLicenseComments: false,
                    removeCombined: true
                }
            }
        },
        shell: {
            'cordova-android-build-run': {
                command: [
                    'cd build/cordova/',
                    'cordova build android',
                    'cordova run android'
                ].join('&&'),
                options: {
                    stdout: true
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
    grunt.registerTask('build-copy', ['jshint', 'clean:build', 'copy:public_html-www', 'replace:copy-version', 'manifest:optimized', 'yuidoc:www']);
    grunt.registerTask('build-cordova', ['jshint', 'clean:cordova', 'copy:public_html-cordova', 'shell:cordova-android-build-run']);
};