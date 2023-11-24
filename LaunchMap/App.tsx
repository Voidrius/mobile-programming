import React, {useState} from 'react';
import {View, TextInput, Button, Platform, Linking} from 'react-native';

const App = () => {
  const [latitude, setLatitude] = useState('0');
  const [longitude, setLongitude] = useState('0');

  const launchMap = () => {
    const location = `${latitude},${longitude}`;
    const url = Platform.select({
      ios: `maps:${location}`,
      android: `geo:${location}?center=${location}&q=${location}&z=16`,
    });
    Linking.openURL(url);
  };

  return (
    <View style={{padding: 20}}>
      <TextInput
        style={{borderBottomWidth: 1, marginBottom: 15}}
        placeholder="Latitude"
        onChangeText={text => setLatitude(text)}
        keyboardType="numeric"
      />
      <TextInput
        style={{borderBottomWidth: 1, marginBottom: 15}}
        placeholder="Longitude"
        onChangeText={text => setLongitude(text)}
        keyboardType="numeric"
      />
      <Button title="Launch a Map" onPress={launchMap} />
    </View>
  );
};

export default App;
