import React, { useState } from 'react';
import { disputeAPI } from '../services/api';
import { AlertTriangle, X, ShieldAlert } from 'lucide-react';

export default function DisputeModal({ bookingId, isOpen, onClose, onSuccess }) {
  const [reason, setReason] = useState('quality_issue');
  const [details, setDetails] = useState('');
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!details.trim()) return;
    setLoading(true);

    try {
      const res = await disputeAPI.create({
        bookingId,
        reason,
        details,
      });

      if (res.data.success) {
        alert('Dispute submitted successfully. Our admin support team will review your case.');
        if (onSuccess) onSuccess(res.data.dispute);
        onClose();
      }
    } catch (err) {
      alert('Dispute submission notice: ' + (err.response?.data?.message || err.message));
      onClose();
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-900/60 backdrop-blur-xs p-4">
      <div className="bg-white w-full max-w-lg rounded-3xl shadow-2xl border border-gray-100 overflow-hidden animate-in fade-in zoom-in duration-200">
        <div className="bg-red-50 p-6 border-b border-red-100 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-red-100 text-red-600 rounded-2xl">
              <AlertTriangle className="w-6 h-6" />
            </div>
            <div>
              <h3 className="font-bold text-lg text-gray-900">File Service Dispute</h3>
              <p className="text-xs text-gray-500">Booking #{bookingId ? bookingId.slice(-6) : 'LIVE-101'}</p>
            </div>
          </div>

          <button onClick={onClose} className="p-2 text-gray-400 hover:text-gray-600 rounded-full">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1">Reason for Dispute</label>
            <select
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              className="w-full border border-gray-200 rounded-xl px-3.5 py-2.5 text-sm bg-gray-50 focus:ring-2 focus:ring-red-500 focus:outline-none"
            >
              <option value="quality_issue">Unsatisfactory Work Quality</option>
              <option value="no_show">Provider No-Show / Late Arrival</option>
              <option value="overcharged">Overcharged / Incorrect Rate</option>
              <option value="damaged_property">Property Damage</option>
              <option value="other">Other Issue</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1">Dispute Details & Evidence</label>
            <textarea
              rows={4}
              required
              value={details}
              onChange={(e) => setDetails(e.target.value)}
              placeholder="Describe what happened and why you are opening a dispute..."
              className="w-full border border-gray-200 rounded-xl px-3.5 py-2.5 text-sm bg-gray-50 focus:ring-2 focus:ring-red-500 focus:outline-none"
            />
          </div>

          <div className="pt-2 flex gap-3">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold py-3 rounded-xl transition text-sm"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading || !details.trim()}
              className="flex-1 bg-red-600 hover:bg-red-700 text-white font-bold py-3 rounded-xl transition text-sm shadow-lg hover:shadow-red-500/20 disabled:opacity-50"
            >
              {loading ? 'Submitting Dispute...' : 'Submit Dispute'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
