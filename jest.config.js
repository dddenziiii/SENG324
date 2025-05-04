module.exports = {
  preset: 'jest-puppeteer',
  testMatch: ['**/__tests__/**/*.test.js'],
  setupFilesAfterEnv: ['./__tests__/jest.setup.js'],
  reporters: [
    'default',
    ['jest-junit', {
      outputDirectory: '.',
      outputName: 'test-report.xml',
      includeConsoleOutput: true
    }]
  ],
  testEnvironment: 'jest-environment-puppeteer',
  verbose: true
};