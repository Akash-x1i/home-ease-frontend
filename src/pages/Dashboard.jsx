import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { bookingAPI, paymentAPI } from '../services/api';
import ProviderBadge from '../components/ProviderBadge';
import { Navigation, Clock, CheckCircle, AlertCircle, XCircle } from 'lucide-react';

export default function Dashboard() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('all'); // all, active, completed, cancelled

  useEffect(() => {
    async function loadBookings() {
      try {
        const res = await bookingAPI.getUserBookings();
        if (res.data.success) {
          setBookings(res.data.bookings);
        }
      } catch (err) {
        console.error('Failed to load user bookings:', err);
      } finally {
        setLoading(false);
      }
    }
    loadBookings();
  }, []);

  const handleCancelBooking = async (bookingId) => {
    if (!window.confirm('Are you sure you want to cancel this booking and release the Stripe card hold?')) return;
    try {
      const res = await bookingAPI.updateStatus(bookingId, 'cancelled');
      if (res.data.success) {
        await paymentAPI.cancelHold({ bookingId }).catch(() => {});
        setBookings((prev) =>
          prev.map((b) => (b._id === bookingId ? { ...b, status: 'cancelled', paymentStatus: 'cancelled_released' } : b))
        );
        alert('Booking cancelled and Stripe card hold released!');
      }
    } catch (err) {
      alert('Cancel failed: ' + (err.response?.data?.message || err.message));
    }
  };

  const totalSpent = bookings
    .filter((b) => b.status === 'completed')
    .reduce((sum, b) => sum + (b.priceBreakdown?.finalPrice || 0), 0)
    .toFixed(2);

  const completedCount = bookings.filter((b) => b.status === 'completed').length;
  const activeCount = bookings.filter((b) => ['pending', 'accepted', 'in-progress'].includes(b.status)).length;
  const cancelledCount = bookings.filter((b) => b.status === 'cancelled').length;

  const filteredBookings = bookings.filter((b) => {
    if (activeTab === 'active') return ['pending', 'accepted', 'in-progress'].includes(b.status);
    if (activeTab === 'completed') return b.status === 'completed';
    if (activeTab === 'cancelled') return b.status === 'cancelled';
    return true;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-extrabold text-gray-900">Your Booking Dashboard</h1>
          <p className="text-sm text-gray-500">Track active jobs, location updates, and past receipts</p>
        </div>

        <Link
          to="/services"
          className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-2.5 px-5 rounded-xl transition shadow-md"
        >
          + Book New Service
        </Link>
      </div>

      {/* Stats Summary */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-10">
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
          <p className="text-xs text-gray-400 uppercase font-semibold">Total Bookings</p>
          <p className="text-3xl font-extrabold text-gray-900 mt-1">{bookings.length}</p>
        </div>
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
          <p className="text-xs text-gray-400 uppercase font-semibold">Active Jobs</p>
          <p className="text-3xl font-extrabold text-emerald-600 mt-1">{activeCount}</p>
        </div>
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
          <p className="text-xs text-gray-400 uppercase font-semibold">Completed Services</p>
          <p className="text-3xl font-extrabold text-blue-600 mt-1">{completedCount}</p>
        </div>
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
          <p className="text-xs text-gray-400 uppercase font-semibold">Cancelled</p>
          <p className="text-3xl font-extrabold text-red-600 mt-1">{cancelledCount}</p>
        </div>
      </div>

      {/* Bookings Table */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="p-6 border-b border-gray-100 flex flex-wrap justify-between items-center gap-4">
          <h2 className="text-xl font-bold text-gray-900">Recent Bookings & Tracking</h2>

          {/* Filter Tabs */}
          <div className="flex bg-gray-100 p-1 rounded-xl gap-1 text-xs font-bold">
            <button
              onClick={() => setActiveTab('all')}
              className={`px-3 py-1.5 rounded-lg transition ${
                activeTab === 'all' ? 'bg-white text-gray-900 shadow-2xs' : 'text-gray-500 hover:text-gray-800'
              }`}
            >
              All ({bookings.length})
            </button>
            <button
              onClick={() => setActiveTab('active')}
              className={`px-3 py-1.5 rounded-lg transition ${
                activeTab === 'active' ? 'bg-emerald-600 text-white shadow-2xs' : 'text-gray-500 hover:text-gray-800'
              }`}
            >
              Active ({activeCount})
            </button>
            <button
              onClick={() => setActiveTab('completed')}
              className={`px-3 py-1.5 rounded-lg transition ${
                activeTab === 'completed' ? 'bg-blue-600 text-white shadow-2xs' : 'text-gray-500 hover:text-gray-800'
              }`}
            >
              Completed ({completedCount})
            </button>
            <button
              onClick={() => setActiveTab('cancelled')}
              className={`px-3 py-1.5 rounded-lg transition ${
                activeTab === 'cancelled' ? 'bg-red-600 text-white shadow-2xs' : 'text-gray-500 hover:text-gray-800'
              }`}
            >
              Cancelled ({cancelledCount})
            </button>
          </div>
        </div>

        {loading ? (
          <div className="p-10 text-center text-gray-400">Loading bookings...</div>
        ) : filteredBookings.length === 0 ? (
          <div className="p-12 text-center text-gray-500">
            No {activeTab !== 'all' ? activeTab : ''} bookings found.{' '}
            <Link to="/services" className="text-emerald-600 font-semibold underline">Book your service!</Link>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-100 text-xs text-gray-400 uppercase tracking-wider">
                  <th className="py-4 px-6 font-semibold">Service</th>
                  <th className="py-4 px-6 font-semibold">Provider</th>
                  <th className="py-4 px-6 font-semibold">Price</th>
                  <th className="py-4 px-6 font-semibold">Status</th>
                  <th className="py-4 px-6 font-semibold">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 text-sm">
                {filteredBookings.map((booking) => (
                  <tr key={booking._id} className="hover:bg-gray-50/50 transition">
                    <td className="py-4 px-6 font-bold text-gray-900">
                      {booking.service?.title || 'Home Service'}
                      <span className="block text-xs font-normal text-gray-400">
                        {new Date(booking.createdAt).toLocaleDateString()}
                      </span>
                    </td>
                    <td className="py-4 px-6">
                      <span className="font-semibold text-gray-800">{booking.provider?.name || 'Assigned Provider'}</span>
                      <ProviderBadge
                        isVerified={booking.provider?.providerDetails?.isVerified}
                        tier={booking.provider?.providerDetails?.tier}
                      />
                    </td>
                    <td className="py-4 px-6 font-extrabold text-emerald-600">
                      ${booking.priceBreakdown?.finalPrice || 50}
                    </td>
                    <td className="py-4 px-6">
                      <span className={`px-3 py-1 rounded-full text-xs font-bold capitalize inline-flex items-center gap-1 ${
                        booking.status === 'completed'
                          ? 'bg-emerald-100 text-emerald-800'
                          : booking.status === 'in-progress'
                          ? 'bg-amber-100 text-amber-800 animate-pulse'
                          : booking.status === 'cancelled'
                          ? 'bg-red-100 text-red-800'
                          : 'bg-blue-100 text-blue-800'
                      }`}>
                        {booking.status === 'in-progress' && <Navigation className="w-3 h-3" />}
                        {booking.status}
                      </span>
                    </td>
                    <td className="py-4 px-6">
                      <div className="flex items-center gap-2">
                        <Link
                          to={`/job/${booking._id}`}
                          className="bg-gray-900 hover:bg-emerald-600 text-white font-bold text-xs px-3.5 py-2 rounded-lg transition inline-flex items-center gap-1.5"
                        >
                          <Navigation className="w-3.5 h-3.5 text-emerald-400" />
                          Live Map & Control
                        </Link>

                        {(booking.status === 'pending' || booking.status === 'accepted') && (
                          <button
                            onClick={() => handleCancelBooking(booking._id)}
                            className="bg-red-50 hover:bg-red-100 text-red-600 border border-red-200 font-bold text-xs px-3 py-2 rounded-lg transition cursor-pointer"
                          >
                            Cancel
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

