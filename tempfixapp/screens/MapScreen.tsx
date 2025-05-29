import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ActivityIndicator, Alert, Platform } from 'react-native';
import MapView, { Marker, PROVIDER_GOOGLE } from 'react-native-maps';
import * as Location from 'expo-location';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../App';
import { Location as LocationType } from '../context/LocationContext';

type Props = NativeStackScreenProps<RootStackParamList, 'Map'>;

export default function MapScreen({ route, navigation }: Props) {
  const location: LocationType | null | undefined = route.params?.location ?? null;

  const [userLocation, setUserLocation] = useState<{ latitude: number; longitude: number } | null>(null);
  const [loadingUserLocation, setLoadingUserLocation] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        let { status } = await Location.requestForegroundPermissionsAsync();
        if (status !== 'granted') {
          Alert.alert('Permission denied', 'Permission to access location was denied.');
          setLoadingUserLocation(false);
          return;
        }

        const userLoc = await Location.getCurrentPositionAsync({});
        setUserLocation({
          latitude: userLoc.coords.latitude,
          longitude: userLoc.coords.longitude,
        });
      } catch (error) {
        Alert.alert('Error', 'Failed to get user location.');
      } finally {
        setLoadingUserLocation(false);
      }
    })();
  }, []);

  if (!location) {
    return (
      <View style={styles.centered}>
        <Text style={styles.message}>No location data provided. Please select a location.</Text>
      </View>
    );
  }

  if (loadingUserLocation) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" />
        <Text>Loading your location...</Text>
      </View>
    );
  }

  return (
    <MapView
      style={styles.map}
      provider={PROVIDER_GOOGLE} // Use Google Maps on Android and iOS
      showsUserLocation={true}
      initialRegion={{
        latitude: location.latitude,
        longitude: location.longitude,
        latitudeDelta: 0.05,
        longitudeDelta: 0.05,
      }}
      showsMyLocationButton={true}
      zoomControlEnabled={true}
      loadingEnabled={true}
    >
      <Marker
        coordinate={{ latitude: location.latitude, longitude: location.longitude }}
        title={location.name}
        description={location.description}
      />
      {userLocation && (
        <Marker
          coordinate={userLocation}
          title="Your Location"
          pinColor="blue"
        />
      )}
    </MapView>
  );
}

const styles = StyleSheet.create({
  map: {
    flex: 1,
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  message: {
    fontSize: 16,
    paddingHorizontal: 20,
    textAlign: 'center',
  },
});
