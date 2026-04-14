import api from "./api";

export const superuserService = {
  getSummary: () => api.get("assessment/superuser/summary/"),

  // Users are mounted under /api/auth/ in config/urls.py
  listUsers: () => api.get("auth/users/"),
  createUser: (payload) => api.post("auth/users/", payload),
  updateUserRole: (id, payload) => api.put(`auth/users/${id}/`, payload),
  deleteUser: (id) => api.delete(`auth/users/${id}/`),

  // Sectors
  listSectors: () => api.get("sectors/"),
  createSector: (payload) => api.post("sectors/", payload),
  updateSector: (id, payload) => api.put(`sectors/${id}/`, payload),
  deleteSector: (id) => api.delete(`sectors/${id}/`),

  // Assignments
  listAssignments: () => api.get("assessment/assignments/"),
  createAssignment: (payload) => api.post("assessment/assignments/", payload),
  updateAssignment: (id, payload) => api.put(`assessment/assignments/${id}/`, payload),
  deleteAssignment: (id) => api.delete(`assessment/assignments/${id}/`),
  listAssessments: () => api.get("assessment/"),

  // Question catalogs
  getQuestionCatalog: (category, sector_code) => {
    const params = { category };
    if (sector_code !== undefined && sector_code !== null) {
      params.sector_code = sector_code;
    }
    return api.get("questions/catalog/", { params });
  },
  saveQuestionCatalog: (payload) => api.put("questions/catalog/", payload),
};

