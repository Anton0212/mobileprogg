import React from 'react';
import { View, Button, StyleSheet } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../App';

type Props = NativeStackScreenProps<RootStackParamList, 'Home'>;

export default function HomeScreen({ navigation }: Props) {
  return (
    <View style={styles.container}>
      <Button title="Go to Details" onPress={() => navigation.navigate('Details')} />
      <Button title="View Locations" onPress={() => navigation.navigate('Locations')} />
      <Button title="Add Location" onPress={() => navigation.navigate('AddLocation')} />
      <Button title="View Map" onPress={() => navigation.navigate('Map')} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'space-around',
    padding: 20,
  },
});
