import React, { createContext, useState, ReactNode } from 'react';

export type Location = {
  id: string;
  name: string;
  latitude: number;
  longitude: number;
};

type LocationContextType = {
  locations: Location[];
  addLocation: (name: string) => void;
};

export const LocationContext = createContext<LocationContextType>({
  locations: [],
  addLocation: () => {},
});

export const LocationProvider = ({ children }: { children: ReactNode }) => {
  const [locations, setLocations] = useState<Location[]>([]);

  const addLocation = async (name: string) => {
    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(name)}&format=json&limit=1`
      );
      const data = await response.json();

      if (data.length === 0) {
        console.warn('No location found for:', name);
        return;
      }

      const { lat, lon } = data[0];

      const newLocation = {
        id: Date.now().toString(),
        name,
        latitude: parseFloat(lat),
        longitude: parseFloat(lon),
      };

      setLocations((prev) => [...prev, newLocation]);
    } catch (error) {
      console.error('Geocoding failed:', error);
    }
  };

  return (
    <LocationContext.Provider value={{ locations, addLocation }}>
      {children}
    </LocationContext.Provider>
  );
};
