import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Menu, X, Search, MapPin, ChevronDown, UserCircle, LogIn, UserPlus, Info, ShoppingCart, User, LogOut } from 'lucide-react';

const indianLocations = [
  { city: 'Bangalore', state: 'Karnataka', lat: 12.9716, lng: 77.5946 },
  { city: 'Mumbai', state: 'Maharashtra', lat: 19.0760, lng: 72.8777 },
  { city: 'Delhi / NCR', state: 'Delhi', lat: 28.6139, lng: 77.2090 },
  { city: 'Hyderabad', state: 'Telangana', lat: 17.3850, lng: 78.4867 },
  { city: 'Chennai', state: 'Tamil Nadu', lat: 13.0827, lng: 80.2707 },
  { city: 'Pune', state: 'Maharashtra', lat: 18.5204, lng: 73.8567 },
  { city: 'Kolkata', state: 'West Bengal', lat: 22.5726, lng: 88.3639 },
  { city: 'Ahmedabad', state: 'Gujarat', lat: 23.0225, lng: 72.5714 },
  { city: 'Jaipur', state: 'Rajasthan', lat: 26.9124, lng: 75.7873 },
  { city: 'Chandigarh', state: 'Punjab / Haryana', lat: 30.7333, lng: 76.7794 },
  { city: 'Kochi', state: 'Kerala', lat: 9.9312, lng: 76.2673 },
  { city: 'Lucknow', state: 'Uttar Pradesh', lat: 26.8467, lng: 80.9462 },
  { city: 'Indore', state: 'Madhya Pradesh', lat: 22.7196, lng: 75.8577 },
];

const navLinks = [
  { label: 'Services', path: '/services' },
  { label: 'How It Works', path: '/how-it-works' },
  { label: 'Contact', path: '/contact' },
];

