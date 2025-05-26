console.log('HomeScreen loaded');

import React from 'react';
import { View, Text, TextInput, Button } from 'react-native';

export default function AddLocationScreen({ navigation }: any) {
  return (
    <View style={{ padding: 20 }}>
      <Text>Add a New Location</Text>
      {/* Add inputs here later */}
      <Button title="Save Location" onPress={() => navigation.goBack()} />
    </View>
  );
}
