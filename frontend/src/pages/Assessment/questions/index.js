import { BASIC_QUESTIONS } from './basicQuestions';
import { FUNCTIONAL_QUESTIONS } from './functionalQuestions';

import { TEXTILE_QUESTIONS } from './sectorQuestions/textile';
import { PHARMA_QUESTIONS } from './sectorQuestions/pharmaceutical';
import { CHEMICALS_QUESTIONS } from './sectorQuestions/chemicals';
import { WIRE_CABLE_QUESTIONS } from './sectorQuestions/wireCable';
import { ENGINEERING_GOODS_QUESTIONS } from './sectorQuestions/engineeringGoods';
import { PLASTIC_PACKAGING_QUESTIONS } from './sectorQuestions/plasticPackaging';

import { canonicalizeCatalog } from "./idCanonicalizer";

export const getAllQuestions = (sector) => {
  let sectorQuestions = [];

  switch (sector) {
    case 'textile':
      sectorQuestions = TEXTILE_QUESTIONS;
      break;
    case 'pharmaceutical':
      sectorQuestions = PHARMA_QUESTIONS;
      break;
    case 'chemicals':
      sectorQuestions = CHEMICALS_QUESTIONS;
      break;
    case 'wire_cable':
      sectorQuestions = WIRE_CABLE_QUESTIONS;
      break;
    case 'engineering_goods':
      sectorQuestions = ENGINEERING_GOODS_QUESTIONS;
      break;
    case 'plastic_packaging':
      sectorQuestions = PLASTIC_PACKAGING_QUESTIONS;
      break;
    default:
      sectorQuestions = [];
  }

  const basic = canonicalizeCatalog({
    category: "basic",
    sectorCode: null,
    definition: BASIC_QUESTIONS,
  });
  const functional = canonicalizeCatalog({
    category: "functional",
    sectorCode: null,
    definition: FUNCTIONAL_QUESTIONS,
  });
  const sectorCanon = canonicalizeCatalog({
    category: "sector",
    sectorCode: sector,
    definition: sectorQuestions,
  });

  return [...basic, ...functional, ...sectorCanon];
};
