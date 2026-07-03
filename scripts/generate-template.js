const XLSX = require('xlsx')
const path = require('path')

const wb = XLSX.utils.book_new()

// ── Tab 1: SiteConfig ────────────────────────────────────────────────────────
const siteConfigData = [
  ['key', 'value'],
  ['heroHeadline', 'Power Your Future With Clean Solar Energy'],
  ['heroSubline', 'Reduce electricity bills by up to 90% with high-efficiency solar systems for homes, businesses and industries.'],
  ['heroBadgeText', "India's Trusted Solar Partner"],
  ['logoUrl', ''],
  ['phone', '+91 98765 43210'],
  ['email', 'info@sundegreen.com'],
  ['address', 'Mumbai, India'],
  ['googleRating', '4.8'],
  ['footerTagline', 'Empowering India with clean, sustainable solar energy solutions for homes, businesses, and industries.'],
]
const wsSiteConfig = XLSX.utils.aoa_to_sheet(siteConfigData)
wsSiteConfig['!cols'] = [{ wch: 25 }, { wch: 80 }]
XLSX.utils.book_append_sheet(wb, wsSiteConfig, 'SiteConfig')

// ── Tab 2: Stats ─────────────────────────────────────────────────────────────
const statsData = [
  ['icon', 'value', 'suffix', 'label'],
  ['⚡', 500, '+', 'Installations'],
  ['🔋', 10, '+', 'MW Installed'],
  ['🛡️', 25, '', 'Years Warranty'],
  ['😊', 98, '%', 'Customer Satisfaction'],
]
const wsStats = XLSX.utils.aoa_to_sheet(statsData)
wsStats['!cols'] = [{ wch: 8 }, { wch: 10 }, { wch: 10 }, { wch: 30 }]
XLSX.utils.book_append_sheet(wb, wsStats, 'Stats')

// ── Tab 3: Services ───────────────────────────────────────────────────────────
const servicesData = [
  ['id', 'title', 'summary', 'category', 'icon'],
  ['res', 'Residential Solar', 'Rooftop solar solutions tailored for homes.', 'residential', '🏠'],
  ['com', 'Commercial Solar', 'High-efficiency systems for businesses.', 'commercial', '🏢'],
  ['ind', 'Industrial Solar', 'Large-scale solar installations and EPC.', 'industrial', '🏭'],
  ['pump', 'Solar Water Pumps', 'Robust pumps for agriculture and irrigation.', 'other', '💧'],
  ['battery', 'Battery Backup Systems', 'Reliable energy storage solutions.', 'other', '🔋'],
  ['maint', 'Annual Maintenance Contracts', 'Keep your system at peak performance.', 'other', '🔧'],
]
const wsServices = XLSX.utils.aoa_to_sheet(servicesData)
wsServices['!cols'] = [{ wch: 10 }, { wch: 30 }, { wch: 50 }, { wch: 15 }, { wch: 8 }]
XLSX.utils.book_append_sheet(wb, wsServices, 'Services')

// ── Tab 4: Projects ───────────────────────────────────────────────────────────
const projectsData = [
  ['id', 'title', 'location', 'capacityKW', 'savingsAnnual', 'category', 'image'],
  ['p1', 'Rooftop Residence, Pune', 'Pune, MH', 5, 45000, 'residential', '/projects/res1.svg'],
  ['p2', 'Factory Solar Installation, Gujarat', 'Vadodara, GJ', 150, 1800000, 'industrial', '/projects/res1.svg'],
  ['p3', 'School Rooftop, Bangalore', 'Bengaluru, KA', 20, 200000, 'commercial', '/projects/res1.svg'],
]
const wsProjects = XLSX.utils.aoa_to_sheet(projectsData)
wsProjects['!cols'] = [{ wch: 8 }, { wch: 40 }, { wch: 20 }, { wch: 12 }, { wch: 15 }, { wch: 15 }, { wch: 30 }]
XLSX.utils.book_append_sheet(wb, wsProjects, 'Projects')

