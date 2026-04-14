export const TEXTILE_QUESTIONS = [
  {
    id: 13,
    type: 'sector',
    sector: 'textile',
    category: 'Production',
    text: 'How is fabric/yarn consumption and wastage tracked on the shop floor?',
    options: [
      { text: 'No tracking; wastage estimated at month end', score: 1 },
      { text: 'Manual register maintained by store keeper', score: 2 },
      { text: 'Excel-based daily consumption sheet', score: 3 },
      { text: 'Digital shop-floor system with batch-wise material tracking', score: 4 },
      { text: 'Automated material flow tracking integrated with loom/machine sensors', score: 5 },
      { text: 'N/A', isNA: true }
    ]
  },
  {
    id: 14,
    type: 'sector',
    sector: 'textile',
    category: 'Production',
    text: 'What level of automation exists in your weaving/stitching/processing operations?',
    options: [
      { text: 'Fully manual operations', score: 1 },
      { text: 'Semi-automatic machines with no digital controls', score: 2 },
      { text: 'CNC/programmable machines with manual data entry', score: 3 },
      { text: 'Machines connected to a central monitoring system', score: 4 },
      { text: 'Smart looms/machines with IoT sensors and predictive maintenance', score: 5 },
      { text: 'N/A', isNA: true }
    ]
  },
  {
    id: 15,
    type: 'sector',
    sector: 'textile',
    category: 'Quality',
    text: 'How is fabric/product quality grading and defect tracking done?',
    options: [
      { text: 'Visual inspection by workers with no documentation', score: 1 },
      { text: 'Manual defect log maintained on paper', score: 2 },
      { text: 'Standardized defect classification on Excel', score: 3 },
      { text: 'Digital QMS with defect codes, photos, and trend reports', score: 4 },
      { text: 'AI-based automated defect detection using camera/vision systems', score: 5 },
      { text: 'N/A', isNA: true }
    ]
  },
  {
    id: 16,
    type: 'sector',
    sector: 'textile',
    category: 'Design',
    text: 'How are new fabric designs/patterns developed and managed?',
    options: [
      { text: 'Designs created manually on paper or by memory', score: 1 },
      { text: 'Basic design tools (MS Paint, manual sketches)', score: 2 },
      { text: 'CAD software for design (e.g., Nedgraphics, ScotWeave)', score: 3 },
      { text: 'Digital design library with version control and client sharing', score: 4 },
      { text: 'AI-assisted design tools with trend analysis and 3D simulation', score: 5 },
      { text: 'N/A', isNA: true }
    ]
  },
  {
    id: 17,
    type: 'sector',
    sector: 'textile',
    category: 'Compliance',
    text: 'How are compliance certifications (OEKO-TEX, GOTS, BIS) managed?',
    options: [
      { text: 'No certifications; not aware of requirements', score: 1 },
      { text: 'Aware of certifications but not pursuing', score: 2 },
      { text: 'Manual documentation for certification compliance', score: 3 },
      { text: 'Digital document management for audit readiness', score: 4 },
      { text: 'Automated compliance tracking integrated with production data', score: 5 },
      { text: 'N/A', isNA: true }
    ]
  },
  {
    id: 18,
    type: 'sector',
    sector: 'textile',
    category: 'Logistics',
    text: 'How are dyeing/finishing job works and subcontractor processes tracked?',
    options: [
      { text: 'No tracking; dependent on verbal confirmation', score: 1 },
      { text: 'Paper-based job card system', score: 2 },
      { text: 'Excel tracker for job works sent/received', score: 3 },
      { text: 'Software-based job work management with status tracking', score: 4 },
      { text: 'Real-time visibility with digital twin of the job work process', score: 5 },
      { text: 'N/A', isNA: true }
    ]
  },
  {
    id: 19,
    type: 'sector',
    sector: 'textile',
    category: 'Sales',
    text: 'How do you manage seasonal demand fluctuations and buyer forecasts?',
    options: [
      { text: 'No planning; produce based on current orders only', score: 1 },
      { text: 'Experience-based seasonal estimation', score: 2 },
      { text: 'Excel-based demand tracker with buyer communication', score: 3 },
      { text: 'Demand planning module linked to buyer orders', score: 4 },
      { text: 'AI-driven demand forecasting with real-time buyer data integration', score: 5 },
      { text: 'N/A', isNA: true }
    ]
  },
  {
    id: 20,
    type: 'sector',
    sector: 'textile',
    category: 'Sustainability',
    text: 'How is energy and water consumption tracked in your textile operations?',
    options: [
      { text: 'Not tracked at all', score: 1 },
      { text: 'Utility bills reviewed monthly but not benchmarked', score: 2 },
      { text: 'Manual logs for energy/water usage per shift', score: 3 },
      { text: 'Digital energy monitoring system with consumption reports', score: 4 },
      { text: 'Automated IoT-based energy & water management with sustainability dashboard', score: 5 },
      { text: 'N/A', isNA: true }
    ]
  },
];
