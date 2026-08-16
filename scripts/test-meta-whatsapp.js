const fetch = require('node-fetch');

// Test Meta WhatsApp Cloud API Direct Message Delivery
async function testMetaCloudApi() {
  const token = process.env.WHATSAPP_CLOUD_API_TOKEN;
  const phoneId = process.env.WHATSAPP_PHONE_NUMBER_ID;
  const recipient = process.env.COMPANY_WHATSAPP_NUMBER || '917507771361';

  console.log('=====================================================');
  console.log('  META WHATSAPP CLOUD API DIRECT CONNECTION TEST     ');
  console.log('=====================================================\n');

  if (!token || token === 'your_meta_permanent_access_token' || !phoneId || phoneId === 'your_whatsapp_phone_number_id') {
    console.error('❌ CONFIGURATION ERROR:');
    console.error('Please paste your real WHATSAPP_CLOUD_API_TOKEN and WHATSAPP_PHONE_NUMBER_ID into your .env.local file first.\n');
    process.exit(1);
  }

  console.log(`Connecting to Meta API using Phone Number ID: ${phoneId}`);
  console.log(`Sending direct background message to recipient: +${recipient}...\n`);

  const messageText = `☀️ Sundegreen Solar - Meta Cloud API Test ☀️\n\nYour Meta WhatsApp Cloud API background messaging connection is configured and working perfectly!`;

  try {
    const response = await fetch(`https://graph.facebook.com/v18.0/${phoneId}/messages`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        messaging_product: 'whatsapp',
        to: recipient,
        type: 'text',
        text: { body: messageText }
      })
    });

    const data = await response.json();

    if (response.ok && data.messages && data.messages.length > 0) {
      console.log('🎉 SUCCESS! Meta WhatsApp Cloud API delivered the message successfully!');
      console.log('Message ID:', data.messages[0].id);
      console.log('Response Payload:', JSON.stringify(data, null, 2));
    } else {
      console.error('❌ META API ERROR RESPONSE:');
      console.error(JSON.stringify(data, null, 2));
    }
  } catch (err) {
    console.error('❌ NETWORK ERROR:', err.message);
  }
}

testMetaCloudApi();
