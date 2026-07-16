import { useParams, useNavigate } from 'react-router-dom';

export default function ServiceDetail() {
  const { id } = useParams();
  const navigate = useNavigate();

  const service = {
    id,
    name: 'Professional Plumbing Repair',
    category: 'Plumbing',
    price: 50,
    rating: 4.8,
    reviews: 245,
    description: 'Get your plumbing issues fixed by certified professionals. We handle all types of plumbing repairs quickly and efficiently.',
    features: [
      'Same-day service available',
      'Certified professionals',
      '100% satisfaction guarantee',
      'Transparent pricing',
    ],
    professional: {
      name: 'John Smith',
      avatar: '👨‍🔧',
      experience: '10 years',
    },
  };

  const handleBook = () => {
    alert('Booking feature coming soon!');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <button 
        onClick={() => navigate(-1)}
        className="mb-6 text-orange-500 hover:text-orange-600 font-semibold"
      >
        ← Back
      </button>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
        {/* Image Section */}
        <div>
          <div className="h-96 bg-gradient-to-br from-orange-500 to-orange-400 rounded-lg mb-6"></div>
          <div className="flex gap-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-24 w-24 bg-gray-200 rounded-lg"></div>
            ))}
          </div>
        </div>

        {/* Details Section */}
        <div>
          <p className="text-gray-500 mb-2">{service.category}</p>
          <h1 className="text-4xl font-bold mb-4">{service.name}</h1>
          
          <div className="flex items-center gap-4 mb-6 pb-6 border-b">
            <div className="text-3xl font-bold text-orange-500">${service.price}</div>
            <div className="flex items-center gap-2">
              <span className="text-xl">★ {service.rating}</span>
              <span className="text-gray-500">({service.reviews} reviews)</span>
            </div>
          </div>

          <p className="text-gray-700 mb-6 leading-relaxed">{service.description}</p>

          <div className="mb-8">
            <h3 className="text-lg font-bold mb-4">What's Included</h3>
            <ul className="space-y-3">
              {service.features.map((feature, i) => (
                <li key={i} className="flex items-center gap-3">
                  <span className="text-green-500 font-bold">✓</span>
                  {feature}
                </li>
              ))}
            </ul>
          </div>

          {/* Professional Info */}
          <div className="bg-gray-50 p-6 rounded-lg mb-8">
            <h3 className="font-bold mb-4">Your Professional</h3>
            <div className="flex items-center gap-4">
              <div className="text-5xl">{service.professional.avatar}</div>
              <div>
                <p className="font-bold text-lg">{service.professional.name}</p>
                <p className="text-gray-600">{service.professional.experience} of experience</p>
              </div>
            </div>
          </div>

          <button 
            onClick={handleBook}
            className="w-full btn-primary py-3 text-lg"
          >
            Book Now
          </button>
        </div>
      </div>
    </div>
  );
}
