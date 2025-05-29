import React, { useState, useContext } from 'react';
import { View, TextInput, Button, StyleSheet, Alert } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../App';
import { LocationContext, Location } from '../context/LocationContext';

type Props = NativeStackScreenProps<RootStackParamList, 'EditLocation'>;

export default function EditLocationScreen({ route, navigation }: Props) {
  const { location } = route.params;
  const { updateLocation } = useContext(LocationContext);

  const [name, setName] = useState(location.name);
  const [description, setDescription] = useState(location.description);
  const [rating, setRating] = useState(location.rating);

  const handleSave = () => {
    if (!name.trim() || rating < 1 || rating > 5) {
      Alert.alert('Please fill in valid data');
      return;
    }

    const updatedLocation: Location = {
      ...location,
      name,
      description,
      rating,
    };

    updateLocation(updatedLocation);
    navigation.goBack();
  };

  return (
    <View style={styles.container}>
      <TextInput
        value={name}
        onChangeText={setName}
        placeholder="Name"
        style={styles.input}
      />
      <TextInput
        value={description}
        onChangeText={setDescription}
        placeholder="Description"
        style={styles.input}
      />
      <TextInput
        value={rating.toString()}
        onChangeText={(text) => setRating(Number(text))}
        placeholder="Rating (1-5)"
        keyboardType="numeric"
        style={styles.input}
      />
      <Button title="Save Changes" onPress={handleSave} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: 'white' },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    marginBottom: 15,
    padding: 10,
    borderRadius: 6,
  },
});
