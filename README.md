# HomeEase Frontend Application

Pixel-perfect React, Vite, Tailwind CSS & Socket.io frontend application for the **HomeEase** on-demand home-services marketplace.

## Features
- **Modern Responsive UI**: Tailwind CSS styled components with glassmorphism, responsive drawer layouts, custom icons, and zero layout shift.
- **Dynamic Price Engine Breakdown Card**: Visualizes base catalog rate, demand multiplier surge badge, distance surcharge, and total locked price.
- **Interactive Live Map Tracking**: Leaflet & OpenStreetMap powered real-time map displaying provider position marker, destination pin, and speed gauges.
- **In-App Live Chat**: Real-time Socket.io chat panel embedding into active jobs.
- **Provider Skill-Verification Badges**: Renders verified skill and background badges across catalog listings, provider cards, and job screens.
- **Admin Master Console**: KPI overview analytics, document verification queue, dispute resolution panel, and user roster.

---

## Environment Variables (`.env`)

Create a `.env` file in the frontend root directory:

```env
VITE_API_URL=http://localhost:5000/api
VITE_SOCKET_URL=http://localhost:5000
VITE_STRIPE_PUBLIC_KEY=pk_test_mock_homeease_public_key_12345
```

---

## Installation & Running

```bash
# Install dependencies
npm install

# Start Vite dev server
npm run dev
```

App runs at `http://localhost:5173`.