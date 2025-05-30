import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ActivityIndicator, Alert } from 'react-native';
import MapView, { Marker, PROVIDER_GOOGLE } from 'react-native-maps';
import * as Location from 'expo-location';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../App';
import { Location as LocationType } from '../context/LocationContext';

type Props = NativeStackScreenProps<RootStackParamList, 'Map'>;

export default function MapScreen({ route }: Props) {
  const location: LocationType | undefined = route.params?.location;

  const [userLocation, setUserLocation] = useState<{ latitude: number; longitude: number } | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        let { status } = await Location.requestForegroundPermissionsAsync();
        if (status !== 'granted') {
          Alert.alert('Permission denied', 'Permission to access location was denied.');
          setLoading(false);
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
        setLoading(false);
      }
    })();
  }, []);

  if (loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" />
        <Text>Loading location...</Text>
      </View>
    );
  }

  // Määritä kartan keskipiste: joko valittu paikka tai käyttäjän sijainti
  const region = location
    ? {
        latitude: location.latitude,
        longitude: location.longitude,
        latitudeDelta: 0.05,
        longitudeDelta: 0.05,
      }
    : userLocation
    ? {
        latitude: userLocation.latitude,
        longitude: userLocation.longitude,
        latitudeDelta: 0.05,
        longitudeDelta: 0.05,
      }
    : null;

  if (!region) {
    return (
      <View style={styles.centered}>
        <Text>Unable to determine location.</Text>
      </View>
    );
  }

  return (
    <MapView
      style={styles.map}
      provider={PROVIDER_GOOGLE}
      initialRegion={region}
      showsUserLocation={true}
      showsMyLocationButton={true}
      zoomControlEnabled={true}
      loadingEnabled={true}
    >
      {location && (
        <Marker
          coordinate={{ latitude: location.latitude, longitude: location.longitude }}
          title={location.name}
          description={location.description}
        />
      )}
      {!location && userLocation && (
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
});
