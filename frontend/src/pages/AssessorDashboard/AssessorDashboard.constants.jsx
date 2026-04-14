export const ASSESSMENT_STATUS = {
  PENDING: 'Pending',
  SUBMITTED: 'Submitted',
  IN_PROGRESS: 'In Progress',
  ASSESSED: 'Assessed',
};

export const SECTORS = [
  'Pharmaceutical',
  'Textile',
  'Chemicals',
  'Wire & Cable',
  'Engineering Goods',
  'Plastic & Packaging'
];

export const MOCK_CLIENTS = [
  { id: 'C001', name: 'Global Pharma Solutions', sector: 'Pharmaceutical', status: 'Submitted', lastScore: 82 },
  { id: 'C002', name: 'Alpha Textiles Ltd', sector: 'Textile', status: 'Pending', lastScore: 0 },
  { id: 'C003', name: 'Indo Chemical Corp', sector: 'Chemicals', status: 'Submitted', lastScore: 65 },
  { id: 'C004', name: 'Precision Engineering', sector: 'Engineering Goods', status: 'In Progress', lastScore: 0 },
  { id: 'C005', name: 'Sun Plastic Industries', sector: 'Plastic & Packaging', status: 'Submitted', lastScore: 74 },
];

export const MOCK_ASSESSMENTS = [
  { 
    id: 'ASMT-2026-001', 
    clientName: 'Global Pharma Solutions', 
    sector: 'Pharmaceutical', 
    score: 82, 
    status: 'Submitted',
    date: '2026-03-10'
  },
  { 
    id: 'ASMT-2026-002', 
    clientName: 'Indo Chemical Corp', 
    sector: 'Chemicals', 
    score: 65, 
    status: 'Submitted',
    date: '2026-03-12'
  },
  { 
    id: 'ASMT-2026-003', 
    clientName: 'Sun Plastic Industries', 
    sector: 'Plastic & Packaging', 
    score: 74, 
    status: 'Submitted',
    date: '2026-03-15'
  },
  { 
    id: 'ASMT-2026-004', 
    clientName: 'Alpha Textiles Ltd', 
    sector: 'Textile', 
    score: 0, 
    status: 'In Progress',
    date: '2026-03-20'
  },
];
