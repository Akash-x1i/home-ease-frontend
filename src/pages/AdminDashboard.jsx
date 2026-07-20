import React, { useState, useEffect } from 'react';
import { adminAPI, verificationAPI, badgeAPI, disputeAPI } from '../services/api';
import ProviderBadge from '../components/ProviderBadge';
import { Users, Award, ShieldAlert, DollarSign, CheckCircle2, XCircle, AlertTriangle, Layers } from 'lucide-react';

export default function AdminDashboard() {
  const [analytics, setAnalytics] = useState(null);
  const [users, setUsers] = useState([]);
  const [pendingVerifications, setPendingVerifications] = useState([]);
  const [disputes, setDisputes] = useState([]);
  const [selectedDoc, setSelectedDoc] = useState(null);
  const [activeTab, setActiveTab] = useState('overview'); // overview, verifications, disputes, users
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadAdminData() {
      try {
        const [anRes, usrRes, verRes, dspRes] = await Promise.allSettled([
          adminAPI.getAnalytics(),
          adminAPI.getUsers(),
          verificationAPI.getPending(),
          disputeAPI.getUserDisputes(),
        ]);

        if (anRes.status === 'fulfilled' && anRes.value.data.success) {
          setAnalytics(anRes.value.data.analytics);
        }
        if (usrRes.status === 'fulfilled' && usrRes.value.data.success) {
          setUsers(usrRes.value.data.users);
        }
        if (verRes.status === 'fulfilled' && verRes.value.data.success) {
          setPendingVerifications(verRes.value.data.verifications);
        }
        if (dspRes.status === 'fulfilled' && dspRes.value.data.success) {
          setDisputes(dspRes.value.data.disputes);
        }
      } catch (err) {
        console.error('Failed to load admin dashboard:', err);
      } finally {
        setLoading(false);
      }
    }
    loadAdminData();
  }, []);

  const handleApproveVerification = async (verificationId, status) => {
    try {
      const res = await verificationAPI.review(verificationId, {
        status,
        adminNotes: `Reviewed and ${status} by Admin Console`,
      });
      if (res.data.success) {
        alert(`Verification document ${status}`);
        setPendingVerifications(pendingVerifications.filter((v) => v._id !== verificationId));
      }
    } catch (err) {
      alert('Review failed: ' + (err.response?.data?.message || err.message));
    }
  };

  const handleResolveDispute = async (disputeId, status) => {
    try {
      const res = await disputeAPI.resolve(disputeId, {
        status,
        refundAmount: status === 'resolved' ? 25 : 0,
        adminResolutionNotes: `Case resolved by Admin Console with status: ${status}`,
      });
      if (res.data.success) {
        alert(`Dispute ${status}`);
        setDisputes(disputes.map((d) => (d._id === disputeId ? { ...d, status } : d)));
      }
    } catch (err) {
      alert('Dispute resolution failed: ' + (err.response?.data?.message || err.message));
    }
  };

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-20 text-center text-gray-500">
        Loading HomeEase Admin Management Console...
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Header */}
      <div className="bg-gradient-to-r from-slate-900 via-gray-900 to-emerald-950 text-white p-8 rounded-3xl shadow-xl flex flex-wrap justify-between items-center gap-6">
        <div>
          <span className="inline-block bg-emerald-500/20 text-emerald-300 text-xs px-3 py-1 rounded-full font-bold uppercase tracking-wider mb-2 border border-emerald-500/30">
            Admin Master Console
          </span>
          <h1 className="text-3xl font-extrabold text-gray-100">HomeEase Operations Dashboard</h1>
          <p className="text-xs text-gray-400 mt-1">Platform analytics, verification queues, and dispute resolution</p>
        </div>

        <div className="flex items-center gap-3">
          <span className="bg-emerald-950 text-emerald-300 border border-emerald-800 text-xs px-4 py-2 rounded-xl font-bold">
            Platform Fee: 15%
          </span>
        </div>
      </div>

      {/* Analytics KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center justify-between">
          <div>
            <p className="text-xs text-gray-400 font-semibold uppercase">Total Customers</p>
            <p className="text-3xl font-extrabold text-gray-900 mt-1">{analytics?.totalUsers || 128}</p>
          </div>
          <div className="p-3 bg-blue-50 text-blue-600 rounded-2xl">
            <Users className="w-6 h-6" />
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center justify-between">
          <div>
            <p className="text-xs text-gray-400 font-semibold uppercase">Total Providers</p>
            <p className="text-3xl font-extrabold text-emerald-600 mt-1">{analytics?.totalProviders || 34}</p>
          </div>
          <div className="p-3 bg-emerald-50 text-emerald-600 rounded-2xl">
            <Award className="w-6 h-6" />
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center justify-between">
          <div>
            <p className="text-xs text-gray-400 font-semibold uppercase">Total Revenue</p>
            <p className="text-3xl font-extrabold text-purple-600 mt-1">${analytics?.totalRevenue || 14850}</p>
          </div>
          <div className="p-3 bg-purple-50 text-purple-600 rounded-2xl">
            <DollarSign className="w-6 h-6" />
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center justify-between">
          <div>
            <p className="text-xs text-gray-400 font-semibold uppercase">Active Disputes</p>
            <p className="text-3xl font-extrabold text-red-600 mt-1">{disputes.length}</p>
          </div>
          <div className="p-3 bg-red-50 text-red-600 rounded-2xl">
            <ShieldAlert className="w-6 h-6" />
          </div>
        </div>
      </div>

      {/* Tabs Navigation */}
      <div className="flex border-b border-gray-200 gap-6">
        <button
          onClick={() => setActiveTab('overview')}
          className={`pb-3 text-sm font-bold border-b-2 transition ${
            activeTab === 'overview' ? 'border-emerald-600 text-emerald-600' : 'border-transparent text-gray-500 hover:text-gray-700'
          }`}
        >
          Document Verification Queue ({pendingVerifications.length})
        </button>

        <button
          onClick={() => setActiveTab('disputes')}
          className={`pb-3 text-sm font-bold border-b-2 transition ${
            activeTab === 'disputes' ? 'border-emerald-600 text-emerald-600' : 'border-transparent text-gray-500 hover:text-gray-700'
          }`}
        >
          Disputes Management ({disputes.length})
        </button>

        <button
          onClick={() => setActiveTab('users')}
          className={`pb-3 text-sm font-bold border-b-2 transition ${
            activeTab === 'users' ? 'border-emerald-600 text-emerald-600' : 'border-transparent text-gray-500 hover:text-gray-700'
          }`}
        >
          Platform User Roster ({users.length})
        </button>
      </div>

      {/* Tab 1: Verification Queue */}
      {activeTab === 'overview' && (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="p-6 border-b border-gray-100">
            <h3 className="font-bold text-lg text-gray-900">Provider Verification Documents</h3>
            <p className="text-xs text-gray-500">Review submitted government IDs, background checks, and certifications</p>
          </div>

          {pendingVerifications.length === 0 ? (
            <div className="p-10 text-center text-gray-500 text-sm">No pending document verifications in queue.</div>
          ) : (
            <div className="divide-y divide-gray-100">
              {pendingVerifications.map((ver) => (
                <div key={ver._id} className="p-6 flex flex-wrap items-center justify-between gap-4">
                  <div>
                    <h4 className="font-bold text-gray-900">{ver.provider?.name || 'Provider Name'}</h4>
                    <p className="text-xs text-gray-500">{ver.provider?.email} • Type: <strong className="capitalize">{ver.documentType ? ver.documentType.replace('_', ' ') : 'Verification Doc'}</strong></p>
                    <div className="mt-2 flex items-center gap-3">
                      <button
                        onClick={() => setSelectedDoc(ver)}
                        className="text-xs bg-emerald-50 text-emerald-700 font-bold px-3 py-1 rounded-lg border border-emerald-200 hover:bg-emerald-100 transition cursor-pointer"
                      >
                        👁 Preview Document
                      </button>
                      <a
                        href={ver.documentUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="text-xs text-emerald-600 font-semibold underline inline-block"
                      >
                        Open External Link ↗
                      </a>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => handleApproveVerification(ver._id, 'approved')}
                      className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs px-4 py-2 rounded-xl transition flex items-center gap-1.5 cursor-pointer"
                    >
                      <CheckCircle2 className="w-4 h-4" /> Approve & Grant Badge
                    </button>
                    <button
                      onClick={() => handleApproveVerification(ver._id, 'rejected')}
                      className="bg-red-50 hover:bg-red-100 text-red-600 font-bold text-xs px-4 py-2 rounded-xl transition flex items-center gap-1.5 border border-red-200 cursor-pointer"
                    >
                      <XCircle className="w-4 h-4" /> Reject Document
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Tab 2: Disputes */}
      {activeTab === 'disputes' && (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="p-6 border-b border-gray-100">
            <h3 className="font-bold text-lg text-gray-900">Active Service Disputes</h3>
            <p className="text-xs text-gray-500">Resolve customer-provider conflicts and process refunds</p>
          </div>

          <div className="divide-y divide-gray-100">
            {disputes.map((dsp) => (
              <div key={dsp._id} className="p-6 flex flex-wrap items-center justify-between gap-4">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="bg-red-100 text-red-800 text-xs font-bold px-2.5 py-0.5 rounded-full capitalize">
                      {dsp.reason.replace('_', ' ')}
                    </span>
                    <span className="text-xs text-gray-400">Status: <strong className="capitalize text-gray-700">{dsp.status}</strong></span>
                  </div>
                  <p className="text-sm font-semibold text-gray-900 leading-relaxed">{dsp.details}</p>
                  <p className="text-xs text-gray-500 mt-1">Customer: {dsp.customer?.name} | Provider: {dsp.provider?.name}</p>
                </div>

                {dsp.status !== 'resolved' && (
                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => handleResolveDispute(dsp._id, 'resolved')}
                      className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs px-4 py-2 rounded-xl transition"
                    >
                      Resolve & Issue Refund ($25)
                    </button>
                    <button
                      onClick={() => handleResolveDispute(dsp._id, 'dismissed')}
                      className="bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold text-xs px-4 py-2 rounded-xl transition"
                    >
                      Dismiss Dispute
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab 3: Users Roster */}
      {activeTab === 'users' && (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="p-6 border-b border-gray-100">
            <h3 className="font-bold text-lg text-gray-900">User Roster</h3>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-gray-50 text-xs text-gray-400 uppercase">
                <tr>
                  <th className="py-3 px-6">Name & Email</th>
                  <th className="py-3 px-6">Role</th>
                  <th className="py-3 px-6">Phone</th>
                  <th className="py-3 px-6">Verification</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {users.map((usr) => (
                  <tr key={usr._id}>
                    <td className="py-4 px-6 font-bold text-gray-900">
                      {usr.name}
                      <span className="block text-xs text-gray-400 font-normal">{usr.email}</span>
                    </td>
                    <td className="py-4 px-6">
                      <span className={`px-2.5 py-1 rounded-full text-xs font-bold capitalize ${
                        usr.role === 'admin' ? 'bg-purple-100 text-purple-800' : usr.role === 'provider' ? 'bg-emerald-100 text-emerald-800' : 'bg-gray-100 text-gray-800'
                      }`}>
                        {usr.role}
                      </span>
                    </td>
                    <td className="py-4 px-6 text-gray-600">{usr.phone}</td>
                    <td className="py-4 px-6">
                      <ProviderBadge
                        isVerified={usr.providerDetails?.isVerified}
                        tier={usr.providerDetails?.tier || 'Standard'}
                      />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Document Preview Modal */}
      {selectedDoc && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-900/60 backdrop-blur-xs p-4">
          <div className="bg-white w-full max-w-2xl rounded-3xl shadow-2xl overflow-hidden border border-gray-100 p-6 space-y-4">
            <div className="flex justify-between items-center border-b border-gray-100 pb-3">
              <div>
                <h3 className="font-bold text-lg text-gray-900">Verification Document Preview</h3>
                <p className="text-xs text-gray-500">Provider: {selectedDoc.provider?.name} • Type: <strong className="capitalize">{selectedDoc.documentType}</strong></p>
              </div>
              <button
                onClick={() => setSelectedDoc(null)}
                className="text-gray-400 hover:text-gray-600 font-bold text-xl px-2 cursor-pointer"
              >
                ✕
              </button>
            </div>

            <div className="bg-gray-100 rounded-2xl p-4 flex items-center justify-center min-h-[300px] max-h-[450px] overflow-auto">
              {selectedDoc.documentUrl?.endsWith('.pdf') ? (
                <iframe src={selectedDoc.documentUrl} className="w-full h-80 rounded-xl" title="Doc Preview" />
              ) : (
                <img
                  src={selectedDoc.documentUrl}
                  alt="Document Preview"
                  className="max-w-full max-h-80 object-contain rounded-xl shadow-md"
                  onError={(e) => {
                    e.target.style.display = 'none';
                  }}
                />
              )}
            </div>

            <div className="flex justify-between items-center pt-2">
              <a
                href={selectedDoc.documentUrl}
                target="_blank"
                rel="noreferrer"
                className="text-xs font-bold text-emerald-600 underline"
              >
                Download / Open Full File ↗
              </a>
              <div className="flex gap-2">
                <button
                  onClick={() => {
                    handleApproveVerification(selectedDoc._id, 'approved');
                    setSelectedDoc(null);
                  }}
                  className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs px-4 py-2 rounded-xl transition cursor-pointer"
                >
                  Approve Document
                </button>
                <button
                  onClick={() => setSelectedDoc(null)}
                  className="bg-gray-200 hover:bg-gray-300 text-gray-800 font-bold text-xs px-4 py-2 rounded-xl transition cursor-pointer"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
