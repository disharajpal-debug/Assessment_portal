export const MOCK_GLOBAL_ASSESSMENTS = [
  {
    id: 'A001',
    sector: 'textile',
    date: '2026-03-01',
    score: { obtained: 65, max: 100, percentage: 65 },
    responses: [
      { q: 'ERP Integration', score: 4 },
      { q: 'Real-time Analytics', score: 2 }
    ]
  },
  {
    id: 'A002',
    sector: 'pharmaceutical',
    date: '2026-03-05',
    score: { obtained: 85, max: 100, percentage: 85 },
    responses: [
      { q: 'Regulatory Compliance', score: 5 },
      { q: 'Quality Control', score: 4 }
    ]
  },
  {
    id: 'A003',
    sector: 'chemicals',
    date: '2026-03-10',
    score: { obtained: 45, max: 100, percentage: 45 },
    responses: [
      { q: 'Safety Management', score: 3 },
      { q: 'Predictive Maintenance', score: 2 }
    ]
  },
  {
    id: 'A004',
    sector: 'textile',
    date: '2026-03-12',
    score: { obtained: 55, max: 100, percentage: 55 },
    responses: [
      { q: 'Inventory Tracking', score: 3 },
      { q: 'Cloud Infrastructure', score: 1 }
    ]
  },
  {
    id: 'A005',
    sector: 'engineering_goods',
    date: '2026-03-15',
    score: { obtained: 72, max: 100, percentage: 72 },
    responses: [
      { q: 'Automated Assembly', score: 4 },
      { q: 'Supply Chain Sync', score: 3 }
    ]
  },
  {
    id: 'A006',
    sector: 'pharmaceutical',
    date: '2026-03-18',
    score: { obtained: 92, max: 100, percentage: 92 },
    responses: [
      { q: 'Traceability', score: 5 },
      { q: 'Cold Chain IoT', score: 5 }
    ]
  },
  {
    id: 'A007',
    sector: 'plastic_packaging',
    date: '2026-03-20',
    score: { obtained: 38, max: 100, percentage: 38 },
    responses: [
      { q: 'Energy Monitoring', score: 2 },
      { q: 'Waste Reduction', score: 1 }
    ]
  },
  {
    id: 'A008',
    sector: 'wire_cable',
    date: '2026-03-22',
    score: { obtained: 60, max: 100, percentage: 60 },
    responses: [
      { q: 'Extrusion Automation', score: 3 },
      { q: 'AI Defect Detection', score: 2 }
    ]
  }
];

export const SECTORS = [
  'textile',
  'pharmaceutical',
  'chemicals',
  'wire_cable',
  'engineering_goods',
  'plastic_packaging'
];
