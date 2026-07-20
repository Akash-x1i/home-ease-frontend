import { useState, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { serviceAPI } from '../services/api';
import ProviderBadge from '../components/ProviderBadge';

export default function Services() {
  const [searchParams] = useSearchParams();
  const initialSearch = searchParams.get('search') || '';

  const [filters, setFilters] = useState({
    category: '',
    search: initialSearch,
  });

  useEffect(() => {
    const querySearch = searchParams.get('search');
    if (querySearch !== null && querySearch !== filters.search) {
      setFilters((prev) => ({ ...prev, search: querySearch }));
    }
  }, [searchParams]);
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchServices() {
      setLoading(true);
      try {
        const res = await serviceAPI.getAll(filters.category, filters.search);
        if (res.data.success) {
          setServices(res.data.services);
        }
      } catch (err) {
        console.error('Failed to fetch services:', err);
      } finally {
        setLoading(false);
      }
    }
    fetchServices();
  }, [filters]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="flex flex-wrap justify-between items-center mb-8 gap-4">
        <div>
          <h1 className="text-4xl font-extrabold text-gray-900">Explore Home Services</h1>
          <p className="text-sm text-gray-500 mt-1">Book certified professionals with real-time dynamic pricing</p>
        </div>

        <ProviderBadge isVerified={true} tier="Gold" />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
        {/* Sidebar Filters */}
        <div className="md:col-span-1">
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 sticky top-24">
            <h3 className="text-lg font-bold text-gray-900 mb-4">Filter Catalog</h3>
            
            <div className="mb-6">
              <label className="block text-xs font-semibold text-gray-600 mb-2">Category</label>
              <select 
                className="w-full border border-gray-200 rounded-xl px-3.5 py-2.5 text-sm bg-gray-50 focus:ring-2 focus:ring-emerald-500"
                value={filters.category}
                onChange={(e) => setFilters({...filters, category: e.target.value})}
              >
                <option value="">All Categories</option>
                <option value="Plumbing">Plumbing</option>
                <option value="Electrical">Electrical</option>
                <option value="Cleaning">Cleaning</option>
                <option value="Appliance Repair">Appliance Repair</option>
              </select>
            </div>

            <div className="mb-6">
              <label className="block text-xs font-semibold text-gray-600 mb-2">Search Title</label>
              <input
                type="text"
                placeholder="Search..."
                value={filters.search}
                onChange={(e) => setFilters({...filters, search: e.target.value})}
                className="w-full border border-gray-200 rounded-xl px-3.5 py-2.5 text-sm bg-gray-50 focus:ring-2 focus:ring-emerald-500"
              />
            </div>
          </div>
        </div>

        {/* Services Grid */}
        <div className="md:col-span-3">
          {loading ? (
            <div className="text-center py-20 text-gray-400">Loading service catalog...</div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {services.map((service) => (
                <Link 
                  key={service._id}
                  to={`/services/${service._id}`}
                  className="bg-white rounded-2xl shadow-sm hover:shadow-xl transition border border-gray-100 overflow-hidden cursor-pointer flex flex-col justify-between group"
                >
                  <div>
                    <div className="h-48 relative overflow-hidden bg-gray-100">
                      <img 
                        src={service.image} 
                        alt={service.title} 
                        className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
                      />
                      <span className="absolute top-3 left-3 bg-emerald-600 text-white text-xs px-3 py-1 rounded-full font-semibold">
                        {service.category}
                      </span>
                    </div>

                    <div className="p-6">
                      <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-emerald-600 transition">{service.title}</h3>
                      <p className="text-xs text-gray-500 line-clamp-2 mb-4">{service.description}</p>

                      <div className="mb-4">
                        <ProviderBadge isVerified={true} tier="Standard" />
                      </div>
                    </div>
                  </div>

                  <div className="px-6 pb-6 pt-0 flex justify-between items-center border-t border-gray-50 mt-auto">
                    <div>
                      <span className="text-xs text-gray-400 block">Base Price</span>
                      <span className="text-2xl font-extrabold text-emerald-600">${service.basePrice}</span>
                    </div>
                    <span className="bg-emerald-50 text-emerald-700 text-xs font-bold px-3 py-1.5 rounded-lg">
                      Book Now →
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
