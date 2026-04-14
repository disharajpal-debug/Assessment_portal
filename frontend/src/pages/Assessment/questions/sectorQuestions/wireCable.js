export const WIRE_CABLE_QUESTIONS = [
  {
    id: 13,
    type: 'sector',
    sector: 'wire_cable',
    category: 'Production',
    text: 'How are drawing, stranding, and extrusion machine parameters monitored?',
    options: [
      { text: 'Operator visual monitoring only; no digital readouts', score: 1 },
      { text: 'Analog gauges; parameters noted in shift logs', score: 2 },
      { text: 'Digital displays on machines; manual entry in reports', score: 3 },
      { text: 'Machine data collected centrally via SCADA/PLC', score: 4 },
      { text: 'Real-time IoT monitoring with automated alerts and SPC integration', score: 5 },
      { text: 'N/A', isNA: true }
    ]
  },
  {
    id: 14,
    type: 'sector',
    sector: 'wire_cable',
    category: 'Quality',
    text: 'How is electrical testing (resistance, insulation, voltage) data managed?',
    options: [
      { text: 'Test results hand-noted on paper only', score: 1 },
      { text: 'Paper test certificates; no digital storage', score: 2 },
      { text: 'Test results entered in Excel; CoT issued manually', score: 3 },
      { text: 'Digital test management system auto-generating test certificates', score: 4 },
      { text: 'Automated test equipment linked to QMS with real-time pass/fail decisions', score: 5 },
      { text: 'N/A', isNA: true }
    ]
  },
  {
    id: 15,
    type: 'sector',
    sector: 'wire_cable',
    category: 'Material',
    text: 'How is copper/aluminium conductor material consumption and yield tracked?',
    options: [
      { text: 'Not tracked; estimated from production output', score: 1 },
      { text: 'Manual weight-based recording at start/end of shift', score: 2 },
      { text: 'Excel-based consumption and yield analysis', score: 3 },
      { text: 'Digital material management with per-batch yield reports', score: 4 },
      { text: 'IoT-based real-time yield tracking with automatic wastage alerts', score: 5 },
      { text: 'N/A', isNA: true }
    ]
  },
  {
    id: 16,
    type: 'sector',
    sector: 'wire_cable',
    category: 'Compliance',
    text: 'How are BIS certification and IS standard compliance documents managed?',
    options: [
      { text: 'Compliance done manually; certificates in physical files', score: 1 },
      { text: 'Scanned copies stored in folders', score: 2 },
      { text: 'Digital document library with expiry tracking', score: 3 },
      { text: 'Compliance management software with renewal reminders', score: 4 },
      { text: 'Automated compliance tracking integrated with production and audit trail', score: 5 },
      { text: 'N/A', isNA: true }
    ]
  },
  {
    id: 17,
    type: 'sector',
    sector: 'wire_cable',
    category: 'Maintenance',
    text: 'How is maintenance of drawing dies, extrusion dies, and machines managed?',
    options: [
      { text: 'Reactive maintenance only; no schedule', score: 1 },
      { text: 'Manual maintenance log maintained by technician', score: 2 },
      { text: 'Excel-based preventive maintenance schedule', score: 3 },
      { text: 'CMMS (Computerized Maintenance Management System) in use', score: 4 },
      { text: 'Predictive maintenance using machine vibration/temperature sensors', score: 5 },
      { text: 'N/A', isNA: true }
    ]
  },
  {
    id: 18,
    type: 'sector',
    sector: 'wire_cable',
    category: 'Energy',
    text: 'How is power factor, energy consumption per kg of output tracked?',
    options: [
      { text: 'Not tracked at all', score: 1 },
      { text: 'Monthly bill reviewed; no production correlation', score: 2 },
      { text: 'Manual energy-per-unit recording per shift', score: 3 },
      { text: 'Digital energy monitoring with production-linked dashboards', score: 4 },
      { text: 'AI-based energy management with dynamic load balancing', score: 5 },
      { text: 'N/A', isNA: true }
    ]
  },
  {
    id: 19,
    type: 'sector',
    sector: 'wire_cable',
    category: 'Traceability',
    text: 'How is product traceability (drum-to-customer) ensured?',
    options: [
      { text: 'No traceability system in place', score: 1 },
      { text: 'Drum numbers noted on paper dispatch records', score: 2 },
      { text: 'Barcode/QR on drums with Excel traceability', score: 3 },
      { text: 'Digital traceability system from production to dispatch', score: 4 },
      { text: 'End-to-end serialized traceability integrated with customer portal', score: 5 },
      { text: 'N/A', isNA: true }
    ]
  },
  {
    id: 20,
    type: 'sector',
    sector: 'wire_cable',
    category: 'Sales & Customer',
    text: 'How do you manage project-specific cable schedules and customer specifications?',
    options: [
      { text: 'Verbal communication with customers; no documentation', score: 1 },
      { text: 'Email/WhatsApp for specs; manual conversion to work order', score: 2 },
      { text: 'Structured spec sheet in Excel linked to production', score: 3 },
      { text: 'Project management software handling customer specs and delivery schedules', score: 4 },
      { text: 'Digital customer portal with auto-generation of production orders from specs', score: 5 },
      { text: 'N/A', isNA: true }
    ]
  },
];
