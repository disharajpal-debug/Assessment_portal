const STORAGE_PREFIX = 'client_assessment_profile:';

export function getClientProfileStorageKey(user) {
  if (!user) return null;
  const id = user.id != null ? String(user.id) : String(user.username ?? '');
  if (!id) return null;
  return `${STORAGE_PREFIX}${id}`;
}

/**
 * Saved assessment-target fields (matches CreateAssessment / clientData shape).
 * Sector is taken from the account, not stored here.
 */
export function getClientAssessmentProfile(user) {
  const storageKey = getClientProfileStorageKey(user);
  if (!storageKey) return null;
  const raw = localStorage.getItem(storageKey);
  if (!raw) return null;
  try {
    const data = JSON.parse(raw);
    if (!data || typeof data !== 'object') return null;
    return data;
  } catch {
    return null;
  }
}

export function setClientAssessmentProfile(user, profile) {
  const storageKey = getClientProfileStorageKey(user);
  if (!storageKey) return;
  const payload = {
    companyName: String(profile?.companyName ?? '').trim(),
    contactPerson: String(profile?.contactPerson ?? '').trim(),
    email: String(profile?.email ?? '').trim(),
    companyUrl: String(profile?.companyUrl ?? '').trim(),
    role: String(profile?.role ?? '').trim(),
    mobile: String(profile?.mobile ?? '').trim(),
    country: String(profile?.country ?? '').trim(),
  };
  localStorage.setItem(storageKey, JSON.stringify(payload));
}

/**
 * Merge saved profile with account defaults for the "new assessment" form.
 */
export function buildInitialClientForm(user, saved) {
  const s = saved || {};
  return {
    companyName: s.companyName ?? '',
    contactPerson: s.contactPerson ?? user?.username ?? '',
    email: s.email ?? user?.email ?? '',
    sector: user?.sector || '',
    companyUrl: s.companyUrl ?? '',
    role: s.role ?? '',
    mobile: s.mobile ?? '',
    country: s.country ?? '',
  };
}
