// jest.config.js
module.exports = {
  preset: 'jest-puppeteer',
  testRegex: './*\\.test\\.js$',
  setupFilesAfterEnv: ['./__tests__/setupTests.js'], // Yolu güncelledik
  reporters: [
    'default',
    ['jest-junit', { outputDirectory: './', outputName: 'test-report.xml' }]
  ]
};