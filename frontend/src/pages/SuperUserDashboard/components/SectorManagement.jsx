import React, { useEffect, useMemo, useState } from "react";
import { Search, Plus, Edit2, Trash2, LayoutGrid, X, Save } from 'lucide-react';
import { MOCK_SECTORS } from '../SuperUserDashboard.constants';

import { superuserService } from "../../../services/superuserService";

const SectorManagementMock = () => {
  const [sectors, setSectors] = useState(MOCK_SECTORS);
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingSector, setEditingSector] = useState(null);
  const [formData, setFormData] = useState({ name: '', code: '' });

  const filteredSectors = sectors.filter(s => 
    s.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    s.code.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleDelete = (id) => {
    if(window.confirm('Delete this sector? This action may affect existing assessments mapped to this sector.')) {
      setSectors(sectors.filter(s => s.id !== id));
    }
  };

  const handleOpenModal = (sector = null) => {
    if (sector) {
      setEditingSector(sector.id);
      setFormData({ name: sector.name, code: sector.code });
    } else {
      setEditingSector(null);
      setFormData({ name: '', code: '' });
    }
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingSector(null);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (editingSector) {
      setSectors(sectors.map(s => s.id === editingSector ? { ...s, ...formData } : s));
    } else {
      const newSector = { id: Date.now(), count: 0, ...formData };
      setSectors([...sectors, newSector]);
    }
    handleCloseModal();
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row gap-4 justify-between items-center">
        <div className="relative w-full max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input 
            type="text" 
            placeholder="Search sectors..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-white border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
          />
        </div>
        <button 
          onClick={() => handleOpenModal()} 
          className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg text-sm font-bold shadow-sm hover:bg-indigo-700 transition-colors"
        >
          <Plus className="w-4 h-4" />
          Create Sector
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredSectors.map(sector => (
          <div key={sector.id} className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm hover:shadow-lg transition-all duration-300 group">
            <div className="flex items-start justify-between mb-4">
              <div className="p-3 bg-indigo-50 text-indigo-600 rounded-xl group-hover:bg-indigo-600 group-hover:text-white transition-colors duration-300">
                <LayoutGrid className="w-6 h-6" />
              </div>
              <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <button 
                  onClick={() => handleOpenModal(sector)}
                  className="p-1.5 text-slate-400 hover:text-indigo-600 bg-slate-50 hover:bg-indigo-50 rounded-lg transition-colors"
                >
                  <Edit2 className="w-4 h-4" />
                </button>
                <button 
                  onClick={() => handleDelete(sector.id)} 
                  className="p-1.5 text-slate-400 hover:text-rose-600 bg-slate-50 hover:bg-rose-50 rounded-lg transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
            <h3 className="text-xl font-black text-slate-900 mb-1">{sector.name}</h3>
            <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-6 border-b border-slate-100 pb-4">
              Code: <span className="text-slate-600">{sector.code}</span>
            </p>
            <div className="flex justify-between items-center">
              <span className="text-sm font-bold text-slate-500 flex items-center gap-2">
                Questions Linked
              </span>
              <span className="text-sm font-black text-indigo-700 bg-indigo-50 px-3 py-1 rounded-lg">
                {sector.count}
              </span>
            </div>
          </div>
        ))}
      </div>
      
      {filteredSectors.length === 0 && (
        <div className="p-12 text-center bg-white rounded-2xl border border-slate-200 border-dashed">
          <LayoutGrid className="w-12 h-12 text-slate-300 mx-auto mb-4" />
          <p className="text-slate-500 font-medium">No sectors matched your search.</p>
        </div>
      )}

      {/* Add / Edit Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-sm overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between p-6 border-b border-slate-100 bg-slate-50/50">
              <h3 className="text-lg font-black text-slate-900">
                {editingSector ? 'Edit Sector' : 'Create Sector'}
              </h3>
              <button 
                onClick={handleCloseModal}
                className="text-slate-400 hover:text-slate-600 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">Sector Name</label>
                <input 
                  type="text" 
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 font-medium transition-colors"
                  placeholder="e.g. Automotive"
                />
              </div>
              
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">Unique Code</label>
                <input 
                  type="text" 
                  required
                  value={formData.code}
                  onChange={(e) => setFormData({ ...formData, code: e.target.value.toLowerCase().replace(/\s+/g, '_') })}
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 font-medium transition-colors font-mono"
                  placeholder="e.g. auto_mf"
                />
                <p className="mt-2 text-xs text-slate-500">Must be lowercase, no spaces (use underscores).</p>
              </div>

              <div className="pt-4 flex gap-3">
                <button 
                  type="button"
                  onClick={handleCloseModal}
                  className="flex-1 px-4 py-2.5 border border-slate-200 text-slate-600 rounded-lg text-sm font-bold hover:bg-slate-50 transition-colors"
                >
                  Cancel
                </button>
                <button 
                  type="submit"
                  className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 bg-indigo-600 text-white rounded-lg text-sm font-bold hover:bg-indigo-700 transition-colors shadow-sm"
                >
                  <Save className="w-4 h-4" />
                  {editingSector ? 'Save Changes' : 'Create'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

const SectorManagement = () => {
  const [sectors, setSectors] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [mode, setMode] = useState("create"); // create | edit
  const [editingSectorId, setEditingSectorId] = useState(null);

  const emptyForm = { name: "", code: "" };
  const [formData, setFormData] = useState(emptyForm);

  const filteredSectors = useMemo(() => {
    const q = searchTerm.trim().toLowerCase();
    if (!q) return sectors;
    return sectors.filter((s) => (s.name || "").toLowerCase().includes(q) || (s.code || "").toLowerCase().includes(q));
  }, [sectors, searchTerm]);

  const load = async () => {
    setLoading(true);
    setError("");
    try {
      const res = await superuserService.listSectors();
      setSectors(res.data || []);
    } catch (err) {
      setError(err?.response?.data?.detail || err?.message || "Failed to load sectors.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingSectorId(null);
    setMode("create");
    setFormData(emptyForm);
  };

  const openCreate = () => {
    setMode("create");
    setEditingSectorId(null);
    setFormData(emptyForm);
    setIsModalOpen(true);
  };

  const openEdit = (s) => {
    setMode("edit");
    setEditingSectorId(s.id);
    setFormData({ name: s.name || "", code: s.code || "" });
    setIsModalOpen(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this sector?")) return;
    try {
      await superuserService.deleteSector(id);
      await load();
    } catch (err) {
      alert(err?.response?.data?.detail || err?.message || "Failed to delete sector.");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const payload = { name: formData.name.trim(), code: formData.code.trim().toLowerCase() };
      if (mode === "create") {
        await superuserService.createSector(payload);
      } else {
        await superuserService.updateSector(editingSectorId, payload);
      }
      closeModal();
      await load();
    } catch (err) {
      alert(err?.response?.data?.detail || err?.response?.data || err?.message || "Operation failed.");
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row gap-4 justify-between items-center">
        <div className="relative w-full max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search sectors..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-white border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
          />
        </div>
        <button
          onClick={openCreate}
          className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg text-sm font-bold shadow-sm hover:bg-indigo-700 transition-colors"
        >
          <Plus className="w-4 h-4" />
          Create Sector
        </button>
      </div>

      {error && (
        <div className="text-sm text-rose-600 font-semibold bg-rose-50 border border-rose-200 rounded-xl p-3">{error}</div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {loading ? (
          <div className="col-span-full p-10 text-center text-slate-500">Loading...</div>
        ) : filteredSectors.length === 0 ? (
          <div className="col-span-full p-12 text-center bg-white rounded-2xl border border-slate-200 border-dashed">
            <LayoutGrid className="w-12 h-12 text-slate-300 mx-auto mb-4" />
            <p className="text-slate-500 font-medium">No sectors matched your search.</p>
          </div>
        ) : (
          filteredSectors.map((s) => (
            <div key={s.id} className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm hover:shadow-lg transition-all duration-300 group">
              <div className="flex items-start justify-between mb-4">
                <div className="p-3 bg-indigo-50 text-indigo-600 rounded-xl group-hover:bg-indigo-600 group-hover:text-white transition-colors duration-300">
                  <LayoutGrid className="w-6 h-6" />
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => openEdit(s)}
                    className="p-1.5 text-slate-400 hover:text-indigo-600 bg-slate-50 hover:bg-indigo-50 rounded transition-colors"
                    title="Edit sector"
                  >
                    <Edit2 className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleDelete(s.id)}
                    className="p-1.5 text-slate-400 hover:text-rose-600 bg-slate-50 hover:bg-rose-50 rounded transition-colors"
                    title="Delete sector"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>

              <h3 className="text-xl font-black text-slate-900 mb-1">{s.name}</h3>
              <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-6 border-b border-slate-100 pb-4">
                Code: <span className="text-slate-600">{s.code}</span>
              </p>
            </div>
          ))
        )}
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-sm overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between p-6 border-b border-slate-100 bg-slate-50/50">
              <h3 className="text-lg font-black text-slate-900">{mode === "edit" ? "Edit Sector" : "Create Sector"}</h3>
              <button onClick={closeModal} className="text-slate-400 hover:text-slate-600 transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">Sector Name</label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 font-medium transition-colors"
                  placeholder="e.g. Automotive"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">Unique Code</label>
                <input
                  type="text"
                  required
                  value={formData.code}
                  onChange={(e) => setFormData({ ...formData, code: e.target.value })}
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 font-medium transition-colors font-mono"
                  placeholder="e.g. automotive"
                />
                <p className="mt-2 text-xs text-slate-500">Must be lowercase (no spaces).</p>
              </div>

              <div className="pt-4 flex gap-3">
                <button type="button" onClick={closeModal} className="flex-1 px-4 py-2.5 border border-slate-200 text-slate-600 rounded-lg text-sm font-bold hover:bg-slate-50 transition-colors">
                  Cancel
                </button>
                <button type="submit" className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 bg-indigo-600 text-white rounded-lg text-sm font-bold hover:bg-indigo-700 transition-colors shadow-sm">
                  <Save className="w-4 h-4" />
                  {mode === "edit" ? "Save Changes" : "Create"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default SectorManagement;
