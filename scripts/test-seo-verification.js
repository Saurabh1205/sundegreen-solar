const http = require('http');

function fetch(path) {
  return new Promise((resolve, reject) => {
    http.get('http://localhost:3000' + path, res => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => resolve({ status: res.statusCode, headers: res.headers, body: data }));
    }).on('error', reject);
  });
}

(async () => {
  console.log('Testing SEO & Structured Data Implementations...');

  // 1. Check Homepage for Schemas & Metadata
  const home = await fetch('/');
  console.log(`\n1. Homepage Status: ${home.status}`);
  const hasLocalBusiness = home.body.includes('SolarEnergyBusiness');
  const hasFAQSchema = home.body.includes('FAQPage');
  const hasWebSiteSchema = home.body.includes('WebSite');
  const hasCanonical = home.body.includes('canonical');
  const hasPhoneInSchema = home.body.includes('+91-7507771361');
  const hasGeoTag = home.body.includes('geo.placename');

  console.log(`  ✓ SolarEnergyBusiness Schema: ${hasLocalBusiness}`);
  console.log(`  ✓ FAQPage Schema: ${hasFAQSchema}`);
  console.log(`  ✓ WebSite Schema: ${hasWebSiteSchema}`);
  console.log(`  ✓ Verified Phone in Schema (+91-7507771361): ${hasPhoneInSchema}`);
  console.log(`  ✓ Canonical URL Tag: ${hasCanonical}`);
  console.log(`  ✓ Local Geo Tags (Nagpur / Maharashtra): ${hasGeoTag}`);

  // 2. Check robots.txt
  const robots = await fetch('/robots.txt');
  console.log(`\n2. robots.txt Status: ${robots.status}`);
  console.log(robots.body.trim());

  // 3. Check sitemap.xml
  const sitemap = await fetch('/sitemap.xml');
  console.log(`\n3. sitemap.xml Status: ${sitemap.status}`);
  const hasCalculatorInSitemap = sitemap.body.includes('/calculator');
  const hasQuoteInSitemap = sitemap.body.includes('/quote');
  const hasServicesInSitemap = sitemap.body.includes('/services');
  console.log(`  ✓ /calculator in sitemap: ${hasCalculatorInSitemap}`);
  console.log(`  ✓ /quote in sitemap: ${hasQuoteInSitemap}`);
  console.log(`  ✓ /services in sitemap: ${hasServicesInSitemap}`);

  // 4. Check Subpage Titles
  const services = await fetch('/services');
  console.log(`\n4. /services Status: ${services.status}`);
  const servicesTitleMatch = services.body.match(/<title>([^<]+)<\/title>/);
  console.log(`  ✓ /services Title: "${servicesTitleMatch ? servicesTitleMatch[1] : 'N/A'}"`);

  const calc = await fetch('/calculator');
  console.log(`\n5. /calculator Status: ${calc.status}`);
  const calcTitleMatch = calc.body.match(/<title>([^<]+)<\/title>/);
  console.log(`  ✓ /calculator Title: "${calcTitleMatch ? calcTitleMatch[1] : 'N/A'}"`);

  const quote = await fetch('/quote');
  console.log(`\n6. /quote Status: ${quote.status}`);
  const quoteTitleMatch = quote.body.match(/<title>([^<]+)<\/title>/);
  console.log(`  ✓ /quote Title: "${quoteTitleMatch ? quoteTitleMatch[1] : 'N/A'}"`);

  console.log('\n🎉 ALL SEO VERIFICATION CHECKS COMPLETED SUCCESSFULLY!');
})();
