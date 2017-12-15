module.exports = (grunt) => {
    require('load-grunt-tasks')(grunt);
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        uglify: {
            production: {
                options: {
                },
                files: {
                    'dist/offlr.min.js': 'src/js/offlr.js'
                }
            },
            development: {
                options: {
                    beautify: true
                },
                files: {
                    'dist/offlr.js': 'src/js/offlr.js'
                }
            }
        },

        eslint: {
            options: {
                configFile: '.eslintrc.json',
            },
            target: ['src/js/offlr.js']
        },

        sass: {
            options: {
                sourceMap: false
            },
            production: {
                options: {
                    outputStyle: 'compressed'
                },
                files: {
                    'dist/offlr.min.css': 'src/scss/style.scss'
                }
            },
            development: {
                options: {
                    outputStyle: 'expanded'
                },
                files: {
                    'dist/offlr.css': 'src/scss/style.scss'
                }
            }
        },

        postcss: {
            options: {
                map: false,
                processors: [
                    require('autoprefixer')
                ]
            },
            dist: {
                src: 'dist/*.css'
            }
        },

        watch: {
            scripts: {
                files: 'src/js/**/*.js',
                tasks: ['eslint', 'uglify:development']
            },
            styles: {
                files: 'src/scss/**/*.scss',
                tasks: ['sass:development', 'postcss']
            }
        }
    });

    grunt.registerTask('default', ['sass:development', 'uglify:development', 'watch']);
    grunt.registerTask('build', ['sass:production', 'postcss', 'eslint', 'uglify:production']);
}