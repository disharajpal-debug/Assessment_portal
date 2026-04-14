export const PRODUCTION_QUESTIONS = [
  {
    id: 301,
    type: 'functional',
    area: 'Production',
    category: 'Production Planning',
    text: 'How is the production plan created and communicated to the shop floor?',
    options: [
      { text: 'Verbal Instruction from owner/manager daily', score: 1 },
      { text: 'Handwritten daily production schedule on whiteboard', score: 2 },
      { text: 'Excel-based weekly plan shared via WhatsApp/email', score: 3 },
      { text: 'ERP production order generated and dispatched digitally', score: 4 },
      { text: 'AI-driven production schedule linked to demand forecast, material availability and machine capacity', score: 5 },
      { text: 'N/A', isNA: true }
    ]
  },
  {
    id: 302,
    type: 'functional',
    area: 'Production',
    category: 'Machine Data Capture',
    text: 'How is machine downtime and breakdown data captured?',
    options: [
      { text: 'Not captured; machines repaired when they stop', score: 1 },
      { text: 'Operator verbally informs supervisor; no record', score: 2 },
      { text: 'Manual breakdown register maintained', score: 3 },
      { text: 'Digital breakdown log with downtime reason codes in ERP/MES', score: 4 },
      { text: 'IoT machine sensors with automatic downtime detection, root cause classification and MTTR tracking', score: 5 },
      { text: 'N/A', isNA: true }
    ]
  },
  {
    id: 303,
    type: 'functional',
    area: 'Production',
    category: 'Shift Reporting',
    text: 'How is shift-wise production output recorded and reported?',
    options: [
      { text: 'No shift reporting; only end-of-day count', score: 1 },
      { text: 'Physical tally sheet filled by operator', score: 2 },
      { text: 'Excel sheet submitted by supervisor per shift', score: 3 },
      { text: 'Digital shift report in MES/ERP with actual vs. planned comparison', score: 4 },
      { text: 'Real-time counter or SCADA-linked automated production count with live dashboard', score: 5 },
      { text: 'N/A', isNA: true }
    ]
  },
  {
    id: 304,
    type: 'functional',
    area: 'Production',
    category: 'Shift Allocation',
    text: 'How is shift allocation and operator-to-machine assignment managed?',
    options: [
      { text: 'Owner/supervisor decides verbally', score: 1 },
      { text: 'Physical shift roster on notice board', score: 2 },
      { text: 'Excel-based shift schedule updated weekly', score: 3 },
      { text: 'Digital shift management in HRMS/ERP with operator skills matrix', score: 4 },
      { text: 'AI-optimised shift allocation based on skill, absenteeism data and machine requirements', score: 5 },
      { text: 'N/A', isNA: true }
    ]
  },
  {
    id: 305,
    type: 'functional',
    area: 'Production',
    category: 'Material Delivery to Floor',
    text: 'How is raw material delivery to the shop floor (from store to machine) managed?',
    options: [
      { text: 'Operator walks to store whenever needed', score: 1 },
      { text: 'Supervisor calls store keeper when material runs low', score: 2 },
      { text: 'Pre-planned material kit issued at start of shift', score: 3 },
      { text: 'ERP-generated material requisition linked to production order', score: 4 },
      { text: 'Automated kanban or AGV-driven material replenishment to machine side', score: 5 },
      { text: 'N/A', isNA: true }
    ]
  },
  {
    id: 306,
    type: 'functional',
    area: 'Production',
    category: 'Manpower Planning',
    text: 'How is manpower planning (headcount requirement per shift) done?',
    options: [
      { text: 'No formal planning; whoever is present is deployed', score: 1 },
      { text: 'Experience-based judgment by production manager', score: 2 },
      { text: 'Excel-based headcount plan reviewed weekly', score: 3 },
      { text: 'ERP workforce planning module aligned with production orders', score: 4 },
      { text: 'AI-driven manpower demand model integrating absenteeism patterns, OEE and production plan', score: 5 },
      { text: 'N/A', isNA: true }
    ]
  },
  {
    id: 307,
    type: 'functional',
    area: 'Production',
    category: 'In-Process Quality',
    text: 'How is in-process quality (first-pass yield, defects) monitored during production?',
    options: [
      { text: 'No in-process monitoring; quality checked at end', score: 1 },
      { text: 'Operator self-inspection with visual check', score: 2 },
      { text: 'QC inspector checks at defined frequency; paper record', score: 3 },
      { text: 'Digital in-process quality log in QMS linked to production order', score: 4 },
      { text: 'Automated SPC (Statistical Process Control) with real-time control charts and auto-alarm', score: 5 },
      { text: 'N/A', isNA: true }
    ]
  },
  {
    id: 308,
    type: 'functional',
    area: 'Production',
    category: 'OEE Measurement',
    text: 'How is Overall Equipment Effectiveness (OEE) measured?',
    options: [
      { text: 'Not measured', score: 1 },
      { text: 'Availability calculated informally; no formal OEE', score: 2 },
      { text: 'Manual OEE calculation from shift reports in Excel', score: 3 },
      { text: 'MES-based OEE dashboard updated daily', score: 4 },
      { text: 'Real-time IoT-based OEE with automatic loss categorisation (planned, unplanned, quality)', score: 5 },
      { text: 'N/A', isNA: true }
    ]
  },
  {
    id: 309,
    type: 'functional',
    area: 'Production',
    category: 'WIP Tracking',
    text: 'How is work-in-progress (WIP) inventory tracked on the shop floor?',
    options: [
      { text: 'Not tracked; WIP found wherever left', score: 1 },
      { text: 'Supervisor does visual walkthrough', score: 2 },
      { text: 'Manual WIP tally recorded per shift', score: 3 },
      { text: 'ERP WIP report updated as production orders are processed', score: 4 },
      { text: 'Real-time WIP tracking with RFID/barcode scan at each operation stage', score: 5 },
      { text: 'N/A', isNA: true }
    ]
  },
  {
    id: 310,
    type: 'functional',
    area: 'Production',
    category: 'Scrap & Rework',
    text: 'How is scrap and rework generated during production recorded and managed?',
    options: [
      { text: 'No formal record; scrap discarded informally', score: 1 },
      { text: 'Monthly scrap weight estimated by supervisor', score: 2 },
      { text: 'Manual scrap register per machine/operator', score: 3 },
      { text: 'ERP scrap reporting linked to production order with cost impact', score: 4 },
      { text: 'Digital scrap analytics with Pareto reporting, root cause and cost recovery tracking', score: 5 },
      { text: 'N/A', isNA: true }
    ]
  },
  {
    id: 311,
    type: 'functional',
    area: 'Production',
    category: 'Tooling Management',
    text: 'How is tool, die and jig life and consumption tracked on the shop floor?',
    options: [
      { text: 'Not tracked; replaced when broken', score: 1 },
      { text: 'Manual tool issue register in store', score: 2 },
      { text: 'Excel-based tool life tracking per machine', score: 3 },
      { text: 'ERP tool management with usage counter and replacement alerts', score: 4 },
      { text: 'IoT tool monitoring with wear prediction and automatic reorder trigger', score: 5 },
      { text: 'N/A', isNA: true }
    ]
  },
  {
    id: 312,
    type: 'functional',
    area: 'Production',
    category: 'Preventive Maintenance',
    text: 'How is machine preventive maintenance (PM) scheduled and executed?',
    options: [
      { text: 'No PM; only breakdown maintenance', score: 1 },
      { text: 'PM done based on operator experience/feel', score: 2 },
      { text: 'Periodic PM checklist on paper', score: 3 },
      { text: 'Digital PM schedule in CMMS (Computerised Maintenance Management System)', score: 4 },
      { text: 'Predictive maintenance using vibration/temperature IoT sensors with auto-work-order creation', score: 5 },
      { text: 'N/A', isNA: true }
    ]
  },
  {
    id: 313,
    type: 'functional',
    area: 'Production',
    category: 'Performance Review',
    text: 'How is production target vs. achievement reviewed with the team?',
    options: [
      { text: 'No formal review', score: 1 },
      { text: 'Verbal discussion at end of day', score: 2 },
      { text: 'Daily morning meeting with printed report', score: 3 },
      { text: 'Daily digital dashboard reviewed in production review meeting', score: 4 },
      { text: 'Continuous real-time shop floor display (andon board) with exception escalation', score: 5 },
      { text: 'N/A', isNA: true }
    ]
  },
  {
    id: 314,
    type: 'functional',
    area: 'Production',
    category: 'SOP Management',
    text: 'How are standard operating procedures (SOPs) communicated to operators?',
    options: [
      { text: 'No formal SOPs; verbal training only', score: 1 },
      { text: 'Printed SOPs on machine; not regularly updated', score: 2 },
      { text: 'Controlled document system with periodic SOP revision', score: 3 },
      { text: 'Digital SOP library accessible on tablets/screens at machine', score: 4 },
      { text: 'Interactive multimedia SOP with AR/video guidance and operator acknowledgement tracking', score: 5 },
      { text: 'N/A', isNA: true }
    ]
  },
  {
    id: 315,
    type: 'functional',
    area: 'Production',
    category: 'Energy in Production',
    text: 'How is production-related energy consumption (per machine/shift) tracked?',
    options: [
      { text: 'Not tracked at machine level', score: 1 },
      { text: 'Overall factory meter reviewed; not allocated to production', score: 2 },
      { text: 'Manual meter reading per machine area', score: 3 },
      { text: 'Sub-metering with digital reading per production line', score: 4 },
      { text: 'IoT energy monitoring per machine with consumption vs. output ratio and OEE linkage', score: 5 },
      { text: 'N/A', isNA: true }
    ]
  }
];
