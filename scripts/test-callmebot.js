const https = require('https');
const fs = require('fs');
const path = require('path');

// Load environment variables from .env.local if available
const envPath = path.join(__dirname, '..', '.env.local');
let envKey = '';
let envPhone = '917507771361';

if (fs.existsSync(envPath)) {
  const content = fs.readFileSync(envPath, 'utf8');
  content.split('\n').forEach(line => {
    const trimmed = line.trim();
    if (trimmed.startsWith('CALLMEBOT_API_KEY=')) {
      envKey = trimmed.replace('CALLMEBOT_API_KEY=', '').trim();
    }
    if (trimmed.startsWith('COMPANY_WHATSAPP_NUMBER=')) {
      envPhone = trimmed.replace('COMPANY_WHATSAPP_NUMBER=', '').trim();
    }
  });
}

const apiKey = process.argv[2] || process.env.CALLMEBOT_API_KEY || envKey;
const phone = process.argv[3] || process.env.CALLMEBOT_PHONE || envPhone;

console.log('=====================================================');
console.log('   CALLMEBOT FREE WHATSAPP ALERT TEST                ');
console.log('=====================================================\n');

if (!apiKey || apiKey.includes('your_') || apiKey.length < 3) {
  console.log('❌ CALLMEBOT_API_KEY IS NOT SET YET.\n');
  console.log('📌 HOW TO GET YOUR FREE API KEY IN 30 SECONDS:');
  console.log('1. On your mobile phone (' + phone + '), open WhatsApp.');
  console.log('2. Send this exact message:');
  console.log('   "I allow callmebot to send me messages"');
  console.log('   to this WhatsApp number: +34 910 60 74 20  (or +34 944 58 13 89)');
  console.log('3. CallMeBot will instantly reply with your API Key (e.g., 1234567).');
  console.log('4. Run this script again with your key:');
  console.log('   node scripts/test-callmebot.js <YOUR_API_KEY>\n');
  process.exit(1);
}

const cleanPhone = phone.replace(/\D/g, '');
const message = `☀️ Sundegreen Solar - WhatsApp Alert Test ☀️\n\n🎉 Hello! Your CallMeBot WhatsApp alert connection is working perfectly!\n\nYou will now receive instant alerts on this WhatsApp number (+${cleanPhone}) every time a customer books a solar consultation on your website.`;

const url = `https://api.callmebot.com/whatsapp.php?phone=+${cleanPhone}&text=${encodeURIComponent(message)}&apikey=${apiKey.trim()}`;

console.log(`Sending test alert to phone: +${cleanPhone}...`);
console.log(`Using API Key: ${apiKey}\n`);

https.get(url, (res) => {
  let data = '';
  res.on('data', chunk => data += chunk);
  res.on('end', () => {
    console.log(`Status Code: ${res.statusCode}`);
    console.log(`CallMeBot Response:\n${data}\n`);
    if (data.includes('Message queued') || data.includes('Message sent') || data.includes('Success') || res.statusCode === 200) {
      console.log('✅ SUCCESS! Please check your WhatsApp on +' + cleanPhone + '. The test message has been delivered!');
    } else {
      console.log('⚠️ Notice: Check the response above. If CallMeBot returned an error, verify your phone number and API key.');
    }
  });
}).on('error', (err) => {
  console.error('❌ Network error connecting to CallMeBot:', err.message);
});
