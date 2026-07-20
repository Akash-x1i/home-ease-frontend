import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Menu, X, Search, MapPin, ChevronDown, UserCircle, LogIn, UserPlus, Info, ShoppingCart, User, LogOut } from 'lucide-react';

const locations = [
  'Mumbai',
  'Delhi',
  'Bangalore',
  'Hyderabad',
  'Chennai',
  'Pune',
  'Kolkata',
  'Ahmedabad',
];

const navLinks = [
  { label: 'Services', path: '/services' },
  { label: 'How It Works', path: '/how-it-works' },
  { label: 'Contact', path: '/contact' },
];

export default function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [locationOpen, setLocationOpen] = useState(false);
  const [selectedLocation, setSelectedLocation] = useState('Bangalore');
  const [accountOpen, setAccountOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  
  const storedToken = localStorage.getItem('homeease_token');
  const storedUserRaw = localStorage.getItem('homeease_user');
  const user = storedUserRaw ? JSON.parse(storedUserRaw) : null;
  const isLoggedIn = Boolean(storedToken && user);

  const navigate = useNavigate();

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
                  className="flex items-center gap-1.5 px-3.5 h-full border-r border-gray-200 text-sm text-gray-600 hover:text-emerald-600 transition-colors"
                >
                  <MapPin className="w-4 h-4" />
                  <span className="font-medium whitespace-nowrap">
                    {selectedLocation}
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
                    <div className="absolute top-full left-0 mt-1 bg-white border border-gray-200 rounded-xl shadow-lg py-2 z-20 w-44">
                      {locations.map((loc) => (
                        <button
                          key={loc}
                          onClick={() => {
                            setSelectedLocation(loc);
                            setLocationOpen(false);
                          }}
                          className={`w-full text-left px-4 py-2 text-sm hover:bg-gray-50 transition-colors ${
                            loc === selectedLocation
                              ? 'text-emerald-600 font-medium'
                              : 'text-gray-700'
                          }`}
                        >
                          {loc}
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
                  placeholder="Search for a service..."
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
                      <hr className="border-gray-100 my-1" />
                      <Link
                        to="/how-it-works"
                        onClick={() => setAccountOpen(false)}
                        className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 hover:text-emerald-600 transition-colors"
                      >
                        <Info className="w-4 h-4" />
                        How It Works
                      </Link>
                    </>
                  )}
                </div>
              </>
            )}
          </div>

          {/* Mobile: Search + Menu */}
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
            {/* Mobile Location */}
            <div className="relative">
              <button
                onClick={() => setLocationOpen(!locationOpen)}
                className="flex items-center gap-2 w-full text-left text-gray-700 font-medium py-2"
              >
                <MapPin className="w-4 h-4 text-emerald-600" />
                {selectedLocation}
                <ChevronDown
                  className={`w-4 h-4 ml-auto transition-transform ${locationOpen ? 'rotate-180' : ''}`}
                />
              </button>
              {locationOpen && (
                <div className="pl-6 space-y-1 pb-2">
                  {locations.map((loc) => (
                    <button
                      key={loc}
                      onClick={() => {
                        setSelectedLocation(loc);
                        setLocationOpen(false);
                      }}
                      className={`block text-sm py-1.5 transition-colors ${
                        loc === selectedLocation
                          ? 'text-emerald-600 font-medium'
                          : 'text-gray-600 hover:text-emerald-600'
                      }`}
                    >
                      {loc}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Mobile Search */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search for a service..."
                className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>

            {/* Nav Links */}
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
            <hr className="border-gray-100" />
            {isLoggedIn ? (
              <>
                <div className="py-2 text-sm text-gray-500 border-b border-gray-100 mb-1">
                  <p className="font-medium text-gray-900">John Doe</p>
                  <p>john@example.com</p>
                </div>
                <Link
                  to="/dashboard"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center gap-3 text-gray-700 hover:text-emerald-600 font-medium py-2 transition-colors"
                >
                  <User className="w-5 h-5" />
                  My Profile
                </Link>
                <Link
                  to="/cart"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center gap-3 text-gray-700 hover:text-emerald-600 font-medium py-2 transition-colors"
                >
                  <ShoppingCart className="w-5 h-5" />
                  My Cart
                </Link>
                <Link
                  to="/how-it-works"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center gap-3 text-gray-700 hover:text-emerald-600 font-medium py-2 transition-colors"
                >
                  <Info className="w-5 h-5" />
                  How It Works
                </Link>
                <button
                  onClick={handleLogout}
                  className="flex items-center gap-3 text-red-600 hover:text-red-700 font-medium py-2 transition-colors"
                >
                  <LogOut className="w-5 h-5" />
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center gap-3 text-gray-700 hover:text-emerald-600 font-medium py-2 transition-colors"
                >
                  <LogIn className="w-5 h-5" />
                  Sign In
                </Link>
                <Link
                  to="/register"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center gap-3 text-gray-700 hover:text-emerald-600 font-medium py-2 transition-colors"
                >
                  <UserPlus className="w-5 h-5" />
                  Sign Up
                </Link>
                <Link
                  to="/how-it-works"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center gap-3 text-gray-700 hover:text-emerald-600 font-medium py-2 transition-colors"
                >
                  <Info className="w-5 h-5" />
                  How It Works
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
