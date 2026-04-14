import api from './api';

export const assessmentService = {
  getStats: () => api.get('assessment/stats/'),
  getClients: () => api.get('assessment/clients/'),
  getAssessorAnalytics: (params = {}) => api.get('assessment/assessor/analytics/', { params }),
  getAssessorDashboard: (params = {}) => api.get('assessor/dashboard/', { params }),
  getAssessments: () => api.get('assessment/'),
  getAssessmentById: (id) => api.get(`assessment/${id}/`),
  getAssessmentForReview: (id) => api.get(`assessment/${id}/review/`),
  createAssessment: (data) => api.post('assessment/', data),
  updateAssessment: (id, data) => api.put(`assessment/${id}/update/`, data),
  reviewAssessment: (id, data) => api.put(`assessment/${id}/review/`, data),
  submitAssessment: (id) => api.post(`assessment/${id}/submit/`),
};
