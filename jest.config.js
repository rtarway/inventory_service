module.exports = {
    "testEnvironment": "node",
    "collectCoverage": true,
    "coverageReporters": ["json", "html"],
    "coveragePathIgnorePatterns": [
        "/node_modules/"
      ],
      "verbose": true,
      "globalSetup": './test-setup-globals.js',
      "globalTeardown": './test-teardown-globals.js',
};