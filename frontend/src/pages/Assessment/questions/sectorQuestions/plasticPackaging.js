export const PLASTIC_PACKAGING_QUESTIONS = [
  {
    id: 13,
    type: 'sector',
    sector: 'plastic_packaging',
    category: 'Production',
    text: 'How are injection moulding / blow moulding / extrusion machine parameters monitored?',
    options: [
      { text: 'Operator memory and experience; no digital capture', score: 1 },
      { text: 'Analog dials; parameters noted in shift log', score: 2 },
      { text: 'Digital HMI with parameters displayed; manual recording', score: 3 },
      { text: 'Machine parameters logged digitally via PLC/SCADA', score: 4 },
      { text: 'IoT-based real-time monitoring with SPC alerts and remote access', score: 5 },
      { text: 'N/A', isNA: true }
    ]
  },
  {
    id: 14,
    type: 'sector',
    sector: 'plastic_packaging',
    category: 'Quality',
    text: 'How is incoming raw material (resin, masterbatch) quality tested and approved?',
    options: [
      { text: 'No incoming QC; used as received', score: 1 },
      { text: 'Visual inspection only', score: 2 },
      { text: 'Basic MFI/weight tests with manual records', score: 3 },
      { text: 'QMS-based incoming inspection with CoA verification', score: 4 },
      { text: 'Automated incoming inspection with supplier scorecard and CoA validation', score: 5 },
      { text: 'N/A', isNA: true }
    ]
  },
  {
    id: 15,
    type: 'sector',
    sector: 'plastic_packaging',
    category: 'Mould Management',
    text: 'How is mould maintenance, shot count, and lifecycle management tracked?',
    options: [
      { text: 'No tracking; moulds repaired when damaged', score: 1 },
      { text: 'Manual record of mould usage/repair', score: 2 },
      { text: 'Excel-based mould shot count and maintenance schedule', score: 3 },
      { text: 'Digital mould management system with life cycle alerts', score: 4 },
      { text: 'IoT-based mould monitoring with predictive maintenance triggers', score: 5 },
      { text: 'N/A', isNA: true }
    ]
  },
  {
    id: 16,
    type: 'sector',
    sector: 'plastic_packaging',
    category: 'Design',
    text: 'How are new packaging designs and client artwork managed?',
    options: [
      { text: 'Designs done externally; no internal system', score: 1 },
      { text: 'Design files stored in local folders without version control', score: 2 },
      { text: 'Structured design library with naming convention', score: 3 },
      { text: 'DAM (Digital Asset Management) system for artwork', score: 4 },
      { text: 'Integrated artwork management with customer approval workflow and versioning', score: 5 },
      { text: 'N/A', isNA: true }
    ]
  },
  {
    id: 17,
    type: 'sector',
    sector: 'plastic_packaging',
    category: 'Compliance',
    text: 'How is compliance with food-grade, EPR (Extended Producer Responsibility) and BIS standards managed?',
    options: [
      { text: 'Not aware of applicable regulations', score: 1 },
      { text: 'Basic awareness; compliance done when audited', score: 2 },
      { text: 'Manual documentation for compliance certificates', score: 3 },
      { text: 'Digital compliance calendar and document management', score: 4 },
      { text: 'Automated EPR reporting and digital compliance dashboard', score: 5 },
      { text: 'N/A', isNA: true }
    ]
  },
  {
    id: 18,
    type: 'sector',
    sector: 'plastic_packaging',
    category: 'Waste & Regrind',
    text: 'How is plastic scrap, regrind usage, and wastage tracked?',
    options: [
      { text: 'Not tracked; mixed with production casually', score: 1 },
      { text: 'Manual weight recording of scrap', score: 2 },
      { text: 'Excel tracker for regrind generation and usage', score: 3 },
      { text: 'Digital waste management module linked to production', score: 4 },
      { text: 'Real-time IoT-based material balance with zero-waste dashboards', score: 5 },
      { text: 'N/A', isNA: true }
    ]
  },
  {
    id: 19,
    type: 'sector',
    sector: 'plastic_packaging',
    category: 'Customer',
    text: 'How are custom orders, printing specifications, and delivery schedules managed for packaging clients?',
    options: [
      { text: 'Phone/WhatsApp orders with no formal tracking', score: 1 },
      { text: 'Manual order register with customer specs on paper', score: 2 },
      { text: 'Excel-based order management with delivery schedule', score: 3 },
      { text: 'ERP/OMS with order-to-dispatch tracking', score: 4 },
      { text: 'Customer portal with real-time order status, proofing, and delivery tracking', score: 5 },
      { text: 'N/A', isNA: true }
    ]
  },
  {
    id: 20,
    type: 'sector',
    sector: 'plastic_packaging',
    category: 'Energy',
    text: 'How is energy consumption per machine or product monitored?',
    options: [
      { text: 'Not monitored; only monthly bill reviewed', score: 1 },
      { text: 'Manual meter reading with shift logs', score: 2 },
      { text: 'Machine-level energy sub-metering with Excel reporting', score: 3 },
      { text: 'Energy management system with OEE and energy benchmarks', score: 4 },
      { text: 'AI-driven energy optimization with real-time OEE and carbon footprint tracking', score: 5 },
      { text: 'N/A', isNA: true }
    ]
  },
];
