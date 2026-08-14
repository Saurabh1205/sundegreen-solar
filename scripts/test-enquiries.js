const BASE_URL = 'http://localhost:3000';

// 10 Random Real Indian Contacts with Valid 10-digit Mobile Numbers
const testLeads = [
  {
    name: 'Rajesh Sharma',
    whatsapp: '9876543210',
    email: 'rajesh.sharma@gmail.com',
    pincode: '400001',
    bill: '₹4,500',
    serviceType: 'Residential Solar',
    message: 'Interested in installing a 3 kW solar rooftop system for my apartment in Mumbai.',
    source: 'Hero Form',
    expectedPriority: 'High Priority'
  },
  {
    name: 'Priya Patel',
    whatsapp: '9812345678',
    email: 'priya.patel@yahoo.com',
    pincode: '380001',
    bill: '₹2,500',
    serviceType: 'Residential Solar',
    message: 'Looking for net metering options and government subsidy details.',
    source: 'Contact Page',
    expectedPriority: 'Low Priority'
  },
  {
    name: 'Amit Singh',
    whatsapp: '8765432109',
    email: 'amit.singh@outlook.com',
    pincode: '110001',
    bill: '₹8,500',
    serviceType: 'Residential Solar',
    suggestedKw: 8,
    brand: 'Tata Power Solar',
    quotePrice: 442000,
    source: 'Instant Quote',
    expectedPriority: 'Very High Priority'
  },
  {
    name: 'Sneha Reddy',
    whatsapp: '9988776655',
    email: 'sneha.reddy@gmail.com',
    pincode: '500001',
    bill: '₹6,000',
    serviceType: 'Commercial Solar',
    message: 'Need a commercial rooftop solar setup estimate for our office building.',
    source: 'Hero Form',
    expectedPriority: 'High Priority'
  },
  {
    name: 'Vikram Verma',
    whatsapp: '7890123456',
    email: 'vikram.verma@hotmail.com',
    pincode: '302001',
    bill: '₹12,000',
    serviceType: 'Industrial Solar',
    message: 'We require a 20 kW solar solution for our factory unit in Jaipur.',
    source: 'Contact Page',
    expectedPriority: 'Very High Priority'
  },
  {
    name: 'Ananya Joshi',
    whatsapp: '9123456789',
    email: 'ananya.joshi@gmail.com',
    pincode: '411001',
    bill: '₹3,200',
    serviceType: 'Residential Solar',
    suggestedKw: 3,
    brand: 'Waaree Mono Perc',
    quotePrice: 132000,
    source: 'Instant Quote',
    expectedPriority: 'High Priority'
  },
  {
    name: 'Suresh Gupta',
    whatsapp: '8899001122',
    email: 'suresh.gupta@corp.in',
    pincode: '700001',
    bill: '₹15,000',
    serviceType: 'Commercial Solar',
    message: 'Please send an inspector to evaluate our commercial site next week.',
    source: 'Contact Page',
    expectedPriority: 'Very High Priority'
  },
  {
    name: 'Kavita Nair',
    whatsapp: '9543210987',
    email: 'kavita.nair@gmail.com',
    pincode: '682001',
    bill: '₹1,800',
    serviceType: 'Residential Solar',
    message: 'Inquiring about 1.5 kW rooftop solar panel price with PM Surya Ghar subsidy.',
    source: 'Hero Form',
    expectedPriority: 'Low Priority'
  },
  {
    name: 'Rohan Mehta',
    whatsapp: '9765432108',
    email: 'rohan.mehta@gmail.com',
    pincode: '395007',
    bill: '₹5,400',
    serviceType: 'Residential Solar',
    suggestedKw: 5,
    brand: 'Adani Solar',
    quotePrice: 272000,
    source: 'Instant Quote',
    expectedPriority: 'High Priority'
  },
  {
    name: 'Deepak Agarwal',
    whatsapp: '8654321097',
    email: 'deepak.a@gmail.com',
    pincode: '201301',
    bill: '₹9,200',
    serviceType: 'Residential Solar',
    message: 'Want to schedule an site inspection and get final quotation.',
    source: 'Contact Page',
    expectedPriority: 'Very High Priority'
  }
];

async function postConsultation(lead) {
  const url = `${BASE_URL}/api/consultation`;
  const body = JSON.stringify(lead);
  
  const res = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body
  });

  if (!res.ok) {
    throw new Error(`HTTP Error ${res.status}: ${await res.text()}`);
  }

  return await res.json();
}

async function getConsultations() {
  const url = `${BASE_URL}/api/consultation`;
  const res = await fetch(url);
  if (!res.ok) {
    throw new Error(`HTTP Error ${res.status}`);
  }
  return await res.json();
}

async function runTests() {
  console.log('====================================================');
  console.log('   ENQUIRY AUTOMATION TESTING - 10 TEST CASES       ');
  console.log('====================================================\n');

  let passed = 0;
  let failed = 0;
  const createdIds = [];

  for (let i = 0; i < testLeads.length; i++) {
    const lead = testLeads[i];
    console.log(`[TEST ${i + 1}/10] Submitting: ${lead.name} (${lead.whatsapp}) | Bill: ${lead.bill} | Source: ${lead.source}`);

    try {
      const response = await postConsultation(lead);
      if (response && response.ok && response.id) {
        createdIds.push(response.id);
        console.log(`  ✓ SUCCESS: Received ID=${response.id} (Storage Source: ${response.source})`);
        passed++;
      } else {
        console.log(`  ✗ FAILED: Response invalid`, response);
        failed++;
      }
    } catch (err) {
      console.log(`  ✗ ERROR: ${err.message}`);
      failed++;
    }
  }

  console.log('\n----------------------------------------------------');
  console.log(' VERIFYING LEAD PERSISTENCE AND PRIORITY CALCULATIONS');
  console.log('----------------------------------------------------');

  try {
    const allLeads = await getConsultations();
    console.log(`Total leads retrieved from system: ${allLeads.length}`);

    let verificationPassed = 0;
    for (let i = 0; i < testLeads.length; i++) {
      const expected = testLeads[i];
      const found = allLeads.find(l => l.whatsapp === expected.whatsapp && l.name === expected.name);

      if (found) {
        const priorityMatch = found.leadPriority === expected.expectedPriority;
        console.log(`- Lead ${i + 1} (${found.name}): Found! Priority: "${found.leadPriority}" (Expected: "${expected.expectedPriority}") -> ${priorityMatch ? '✓ MATCH' : '✗ MISMATCH'}`);
        if (priorityMatch) verificationPassed++;
      } else {
        console.log(`- Lead ${i + 1} (${expected.name}): ✗ NOT FOUND in stored list`);
      }
    }

    console.log('\n====================================================');
    console.log(` SUMMARY RESULT:`);
    console.log(` - Submissions Passed: ${passed}/${testLeads.length}`);
    console.log(` - Submissions Failed: ${failed}/${testLeads.length}`);
    console.log(` - Priority Verification: ${verificationPassed}/${testLeads.length}`);
    console.log('====================================================\n');

    if (failed === 0 && verificationPassed === testLeads.length) {
      console.log('🎉 ALL 10 ENQUIRY AUTOMATION TESTS PASSED SUCCESSFULLY!');
      process.exit(0);
    } else {
      console.error('❌ SOME TESTS FAILED. CHECK LOGS ABOVE.');
      process.exit(1);
    }

  } catch (err) {
    console.error(`Failed to verify stored leads: ${err.message}`);
    process.exit(1);
  }
}

runTests();
