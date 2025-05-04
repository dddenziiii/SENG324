describe('Registration Form', () => {
    beforeAll(async () => {
        // GitHub Actions'da localhost:5500'de çalışacak
        await page.goto('http://localhost:5500/index.html'); // index.html ekledik
      });
    
      // Diğer testler aynı kalabilir
      it('should display the registration form', async () => {
        await expect(page).toMatch('User Registration Portal');
        await expect(page).toMatchElement('form#signupForm');
      });
  
    it('should validate first name field', async () => {
      // Test invalid input (numbers)
      await page.type('#firstName', 'John123');
      await page.click('#lastName'); // Trigger validation
      await expect(page).toMatch('Please enter a valid first name');
      
      // Test valid input
      await page.$eval('#firstName', el => el.value = '');
      await page.type('#firstName', 'John');
      await page.click('#lastName');
      const firstNameValid = await page.$eval('#firstName', el => el.checkValidity());
      expect(firstNameValid).toBeTruthy();
    });
  
    it('should validate last name field', async () => {
      // Test invalid input (numbers)
      await page.type('#lastName', 'Doe123');
      await page.click('#email'); // Trigger validation
      await expect(page).toMatch('Please enter a valid last name');
      
      // Test valid input
      await page.$eval('#lastName', el => el.value = '');
      await page.type('#lastName', 'Doe');
      await page.click('#email');
      const lastNameValid = await page.$eval('#lastName', el => el.checkValidity());
      expect(lastNameValid).toBeTruthy();
    });
  
    it('should validate email field', async () => {
      // Test invalid input
      await page.type('#email', 'invalid-email');
      await page.click('#dob');
      await expect(page).toMatch('Please enter a valid email address');
      
      // Test valid input
      await page.$eval('#email', el => el.value = '');
      await page.type('#email', 'test@example.com');
      await page.click('#dob');
      const emailValid = await page.$eval('#email', el => el.checkValidity());
      expect(emailValid).toBeTruthy();
    });
  
    it('should validate date of birth with boundary testing', async () => {
      const today = new Date();
      
      // Test future date (invalid)
      const futureDate = new Date(today);
      futureDate.setFullYear(today.getFullYear() + 1);
      await page.$eval('#dob', (el, date) => el.value = date, futureDate.toISOString().split('T')[0]);
      await page.click('#password');
      await expect(page).toMatch('Date cannot be in the future');
      
      // Test age 12 (BVA lower boundary - invalid)
      const age12Date = new Date(today);
      age12Date.setFullYear(today.getFullYear() - 12);
      await page.$eval('#dob', (el, date) => el.value = date, age12Date.toISOString().split('T')[0]);
      await page.click('#password');
      await expect(page).toMatch('Minimum age is 13 (BVA: Lower Boundary (12))');
      
      // Test age 13 (BVA lower boundary - valid)
      const age13Date = new Date(today);
      age13Date.setFullYear(today.getFullYear() - 13);
      await page.$eval('#dob', (el, date) => el.value = date, age13Date.toISOString().split('T')[0]);
      await page.click('#password');
      const dobValid = await page.$eval('#dob', el => el.checkValidity());
      expect(dobValid).toBeTruthy();
    });
  
    it('should validate password strength', async () => {
      // Test too short password (BVA - 7 characters)
      await page.type('#password', 'Pass1!');
      await page.click('#confirmPassword');
      await expect(page).toMatch('Minimum 8 characters required');
      
      // Test valid password
      await page.$eval('#password', el => el.value = '');
      await page.type('#password', 'StrongPass1!');
      await page.click('#confirmPassword');
      const passwordValid = await page.$eval('#password', el => el.checkValidity());
      expect(passwordValid).toBeTruthy();
    });
  
    it('should validate password match', async () => {
      await page.type('#confirmPassword', 'DifferentPass1!');
      await page.click('#terms');
      await expect(page).toMatch('Passwords do not match');
      
      // Test matching passwords
      await page.$eval('#confirmPassword', el => el.value = '');
      await page.type('#confirmPassword', 'StrongPass1!');
      await page.click('#terms');
      const confirmValid = await page.$eval('#confirmPassword', el => el.checkValidity());
      expect(confirmValid).toBeTruthy();
    });
  
    it('should validate terms checkbox', async () => {
      // Submit without checking terms
      await page.$eval('#terms', el => el.checked = false);
      await page.click('button[type="submit"]');
      await expect(page).toMatch('You must accept the terms and conditions');
      
      // Test with terms checked
      await page.$eval('#terms', el => el.checked = true);
      const termsValid = await page.$eval('#terms', el => el.checkValidity());
      expect(termsValid).toBeTruthy();
    });
  
    it('should show validation report on successful submission', async () => {
      // Fill all fields correctly
      await page.$eval('#firstName', el => el.value = 'John');
      await page.$eval('#lastName', el => el.value = 'Doe');
      await page.$eval('#email', el => el.value = 'test@example.com');
      
      const today = new Date();
      const validDate = new Date(today);
      validDate.setFullYear(today.getFullYear() - 25);
      await page.$eval('#dob', (el, date) => el.value = date, validDate.toISOString().split('T')[0]);
      
      await page.$eval('#password', el => el.value = 'StrongPass1!');
      await page.$eval('#confirmPassword', el => el.value = 'StrongPass1!');
      await page.$eval('#terms', el => el.checked = true);
      
      await page.click('button[type="submit"]');
      
      // Check validation report appears
      await page.waitForSelector('#validationResultsCard', { visible: true });
      await expect(page).toMatch('Validation Report');
      await expect(page).toMatch('All Validation Tests Passed');
    });
  });