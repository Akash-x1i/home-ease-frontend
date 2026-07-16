import { Link } from 'react-router-dom';

export default function Home() {
  return (
    <div>
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-orange-500 to-orange-400 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-5xl md:text-6xl font-bold mb-6">
              Find Home Services in Seconds
            </h1>
            <p className="text-xl md:text-2xl mb-8 opacity-90">
              Connect with verified professionals for all your home service needs
            </p>
            <Link 
              to="/services" 
              className="btn-primary inline-block text-lg"
            >
              Browse Services
            </Link>
          </div>
        </div>
      </section>

      {/* Services Overview */}
      <section className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-4xl font-bold text-center mb-12">Popular Services</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {['Plumbing', 'Electrical', 'Cleaning'].map((service) => (
              <div 
                key={service}
                className="bg-white p-8 rounded-lg shadow-card hover:shadow-xl transition"
              >
                <div className="w-16 h-16 bg-orange-500 rounded-lg mb-4"></div>
                <h3 className="text-2xl font-bold mb-2">{service}</h3>
                <p className="text-gray-600 mb-4">
                  Find verified {service.toLowerCase()} professionals in your area.
                </p>
                <Link 
                  to="/services" 
                  className="text-orange-500 font-semibold hover:text-orange-600"
                >
                  Explore →
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-blue-900 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl font-bold mb-6">Ready to Get Started?</h2>
          <p className="text-xl mb-8 opacity-90">
            Sign up today and book your first service
          </p>
          <Link 
            to="/register" 
            className="btn-primary inline-block text-lg bg-orange-500 hover:bg-orange-600"
          >
            Create Account
          </Link>
        </div>
      </section>
    </div>
  );
}
