import React, { Fragment, useEffect, useMemo, useState } from "react";
import {
  Search,
  Plus,
  Edit2,
  Trash2,
  Shield,
  X,
  Save,
  ChevronDown,
  ChevronRight,
  Building2,
  Link2,
  Users,
} from "lucide-react";
import { getRoleColor } from "../SuperUserDashboard.utilities";
import { superuserService } from "../../../services/superuserService";

const ROLES = ["client", "assessor", "admin", "superuser"];

const SUB_TABS = [
  { id: "clients", label: "Clients" },
  { id: "assessors", label: "Assessors" },
  { id: "staff", label: "Staff (Admin / SuperUser)" },
];

const assignmentStatusLabel = (s) =>
  String(s || "")
    .replace(/_/g, " ")
    .replace(/\b\w/g, (c) => c.toUpperCase());

const assignmentStatusClass = (status) => {
  switch (String(status).toLowerCase()) {
    case "completed":
      return "text-emerald-700 bg-emerald-100 ring-emerald-600/20";
    case "in_progress":
      return "text-indigo-700 bg-indigo-100 ring-indigo-600/20";
    default:
      return "text-amber-700 bg-amber-100 ring-amber-600/20";
  }
};

const UserManagement = () => {
  const [subTab, setSubTab] = useState("clients");
  const [users, setUsers] = useState([]);
  const [assignments, setAssignments] = useState([]);
  const [assessments, setAssessments] = useState([]);
  const [sectors, setSectors] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [expandedClientId, setExpandedClientId] = useState(null);
  const [expandedAssessorId, setExpandedAssessorId] = useState(null);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalRolePreset, setModalRolePreset] = useState(null);
  const [mode, setMode] = useState("create");
  const [editingUserId, setEditingUserId] = useState(null);

  const emptyForm = {
    username: "",
    email: "",
    password: "",
    role: "client",
    company_name: "",
    sector: "",
    assessor_sectors: [],
  };

  const [formData, setFormData] = useState(emptyForm);

  const [assignModal, setAssignModal] = useState(null);

  const clients = useMemo(() => users.filter((u) => u.role === "client"), [users]);
  const assessors = useMemo(() => users.filter((u) => u.role === "assessor"), [users]);
  const staffUsers = useMemo(
    () => users.filter((u) => u.role === "admin" || u.role === "superuser"),
    [users],
  );

  const sectorLabel = (code) => {
    if (!code) return "—";
    const s = sectors.find((x) => x.code === code);
    return s ? s.name : code;
  };

  const assignmentsByClient = useMemo(() => {
    const m = {};
    for (const a of assignments) {
      const cid = a.client;
      if (!m[cid]) m[cid] = [];
      m[cid].push(a);
    }
    return m;
  }, [assignments]);

  const assignmentsByAssessor = useMemo(() => {
    const m = {};
    for (const a of assignments) {
      const aid = a.assessor;
      if (!m[aid]) m[aid] = [];
      m[aid].push(a);
    }
    return m;
  }, [assignments]);

  const assessmentsByUser = useMemo(() => {
    const m = {};
    for (const row of assessments) {
      const uid = row.user;
      if (!m[uid]) m[uid] = [];
      m[uid].push(row);
    }
    for (const k of Object.keys(m)) {
      m[k].sort(
        (a, b) =>
          new Date(b.updated_at || b.created_at || 0) -
          new Date(a.updated_at || a.created_at || 0),
      );
    }
    return m;
  }, [assessments]);

  const visibleList = useMemo(() => {
    const base =
      subTab === "clients" ? clients : subTab === "assessors" ? assessors : staffUsers;
    const q = searchTerm.trim().toLowerCase();
    if (!q) return base;
    return base.filter((u) => {
      return (
        (u.username || "").toLowerCase().includes(q) ||
        (u.email || "").toLowerCase().includes(q) ||
        (u.company_name || "").toLowerCase().includes(q) ||
        (u.role || "").toLowerCase().includes(q)
      );
    });
  }, [subTab, clients, assessors, staffUsers, searchTerm]);

  const load = async () => {
    setLoading(true);
    setError("");
    try {
      const [uRes, aRes, asmRes, sRes] = await Promise.all([
        superuserService.listUsers(),
        superuserService.listAssignments(),
        superuserService.listAssessments(),
        superuserService.listSectors(),
      ]);
      setUsers(uRes.data || []);
      setAssignments(aRes.data || []);
      setAssessments(asmRes.data || []);
      setSectors(sRes.data || []);
    } catch (err) {
      setError(err?.response?.data?.detail || err?.message || "Failed to load data.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  useEffect(() => {
    setExpandedClientId(null);
    setExpandedAssessorId(null);
  }, [subTab]);

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingUserId(null);
    setMode("create");
    setModalRolePreset(null);
    setFormData(emptyForm);
  };

  const openCreateWithRole = (role) => {
    setMode("create");
    setEditingUserId(null);
    setModalRolePreset(role);
    setFormData({
      ...emptyForm,
      role,
      sector: role === "client" ? "" : "",
      assessor_sectors: [],
    });
    setIsModalOpen(true);
  };

  const openEdit = (u) => {
    setMode("edit");
    setEditingUserId(u.id);
    setModalRolePreset(null);
    setFormData({
      username: u.username || "",
      email: u.email || "",
      password: "",
      role: u.role || "client",
      company_name: u.company_name || "",
      sector: u.sector || "",
      assessor_sectors: Array.isArray(u.assessor_sectors) ? u.assessor_sectors : [],
    });
    setIsModalOpen(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this user?")) return;
    try {
      await superuserService.deleteUser(id);
      await load();
    } catch (err) {
      alert(err?.response?.data?.detail || err?.message || "Failed to delete user.");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (mode === "create") {
        if (formData.role === "assessor" && (!formData.assessor_sectors || formData.assessor_sectors.length === 0)) {
          alert("Please assign at least one sector to the assessor.");
          return;
        }
        if (formData.role === "client" && !String(formData.company_name || "").trim()) {
          alert("Company name is required for clients.");
          return;
        }
        const payload = {
          username: formData.username.trim(),
          email: formData.email.trim(),
          password: formData.password,
          role: formData.role,
          company_name: formData.role === "client" ? String(formData.company_name).trim() : null,
          sector: formData.role === "client" ? formData.sector : null,
          assessor_sectors: formData.role === "assessor" ? formData.assessor_sectors : [],
        };
        await superuserService.createUser(payload);
      } else {
        if (formData.role === "assessor" && (!formData.assessor_sectors || formData.assessor_sectors.length === 0)) {
          alert("Please assign at least one sector to the assessor.");
          return;
        }
        if (formData.role === "client" && !String(formData.company_name || "").trim()) {
          alert("Company name is required for clients.");
          return;
        }
        const payload = {
          role: formData.role,
          sector: formData.role === "client" ? formData.sector : null,
          assessor_sectors: formData.role === "assessor" ? formData.assessor_sectors : [],
        };
        if (formData.role === "client") {
          payload.company_name = String(formData.company_name).trim();
        }
        await superuserService.updateUserRole(editingUserId, payload);
      }
      closeModal();
      await load();
    } catch (err) {
      alert(err?.response?.data?.detail || err?.response?.data || err?.message || "Operation failed.");
    }
  };

  const openAssignModal = (opts) => {
    setAssignModal({
      mode: "create",
      clientId: opts.clientId ?? "",
      assessorId: opts.assessorId ?? "",
      status: "pending",
    });
  };

  const openEditAssignment = (row) => {
    setAssignModal({
      mode: "edit",
      id: row.id,
      clientId: row.client,
      assessorId: row.assessor,
      status: row.status || "pending",
    });
  };

  const saveAssignment = async (e) => {
    e.preventDefault();
    if (!assignModal) return;
    try {
      if (assignModal.mode === "create") {
        await superuserService.createAssignment({
          client: Number(assignModal.clientId),
          assessor: Number(assignModal.assessorId),
          status: assignModal.status,
        });
      } else {
        await superuserService.updateAssignment(assignModal.id, { status: assignModal.status });
      }
      setAssignModal(null);
      await load();
    } catch (err) {
      alert(err?.response?.data?.detail || err?.response?.data || err?.message || "Assignment failed.");
    }
  };

  const deleteAssignment = async (id) => {
    if (!window.confirm("Remove this client ↔ assessor assignment?")) return;
    try {
      await superuserService.deleteAssignment(id);
      await load();
    } catch (err) {
      alert(err?.response?.data?.detail || err?.message || "Failed to delete assignment.");
    }
  };

  const latestAssessmentLine = (clientId) => {
    const list = assessmentsByUser[clientId] || [];
    const a = list[0];
    if (!a) return "No assessments yet";
    const st = a.reviewed_at ? "Assessed" : a.status === "submitted" ? "Submitted" : "Draft";
    const sc = a.score != null && !Number.isNaN(Number(a.score)) ? Number(a.score).toFixed(1) : "—";
    return `#${a.id} · ${st} · score ${sc}`;
  };

  const renderClientsTable = () => (
    <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-left">
          <thead className="bg-slate-50 border-b border-slate-200">
            <tr>
              <th className="px-4 py-3 text-xs font-semibold text-slate-500 uppercase w-10" />
              <th className="px-4 py-3 text-xs font-semibold text-slate-500 uppercase">Company</th>
              <th className="px-4 py-3 text-xs font-semibold text-slate-500 uppercase">Client</th>
              <th className="px-4 py-3 text-xs font-semibold text-slate-500 uppercase">Email</th>
              <th className="px-4 py-3 text-xs font-semibold text-slate-500 uppercase">Sector</th>
              <th className="px-4 py-3 text-xs font-semibold text-slate-500 uppercase">Assessors</th>
              <th className="px-4 py-3 text-xs font-semibold text-slate-500 uppercase">Latest</th>
              <th className="px-4 py-3 text-xs font-semibold text-slate-500 uppercase text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {loading ? (
              <tr>
                <td colSpan={8} className="px-6 py-8 text-center text-slate-500">
                  Loading...
                </td>
              </tr>
            ) : visibleList.length === 0 ? (
              <tr>
                <td colSpan={8} className="px-6 py-10 text-center text-slate-500">
                  No clients found.
                </td>
              </tr>
            ) : (
              visibleList.map((c) => {
                const amap = assignmentsByClient[c.id] || [];
                const assessorSummary = amap.length
                  ? amap.map((x) => x.assessor_name).join(", ")
                  : "—";
                const open = expandedClientId === c.id;
                return (
                  <Fragment key={c.id}>
                    <tr className="hover:bg-slate-50 transition-colors">
                      <td className="px-2 py-3">
                        <button
                          type="button"
                          onClick={() => setExpandedClientId(open ? null : c.id)}
                          className="p-1 rounded text-slate-500 hover:bg-slate-200"
                          aria-label={open ? "Collapse" : "Expand"}
                        >
                          {open ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
                        </button>
                      </td>
                      <td className="px-4 py-3 font-semibold text-slate-900">{c.company_name || "—"}</td>
                      <td className="px-4 py-3 whitespace-nowrap">{c.username}</td>
                      <td className="px-4 py-3 text-sm text-slate-600">{c.email}</td>
                      <td className="px-4 py-3 text-sm">{sectorLabel(c.sector)}</td>
                      <td className="px-4 py-3 text-sm text-slate-700 max-w-[200px] truncate" title={assessorSummary}>
                        {assessorSummary}
                      </td>
                      <td className="px-4 py-3 text-xs text-slate-600">{latestAssessmentLine(c.id)}</td>
                      <td className="px-4 py-3 text-right">
                        <div className="flex justify-end gap-2">
                          <button
                            type="button"
                            onClick={() => openAssignModal({ clientId: c.id })}
                            className="p-1.5 text-slate-400 hover:text-indigo-600 bg-slate-100 hover:bg-indigo-50 rounded"
                            title="Assign assessor"
                          >
                            <Link2 className="w-4 h-4" />
                          </button>
                          <button
                            type="button"
                            onClick={() => openEdit(c)}
                            className="p-1.5 text-slate-400 hover:text-indigo-600 bg-slate-100 hover:bg-indigo-50 rounded"
                            title="Edit"
                          >
                            <Edit2 className="w-4 h-4" />
                          </button>
                          <button
                            type="button"
                            onClick={() => handleDelete(c.id)}
                            className="p-1.5 text-slate-400 hover:text-rose-600 bg-slate-100 hover:bg-rose-50 rounded"
                            title="Delete"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                    {open && (
                      <tr className="bg-slate-50/80">
                        <td colSpan={8} className="px-6 py-5">
                          <div className="grid gap-6 lg:grid-cols-2">
                            <div className="space-y-3">
                              <h4 className="text-sm font-black text-slate-900 flex items-center gap-2">
                                <Building2 className="w-4 h-4 text-indigo-600" />
                                Account & registration
                              </h4>
                              <dl className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm">
                                <div>
                                  <dt className="text-slate-500 font-medium">Company</dt>
                                  <dd className="font-semibold text-slate-900">{c.company_name || "—"}</dd>
                                </div>
                                <div>
                                  <dt className="text-slate-500 font-medium">Username</dt>
                                  <dd className="font-semibold text-slate-900">{c.username}</dd>
                                </div>
                                <div>
                                  <dt className="text-slate-500 font-medium">Email</dt>
                                  <dd className="text-slate-800">{c.email}</dd>
                                </div>
                                <div>
                                  <dt className="text-slate-500 font-medium">Sector</dt>
                                  <dd className="text-slate-800">{sectorLabel(c.sector)}</dd>
                                </div>
                                <div>
                                  <dt className="text-slate-500 font-medium">Joined</dt>
                                  <dd className="text-slate-800">
                                    {c.date_joined ? new Date(c.date_joined).toLocaleString() : "—"}
                                  </dd>
                                </div>
                                <div>
                                  <dt className="text-slate-500 font-medium">Active</dt>
                                  <dd className="text-slate-800">{c.is_active ? "Yes" : "No"}</dd>
                                </div>
                              </dl>
                            </div>
                            <div className="space-y-3">
                              <h4 className="text-sm font-black text-slate-900">Assessor assignments</h4>
                              {amap.length === 0 ? (
                                <p className="text-sm text-slate-500">No assessor assigned yet.</p>
                              ) : (
                                <ul className="space-y-2">
                                  {amap.map((a) => (
                                    <li
                                      key={a.id}
                                      className="flex flex-wrap items-center justify-between gap-2 rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm"
                                    >
                                      <span className="font-medium text-slate-800">{a.assessor_name}</span>
                                      <span
                                        className={`inline-flex px-2 py-0.5 rounded-full text-xs font-bold ring-1 ring-inset ${assignmentStatusClass(a.status)}`}
                                      >
                                        {assignmentStatusLabel(a.status)}
                                      </span>
                                      <div className="flex gap-1">
                                        <button
                                          type="button"
                                          onClick={() => openEditAssignment(a)}
                                          className="p-1 text-slate-500 hover:text-indigo-600"
                                        >
                                          <Edit2 className="w-3.5 h-3.5" />
                                        </button>
                                        <button
                                          type="button"
                                          onClick={() => deleteAssignment(a.id)}
                                          className="p-1 text-slate-500 hover:text-rose-600"
                                        >
                                          <Trash2 className="w-3.5 h-3.5" />
                                        </button>
                                      </div>
                                    </li>
                                  ))}
                                </ul>
                              )}
                              <button
                                type="button"
                                onClick={() => openAssignModal({ clientId: c.id })}
                                className="inline-flex items-center gap-2 text-sm font-bold text-indigo-600 hover:text-indigo-800"
                              >
                                <Plus className="w-4 h-4" />
                                Assign assessor
                              </button>
                            </div>
                          </div>
                          <div className="mt-6 border-t border-slate-200 pt-4">
                            <h4 className="text-sm font-black text-slate-900 mb-2">Assessments</h4>
                            {(assessmentsByUser[c.id] || []).length === 0 ? (
                              <p className="text-sm text-slate-500">No assessments started yet.</p>
                            ) : (
                              <div className="overflow-x-auto rounded-lg border border-slate-200">
                                <table className="w-full text-sm">
                                  <thead className="bg-slate-100">
                                    <tr>
                                      <th className="px-3 py-2 text-left font-semibold text-slate-600">ID</th>
                                      <th className="px-3 py-2 text-left font-semibold text-slate-600">Sector</th>
                                      <th className="px-3 py-2 text-left font-semibold text-slate-600">Status</th>
                                      <th className="px-3 py-2 text-left font-semibold text-slate-600">Score</th>
                                      <th className="px-3 py-2 text-left font-semibold text-slate-600">Updated</th>
                                    </tr>
                                  </thead>
                                  <tbody className="divide-y divide-slate-100 bg-white">
                                    {(assessmentsByUser[c.id] || []).map((row) => (
                                      <tr key={row.id}>
                                        <td className="px-3 py-2 font-mono">#{row.id}</td>
                                        <td className="px-3 py-2">{row.sector}</td>
                                        <td className="px-3 py-2">
                                          {row.reviewed_at
                                            ? "Assessed"
                                            : row.status === "submitted"
                                              ? "Submitted"
                                              : "Draft"}
                                        </td>
                                        <td className="px-3 py-2">
                                          {row.score != null && !Number.isNaN(Number(row.score))
                                            ? Number(row.score).toFixed(1)
                                            : "—"}
                                        </td>
                                        <td className="px-3 py-2 text-slate-600">
                                          {row.updated_at
                                            ? new Date(row.updated_at).toLocaleString()
                                            : "—"}
                                        </td>
                                      </tr>
                                    ))}
                                  </tbody>
                                </table>
                              </div>
                            )}
                          </div>
                        </td>
                      </tr>
                    )}
                  </Fragment>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );

  const renderAssessorsTable = () => (
    <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-left">
          <thead className="bg-slate-50 border-b border-slate-200">
            <tr>
              <th className="px-4 py-3 text-xs font-semibold text-slate-500 uppercase w-10" />
              <th className="px-4 py-3 text-xs font-semibold text-slate-500 uppercase">Assessor</th>
              <th className="px-4 py-3 text-xs font-semibold text-slate-500 uppercase">Email</th>
              <th className="px-4 py-3 text-xs font-semibold text-slate-500 uppercase">Sectors</th>
              <th className="px-4 py-3 text-xs font-semibold text-slate-500 uppercase">Clients</th>
              <th className="px-4 py-3 text-xs font-semibold text-slate-500 uppercase text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {loading ? (
              <tr>
                <td colSpan={6} className="px-6 py-8 text-center text-slate-500">
                  Loading...
                </td>
              </tr>
            ) : visibleList.length === 0 ? (
              <tr>
                <td colSpan={6} className="px-6 py-10 text-center text-slate-500">
                  No assessors found.
                </td>
              </tr>
            ) : (
              visibleList.map((a) => {
                const amap = assignmentsByAssessor[a.id] || [];
                const open = expandedAssessorId === a.id;
                const sectorCodes = Array.isArray(a.assessor_sectors) ? a.assessor_sectors : [];
                return (
                  <Fragment key={a.id}>
                    <tr className="hover:bg-slate-50 transition-colors">
                      <td className="px-2 py-3">
                        <button
                          type="button"
                          onClick={() => setExpandedAssessorId(open ? null : a.id)}
                          className="p-1 rounded text-slate-500 hover:bg-slate-200"
                        >
                          {open ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
                        </button>
                      </td>
                      <td className="px-4 py-3 font-semibold text-slate-900">{a.username}</td>
                      <td className="px-4 py-3 text-sm text-slate-600">{a.email}</td>
                      <td className="px-4 py-3 text-sm text-slate-700 max-w-[220px]">
                        {sectorCodes.length
                          ? sectorCodes.map((code) => sectorLabel(code)).join(", ")
                          : "—"}
                      </td>
                      <td className="px-4 py-3 text-sm">{amap.length}</td>
                      <td className="px-4 py-3 text-right">
                        <div className="flex justify-end gap-2">
                          <button
                            type="button"
                            onClick={() => openAssignModal({ assessorId: a.id })}
                            className="p-1.5 text-slate-400 hover:text-indigo-600 bg-slate-100 hover:bg-indigo-50 rounded"
                            title="Assign client"
                          >
                            <Link2 className="w-4 h-4" />
                          </button>
                          <button
                            type="button"
                            onClick={() => openEdit(a)}
                            className="p-1.5 text-slate-400 hover:text-indigo-600 bg-slate-100 hover:bg-indigo-50 rounded"
                            title="Edit"
                          >
                            <Edit2 className="w-4 h-4" />
                          </button>
                          <button
                            type="button"
                            onClick={() => handleDelete(a.id)}
                            className="p-1.5 text-slate-400 hover:text-rose-600 bg-slate-100 hover:bg-rose-50 rounded"
                            title="Delete"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                    {open && (
                      <tr className="bg-slate-50/80">
                        <td colSpan={6} className="px-6 py-5">
                          <div className="space-y-4">
                            <div>
                              <h4 className="text-sm font-black text-slate-900 mb-2">Sector access</h4>
                              <div className="flex flex-wrap gap-2">
                                {sectorCodes.length === 0 ? (
                                  <span className="text-sm text-slate-500">No sectors assigned.</span>
                                ) : (
                                  sectorCodes.map((code) => (
                                    <span
                                      key={code}
                                      className="inline-flex items-center rounded-full bg-indigo-50 text-indigo-800 px-3 py-1 text-xs font-bold ring-1 ring-indigo-100"
                                    >
                                      {sectorLabel(code)}
                                    </span>
                                  ))
                                )}
                              </div>
                            </div>
                            <div>
                              <h4 className="text-sm font-black text-slate-900 mb-2">Assigned clients</h4>
                              {amap.length === 0 ? (
                                <p className="text-sm text-slate-500">No clients assigned.</p>
                              ) : (
                                <ul className="space-y-2">
                                  {amap.map((row) => (
                                    <li
                                      key={row.id}
                                      className="flex flex-wrap items-center justify-between gap-2 rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm"
                                    >
                                      <span>
                                        <span className="font-semibold text-slate-900">{row.client_name}</span>
                                        <span className="text-slate-500 ml-2">{row.client_email}</span>
                                      </span>
                                      <span
                                        className={`inline-flex px-2 py-0.5 rounded-full text-xs font-bold ring-1 ring-inset ${assignmentStatusClass(row.status)}`}
                                      >
                                        {assignmentStatusLabel(row.status)}
                                      </span>
                                      <div className="flex gap-1">
                                        <button
                                          type="button"
                                          onClick={() => openEditAssignment(row)}
                                          className="p-1 text-slate-500 hover:text-indigo-600"
                                        >
                                          <Edit2 className="w-3.5 h-3.5" />
                                        </button>
                                        <button
                                          type="button"
                                          onClick={() => deleteAssignment(row.id)}
                                          className="p-1 text-slate-500 hover:text-rose-600"
                                        >
                                          <Trash2 className="w-3.5 h-3.5" />
                                        </button>
                                      </div>
                                    </li>
                                  ))}
                                </ul>
                              )}
                              <button
                                type="button"
                                onClick={() => openAssignModal({ assessorId: a.id })}
                                className="mt-2 inline-flex items-center gap-2 text-sm font-bold text-indigo-600 hover:text-indigo-800"
                              >
                                <Plus className="w-4 h-4" />
                                Assign client
                              </button>
                            </div>
                          </div>
                        </td>
                      </tr>
                    )}
                  </Fragment>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );

  const renderStaffTable = () => (
    <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-left">
          <thead className="bg-slate-50 border-b border-slate-200">
            <tr>
              <th className="px-6 py-3 text-xs font-semibold text-slate-500 uppercase">Username</th>
              <th className="px-6 py-3 text-xs font-semibold text-slate-500 uppercase">Email</th>
              <th className="px-6 py-3 text-xs font-semibold text-slate-500 uppercase">Role</th>
              <th className="px-6 py-3 text-xs font-semibold text-slate-500 uppercase text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {loading ? (
              <tr>
                <td colSpan={4} className="px-6 py-8 text-center text-slate-500">
                  Loading...
                </td>
              </tr>
            ) : visibleList.length === 0 ? (
              <tr>
                <td colSpan={4} className="px-6 py-10 text-center text-slate-500">
                  No staff accounts found.
                </td>
              </tr>
            ) : (
              visibleList.map((user) => (
                <tr key={user.id} className="hover:bg-slate-50 transition-colors">
                  <td className="px-6 py-4 font-bold text-slate-900">{user.username}</td>
                  <td className="px-6 py-4 text-sm text-slate-600">{user.email}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span
                      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold ring-1 ring-inset ${getRoleColor(user.role)}`}
                    >
                      <Shield className="w-3 h-3" />
                      {String(user.role).toUpperCase()}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        type="button"
                        onClick={() => openEdit(user)}
                        className="p-1.5 text-slate-400 hover:text-indigo-600 transition-colors bg-slate-100 hover:bg-indigo-50 rounded"
                        title="Edit"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button
                        type="button"
                        onClick={() => handleDelete(user.id)}
                        className="p-1.5 text-slate-400 hover:text-rose-600 transition-colors bg-slate-100 hover:bg-rose-50 rounded"
                        title="Delete"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );

  const addButtonLabel =
    subTab === "clients"
      ? "Add client"
      : subTab === "assessors"
        ? "Add assessor"
        : "Add staff account";

  const onAddClick = () => {
    if (subTab === "clients") openCreateWithRole("client");
    else if (subTab === "assessors") openCreateWithRole("assessor");
    else openCreateWithRole("admin");
  };

  return (
    <div className="space-y-6">
      <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
        <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <div>
            <h3 className="text-lg font-black text-slate-900">User access management</h3>
            <p className="text-sm text-slate-500 font-medium">
              View clients and assessors, review registration and assessment activity, and manage client ↔ assessor
              assignments from each profile.
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            {SUB_TABS.map((t) => (
              <button
                key={t.id}
                type="button"
                onClick={() => setSubTab(t.id)}
                className={`inline-flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-bold transition-colors ${
                  subTab === t.id
                    ? "bg-indigo-600 text-white shadow-sm"
                    : "bg-slate-100 text-slate-700 hover:bg-slate-200"
                }`}
              >
                {t.id === "clients" && <Users className="w-4 h-4" />}
                {t.id === "assessors" && <Shield className="w-4 h-4" />}
                {t.id === "staff" && <Building2 className="w-4 h-4" />}
                {t.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div className="relative w-full max-w-md">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder={
              subTab === "clients"
                ? "Search clients..."
                : subTab === "assessors"
                  ? "Search assessors..."
                  : "Search staff..."
            }
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full rounded-lg border border-slate-200 bg-white py-2 pl-10 pr-4 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
          />
        </div>
        <button
          type="button"
          onClick={onAddClick}
          className="inline-flex items-center justify-center gap-2 rounded-lg bg-indigo-600 px-4 py-2 text-sm font-bold text-white shadow-sm hover:bg-indigo-700"
        >
          <Plus className="h-4 w-4" />
          {addButtonLabel}
        </button>
      </div>

      {error && (
        <div className="rounded-xl border border-rose-200 bg-rose-50 p-3 text-sm font-semibold text-rose-600">
          {error}
        </div>
      )}

      {subTab === "clients" && renderClientsTable()}
      {subTab === "assessors" && renderAssessorsTable()}
      {subTab === "staff" && renderStaffTable()}

      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 p-4 backdrop-blur-sm">
          <div className="max-h-[90vh] w-full max-w-md overflow-y-auto rounded-2xl bg-white shadow-xl">
            <div className="flex items-center justify-between border-b border-slate-100 bg-slate-50/50 p-6">
              <h3 className="text-lg font-black text-slate-900">{mode === "edit" ? "Edit user" : "Add user"}</h3>
              <button type="button" onClick={closeModal} className="text-slate-400 transition-colors hover:text-slate-600">
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4 p-6">
              {mode === "create" && (
                <>
                  <div>
                    <label className="mb-2 block text-xs font-bold uppercase tracking-wider text-slate-700">Username</label>
                    <input
                      required
                      value={formData.username}
                      onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                      className="w-full rounded-lg border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                    />
                  </div>
                  <div>
                    <label className="mb-2 block text-xs font-bold uppercase tracking-wider text-slate-700">Email</label>
                    <input
                      type="email"
                      required
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="w-full rounded-lg border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                    />
                  </div>
                  <div>
                    <label className="mb-2 block text-xs font-bold uppercase tracking-wider text-slate-700">Password</label>
                    <input
                      type="password"
                      required
                      value={formData.password}
                      onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                      className="w-full rounded-lg border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                    />
                  </div>
                </>
              )}

              {mode === "edit" && (
                <div className="text-sm text-slate-600">
                  Editing <span className="font-bold text-slate-900">{formData.username}</span>
                </div>
              )}

              <div>
                <label className="mb-2 block text-xs font-bold uppercase tracking-wider text-slate-700">Role</label>
                <select
                  value={formData.role}
                  disabled={
                    mode === "create" &&
                    (modalRolePreset === "client" || modalRolePreset === "assessor")
                  }
                  onChange={(e) => {
                    const nextRole = e.target.value;
                    setFormData((prev) => ({
                      ...prev,
                      role: nextRole,
                      sector: nextRole === "client" ? prev.sector : "",
                      company_name: nextRole === "client" ? prev.company_name : "",
                      assessor_sectors: nextRole === "assessor" ? prev.assessor_sectors : [],
                    }));
                  }}
                  className="w-full rounded-lg border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm font-bold text-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                >
                  {ROLES.map((r) => (
                    <option key={r} value={r}>
                      {r}
                    </option>
                  ))}
                </select>
              </div>

              {formData.role === "client" && (
                <>
                  <div>
                    <label className="mb-2 block text-xs font-bold uppercase tracking-wider text-slate-700">
                      Company name
                    </label>
                    <input
                      required
                      value={formData.company_name}
                      onChange={(e) => setFormData({ ...formData, company_name: e.target.value })}
                      className="w-full rounded-lg border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                    />
                  </div>
                  <div>
                    <label className="mb-2 block text-xs font-bold uppercase tracking-wider text-slate-700">Sector</label>
                    <select
                      value={formData.sector}
                      onChange={(e) => setFormData({ ...formData, sector: e.target.value })}
                      className="w-full rounded-lg border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm font-semibold text-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                    >
                      <option value="">Select sector</option>
                      {sectors.map((s) => (
                        <option key={s.code} value={s.code}>
                          {s.name} ({s.code})
                        </option>
                      ))}
                    </select>
                  </div>
                </>
              )}

              {formData.role === "assessor" && (
                <div>
                  <label className="mb-2 block text-xs font-bold uppercase tracking-wider text-slate-700">
                    Assigned sectors (min 1)
                  </label>
                  <div className="max-h-44 overflow-y-auto rounded-lg border border-slate-200 bg-slate-50 p-3">
                    <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
                      {sectors.map((s) => {
                        const checked = formData.assessor_sectors.includes(s.code);
                        return (
                          <label
                            key={s.code}
                            className="flex min-h-[52px] items-center gap-2 rounded-md border border-slate-200 bg-white px-3 py-2 text-sm text-slate-700"
                          >
                            <input
                              type="checkbox"
                              checked={checked}
                              onChange={(e) =>
                                setFormData((prev) => ({
                                  ...prev,
                                  assessor_sectors: e.target.checked
                                    ? [...prev.assessor_sectors, s.code]
                                    : prev.assessor_sectors.filter((code) => code !== s.code),
                                }))
                              }
                              className="h-4 w-4 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500"
                            />
                            <span>{s.name}</span>
                          </label>
                        );
                      })}
                    </div>
                  </div>
                </div>
              )}

              <div className="flex gap-3 border-t border-slate-100 pt-4">
                <button
                  type="button"
                  onClick={closeModal}
                  className="flex-1 rounded-lg border border-slate-200 px-4 py-2.5 text-sm font-bold text-slate-600 hover:bg-slate-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex flex-1 items-center justify-center gap-2 rounded-lg bg-indigo-600 px-4 py-2.5 text-sm font-bold text-white shadow-sm hover:bg-indigo-700"
                >
                  <Save className="h-4 w-4" />
                  {mode === "edit" ? "Save" : "Create"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {assignModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 p-4 backdrop-blur-sm">
          <div className="w-full max-w-md rounded-2xl bg-white shadow-xl">
            <div className="flex items-center justify-between border-b border-slate-100 bg-slate-50/50 p-6">
              <h3 className="text-lg font-black text-slate-900">
                {assignModal.mode === "edit" ? "Assignment status" : "Assign client to assessor"}
              </h3>
              <button type="button" onClick={() => setAssignModal(null)} className="text-slate-400 hover:text-slate-600">
                <X className="h-5 w-5" />
              </button>
            </div>
            <form onSubmit={saveAssignment} className="space-y-4 p-6">
              {assignModal.mode === "create" && (
                <>
                  <div>
                    <label className="mb-2 block text-xs font-bold uppercase tracking-wider text-slate-700">Client</label>
                    <select
                      required
                      disabled={!!assignModal.clientId}
                      value={assignModal.clientId || ""}
                      onChange={(e) => setAssignModal((m) => ({ ...m, clientId: e.target.value }))}
                      className="w-full rounded-lg border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 disabled:opacity-60"
                    >
                      <option value="">Select client</option>
                      {clients.map((c) => (
                        <option key={c.id} value={c.id}>
                          {c.company_name || c.username} ({c.username})
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="mb-2 block text-xs font-bold uppercase tracking-wider text-slate-700">Assessor</label>
                    <select
                      required
                      disabled={!!assignModal.assessorId}
                      value={assignModal.assessorId || ""}
                      onChange={(e) => setAssignModal((m) => ({ ...m, assessorId: e.target.value }))}
                      className="w-full rounded-lg border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 disabled:opacity-60"
                    >
                      <option value="">Select assessor</option>
                      {assessors.map((x) => (
                        <option key={x.id} value={x.id}>
                          {x.username} ({x.email})
                        </option>
                      ))}
                    </select>
                  </div>
                </>
              )}

              {assignModal.mode === "edit" && (
                <div className="text-sm text-slate-600">
                  Update workflow state for assignment ID{" "}
                  <span className="font-mono font-bold text-slate-900">{assignModal.id}</span>
                </div>
              )}

              <div>
                <label className="mb-2 block text-xs font-bold uppercase tracking-wider text-slate-700">State</label>
                <select
                  value={assignModal.status}
                  onChange={(e) => setAssignModal((m) => ({ ...m, status: e.target.value }))}
                  className="w-full rounded-lg border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm font-bold text-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                >
                  <option value="pending">Pending</option>
                  <option value="in_progress">In progress</option>
                  <option value="completed">Completed</option>
                </select>
              </div>

              <div className="flex gap-3 border-t border-slate-100 pt-4">
                <button
                  type="button"
                  onClick={() => setAssignModal(null)}
                  className="flex-1 rounded-lg border border-slate-200 px-4 py-2.5 text-sm font-bold text-slate-600 hover:bg-slate-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex flex-1 items-center justify-center gap-2 rounded-lg bg-indigo-600 px-4 py-2.5 text-sm font-bold text-white hover:bg-indigo-700"
                >
                  <Save className="h-4 w-4" />
                  {assignModal.mode === "edit" ? "Save state" : "Create mapping"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserManagement;
