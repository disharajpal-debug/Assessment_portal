import React, { useEffect, useMemo, useState } from "react";
import { Plus, Search, Trash2, Edit2, X, Save } from "lucide-react";
import { adminService } from "../../../services/adminService";
import { superuserService } from "../../../services/superuserService";
import { badgeClass } from "../AdminDashboard.utilities";

const ClientManagement = () => {
  const [clients, setClients] = useState([]);
  const [assignments, setAssignments] = useState([]);
  const [assessors, setAssessors] = useState([]);
  const [sectors, setSectors] = useState([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");

  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState({
    username: "",
    email: "",
    password: "",
    sector: "",
    is_active: true,
  });

  const load = async () => {
    setLoading(true);
    setError("");
    try {
      const [cRes, aRes, assRes, secRes] = await Promise.all([
        adminService.listClients(),
        adminService.listAssignments(),
        adminService.listAssessors(),
        superuserService.listSectors(),
      ]);
      setClients(cRes.data || []);
      setAssignments(aRes.data || []);
      setAssessors(assRes.data || []);
      setSectors(Array.isArray(secRes.data) ? secRes.data : (secRes.data?.results || []));
    } catch (err) {
      setError(err?.response?.data?.detail || err?.message || "Failed to load clients.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const assessorById = useMemo(() => {
    const map = new Map();
    (assessors || []).forEach((u) => map.set(u.id, u));
    return map;
  }, [assessors]);

  const assignedAssessor = (clientId) => {
    const match = (assignments || []).find((a) => a.client === clientId);
    if (!match) return null;
    return assessorById.get(match.assessor) || { username: match.assessor_name, email: match.assessor_email };
  };

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return clients;
    return (clients || []).filter((c) => {
      return (
        String(c.username || "").toLowerCase().includes(q) ||
        String(c.email || "").toLowerCase().includes(q) ||
        String(c.sector || "").toLowerCase().includes(q)
      );
    });
  }, [clients, search]);

  const openAdd = () => {
    setEditing(null);
    setForm({ username: "", email: "", password: "", sector: "", is_active: true });
    setModalOpen(true);
  };

  const openEdit = (client) => {
    setEditing(client);
    setForm({
      username: client.username || "",
      email: client.email || "",
      password: "",
      sector: client.sector || "",
      is_active: client.is_active ?? true,
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
      if (editing) {
        await adminService.updateClient(editing.id, {
          username: form.username,
          email: form.email,
          sector: form.sector || null,
          is_active: Boolean(form.is_active),
        });
      } else {
        await adminService.createClient({
          username: form.username,
          email: form.email,
          password: form.password,
          sector: form.sector || null,
        });
      }
      await load();
      close();
    } catch (err) {
      alert(err?.response?.data?.detail || err?.message || "Failed to save client.");
    }
  };

  const remove = async (id) => {
    if (!window.confirm("Delete this client?")) return;
    try {
      await adminService.deleteClient(id);
      await load();
    } catch (err) {
      alert(err?.response?.data?.detail || err?.message || "Failed to delete client.");
    }
  };

  if (loading) return <div className="text-slate-500 py-10 text-center">Loading clients...</div>;

  return (
    <div className="space-y-6">
      {error && <div className="text-sm text-rose-600 font-semibold bg-rose-50 border border-rose-200 rounded-xl p-3">{error}</div>}

      <div className="flex flex-col md:flex-row gap-4 justify-between items-center">
        <div className="relative w-full max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search clients..."
            className="w-full pl-10 pr-4 py-2 bg-white border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
          />
        </div>
        <button onClick={openAdd} className="flex items-center justify-center gap-2 px-4 py-2 w-full md:w-auto bg-indigo-600 text-white rounded-lg text-sm font-bold shadow-sm hover:bg-indigo-700 transition-colors">
          <Plus className="w-4 h-4" />
          Add Client
        </button>
      </div>

      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-slate-50 border-b border-slate-200">
              <tr>
                <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Name</th>
                <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Sector</th>
                <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Assigned Assessor</th>
                <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {(filtered || []).map((c) => {
                const ass = assignedAssessor(c.id);
                return (
                  <tr key={c.id} className="hover:bg-slate-50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="font-bold text-slate-900 text-sm">{c.username}</div>
                      <div className="text-xs text-slate-500">{c.email}</div>
                    </td>
                    <td className="px-6 py-4 text-sm text-slate-700">{c.sector || "—"}</td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-black uppercase border ${badgeClass(c.is_active ? "active" : "inactive")}`}>
                        {c.is_active ? "active" : "inactive"}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-slate-700">
                      {ass ? (
                        <div>
                          <div className="font-semibold">{ass.username}</div>
                          <div className="text-xs text-slate-500">{ass.email}</div>
                        </div>
                      ) : (
                        "—"
                      )}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button onClick={() => openEdit(c)} className="p-1.5 text-slate-400 hover:text-indigo-600 transition-colors bg-slate-100 hover:bg-indigo-50 rounded" title="Edit">
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button onClick={() => remove(c.id)} className="p-1.5 text-slate-400 hover:text-rose-600 transition-colors bg-slate-100 hover:bg-rose-50 rounded" title="Delete">
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
              {filtered?.length === 0 && (
                <tr>
                  <td colSpan={5} className="px-6 py-10 text-center text-slate-500">
                    No clients found.
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
              <h3 className="text-xl font-black text-slate-900">{editing ? "Edit Client" : "New Client"}</h3>
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

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-end">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">Sector</label>
                  <select value={form.sector} onChange={(e) => setForm((p) => ({ ...p, sector: e.target.value }))} className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-sm font-semibold text-slate-700 outline-none focus:ring-2 focus:ring-indigo-500/20">
                    <option value="">—</option>
                    {(sectors || []).map((s) => (
                      <option key={s.code} value={s.code}>
                        {s.name}
                      </option>
                    ))}
                  </select>
                </div>
                {editing && (
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input type="checkbox" checked={Boolean(form.is_active)} onChange={(e) => setForm((p) => ({ ...p, is_active: e.target.checked }))} className="w-4 h-4 text-indigo-600 rounded border-slate-300" />
                    <span className="text-sm font-semibold text-slate-700">Active</span>
                  </label>
                )}
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

export default ClientManagement;

