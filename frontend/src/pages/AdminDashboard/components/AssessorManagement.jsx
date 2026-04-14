import React, { useEffect, useMemo, useState } from "react";
import { Plus, Search, Trash2, Edit2, X, Save } from "lucide-react";
import { adminService } from "../../../services/adminService";
import { badgeClass } from "../AdminDashboard.utilities";
import { superuserService } from "../../../services/superuserService";

const AssessorManagement = () => {
  const [assessors, setAssessors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [sectors, setSectors] = useState([]);

  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState({
    username: "",
    email: "",
    password: "",
    assessor_sectors: [],
    is_active: true,
  });

  const load = async () => {
    setLoading(true);
    setError("");
    try {
      const [aRes, sRes] = await Promise.all([
        adminService.listAssessors(),
        superuserService.listSectors(),
      ]);
      setAssessors(aRes.data || []);
      setSectors(sRes.data || []);
    } catch (err) {
      setError(err?.response?.data?.detail || err?.message || "Failed to load assessors.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return assessors;
    return (assessors || []).filter((u) => {
      return String(u.username || "").toLowerCase().includes(q) || String(u.email || "").toLowerCase().includes(q);
    });
  }, [assessors, search]);

  const openAdd = () => {
    setEditing(null);
    setForm({ username: "", email: "", password: "", assessor_sectors: [], is_active: true });
    setModalOpen(true);
  };

  const openEdit = (u) => {
    setEditing(u);
    setForm({
      username: u.username || "",
      email: u.email || "",
      password: "",
      assessor_sectors: Array.isArray(u.assessor_sectors) ? u.assessor_sectors : [],
      is_active: u.is_active ?? true,
    });
    setModalOpen(true);
  };

  const close = () => {
    setModalOpen(false);
    setEditing(null);
  };

  const save = async (e) => {
    e.preventDefault();
    try {
      if (!Array.isArray(form.assessor_sectors) || form.assessor_sectors.length === 0) {
        alert("Please assign at least one sector.");
        return;
      }
      if (editing) {
        await adminService.updateAssessor(editing.id, {
          username: form.username,
          email: form.email,
          assessor_sectors: form.assessor_sectors,
          is_active: Boolean(form.is_active),
        });
      } else {
        await adminService.createAssessor({
          username: form.username,
          email: form.email,
          password: form.password,
          assessor_sectors: form.assessor_sectors,
        });
      }
      await load();
      close();
    } catch (err) {
      alert(err?.response?.data?.detail || err?.message || "Failed to save assessor.");
    }
  };

  const toggleActive = async (u) => {
    try {
      await adminService.updateAssessor(u.id, { is_active: !u.is_active });
      await load();
    } catch (err) {
      alert(err?.response?.data?.detail || err?.message || "Failed to update assessor status.");
    }
  };

  const remove = async (id) => {
    if (!window.confirm("Delete this assessor?")) return;
    try {
      await adminService.deleteAssessor(id);
      await load();
    } catch (err) {
      alert(err?.response?.data?.detail || err?.message || "Failed to delete assessor.");
    }
  };

  if (loading) return <div className="text-slate-500 py-10 text-center">Loading assessors...</div>;

  return (
    <div className="space-y-6">
      {error && <div className="text-sm text-rose-600 font-semibold bg-rose-50 border border-rose-200 rounded-xl p-3">{error}</div>}

      <div className="flex flex-col md:flex-row gap-4 justify-between items-center">
        <div className="relative w-full max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search assessors..." className="w-full pl-10 pr-4 py-2 bg-white border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20" />
        </div>
        <button onClick={openAdd} className="flex items-center justify-center gap-2 px-4 py-2 w-full md:w-auto bg-indigo-600 text-white rounded-lg text-sm font-bold shadow-sm hover:bg-indigo-700 transition-colors">
          <Plus className="w-4 h-4" />
          Add Assessor
        </button>
      </div>

      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-slate-50 border-b border-slate-200">
              <tr>
                <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Name</th>
                <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Sectors</th>
                <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {(filtered || []).map((u) => (
                <tr key={u.id} className="hover:bg-slate-50 transition-colors">
                  <td className="px-6 py-4">
                    <div className="font-bold text-slate-900 text-sm">{u.username}</div>
                    <div className="text-xs text-slate-500">{u.email}</div>
                  </td>
                  <td className="px-6 py-4 text-xs text-slate-600">
                    {(u.assessor_sectors || []).length ? (u.assessor_sectors || []).join(", ") : "—"}
                  </td>
                  <td className="px-6 py-4">
                    <button onClick={() => toggleActive(u)} className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-black uppercase border ${badgeClass(u.is_active ? "active" : "inactive")} hover:opacity-80`}>
                      {u.is_active ? "active" : "inactive"}
                    </button>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button onClick={() => openEdit(u)} className="p-1.5 text-slate-400 hover:text-indigo-600 transition-colors bg-slate-100 hover:bg-indigo-50 rounded" title="Edit">
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button onClick={() => remove(u.id)} className="p-1.5 text-slate-400 hover:text-rose-600 transition-colors bg-slate-100 hover:bg-rose-50 rounded" title="Delete">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {filtered?.length === 0 && (
                <tr>
                  <td colSpan={4} className="px-6 py-10 text-center text-slate-500">
                    No assessors found.
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
              <h3 className="text-xl font-black text-slate-900">{editing ? "Edit Assessor" : "New Assessor"}</h3>
              <button onClick={close} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>
            <form onSubmit={save} className="p-6 space-y-5">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">Name</label>
                  <input value={form.username} onChange={(e) => setForm((p) => ({ ...p, username: e.target.value }))} required className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500/20 outline-none" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">Email</label>
                  <input type="email" value={form.email} onChange={(e) => setForm((p) => ({ ...p, email: e.target.value }))} required className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500/20 outline-none" />
                </div>
              </div>

              {!editing && (
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">Password</label>
                  <input type="password" value={form.password} onChange={(e) => setForm((p) => ({ ...p, password: e.target.value }))} required className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500/20 outline-none" />
                </div>
              )}

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                  Assigned Sectors (min 1)
                </label>
                <div className="max-h-44 overflow-y-auto rounded-lg border border-slate-200 bg-slate-50 p-3">
                  <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
                    {sectors.map((s) => {
                      const checked = form.assessor_sectors.includes(s.code);
                      return (
                        <label
                          key={s.code}
                          className="flex min-h-[52px] items-center gap-2 rounded-md border border-slate-200 bg-white px-3 py-2 text-sm text-slate-700"
                        >
                          <input
                            type="checkbox"
                            checked={checked}
                            onChange={(e) => {
                              setForm((p) => ({
                                ...p,
                                assessor_sectors: e.target.checked
                                  ? [...p.assessor_sectors, s.code]
                                  : p.assessor_sectors.filter((code) => code !== s.code),
                              }));
                            }}
                            className="h-4 w-4 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500"
                          />
                          <span>{s.name}</span>
                        </label>
                      );
                    })}
                  </div>
                </div>
              </div>

              {editing && (
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="checkbox" checked={Boolean(form.is_active)} onChange={(e) => setForm((p) => ({ ...p, is_active: e.target.checked }))} className="w-4 h-4 text-indigo-600 rounded border-slate-300" />
                  <span className="text-sm font-semibold text-slate-700">Active</span>
                </label>
              )}

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

export default AssessorManagement;

