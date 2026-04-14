import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

import * as esbuild from "esbuild";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

function requireFromString(code) {
  // eslint-disable-next-line no-new-func
  const fn = new Function("module", "exports", "require", code);
  const mod = { exports: {} };
  fn(mod, mod.exports, () => {
    throw new Error("require() not supported in bundle");
  });
  return mod.exports;
}

async function main() {
  const repoRoot = path.resolve(__dirname, "..");
  const srcRoot = path.join(repoRoot, "src");

  const entry = `
    import { BASIC_QUESTIONS } from ${JSON.stringify(
      path.join(srcRoot, "pages", "Assessment", "questions", "basicQuestions.js"),
    )};
    import { FUNCTIONAL_QUESTIONS } from ${JSON.stringify(
      path.join(srcRoot, "pages", "Assessment", "questions", "functionalQuestions", "index.js"),
    )};
    import { canonicalizeCatalog } from ${JSON.stringify(
      path.join(srcRoot, "pages", "Assessment", "questions", "idCanonicalizer.js"),
    )};

    import { TEXTILE_QUESTIONS } from ${JSON.stringify(
      path.join(srcRoot, "pages", "Assessment", "questions", "sectorQuestions", "textile.js"),
    )};
    import { PHARMA_QUESTIONS } from ${JSON.stringify(
      path.join(srcRoot, "pages", "Assessment", "questions", "sectorQuestions", "pharmaceutical.js"),
    )};
    import { CHEMICALS_QUESTIONS } from ${JSON.stringify(
      path.join(srcRoot, "pages", "Assessment", "questions", "sectorQuestions", "chemicals.js"),
    )};
    import { WIRE_CABLE_QUESTIONS } from ${JSON.stringify(
      path.join(srcRoot, "pages", "Assessment", "questions", "sectorQuestions", "wireCable.js"),
    )};
    import { ENGINEERING_GOODS_QUESTIONS } from ${JSON.stringify(
      path.join(srcRoot, "pages", "Assessment", "questions", "sectorQuestions", "engineeringGoods.js"),
    )};
    import { PLASTIC_PACKAGING_QUESTIONS } from ${JSON.stringify(
      path.join(srcRoot, "pages", "Assessment", "questions", "sectorQuestions", "plasticPackaging.js"),
    )};

    export const catalogs = {
      basic: canonicalizeCatalog({ category: "basic", sectorCode: null, definition: BASIC_QUESTIONS }),
      functional: canonicalizeCatalog({ category: "functional", sectorCode: null, definition: FUNCTIONAL_QUESTIONS }),
      sector: {
        textile: canonicalizeCatalog({ category: "sector", sectorCode: "textile", definition: TEXTILE_QUESTIONS }),
        pharmaceutical: canonicalizeCatalog({ category: "sector", sectorCode: "pharmaceutical", definition: PHARMA_QUESTIONS }),
        chemicals: canonicalizeCatalog({ category: "sector", sectorCode: "chemicals", definition: CHEMICALS_QUESTIONS }),
        wire_cable: canonicalizeCatalog({ category: "sector", sectorCode: "wire_cable", definition: WIRE_CABLE_QUESTIONS }),
        engineering_goods: canonicalizeCatalog({ category: "sector", sectorCode: "engineering_goods", definition: ENGINEERING_GOODS_QUESTIONS }),
        plastic_packaging: canonicalizeCatalog({ category: "sector", sectorCode: "plastic_packaging", definition: PLASTIC_PACKAGING_QUESTIONS })
      }
    };
  `;

  const result = await esbuild.build({
    stdin: {
      contents: entry,
      loader: "js",
      resolveDir: repoRoot,
      sourcefile: "export-question-catalog.entry.js",
    },
    bundle: true,
    platform: "node",
    format: "cjs",
    write: false,
    logLevel: "silent",
  });

  const bundled = result.outputFiles[0].text;
  const exports = requireFromString(bundled);

  const out = {
    generatedAt: new Date().toISOString(),
    catalogs: exports.catalogs,
  };

  const outPath =
    process.argv[2] ||
    path.join(repoRoot, "..", "backend", "assessment", "seed", "question_catalog.json");

  fs.mkdirSync(path.dirname(outPath), { recursive: true });
  fs.writeFileSync(outPath, JSON.stringify(out, null, 2), "utf8");

  // eslint-disable-next-line no-console
  console.log(`Wrote ${outPath}`);
  // eslint-disable-next-line no-console
  console.log(
    `basic: ${out.catalogs.basic.length}, functional: ${out.catalogs.functional.length}, sector: ${Object.keys(out.catalogs.sector).length}`,
  );
}

main().catch((err) => {
  // eslint-disable-next-line no-console
  console.error(err);
  process.exit(1);
});

