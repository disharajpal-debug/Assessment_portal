import React, { useEffect, useMemo, useState } from "react";
import { Plus, Search, Trash2, Edit2, X, Save, Users } from "lucide-react";
import { adminService } from "../../../services/adminService";

const AssignmentManagement = () => {
  const [clients, setClients] = useState([]);
  const [assessors, setAssessors] = useState([]);
  const [assignments, setAssignments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");

  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState({ client: "", assessor: "", status: "pending" });

  const load = async () => {
    setLoading(true);
    setError("");
    try {
      const [cRes, aRes, asRes] = await Promise.all([
        adminService.listClients(),
        adminService.listAssessors(),
        adminService.listAssignments(),
      ]);
      setClients(cRes.data || []);
      setAssessors(aRes.data || []);
      setAssignments(asRes.data || []);
    } catch (err) {
      setError(err?.response?.data?.detail || err?.message || "Failed to load assignments.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const clientById = useMemo(() => new Map((clients || []).map((u) => [u.id, u])), [clients]);
  const assessorById = useMemo(() => new Map((assessors || []).map((u) => [u.id, u])), [assessors]);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return assignments;
    return (assignments || []).filter((a) => {
      const c = clientById.get(a.client);
      const s = assessorById.get(a.assessor);
      return (
        String(c?.username || a.client_name || "").toLowerCase().includes(q) ||
        String(s?.username || a.assessor_name || "").toLowerCase().includes(q) ||
        String(a.status || "").toLowerCase().includes(q)
      );
    });
  }, [assignments, search, clientById, assessorById]);

  const openAdd = () => {
    setEditing(null);
    setForm({ client: "", assessor: "", status: "pending" });
    setModalOpen(true);
  };

  const openEdit = (a) => {
    setEditing(a);
    setForm({ client: a.client, assessor: a.assessor, status: a.status || "pending" });
    setModalOpen(true);
  };

  const close = () => {
    setModalOpen(false);
    setEditing(null);
  };

  const save = async (e) => {
    e.preventDefault();
    if (!form.client || !form.assessor) {
      alert("Select both client and assessor.");
      return;
    }
    try {
      if (editing) {
        await adminService.updateAssignment(editing.id, form);
      } else {
        await adminService.createAssignment(form);
      }
      await load();
      close();
    } catch (err) {
      alert(err?.response?.data?.detail || err?.message || "Failed to save assignment.");
    }
  };

  const remove = async (id) => {
    if (!window.confirm("Delete this assignment?")) return;
    try {
      await adminService.deleteAssignment(id);
      await load();
    } catch (err) {
      alert(err?.response?.data?.detail || err?.message || "Failed to delete assignment.");
    }
  };

  if (loading) return <div className="text-slate-500 py-10 text-center">Loading assignments...</div>;

  return (
    <div className="space-y-6">
      {error && <div className="text-sm text-rose-600 font-semibold bg-rose-50 border border-rose-200 rounded-xl p-3">{error}</div>}

      <div className="flex flex-col md:flex-row gap-4 justify-between items-center">
        <div className="relative w-full max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search assignments..." className="w-full pl-10 pr-4 py-2 bg-white border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20" />
        </div>
        <button onClick={openAdd} className="flex items-center justify-center gap-2 px-4 py-2 w-full md:w-auto bg-indigo-600 text-white rounded-lg text-sm font-bold shadow-sm hover:bg-indigo-700 transition-colors">
          <Plus className="w-4 h-4" />
          Assign Client
        </button>
      </div>

      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-slate-50 border-b border-slate-200">
              <tr>
                <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Client</th>
                <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Assessor</th>
                <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {(filtered || []).map((a) => {
                const c = clientById.get(a.client);
                const s = assessorById.get(a.assessor);
                return (
                  <tr key={a.id} className="hover:bg-slate-50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-start gap-3">
                        <Users className="w-4 h-4 text-indigo-400 mt-1" />
                        <div>
                          <div className="font-bold text-slate-900 text-sm">{c?.username || a.client_name || "—"}</div>
                          <div className="text-xs text-slate-500">{c?.email || a.client_email || ""}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="font-bold text-slate-900 text-sm">{s?.username || a.assessor_name || "—"}</div>
                      <div className="text-xs text-slate-500">{s?.email || a.assessor_email || ""}</div>
                    </td>
                    <td className="px-6 py-4 text-sm font-semibold text-slate-700">{a.status}</td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button onClick={() => openEdit(a)} className="p-1.5 text-slate-400 hover:text-indigo-600 transition-colors bg-slate-100 hover:bg-indigo-50 rounded" title="Edit">
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button onClick={() => remove(a.id)} className="p-1.5 text-slate-400 hover:text-rose-600 transition-colors bg-slate-100 hover:bg-rose-50 rounded" title="Delete">
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
              {filtered?.length === 0 && (
                <tr>
                  <td colSpan={4} className="px-6 py-10 text-center text-slate-500">
                    No assignments found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm overflow-y-auto">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-2xl my-8 overflow-hidden">
            <div className="flex items-center justify-between p-6 border-b border-slate-100 bg-slate-50/50">
              <h3 className="text-xl font-black text-slate-900">{editing ? "Reassign / Update" : "Assign Client → Assessor"}</h3>
              <button onClick={close} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>
            <form onSubmit={save} className="p-6 space-y-5">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">Client</label>
                  <select value={form.client} onChange={(e) => setForm((p) => ({ ...p, client: Number(e.target.value) }))} className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-sm font-semibold text-slate-700 outline-none focus:ring-2 focus:ring-indigo-500/20">
                    <option value="">Select client…</option>
                    {(clients || []).map((u) => (
                      <option key={u.id} value={u.id}>
                        {u.username} ({u.email})
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">Assessor</label>
                  <select value={form.assessor} onChange={(e) => setForm((p) => ({ ...p, assessor: Number(e.target.value) }))} className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-sm font-semibold text-slate-700 outline-none focus:ring-2 focus:ring-indigo-500/20">
                    <option value="">Select assessor…</option>
                    {(assessors || []).filter((u) => u.is_active !== false).map((u) => (
                      <option key={u.id} value={u.id}>
                        {u.username} ({u.email})
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">Status</label>
                <select value={form.status} onChange={(e) => setForm((p) => ({ ...p, status: e.target.value }))} className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-sm font-semibold text-slate-700 outline-none focus:ring-2 focus:ring-indigo-500/20">
                  <option value="pending">Pending</option>
                  <option value="in_progress">In Progress</option>
                  <option value="completed">Completed</option>
                </select>
              </div>

              <div className="pt-2 flex gap-3">
                <button type="button" onClick={close} className="flex-1 px-4 py-2.5 border border-slate-200 text-slate-600 rounded-lg text-sm font-bold hover:bg-slate-50 transition-colors">
                  Cancel
                </button>
                <button type="submit" className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 bg-indigo-600 text-white rounded-lg text-sm font-bold hover:bg-indigo-700 transition-colors shadow-sm">
                  <Save className="w-4 h-4" />
                  Save
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AssignmentManagement;

