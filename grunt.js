/*global module:false*/
module.exports = function(grunt) {

  /**
    Build directories
    Any directories used by the build should be defined here
  */
  var dirs = {
    build: 'build',
    source: 'source'
  };


  /* read package.json */
  var pkg = grunt.file.readJSON('package.json');

  grunt.initConfig({

    // this seems stupid, but it has to happen
    dirs: dirs,

    /* meta information from package file */
    meta: {
      version: pkg.version,
      appName: pkg.name,
      appWebSite: pkg.repository.url
    },

    /*   LINT   */
    lint: {
      files: [
        'grunt.js', 
        'build/js/main.js',
        'build/js/plugins.js'
      ]
    },

    /*   JS HINT   */
    jshint: {
      options: {
        eqeqeq: true,
        immed: true,
        latedef: true,
        newcap: true,
        noarg: true,
        sub: true,
        undef: true,
        boss: true,
        eqnull: true,
        browser: true,
        smarttabs: true,
        predef: [
          '$',            // jQuery
          'jQuery',       // jQuery
          'console',      // console.log
          '_',            // Underscore
          'Handlebars',   // Handlebars
          'moment'        // Moment.js
        ]
      },
      globals: {}
    },

    /*    MIN JS   */
    min: {
      main: {
        src: ['<%= dirs.build %>/js.main.js'],
        dest: '<%= dirs.build %>/js/main.min.js'
      }
    },

    /*   MIN CSS   */ 
    mincss: {
      main: {
        files: {
          '<%= dirs.build %>/css/main.min.css': '<%= dirs.build %>/css/main.css'
        }
      }
    },

    /*    LESS   */ 
    less: {
      development: {
        files: {
          '<%= dirs.build %>/css/main.css': '<%= dirs.source %>/less/main.less'
        }
      }
      // ,
      // production: {
      //   options: {
      //     paths: ["assets/css"],
      //     yuicompress: true
      //   },
      //   files: {
      //     "path/to/result.css": "path/to/source.less"
      //   }
      // }
    },

    /*   CLEAN   */
    clean: {
      build: '<%= dirs.build %>'
    },

    /*   COPY   */
    copy: {
      main: {
        src: '<%= dirs.source %>/*.*',
        dest: '<%= dirs.build %>/'
      },
      scripts: {
        src: '<%= dirs.source %>/js/**',
        dest: '<%= dirs.build %>/js/'
      },
      images: {
        options: {
          basePath: 'images'
        },
        src: '<%= dirs.source %>/images/**',
        dest: '<%= dirs.build %>/images/'
      },
      fonts: {
        src: '<%= dirs.source %>/fonts/**',
        dest: '<%= dirs.build %>/fonts/'
      }
    },

    /*    WATCH    */
    watch: {
      main: {
        files: '<%= dirs.source %>/index.html',
        tasks: 'copy:main'
      },
      less: {
        files: '<%= dirs.source %>/less/**',
        tasks: 'less:development'
      },
      scripts: {
        files: '<config:lint.files>',
        tasks: 'lint'
      }
    }

  // end init config  
  });

  // load NPM tasks
  grunt.loadNpmTasks('grunt-contrib-clean');
  grunt.loadNpmTasks('grunt-contrib-copy');
  grunt.loadNpmTasks('grunt-contrib-mincss');
  grunt.loadNpmTasks('grunt-contrib-compress');
  grunt.loadNpmTasks('grunt-contrib-less');

  // Partial build for development
  grunt.registerTask('partial', 'copy lint less');

  grunt.registerTask('full-build', 'lint copy min less mincss');

  grunt.registerTask('full', 'clean full-build');

  // Rename watch task so we can override it
  grunt.task.renameTask('watch', 'watch-start');

  // Redefine watch to build partial first
  grunt.registerTask('watch', 'partial watch-start');

  // Default task
  grunt.registerTask('default', 'partial');

};