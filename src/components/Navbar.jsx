import { Link } from 'react-router-dom';

export default function Navbar() {
  return (
    <nav className="bg-white shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <Link to="/" className="flex items-center gap-2">
            <span className="text-2xl font-bold text-orange-500">HomeEase</span>
          </Link>
          
          <div className="hidden md:flex gap-8 items-center">
            <Link to="/" className="text-gray-700 hover:text-orange-500 transition">Home</Link>
            <Link to="/services" className="text-gray-700 hover:text-orange-500 transition">Services</Link>
            <Link to="/dashboard" className="text-gray-700 hover:text-orange-500 transition">Dashboard</Link>
          </div>

          <div className="flex gap-4 items-center">
            <Link to="/login" className="text-gray-700 hover:text-orange-500 transition">Sign In</Link>
            <Link to="/register" className="btn-primary">Sign Up</Link>
          </div>
        </div>
      </div>
    </nav>
  );
}
