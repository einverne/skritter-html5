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
                    {src: 'Application.js', dest: 'build/www/js/app/', expand: true, cwd: 'build/www/js/app/'},
                    {src: 'manifest.json', dest: 'build/www/', expand: true, cwd: 'build/www/'}
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
                    {src: 'manifest.json', dest: 'build/www/', expand: true, cwd: 'build/www/'}
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