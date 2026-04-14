export const ASSESSMENT_STATUS = {
  DRAFT: 'Draft',
  SUBMITTED: 'Submitted',
};

// Mock responses for the report to function when clicking from dashboard
const MOCK_RESPONSES = {
  "1": { selectedOption: { text: "Pharmaceutical", score: 5 } },
  "2": { selectedOption: { text: "< 500 Cr", score: 2 } },
  "101": { selectedOption: { text: "ERP-based GRN raised automatically on receipt", score: 4 } },
  "102": { selectedOption: { text: "System-based PO matching with quantity and grade check", score: 4 } },
  "201": { selectedOption: { text: "Excel-based bin register maintained manually", score: 3 }, highlight: "Bin registers are updated daily" },
  "202": { selectedOption: { text: "WMS enforces FIFO", score: 4 }, recommendation: "Implement more barcode automation" },
  "13": { selectedOption: { text: "Digital shop-floor system", score: 4 }, lowlight: "Wastage is still high in dyeing" }
};

export const MOCK_ASSESSMENTS = [
  {
    id: 'ASMT-2026-001',
    date: '2026-03-15',
    score: 85,
    status: ASSESSMENT_STATUS.SUBMITTED,
    responses: MOCK_RESPONSES
  },
  {
    id: 'ASMT-2026-002',
    date: '2026-03-20',
    score: 0,
    status: ASSESSMENT_STATUS.DRAFT,
  },
  {
    id: 'ASMT-2026-003',
    date: '2026-03-25',
    score: 92,
    status: ASSESSMENT_STATUS.SUBMITTED,
    responses: MOCK_RESPONSES
  },
  {
    id: 'ASMT-2026-004',
    date: '2026-04-02',
    score: 45,
    status: ASSESSMENT_STATUS.DRAFT,
  },
];
