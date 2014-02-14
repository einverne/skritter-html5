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
            cordova: {
                src: ['build/cordova/'],
                options: {
                    force: true
                }
            },
            'cordova-www': {
                src: ['build/cordova/www/'],
                options: {
                    force: true
                }
            },
            web: {
                src: ['build/web/'],
                options: {
                    force: true
                }
            }
        },
        copy: {
            'cordova-install': {
                files: [
                    {expand: true, cwd: 'cordova/', src: [
                            '**'
                        ], dest: 'build/cordova/'}
                ]
            },
            'cordova-www': {
                files: [
                    {expand: true, cwd: 'public_html/', src: [
                            '**'
                        ], dest: 'build/cordova/www/'}
                ]
            },
            web: {
                files: [
                    {expand: true, cwd: 'public_html/', src: [
                            '**'
                        ], dest: 'build/web/'}
                ]
            }
        },
        jshint: {
            all: ['Gruntfile.js', 'public_html/js/app/**/*.js']
        },
        manifest: {
            generate: {
                options: {
                    basePath: 'public_html/',
                    cache: ['index.html'],
                    network: ['*'],
                    preferOnline: false,
                    verbose: false,
                    timestamp: true,
                    exclude: ['skritter.appcache', 'version.json']
                },
                src: [
                    '*.*',
                    '**/*.css',
                    '**/*.eot',
                    '**/*.html',
                    '**/*.js',
                    '**/*.otf',
                    '**/*.png',
                    '**/*.svg',
                    '**/*.woff'
                ],
                dest: 'public_html/skritter.appcache'
            },
            'web-combined': {
                options: {
                    basePath: 'build/web/',
                    cache: ['index.html'],
                    network: ['*'],
                    preferOnline: false,
                    verbose: false,
                    timestamp: true,
                    exclude: ['skritter.appcache', 'version.json']
                },
                src: [
                    '*.*',
                    '**/*.css',
                    '**/*.eot',
                    '**/*.html',
                    '**/*.js',
                    '**/*.otf',
                    '**/*.png',
                    '**/*.svg',
                    '**/*.woff'
                ],
                dest: 'build/web/skritter.appcache'
            }
        },
        replace: {
            cordova: {
                options: {
                    variables: {
                        'version': '<%= pkg.version %>',
                        'date': new Date().toUTCString().substr(0, 25)
                    }
                },
                files: [
                    {src: 'config.xml', dest: 'build/cordova/', expand: true, cwd: 'build/cordova/'}
                ]
            },
            'web-combined': {
                options: {
                    variables: {
                        'version': '<%= pkg.version %>',
                        'date': new Date().toUTCString().substr(0, 25)
                    }
                },
                files: [
                    {src: 'Application.js', dest: 'build/web/js/app/', expand: true, cwd: 'build/web/js/app/'}
                ]
            },
            'web-copied': {
                options: {
                    variables: {
                        'version': '<%= pkg.version %>',
                        'date': new Date().toUTCString().substr(0, 25)
                    }
                },
                files: [
                    {src: 'Settings.js', dest: 'build/web/js/app/model/', expand: true, cwd: 'build/web/js/app/model/'}
                ]
            }
        },
        requirejs: {
            'web-combined': {
                options: {
                    appDir: 'public_html/',
                    baseUrl: 'js/app/',
                    dir: 'build/web/',
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
            'web-optimized': {
                options: {
                    appDir: 'public_html/',
                    baseUrl: 'js/app/',
                    dir: 'build/web/',
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
            }
        },
        shell: {
            'android-build-run': {
                command: [
                    'cd build/cordova/',
                    'cordova build android',
                    'cordova run android'
                ].join('&&'),
                options: {
                    stdout: true
                }
            },
            'android-install': {
                command: [
                    'cd build/',
                    'cordova create cordova com.inkren.skritter Skritter',
                    'cd cordova/',
                    'cordova platforms add android',
                    'cordova plugins add https://github.com/mcfarljw/Cordova-SQLitePlugin.git'
                ].join('&&'),
                options: {
                    stdout: true
                }
            }
        },
        yuidoc: {
            web: {
                name: '<%= pkg.appName %>: Documentation',
                description: '<%= pkg.description %>',
                version: '<%= pkg.version %>',
                options: {
                    paths: 'public_html/js/app',
                    outdir: 'build/web/docs',
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
    grunt.registerTask('hint', ['jshint']);
    grunt.registerTask('build-android', [
        'jshint',
        'clean:cordova-www',
        'copy:cordova-www',
        'shell:android-build-run'
    ]);
    grunt.registerTask('build-web-combined', [
        'jshint',
        'clean:web',
        'requirejs:web-combined',
        'replace:web-combined',
        'manifest:web-combined',
        'yuidoc:web'
    ]);
    grunt.registerTask('build-web-copied', [
        'jshint',
        'clean:web',
        'appcache',
        'copy:web',
        'replace:web-copied',
        'yuidoc:web'
    ]);
    grunt.registerTask('build-web-optimized', [
        'jshint',
        'clean:web',
        'requirejs:web-optimized',
        'replace:web-combined',
        'manifest:web-combined',
        'yuidoc:web'
    ]);
    grunt.registerTask('install-android', [
        'clean:cordova',
        'shell:android-install',
        'copy:cordova-install',
        'replace:cordova'
    ]);
};