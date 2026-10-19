const https = require('https');

const records = [
  {
    name: 'Rahul Deshmukh',
    whatsapp: '9822012345',
    email: 'rahul.deshmukh@gmail.com',
    pincode: '440001',
    bill: '₹3500 - ₹5000',
    serviceType: 'Residential Solar',
    message: 'Interested in 3kW PM Surya Ghar rooftop installation',
    suggestedKw: 3,
    brand: 'Waaree Mono Perc',
    quotePrice: 135000,
    source: 'Prod Test 1'
  },
  {
    name: 'Anita Kulkarni',
    whatsapp: '9423112233',
    email: 'anita.kulkarni@yahoo.com',
    pincode: '411001',
    bill: '₹8000 - ₹12000',
    serviceType: 'Commercial Solar',
    message: 'Need 10kW solar system for hospital clinic',
    suggestedKw: 10,
    brand: 'Tata Power Solar',
    quotePrice: 480000,
    source: 'Prod Test 2'
  },
  {
    name: 'Vikram Patel',
    whatsapp: '9890123456',
    email: 'vikram.patel@industry.com',
    pincode: '422001',
    bill: '₹45000 - ₹60000',
    serviceType: 'Industrial Solar',
    message: 'Factory warehouse rooftop 50kW solar project',
    suggestedKw: 50,
    brand: 'Tata Power Solar',
    quotePrice: 2200000,
    source: 'Prod Test 3'
  },
  {
    name: 'Sandeep Joshi',
    whatsapp: '7028123456',
    email: 'sandeep.joshi@gmail.com',
    pincode: '444601',
    bill: '₹2000 - ₹3000',
    serviceType: 'Residential Solar',
    message: 'Want to apply for PM Surya Ghar subsidy',
    suggestedKw: 2,
    brand: 'Adani Solar',
    quotePrice: 95000,
    source: 'Prod Test 4'
  },
  {
    name: 'Ganesh Shinde',
    whatsapp: '8888123456',
    email: 'ganesh.shinde@agri.in',
    pincode: '442001',
    bill: '₹1500 - ₹2500',
    serviceType: 'Solar Water Pump',
    message: '5HP solar agricultural pump installation',
    suggestedKw: 5,
    brand: 'Waaree Mono Perc',
    quotePrice: 210000,
    source: 'Prod Test 5'
  }
];

async function runTest() {
  console.log('--- TESTING 5 RANDOM CONSULTATION RECORDS ON PRODUCTION ---');
  console.log('Target: https://www.sundegreensolar.in/api/consultation\n');

  const results = [];

  for (let i = 0; i < records.length; i++) {
    const rec = records[i];
    const payload = JSON.stringify(rec);
    const start = Date.now();

    const res = await new Promise(resolve => {
      const req = https.request('https://sundegreensolar.in/api/consultation', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Content-Length': Buffer.byteLength(payload)
        }
      }, response => {
        let body = '';
        response.on('data', chunk => body += chunk);
        response.on('end', () => {
          const duration = Date.now() - start;
          resolve({
            index: i + 1,
            name: rec.name,
            service: rec.serviceType,
            status: response.statusCode,
            durationMs: duration,
            body
          });
        });
      });

      req.on('error', err => {
        resolve({
          index: i + 1,
          name: rec.name,
          service: rec.serviceType,
          status: 'ERROR',
          error: err.message
        });
      });

      req.write(payload);
      req.end();
    });

    results.push(res);
    console.log(`[Record ${res.index}] ${res.name} (${res.service}) -> Status: ${res.status} (${res.durationMs}ms)`);
    console.log(`  Body: ${res.body || res.error}\n`);
  }

  // Also test GET on production to see if saved records can be read
  console.log('--- TESTING GET /api/consultation ON PRODUCTION ---');
  await new Promise(resolve => {
    https.get('https://sundegreensolar.in/api/consultation', response => {
      let body = '';
      response.on('data', chunk => body += chunk);
      response.on('end', () => {
        console.log(`GET Status: ${response.statusCode}`);
        try {
          const parsed = JSON.parse(body);
          console.log(`Total consultations in production database: ${Array.isArray(parsed) ? parsed.length : 'Not an array'}`);
          if (Array.isArray(parsed)) {
            console.log('Latest 3 records in production:');
            parsed.slice(0, 3).forEach(p => console.log(`  - [ID: ${p.id}] ${p.name} | Phone: ${p.whatsapp} | Created: ${p.createdAt}`));
          }
        } catch (e) {
          console.log('GET Body preview:', body.substring(0, 200));
        }
        resolve();
      });
    }).on('error', err => {
      console.log('GET Error:', err.message);
      resolve();
    });
  });
}

runTest();
