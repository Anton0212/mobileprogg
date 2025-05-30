import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import HomeScreen from './screens/HomeScreen';
import DetailsScreen from './screens/DetailsScreen';
import LocationListScreen from './screens/LocationListScreen';
import AddLocationScreen from './screens/AddLocationScreen';
import MapScreen from './screens/MapScreen';
import EditLocationScreen from './screens/EditLocationScreen';

import { LocationProvider, Location } from './context/LocationContext';

export type RootStackParamList = {
  Home: undefined;
  Details: undefined;
  Locations: undefined;
  AddLocation: undefined;
  Map: { location?: Location };
  EditLocation: { location: Location };
};

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function App() {
  return (
    <LocationProvider>
      <NavigationContainer>
        <Stack.Navigator initialRouteName="Home">
          <Stack.Screen name="Home" component={HomeScreen} />
          <Stack.Screen name="Details" component={DetailsScreen} />
          <Stack.Screen name="Locations" component={LocationListScreen} />
          <Stack.Screen name="AddLocation" component={AddLocationScreen} />
          <Stack.Screen name="Map" component={MapScreen} />
          <Stack.Screen name="EditLocation" component={EditLocationScreen} />
        </Stack.Navigator>
      </NavigationContainer>
    </LocationProvider>
  );
}
