export const ENERGY_MONITORING_QUESTIONS = [
  {
    id: 701,
    type: 'functional',
    area: 'Energy Monitoring',
    category: 'Energy Measurement',
    text: 'How is total energy consumption (electricity, fuel, gas) currently measured?',
    options: [
      { text: 'Utility bill only; no internal measurement', score: 1 },
      { text: 'Main meter reading noted monthly', score: 2 },
      { text: 'Sub-meter readings taken manually per department', score: 3 },
      { text: 'Digital sub-metering with automated data logging', score: 4 },
      { text: 'IoT smart meters with real-time energy data, 15-minute interval recording', score: 5 },
      { text: 'N/A', isNA: true }
    ]
  },
  {
    id: 702,
    type: 'functional',
    area: 'Energy Monitoring',
    category: 'Energy Allocation',
    text: 'How is energy consumption allocated to individual machines or processes?',
    options: [
      { text: 'Not allocated; total factory consumption only', score: 1 },
      { text: 'Rough estimate by electrical engineer', score: 2 },
      { text: 'Manual clamp-meter reading per machine periodically', score: 3 },
      { text: 'Dedicated energy meters per machine area with manual/ERP logging', score: 4 },
      { text: 'Machine-level IoT energy metering with automatic allocation to production orders', score: 5 },
      { text: 'N/A', isNA: true }
    ]
  },
  {
    id: 703,
    type: 'functional',
    area: 'Energy Monitoring',
    category: 'Energy Intensity KPI',
    text: 'How is energy intensity (energy per unit of production) tracked?',
    options: [
      { text: 'Not tracked', score: 1 },
      { text: 'Informally estimated at year-end', score: 2 },
      { text: 'Calculated manually in Excel from production and meter data', score: 3 },
      { text: 'ERP/BI dashboard showing energy/unit by product or line', score: 4 },
      { text: 'Real-time energy intensity KPI with target vs. actual and trend analysis', score: 5 },
      { text: 'N/A', isNA: true }
    ]
  },
  {
    id: 704,
    type: 'functional',
    area: 'Energy Monitoring',
    category: 'Power Quality',
    text: 'How are peak demand charges and power factor penalties identified and managed?',
    options: [
      { text: 'Not monitored; penalty seen in bill only', score: 1 },
      { text: 'Electrical team reviews monthly bill for penalties', score: 2 },
      { text: 'Manual power factor log maintained', score: 3 },
      { text: 'Digital power analyser with PF and MD recording', score: 4 },
      { text: 'Automated APFC (Automatic Power Factor Correction) with real-time MD alarm and load scheduling', score: 5 },
      { text: 'N/A', isNA: true }
    ]
  },
  {
    id: 705,
    type: 'functional',
    area: 'Energy Monitoring',
    category: 'Energy Auditing',
    text: 'How are energy saving opportunities identified?',
    options: [
      { text: 'Not identified formally', score: 1 },
      { text: 'Based on past experience of electrician', score: 2 },
      { text: 'External energy audit done annually', score: 3 },
      { text: 'Internal energy team reviews monthly data for savings', score: 4 },
      { text: 'Continuous AI-based energy analytics with automatic saving opportunity identification', score: 5 },
      { text: 'N/A', isNA: true }
    ]
  },
  {
    id: 706,
    type: 'functional',
    area: 'Energy Monitoring',
    category: 'Compressed Air',
    text: 'How is compressed air consumption monitored and leak management done?',
    options: [
      { text: 'Not monitored; leaks fixed when audible', score: 1 },
      { text: 'Visual inspection tour periodically', score: 2 },
      { text: 'Quarterly ultrasonic leak detection; manual report', score: 3 },
      { text: 'Air flow meter per zone; consumption log in ERP', score: 4 },
      { text: 'IoT flow meters with continuous leak detection, alert and repair work-order creation', score: 5 },
      { text: 'N/A', isNA: true }
    ]
  },
  {
    id: 707,
    type: 'functional',
    area: 'Energy Monitoring',
    category: 'Water Management',
    text: 'How is water consumption tracked and managed in operations?',
    options: [
      { text: 'Not tracked; only utility bill reviewed', score: 1 },
      { text: 'Manual meter reading monthly', score: 2 },
      { text: 'Department-level manual water logs', score: 3 },
      { text: 'Digital water sub-metering with ERP recording', score: 4 },
      { text: 'IoT water monitoring with process-level consumption, quality check and recycling rate dashboard', score: 5 },
      { text: 'N/A', isNA: true }
    ]
  },
  {
    id: 708,
    type: 'functional',
    area: 'Energy Monitoring',
    category: 'Renewable Energy',
    text: 'How is renewable energy (solar, wind) generation and consumption tracked?',
    options: [
      { text: 'No renewable energy on site', score: 1 },
      { text: 'Solar installed; generation noted from inverter display', score: 2 },
      { text: 'Monthly generation log maintained in Excel', score: 3 },
      { text: 'Solar monitoring portal with generation, consumption and grid export data', score: 4 },
      { text: 'Integrated renewable energy management with real-time self-consumption ratio and carbon credit tracking', score: 5 },
      { text: 'N/A', isNA: true }
    ]
  },
  {
    id: 709,
    type: 'functional',
    area: 'Energy Monitoring',
    category: 'Idle Energy Reduction',
    text: 'How is equipment idle time energy waste identified and reduced?',
    options: [
      { text: 'No awareness of idle energy waste', score: 1 },
      { text: 'Workers switch off machines at end of shift occasionally', score: 2 },
      { text: 'Manual shutdown checklist', score: 3 },
      { text: 'Auto-shutdown timers on equipment; manual log', score: 4 },
      { text: 'IoT-based idle state detection with automatic shutdown command and savings quantification', score: 5 },
      { text: 'N/A', isNA: true }
    ]
  },
  {
    id: 710,
    type: 'functional',
    area: 'Energy Monitoring',
    category: 'Carbon Tracking',
    text: 'How is the carbon footprint or greenhouse gas (GHG) emission tracked?',
    options: [
      { text: 'Not tracked', score: 1 },
      { text: 'Rough estimate from electricity bill units', score: 2 },
      { text: 'Annual manual GHG calculation using emission factors', score: 3 },
      { text: 'ERP-based Scope 1 and Scope 2 emission tracking', score: 4 },
      { text: 'Automated GHG reporting platform with Scope 1, 2, 3 tracking and ESG report generation', score: 5 },
      { text: 'N/A', isNA: true }
    ]
  },
  {
    id: 711,
    type: 'functional',
    area: 'Energy Monitoring',
    category: 'Energy Compliance',
    text: 'How is energy compliance (BEE, ISO 50001, PAT scheme) managed?',
    options: [
      { text: 'Not aware of/not applicable', score: 1 },
      { text: 'Aware but no formal compliance effort', score: 2 },
      { text: 'Manual compliance documentation before audit', score: 3 },
      { text: 'Digital energy management system aligned with ISO 50001', score: 4 },
      { text: 'Continuous BEE/PAT compliance monitoring with automated evidence collection and reporting', score: 5 },
      { text: 'N/A', isNA: true }
    ]
  },
  {
    id: 712,
    type: 'functional',
    area: 'Energy Monitoring',
    category: 'Energy Cost Allocation',
    text: 'How is the energy cost per product or per order calculated?',
    options: [
      { text: 'Not calculated', score: 1 },
      { text: 'Energy cost apportioned equally across products', score: 2 },
      { text: 'Manual calculation based on machine hours and energy rate', score: 3 },
      { text: 'ERP energy cost allocation per production order', score: 4 },
      { text: 'Real-time energy cost per unit with machine-level attribution and costing integration', score: 5 },
      { text: 'N/A', isNA: true }
    ]
  },
  {
    id: 713,
    type: 'functional',
    area: 'Energy Monitoring',
    category: 'Management Review',
    text: 'How is energy performance improvement reviewed with management?',
    options: [
      { text: 'Not reviewed', score: 1 },
      { text: 'Discussed occasionally in management meetings', score: 2 },
      { text: 'Annual review of energy bills and costs', score: 3 },
      { text: 'Monthly energy KPI review with BI dashboard', score: 4 },
      { text: 'Continuous energy performance management system with target-setting, review and reward mechanism', score: 5 },
      { text: 'N/A', isNA: true }
    ]
  },
  {
    id: 714,
    type: 'functional',
    area: 'Energy Monitoring',
    category: 'ECM Tracking',
    text: 'How are energy conservation measures (ECMs) planned and tracked?',
    options: [
      { text: 'No formal ECM programme', score: 1 },
      { text: 'One-off actions taken when large bills arrive', score: 2 },
      { text: 'Annual ECM list with manual progress update', score: 3 },
      { text: 'Digital ECM tracker with investment, savings and payback data', score: 4 },
      { text: 'ECM portfolio management with ROI ranking, implementation status and verified savings dashboard', score: 5 },
      { text: 'N/A', isNA: true }
    ]
  },
  {
    id: 715,
    type: 'functional',
    area: 'Energy Monitoring',
    category: 'Energy Culture',
    text: 'How is employee awareness and behaviour on energy saving promoted?',
    options: [
      { text: 'No awareness programmes', score: 1 },
      { text: 'Verbal instructions during shift meetings', score: 2 },
      { text: 'Energy saving posters/notices in plant', score: 3 },
      { text: 'Digital campaigns with energy KPI screens in canteen/common areas', score: 4 },
      { text: 'Gamified energy saving programme with team leaderboard, rewards and digital awareness content', score: 5 },
      { text: 'N/A', isNA: true }
    ]
  }
];
