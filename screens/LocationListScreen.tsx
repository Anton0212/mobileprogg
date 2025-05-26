import React, { useContext } from 'react';
import { View, Text, FlatList, StyleSheet } from 'react-native';
import { LocationContext } from '../context/LocationContext';

export default function LocationListScreen() {
  const { locations } = useContext(LocationContext);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Saved Locations</Text>
      <FlatList
        data={locations}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.itemBox}>
            <Text>{item.name}</Text>
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: 'white' },
  title: { fontSize: 24, fontWeight: 'bold', marginBottom: 20 },
  itemBox: { padding: 15, borderBottomWidth: 1, borderBottomColor: '#ccc' },
});
