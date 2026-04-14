export const RAW_MATERIAL_INWARDING_QUESTIONS = [
  {
    id: 101,
    type: 'functional',
    area: 'Raw Material Inwarding',
    category: 'Inwarding Process',
    text: 'How is raw material receiving (inwarding) currently documented?',
    options: [
      { text: 'No records; verbal confirmation only', score: 1 },
      { text: 'Manual gate entry register maintained', score: 2 },
      { text: 'Excel-based GRN (Goods Receipt Note) created per consignment', score: 3 },
      { text: 'ERP-based GRN raised automatically on receipt', score: 4 },
      { text: 'Digital gate-in system with barcode scan, auto-GRN and supplier portal update', score: 5 },
      { text: 'N/A', isNA: true }
    ]
  },
  {
    id: 102,
    type: 'functional',
    area: 'Raw Material Inwarding',
    category: 'Verification & Traceability',
    text: 'How is the identity of incoming raw material verified against the purchase order?',
    options: [
      { text: 'No verification; material accepted as delivered', score: 1 },
      { text: 'Visual inspection by store keeper against paper PO', score: 2 },
      { text: 'Checklist-based verification with manual sign-off', score: 3 },
      { text: 'System-based PO matching with quantity and grade check', score: 4 },
      { text: 'Automated PO-to-GRN reconciliation with supplier certificate upload', score: 5 },
      { text: 'N/A', isNA: true }
    ]
  },
  {
    id: 103,
    type: 'functional',
    area: 'Raw Material Inwarding',
    category: 'Quantity Verification',
    text: 'How is quantity measurement and weighing of incoming material handled?',
    options: [
      { text: "No weighing; quantity accepted per supplier's bill", score: 1 },
      { text: 'Manual weighing with physical scales; entered in register', score: 2 },
      { text: 'Digital weighbridge with print-out; data entered manually in ERP', score: 3 },
      { text: 'Weighbridge integrated with ERP for automatic GRN quantity', score: 4 },
      { text: 'IoT-enabled weighbridge with real-time data feed, auto-alerts for short receipt', score: 5 },
      { text: 'N/A', isNA: true }
    ]
  },
  {
    id: 104,
    type: 'functional',
    area: 'Raw Material Inwarding',
    category: 'Inward Quality Check',
    text: 'How is incoming material quality checked at the time of receipt?',
    options: [
      { text: 'No QC at receipt; quality checked only after processing', score: 1 },
      { text: 'Visual check by store keeper; rejected if obviously defective', score: 2 },
      { text: 'Formal sampling/testing done with paper-based QC report', score: 3 },
      { text: 'Digital QC report linked to GRN; quarantine flag raised for rejects', score: 4 },
      { text: 'Statistical sampling with digital CAPA trigger; supplier scorecard updated automatically', score: 5 },
      { text: 'N/A', isNA: true }
    ]
  },
  {
    id: 105,
    type: 'functional',
    area: 'Raw Material Inwarding',
    category: 'Document Management',
    text: 'How are supplier test certificates / COA (Certificate of Analysis) managed?',
    options: [
      { text: 'Not collected or not reviewed', score: 1 },
      { text: 'Collected in physical file but not linked to material lot', score: 2 },
      { text: 'Scanned and saved in shared folder manually', score: 3 },
      { text: 'Uploaded in ERP/QMS against each GRN', score: 4 },
      { text: 'Automated COA extraction with parameter validation against specs', score: 5 },
      { text: 'N/A', isNA: true }
    ]
  },
  {
    id: 106,
    type: 'functional',
    area: 'Raw Material Inwarding',
    category: 'Non-Conformance Management',
    text: 'How is non-conforming or rejected incoming material handled?',
    options: [
      { text: 'Sent back verbally or mixed with accepted stock', score: 1 },
      { text: 'Physically segregated but no formal record', score: 2 },
      { text: 'Manual rejection note raised and filed', score: 3 },
      { text: 'Digital NCMR raised in ERP; return or rework decision tracked', score: 4 },
      { text: 'Automated rejection workflow with supplier debit note and corrective action loop', score: 5 },
      { text: 'N/A', isNA: true }
    ]
  },
  {
    id: 107,
    type: 'functional',
    area: 'Raw Material Inwarding',
    category: 'Material Identification',
    text: 'How is material labelling and identification done at inwarding?',
    options: [
      { text: 'No labelling; identified by location', score: 1 },
      { text: 'Manual handwritten tags', score: 2 },
      { text: 'Printed labels with basic info (name, date, quantity)', score: 3 },
      { text: 'Barcode labels generated from ERP at GRN', score: 4 },
      { text: 'QR/RFID labels with full traceability to supplier batch and test results', score: 5 },
      { text: 'N/A', isNA: true }
    ]
  },
  {
    id: 108,
    type: 'functional',
    area: 'Raw Material Inwarding',
    category: 'Material Movement',
    text: 'How is the unloading and material movement from gate to store tracked?',
    options: [
      { text: 'No tracking; unloading team handles informally', score: 1 },
      { text: 'Manual tallying by store keeper', score: 2 },
      { text: 'Material movement slip raised manually', score: 3 },
      { text: 'ERP material transfer document created on movement', score: 4 },
      { text: 'Digital MHE (material handling equipment) log with GPS or RFID tracking', score: 5 },
      { text: 'N/A', isNA: true }
    ]
  },
  {
    id: 109,
    type: 'functional',
    area: 'Raw Material Inwarding',
    category: 'Supplier Performance',
    text: 'How is supplier performance on delivery compliance tracked?',
    options: [
      { text: 'Not tracked', score: 1 },
      { text: 'Informal notes on late deliveries', score: 2 },
      { text: 'Manual delivery performance log updated monthly', score: 3 },
      { text: 'ERP-based on-time delivery % and short-delivery reporting', score: 4 },
      { text: 'Automated supplier scorecard with delivery, quality and lead-time KPIs', score: 5 },
      { text: 'N/A', isNA: true }
    ]
  },
  {
    id: 110,
    type: 'functional',
    area: 'Raw Material Inwarding',
    category: 'Inwarding Planning',
    text: 'How are advance shipping notifications (ASN) or dispatch alerts managed?',
    options: [
      { text: 'No advance notice; surprises at gate', score: 1 },
      { text: 'Phone or WhatsApp intimation only', score: 2 },
      { text: 'Email with challan details before arrival', score: 3 },
      { text: 'Supplier portal with ASN creation before dispatch', score: 4 },
      { text: 'EDI/API-based real-time dispatch notification with material details', score: 5 },
      { text: 'N/A', isNA: true }
    ]
  },
  {
    id: 111,
    type: 'functional',
    area: 'Raw Material Inwarding',
    category: 'Shortage Escalation',
    text: 'How are material shortages at inwarding escalated to procurement?',
    options: [
      { text: 'Not escalated; handled by store keeper alone', score: 1 },
      { text: 'Phone call to purchase team', score: 2 },
      { text: 'Email raised with shortage details', score: 3 },
      { text: 'ERP-generated alert to procurement on GRN shortfall', score: 4 },
      { text: 'Automated replenishment trigger sent to approved supplier based on shortage logic', score: 5 },
      { text: 'N/A', isNA: true }
    ]
  },
  {
    id: 112,
    type: 'functional',
    area: 'Raw Material Inwarding',
    category: 'Compliance & Safety',
    text: 'How is hazardous or restricted material identified and segregated at inwarding?',
    options: [
      { text: 'No special process; treated as regular material', score: 1 },
      { text: 'Store keeper uses experience/judgment', score: 2 },
      { text: 'Material safety data sheet (MSDS) checked manually', score: 3 },
      { text: 'MSDS linked to material master in ERP; special handling instructions displayed', score: 4 },
      { text: 'Digital safety workflow with mandatory MSDS review, PPE checklist, and CPCB/regulation compliance check', score: 5 },
      { text: 'N/A', isNA: true }
    ]
  },
  {
    id: 113,
    type: 'functional',
    area: 'Raw Material Inwarding',
    category: 'Analytics & Integration',
    text: 'How is inwarding data used for production planning or demand forecasting?',
    options: [
      { text: 'No connection between inwarding and production planning', score: 1 },
      { text: 'Production team manually checks what has arrived', score: 2 },
      { text: 'Daily GRN summary shared via Excel with planning team', score: 3 },
      { text: 'ERP auto-updates inventory; planning module considers inward stock', score: 4 },
      { text: 'Real-time inventory feed from GRN drives MRP and production scheduling automatically', score: 5 },
      { text: 'N/A', isNA: true }
    ]
  },
  {
    id: 114,
    type: 'functional',
    area: 'Raw Material Inwarding',
    category: 'Process Efficiency',
    text: 'How is inwarding cycle time (gate to bin) measured and improved?',
    options: [
      { text: 'Not measured', score: 1 },
      { text: 'Supervisor estimates informally', score: 2 },
      { text: 'Manual time log at key steps', score: 3 },
      { text: 'ERP timestamps at GRN, QC release and bin storage', score: 4 },
      { text: 'Digital process time analysis with bottleneck alerts and continuous improvement dashboard', score: 5 },
      { text: 'N/A', isNA: true }
    ]
  },
  {
    id: 115,
    type: 'functional',
    area: 'Raw Material Inwarding',
    category: 'Condition Monitoring',
    text: 'How is temperature or condition-sensitive material monitored during inwarding and initial storage?',
    options: [
      { text: 'No special monitoring', score: 1 },
      { text: 'Visual inspection only at receipt', score: 2 },
      { text: 'Manual temperature recording at receipt', score: 3 },
      { text: 'Digital data-logger checked at inward; result logged in QMS', score: 4 },
      { text: 'IoT temperature sensor on vehicle/container with automated acceptance/rejection trigger', score: 5 },
      { text: 'N/A', isNA: true }
    ]
  }
];
