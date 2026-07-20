import React, { useState } from 'react';
import { userAPI, verificationAPI, paymentAPI } from '../services/api';
import ProviderBadge from '../components/ProviderBadge';
import { User, Phone, Mail, ShieldCheck, Upload, CreditCard, CheckCircle2, Award } from 'lucide-react';

export default function Profile() {
  const storedUserRaw = localStorage.getItem('homeease_user');
  const user = storedUserRaw ? JSON.parse(storedUserRaw) : null;

  const [formData, setFormData] = useState({
    name: user?.name || '',
    phone: user?.phone || '',
    skills: user?.providerDetails?.skills?.join(', ') || 'Plumbing, Electrical',
    hourlyRate: user?.providerDetails?.hourlyRate || 50,
  });

  const [docType, setDocType] = useState('government_id');
  const [docUrl, setDocUrl] = useState('');
  const [isUpdating, setIsUpdating] = useState(false);
  const [isSubmittingDoc, setIsSubmittingDoc] = useState(false);

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    setIsUpdating(true);
    try {
      const skillsArray = formData.skills.split(',').map((s) => s.trim());
      const res = await userAPI.updateProfile({
        name: formData.name,
        phone: formData.phone,
        skills: skillsArray,
        hourlyRate: Number(formData.hourlyRate),
      });

      if (res.data.success) {
        alert('Profile updated successfully!');
        const updatedUser = { ...user, ...res.data.user };
        localStorage.setItem('homeease_user', JSON.stringify(updatedUser));
      }
    } catch (err) {
      alert('Profile update notice: ' + (err.response?.data?.message || err.message));
    } finally {
      setIsUpdating(false);
    }
  };

  const handleSubmitVerificationDoc = async (e) => {
    e.preventDefault();
    if (!docUrl.trim()) return;
    setIsSubmittingDoc(true);

    try {
      const res = await verificationAPI.submit({
        documentType: docType,
        documentUrl: docUrl,
      });

      if (res.data.success) {
        alert('Verification document submitted for admin review!');
        setDocUrl('');
      }
    } catch (err) {
      alert('Document submission notice: ' + (err.response?.data?.message || err.message));
    } finally {
      setIsSubmittingDoc(false);
    }
  };

  const handleConnectStripe = async () => {
    try {
      const res = await paymentAPI.connectAccount();
      if (res.data.success) {
        alert('Stripe Connect payout account linked: ' + res.data.stripeAccountId);
      }
    } catch (err) {
      alert('Stripe Connect setup error: ' + err.message);
    }
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Header Profile Card */}
      <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100 flex flex-wrap items-center justify-between gap-6">
        <div className="flex items-center gap-5">
          <div className="w-20 h-20 bg-emerald-600 text-white font-extrabold text-3xl rounded-3xl flex items-center justify-center shadow-lg">
            {user?.name?.charAt(0) || 'U'}
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">{user?.name || 'User Profile'}</h1>
            <p className="text-xs text-gray-500">{user?.email} • <span className="capitalize font-semibold text-emerald-600">{user?.role || 'Customer'}</span></p>
            <div className="mt-2">
              <ProviderBadge
                isVerified={user?.providerDetails?.isVerified}
                tier={user?.providerDetails?.tier || 'Standard'}
              />
            </div>
          </div>
        </div>

        {user?.role === 'provider' && (
          <button
            onClick={handleConnectStripe}
            className="bg-gray-900 hover:bg-emerald-600 text-white font-bold text-xs px-4 py-3 rounded-xl transition flex items-center gap-2 shadow-md"
          >
            <CreditCard className="w-4 h-4 text-emerald-400" /> Link Stripe Connect Payout Account
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Profile Settings Form */}
        <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100">
          <h3 className="font-bold text-lg text-gray-900 mb-4 flex items-center gap-2">
            <User className="w-5 h-5 text-emerald-600" />
            Edit Profile Details
          </h3>

          <form onSubmit={handleUpdateProfile} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-gray-600 mb-1">Full Name</label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full border border-gray-200 rounded-xl px-3.5 py-2.5 text-sm focus:ring-2 focus:ring-emerald-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-600 mb-1">Phone Number</label>
              <input
                type="text"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                className="w-full border border-gray-200 rounded-xl px-3.5 py-2.5 text-sm focus:ring-2 focus:ring-emerald-500"
              />
            </div>

            {user?.role === 'provider' && (
              <>
                <div>
                  <label className="block text-xs font-semibold text-gray-600 mb-1">Skills (Comma Separated)</label>
                  <input
                    type="text"
                    value={formData.skills}
                    onChange={(e) => setFormData({ ...formData, skills: e.target.value })}
                    className="w-full border border-gray-200 rounded-xl px-3.5 py-2.5 text-sm focus:ring-2 focus:ring-emerald-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-600 mb-1">Hourly Base Rate ($/hr)</label>
                  <input
                    type="number"
                    value={formData.hourlyRate}
                    onChange={(e) => setFormData({ ...formData, hourlyRate: e.target.value })}
                    className="w-full border border-gray-200 rounded-xl px-3.5 py-2.5 text-sm focus:ring-2 focus:ring-emerald-500"
                  />
                </div>
              </>
            )}

            <button
              type="submit"
              disabled={isUpdating}
              className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-3 rounded-xl transition shadow-md disabled:opacity-50"
            >
              {isUpdating ? 'Saving Profile...' : 'Save Profile Changes'}
            </button>
          </form>
        </div>

        {/* Verification Document Upload (Providers) */}
        <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100">
          <h3 className="font-bold text-lg text-gray-900 mb-2 flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-emerald-600" />
            Verification Badges & Documents
          </h3>
          <p className="text-xs text-gray-500 mb-6">Upload credentials to earn Verified Skill & Background Badges</p>

          <form onSubmit={handleSubmitVerificationDoc} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-gray-600 mb-1">Document Type</label>
              <select
                value={docType}
                onChange={(e) => setDocType(e.target.value)}
                className="w-full border border-gray-200 rounded-xl px-3.5 py-2.5 text-sm bg-gray-50 focus:ring-2 focus:ring-emerald-500"
              >
                <option value="government_id">Government ID (Passport / License)</option>
                <option value="skill_certificate">Skill Certificate (Trade License)</option>
                <option value="background_check">Background Check Report</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-600 mb-1">Document URL / Image Link</label>
              <input
                type="url"
                required
                value={docUrl}
                onChange={(e) => setDocUrl(e.target.value)}
                placeholder="https://example.com/document.pdf"
                className="w-full border border-gray-200 rounded-xl px-3.5 py-2.5 text-sm focus:ring-2 focus:ring-emerald-500"
              />
            </div>

            <button
              type="submit"
              disabled={isSubmittingDoc || !docUrl.trim()}
              className="w-full bg-gray-900 hover:bg-emerald-600 text-white font-bold py-3 rounded-xl transition shadow-md disabled:opacity-50 flex items-center justify-center gap-2"
            >
              <Upload className="w-4 h-4 text-emerald-400" />
              {isSubmittingDoc ? 'Submitting Document...' : 'Submit Document for Review'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
