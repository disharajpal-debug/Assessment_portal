export const ANALYSIS_VISUALIZATION_QUESTIONS = [
  {
    id: 601,
    type: 'functional',
    area: 'Analysis & Visualization',
    category: 'Data Collection',
    text: 'How is operational data (production, quality, sales) collected and stored?',
    options: [
      { text: "Not collected systematically; data in people's heads", score: 1 },
      { text: 'Paper records; manually filed', score: 2 },
      { text: 'Excel sheets maintained per department', score: 3 },
      { text: 'ERP/MES database; structured data storage', score: 4 },
      { text: 'Unified data lake with real-time ingestion from multiple sources (IoT, ERP, CRM)', score: 5 },
      { text: 'N/A', isNA: true }
    ]
  },
  {
    id: 602,
    type: 'functional',
    area: 'Analysis & Visualization',
    category: 'Reporting',
    text: 'How are daily/weekly management reports generated and shared?',
    options: [
      { text: 'No formal reports; verbal updates', score: 1 },
      { text: 'Manual report typed or handwritten by manager', score: 2 },
      { text: 'Excel report compiled and emailed to management', score: 3 },
      { text: 'ERP-generated reports with scheduled email distribution', score: 4 },
      { text: 'Automated BI reports pushed to mobile/email with drill-down capability', score: 5 },
      { text: 'N/A', isNA: true }
    ]
  },
  {
    id: 603,
    type: 'functional',
    area: 'Analysis & Visualization',
    category: 'KPI Dashboards',
    text: 'How are production and quality KPIs visualised and reviewed?',
    options: [
      { text: 'No KPIs defined', score: 1 },
      { text: 'KPIs discussed verbally in meetings', score: 2 },
      { text: 'Excel-based KPI chart updated monthly', score: 3 },
      { text: 'BI dashboard (Power BI / Tableau) updated daily', score: 4 },
      { text: 'Real-time live dashboard on shop floor screens with drill-down and alert thresholds', score: 5 },
      { text: 'N/A', isNA: true }
    ]
  },
  {
    id: 604,
    type: 'functional',
    area: 'Analysis & Visualization',
    category: 'Root Cause Analysis',
    text: 'How is root cause analysis (RCA) performed when a major problem occurs?',
    options: [
      { text: 'No formal RCA; issue fixed and forgotten', score: 1 },
      { text: 'Discussion among team members; conclusion verbal', score: 2 },
      { text: '5-Why or fishbone analysis on paper/whiteboard', score: 3 },
      { text: 'Digital RCA form in QMS/MES with structured problem-solving', score: 4 },
      { text: 'AI-assisted RCA with pattern matching across historical data and auto-suggested causes', score: 5 },
      { text: 'N/A', isNA: true }
    ]
  },
  {
    id: 605,
    type: 'functional',
    area: 'Analysis & Visualization',
    category: 'Cross-Functional Analytics',
    text: 'How is cross-functional data (production + quality + cost) analysed together?',
    options: [
      { text: 'Each department has its own silo; no integration', score: 1 },
      { text: 'Data manually compiled from different Excel sheets', score: 2 },
      { text: 'Consolidated Excel dashboard prepared by analyst', score: 3 },
      { text: 'BI tool connects to ERP for cross-functional reporting', score: 4 },
      { text: 'Unified analytics platform with cost, quality and production data in single model', score: 5 },
      { text: 'N/A', isNA: true }
    ]
  },
  {
    id: 606,
    type: 'functional',
    area: 'Analysis & Visualization',
    category: 'Financial Analytics',
    text: 'How are financial performance metrics (margin per order, cost per unit) tracked and visualised?',
    options: [
      { text: 'Only annual P&L from accountant', score: 1 },
      { text: 'Monthly tally report reviewed', score: 2 },
      { text: 'Excel-based costing analysis per product', score: 3 },
      { text: 'ERP product costing with variance analysis', score: 4 },
      { text: 'Real-time profitability dashboard per product, customer and order with live cost tracking', score: 5 },
      { text: 'N/A', isNA: true }
    ]
  },
  {
    id: 607,
    type: 'functional',
    area: 'Analysis & Visualization',
    category: 'Trend Analysis',
    text: 'How is trend analysis on defects, downtime or delivery performance performed?',
    options: [
      { text: 'Not performed', score: 1 },
      { text: 'Supervisor notices issues; no formal trending', score: 2 },
      { text: 'Monthly Pareto chart in Excel by quality team', score: 3 },
      { text: 'BI dashboard with rolling trend charts and period comparison', score: 4 },
      { text: 'Automated anomaly detection with predictive trend alerts before KPI breaches', score: 5 },
      { text: 'N/A', isNA: true }
    ]
  },
  {
    id: 608,
    type: 'functional',
    area: 'Analysis & Visualization',
    category: 'Ad Hoc Analysis',
    text: 'How is ad hoc data query or drill-down analysis performed by managers?',
    options: [
      { text: 'Managers cannot access data without analyst support', score: 1 },
      { text: 'Analyst runs Excel queries when asked', score: 2 },
      { text: 'Pre-built Excel models with filter/pivot capability', score: 3 },
      { text: 'Self-service BI tool with drag-and-drop reports', score: 4 },
      { text: 'Natural language query (AI-powered) with instant chart generation', score: 5 },
      { text: 'N/A', isNA: true }
    ]
  },
  {
    id: 609,
    type: 'functional',
    area: 'Analysis & Visualization',
    category: 'Sales Analytics',
    text: 'How is customer-wise or product-wise sales/margin analysis performed?',
    options: [
      { text: 'Not performed; total revenue only', score: 1 },
      { text: 'Manual calculation by accounts team', score: 2 },
      { text: 'Excel pivot table for sales analysis', score: 3 },
      { text: 'CRM/ERP-based customer and product profitability report', score: 4 },
      { text: 'AI-driven customer lifetime value and product mix optimisation analytics', score: 5 },
      { text: 'N/A', isNA: true }
    ]
  },
  {
    id: 610,
    type: 'functional',
    area: 'Analysis & Visualization',
    category: 'Benchmarking',
    text: 'How is benchmark comparison (industry standard vs. own performance) done?',
    options: [
      { text: 'No benchmarking', score: 1 },
      { text: 'Informal comparison shared in industry meetings', score: 2 },
      { text: 'Manual comparison with industry data once a year', score: 3 },
      { text: 'ERP-based KPI comparison with targets and industry benchmarks', score: 4 },
      { text: 'Digital benchmarking platform with industry peer comparison and best practice recommendations', score: 5 },
      { text: 'N/A', isNA: true }
    ]
  },
  {
    id: 611,
    type: 'functional',
    area: 'Analysis & Visualization',
    category: 'Supply Chain Analytics',
    text: 'How is supply chain analytics (lead time, supplier OTIF, procurement spend) visualised?',
    options: [
      { text: 'Not tracked or visualised', score: 1 },
      { text: 'Excel summary prepared by purchase manager', score: 2 },
      { text: 'Monthly spend analysis report in Excel', score: 3 },
      { text: 'ERP procurement analytics dashboard', score: 4 },
      { text: 'End-to-end supply chain visibility platform with multi-tier analytics', score: 5 },
      { text: 'N/A', isNA: true }
    ]
  },
  {
    id: 612,
    type: 'functional',
    area: 'Analysis & Visualization',
    category: 'Data Quality',
    text: 'How is data quality (accuracy, completeness) in reports ensured?',
    options: [
      { text: 'No checks; reports used as-is', score: 1 },
      { text: 'Manager reviews for obvious errors', score: 2 },
      { text: 'Periodic manual data audit', score: 3 },
      { text: 'ERP validation rules prevent incorrect entries', score: 4 },
      { text: 'Automated data quality monitoring with completeness, accuracy and freshness scores', score: 5 },
      { text: 'N/A', isNA: true }
    ]
  },
  {
    id: 613,
    type: 'functional',
    area: 'Analysis & Visualization',
    category: 'External Reporting',
    text: 'How is visualization shared with external stakeholders (bank, buyer, auditor)?',
    options: [
      { text: 'Paper printouts only', score: 1 },
      { text: 'Excel or PDF emailed manually', score: 2 },
      { text: 'Formatted PDF reports with charts prepared on request', score: 3 },
      { text: 'ERP-generated reports with digital signature and export', score: 4 },
      { text: 'Secure stakeholder portal with live access to curated dashboards', score: 5 },
      { text: 'N/A', isNA: true }
    ]
  },
  {
    id: 614,
    type: 'functional',
    area: 'Analysis & Visualization',
    category: 'Data Archival',
    text: 'How is historical data archived and retrieved for analysis?',
    options: [
      { text: 'No archival; data lost when register fills up', score: 1 },
      { text: 'Physical files stored in cupboard', score: 2 },
      { text: 'Excel files stored in shared drive by year', score: 3 },
      { text: 'ERP database with multi-year history and export capability', score: 4 },
      { text: 'Cloud data warehouse with long-term retention, instant query and compliance archival', score: 5 },
      { text: 'N/A', isNA: true }
    ]
  },
  {
    id: 615,
    type: 'functional',
    area: 'Analysis & Visualization',
    category: 'Alerts & Notifications',
    text: 'How are alerts and notifications configured to inform managers of KPI breaches?',
    options: [
      { text: 'No alerts; manager checks when they remember', score: 1 },
      { text: 'Operator/supervisor informs verbally', score: 2 },
      { text: 'Email alerts set up for critical events', score: 3 },
      { text: 'ERP/BI rule-based alerts via email/SMS', score: 4 },
      { text: 'AI-driven predictive alerts on mobile/WhatsApp with suggested action before KPI is breached', score: 5 },
      { text: 'N/A', isNA: true }
    ]
  }
];
