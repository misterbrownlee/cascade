module.exports = function(grunt) {

  var buildDir = "build";
  var sourceDir = "source";


  // grunt configuration
  grunt.initConfig({
    
    pkg: grunt.file.readJSON('package.json'),

    dirs: {
      build: {
        root:     buildDir,
        css:      buildDir + '/css',
        js:       buildDir + '/js',
        images:   buildDir + '/images',
        fonts:    buildDir + '/fonts'
      },
      source: {
        root:     sourceDir,
        less:     sourceDir + '/less',
        js:       sourceDir + 'js',
        images:   sourceDir + 'images',
        fonts:    sourceDir + 'fonts'
      }
    },

    /*   CLEAN   */
    clean: {
      development: ['<%=dirs.build.root%>']
    },

    /*   COPY   */
    copy: {
      main: {
        expand: true, 
        cwd: '<%=dirs.source.root%>',  
        src: ['**/*.html', '*.txt'], 
        dest: '<%=dirs.build.root%>'  
      },
      scripts: {
        expand: true, 
        cwd: '<%=dirs.source.js%>',  
        src: ['**/*.js'], 
        dest: '<%=dirs.build.js%>' 
      }, 
      images: {
        expand: true, 
        cwd: '<%=dirs.source.images%>',  
        src: ['**/*'], 
        dest: '<%=dirs.build.images%>'
      },
      fonts: {
        expand: true, 
        cwd: '<%=dirs.source.fonts%>',  
        src: ['**/*'], 
        dest: '<%=dirs.build.fonts%>'
      }
    },


    /*    WATCH    */
    watch: {
      main: {
        files: ['<%= dirs.source %>/**/*.html', '<%= dirs.source %>/**/*.txt'],
        tasks: 'copy:main'
      },
      less: {
        files: '<%= dirs.source.less %>/**',
        tasks: 'less:development'
      },
      scripts: {
        files: ['Gruntfile.js', '<%= dirs.source.js %>/main.js'],
        tasks: 'jshint'
      }
    },

    /*   COMPILE LESS   */
    less: {
      development: {
        files: {
          '<%=dirs.build.css%>/main.css': '<%=dirs.source.less%>/main.less'
        }
      }
    },

    /*   JS HINT   */
    jshint: {
      all: ['Gruntfile.js', '<%=dirs.source.js%>/main.js']  
    },

    /*   MIN CSS   */ 
    mincss: {
      main: {
        files: {
          '<%= dirs.build.css %>/main.min.css': '<%= dirs.build.css %>/main.css'
        }
      }
    }    
    
  });
  // end init config

  // load NPM tasks
  grunt.loadNpmTasks('grunt-contrib-clean');
  grunt.loadNpmTasks('grunt-contrib-copy');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-contrib-mincss');
  grunt.loadNpmTasks('grunt-contrib-less');

  // get your task on
  grunt.registerTask('partial', ['jshint', 'copy', 'less']);
  grunt.registerTask('full', ['clean', 'partial', 'mincss']);
  grunt.registerTask('watch-start', ['partial', 'watch']);

  // default task
  grunt.registerTask('default', ['partial']);

};