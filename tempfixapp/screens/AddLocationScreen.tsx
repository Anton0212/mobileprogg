import React, { useState, useContext } from 'react';
import {
  View,
  Text,
  TextInput,
  Button,
  StyleSheet,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../App';
import uuid from 'react-native-uuid';
import { LocationContext, Location } from '../context/LocationContext';

const GEOCODING_URL = 'https://nominatim.openstreetmap.org/search';

type Props = NativeStackScreenProps<RootStackParamList, 'AddLocation'>;

export default function AddLocationScreen({ navigation }: Props) {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [rating, setRating] = useState('');
  const [errors, setErrors] = useState<{ name?: string; description?: string; rating?: string }>({});
  const { addLocation } = useContext(LocationContext);
  const [loading, setLoading] = useState(false);

  const validate = () => {
    const newErrors: typeof errors = {};
    if (!name.trim()) newErrors.name = 'Name is required';
    if (!description.trim()) newErrors.description = 'Description is required';

    const ratingNum = Number(rating);
    if (!rating || isNaN(ratingNum) || ratingNum < 1 || ratingNum > 5) {
      newErrors.rating = 'Rating must be a number between 1 and 5';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleGeocode = async () => {
    const response = await fetch(
      `${GEOCODING_URL}?q=${encodeURIComponent(name)}&format=json`,
      {
        headers: {
          'User-Agent': 'tempfixapp/1.0 (your_email@example.com)',
        },
      }
    );
    const data = await response.json();
    if (data.length > 0) {
      return {
        latitude: parseFloat(data[0].lat),
        longitude: parseFloat(data[0].lon),
      };
    } else {
      setErrors({ name: 'Could not find coordinates for that location' });
      return null;
    }
  };

  const handleAdd = async () => {
    if (!validate()) return;

    setLoading(true);
    const coords = await handleGeocode();
    setLoading(false);

    if (!coords) return;

    const newLocation: Location = {
      id: uuid.v4() as string,
      name: name.trim(),
      description: description.trim(),
      rating: Number(rating),
      latitude: coords.latitude,
      longitude: coords.longitude,
    };

    await addLocation(newLocation);
    setName('');
    setDescription('');
    setRating('');
    setErrors({});
    navigation.navigate('Locations');
  };

  const isButtonDisabled = !name.trim() || !description.trim() || !rating || loading || Object.keys(errors).length > 0;

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <View style={styles.field}>
        <Text style={styles.label}>Location Name</Text>
        <TextInput
          style={[styles.input, errors.name && styles.inputError]}
          value={name}
          onChangeText={(text) => {
            setName(text);
            if (errors.name) setErrors((prev) => ({ ...prev, name: undefined }));
          }}
          placeholder="e.g. Paris"
          autoCapitalize="words"
        />
        {errors.name && <Text style={styles.errorText}>{errors.name}</Text>}
      </View>

      <View style={styles.field}>
        <Text style={styles.label}>Description</Text>
        <TextInput
          style={[styles.input, errors.description && styles.inputError]}
          value={description}
          onChangeText={(text) => {
            setDescription(text);
            if (errors.description) setErrors((prev) => ({ ...prev, description: undefined }));
          }}
          placeholder="e.g. Capital of France"
          multiline
        />
        {errors.description && <Text style={styles.errorText}>{errors.description}</Text>}
      </View>

      <View style={styles.field}>
        <Text style={styles.label}>Rating (1–5)</Text>
        <TextInput
          style={[styles.input, errors.rating && styles.inputError]}
          keyboardType="numeric"
          value={rating}
          onChangeText={(text) => {
            setRating(text);
            if (errors.rating) setErrors((prev) => ({ ...prev, rating: undefined }));
          }}
          placeholder="Enter a rating from 1 to 5"
          maxLength={1}
        />
        {errors.rating && <Text style={styles.errorText}>{errors.rating}</Text>}
      </View>

      <TouchableOpacity
        onPress={handleAdd}
        disabled={isButtonDisabled}
        style={[styles.button, isButtonDisabled && styles.buttonDisabled]}
      >
        <Text style={styles.buttonText}>{loading ? 'Adding...' : 'Add Location'}</Text>
      </TouchableOpacity>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: 'white' },
  field: { marginBottom: 15 },
  label: { fontSize: 16, fontWeight: 'bold', marginBottom: 6 },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 6,
    padding: 10,
    backgroundColor: 'white',
  },
  inputError: {
    borderColor: 'red',
  },
  errorText: {
    color: 'red',
    marginTop: 4,
    fontSize: 12,
  },
  button: {
    backgroundColor: '#007AFF',
    paddingVertical: 15,
    borderRadius: 6,
    alignItems: 'center',
  },
  buttonDisabled: {
    backgroundColor: '#A0A0A0',
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
