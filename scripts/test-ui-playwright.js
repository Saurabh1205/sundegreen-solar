const { chromium } = require('@playwright/test');

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

(async () => {
  console.log('Launching browser for UI automation testing...');
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage();

  console.log('Navigating to http://localhost:3000/contact...');
  await page.goto('http://localhost:3000/contact', { waitUntil: 'networkidle' });

  for (let i = 0; i < testCases.length; i++) {
    const tc = testCases[i];
    console.log(`[UI TEST ${i + 1}/${testCases.length}] Filling Contact Form for ${tc.name}...`);

    await page.fill('input[placeholder="John Doe"]', tc.name);
    await page.fill('input[placeholder="john@example.com"]', tc.email);
    await page.fill('input[placeholder="10-digit mobile number"]', tc.phone);
    await page.fill('textarea[placeholder="Tell us about your solar requirements..."]', tc.message);

    console.log(`  Submitting form...`);
    await page.click('button[type="submit"]');

    // Wait for success message
    await page.waitForSelector('text=✓ Message sent successfully!', { timeout: 10000 });
    console.log(`  ✓ SUCCESS: Received UI confirmation message for ${tc.name}`);
  }

  await browser.close();
  console.log('🎉 UI Automation Test Completed Successfully!');
})();
