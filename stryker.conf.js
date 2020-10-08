"use strict";
/**
 * @type {import('@stryker-mutator/api/core').StrykerOptions}
 */
module.exports = {
  packageManager: "yarn",
  reporters: ["html", "clear-text", "progress"],
  testRunner: "mocha",
  coverageAnalysis: "perTest",
  mutate: [
    'lib/*.js',
  ],
  files: [
    'lib/*.js',
    'test/*.js',
    'test/fixtures/*',
    'test/suite/tests/**/*.json',
  ],
};
