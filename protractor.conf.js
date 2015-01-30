exports.config = {
  framework: 'mocha',
  specs: [
    'test/e2e/**/*.spec.js'
  ],
  mochaOpts: {
    enableTimeouts: false
  },
  onPrepare: function () {
    process.env.NODE_ENV = 'test';
    process.env.PORT = 3001;
    require('./server');
  }
}