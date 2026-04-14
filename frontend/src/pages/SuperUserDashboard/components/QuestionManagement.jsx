import React, { useEffect, useMemo, useState } from "react";
import { Search, Plus, Edit2, Trash2, ListTree, Save, X } from 'lucide-react';
import { getQuestionTypeColor } from '../SuperUserDashboard.utilities';

import { superuserService } from "../../../services/superuserService";

const QuestionManagement = () => {
  const [category, setCategory] = useState("basic"); // basic | functional | sector
  const [sectorCode, setSectorCode] = useState("");
  const [sectors, setSectors] = useState([]);
  const [functionalArea, setFunctionalArea] = useState("all");

  const [definition, setDefinition] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const [searchTerm, setSearchTerm] = useState("");

  const [modalOpen, setModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState("add-root"); // add-root | add-child | edit
  const [targetParentId, setTargetParentId] = useState(null);
  const [editingNodeId, setEditingNodeId] = useState(null);

  const getNextId = (nodes) => {
    let max = 0;
    const walk = (arr) => {
      (arr || []).forEach((n) => {
        const idStr = String(n?.id || "");
        const match = idStr.match(/(\d+)$/);
        if (match) {
          const nNum = Number(match[1]);
          if (Number.isFinite(nNum)) max = Math.max(max, nNum);
        }
        walk(n.children || []);
      });
    };
    walk(nodes);
    return max + 1;
  };

  const emptyOption = { text: "", score: 1, isNA: false };
  const [nodeDraft, setNodeDraft] = useState({
    id: "B01",
    text: "",
    area: "",
    sector: "",
    options: [emptyOption],
  });

  const getIdPrefix = () => {
    if (category === "basic") return "B";
    if (category === "functional") return "F";
    const parts = String(sectorCode || "")
      .split(/[^a-zA-Z0-9]+/)
      .filter(Boolean);
    const acronym = parts.map((p) => p[0]).join("").toUpperCase();
    return `S${acronym || "X"}`;
  };

  const formatNextId = (nextNum) => `${getIdPrefix()}${String(nextNum).padStart(2, "0")}`;

  const normalizeNodeForCategory = (draft) => {
    if (category === "basic") {
      return { ...draft, type: "basic", area: "", sector: "" };
    }
    if (category === "functional") {
      return { ...draft, type: "functional", sector: "", sector_code: undefined };
    }
    return { ...draft, type: "sector", sector: sectorCode };
  };

  const filterTree = (nodes, q) => {
    if (!q) return nodes;
    const query = q.toLowerCase();
    const matches = (n) => {
      const t = (n?.text || "").toLowerCase();
      const a = (n?.area || "").toLowerCase();
      return t.includes(query) || a.includes(query);
    };
    const walk = (arr) => {
      const out = [];
      (arr || []).forEach((n) => {
        const childFiltered = walk(n.children || []);
        if (matches(n) || childFiltered.length > 0) {
          out.push({ ...n, children: childFiltered });
        }
      });
      return out;
    };
    return walk(nodes);
  };

  const functionalAreas = useMemo(() => {
    if (category !== "functional") return [];
    const set = new Set();
    const walk = (arr) => {
      (arr || []).forEach((n) => {
        if (typeof n?.area === "string" && n.area.trim()) set.add(n.area.trim());
        if (Array.isArray(n.children) && n.children.length > 0) walk(n.children);
      });
    };
    walk(definition);
    return Array.from(set).sort((a, b) => a.localeCompare(b));
  }, [category, definition]);

  const displayDefinition = useMemo(() => {
    const areaFiltered =
      category === "functional" && functionalArea !== "all"
        ? (definition || []).filter((n) => String(n?.area || "").trim() === functionalArea)
        : definition;
    return filterTree(areaFiltered, searchTerm);
  }, [definition, searchTerm, category, functionalArea]);

  const loadSectors = async () => {
    try {
      const res = await superuserService.listSectors();
      const next = Array.isArray(res.data) ? res.data : (res.data?.results || []);
      setSectors(next);
      return next;
    } catch (err) {
      setSectors([]);
      setError(err?.response?.data?.detail || err?.message || "Failed to load sectors.");
      return [];
    }
  };

  const loadCatalog = async () => {
    setLoading(true);
    setError("");
    try {
      const sectorArg = category === "sector" ? sectorCode : null;
      if (category === "sector" && !sectorArg) {
        setDefinition([]);
        setLoading(false);
        return;
      }
      const res = await superuserService.getQuestionCatalog(category, sectorArg);
      setDefinition(res.data?.definition || []);
    } catch (err) {
      setError(err?.response?.data?.detail || err?.message || "Failed to load question catalog.");
      setDefinition([]);
    } finally {
      setLoading(false);
    }
  };

  const openAddRoot = () => {
    const nextId = formatNextId(getNextId(definition));
    setModalMode("add-root");
    setTargetParentId(null);
    setEditingNodeId(null);
    setNodeDraft({
      id: nextId,
      text: "",
      area: category === "functional" ? (functionalArea !== "all" ? functionalArea : "") : "",
      sector: category === "sector" ? sectorCode : "",
      options: [
        {
          text: "",
          score: 1,
          isNA: false,
        },
      ],
    });
    setModalOpen(true);
  };

  const openAddChild = (parentId) => {
    const nextId = formatNextId(getNextId(definition));
    setModalMode("add-child");
    setTargetParentId(parentId);
    setEditingNodeId(null);
    setNodeDraft({
      id: nextId,
      text: "",
      area: category === "functional" ? (functionalArea !== "all" ? functionalArea : "") : "",
      sector: category === "sector" ? sectorCode : "",
      options: [
        {
          text: "",
          score: 1,
          isNA: false,
        },
      ],
    });
    setModalOpen(true);
  };

  const openEdit = (node) => {
    setModalMode("edit");
    setTargetParentId(null);
    setEditingNodeId(node.id);
    setNodeDraft({
      id: node.id,
      text: node.text || "",
      area: node.area || "",
      sector: node.sector || (category === "sector" ? sectorCode : ""),
      options: Array.isArray(node.options) && node.options.length ? node.options : [],
    });
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
    setTargetParentId(null);
    setEditingNodeId(null);
  };

  const addOptionToDraft = () => {
    setNodeDraft((prev) => ({
      ...prev,
      options: [...(prev.options || []), { ...emptyOption }],
    }));
  };

  const updateTreeAddChild = (nodes, parentId, newNode) => {
    const walk = (arr) => {
      return (arr || []).map((n) => {
        if (n.id === parentId) {
          return { ...n, children: [...(n.children || []), newNode] };
        }
        return { ...n, children: walk(n.children || []) };
      });
    };
    return walk(nodes);
  };

  const updateTreeEditNode = (nodes, nodeId, updates) => {
    const walk = (arr) => {
      return (arr || []).map((n) => {
        if (n.id === nodeId) return { ...n, ...updates };
        return { ...n, children: walk(n.children || []) };
      });
    };
    return walk(nodes);
  };

  const updateTreeDeleteNode = (nodes, nodeId) => {
    const walk = (arr) => {
      return (arr || [])
        .filter((n) => n.id !== nodeId)
        .map((n) => ({ ...n, children: walk(n.children || []) }));
    };
    return walk(nodes);
  };

  const handleNodeSaveToTree = () => {
    const options = (nodeDraft.options || [])
      .filter((o) => o && typeof o.text === "string" && o.text.trim() !== "")
      .map((o) => {
        const base = { text: o.text.trim(), isNA: Boolean(o.isNA) };
        if (base.isNA) return base;
        const score = typeof o.score === "number" ? o.score : Number(o.score);
        return { ...base, score: score };
      });

    const newNode = {
      id: String(nodeDraft.id || "").trim(),
      type: category,
      text: nodeDraft.text.trim(),
      area: category === "functional" ? nodeDraft.area.trim() : undefined,
      sector: category === "sector" ? sectorCode : undefined,
      options,
      children: (modalMode === "add-root" || modalMode === "add-child") ? [] : undefined,
    };

    if (!newNode.text) {
      alert("Question text is required.");
      return;
    }

    if (!newNode.id) {
      alert("Question id is required.");
      return;
    }

    if (modalMode === "add-root") {
      setDefinition((prev) => [...prev, { ...newNode, children: [] }]);
      closeModal();
      return;
    }

    if (modalMode === "add-child") {
      if (!targetParentId) {
        alert("Parent id is missing.");
        return;
      }
      setDefinition((prev) => updateTreeAddChild(prev, targetParentId, { ...newNode, children: [] }));
      closeModal();
      return;
    }

    if (modalMode === "edit") {
      setDefinition((prev) =>
        updateTreeEditNode(prev, editingNodeId, {
          text: newNode.text,
          area: newNode.area,
          sector: newNode.sector,
          options: newNode.options,
          // Preserve children on edit.
        }),
      );
      closeModal();
    }
  };

  const handleDeploy = async () => {
    setSaving(true);
    setError("");
    try {
      await superuserService.saveQuestionCatalog({
        category,
        sector_code: category === "sector" ? sectorCode : null,
        definition,
      });
      alert("Question catalog saved.");
      await loadCatalog(); // ensure UI reflects DB source of truth
    } catch (err) {
      alert(err?.response?.data?.detail || err?.message || "Failed to save question catalog.");
      setError(err?.response?.data?.detail || err?.message || "Failed to save question catalog.");
    } finally {
      setSaving(false);
    }
  };

  useEffect(() => {
    loadSectors();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    loadCatalog();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [category, sectorCode]);

  useEffect(() => {
    if (category !== "sector") return;
    if (!sectorCode && sectors.length > 0) setSectorCode(sectors[0].code);
  }, [category, sectorCode, sectors]);

  useEffect(() => {
    if (category !== "functional") return;
    if (functionalArea !== "all") return;
    if (functionalAreas.length > 0) setFunctionalArea(functionalAreas[0]);
  }, [category, functionalArea, functionalAreas]);

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row gap-4 justify-between items-center">
        <div className="flex flex-col md:flex-row gap-4 flex-1 w-full">
          <div className="relative w-full max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              placeholder="Search questions..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-white border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
            />
          </div>

          <div className="flex gap-3 items-center">
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="px-4 py-2 bg-white border border-slate-200 rounded-lg text-sm font-bold text-slate-700 outline-none focus:ring-2 focus:ring-indigo-500/20"
            >
              <option value="basic">Basic</option>
              <option value="functional">Functional</option>
              <option value="sector">Sector</option>
            </select>

            {category === "functional" && (
              <select
                value={functionalArea}
                onChange={(e) => setFunctionalArea(e.target.value)}
                className="px-4 py-2 bg-white border border-slate-200 rounded-lg text-sm font-bold text-slate-700 outline-none focus:ring-2 focus:ring-indigo-500/20"
              >
                <option value="all">All functions</option>
                {functionalAreas.map((a) => (
                  <option key={a} value={a}>
                    {a}
                  </option>
                ))}
              </select>
            )}

            {category === "sector" && (
              <select
                value={sectorCode}
                onChange={(e) => setSectorCode(e.target.value)}
                className="px-4 py-2 bg-white border border-slate-200 rounded-lg text-sm font-bold text-slate-700 outline-none focus:ring-2 focus:ring-indigo-500/20"
              >
                <option value="">Select sector…</option>
                {sectors.map((s) => (
                  <option key={s.code} value={s.code}>
                    {s.name}
                  </option>
                ))}
              </select>
            )}
          </div>
        </div>

        <button onClick={openAddRoot} className="flex items-center justify-center gap-2 px-4 py-2 w-full md:w-auto bg-indigo-600 text-white rounded-lg text-sm font-bold shadow-sm hover:bg-indigo-700 transition-colors shrink-0">
          <Plus className="w-4 h-4" />
          Add Root Question
        </button>
      </div>

      {error && <div className="text-sm text-rose-600 font-semibold bg-rose-50 border border-rose-200 rounded-xl p-3">{error}</div>}

      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="p-4 border-b border-slate-200 flex items-center justify-between gap-4">
          <div className="text-sm font-bold text-slate-900">
            Editing:{" "}
            <span className="text-indigo-700">
              {category.toUpperCase()}
              {category === "sector" ? ` (${sectorCode})` : ""}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={loadCatalog}
              className="px-3 py-1.5 bg-white border border-slate-200 rounded-lg text-sm font-bold text-slate-600 hover:bg-slate-50 transition-colors"
            >
              Reset
            </button>
            <button
              type="button"
              onClick={handleDeploy}
              disabled={saving}
              className="px-3 py-1.5 bg-indigo-600 text-white rounded-lg text-sm font-bold hover:bg-indigo-700 transition-colors shadow-sm disabled:opacity-60"
            >
              {saving ? "Saving..." : "Deploy to Database"}
            </button>
          </div>
        </div>

        <div className="p-4">
          {loading ? (
            <div className="text-center text-slate-500 py-10">Loading question catalog...</div>
          ) : displayDefinition.length === 0 ? (
            <div className="p-12 text-center">
              <ListTree className="w-12 h-12 text-slate-300 mx-auto mb-4" />
              <p className="text-slate-500 font-medium">No questions in this catalog yet.</p>
            </div>
          ) : (
            <div className="space-y-3">
              {displayDefinition.map((n) => (
                <NodeRow key={n.id} node={n} depth={0} />
              ))}
            </div>
          )}
        </div>
      </div>

      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-3xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between p-6 border-b border-slate-100 bg-slate-50/50">
              <h3 className="text-xl font-black text-slate-900">
                {modalMode === "edit"
                  ? "Edit Question"
                  : modalMode === "add-child"
                    ? "Add Child Question"
                    : "Add Root Question"}
              </h3>
              <button onClick={closeModal} className="text-slate-400 hover:text-slate-600 transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 space-y-6">
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  handleNodeSaveToTree();
                }}
                className="space-y-6"
              >
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">Question ID</label>
                    <input
                      type="text"
                      required
                      value={nodeDraft.id}
                      onChange={(e) => setNodeDraft((prev) => ({ ...prev, id: e.target.value }))}
                      className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 font-medium transition-colors"
                    />
                  </div>

                  {category === "functional" && (
                    <div>
                      <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">Area</label>
                      <input
                        type="text"
                        required
                        value={nodeDraft.area}
                        onChange={(e) => setNodeDraft((prev) => ({ ...prev, area: e.target.value }))}
                        className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 font-medium transition-colors"
                        placeholder="e.g. Logistics"
                      />
                    </div>
                  )}
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">Question Text</label>
                  <textarea
                    required
                    rows={3}
                    value={nodeDraft.text}
                    onChange={(e) => setNodeDraft((prev) => ({ ...prev, text: e.target.value }))}
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 font-medium transition-colors"
                    placeholder="Enter the question statement..."
                  />
                </div>

                <div className="space-y-3 p-5 bg-indigo-50 border border-indigo-100 rounded-xl">
                  <div className="flex items-center justify-between gap-4">
                    <h4 className="text-sm font-black text-indigo-900">Options (score + N/A)</h4>
                    <button type="button" onClick={addOptionToDraft} className="px-3 py-1.5 bg-white border border-indigo-200 rounded-lg text-sm font-bold text-indigo-700 hover:bg-indigo-50 transition-colors">
                      Add Option
                    </button>
                  </div>

                  <div className="space-y-3">
                    {(nodeDraft.options || []).map((opt, idx) => (
                      <div key={idx} className="grid grid-cols-1 md:grid-cols-12 gap-3 items-start">
                        <div className="md:col-span-6">
                          <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">Option Text</label>
                          <input
                            type="text"
                            value={opt.text}
                            onChange={(e) => {
                              const next = [...(nodeDraft.options || [])];
                              next[idx] = { ...next[idx], text: e.target.value };
                              setNodeDraft((prev) => ({ ...prev, options: next }));
                            }}
                            className="w-full px-4 py-2.5 bg-white border border-indigo-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 font-medium transition-colors"
                            placeholder="e.g. ERP/WMS with fixed bin locations..."
                          />
                        </div>

                        <div className="md:col-span-3">
                          <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">Score</label>
                          <input
                            type="number"
                            value={opt.score}
                            disabled={Boolean(opt.isNA)}
                            onChange={(e) => {
                              const next = [...(nodeDraft.options || [])];
                              next[idx] = { ...next[idx], score: Number(e.target.value) };
                              setNodeDraft((prev) => ({ ...prev, options: next }));
                            }}
                            className="w-full px-4 py-2.5 bg-white border border-indigo-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 font-medium transition-colors disabled:opacity-60"
                            placeholder="1-5"
                          />
                        </div>

                        <div className="md:col-span-2 flex items-center pt-7">
                          <label className="flex items-center gap-2 cursor-pointer">
                            <input
                              type="checkbox"
                              checked={Boolean(opt.isNA)}
                              onChange={(e) => {
                                const next = [...(nodeDraft.options || [])];
                                next[idx] = { ...next[idx], isNA: e.target.checked };
                                setNodeDraft((prev) => ({ ...prev, options: next }));
                              }}
                              className="w-4 h-4 text-amber-500 rounded border-slate-300 focus:ring-amber-500"
                            />
                            <span className="text-xs font-bold text-slate-700">N/A</span>
                          </label>
                        </div>

                        <div className="md:col-span-1 flex justify-end pt-7">
                          <button
                            type="button"
                            onClick={() => {
                              const next = (nodeDraft.options || []).filter((_, i) => i !== idx);
                              setNodeDraft((prev) => ({ ...prev, options: next }));
                            }}
                            className="p-1.5 text-slate-500 hover:text-rose-600 transition-colors"
                            title="Remove option"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="pt-4 flex gap-3 border-t border-slate-100">
                  <button type="button" onClick={closeModal} className="flex-1 px-4 py-2.5 border border-slate-200 text-slate-600 rounded-lg text-sm font-bold hover:bg-slate-50 transition-colors">
                    Cancel
                  </button>
                  <button type="submit" className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 bg-indigo-600 text-white rounded-lg text-sm font-bold hover:bg-indigo-700 transition-colors shadow-sm">
                    <Save className="w-4 h-4" />
                    {modalMode === "edit" ? "Update Node" : "Add Node to Tree"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );

  function NodeRow({ node, depth }) {
    const indentClasses = ["ml-0", "ml-4", "ml-8", "ml-12", "ml-16", "ml-20", "ml-24"];
    const opts = Array.isArray(node.options) ? node.options : [];
    const kids = Array.isArray(node.children) ? node.children : [];
    const show = filterTree([node], searchTerm)[0] != null;
    if (!show) return null;
    return (
      <div className={`rounded-xl border border-slate-200 bg-white p-4 shadow-sm ${indentClasses[Math.min(depth, indentClasses.length - 1)]}`}>
        <div className="flex items-start justify-between gap-4">
          <div className="min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-black uppercase ${getQuestionTypeColor(node.type || category)}`}>
                {String(node.type || category).toUpperCase()}
              </span>
              <span className="text-xs font-mono text-slate-500">ID: {node.id}</span>
            </div>
            <h4 className="mt-2 text-sm font-bold text-slate-900 leading-snug break-words">{node.text}</h4>
            {node.area && <div className="text-xs font-semibold text-slate-600 bg-slate-100 px-2 py-1 rounded w-max border border-slate-200 mt-2">Area: {node.area}</div>}
            {node.sector && <div className="text-xs font-semibold text-slate-600 bg-slate-100 px-2 py-1 rounded w-max border border-slate-200 mt-2">Sector: {node.sector}</div>}
            <div className="text-xs text-slate-500 mt-2">
              Options: <span className="font-bold">{opts.length}</span> · Children: <span className="font-bold">{kids.length}</span>
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <button type="button" onClick={() => openEdit(node)} className="p-1.5 text-slate-400 hover:text-indigo-600 transition-colors bg-slate-100 hover:bg-indigo-50 rounded" title="Edit">
              <Edit2 className="w-4 h-4" />
            </button>
            <button type="button" onClick={() => openAddChild(node.id)} className="p-1.5 text-slate-400 hover:text-emerald-600 transition-colors bg-slate-100 hover:bg-emerald-50 rounded" title="Add child">
              <Plus className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={() => {
                if (!window.confirm("Delete this question node (and its children)?")) return;
                setDefinition((prev) => updateTreeDeleteNode(prev, node.id));
              }}
              className="p-1.5 text-slate-400 hover:text-rose-600 transition-colors bg-slate-100 hover:bg-rose-50 rounded"
              title="Delete"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        </div>

        {kids.length > 0 && (
          <div className="mt-4 space-y-3">
            {kids.map((c) => (
              <NodeRow key={c.id} node={c} depth={depth + 1} />
            ))}
          </div>
        )}
      </div>
    );
  }
};

export default QuestionManagement;
