import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { serviceAPI } from '../services/api';
import ProviderBadge from '../components/ProviderBadge';
import { ShieldCheck, Check, Clock, Award, Star, ArrowLeft } from 'lucide-react';

export default function ServiceDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [service, setService] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchDetail() {
      try {
        const res = await serviceAPI.getById(id);
        if (res.data.success) {
          setService(res.data.service);
        }
      } catch (err) {
        console.error('Failed to load service detail:', err);
      } finally {
        setLoading(false);
      }
    }
    fetchDetail();
  }, [id]);

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-20 text-center text-gray-500">
        Loading service details...
      </div>
    );
  }

  if (!service) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-20 text-center text-red-500">
        Service not found.
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <button 
        onClick={() => navigate(-1)}
        className="mb-6 inline-flex items-center gap-2 text-emerald-600 hover:text-emerald-700 font-semibold"
      >
        <ArrowLeft className="w-4 h-4" /> Back to Catalog
      </button>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        {/* Left Column: Image & Feature Badges */}
        <div>
          <img 
            src={service.image} 
            alt={service.title} 
            className="w-full h-96 object-cover rounded-3xl shadow-lg mb-6 border border-gray-100"
          />

          <div className="bg-emerald-50/60 border border-emerald-100 p-6 rounded-2xl">
            <h4 className="font-bold text-gray-900 mb-3 flex items-center gap-2">
              <Award className="w-5 h-5 text-emerald-600" />
              HomeEase Guarantee & Verification
            </h4>
            <ProviderBadge isVerified={true} tier="Gold" />
          </div>
        </div>

        {/* Right Column: Details & Book Action */}
        <div>
          <span className="text-xs font-bold text-emerald-600 uppercase tracking-wider bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
            {service.category}
          </span>

          <h1 className="text-4xl font-extrabold text-gray-900 mt-3 mb-4">{service.title}</h1>
          
          <div className="flex items-center gap-4 mb-6 pb-6 border-b border-gray-100">
            <div>
              <span className="text-xs text-gray-400 block">Catalog Price</span>
              <span className="text-3xl font-extrabold text-emerald-600">${service.basePrice}</span>
            </div>
            <div className="border-l border-gray-200 pl-4">
              <span className="text-xs text-gray-400 block">Estimated Time</span>
              <span className="text-sm font-semibold text-gray-700 flex items-center gap-1">
                <Clock className="w-4 h-4 text-emerald-600" /> {service.estimatedDuration}
              </span>
            </div>
          </div>

          <p className="text-gray-600 leading-relaxed mb-6">{service.description}</p>

          <div className="mb-8">
            <h3 className="text-lg font-bold text-gray-900 mb-4">What's Included</h3>
            <ul className="space-y-3">
              {(service.features || ['Same-day service', 'Certified professional', '90-day guarantee']).map((feat, i) => (
                <li key={i} className="flex items-center gap-3 text-sm text-gray-700">
                  <span className="w-5 h-5 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center font-bold text-xs">
                    ✓
                  </span>
                  {feat}
                </li>
              ))}
            </ul>
          </div>

          <button 
            onClick={() => navigate(`/book/${service._id}`)}
            className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-lg py-4 rounded-2xl shadow-xl hover:shadow-emerald-500/20 transition flex items-center justify-center gap-2"
          >
            Calculate Dynamic Price & Book Now
          </button>
        </div>
      </div>
    </div>
  );
}
