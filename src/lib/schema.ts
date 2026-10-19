export const localBusinessSchema = {
  '@context': 'https://schema.org',
  '@type': 'SolarEnergyBusiness',
  '@id': 'https://www.sundegreensolar.in/#organization',
  name: 'Sun Degreen Solar',
  alternateName: ['Sundegreen Solar', 'Sun Degreen Solar Nagpur'],
  description:
    'Premier rooftop solar panel installation company in Nagpur, Maharashtra. Specializing in residential solar with PM Surya Ghar subsidy (up to ₹78,000), commercial solar systems, solar water pumps, and EPC engineering.',
  url: 'https://www.sundegreensolar.in',
  telephone: '+91-7507771361',
  email: 'info@sundegreensolar.in',
  logo: 'https://www.sundegreensolar.in/sundegreen_logo.png',
  image: 'https://www.sundegreensolar.in/sundegreen_logo.png',
  priceRange: '₹₹₹',
  address: {
    '@type': 'PostalAddress',
    addressLocality: 'Nagpur',
    addressRegion: 'Maharashtra',
    postalCode: '440001',
    addressCountry: 'IN'
  },
  geo: {
    '@type': 'GeoCoordinates',
    latitude: 21.1458,
    longitude: 79.0882
  },
  openingHoursSpecification: [
    {
      '@type': 'OpeningHoursSpecification',
      dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
      opens: '09:00',
      closes: '19:00'
    }
  ],
  areaServed: [
    { '@type': 'City', name: 'Nagpur' },
    { '@type': 'State', name: 'Maharashtra' },
    { '@type': 'Country', name: 'India' }
  ],
  sameAs: [
    'https://wa.me/917507771361'
  ],
  aggregateRating: {
    '@type': 'AggregateRating',
    ratingValue: '4.9',
    reviewCount: '128',
    bestRating: '5',
    worstRating: '1'
  }
}

export const faqSchema = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: [
    {
      '@type': 'Question',
      name: 'How much can I save with solar energy in India?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Most residential and commercial customers save 70% to 90% on their electricity bills. A 3kW rooftop system typically saves ₹3,500 to ₹4,500 per month, recovering your investment within 3 to 4 years.'
      }
    },
    {
      '@type': 'Question',
      name: 'How much government subsidy do I get under PM Surya Ghar Muft Bijli Yojana?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Under PM Surya Ghar Muft Bijli Yojana, residential subsidies are credited directly to your bank account: ₹30,000 for a 1 kW system, ₹60,000 for a 2 kW system, and up to ₹78,000 for 3 kW and higher systems. Sun Degreen Solar assists you through the entire DISCOM application and subsidy process.'
      }
    },
    {
      '@type': 'Question',
      name: 'What warranty is provided on solar panels and inverters?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'We provide a 25-year performance warranty on Tier-1 monocrystalline solar panels and up to 10-year warranty on solar inverters. Our performance guarantee ensures peak efficiency throughout the warranty period.'
      }
    },
    {
      '@type': 'Question',
      name: 'Do solar panels work during monsoons and cloudy days?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Yes! Modern Tier-1 Mono PERC solar panels generate electricity even on diffuse, cloudy, or overcast days. While peak generation is slightly reduced, our systems produce reliable clean power year-round.'
      }
    },
    {
      '@type': 'Question',
      name: 'What is the rooftop solar installation timeline?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Standard residential rooftop solar installations take just 3 to 5 days after DISCOM approval. Commercial and industrial projects range from 1 to 3 weeks depending on capacity and complexity.'
      }
    }
  ]
}

export const websiteSchema = {
  '@context': 'https://schema.org',
  '@type': 'WebSite',
  '@id': 'https://www.sundegreensolar.in/#website',
  url: 'https://www.sundegreensolar.in',
  name: 'Sun Degreen Solar',
  description: 'Power Your Future With Clean Solar Energy. Top Rooftop Solar EPC in Maharashtra.',
  publisher: {
    '@id': 'https://www.sundegreensolar.in/#organization'
  }
}
