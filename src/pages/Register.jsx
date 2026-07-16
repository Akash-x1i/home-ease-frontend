import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

export default function Register() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    userType: 'customer',
  });
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    alert('Registration feature coming soon!');
  };

  return (
    <div className="min-h-[70vh] flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        <div className="bg-white rounded-lg shadow-lg p-8">
          <h1 className="text-3xl font-bold mb-2">Create Account</h1>
          <p className="text-gray-600 mb-8">Join HomeEase today</p>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-semibold mb-2">Full Name</label>
              <input 
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded px-4 py-2 focus:outline-none focus:border-primary"
                placeholder="John Doe"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold mb-2">Email</label>
              <input 
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded px-4 py-2 focus:outline-none focus:border-primary"
                placeholder="you@example.com"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold mb-2">I'm a:</label>
              <select 
                name="userType"
                value={formData.userType}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded px-4 py-2 focus:outline-none focus:border-primary"
              >
                <option value="customer">Customer</option>
                <option value="professional">Service Professional</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-semibold mb-2">Password</label>
              <input 
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded px-4 py-2 focus:outline-none focus:border-primary"
                placeholder="••••••••"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold mb-2">Confirm Password</label>
              <input 
                type="password"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded px-4 py-2 focus:outline-none focus:border-primary"
                placeholder="••••••••"
              />
            </div>

            <button 
              type="submit"
              className="w-full btn-primary py-2 mb-4"
            >
              Create Account
            </button>
          </form>

          <p className="text-center text-gray-600">
            Already have an account?{' '}
            <Link to="/login" className="text-primary font-semibold hover:text-orange-600">
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
