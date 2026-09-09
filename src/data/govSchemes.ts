export interface GovScheme {
  id: string;
  name: string;
  ministry: string;
  description: string;
  benefits: string[];
  eligibility: string;
  deadline: string;
  link: string;
  category: 'subsidy' | 'insurance' | 'credit' | 'training';
}

export const GOV_SCHEMES: GovScheme[] = [
  {
    id: 'sch_1',
    name: 'PM-KISAN',
    ministry: 'Ministry of Agriculture & Farmers Welfare',
    description: 'Direct income support of ₹6,000 per year to small and marginal farmer families through direct benefit transfer.',
    benefits: ['₹2,000 per installment (3 times/year)', 'Direct bank transfer', 'No paperwork needed for renewal'],
    eligibility: 'Small/marginal farmer families with cultivable land',
    deadline: 'Ongoing — register anytime',
    link: 'https://pmkisan.gov.in',
    category: 'subsidy',
  },
  {
    id: 'sch_2',
    name: 'Pradhan Mantri Fasal Bima Yojana',
    ministry: 'Ministry of Agriculture',
    description: 'Crop insurance scheme providing coverage against crop loss due to natural calamities, pests & diseases.',
    benefits: ['Low premium rates (1.5%-5% based on crop)', 'Full sum insured coverage', 'Quick claim settlement through technology'],
    eligibility: 'All farmers including sharecroppers and tenant farmers',
    deadline: 'Apply before sowing season',
    link: 'https://pmfby.gov.in',
    category: 'insurance',
  },
  {
    id: 'sch_3',
    name: 'Kisan Credit Card (KCC)',
    ministry: 'NABARD / RBI',
    description: 'Credit facility for farmers to meet agricultural needs — covers crop production, post-harvest expenses, and consumption needs.',
    benefits: ['Flexible credit limit', 'Interest subvention of 2%', 'Insurance coverage included'],
    eligibility: 'All farmers, fishers, and animal husbandry farmers',
    deadline: 'Apply through any bank branch',
    link: 'https://www.nabard.org',
    category: 'credit',
  },
  {
    id: 'sch_4',
    name: 'National Agriculture Market (e-NAM)',
    ministry: 'Ministry of Agriculture',
    description: 'Pan-India electronic trading portal linking existing APMCs to create a unified national market for agricultural commodities.',
    benefits: ['Transparent price discovery', 'Online payment settlement', 'Access to buyers across India'],
    eligibility: 'All farmers registered at APMC mandis',
    deadline: 'Ongoing',
    link: 'https://enam.gov.in',
    category: 'subsidy',
  },
  {
    id: 'sch_5',
    name: 'RKVY-RAFTAAR',
    ministry: 'Ministry of Agriculture',
    description: 'Rashtriya Krishi Vikas Yojana for agri-startups, incubation, and value chain development.',
    benefits: ['Up to ₹25 lakh seed funding for agri-startups', 'Infrastructure development support', 'Promotion of innovative agri-tech'],
    eligibility: 'Agri-entrepreneurs, FPOs, and agri-tech startups',
    deadline: 'Check state-level Nodal Agency',
    link: 'https://rashtriyakrishi.in',
    category: 'credit',
  },
  {
    id: 'sch_6',
    name: 'Skill India — PM Kaushal Vikas Yojana',
    ministry: 'Ministry of Skill Development',
    description: 'Free skill development training programs for rural youth including agriculture and food processing.',
    benefits: ['Free training (150-300 hours)', 'Government-certified skill certificate', 'Placement assistance'],
    eligibility: 'Age 15-45 years, rural youth and farmers',
    deadline: 'Rolling enrollment',
    link: 'https://www.pmkvyofficial.org',
    category: 'training',
  },
];

export const SCHEME_CATEGORIES = [
  { id: 'subsidy', label: 'Subsidies & Grants', icon: '💰' },
  { id: 'insurance', label: 'Insurance', icon: '🛡️' },
  { id: 'credit', label: 'Credit & Finance', icon: '🏦' },
  { id: 'training', label: 'Training & Skills', icon: '📚' },
] as const;
