import React, { createContext, useState, useEffect, ReactNode } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

export type Location = {
  id: string;
  name: string;
  description: string;
  rating: number;
  latitude: number;
  longitude: number;
};

// Add removeLocation to the type:
type LocationContextType = {
  locations: Location[];
  addLocation: (location: Location) => void;
  updateLocation: (location: Location) => void;
  removeLocation: (id: string) => void;  // <-- Add this
};

export const LocationContext = createContext<LocationContextType>({
  locations: [],
  addLocation: () => { },
  updateLocation: () => { },
  removeLocation: function (id: string): void {
    throw new Error('Function not implemented.');
  }
});

export const LocationProvider = ({ children }: { children: ReactNode }) => {
  const [locations, setLocations] = useState<Location[]>([]);

  useEffect(() => {
    const loadLocations = async () => {
      const saved = await AsyncStorage.getItem('locations');
      if (saved) setLocations(JSON.parse(saved));
    };
    loadLocations();
  }, []);

  const saveLocations = async (updated: Location[]) => {
    setLocations(updated);
    await AsyncStorage.setItem('locations', JSON.stringify(updated));
  };

  const addLocation = async (newLoc: Location) => {
    const updated = [...locations, newLoc];
    await saveLocations(updated);
  };

  const updateLocation = async (updatedLoc: Location) => {
    const updated = locations.map((loc) =>
      loc.id === updatedLoc.id ? updatedLoc : loc
    );
    await saveLocations(updated);
  };

  // Implement removeLocation
  const removeLocation = async (id: string) => {
    const updated = locations.filter((loc) => loc.id !== id);
    await saveLocations(updated);
  };

  return (
    <LocationContext.Provider value={{ locations, addLocation, updateLocation, removeLocation }}>
      {children}
    </LocationContext.Provider>
  );
};

