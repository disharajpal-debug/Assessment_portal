export const LOGISTICS_QUESTIONS = [
  {
    id: 501,
    type: 'functional',
    area: 'Logistics',
    category: 'Stock Availability',
    text: 'How is stock availability checked before confirming a customer order?',
    options: [
      { text: 'Not checked; orders committed without stock verification', score: 1 },
      { text: 'Store keeper manually checks physically', score: 2 },
      { text: 'Excel inventory checked by sales/planning team', score: 3 },
      { text: 'ERP available-to-promise (ATP) check done before order confirmation', score: 4 },
      { text: 'Real-time ATP with reservation logic, pending orders and production schedule considered', score: 5 },
      { text: 'N/A', isNA: true }
    ]
  },
  {
    id: 502,
    type: 'functional',
    area: 'Logistics',
    category: 'BOM Management',
    text: 'How is the Bill of Materials (BOM) created and maintained?',
    options: [
      { text: 'No formal BOM; quantities estimated by production', score: 1 },
      { text: 'Manual BOM in paper or simple list', score: 2 },
      { text: 'Excel-based BOM maintained per product', score: 3 },
      { text: 'ERP BOM with multi-level structure and version control', score: 4 },
      { text: 'Engineering BOM (EBOM) integrated with manufacturing BOM (MBOM) in PLM/ERP; auto-updated on ECN', score: 5 },
      { text: 'N/A', isNA: true }
    ]
  },
  {
    id: 503,
    type: 'functional',
    area: 'Logistics',
    category: 'MRP Execution',
    text: 'How is Material Requirements Planning (MRP) run to determine procurement needs?',
    options: [
      { text: 'No MRP; purchases made on gut feel', score: 1 },
      { text: 'Buyer manually calculates requirements from sales plan', score: 2 },
      { text: 'Excel-based MRP run monthly', score: 3 },
      { text: 'ERP MRP run regularly with reorder levels and lead times', score: 4 },
      { text: 'Dynamic MRP with real-time demand signals, supplier lead time and safety stock optimisation', score: 5 },
      { text: 'N/A', isNA: true }
    ]
  },
  {
    id: 504,
    type: 'functional',
    area: 'Logistics',
    category: 'Dispatch Planning',
    text: 'How is the dispatch schedule created and communicated to the logistics team?',
    options: [
      { text: 'Verbal instructions on the day of dispatch', score: 1 },
      { text: 'Daily dispatch list written on whiteboard', score: 2 },
      { text: 'Excel dispatch plan shared via WhatsApp/email', score: 3 },
      { text: 'ERP delivery schedule generated from sales orders', score: 4 },
      { text: 'Integrated logistics module with carrier booking, route optimisation and customer notification', score: 5 },
      { text: 'N/A', isNA: true }
    ]
  },
  {
    id: 505,
    type: 'functional',
    area: 'Logistics',
    category: 'Procurement Tracking',
    text: 'How is the inwarding/receiving process for purchased goods tracked in the supply chain?',
    options: [
      { text: 'No tracking; supplier delivers when convenient', score: 1 },
      { text: 'Purchase team follows up by phone', score: 2 },
      { text: 'Excel PO tracker with expected and actual dates', score: 3 },
      { text: 'ERP PO tracking with supplier acknowledgement and delivery status', score: 4 },
      { text: 'Supplier portal with real-time dispatch tracking, ASN and exception alerts', score: 5 },
      { text: 'N/A', isNA: true }
    ]
  },
  {
    id: 506,
    type: 'functional',
    area: 'Logistics',
    category: 'Freight Cost Management',
    text: 'How is freight and logistics cost tracked and optimised?',
    options: [
      { text: 'Not tracked; paid as billed', score: 1 },
      { text: 'Bills checked manually and entered in accounts', score: 2 },
      { text: 'Excel tracker with freight cost per shipment', score: 3 },
      { text: 'ERP freight module with cost allocation to orders', score: 4 },
      { text: 'AI-powered logistics spend analytics with carrier comparison, route cost and mode optimisation', score: 5 },
      { text: 'N/A', isNA: true }
    ]
  },
  {
    id: 507,
    type: 'functional',
    area: 'Logistics',
    category: 'Outbound Tracking',
    text: 'How are outbound shipments tracked after they leave the factory?',
    options: [
      { text: 'No tracking; customer informed only when delivery is expected', score: 1 },
      { text: 'Transporter is called for status updates', score: 2 },
      { text: 'Courier/transporter tracking number shared with customer', score: 3 },
      { text: 'Integrated logistics portal with real-time shipment visibility', score: 4 },
      { text: 'GPS-enabled vehicle tracking with live ETA, geofence alerts and customer self-service portal', score: 5 },
      { text: 'N/A', isNA: true }
    ]
  },
  {
    id: 508,
    type: 'functional',
    area: 'Logistics',
    category: 'Returns Logistics',
    text: 'How is reverse logistics (returns, rejections from customers) managed?',
    options: [
      { text: 'No formal process; ad hoc handling', score: 1 },
      { text: 'Driver brings back rejected goods; handled informally', score: 2 },
      { text: 'Manual return note raised; goods stored in separate area', score: 3 },
      { text: 'ERP return order process with credit note and stock reinstatement', score: 4 },
      { text: 'Digital returns portal with reason capture, inspection workflow and supplier/customer debit automation', score: 5 },
      { text: 'N/A', isNA: true }
    ]
  },
  {
    id: 509,
    type: 'functional',
    area: 'Logistics',
    category: 'Load Planning',
    text: 'How is multi-customer or multi-destination despatch consolidated and planned?',
    options: [
      { text: 'Single customer per vehicle; no consolidation', score: 1 },
      { text: 'Informal bundling based on direction', score: 2 },
      { text: 'Manual loading plan prepared by dispatch team', score: 3 },
      { text: 'ERP vehicle loading list based on delivery routes', score: 4 },
      { text: 'AI-driven load planning with weight, volume, delivery window and route optimisation', score: 5 },
      { text: 'N/A', isNA: true }
    ]
  },
  {
    id: 510,
    type: 'functional',
    area: 'Logistics',
    category: 'Document Accuracy',
    text: 'How is the accuracy of dispatch documentation (invoice, e-way bill, packing list) ensured?',
    options: [
      { text: 'Manual documents with frequent errors', score: 1 },
      { text: 'Accounts team checks before dispatch', score: 2 },
      { text: 'Checklist used before loading', score: 3 },
      { text: 'ERP auto-generates all dispatch documents from sales order', score: 4 },
      { text: 'Digital document validation with auto e-way bill generation via GST API and customer portal sharing', score: 5 },
      { text: 'N/A', isNA: true }
    ]
  },
  {
    id: 511,
    type: 'functional',
    area: 'Logistics',
    category: 'FG Warehouse',
    text: 'How is finished goods warehouse space and outbound readiness managed?',
    options: [
      { text: 'No defined FG storage; goods kept anywhere', score: 1 },
      { text: 'Separate area marked; no formal location management', score: 2 },
      { text: 'Manual FG register with location', score: 3 },
      { text: 'WMS with FG bin locations and pick lists', score: 4 },
      { text: 'Real-time FG slotting with FIFO enforcement and dispatch staging zone management', score: 5 },
      { text: 'N/A', isNA: true }
    ]
  },
  {
    id: 512,
    type: 'functional',
    area: 'Logistics',
    category: 'Trade Compliance',
    text: 'How is import/export compliance and customs documentation managed?',
    options: [
      { text: 'Not applicable or handled entirely by CHA with no visibility', score: 1 },
      { text: 'Physical file maintained by accounts for each shipment', score: 2 },
      { text: 'Excel tracker for import/export shipments', score: 3 },
      { text: 'ERP import/export module with duty calculation and compliance checklist', score: 4 },
      { text: 'Automated trade compliance platform with HS code validation, duty drawback tracking and regulatory alerts', score: 5 },
      { text: 'N/A', isNA: true }
    ]
  },
  {
    id: 513,
    type: 'functional',
    area: 'Logistics',
    category: 'Demand Processing',
    text: 'How is demand signal from customers (purchase orders, forecasts) received and processed?',
    options: [
      { text: 'Phone and email only; manually entered later', score: 1 },
      { text: 'Email PO received; manually keyed into system', score: 2 },
      { text: 'Standard PO template received; data entry semi-automated', score: 3 },
      { text: 'EDI or customer portal integration for auto-order receipt', score: 4 },
      { text: 'API-based real-time customer demand integration with auto-ATP and confirmation', score: 5 },
      { text: 'N/A', isNA: true }
    ]
  },
  {
    id: 514,
    type: 'functional',
    area: 'Logistics',
    category: 'In-Transit Inventory',
    text: 'How is in-transit inventory (goods sent to job workers or between plants) tracked?',
    options: [
      { text: 'Not tracked; relies on verbal confirmation', score: 1 },
      { text: 'Challan copy maintained; no system update', score: 2 },
      { text: 'Excel tracker for material out on job work', score: 3 },
      { text: 'ERP subcontracting or stock transfer order tracks in-transit material', score: 4 },
      { text: 'Real-time in-transit visibility with QR-coded consignments and automated return scheduling', score: 5 },
      { text: 'N/A', isNA: true }
    ]
  },
  {
    id: 515,
    type: 'functional',
    area: 'Logistics',
    category: 'Logistics Analytics',
    text: 'How is key logistics KPI (OTIF, fill rate, freight cost/unit) measured and reported?',
    options: [
      { text: 'No logistics KPIs measured', score: 1 },
      { text: 'OTIF estimated informally by sales team', score: 2 },
      { text: 'Monthly Excel report on key logistics metrics', score: 3 },
      { text: 'ERP-based logistics dashboard reviewed weekly', score: 4 },
      { text: 'Real-time logistics performance tower with OTIF, fill rate, cost/unit and carrier benchmarking', score: 5 },
      { text: 'N/A', isNA: true }
    ]
  }
];
