import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { serviceAPI, authAPI, pricingAPI, bookingAPI, paymentAPI } from '../services/api';
import DynamicPrice from '../components/DynamicPrice';
import ProviderBadge from '../components/ProviderBadge';
import { Calendar, MapPin, CheckCircle, ShieldCheck, CreditCard, ArrowLeft, Clock } from 'lucide-react';

export default function BookService() {
  const { serviceId } = useParams();
  const navigate = useNavigate();

  const [service, setService] = useState(null);
  const [providers, setProviders] = useState([]);
  const [selectedProvider, setSelectedProvider] = useState(null);
  const [address, setAddress] = useState({
    street: '100 MG Road, Indiranagar',
    city: 'Bangalore',
    zipCode: '560038',
  });
  const [userCoords, setUserCoords] = useState({ lat: 12.9716, lng: 77.5946 });

  const [pricing, setPricing] = useState(null);
  const [isPricingLoading, setIsPricingLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [step, setStep] = useState(1); // 1: Provider & Address, 2: Payment Hold, 3: Success

  useEffect(() => {
    async function loadData() {
      try {
        if (serviceId) {
          const res = await serviceAPI.getById(serviceId);
          if (res.data.success) setService(res.data.service);
        }
        const provRes = await authAPI.getProviders();
        if (provRes.data.success) {
          setProviders(provRes.data.providers);
          if (provRes.data.providers.length > 0) {
            setSelectedProvider(provRes.data.providers[0]);
          }
        }
      } catch (err) {
        console.error('Failed to load booking details:', err);
      }
    }
    loadData();
  }, [serviceId]);

  // Calculate dynamic price when provider or location changes
  useEffect(() => {
    async function calculatePrice() {
      if (!service || !selectedProvider) return;
      setIsPricingLoading(true);
      try {
        const res = await pricingAPI.calculate({
          basePrice: service.basePrice,
          userLat: userCoords.lat,
          userLng: userCoords.lng,
          providerLat: selectedProvider.providerDetails?.currentLocation?.lat || 12.9352,
          providerLng: selectedProvider.providerDetails?.currentLocation?.lng || 77.6245,
          providerTier: selectedProvider.providerDetails?.tier || 'Standard',
          category: service.category,
        });
        if (res.data.success) {
          setPricing(res.data.pricing);
        }
      } catch (err) {
        console.error('Pricing calculation failed:', err);
      } finally {
        setIsPricingLoading(false);
      }
    }
    calculatePrice();
  }, [service, selectedProvider, userCoords]);

  const handleConfirmBooking = async () => {
    if (!selectedProvider || !service) return;
    setIsSubmitting(true);

    try {
      // 1. Create Booking
      const bookingRes = await bookingAPI.create({
        providerId: selectedProvider._id,
        serviceId: service._id,
        userCoordinates: userCoords,
        serviceAddress: {
          ...address,
          fullAddress: `${address.street}, ${address.city} ${address.zipCode}`,
        },
        scheduledDate: new Date(),
      });

      if (bookingRes.data.success) {
        const booking = bookingRes.data.booking;

        // 2. Create Stripe Payment Hold
        try {
          await paymentAPI.createHold({
            amount: booking.priceBreakdown.finalPrice,
            currency: 'usd',
            bookingId: booking._id,
          });
        } catch (holdErr) {
          console.warn('Payment hold notice:', holdErr.message);
        }

        // Navigate to active job page
        navigate(`/job/${booking._id}`);
      }
    } catch (err) {
      alert('Booking creation failed: ' + (err.response?.data?.message || err.message));
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!service) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-16 text-center">
        <p className="text-gray-500 text-lg">Loading service catalog...</p>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <button
        onClick={() => navigate(-1)}
        className="mb-6 inline-flex items-center gap-2 text-gray-600 hover:text-emerald-600 font-medium transition"
      >
        <ArrowLeft className="w-4 h-4" /> Back to Services
      </button>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left 2 Cols: Service & Provider Selection */}
        <div className="lg:col-span-2 space-y-6">
          {/* Service Header Summary */}
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center gap-6">
            <img
              src={service.image}
              alt={service.title}
              className="w-24 h-24 object-cover rounded-xl"
            />
            <div>
              <span className="text-xs font-bold text-emerald-600 uppercase tracking-wider">{service.category}</span>
              <h2 className="text-2xl font-bold text-gray-900">{service.title}</h2>
              <p className="text-sm text-gray-500 mt-1 flex items-center gap-3">
                <span className="flex items-center gap-1"><Clock className="w-4 h-4 text-emerald-600" /> {service.estimatedDuration}</span>
                <span>•</span>
                <span className="font-semibold text-gray-700">Catalog Base: ${service.basePrice}</span>
              </p>
            </div>
          </div>

          {/* Select Professional */}
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
            <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-emerald-600" />
              Choose Verified Service Provider
            </h3>

            <div className="space-y-4">
              {providers.map((prov) => {
                const isSelected = selectedProvider?._id === prov._id;
                return (
                  <div
                    key={prov._id}
                    onClick={() => setSelectedProvider(prov)}
                    className={`p-4 rounded-xl border-2 cursor-pointer transition flex justify-between items-center ${
                      isSelected
                        ? 'border-emerald-600 bg-emerald-50/40'
                        : 'border-gray-100 hover:border-gray-200 bg-white'
                    }`}
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-emerald-600 text-white font-bold rounded-full flex items-center justify-center text-lg">
                        {prov.name.charAt(0)}
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <h4 className="font-bold text-gray-900">{prov.name}</h4>
                          <span className="text-xs bg-amber-100 text-amber-800 font-semibold px-2 py-0.5 rounded-full">
                            ★ {prov.providerDetails?.rating || 5.0}
                          </span>
                        </div>
                        <ProviderBadge
                          isVerified={prov.providerDetails?.isVerified}
                          tier={prov.providerDetails?.tier}
                        />
                      </div>
                    </div>

                    <div className="text-right">
                      <span className="text-sm font-bold text-gray-700">
                        ${prov.providerDetails?.hourlyRate || 50}/hr
                      </span>
                      {isSelected && (
                        <CheckCircle className="w-5 h-5 text-emerald-600 ml-auto mt-1" />
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Service Location */}
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
            <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
              <MapPin className="w-5 h-5 text-emerald-600" />
              Service Address & Coordinates
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1">Street Address</label>
                <input
                  type="text"
                  value={address.street}
                  onChange={(e) => setAddress({ ...address, street: e.target.value })}
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1">City & Zip Code</label>
                <input
                  type="text"
                  value={`${address.city}, ${address.zipCode}`}
                  onChange={(e) => setAddress({ ...address, city: e.target.value })}
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-emerald-500"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Right Col: Dynamic Price Breakdown & Confirm Hold */}
        <div className="space-y-6">
          <DynamicPrice pricing={pricing} isLoading={isPricingLoading} />

          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 space-y-4">
            <h4 className="font-bold text-gray-900 flex items-center gap-2">
              <CreditCard className="w-5 h-5 text-emerald-600" />
              Stripe Card Hold
            </h4>
            <p className="text-xs text-gray-500 leading-relaxed">
              Your card will be authorized for a payment hold of{' '}
              <strong className="text-gray-800">${pricing?.finalPrice || service.basePrice}</strong>. You will only be charged when the job is completed.
            </p>

            <button
              onClick={handleConfirmBooking}
              disabled={isSubmitting || !selectedProvider}
              className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-3 px-6 rounded-xl shadow-lg hover:shadow-emerald-500/20 transition disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {isSubmitting ? 'Authorizing Hold...' : 'Confirm Booking & Authorize Hold'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
