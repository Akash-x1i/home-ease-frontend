import React, { createContext, useContext, useState, useEffect } from 'react';
import { userAPI } from '../services/api';

export const indianLocations = [
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

const LocationContext = createContext(null);

export function LocationProvider({ children }) {
  const [location, setLocationState] = useState(() => {
    const saved = localStorage.getItem('homeease_location');
    return saved ? JSON.parse(saved) : indianLocations[0];
  });

  const changeLocation = (newLoc) => {
    setLocationState(newLoc);
    localStorage.setItem('homeease_location', JSON.stringify(newLoc));
    window.dispatchEvent(new CustomEvent('homeease_location_changed', { detail: newLoc }));

    // Sync with backend user profile if token exists
    const token = localStorage.getItem('homeease_token');
    if (token) {
      userAPI.updateProfile({ city: newLoc.city, state: newLoc.state, lat: newLoc.lat, lng: newLoc.lng }).catch(() => {});
    }
  };

  return (
    <LocationContext.Provider value={{ location, changeLocation, locations: indianLocations }}>
      {children}
    </LocationContext.Provider>
  );
}

export function useLocationContext() {
  const ctx = useContext(LocationContext);
  if (!ctx) {
    throw new Error('useLocationContext must be used within a LocationProvider');
  }
  return ctx;
}
