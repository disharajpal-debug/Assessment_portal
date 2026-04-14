import api from "./api";

export const adminService = {
  getSummary: () => api.get("assessment/admin/summary/"),

  listClients: () => api.get("assessment/admin/clients/"),
  createClient: (payload) => api.post("assessment/admin/clients/", payload),
  updateClient: (id, payload) => api.put(`assessment/admin/clients/${id}/`, payload),
  deleteClient: (id) => api.delete(`assessment/admin/clients/${id}/`),

  listAssessors: () => api.get("assessment/admin/assessors/"),
  createAssessor: (payload) => api.post("assessment/admin/assessors/", payload),
  updateAssessor: (id, payload) => api.put(`assessment/admin/assessors/${id}/`, payload),
  deleteAssessor: (id) => api.delete(`assessment/admin/assessors/${id}/`),

  listAssignments: () => api.get("assessment/admin/assignments/"),
  createAssignment: (payload) => api.post("assessment/admin/assignments/", payload),
  updateAssignment: (id, payload) => api.put(`assessment/admin/assignments/${id}/`, payload),
  deleteAssignment: (id) => api.delete(`assessment/admin/assignments/${id}/`),

  listAssessments: () => api.get("assessment/"),
};

