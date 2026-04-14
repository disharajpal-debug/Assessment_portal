export const CHEMICALS_QUESTIONS = [
  {
    id: 13,
    type: 'sector',
    sector: 'chemicals',
    category: 'Safety & Compliance',
    text: 'How is hazardous chemical handling, SDS (Safety Data Sheet), and HSE compliance managed?',
    options: [
      { text: 'No formal HSE system; verbal instructions only', score: 1 },
      { text: 'Physical SDS files available but not regularly updated', score: 2 },
      { text: 'Digital SDS library accessible to workers', score: 3 },
      { text: 'EHS (Environmental Health & Safety) software used for compliance tracking', score: 4 },
      { text: 'Automated HSE compliance with IoT sensors for gas leaks, spill detection', score: 5 },
      { text: 'N/A', isNA: true }
    ]
  },
  {
    id: 14,
    type: 'sector',
    sector: 'chemicals',
    category: 'Process Control',
    text: 'How are critical process parameters (temperature, pressure, pH, flow rate) monitored?',
    options: [
      { text: 'Visual observation by operators; no sensors', score: 1 },
      { text: 'Analog gauges with manual logging', score: 2 },
      { text: 'Digital sensors with manual data entry into a logbook', score: 3 },
      { text: 'SCADA/DCS system with digital process monitoring', score: 4 },
      { text: 'AI-based process optimization with real-time closed-loop control', score: 5 },
      { text: 'N/A', isNA: true }
    ]
  },
  {
    id: 15,
    type: 'sector',
    sector: 'chemicals',
    category: 'Quality',
    text: 'How is chemical product quality testing and Certificate of Analysis (CoA) issued?',
    options: [
      { text: 'No formal CoA; quality communicated verbally', score: 1 },
      { text: 'Manual paper CoA generated per batch', score: 2 },
      { text: 'Excel/Word templates for CoA generation', score: 3 },
      { text: 'LIMS/QMS generates CoA automatically from lab results', score: 4 },
      { text: 'Digital CoA integrated with ERP, shared electronically with customers', score: 5 },
      { text: 'N/A', isNA: true }
    ]
  },
  {
    id: 16,
    type: 'sector',
    sector: 'chemicals',
    category: 'Waste & Environment',
    text: 'How is effluent treatment, waste disposal, and environmental monitoring tracked?',
    options: [
      { text: 'No tracking; compliance done only during inspections', score: 1 },
      { text: 'Manual logbooks for effluent parameters', score: 2 },
      { text: 'Spreadsheet-based environmental data tracking', score: 3 },
      { text: 'Digital ETP monitoring system with compliance reports', score: 4 },
      { text: 'Real-time online monitoring system connected to CPCB/SPCB portals', score: 5 },
      { text: 'N/A', isNA: true }
    ]
  },
  {
    id: 17,
    type: 'sector',
    sector: 'chemicals',
    category: 'Inventory',
    text: 'How is chemical raw material storage, compatibility, and expiry tracked?',
    options: [
      { text: 'No systematic tracking; stored ad hoc', score: 1 },
      { text: 'Physical labels and manual store records', score: 2 },
      { text: 'Excel-based FIFO/FEFO inventory with expiry dates', score: 3 },
      { text: 'Software-based inventory with chemical compatibility alerts', score: 4 },
      { text: 'IoT-based warehouse management with real-time chemical inventory visibility', score: 5 },
      { text: 'N/A', isNA: true }
    ]
  },
  {
    id: 18,
    type: 'sector',
    sector: 'chemicals',
    category: 'R&D',
    text: 'How is new product development and formulation R&D documented?',
    options: [
      { text: 'Scientist notebooks only; no digital records', score: 1 },
      { text: 'Word/Excel documents stored in shared folders', score: 2 },
      { text: 'Structured digital R&D database with revision history', score: 3 },
      { text: 'Integrated R&D management system with IP and patent tracking', score: 4 },
      { text: 'AI-assisted compound discovery platform with digital lab twin', score: 5 },
      { text: 'N/A', isNA: true }
    ]
  },
  {
    id: 19,
    type: 'sector',
    sector: 'chemicals',
    category: 'Logistics',
    text: 'How are hazardous goods transport documentation and logistics managed?',
    options: [
      { text: 'Verbal coordination; no system documentation', score: 1 },
      { text: 'Paper-based challans and delivery receipts', score: 2 },
      { text: 'Digital delivery tracking via transporter WhatsApp/SMS', score: 3 },
      { text: 'TMS (Transport Management System) with POD and hazmat compliance', score: 4 },
      { text: 'Fully digital logistics with GPS tracking, e-waybill integration, and MSDS delivery', score: 5 },
      { text: 'N/A', isNA: true }
    ]
  },
  {
    id: 20,
    type: 'sector',
    sector: 'chemicals',
    category: 'Energy',
    text: 'How is energy consumption monitored and optimized in your chemical plant?',
    options: [
      { text: 'Not monitored; only utility bills reviewed', score: 1 },
      { text: 'Manual meter reading per shift', score: 2 },
      { text: 'Digital energy meters with periodic Excel reporting', score: 3 },
      { text: 'Energy management software with benchmarking and alerts', score: 4 },
      { text: 'AI-driven energy optimization with sub-metering and demand response', score: 5 },
      { text: 'N/A', isNA: true }
    ]
  },
];
