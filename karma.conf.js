process.env.BABEL_ENV = 'test';

const webpackEnv = { test: true };
const webpackConfig = require('./webpack.config.babel')(webpackEnv);

const testGlob = 'test/*.test.js';
const srcGlob = 'src/js/!(*.test|*.stub).js';

module.exports = (config) => {
  config.set({
    basePath: '',
    frameworks: ['mocha', 'chai'],
    files: [
      'node_modules/bluebird/js/browser/bluebird.core.min.js',
      'node_modules/bluebird/js/browser/bluebird.min.js',
      'node_modules/whatwg-fetch/fetch.js',
      'node_modules/jquery/dist/jquery.min.js',
      'node_modules/lovefield/dist/lovefield.min.js',
      testGlob,
      srcGlob],
    exclude: [''],
    preprocessors: {
      [testGlob]: ['webpack'],
      [srcGlob]: ['webpack'],
    },
    webpack: webpackConfig,
    webpackMiddleware: { noInfo: true },
    reporters: ['progress', 'coverage'],
    coverageReporter: {
      check: {
        global: {
          statements: 70,
          branches: 70,
          functions: 70,
          lines: 70,
        },
      },
      reporters: [
        { type: 'lcov', dir: 'coverage/', subdir: '.' },
        { type: 'json', dir: 'coverage/', subdir: '.' },
        { type: 'text-summary' },
      ],
    },
    port: 9876,
    colors: true,
    logLevel: config.LOG_INFO,
    autoWatch: false,
    browsers: ['Chrome', 'Firefox', 'Safari', 'Opera'],
    singleRun: true,
    concurrency: Infinity,
  });
};
