export const WAREHOUSING_QUESTIONS = [
  {
    id: 201,
    type: 'functional',
    area: 'Warehousing',
    category: 'Location Management',
    text: 'How is warehouse storage location (binning) currently managed?',
    options: [
      { text: 'No defined locations; material kept anywhere available', score: 1 },
      { text: 'Locations marked physically on floor/racks but no system', score: 2 },
      { text: 'Excel-based bin register maintained manually', score: 3 },
      { text: 'ERP/WMS with fixed bin locations per material', score: 4 },
      { text: 'Dynamic slotting WMS with weight, velocity and dimension-based bin assignment', score: 5 },
      { text: 'N/A', isNA: true }
    ]
  },
  {
    id: 202,
    type: 'functional',
    area: 'Warehousing',
    category: 'FIFO Control',
    text: 'How is FIFO (First-In-First-Out) compliance ensured in the warehouse?',
    options: [
      { text: 'Not followed; material issued randomly', score: 1 },
      { text: 'Store keeper maintains FIFO by memory/experience', score: 2 },
      { text: 'Date labels on materials; staff trained on FIFO', score: 3 },
      { text: 'WMS enforces FIFO; system suggests oldest batch first', score: 4 },
      { text: 'Automated FIFO control via RFID/barcode with operator alerts for out-of-sequence picks', score: 5 },
      { text: 'N/A', isNA: true }
    ]
  },
  {
    id: 203,
    type: 'functional',
    area: 'Warehousing',
    category: 'Inventory Accuracy',
    text: 'How is inventory quantity accuracy maintained in the warehouse?',
    options: [
      { text: 'Physical counting done annually only', score: 1 },
      { text: 'Monthly physical count reconciled with register', score: 2 },
      { text: 'Cycle counting process defined; deviations noted', score: 3 },
      { text: 'ERP-based perpetual inventory with discrepancy reporting', score: 4 },
      { text: 'Real-time inventory accuracy with RFID/barcode; automated cycle count triggers', score: 5 },
      { text: 'N/A', isNA: true }
    ]
  },
  {
    id: 204,
    type: 'functional',
    area: 'Warehousing',
    category: 'Material Issue Process',
    text: 'How is material issued from the warehouse to production?',
    options: [
      { text: 'Informal verbal request; no documentation', score: 1 },
      { text: 'Manual material requisition slip filled by production', score: 2 },
      { text: 'Store keeper issues against signed requisition; Excel updated', score: 3 },
      { text: 'ERP material issue against production order; stock auto-deducted', score: 4 },
      { text: 'Pull-based digital kanban or automated material call from shop floor', score: 5 },
      { text: 'N/A', isNA: true }
    ]
  },
  {
    id: 205,
    type: 'functional',
    area: 'Warehousing',
    category: 'Inventory Health',
    text: 'How is slow-moving or dead stock identified and actioned?',
    options: [
      { text: 'Not identified; stock piles up unnoticed', score: 1 },
      { text: 'Annual review by purchase manager', score: 2 },
      { text: 'Quarterly Excel analysis of non-moving items', score: 3 },
      { text: 'ERP generates slow-moving report; management reviews monthly', score: 4 },
      { text: 'AI-powered inventory health dashboard with automatic disposal/redeployment recommendations', score: 5 },
      { text: 'N/A', isNA: true }
    ]
  },
  {
    id: 206,
    type: 'functional',
    area: 'Warehousing',
    category: 'Storage Environment',
    text: 'How is the controlled storage environment (temperature, humidity) for sensitive materials managed?',
    options: [
      { text: 'No controlled storage; all material kept in open warehouse', score: 1 },
      { text: 'Separate room used but no monitoring instruments', score: 2 },
      { text: 'Manual temperature/humidity log maintained', score: 3 },
      { text: 'Calibrated digital monitoring with records in QMS', score: 4 },
      { text: 'IoT sensors with continuous monitoring, automated alarms and HVAC integration', score: 5 },
      { text: 'N/A', isNA: true }
    ]
  },
  {
    id: 207,
    type: 'functional',
    area: 'Warehousing',
    category: 'Shelf Life Management',
    text: 'How are materials that are nearing expiry or shelf life tracked?',
    options: [
      { text: 'No shelf life tracking', score: 1 },
      { text: 'Store keeper checks labels periodically', score: 2 },
      { text: 'Excel tracker with expiry dates; reviewed monthly', score: 3 },
      { text: 'ERP auto-alert when material nears shelf life threshold', score: 4 },
      { text: 'System blocks issuance of expired material; auto-triggers disposal/return workflow', score: 5 },
      { text: 'N/A', isNA: true }
    ]
  },
  {
    id: 208,
    type: 'functional',
    area: 'Warehousing',
    category: 'Space Utilisation',
    text: 'How is warehouse space utilisation measured and optimised?',
    options: [
      { text: 'No measurement; space issues handled informally', score: 1 },
      { text: 'Visual estimate by warehouse manager', score: 2 },
      { text: 'Manual occupancy map updated periodically', score: 3 },
      { text: 'WMS with space utilisation reporting by location/zone', score: 4 },
      { text: '3D warehouse simulation with AI-driven slotting and space optimisation', score: 5 },
      { text: 'N/A', isNA: true }
    ]
  },
  {
    id: 209,
    type: 'functional',
    area: 'Warehousing',
    category: 'Returns Management',
    text: 'How are goods returned from production (excess/rejected material) managed?',
    options: [
      { text: 'Returned material placed anywhere; no formal process', score: 1 },
      { text: 'Separate area used but no documentation', score: 2 },
      { text: 'Manual return note raised and entered in register', score: 3 },
      { text: 'ERP return to store document raised; stock reinstated', score: 4 },
      { text: 'Barcode-scanned return process with automated condition check and restocking routing', score: 5 },
      { text: 'N/A', isNA: true }
    ]
  },
  {
    id: 210,
    type: 'functional',
    area: 'Warehousing',
    category: 'MHE Management',
    text: 'How is material handling equipment (forklifts, pallet trucks) utilisation and maintenance tracked?',
    options: [
      { text: 'No tracking; breakdowns handled reactively', score: 1 },
      { text: 'Manual logbook for usage and maintenance', score: 2 },
      { text: 'Excel-based maintenance schedule', score: 3 },
      { text: 'Digital preventive maintenance system with alerts', score: 4 },
      { text: 'IoT-enabled MHE with real-time utilisation data, predictive maintenance and operator assignment', score: 5 },
      { text: 'N/A', isNA: true }
    ]
  },
  {
    id: 211,
    type: 'functional',
    area: 'Warehousing',
    category: 'Consumable Management',
    text: 'How is packing material and consumable stock managed separately in the warehouse?',
    options: [
      { text: 'Mixed with raw material; no separate control', score: 1 },
      { text: 'Separate area maintained manually', score: 2 },
      { text: 'Independent Excel register for packing materials', score: 3 },
      { text: 'Separate material type in ERP with reorder level', score: 4 },
      { text: 'Automated consumption tracking linked to production orders; auto-replenishment triggered', score: 5 },
      { text: 'N/A', isNA: true }
    ]
  },
  {
    id: 212,
    type: 'functional',
    area: 'Warehousing',
    category: 'Warehouse Security',
    text: 'How is access control and security of the warehouse managed?',
    options: [
      { text: 'No access restriction; anyone can enter', score: 1 },
      { text: 'Physical lock with key; no log maintained', score: 2 },
      { text: 'Gated entry with manual visitor/staff register', score: 3 },
      { text: 'Biometric or card-based access log maintained', score: 4 },
      { text: 'CCTV with AI motion detection, digital access log and exception alerts', score: 5 },
      { text: 'N/A', isNA: true }
    ]
  },
  {
    id: 213,
    type: 'functional',
    area: 'Warehousing',
    category: 'Inter-Store Transfer',
    text: 'How is inter-store transfer (raw material to sub-store or work-in-progress store) managed?',
    options: [
      { text: 'Informal movement without documentation', score: 1 },
      { text: 'Physical transfer slip used', score: 2 },
      { text: 'Manual transfer voucher entered in Excel', score: 3 },
      { text: 'ERP transfer order raised between storage locations', score: 4 },
      { text: 'Barcode-triggered transfer with real-time stock update and route tracking', score: 5 },
      { text: 'N/A', isNA: true }
    ]
  },
  {
    id: 214,
    type: 'functional',
    area: 'Warehousing',
    category: 'Layout Optimisation',
    text: 'How is the warehouse layout reviewed and updated?',
    options: [
      { text: 'Layout never reviewed; unchanged for years', score: 1 },
      { text: 'Reviewed informally when problems arise', score: 2 },
      { text: 'Annual manual review with floor plan update', score: 3 },
      { text: 'WMS-based velocity analysis drives annual slotting review', score: 4 },
      { text: 'Continuous AI-driven layout optimisation based on pick frequency, weight and safety rules', score: 5 },
      { text: 'N/A', isNA: true }
    ]
  },
  {
    id: 215,
    type: 'functional',
    area: 'Warehousing',
    category: 'Warehouse Analytics',
    text: 'How is warehouse KPI (on-time issue, accuracy, cycle count variance) reporting done?',
    options: [
      { text: 'No KPIs tracked', score: 1 },
      { text: 'Verbal updates from store keeper', score: 2 },
      { text: 'Monthly manual report prepared in Excel', score: 3 },
      { text: 'ERP-generated warehouse KPI dashboard reviewed by management', score: 4 },
      { text: 'Real-time live dashboard with drill-down analytics, trend charts and AI recommendations', score: 5 },
      { text: 'N/A', isNA: true }
    ]
  }
];