export default function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [locationOpen, setLocationOpen] = useState(false);
  const [selectedLocation, setSelectedLocation] = useState(
    JSON.parse(localStorage.getItem('homeease_location') || 'null') || indianLocations[0]
  );
  const [accountOpen, setAccountOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const storedToken = localStorage.getItem('homeease_token');
  const storedUserRaw = localStorage.getItem('homeease_user');
  const user = storedUserRaw ? JSON.parse(storedUserRaw) : null;
  const isLoggedIn = Boolean(storedToken && user);

  const navigate = useNavigate();

  const handleSelectLocation = (loc) => {
    setSelectedLocation(loc);
    localStorage.setItem('homeease_location', JSON.stringify(loc));
    setLocationOpen(false);
    window.dispatchEvent(new Event('homeease_location_changed'));
  };

  const handleNavSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/services?search=${encodeURIComponent(searchQuery)}`);
    } else {
      navigate('/services');
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('homeease_token');
    localStorage.removeItem('homeease_user');
    setAccountOpen(false);
    navigate('/login');
    window.location.reload();
  };

  return (
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-gray-100">
      <div className="max-w-360 mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16 lg:h-20 gap-4">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 flex-shrink-0">
            <div className="w-9 h-9 bg-emerald-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-lg">HE</span>
            </div>
            <span className="text-xl lg:text-2xl font-bold text-gray-900 tracking-tight">
              Home<span className="text-emerald-600">Ease</span>
            </span>
          </Link>

          {/* Desktop Search Bar */}
          <div className="hidden lg:flex flex-1 max-w-lg mx-4">
            <div className="relative flex w-full bg-gray-50 border border-gray-200 rounded-xl overflow-hidden focus-within:ring-2 focus-within:ring-emerald-500 focus-within:border-transparent">
              {/* Location Dropdown */}
              <div className="relative">
                <button
                  onClick={() => setLocationOpen(!locationOpen)}
                  className="flex items-center gap-1.5 px-3.5 h-full border-r border-gray-200 text-sm text-gray-700 hover:text-emerald-600 transition-colors bg-gray-100/60"
                >
                  <MapPin className="w-4 h-4 text-emerald-600" />
                  <span className="font-semibold whitespace-nowrap">
                    {selectedLocation.city}
                  </span>
                  <ChevronDown
                    className={`w-3.5 h-3.5 transition-transform ${locationOpen ? 'rotate-180' : ''}`}
                  />
                </button>
                {locationOpen && (
                  <>
                    <div
                      className="fixed inset-0 z-10"
                      onClick={() => setLocationOpen(false)}
                    />
                    <div className="absolute top-full left-0 mt-1 bg-white border border-gray-200 rounded-2xl shadow-2xl py-2 z-20 w-64 max-h-80 overflow-y-auto">
                      <div className="px-3 py-1.5 text-[11px] font-bold uppercase text-gray-400 border-b border-gray-100">
                        Select Region / State in India
                      </div>
                      {indianLocations.map((loc) => (
                        <button
                          key={loc.city}
                          onClick={() => handleSelectLocation(loc)}
                          className={`w-full text-left px-4 py-2 text-sm hover:bg-emerald-50 transition-colors flex justify-between items-center ${
                            loc.city === selectedLocation.city
                              ? 'text-emerald-600 font-bold bg-emerald-50/50'
                              : 'text-gray-700'
                          }`}
                        >
                          <span>{loc.city}</span>
                          <span className="text-[10px] text-gray-400 font-medium">{loc.state}</span>
                        </button>
                      ))}
                    </div>
                  </>
                )}
              </div>

              {/* Search Input */}
              <form onSubmit={handleNavSearch} className="flex flex-1">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search for a service in your city..."
                  className="flex-1 px-3.5 py-2.5 bg-transparent text-sm text-gray-700 placeholder-gray-400 focus:outline-none"
                />
                <button type="submit" className="px-4 bg-emerald-600 text-white hover:bg-emerald-700 transition-colors flex items-center justify-center cursor-pointer">
                  <Search className="w-4 h-4" />
                </button>
              </form>
            </div>
          </div>

          {/* Desktop Account */}
          <div
            className="hidden lg:flex items-center relative"
            onMouseEnter={() => setAccountOpen(true)}
            onMouseLeave={() => setAccountOpen(false)}
          >
            <button
              className="p-2 text-gray-500 hover:text-emerald-600 hover:bg-emerald-50 rounded-full transition-colors"
              title="Account"
            >
              <UserCircle className="w-6 h-6" />
            </button>

            {accountOpen && (
              <>
                <div
                  className="fixed inset-0 z-10"
                  onClick={() => setAccountOpen(false)}
                />
                <div className="absolute top-full right-0 mt-2 bg-white border border-gray-100 rounded-xl shadow-lg py-2 z-20 w-52">
                  {isLoggedIn ? (
                    <>
                      <div className="px-4 py-2 border-b border-gray-100">
                        <p className="text-sm font-medium text-gray-900">{user?.name || 'User'}</p>
                        <p className="text-xs text-gray-500">{user?.email || 'user@example.com'}</p>
                      </div>
                      <Link
                        to="/dashboard"
                        onClick={() => setAccountOpen(false)}
                        className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 hover:text-emerald-600 transition-colors"
                      >
                        <User className="w-4 h-4" />
                        My Dashboard
                      </Link>
                      <Link
                        to="/profile"
                        onClick={() => setAccountOpen(false)}
                        className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 hover:text-emerald-600 transition-colors"
                      >
                        <User className="w-4 h-4 text-emerald-600" />
                        Edit Profile
                      </Link>
                      <Link
                        to="/admin"
                        onClick={() => setAccountOpen(false)}
                        className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 hover:text-emerald-600 transition-colors font-semibold"
                      >
                        <Info className="w-4 h-4 text-purple-600" />
                        Admin Console
                      </Link>
                      <Link
                        to="/services"
                        onClick={() => setAccountOpen(false)}
                        className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 hover:text-emerald-600 transition-colors"
                      >
                        <ShoppingCart className="w-4 h-4" />
                        Book Services
                      </Link>
                      <hr className="border-gray-100 my-1" />
                      <button
                        onClick={handleLogout}
                        className="flex items-center gap-3 w-full text-left px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 transition-colors"
                      >
                        <LogOut className="w-4 h-4" />
                        Logout
                      </button>
                    </>
                  ) : (
                    <>
                      <Link
                        to="/login"
                        onClick={() => setAccountOpen(false)}
                        className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 hover:text-emerald-600 transition-colors"
                      >
                        <LogIn className="w-4 h-4" />
                        Sign In
                      </Link>
                      <Link
                        to="/register"
                        onClick={() => setAccountOpen(false)}
                        className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 hover:text-emerald-600 transition-colors"
                      >
                        <UserPlus className="w-4 h-4" />
                        Sign Up
                      </Link>
                    </>
                  )}
                </div>
              </>
            )}
          </div>

          {/* Mobile Menu */}
          <div className="flex lg:hidden items-center gap-2">
            <Link
              to="/services"
              className="p-2 text-gray-500 hover:text-emerald-600 transition-colors"
            >
              <Search className="w-5 h-5" />
            </Link>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 text-gray-600 hover:text-emerald-600"
            >
              {mobileMenuOpen ? (
                <X className="w-6 h-6" />
              ) : (
                <Menu className="w-6 h-6" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-t border-gray-100 bg-white">
          <div className="max-w-360 mx-auto px-4 sm:px-6 lg:px-8 py-4 space-y-4">
            <div className="relative">
              <button
                onClick={() => setLocationOpen(!locationOpen)}
                className="flex items-center gap-2 w-full text-left text-gray-700 font-medium py-2"
              >
                <MapPin className="w-4 h-4 text-emerald-600" />
                {selectedLocation.city} ({selectedLocation.state})
                <ChevronDown
                  className={`w-4 h-4 ml-auto transition-transform ${locationOpen ? 'rotate-180' : ''}`}
                />
              </button>
              {locationOpen && (
                <div className="pl-6 space-y-1 pb-2 max-h-48 overflow-y-auto">
                  {indianLocations.map((loc) => (
                    <button
                      key={loc.city}
                      onClick={() => handleSelectLocation(loc)}
                      className={`block text-sm py-1.5 transition-colors ${
                        loc.city === selectedLocation.city
                          ? 'text-emerald-600 font-medium'
                          : 'text-gray-600 hover:text-emerald-600'
                      }`}
                    >
                      {loc.city} - {loc.state}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                onClick={() => setMobileMenuOpen(false)}
                className="block text-gray-600 hover:text-emerald-600 font-medium py-2 transition-colors"
              >
                {link.label}
              </Link>
            ))}
          </div>
        </div>
      )}
    </header>
  );
}
