module.exports = {
    preset: 'jest-puppeteer',
    testRegex: './*\\.test\\.js$',
    setupFilesAfterEnv: ['./setupTests.js'],
    reporters: [
      'default',
      ['jest-junit', { outputDirectory: './', outputName: 'test-report.xml' }]
    ]
  };