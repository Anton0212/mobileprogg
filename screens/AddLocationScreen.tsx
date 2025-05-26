import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, Alert } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../App';

type Props = NativeStackScreenProps<RootStackParamList, 'AddLocation'>;

export default function AddLocationScreen({ navigation }: Props) {
  const [locationName, setLocationName] = useState('');

  const handleAddLocation = () => {
    if (!locationName.trim()) {
      Alert.alert('Please enter a location name');
      return;
    }

    // Here you could save the location to Firebase or your state
    Alert.alert('Location added:', locationName);

    // Navigate back to the location list or home
    navigation.navigate('Locations');
  };

  return (
    <View style={styles.container}>
      <Text style={styles.label}>Location Name:</Text>
      <TextInput
        style={styles.input}
        placeholder="Enter a location"
        value={locationName}
        onChangeText={setLocationName}
      />
      <Button title="Add Location" onPress={handleAddLocation} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    justifyContent: 'center',
    backgroundColor: '#fff',
  },
  label: {
    fontSize: 18,
    marginBottom: 10,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    paddingHorizontal: 10,
    paddingVertical: 8,
    marginBottom: 20,
    fontSize: 16,
    borderRadius: 4,
  },
});

