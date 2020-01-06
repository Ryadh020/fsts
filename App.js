import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import 'react-native-gesture-handler'

import Browser from './Components/Browser'
import MyMaps from './Components/MyMaps'

export default function App() {
  return (
      <View>
        <Browser></Browser>
      </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});