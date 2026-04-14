export const QUALITY_QUESTIONS = [
  {
    id: 401,
    type: 'functional',
    area: 'Quality',
    category: 'Raw Material Quality',
    text: 'How is incoming raw material quality testing performed and documented?',
    options: [
      { text: 'No incoming quality testing', score: 1 },
      { text: 'Visual check only; result in manual register', score: 2 },
      { text: 'Lab testing with paper test report filed', score: 3 },
      { text: 'Digital test report in QMS linked to GRN', score: 4 },
      { text: 'Automated test equipment with direct data transfer to QMS; auto-acceptance/rejection', score: 5 },
      { text: 'N/A', isNA: true }
    ]
  },
  {
    id: 402,
    type: 'functional',
    area: 'Quality',
    category: 'Specification Control',
    text: 'How is the approved vendor list (AVL) and material specification managed?',
    options: [
      { text: 'No AVL; any supplier accepted', score: 1 },
      { text: 'Informal list maintained by purchase manager', score: 2 },
      { text: 'Excel-based AVL with material specs', score: 3 },
      { text: 'QMS-based controlled AVL with revision history', score: 4 },
      { text: 'Integrated AVL in ERP with auto-validation at GRN and supplier performance linkage', score: 5 },
      { text: 'N/A', isNA: true }
    ]
  },
  {
    id: 403,
    type: 'functional',
    area: 'Quality',
    category: 'Finished Goods Inspection',
    text: 'How is finished goods quality inspection (final inspection) carried out?',
    options: [
      { text: 'No final inspection; dispatched as produced', score: 1 },
      { text: 'Visual inspection by packing team', score: 2 },
      { text: 'Sampling-based inspection with paper inspection report', score: 3 },
      { text: 'Digital final inspection report in QMS before dispatch clearance', score: 4 },
      { text: 'Automated inspection (vision system/CMM) with digital release and customer COA auto-generation', score: 5 },
      { text: 'N/A', isNA: true }
    ]
  },
  {
    id: 404,
    type: 'functional',
    area: 'Quality',
    category: 'Customer Complaints',
    text: 'How are customer quality complaints received, logged and resolved?',
    options: [
      { text: 'Verbal complaints acknowledged; no formal tracking', score: 1 },
      { text: 'Complaint noted in register; addressed informally', score: 2 },
      { text: 'Manual complaint register with resolution notes', score: 3 },
      { text: 'CRM/QMS-based complaint module with closure timeline tracking', score: 4 },
      { text: 'Digital customer portal with real-time complaint status, 8D report and repeat-prevention analytics', score: 5 },
      { text: 'N/A', isNA: true }
    ]
  },
  {
    id: 405,
    type: 'functional',
    area: 'Quality',
    category: 'CAPA Management',
    text: 'How is corrective and preventive action (CAPA) managed for quality failures?',
    options: [
      { text: 'No formal CAPA process', score: 1 },
      { text: 'Issue fixed immediately; no root cause analysis', score: 2 },
      { text: 'Manual CAPA form filled and filed', score: 3 },
      { text: 'Digital CAPA module in QMS with owner, due date and verification', score: 4 },
      { text: 'AI-assisted root cause suggestion; CAPA effectiveness trend analysis with closure metrics', score: 5 },
      { text: 'N/A', isNA: true }
    ]
  },
  {
    id: 406,
    type: 'functional',
    area: 'Quality',
    category: 'Calibration Management',
    text: 'How is the calibration of measuring instruments and test equipment managed?',
    options: [
      { text: 'No calibration done', score: 1 },
      { text: 'External agency calibrates; certificates filed physically', score: 2 },
      { text: 'Manual calibration schedule and log maintained', score: 3 },
      { text: 'Digital calibration management in QMS with due-date alerts', score: 4 },
      { text: 'Automated calibration scheduling with instrument status flag in QMS; blocked if expired', score: 5 },
      { text: 'N/A', isNA: true }
    ]
  },
  {
    id: 407,
    type: 'functional',
    area: 'Quality',
    category: 'Document Control',
    text: 'How are product specifications, drawings and quality standards maintained and controlled?',
    options: [
      { text: 'No controlled documents; versions vary across machines', score: 1 },
      { text: 'Physical binder with drawings; not always updated', score: 2 },
      { text: 'Shared folder with version management by quality manager', score: 3 },
      { text: 'QMS document control module with approval workflow and access control', score: 4 },
      { text: 'Integrated PLM/QMS with auto-distribution of updated specs to shop floor terminals', score: 5 },
      { text: 'N/A', isNA: true }
    ]
  },
  {
    id: 408,
    type: 'functional',
    area: 'Quality',
    category: 'Quality Analytics',
    text: 'How is in-process quality data analysed for trends and process improvements?',
    options: [
      { text: 'No analysis; data not collected consistently', score: 1 },
      { text: 'Occasional manual tabulation in Excel', score: 2 },
      { text: 'Monthly quality reports prepared manually', score: 3 },
      { text: 'QMS dashboard with trend charts, Cpk and defect Pareto', score: 4 },
      { text: 'AI-powered SPC with automatic process drift detection and improvement recommendation', score: 5 },
      { text: 'N/A', isNA: true }
    ]
  },
  {
    id: 409,
    type: 'functional',
    area: 'Quality',
    category: 'Traceability',
    text: 'How is product lot / batch traceability maintained from raw material to customer?',
    options: [
      { text: 'No traceability', score: 1 },
      { text: 'Batch number noted manually in register', score: 2 },
      { text: 'Excel-based lot tracking at each stage', score: 3 },
      { text: 'ERP-based end-to-end lot traceability', score: 4 },
      { text: 'Digital genealogy tree with full forward and backward traceability; QR code on product', score: 5 },
      { text: 'N/A', isNA: true }
    ]
  },
  {
    id: 410,
    type: 'functional',
    area: 'Quality',
    category: 'Customer Quality Requirements',
    text: 'How is customer-specific quality requirement (PPAP, FAI, ISIR) managed?',
    options: [
      { text: 'Not aware of/not applicable', score: 1 },
      { text: 'Prepared manually when customer asks', score: 2 },
      { text: 'Templates maintained in shared folder; submitted by quality engineer', score: 3 },
      { text: 'QMS module for PPAP/FAI with revision and submission tracking', score: 4 },
      { text: 'Automated PPAP package generation from ERP/QMS data with customer portal submission', score: 5 },
      { text: 'N/A', isNA: true }
    ]
  },
  {
    id: 411,
    type: 'functional',
    area: 'Quality',
    category: 'Supplier Quality',
    text: 'How is supplier quality rating and development managed?',
    options: [
      { text: 'No supplier quality assessment', score: 1 },
      { text: 'Informal feedback given to supplier on phone', score: 2 },
      { text: 'Manual supplier audit checklist; annual review', score: 3 },
      { text: 'QMS-based supplier scorecard updated per lot; periodic audit', score: 4 },
      { text: 'Digital supplier development portal with real-time quality KPIs and improvement plan tracking', score: 5 },
      { text: 'N/A', isNA: true }
    ]
  },
  {
    id: 412,
    type: 'functional',
    area: 'Quality',
    category: 'Non-Conforming Material',
    text: 'How is the hold and release of non-conforming material managed?',
    options: [
      { text: 'Non-conforming material mixed with accepted stock', score: 1 },
      { text: 'Physically tagged/segregated; no system entry', score: 2 },
      { text: 'Manual NCR (Non-Conformance Report) raised and filed', score: 3 },
      { text: 'Digital NCR in QMS with disposition decision and material quarantine flag in ERP', score: 4 },
      { text: 'Automated quarantine zone trigger with CAPA linkage and lot recall capability', score: 5 },
      { text: 'N/A', isNA: true }
    ]
  },
  {
    id: 413,
    type: 'functional',
    area: 'Quality',
    category: 'Cost of Quality',
    text: 'How are quality-related costs (cost of poor quality – COPQ) tracked?',
    options: [
      { text: 'Not tracked', score: 1 },
      { text: 'Rough estimate based on scrap weight/value', score: 2 },
      { text: 'Manual COPQ calculation in Excel quarterly', score: 3 },
      { text: 'ERP-based scrap, rework and warranty cost reporting', score: 4 },
      { text: 'Integrated COPQ dashboard with prevention, appraisal and failure cost breakdown', score: 5 },
      { text: 'N/A', isNA: true }
    ]
  },
  {
    id: 414,
    type: 'functional',
    area: 'Quality',
    category: 'Compliance & Audit',
    text: 'How is ISO/quality certification compliance maintained on an ongoing basis?',
    options: [
      { text: 'No certification; no plans', score: 1 },
      { text: 'Aware but not pursuing', score: 2 },
      { text: 'Manual evidence collection before surveillance audit', score: 3 },
      { text: 'QMS module for internal audit, observation tracking and management review', score: 4 },
      { text: 'Continuous compliance monitoring with automated audit readiness score and evidence linking', score: 5 },
      { text: 'N/A', isNA: true }
    ]
  },
  {
    id: 415,
    type: 'functional',
    area: 'Quality',
    category: 'Customer Satisfaction',
    text: 'How are customer satisfaction scores tracked and acted upon?',
    options: [
      { text: 'Not tracked', score: 1 },
      { text: 'Informal feedback from sales team', score: 2 },
      { text: 'Annual customer satisfaction survey via email/form', score: 3 },
      { text: 'CRM-based customer feedback module with response tracking', score: 4 },
      { text: 'Real-time NPS dashboard with sentiment analysis and auto-escalation for detractors', score: 5 },
      { text: 'N/A', isNA: true }
    ]
  }
];
