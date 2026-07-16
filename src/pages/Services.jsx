import { useState } from 'react';
import { Link } from 'react-router-dom';

export default function Services() {
  const [filters, setFilters] = useState({
    category: '',
    priceRange: 'all',
  });

  const mockServices = [
    { id: 1, name: 'Plumbing Repair', category: 'Plumbing', price: 50, rating: 4.8 },
    { id: 2, name: 'Electrical Installation', category: 'Electrical', price: 75, rating: 4.9 },
    { id: 3, name: 'House Cleaning', category: 'Cleaning', price: 60, rating: 4.7 },
    { id: 4, name: 'Leak Detection', category: 'Plumbing', price: 45, rating: 4.6 },
    { id: 5, name: 'Ceiling Fan Installation', category: 'Electrical', price: 55, rating: 4.8 },
    { id: 6, name: 'Deep Cleaning', category: 'Cleaning', price: 100, rating: 5.0 },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <h1 className="text-4xl font-bold mb-8">Our Services</h1>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
        {/* Sidebar Filters */}
        <div className="md:col-span-1">
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-xl font-bold mb-4">Filters</h3>
            
            <div className="mb-6">
              <label className="block text-sm font-semibold mb-3">Category</label>
              <select 
                className="w-full border border-gray-300 rounded px-3 py-2"
                value={filters.category}
                onChange={(e) => setFilters({...filters, category: e.target.value})}
              >
                <option value="">All Categories</option>
                <option value="Plumbing">Plumbing</option>
                <option value="Electrical">Electrical</option>
                <option value="Cleaning">Cleaning</option>
              </select>
            </div>

            <div className="mb-6">
              <label className="block text-sm font-semibold mb-3">Price Range</label>
              <select 
                className="w-full border border-gray-300 rounded px-3 py-2"
                value={filters.priceRange}
                onChange={(e) => setFilters({...filters, priceRange: e.target.value})}
              >
                <option value="all">All Prices</option>
                <option value="0-50">$0 - $50</option>
                <option value="50-100">$50 - $100</option>
                <option value="100+">$100+</option>
              </select>
            </div>
          </div>
        </div>

        {/* Services Grid */}
        <div className="md:col-span-3">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {mockServices.map((service) => (
              <Link 
                key={service.id}
                to={`/services/${service.id}`}
                className="bg-white rounded-lg shadow-card hover:shadow-xl transition overflow-hidden cursor-pointer"
              >
                <div className="h-48 bg-gradient-to-br from-orange-500 to-orange-400"></div>
                <div className="p-6">
                  <p className="text-sm text-gray-500 mb-2">{service.category}</p>
                  <h3 className="text-xl font-bold mb-2">{service.name}</h3>
                  <div className="flex justify-between items-center">
                    <span className="text-2xl font-bold text-orange-500">${service.price}</span>
                    <span className="text-sm bg-yellow-100 text-yellow-800 px-3 py-1 rounded-full">
                      ★ {service.rating}
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
