export const PHARMA_QUESTIONS = [
  {
    id: 13,
    type: 'sector',
    sector: 'pharmaceutical',
    category: 'Quality & Compliance',
    text: 'How is batch manufacturing record (BMR) and batch packaging record (BPR) managed?',
    options: [
      { text: 'Fully paper-based BMR/BPR with no digital copies', score: 1 },
      { text: 'Paper records with scanned copies stored on computer', score: 2 },
      { text: 'Semi-electronic with some data in spreadsheets', score: 3 },
      { text: 'Electronic Batch Record (EBR) system in use', score: 4 },
      { text: 'Fully validated EBR integrated with LIMS and ERP', score: 5 },
      { text: 'N/A', isNA: true }
    ]
  },
  {
    id: 14,
    type: 'sector',
    sector: 'pharmaceutical',
    category: 'Quality & Compliance',
    text: 'How is regulatory compliance (Schedule M, GMP, FDA) documentation managed?',
    options: [
      { text: 'No structured compliance system', score: 1 },
      { text: 'Physical files maintained department-wise', score: 2 },
      { text: 'Digital document management with version control', score: 3 },
      { text: 'eQMS (Electronic Quality Management System) in use', score: 4 },
      { text: 'Automated compliance tracking with 21 CFR Part 11 / ALCOA principles', score: 5 },
      { text: 'N/A', isNA: true }
    ]
  },
  {
    id: 15,
    type: 'sector',
    sector: 'pharmaceutical',
    category: 'Laboratory',
    text: 'What level of digitization exists in your Quality Control (QC) laboratory?',
    options: [
      { text: 'All lab data on paper; no instruments are connected', score: 1 },
      { text: 'Instruments with print-outs; data manually transcribed', score: 2 },
      { text: 'LIMS (Lab Information Management System) used partially', score: 3 },
      { text: 'Fully deployed LIMS integrated with lab instruments', score: 4 },
      { text: 'LIMS integrated with ERP, real-time OOS alerts, and predictive analytics', score: 5 },
      { text: 'N/A', isNA: true }
    ]
  },
  {
    id: 16,
    type: 'sector',
    sector: 'pharmaceutical',
    category: 'Serialization & Traceability',
    text: 'How is drug traceability and serialization managed for regulatory compliance?',
    options: [
      { text: 'No serialization system in place', score: 1 },
      { text: 'Batch number tracking manually on paper', score: 2 },
      { text: 'Barcode-based tracking without systemic integration', score: 3 },
      { text: 'Digital serialization system meeting DSCSA/Indian track & trace norms', score: 4 },
      { text: 'End-to-end serialization integrated with supply chain and government portals', score: 5 },
      { text: 'N/A', isNA: true }
    ]
  },
  {
    id: 17,
    type: 'sector',
    sector: 'pharmaceutical',
    category: 'Cold Chain & Storage',
    text: 'How are temperature-sensitive storage conditions monitored?',
    options: [
      { text: 'No temperature monitoring; rely on visual checks', score: 1 },
      { text: 'Manual temperature logs maintained 2–3 times daily', score: 2 },
      { text: 'Digital thermometers with manual recording', score: 3 },
      { text: 'Automated temperature monitoring with SMS/email alerts', score: 4 },
      { text: 'IoT-based real-time cold chain monitoring with audit trail', score: 5 },
      { text: 'N/A', isNA: true }
    ]
  },
  {
    id: 18,
    type: 'sector',
    sector: 'pharmaceutical',
    category: 'Production',
    text: 'How is equipment qualification and calibration managed?',
    options: [
      { text: 'No formal calibration schedule', score: 1 },
      { text: 'Manual calibration log with physical tags', score: 2 },
      { text: 'Excel-based calibration tracker with reminders', score: 3 },
      { text: 'Digital calibration management system with due-date alerts', score: 4 },
      { text: 'Automated calibration tracking integrated with ERP and QMS', score: 5 },
      { text: 'N/A', isNA: true }
    ]
  },
  {
    id: 19,
    type: 'sector',
    sector: 'pharmaceutical',
    category: 'R&D',
    text: 'How is product formulation data and R&D documentation managed?',
    options: [
      { text: 'Handwritten notebooks only', score: 1 },
      { text: 'Scanned documents stored in folders', score: 2 },
      { text: 'ELN (Electronic Lab Notebook) or Excel for formulation data', score: 3 },
      { text: 'Structured R&D database with version control', score: 4 },
      { text: 'AI-assisted formulation platform with predictive modelling', score: 5 },
      { text: 'N/A', isNA: true }
    ]
  },
  {
    id: 20,
    type: 'sector',
    sector: 'pharmaceutical',
    category: 'Market Access',
    text: 'How are sales orders, pharmacovigilance feedback, and recalls managed?',
    options: [
      { text: 'Manual phone/email based; no database', score: 1 },
      { text: 'Excel register for adverse events and complaints', score: 2 },
      { text: 'Digital complaint management module', score: 3 },
      { text: 'Integrated complaint, recall, and pharmacovigilance system', score: 4 },
      { text: 'Automated reporting to CDSCO/FDA with real-time recall management', score: 5 },
      { text: 'N/A', isNA: true }
    ]
  },
];