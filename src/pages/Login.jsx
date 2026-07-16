import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    alert('Login feature coming soon!');
  };

  return (
    <div className="min-h-[70vh] flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        <div className="bg-white rounded-lg shadow-lg p-8">
          <h1 className="text-3xl font-bold mb-2">Welcome Back</h1>
          <p className="text-gray-600 mb-8">Sign in to your HomeEase account</p>

          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label className="block text-sm font-semibold mb-2">Email</label>
              <input 
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full border border-gray-300 rounded px-4 py-2 focus:outline-none focus:border-orange-500"
                placeholder="you@example.com"
              />
            </div>

            <div className="mb-6">
              <label className="block text-sm font-semibold mb-2">Password</label>
              <input 
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full border border-gray-300 rounded px-4 py-2 focus:outline-none focus:border-orange-500"
                placeholder="••••••••"
              />
            </div>

            <button 
              type="submit"
              className="w-full btn-primary py-2 mb-4"
            >
              Sign In
            </button>
          </form>

          <p className="text-center text-gray-600 mb-4">
            Don't have an account?{' '}
            <Link to="/register" className="text-orange-500 font-semibold hover:text-orange-600">
              Sign up
            </Link>
          </p>

          <button 
            className="w-full btn-outline py-2"
            onClick={() => alert('Social login coming soon!')}
          >
            Continue with Google
          </button>
        </div>
      </div>
    </div>
  );
}
