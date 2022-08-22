module.exports = {
    "testEnvironment": "node",
    "collectCoverage": true,
    "coverageReporters": ["json", "html"],
    "coveragePathIgnorePatterns": [
        "/node_modules/"
      ],
      "verbose": true,
      "globalSetup": '/Users/riteshtarway/visual_code_workspace/nodejs_workspace/inventory_service/test-setup-globals.js',
      "globalTeardown": '/Users/riteshtarway/visual_code_workspace/nodejs_workspace/inventory_service/test-teardown-globals.js',
};