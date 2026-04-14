import React, { useState } from 'react';
import { Building, Briefcase, Mail, User, Save, CheckCircle2 } from 'lucide-react';
import {
  buildInitialClientForm,
  getClientAssessmentProfile,
  setClientAssessmentProfile,
} from '../../utils/clientProfile';

const ClientProfileTab = ({ user }) => {
  const [formData, setFormData] = useState(() =>
    buildInitialClientForm(user, getClientAssessmentProfile(user)),
  );
  const [errors, setErrors] = useState({});
  const [savedFlash, setSavedFlash] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: '' }));
  };

  const validate = () => {
    const next = {};
    if (!formData.companyName.trim()) next.companyName = 'Company name is required';
    if (!formData.contactPerson.trim()) next.contactPerson = 'Contact person is required';
    if (!formData.email.trim() || !/\S+@\S+\.\S+/.test(formData.email)) {
      next.email = 'Valid email is required';
    }
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate() || !user) return;
    setClientAssessmentProfile(user, formData);
    setSavedFlash(true);
    window.setTimeout(() => setSavedFlash(false), 2500);
  };

  const sectorLabel = user?.sector
    ? String(user.sector).replace(/_/g, ' ')
    : 'Not set';

  return (
    <div className="overflow-hidden rounded-2xl border border-slate-200/90 bg-white shadow-xl shadow-slate-200/50">
      <div className="border-b border-slate-100 bg-gradient-to-r from-slate-50 via-white to-violet-50/40 px-5 py-4 sm:px-6">
        <h2 className="text-lg font-bold text-slate-900">Assessment profile</h2>
        <p className="mt-1 text-sm text-slate-600">
          These details match the &quot;new assessment&quot; form. Saving here auto-fills when you start
          an assessment. Sector comes from your account.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6 p-5 sm:p-8">
        {savedFlash && (
          <div
            className="flex items-center gap-2 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm font-medium text-emerald-900"
            role="status"
          >
            <CheckCircle2 className="h-5 w-5 shrink-0 text-emerald-600" aria-hidden />
            Profile saved. It will be used the next time you start an assessment.
          </div>
        )}

        <div className="rounded-xl border border-slate-100 bg-slate-50/80 px-4 py-3 text-sm text-slate-700">
          <span className="font-semibold text-slate-800">Sector (account): </span>
          <span className="capitalize">{sectorLabel}</span>
        </div>

        <div>
          <label htmlFor="profile-company" className="block text-sm font-semibold text-slate-700 mb-2">
            Company name
          </label>
          <div className="relative">
            <Building className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" aria-hidden />
            <input
              id="profile-company"
              type="text"
              name="companyName"
              value={formData.companyName}
              onChange={handleChange}
              placeholder="e.g. Reliance Industries"
              autoComplete="organization"
              className={`w-full rounded-xl border py-3 pl-10 pr-4 text-sm focus:outline-none focus:ring-2 transition-all ${
                errors.companyName
                  ? 'border-red-300 focus:border-red-500 focus:ring-red-500/20'
                  : 'border-slate-200 focus:border-indigo-500 focus:ring-indigo-500/20'
              }`}
            />
          </div>
          {errors.companyName && <p className="mt-1 text-xs text-red-500">{errors.companyName}</p>}
        </div>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          <div>
            <label htmlFor="profile-contact" className="block text-sm font-semibold text-slate-700 mb-2">
              Contact person
            </label>
            <div className="relative">
              <User className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" aria-hidden />
              <input
                id="profile-contact"
                type="text"
                name="contactPerson"
                value={formData.contactPerson}
                onChange={handleChange}
                placeholder="John Doe"
                autoComplete="name"
                className={`w-full rounded-xl border py-3 pl-10 pr-4 text-sm focus:outline-none focus:ring-2 transition-all ${
                  errors.contactPerson
                    ? 'border-red-300 focus:border-red-500 focus:ring-red-500/20'
                    : 'border-slate-200 focus:border-indigo-500 focus:ring-indigo-500/20'
                }`}
              />
            </div>
            {errors.contactPerson && <p className="mt-1 text-xs text-red-500">{errors.contactPerson}</p>}
          </div>

          <div>
            <label htmlFor="profile-email" className="block text-sm font-semibold text-slate-700 mb-2">
              Email address
            </label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" aria-hidden />
              <input
                id="profile-email"
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="john@example.com"
                autoComplete="email"
                className={`w-full rounded-xl border py-3 pl-10 pr-4 text-sm focus:outline-none focus:ring-2 transition-all ${
                  errors.email
                    ? 'border-red-300 focus:border-red-500 focus:ring-red-500/20'
                    : 'border-slate-200 focus:border-indigo-500 focus:ring-indigo-500/20'
                }`}
              />
            </div>
            {errors.email && <p className="mt-1 text-xs text-red-500">{errors.email}</p>}
          </div>
        </div>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          <div>
            <label htmlFor="profile-url" className="block text-sm font-semibold text-slate-700 mb-2">
              Company URL
            </label>
            <input
              id="profile-url"
              type="url"
              name="companyUrl"
              value={formData.companyUrl}
              onChange={handleChange}
              placeholder="https://"
              autoComplete="url"
              className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
            />
          </div>

          <div>
            <label htmlFor="profile-role" className="block text-sm font-semibold text-slate-700 mb-2">
              Role in company
            </label>
            <div className="relative">
              <Briefcase className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" aria-hidden />
              <input
                id="profile-role"
                type="text"
                name="role"
                value={formData.role}
                onChange={handleChange}
                placeholder="e.g. Director"
                autoComplete="organization-title"
                className="w-full rounded-xl border border-slate-200 py-3 pl-10 pr-4 text-sm focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
              />
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          <div>
            <label htmlFor="profile-mobile" className="block text-sm font-semibold text-slate-700 mb-2">
              Mobile number
            </label>
            <input
              id="profile-mobile"
              type="tel"
              name="mobile"
              value={formData.mobile}
              onChange={handleChange}
              placeholder="+1 234 567 890"
              autoComplete="tel"
              className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
            />
          </div>

          <div>
            <label htmlFor="profile-country" className="block text-sm font-semibold text-slate-700 mb-2">
              Country
            </label>
            <input
              id="profile-country"
              type="text"
              name="country"
              value={formData.country}
              onChange={handleChange}
              placeholder="e.g. India"
              autoComplete="country-name"
              className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
            />
          </div>
        </div>

        <div className="flex flex-col gap-3 border-t border-slate-100 pt-6 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-xs text-slate-500">
            Starting an assessment also saves these fields to your profile for next time.
          </p>
          <button
            type="submit"
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-indigo-600 px-6 py-3 text-sm font-semibold text-white shadow-md shadow-indigo-500/25 transition hover:bg-indigo-500 focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2"
          >
            <Save className="h-4 w-4" aria-hidden />
            Save profile
          </button>
        </div>
      </form>
    </div>
  );
};

export default ClientProfileTab;
