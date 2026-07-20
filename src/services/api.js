import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add auth token interceptor
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('homeease_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Auth Services
export const authAPI = {
  login: (credentials) => api.post('/auth/login', credentials),
  register: (userData) => api.post('/auth/register', userData),
  getMe: () => api.get('/auth/me'),
  getProviders: (category) => api.get(`/auth/providers${category ? `?category=${category}` : ''}`),
};

// User Profile API
export const userAPI = {
  updateProfile: (data) => api.put('/users/profile', data),
};

// Service Catalog APIs
export const serviceAPI = {
  getAll: (category, search) => {
    const params = new URLSearchParams();
    if (category) params.append('category', category);
    if (search) params.append('search', search);
    return api.get(`/services?${params.toString()}`);
  },
  getCategories: () => api.get('/services/categories'),
  getById: (id) => api.get(`/services/${id}`),
};

// Dynamic Pricing Engine API
export const pricingAPI = {
  calculate: (data) => api.post('/pricing/calculate', data),
};

// Booking APIs
export const bookingAPI = {
  create: (bookingData) => api.post('/bookings', bookingData),
  getUserBookings: () => api.get('/bookings/user'),
  getById: (id) => api.get(`/bookings/${id}`),
  updateStatus: (id, status) => api.put(`/bookings/${id}/status`, { status }),
};

// Live Tracking APIs
export const trackingAPI = {
  getStatus: (bookingId) => api.get(`/tracking/${bookingId}`),
  updateLocation: (data) => api.post('/tracking/update-location', data),
};

// In-App Chat API
export const chatAPI = {
  getBookingMessages: (bookingId) => api.get(`/chat/${bookingId}`),
  sendMessage: (data) => api.post('/chat', data),
};

// Disputes API
export const disputeAPI = {
  create: (data) => api.post('/disputes', data),
  getUserDisputes: () => api.get('/disputes/user'),
  resolve: (disputeId, data) => api.put(`/disputes/${disputeId}/resolve`, data),
};

// Admin Console API
export const adminAPI = {
  getAnalytics: () => api.get('/admin/analytics'),
  getUsers: () => api.get('/admin/users'),
};

// Provider Badges API
export const badgeAPI = {
  getProviderBadges: (providerId) => api.get(`/badges/provider/${providerId}`),
  grantBadge: (data) => api.post('/badges/grant', data),
  revokeBadge: (id) => api.delete(`/badges/${id}`),
};

// Verification API
export const verificationAPI = {
  submit: (data) => api.post('/verifications/submit', data),
  getMyVerifications: () => api.get('/verifications/my-verifications'),
  getPending: () => api.get('/verifications/pending'),
  review: (id, data) => api.put(`/verifications/${id}/review`, data),
};

// Stripe Payments & Connect Payouts API
export const paymentAPI = {
  createHold: (data) => api.post('/payments/create-hold', data),
  cancelHold: (data) => api.post('/payments/cancel-hold', data),
  processPayout: (data) => api.post('/payments/payout', data),
  connectAccount: () => api.post('/payments/connect-account'),
};

// Rating & Reviews API
export const ratingAPI = {
  submit: (data) => api.post('/ratings', data),
  getProviderRatings: (providerId) => api.get(`/ratings/provider/${providerId}`),
};

export default api;
