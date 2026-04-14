export const badgeClass = (status) => {
  const v = String(status || "").toLowerCase();
  if (v === "submitted" || v === "completed") return "bg-emerald-100 text-emerald-700 border-emerald-200";
  if (v === "draft" || v === "pending") return "bg-amber-100 text-amber-700 border-amber-200";
  if (v === "inactive" || v === "disabled") return "bg-slate-100 text-slate-700 border-slate-200";
  return "bg-indigo-100 text-indigo-700 border-indigo-200";
};

export const formatDate = (iso) => {
  if (!iso) return "—";
  try {
    return new Date(iso).toLocaleString();
  } catch {
    return String(iso);
  }
};

