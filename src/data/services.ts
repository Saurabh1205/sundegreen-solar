import type { Service } from '../types'

export const services: Service[] = [
  { id: 'res', title: 'Residential Solar', summary: 'Rooftop solar solutions tailored for homes.', category: 'residential' },
  { id: 'com', title: 'Commercial Solar', summary: 'High-efficiency systems for businesses.', category: 'commercial' },
  { id: 'ind', title: 'Industrial Solar', summary: 'Large-scale solar installations and EPC.', category: 'industrial' },
  // { id: 'pump', title: 'Solar Water Pumps', summary: 'Robust pumps for agriculture and irrigation.', category: 'other' },
  // { id: 'battery', title: 'Battery Backup Systems', summary: 'Reliable energy storage solutions.', category: 'other' },
  { id: 'maint', title: 'Annual Maintenance Contracts', summary: 'Keep your system at peak performance.', category: 'other' }
]
