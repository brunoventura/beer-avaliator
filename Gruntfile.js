module.exports = function (grunt) {
  grunt.initConfig({
    // Wiredep task config (bower lib injector)
    wiredep: {
      task: {
        src: ['./static/index.html']
      }
    },
    //Injector task config
    "injector": {
      options: {
        template: 'static/index.html',
        addRootSlash: false,
        ignorePath: './static/'
      },
      defaults: {
        files: {
          'static/index.html': ['./static/scripts/*.js', './static/css/*.css'],
        }
      }
    },
  });

  grunt.loadNpmTasks('grunt-injector');
  grunt.loadNpmTasks('grunt-wiredep');

  grunt.registerTask('grunt-injector', ['injector']);
};