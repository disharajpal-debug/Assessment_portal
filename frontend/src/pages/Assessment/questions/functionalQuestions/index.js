import { RAW_MATERIAL_INWARDING_QUESTIONS } from './rawMaterialInwarding';
import { WAREHOUSING_QUESTIONS } from './warehousing';
import { PRODUCTION_QUESTIONS } from './production';
import { QUALITY_QUESTIONS } from './quality';
import { LOGISTICS_QUESTIONS } from './logistics';
import { ANALYSIS_VISUALIZATION_QUESTIONS } from './analysisVisualization';
import { ENERGY_MONITORING_QUESTIONS } from './energyMonitoring';

export const FUNCTIONAL_QUESTIONS = [
  ...RAW_MATERIAL_INWARDING_QUESTIONS,
  ...WAREHOUSING_QUESTIONS,
  ...PRODUCTION_QUESTIONS,
  ...QUALITY_QUESTIONS,
  ...LOGISTICS_QUESTIONS,
  ...ANALYSIS_VISUALIZATION_QUESTIONS,
  ...ENERGY_MONITORING_QUESTIONS,
];
