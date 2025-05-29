import React, { useContext } from 'react';
import { View, Text, FlatList, StyleSheet, TouchableOpacity, Button } from 'react-native';
import { LocationContext, Location } from '../context/LocationContext';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../App';

type Props = NativeStackScreenProps<RootStackParamList, 'Locations'>;

export default function LocationListScreen({ navigation }: Props) {
  const { locations, removeLocation } = useContext(LocationContext);

  const renderItem = ({ item }: { item: Location }) => (
    <TouchableOpacity
      style={styles.itemBox}
      onPress={() => navigation.navigate('Map', { location: item })}
    >
      <View style={{ flex: 1 }}>
        <Text style={styles.name}>{item.name}</Text>
        <Text style={styles.description}>{item.description}</Text>
        <Text style={styles.rating}>⭐ {item.rating} / 5</Text>
      </View>
      <Button
        title="Delete"
        color="red"
        onPress={() => removeLocation(item.id)}
      />
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Saved Locations</Text>
      {locations.length === 0 ? (
        <Text style={styles.emptyText}>No locations added yet.</Text>
      ) : (
        <FlatList
          data={locations}
          keyExtractor={(item) => item.id}
          renderItem={renderItem}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: 'white' },
  title: { fontSize: 24, fontWeight: 'bold', marginBottom: 20 },
  itemBox: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
    marginBottom: 10,
    borderRadius: 6,
    backgroundColor: '#f9f9f9',
  },
  name: { fontSize: 18, fontWeight: '600' },
  description: { fontSize: 14, color: '#555', marginVertical: 4 },
  rating: { color: '#888' },
  emptyText: { color: '#666', fontStyle: 'italic' },
});
