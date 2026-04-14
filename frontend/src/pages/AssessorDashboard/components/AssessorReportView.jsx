import React, { useEffect, useState } from 'react';
import { Navigate, useParams } from 'react-router-dom';
import { assessmentService } from '../../../services/assessmentService';

const AssessorReportView = () => {
  const { id } = useParams();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [reportState, setReportState] = useState(null);

  useEffect(() => {
    let cancelled = false;
    const load = async () => {
      setLoading(true);
      setError('');
      try {
        const res = await assessmentService.getAssessmentForReview(id);
        const asmt = res.data;
        if (cancelled) return;
        setReportState({
          responses: asmt.responses_out || [],
          sector: asmt.sector,
          autoDownload: false,
        });
      } catch (err) {
        if (cancelled) return;
        setError(err?.response?.data?.detail || err?.message || 'Failed to load report.');
      } finally {
        if (!cancelled) setLoading(false);
      }
    };
    load();
    return () => {
      cancelled = true;
    };
  }, [id]);

  if (loading) {
    return <div className="min-h-screen bg-slate-50 p-6 text-slate-600">Loading report…</div>;
  }

  if (error) {
    return <div className="min-h-screen bg-slate-50 p-6 text-rose-600 font-semibold">{error}</div>;
  }

  if (!reportState) {
    return <div className="min-h-screen bg-slate-50 p-6 text-slate-600">Report data not found.</div>;
  }

  return <Navigate to="/report" state={reportState} replace />;
};

export default AssessorReportView;