// ── Tab 5: Testimonials ───────────────────────────────────────────────────────
const testimonialsData = [
  ['id', 'name', 'location', 'rating', 'review', 'image'],
  ['1', 'Rajesh Kumar', 'Mumbai, Maharashtra', 5, 'Sun Degreen Solar transformed my electricity bills. I am saving ₹4,500 every month! The installation was quick and the team was very professional.', '/customer_rajesh.png'],
  ['2', 'Priya Sharma', 'Bangalore, Karnataka', 5, "The best investment for my home. The engineers explained everything clearly, and now I feel proud using clean energy. Highly recommended!", '/customer_priya.png'],
  ['3', 'Amit Patel', 'Ahmedabad, Gujarat', 5, 'Running my factory on solar power is amazing. I reduced my operating costs by 70%. The team provided excellent after-sales support too.', '/customer_amit.png'],
]
const wsTestimonials = XLSX.utils.aoa_to_sheet(testimonialsData)
wsTestimonials['!cols'] = [{ wch: 5 }, { wch: 20 }, { wch: 25 }, { wch: 8 }, { wch: 80 }, { wch: 30 }]
XLSX.utils.book_append_sheet(wb, wsTestimonials, 'Testimonials')

// ── Tab 6: FAQs ───────────────────────────────────────────────────────────────
const faqsData = [
  ['id', 'order', 'question', 'answer'],
  ['1', 1, 'How much can I save with solar energy?', 'Most customers save 70-90% on their electricity bills. Your exact savings depend on your current consumption, location, and system size. We offer a free consultation to calculate your specific savings.'],
  ['2', 2, 'What is the installation time?', 'A typical residential installation takes 3-5 days. Commercial and industrial projects may take longer depending on system complexity. We provide a detailed timeline before starting work.'],
  ['3', 3, 'Do I need to maintain the solar panels?', 'Solar panels require minimal maintenance. We recommend cleaning them 2-3 times a year. We also offer comprehensive AMC services to keep your system running optimally.'],
  ['4', 4, 'What warranty do you provide?', 'We provide a 25-year warranty on panels and 10-year warranty on inverters. Our performance guarantee ensures your system operates at peak efficiency throughout the warranty period.'],
  ['5', 5, 'Are there government subsidies available?', 'Yes! The Government of India offers subsidies up to 40% on residential solar installations. Our team helps you navigate the subsidy process and maximizes your benefits.'],
  ['6', 6, 'Will solar panels work during monsoons?', 'Yes, solar panels generate electricity even on cloudy days. While output is reduced during heavy monsoons, modern panels are highly efficient and provide consistent energy throughout the year.'],
]
const wsFAQs = XLSX.utils.aoa_to_sheet(faqsData)
wsFAQs['!cols'] = [{ wch: 5 }, { wch: 8 }, { wch: 50 }, { wch: 100 }]
XLSX.utils.book_append_sheet(wb, wsFAQs, 'FAQs')

// ── Tab 7: BlogPosts ──────────────────────────────────────────────────────────
const blogData = [
  ['slug', 'title', 'excerpt', 'publishedAt', 'coverImageUrl'],
  ['solar-panel-cost-india', 'Solar Panel Cost in India', 'Understanding costs and ROI for residential systems.', '2024-01-15', ''],
  ['government-solar-subsidies', 'Government Solar Subsidies', 'How to access subsidies and incentives.', '2024-02-10', ''],
  ['net-metering-explained', 'Net Metering Explained', 'Net metering basics for homeowners.', '2024-03-05', ''],
]
const wsBlog = XLSX.utils.aoa_to_sheet(blogData)
wsBlog['!cols'] = [{ wch: 35 }, { wch: 40 }, { wch: 60 }, { wch: 15 }, { wch: 50 }]
XLSX.utils.book_append_sheet(wb, wsBlog, 'BlogPosts')

// ── Write file ────────────────────────────────────────────────────────────────
const outputPath = path.join(__dirname, '..', 'public', 'sundegreen-cms-template.xlsx')
XLSX.writeFile(wb, outputPath)
console.log('✅ Excel template generated at:', outputPath)
