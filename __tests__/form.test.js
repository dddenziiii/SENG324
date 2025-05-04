const { setup: setupPuppeteer } = require('jest-environment-puppeteer');

describe('Registration Form', () => {
  beforeAll(async () => {
    await page.setViewport({ width: 1280, height: 800 });
    await page.goto('http://localhost:5500/index.html');
  });

  // 1. Form Görüntüleme Testi
  it('should display the registration form', async () => {
    await expect(page).toMatchTextContent('User Registration Portal');
    await expect(page).toMatchSelector('form#signupForm');
    await page.screenshot({ path: '__screenshots__/form-display.png' });
  });

  // 2. Ad Validasyonu
  it('should validate first name field', async () => {
    // Geçersiz giriş
    await page.type('#firstName', 'John123');
    await page.click('#lastName');
    const error = await page.$eval('#firstName + .invalid-feedback', el => el.textContent.trim());
    expect(error).toBe('Please enter a valid first name (letters only).');
    
    // Geçerli giriş
    await page.$eval('#firstName', el => el.value = '');
    await page.type('#firstName', 'John');
    const isValid = await page.$eval('#firstName', el => el.checkValidity());
    expect(isValid).toBe(true);
  });

  // 3. Şifre Testleri
  it('should validate password strength', async () => {
    // Zayıf şifre (BVA: 7 karakter)
    await page.type('#password', 'Short1!');
    await page.click('#confirmPassword');
    const error = await page.$eval('#password + .invalid-feedback', el => el.textContent.trim());
    expect(error).toContain('Password must meet all requirements');
    
    // Geçerli şifre
    await page.$eval('#password', el => el.value = '');
    await page.type('#password', 'StrongPass123!');
    const isValid = await page.$eval('#password', el => el.checkValidity());
    expect(isValid).toBe(true);
  });

  // 4. Diğer Testler...
  it('should show validation report on submit', async () => {
    // Formu doldur
    await page.type('#firstName', 'John');
    await page.type('#lastName', 'Doe');
    await page.type('#email', 'test@example.com');
    
    // Geçerli bir doğum tarihi ayarla
    const date = new Date();
    date.setFullYear(date.getFullYear() - 20);
    await page.$eval('#dob', (el, date) => el.value = date, date.toISOString().split('T')[0]);
    
    await page.type('#password', 'ValidPass123!');
    await page.type('#confirmPassword', 'ValidPass123!');
    await page.click('#terms');
    
    // Gönder butonuna tıkla
    await Promise.all([
      page.waitForSelector('#validationResultsCard', { visible: true }),
      page.click('button[type="submit"]')
    ]);
    
    // Raporu kontrol et
    await expect(page).toMatchTextContent('Validation Report');
    await page.screenshot({ path: '__screenshots__/validation-report.png' });
  });
});