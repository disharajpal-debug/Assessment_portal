export const ENGINEERING_GOODS_QUESTIONS = [
  {
    id: 13,
    type: 'sector',
    sector: 'engineering_goods',
    category: 'Design & Engineering',
    text: 'How are engineering drawings and product designs created and managed?',
    options: [
      { text: 'Hand-drawn sketches only', score: 1 },
      { text: '2D CAD (AutoCAD) used; files stored on local computers', score: 2 },
      { text: '3D CAD (SolidWorks, CATIA) with structured file management', score: 3 },
      { text: 'PDM/PLM system managing design versions, BOMs, and approvals', score: 4 },
      { text: 'Fully integrated PLM with simulation, digital twin, and customer collaboration', score: 5 },
      { text: 'N/A', isNA: true }
    ]
  },
  {
    id: 14,
    type: 'sector',
    sector: 'engineering_goods',
    category: 'Production',
    text: 'How is job shop / machining work order and routing managed?',
    options: [
      { text: 'Verbal work allocation by supervisor', score: 1 },
      { text: 'Paper job cards given to each machine operator', score: 2 },
      { text: 'Excel-based job tracking with status updates', score: 3 },
      { text: 'Digital shop floor control system with work order routing', score: 4 },
      { text: 'Fully automated WO management with machine-level progress tracking', score: 5 },
      { text: 'N/A', isNA: true }
    ]
  },
  {
    id: 15,
    type: 'sector',
    sector: 'engineering_goods',
    category: 'Quality',
    text: 'How are dimensional inspection and measurement data managed?',
    options: [
      { text: 'Manual measurement; no records maintained', score: 1 },
      { text: 'Paper inspection records with manual sign-off', score: 2 },
      { text: 'Excel-based inspection data with SPC charts', score: 3 },
      { text: 'Digital CMM (Coordinate Measuring Machine) data linked to QMS', score: 4 },
      { text: 'Automated in-line measurement with real-time SPC and corrective action workflow', score: 5 },
      { text: 'N/A', isNA: true }
    ]
  },
  {
    id: 16,
    type: 'sector',
    sector: 'engineering_goods',
    category: 'Tool & Die',
    text: 'How are cutting tools, jigs, and fixtures tracked and managed?',
    options: [
      { text: 'No formal tool management; ad hoc tracking', score: 1 },
      { text: 'Physical register for tool issue and return', score: 2 },
      { text: 'Excel-based tool inventory with life tracking', score: 3 },
      { text: 'Digital tool management system with cost/life analytics', score: 4 },
      { text: 'IoT-based tool tracking with predictive replacement alerts', score: 5 },
      { text: 'N/A', isNA: true }
    ]
  },
  {
    id: 17,
    type: 'sector',
    sector: 'engineering_goods',
    category: 'Subcontracting',
    text: 'How is subcontracting / job work coordination managed?',
    options: [
      { text: 'Verbal coordination; no documentation', score: 1 },
      { text: 'Paper gate pass and challan system', score: 2 },
      { text: 'Excel tracker for outward/inward job work', score: 3 },
      { text: 'Digital job work management with status, quality, and cost tracking', score: 4 },
      { text: 'Integrated subcontractor portal with real-time visibility', score: 5 },
      { text: 'N/A', isNA: true }
    ]
  },
  {
    id: 18,
    type: 'sector',
    sector: 'engineering_goods',
    category: 'Customer Service',
    text: 'How are customer complaints, warranty claims, and after-sales service managed?',
    options: [
      { text: 'Handled informally; no tracking', score: 1 },
      { text: 'Manual register for complaints', score: 2 },
      { text: 'Excel-based complaint log with resolution tracking', score: 3 },
      { text: 'Digital service management system with SLA tracking', score: 4 },
      { text: 'Integrated CRM/service platform with customer portal and predictive service', score: 5 },
      { text: 'N/A', isNA: true }
    ]
  },
  {
    id: 19,
    type: 'sector',
    sector: 'engineering_goods',
    category: 'Costing',
    text: 'How is job/project-level cost analysis and profitability tracked?',
    options: [
      { text: 'No cost analysis; pricing based on market rate', score: 1 },
      { text: 'Basic cost sheet prepared manually per job', score: 2 },
      { text: 'Excel-based job costing with material and labour', score: 3 },
      { text: 'ERP-based job costing with variance analysis', score: 4 },
      { text: 'Real-time job profitability dashboard with AI-based pricing insights', score: 5 },
      { text: 'N/A', isNA: true }
    ]
  },
  {
    id: 20,
    type: 'sector',
    sector: 'engineering_goods',
    category: 'Automation',
    text: 'What is the level of automation in your machining/fabrication processes?',
    options: [
      { text: 'Fully manual operations', score: 1 },
      { text: 'Semi-automatic conventional machines', score: 2 },
      { text: 'CNC machines with manual programming', score: 3 },
      { text: 'CNC with DNC (Direct Numerical Control) linked to CAD/CAM', score: 4 },
      { text: 'Flexible Manufacturing System (FMS) / Robotics with Industry 4.0 integration', score: 5 },
      { text: 'N/A', isNA: true }
    ]
  },
];
