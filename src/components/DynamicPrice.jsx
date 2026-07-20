import React from 'react';
import { DollarSign, Flame, Navigation, Award, Zap } from 'lucide-react';

export default function DynamicPrice({ pricing, isLoading = false }) {
  if (isLoading) {
    return (
      <div className="bg-gradient-to-br from-amber-50 to-orange-50 p-6 rounded-xl border border-amber-200 animate-pulse">
        <div className="h-6 bg-amber-200 rounded w-1/2 mb-4"></div>
        <div className="space-y-3">
          <div className="h-4 bg-amber-200 rounded w-3/4"></div>
          <div className="h-4 bg-amber-200 rounded w-2/3"></div>
          <div className="h-4 bg-amber-200 rounded w-5/6"></div>
        </div>
      </div>
    );
  }

  if (!pricing) {
    return (
      <div className="bg-gray-50 p-4 rounded-lg text-sm text-gray-500 text-center">
        Select address to view dynamic pricing estimate.
      </div>
    );
  }

  const {
    basePrice = 50,
    demandMultiplier = 1.0,
    distanceKm = 0,
    distanceSurcharge = 0,
    tierMultiplier = 1.0,
    finalPrice = 50,
  } = pricing;

  const isHighDemand = demandMultiplier > 1.0;

  return (
    <div className="bg-gradient-to-br from-gray-900 to-slate-800 text-white p-6 rounded-2xl shadow-xl border border-gray-700">
      <div className="flex justify-between items-center mb-6 border-b border-gray-700 pb-4">
        <div>
          <h4 className="text-lg font-bold text-gray-100 flex items-center gap-2">
            <Zap className="w-5 h-5 text-amber-400 fill-amber-400" />
            Dynamic Price Engine
          </h4>
          <p className="text-xs text-gray-400 mt-0.5">Real-time demand & location rate breakdown</p>
        </div>

        {isHighDemand && (
          <span className="inline-flex items-center gap-1 bg-amber-500/20 text-amber-300 text-xs px-3 py-1 rounded-full border border-amber-500/30 font-semibold animate-pulse">
            <Flame className="w-3.5 h-3.5 fill-amber-400" />
            High Demand ({demandMultiplier}x)
          </span>
        )}
      </div>

      <div className="space-y-3 text-sm">
        {/* Base Service Rate */}
        <div className="flex justify-between items-center text-gray-300">
          <span className="flex items-center gap-2">
            <DollarSign className="w-4 h-4 text-emerald-400" />
            Base Service Catalog Price
          </span>
          <span className="font-semibold">${basePrice.toFixed(2)}</span>
        </div>

        {/* Demand Multiplier */}
        <div className="flex justify-between items-center text-gray-300">
          <span className="flex items-center gap-2">
            <Flame className="w-4 h-4 text-amber-400" />
            Local Demand Multiplier
          </span>
          <span className={`font-semibold ${isHighDemand ? 'text-amber-400' : 'text-gray-300'}`}>
            {demandMultiplier}x
          </span>
        </div>

        {/* Distance Surcharge */}
        <div className="flex justify-between items-center text-gray-300">
          <span className="flex items-center gap-2">
            <Navigation className="w-4 h-4 text-sky-400" />
            Distance Surcharge ({distanceKm} km)
          </span>
          <span className="font-semibold">
            {distanceSurcharge > 0 ? `+$${distanceSurcharge.toFixed(2)}` : 'FREE (<3km)'}
          </span>
        </div>

        {/* Provider Tier Multiplier */}
        {tierMultiplier > 1.0 && (
          <div className="flex justify-between items-center text-gray-300">
            <span className="flex items-center gap-2">
              <Award className="w-4 h-4 text-purple-400" />
              Pro Tier Surcharge
            </span>
            <span className="font-semibold text-purple-300">{tierMultiplier}x</span>
          </div>
        )}
      </div>

      {/* Total Final Price */}
      <div className="mt-6 pt-4 border-t border-gray-700 flex justify-between items-center">
        <div>
          <span className="text-xs text-gray-400 block uppercase tracking-wider font-semibold">Total Price</span>
          <span className="text-2xl font-extrabold text-emerald-400">${finalPrice.toFixed(2)}</span>
        </div>

        <span className="text-xs text-emerald-400/80 bg-emerald-950/60 px-2.5 py-1 rounded border border-emerald-800">
          Price Locked on Booking
        </span>
      </div>
    </div>
  );
}
