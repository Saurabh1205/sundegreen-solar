const { test, expect } = require('@playwright/test');

const testCases = [
  {
    name: 'Rajesh Sharma',
    phone: '9876543210',
    email: 'rajesh.sharma@gmail.com',
    message: 'Interested in 3 kW solar system setup for home.'
  },
  {
    name: 'Priya Patel',
    phone: '9812345678',
    email: 'priya.patel@yahoo.com',
    message: 'Requesting consultation on net metering.'
  }
];

test.describe('Enquiry Form UI Automation', () => {
  for (const tc of testCases) {
    test(`Submit enquiry for ${tc.name}`, async ({ page }) => {
      await page.goto('http://localhost:3000/contact');
      await page.fill('input[placeholder="John Doe"]', tc.name);
      await page.fill('input[placeholder="john@example.com"]', tc.email);
      await page.fill('input[placeholder="10-digit mobile number"]', tc.phone);
      await page.fill('textarea[placeholder="Tell us about your solar requirements..."]', tc.message);

      await page.click('button[type="submit"]');

      const successMsg = page.locator('text=✓ Message sent successfully!');
      await expect(successMsg).toBeVisible({ timeout: 10000 });
    });
  }
});
