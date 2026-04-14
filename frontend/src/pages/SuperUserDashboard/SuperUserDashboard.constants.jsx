export const MOCK_USERS = [
  { id: 1, name: 'Alice Smith', email: 'alice@client.com', role: 'client' },
  { id: 2, name: 'Bob Jones', email: 'bob@client.com', role: 'client' },
  { id: 3, name: 'Charlie Assessor', email: 'charlie@assess.com', role: 'assessor' },
  { id: 4, name: 'David Admin', email: 'david@admin.com', role: 'admin' }
];

export const MOCK_SECTORS = [
  { id: 1, name: 'Textile', code: 'textile', count: 12 },
  { id: 2, name: 'Pharmaceutical', code: 'pharmaceutical', count: 8 },
  { id: 3, name: 'Chemicals', code: 'chemicals', count: 5 }
];

export const MOCK_QUESTIONS = [
  { id: 101, text: 'Are operations digitally tracked?', type: 'basic', score: 5 },
  { id: 201, text: 'Do you use ERP for ordering?', type: 'functional', area: 'Logistics' },
  { id: 301, text: 'Is cleanroom temp monitored automatically?', type: 'sector', sector: 'pharmaceutical' }
];

export const MOCK_ASSIGNMENTS = [
  { id: 1, client: 'Alice Smith', assessor: 'Charlie Assessor', status: 'In Progress' }
];
