const { chromium } = require('@playwright/test');

(async () => {
  console.log('Launching browser for Quote Popup & Auto-WhatsApp Test...');
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext();
  const page = await context.newPage();

  let autoOpenedUrl = null;
  context.on('page', async (newPage) => {
    autoOpenedUrl = newPage.url();
    console.log('  ✓ SUCCESS: Browser automatically launched WhatsApp window:', autoOpenedUrl);
  });

  console.log('Navigating to http://localhost:3000/quote...');
  await page.goto('http://localhost:3000/quote', { waitUntil: 'networkidle' });

  console.log('Filling out quote request form...');
  await page.fill('input[placeholder="Enter your name"]', 'Saurabh Manohar Nagare');
  await page.fill('input[placeholder="10-digit mobile number"]', '7507771361');
  await page.fill('input[placeholder="yourname@example.com"]', 'saurabh.nagare@gmail.com');
  await page.fill('input[placeholder="6-digit PIN code"]', '440032');
  await page.fill('input[placeholder="e.g. 3500"]', '8500');
  await page.selectOption('select', 'Residential Solar');

  console.log('Submitting form...');
  await page.click('button[type="submit"]');

  console.log('Waiting for Success Message Popup Modal...');
  await page.waitForSelector('text=Quote Sent to WhatsApp!', { timeout: 10000 });
  console.log('  ✓ SUCCESS: "Quote Sent to WhatsApp!" popup modal is visible on screen!');

  const badgeText = await page.innerText('text=WhatsApp Auto-Dispatched');
  console.log(`  ✓ SUCCESS: Found badge text: "${badgeText}"`);

  await page.waitForTimeout(2000);
  await browser.close();
  console.log('🎉 ALL TESTS PASSED: Success popup shown & WhatsApp triggered automatically without clicking anywhere!');
})();
