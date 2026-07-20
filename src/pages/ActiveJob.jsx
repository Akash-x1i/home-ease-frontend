import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { bookingAPI, paymentAPI, ratingAPI } from '../services/api';
import LiveTracking from '../components/LiveTracking';
import ProviderBadge from '../components/ProviderBadge';
import { CheckCircle, Navigation, ShieldCheck, DollarSign, Star, Clock, AlertCircle } from 'lucide-react';

export default function ActiveJob() {
  const { bookingId } = useParams();
  const navigate = useNavigate();

  const [booking, setBooking] = useState(null);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [ratingVal, setRatingVal] = useState(5);
  const [reviewText, setReviewText] = useState('');
  const [hasRated, setHasRated] = useState(false);

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
        // If completed, trigger payout
        if (newStatus === 'completed') {
          try {
            await paymentAPI.processPayout({ bookingId });
          } catch (payoutErr) {
            console.warn('Payout notice:', payoutErr.message);
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
        Loading active job status...
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
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
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

        <div className="text-right">
          <span className="text-xs text-gray-400 block uppercase font-semibold">Locked Price</span>
          <span className="text-3xl font-extrabold text-emerald-400">${priceBreakdown?.finalPrice}</span>
          <span className="block text-xs text-emerald-300/80 mt-1 capitalize">
            Payment Status: {booking.paymentStatus.replace('_', ' ')}
          </span>
        </div>
      </div>

      {/* Control Action Buttons (Demonstrating Provider & Customer Workflow) */}
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex flex-wrap items-center justify-between gap-4">
        <div>
          <h3 className="font-bold text-gray-900">Job Control & Workflow</h3>
          <p className="text-xs text-gray-500">Simulate provider job lifecycle transitions</p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          {status === 'pending' && (
            <button
              onClick={() => handleStatusChange('accepted')}
              disabled={updating}
              className="bg-blue-600 hover:bg-blue-700 text-white text-sm font-bold py-2.5 px-5 rounded-xl transition"
            >
              1. Provider Accept Job
            </button>
          )}

          {(status === 'pending' || isAccepted) && (
            <button
              onClick={() => handleStatusChange('in-progress')}
              disabled={updating}
              className="bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-bold py-2.5 px-5 rounded-xl transition flex items-center gap-2"
            >
              <Navigation className="w-4 h-4" />
              2. Start Live Tracking (In-Progress)
            </button>
          )}

          {isInProgress && (
            <button
              onClick={() => handleStatusChange('completed')}
              disabled={updating}
              className="bg-purple-600 hover:bg-purple-700 text-white text-sm font-bold py-2.5 px-5 rounded-xl transition flex items-center gap-2 shadow-lg hover:shadow-purple-500/20"
            >
              <CheckCircle className="w-4 h-4" />
              3. Complete Job & Trigger Stripe Payout
            </button>
          )}

          {isCompleted && (
            <span className="bg-emerald-100 text-emerald-800 text-sm font-bold px-4 py-2 rounded-xl flex items-center gap-2">
              <CheckCircle className="w-4 h-4 text-emerald-600" />
              Job Completed & Provider Paid Out
            </span>
          )}
        </div>
      </div>

      {/* Main Grid: Live Tracking Map & Job Details */}
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

        {/* Right Col: Provider Profile & Review */}
        <div className="space-y-6">
          {/* Provider Info Card */}
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
            <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-emerald-600" />
              Your Service Provider
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

            <hr className="border-gray-100 my-4" />

            <div className="space-y-2 text-xs text-gray-600">
              <p className="flex justify-between">
                <span>Stripe Payout Account:</span>
                <strong className="text-gray-800">{booking.transferId || 'Pending Completion'}</strong>
              </p>
              {booking.payoutAmount > 0 && (
                <p className="flex justify-between text-emerald-600 font-bold">
                  <span>Provider Payout Amount:</span>
                  <span>${booking.payoutAmount}</span>
                </p>
              )}
            </div>
          </div>

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
                  className="w-full bg-amber-500 hover:bg-amber-600 text-white font-bold py-2.5 px-4 rounded-xl transition shadow-md"
                >
                  Submit Rating
                </button>
              </form>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
