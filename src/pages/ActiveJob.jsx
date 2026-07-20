import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { bookingAPI, paymentAPI, ratingAPI } from '../services/api';
import { getTrackingSocket } from '../services/socket';
import LiveTracking from '../components/LiveTracking';
import ProviderBadge from '../components/ProviderBadge';
import InAppChat from '../components/InAppChat';
import DisputeModal from '../components/DisputeModal';
import { CheckCircle, Navigation, ShieldCheck, DollarSign, Star, Clock, AlertTriangle, MessageSquare } from 'lucide-react';

export default function ActiveJob() {
  const { bookingId } = useParams();
  const navigate = useNavigate();

  const [booking, setBooking] = useState(null);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [ratingVal, setRatingVal] = useState(5);
  const [reviewText, setReviewText] = useState('');
  const [hasRated, setHasRated] = useState(false);
  const [isDisputeOpen, setIsDisputeOpen] = useState(false);

  const storedUserRaw = localStorage.getItem('homeease_user');
  const currentUser = storedUserRaw ? JSON.parse(storedUserRaw) : { name: 'You', role: 'customer' };

  const fetchBooking = async () => {
    try {
      const res = await bookingAPI.getById(bookingId);
      if (res.data.success) {
        setBooking(res.data.booking);
      }
    } catch (err) {
      console.error('Failed to load booking:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBooking();
    const interval = setInterval(fetchBooking, 6000);
    return () => clearInterval(interval);
  }, [bookingId]);

  const handleStatusChange = async (newStatus) => {
    setUpdating(true);
    try {
      const res = await bookingAPI.updateStatus(bookingId, newStatus);
      if (res.data.success) {
        setBooking(res.data.booking);
        if (newStatus === 'completed') {
          try {
            await paymentAPI.processPayout({ bookingId });
          } catch (payoutErr) {
            console.warn('Payout notice:', payoutErr.message);
          }
        } else if (newStatus === 'cancelled') {
          try {
            await paymentAPI.cancelHold({ bookingId });
            alert('Booking cancelled and Stripe payment hold released!');
          } catch (cancelErr) {
            console.warn('Stripe hold cancel notice:', cancelErr.message);
          }
        }
      }
    } catch (err) {
      alert('Status update failed: ' + (err.response?.data?.message || err.message));
    } finally {
      setUpdating(false);
    }
  };

  const handleReviewSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await ratingAPI.submit({
        bookingId,
        rating: ratingVal,
        reviewText,
      });
      if (res.data.success) {
        setHasRated(true);
        alert('Thank you for rating your service!');
      }
    } catch (err) {
      alert('Rating submission notice: ' + (err.response?.data?.message || err.message));
      setHasRated(true);
    }
  };

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-20 text-center text-gray-500">
        Loading active job tracking & in-app chat...
      </div>
    );
  }

  if (!booking) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-20 text-center text-red-500">
        Booking not found or access denied.
      </div>
    );
  }

  const { status, priceBreakdown, provider, customer, service } = booking;
  const isCompleted = status === 'completed';
  const isInProgress = status === 'in-progress';
  const isAccepted = status === 'accepted';

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-gray-900 via-slate-900 to-emerald-950 text-white p-8 rounded-3xl shadow-xl flex flex-wrap justify-between items-center gap-6">
        <div>
          <span className="inline-block bg-emerald-500/20 text-emerald-300 text-xs px-3 py-1 rounded-full font-bold uppercase tracking-wider mb-2 border border-emerald-500/30">
            Booking #{booking._id.slice(-6)}
          </span>
          <h1 className="text-3xl font-bold text-gray-100">{service?.title || 'Home Service'}</h1>
          <p className="text-sm text-gray-400 mt-1 flex items-center gap-2">
            <Clock className="w-4 h-4 text-emerald-400" />
            Booked on {new Date(booking.createdAt).toLocaleString()}
          </p>
        </div>

        <div className="flex items-center gap-6">
          <div className="text-right">
            <span className="text-xs text-gray-400 block uppercase font-semibold">Locked Price</span>
            <span className="text-3xl font-extrabold text-emerald-400">${priceBreakdown?.finalPrice}</span>
            <span className="block text-xs text-emerald-300/80 mt-1 capitalize">
              Payment: {booking.paymentStatus.replace('_', ' ')}
            </span>
          </div>

          <button
            onClick={() => setIsDisputeOpen(true)}
            className="bg-red-500/20 hover:bg-red-500/30 text-red-300 text-xs font-bold px-4 py-2.5 rounded-xl border border-red-500/30 transition flex items-center gap-1.5 cursor-pointer"
          >
            <AlertTriangle className="w-4 h-4 text-red-400" /> File Dispute
          </button>
        </div>
      </div>

      {/* Control Action Buttons */}
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex flex-wrap items-center justify-between gap-4">
        <div>
          <h3 className="font-bold text-gray-900">Job Control Workflow</h3>
          <p className="text-xs text-gray-500">Provider state transitions & real-time tracking triggers</p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          {status === 'pending' && (
            <button
              onClick={() => handleStatusChange('accepted')}
              disabled={updating}
              className="bg-blue-600 hover:bg-blue-700 text-white text-sm font-bold py-2.5 px-5 rounded-xl transition cursor-pointer"
            >
              1. Provider Accept Job
            </button>
          )}

          {(status === 'pending' || isAccepted) && (
            <button
              onClick={() => handleStatusChange('in-progress')}
              disabled={updating}
              className="bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-bold py-2.5 px-5 rounded-xl transition flex items-center gap-2 cursor-pointer"
            >
              <Navigation className="w-4 h-4" />
              2. Start Live Tracking & In-App Chat
            </button>
          )}

          {isInProgress && (
            <>
              <button
                onClick={() => {
                  const socket = getTrackingSocket();
                  const destLat = booking?.userCoordinates?.lat || 12.9716;
                  const destLng = booking?.userCoordinates?.lng || 77.5946;
                  socket.emit('update_location', {
                    jobId: booking._id,
                    lat: destLat + (Math.random() - 0.5) * 0.01,
                    lng: destLng + (Math.random() - 0.5) * 0.01,
                    speed: 35,
                  });
                  alert('📡 Live GPS location update broadcasted to customer map!');
                }}
                className="bg-amber-600 hover:bg-amber-700 text-white text-sm font-bold py-2.5 px-4 rounded-xl transition flex items-center gap-1.5 shadow-md cursor-pointer"
              >
                <Navigation className="w-4 h-4" />
                Broadcast GPS Update
              </button>

              <button
                onClick={() => handleStatusChange('completed')}
                disabled={updating}
                className="bg-purple-600 hover:bg-purple-700 text-white text-sm font-bold py-2.5 px-5 rounded-xl transition flex items-center gap-2 shadow-lg hover:shadow-purple-500/20 cursor-pointer"
              >
                <CheckCircle className="w-4 h-4" />
                3. Complete Job & Trigger Stripe Payout
              </button>
            </>
          )}

          {(status === 'pending' || isAccepted) && (
            <button
              onClick={() => handleStatusChange('cancelled')}
              disabled={updating}
              className="bg-gray-100 hover:bg-red-50 text-gray-700 hover:text-red-600 text-sm font-bold py-2.5 px-4 rounded-xl border border-gray-200 hover:border-red-200 transition cursor-pointer"
            >
              Cancel Booking
            </button>
          )}

          {isCompleted && (
            <span className="bg-emerald-100 text-emerald-800 text-sm font-bold px-4 py-2 rounded-xl flex items-center gap-2">
              <CheckCircle className="w-4 h-4 text-emerald-600" />
              Job Completed & Payout Initiated
            </span>
          )}
        </div>
      </div>

      {/* Main Grid: Live Tracking Map + In-App Chat */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left 2 Cols: Live Socket Tracking Map */}
        <div className="lg:col-span-2 space-y-6">
          <LiveTracking
            jobId={booking._id}
            initialCustomerCoords={booking.userCoordinates}
            initialProviderCoords={booking.providerCoordinates}
            jobStatus={status}
          />
        </div>

        {/* Right Col: In-App Live Socket Chat & Review */}
        <div className="space-y-6">
          {/* Provider Card */}
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
            <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-emerald-600" />
              Service Provider Profile
            </h3>

            <div className="flex items-center gap-4 mb-4">
              <div className="w-14 h-14 bg-emerald-600 text-white text-2xl font-bold rounded-2xl flex items-center justify-center shadow-md">
                {provider?.name?.charAt(0) || 'P'}
              </div>
              <div>
                <h4 className="font-bold text-gray-900 text-lg">{provider?.name}</h4>
                <p className="text-xs text-gray-500">{provider?.phone || '+1 555-0199'}</p>
                <ProviderBadge
                  isVerified={provider?.providerDetails?.isVerified}
                  tier={provider?.providerDetails?.tier}
                />
              </div>
            </div>
          </div>

          {/* In-App Live Socket Chat Widget */}
          <InAppChat
            bookingId={booking._id}
            currentUser={currentUser}
            receiver={provider}
          />

          {/* Rating Submission Form when Completed */}
          {isCompleted && !hasRated && (
            <div className="bg-gradient-to-br from-amber-50 to-orange-50 p-6 rounded-2xl border border-amber-200 shadow-sm">
              <h3 className="font-bold text-gray-900 mb-2 flex items-center gap-2">
                <Star className="w-5 h-5 text-amber-500 fill-amber-500" />
                Rate & Review Provider
              </h3>
              <p className="text-xs text-gray-600 mb-4">Leave feedback for your completed service.</p>

              <form onSubmit={handleReviewSubmit} className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">Rating Stars</label>
                  <select
                    value={ratingVal}
                    onChange={(e) => setRatingVal(Number(e.target.value))}
                    className="w-full border border-amber-300 rounded-lg px-3 py-2 text-sm bg-white"
                  >
                    <option value={5}>★★★★★ (5/5) Excellent</option>
                    <option value={4}>★★★★☆ (4/5) Very Good</option>
                    <option value={3}>★★★☆☆ (3/5) Average</option>
                    <option value={2}>★★☆☆☆ (2/5) Poor</option>
                    <option value={1}>★☆☆☆☆ (1/5) Terrible</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">Review Comments</label>
                  <textarea
                    rows={3}
                    value={reviewText}
                    onChange={(e) => setReviewText(e.target.value)}
                    placeholder="Describe your experience with the service..."
                    className="w-full border border-amber-300 rounded-lg px-3 py-2 text-sm bg-white"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full bg-amber-500 hover:bg-amber-600 text-white font-bold py-2.5 px-4 rounded-xl transition shadow-md cursor-pointer"
                >
                  Submit Rating
                </button>
              </form>
            </div>
          )}
        </div>
      </div>

      {/* Dispute Modal */}
      <DisputeModal
        bookingId={booking._id}
        isOpen={isDisputeOpen}
        onClose={() => setIsDisputeOpen(false)}
      />
    </div>
  );
}
