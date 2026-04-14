const pad = (n) => String(n).padStart(2, "0");

export const getSectorPrefix = (sectorCode) => {
  const code = String(sectorCode || "").trim();
  if (!code) return "S";
  const parts = code.split(/[^a-zA-Z0-9]+/).filter(Boolean);
  const acronym = parts.map((p) => p[0]).join("").toUpperCase();
  return `S${acronym || code[0]?.toUpperCase?.() || ""}`;
};

const deepClone = (obj) => JSON.parse(JSON.stringify(obj));

export const canonicalizeCatalog = ({ category, sectorCode, definition }) => {
  const src = Array.isArray(definition) ? definition : [];
  const nodes = deepClone(src);

  const prefix =
    category === "basic"
      ? "B"
      : category === "functional"
        ? "F"
        : getSectorPrefix(sectorCode);

  let counter = 1;

  const walk = (arr, { rootIndexProvider } = {}) =>
    (arr || []).map((node, idx) => {
      const next = { ...node, id: `${prefix}${pad(counter++)}` };

      const rootIndex = typeof rootIndexProvider === "function" ? rootIndexProvider() : null;
      if (category === "basic" && typeof rootIndex === "number" && rootIndex < 8) {
        next.excludeFromScoring = true;
      }

      if (Array.isArray(next.children) && next.children.length > 0) {
        next.children = walk(next.children);
      }
      return next;
    });

  if (category === "basic") {
    return nodes.map((root, rootIdx) => {
      const mapped = walk([root], { rootIndexProvider: () => rootIdx })[0];
      return mapped;
    });
  }

  return walk(nodes);
};

