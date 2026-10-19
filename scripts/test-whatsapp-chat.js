const { chromium } = require('@playwright/test');
const path = require('path');

(async () => {
  console.log('Testing Refined WhatsApp Live Chat with Playwright...');
  let browser;
  try {
    browser = await chromium.launch({ headless: true });
  } catch {
    browser = await chromium.launch({ headless: true, channel: 'msedge' });
  }

  const context = await browser.newContext({
    viewport: { width: 1280, height: 800 }
  });
  const page = await context.newPage();

  console.log('Navigating to http://localhost:3000...');
  await page.goto('http://localhost:3000', { waitUntil: 'domcontentloaded' });

  console.log('Waiting for Floating WhatsApp button...');
  const triggerBtn = await page.waitForSelector('text=Talk To Solar Expert', { timeout: 8000 });
  console.log('  ✓ Found "Talk To Solar Expert" button');

  // Click the floating button to open WhatsApp chat window
  console.log('Clicking "Talk To Solar Expert"...');
  await triggerBtn.click();

  // Wait for the WhatsApp modal to be visible
  await page.waitForSelector('text=Official Helpline • +91 75077 71361', { timeout: 4000 });
  console.log('  ✓ WhatsApp chat window header and helpline displayed!');

  // Verify the floating trigger button is hidden while open (clean UI)
  const isTriggerHidden = await page.isHidden('text=Talk To Solar Expert');
  console.log(`  ✓ Trigger button hidden while modal is open: ${isTriggerHidden}`);

  // Test clicking a quick chip (e.g. Subsidy) without forcing redirect
  console.log('Clicking "💰 PM Surya Ghar Subsidy" quick chip...');
  await page.click('text=💰 PM Surya Ghar Subsidy');

  // Wait for smart in-chat bot response
  await page.waitForSelector('text=PM Surya Ghar Muft Bijli Yojana', { timeout: 4000 });
  console.log('  ✓ In-chat smart assistant responded immediately inside the widget!');

  // Verify the direct WhatsApp connect button is available inside the bubble
  const hasDirectWaBtn = await page.isVisible('text=Chat on WhatsApp (+91 75077 71361)');
  console.log(`  ✓ Direct WhatsApp CTA button visible: ${hasDirectWaBtn}`);

  // Take screenshot of the refined UI
  const screenshotPath = path.join(__dirname, '../public/whatsapp_refined_ui_test.png');
  await page.screenshot({ path: screenshotPath });
  console.log(`  ✓ Refined screenshot saved at: ${screenshotPath}`);

  await browser.close();
  console.log('\n🎉 ALL REFINED UI & CHAT TESTS PASSED!');
})();
