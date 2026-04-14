import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronLeft, Building, User, Mail, Briefcase, ArrowRight } from 'lucide-react';
import { getAuth } from '../../../utils/auth';
import {
  buildInitialClientForm,
  getClientAssessmentProfile,
  setClientAssessmentProfile,
} from '../../../utils/clientProfile';
import { assessmentService } from '../../../services/assessmentService';

const SECTOR_OPTIONS = [
  { value: 'textile', label: 'Textile' },
  { value: 'pharmaceutical', label: 'Pharmaceutical' },
  { value: 'chemicals', label: 'Chemicals' },
  { value: 'wire_cable', label: 'Wire & Cable' },
  { value: 'engineering_goods', label: 'Engineering Goods' },
  { value: 'plastic_packaging', label: 'Plastic & Packaging' }
];

const CreateAssessment = ({ variant = 'assessor', onBack } = {}) => {
  const navigate = useNavigate();
  const user = getAuth();
  const isClient = variant === 'client';
  const defaultSector = user?.sector || '';
  const [formData, setFormData] = useState(() => {
    if (variant === 'client' && user) {
      const saved = getClientAssessmentProfile(user);
      const initial = buildInitialClientForm(user, saved);
      return {
        companyName: initial.companyName,
        contactPerson: initial.contactPerson,
        email: initial.email,
        sector: initial.sector || '',
        companyUrl: initial.companyUrl,
        role: initial.role,
        mobile: initial.mobile,
        country: initial.country,
      };
    }
    return {
      companyName: '',
      contactPerson: isClient ? user?.username || '' : '',
      email: isClient ? user?.email || '' : '',
      sector: isClient ? defaultSector : '',
      companyUrl: '',
      role: '',
      mobile: '',
      country: '',
    };
  });
  const [errors, setErrors] = useState({});
  const [resolvingClient, setResolvingClient] = useState(false);

  const handleBack = () => {
    if (onBack) return onBack();
    navigate(isClient ? '/client' : '/assessor');
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    // Clear error when typing
    if (errors[e.target.name]) {
      setErrors({ ...errors, [e.target.name]: '' });
    }
  };

  const validate = () => {
    let newErrors = {};
    if (!formData.companyName.trim()) newErrors.companyName = 'Company name is required';
    if (!formData.contactPerson.trim()) newErrors.contactPerson = 'Contact person is required';
    if (!formData.email.trim() || !/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Valid email is required';
    }
    if (!isClient && !formData.sector) newErrors.sector = 'Please select a sector';
    if (isClient && !defaultSector) newErrors.sector = 'Client sector is missing. Please check your registration.';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    const clientData = {
      companyName: formData.companyName,
      contactPerson: formData.contactPerson,
      email: formData.email,
      companyUrl: formData.companyUrl,
      role: formData.role,
      mobile: formData.mobile,
      country: formData.country,
    };
    if (isClient && user) {
      setClientAssessmentProfile(user, formData);
    }
    const sector = isClient ? defaultSector : formData.sector;

    let clientId = null;
    if (!isClient) {
      setResolvingClient(true);
      try {
        const res = await assessmentService.getClients();
        const emailNorm = formData.email.trim().toLowerCase();
        const match = (res.data || []).find(
          (c) => (c.email || '').toLowerCase() === emailNorm,
        );
        if (!match) {
          setErrors({
            email:
              'No client account with this email. The client must be registered and assigned to you.',
          });
          setResolvingClient(false);
          return;
        }
        clientId = match.id;
      } catch (err) {
        console.error(err);
        setErrors({ email: 'Could not verify client. Try again.' });
        setResolvingClient(false);
        return;
      }
      setResolvingClient(false);
    }

    const sessionKey = `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;

    navigate('/assessment', {
      state: {
        sector,
        clientData,
        sessionKey,
        ...(clientId != null ? { clientId } : {}),
      },
    });
  };

  return (
    <div
      className={`flex min-h-screen items-center justify-center p-4 sm:p-6 lg:p-8 ${
        isClient ? 'client-shell' : 'bg-slate-50'
      }`}
    >
      <div className="max-w-xl w-full min-w-0">
        {/* Back Button */}
        <button 
          onClick={handleBack}
          className="flex items-center gap-2 text-sm font-medium text-slate-500 hover:text-slate-900 transition-colors mb-6"
        >
          <ChevronLeft className="w-4 h-4" />
          Back to Dashboard
        </button>

        {/* Card */}
        <div className="bg-white rounded-2xl shadow-xl shadow-slate-200/40 p-5 sm:p-8 border border-slate-100">
          <div className="mb-6 sm:mb-8 text-center">
            <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center mx-auto mb-4">
              <Briefcase className="w-6 h-6" />
            </div>
            <h1 className="text-xl sm:text-2xl font-bold text-slate-900 mb-2">New Assessment Target</h1>
            <p className="text-slate-500 text-sm">Enter client details and associate them to a sector to start an evaluation.</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">Company Name</label>
              <div className="relative">
                <Building className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                <input 
                  type="text"
                  name="companyName"
                  value={formData.companyName}
                  onChange={handleChange}
                  placeholder="e.g. Reliance Industries"
                  className={`w-full pl-10 pr-4 py-3 border rounded-xl text-sm focus:outline-none focus:ring-2 transition-all ${
                    errors.companyName ? 'border-red-300 focus:ring-red-500/20 focus:border-red-500' : 'border-slate-200 focus:ring-blue-500/20 focus:border-blue-500'
                  }`}
                />
              </div>
              {errors.companyName && <p className="text-xs text-red-500 mt-1">{errors.companyName}</p>}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">Contact Person</label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                  <input 
                    type="text"
                    name="contactPerson"
                    value={formData.contactPerson}
                    onChange={handleChange}
                    placeholder="John Doe"
                    className={`w-full pl-10 pr-4 py-3 border rounded-xl text-sm focus:outline-none focus:ring-2 transition-all ${
                      errors.contactPerson ? 'border-red-300 focus:ring-red-500/20 focus:border-red-500' : 'border-slate-200 focus:ring-blue-500/20 focus:border-blue-500'
                    }`}
                  />
                </div>
                {errors.contactPerson && <p className="text-xs text-red-500 mt-1">{errors.contactPerson}</p>}
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">Email Address</label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                  <input 
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="john@example.com"
                    className={`w-full pl-10 pr-4 py-3 border rounded-xl text-sm focus:outline-none focus:ring-2 transition-all ${
                      errors.email ? 'border-red-300 focus:ring-red-500/20 focus:border-red-500' : 'border-slate-200 focus:ring-blue-500/20 focus:border-blue-500'
                    }`}
                  />
                </div>
                {errors.email && <p className="text-xs text-red-500 mt-1">{errors.email}</p>}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">Company URL</label>
                <div className="relative">
                  <input 
                    type="url"
                    name="companyUrl"
                    value={formData.companyUrl}
                    onChange={handleChange}
                    placeholder="https://"
                    className="w-full px-4 py-3 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">Role in Company</label>
                <div className="relative">
                  <Briefcase className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                  <input 
                    type="text"
                    name="role"
                    value={formData.role}
                    onChange={handleChange}
                    placeholder="e.g. Director"
                    className="w-full pl-10 pr-4 py-3 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
                  />
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">Mobile Number</label>
                <div className="relative">
                  <input 
                    type="tel"
                    name="mobile"
                    value={formData.mobile}
                    onChange={handleChange}
                    placeholder="+1 234 567 890"
                    className="w-full px-4 py-3 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">Country</label>
                <div className="relative">
                  <input 
                    type="text"
                    name="country"
                    value={formData.country}
                    onChange={handleChange}
                    placeholder="e.g. India"
                    className="w-full px-4 py-3 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
                  />
                </div>
              </div>
            </div>

            {!isClient && (
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">Sector Integration</label>
                <select
                  name="sector"
                  value={formData.sector}
                  onChange={handleChange}
                  className={`w-full px-4 py-3 border rounded-xl text-sm focus:outline-none focus:ring-2 bg-white transition-all appearance-none ${
                    errors.sector ? 'border-red-300 focus:ring-red-500/20 focus:border-red-500 text-red-900' : 'border-slate-200 focus:ring-blue-500/20 focus:border-blue-500 text-slate-700'
                  }`}
                >
                  <option value="" disabled>Select sector module...</option>
                  {SECTOR_OPTIONS.map(opt => (
                    <option key={opt.value} value={opt.value}>
                      {opt.label}
                    </option>
                  ))}
                </select>
                {errors.sector && <p className="text-xs text-red-500 mt-1">{errors.sector}</p>}
              </div>
            )}

            <button 
              type="submit"
              disabled={resolvingClient}
              className="w-full flex items-center justify-center gap-2 py-3.5 mt-8 bg-blue-600 text-white rounded-xl text-sm font-bold hover:bg-blue-700 transition-colors shadow-lg shadow-blue-600/20 disabled:opacity-60 disabled:pointer-events-none"
            >
              {resolvingClient ? 'Checking client…' : 'Start Full Assessment'}
              <ArrowRight className="w-4 h-4 shadow-sm" />
            </button>
            <p className="text-xs text-center text-slate-400 mt-4">
              Proceeding will load the official question tree for the selected sector.
            </p>
          </form>
        </div>
      </div>
    </div>
  );
};

export default CreateAssessment;
