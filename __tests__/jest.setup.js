require('expect-puppeteer');
const fs = require('fs');

beforeAll(async () => {
  // Ekran görüntüleri için klasör oluştur
  if (!fs.existsSync('__tests__/__screenshots__')) {
    fs.mkdirSync('__tests__/__screenshots__', { recursive: true });
  }
});

beforeEach(async () => {
  await jestPuppeteer.resetPage();
  await page.setDefaultTimeout(10000);
});

// Özel matcher'lar
expect.extend({
  async toMatchTextContent(element, expectedText) {
    const content = await element.evaluate(el => el.textContent);
    const pass = content.includes(expectedText);
    return {
      pass,
      message: () => `Expected "${expectedText}" ${pass ? 'not ' : ''}found in element`
    };
  },
  
  async toMatchSelector(element, selector) {
    const found = await element.$(selector);
    return {
      pass: found !== null,
      message: () => `Selector "${selector}" ${found ? '' : 'not '}found`
    };
  }
});