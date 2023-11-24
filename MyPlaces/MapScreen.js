import React, { useState, useEffect } from "react";
import { View, StyleSheet, Text, Image, TextInput } from "react-native";
import MapView, { Marker } from "react-native-maps";
import { FloatingAction } from "react-native-floating-action";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Modal from "react-native-modal";

const MapScreen = () => {
  const [markers, setMarkers] = useState([]);
  const [isDialogVisible, setIsDialogVisible] = useState(false);
  const [city, setCity] = useState("");
  const [text, setText] = useState("");

  useEffect(() => {
    // Load markers from AsyncStorage on component mount
    loadMarkers();
  }, []);

  const saveMarker = async () => {
    try {
      // Use OpenStreetMap Nominatim to get latitude and longitude
      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?city=${city}&format=json&limit=1`
      );
      const data = await response.json();

      if (data && data.length > 0) {
        const { lat, lon } = data[0];
        const newMarker = {
          id: Date.now().toString(),
          city,
          text,
          coordinate: { latitude: parseFloat(lat), longitude: parseFloat(lon) },
        };

        // Save the new marker to AsyncStorage
        const updatedMarkers = [...markers, newMarker];
        setMarkers(updatedMarkers);
        await AsyncStorage.setItem("markers", JSON.stringify(updatedMarkers));
        setIsDialogVisible(false);
        setCity("");
        setText("");
      }
    } catch (error) {
      console.error("Error saving marker:", error);
    }
  };

  const loadMarkers = async () => {
    try {
      // Load markers from AsyncStorage
      const storedMarkers = await AsyncStorage.getItem("markers");
      if (storedMarkers) {
        setMarkers(JSON.parse(storedMarkers));
      }
    } catch (error) {
      console.error("Error loading markers:", error);
    }
  };

  const handleFABPress = () => {
    setIsDialogVisible(true);
  };

  const actions = [
    {
      text: "Add Marker",
      icon: require("./assets/marker.png"),
      name: "add_marker",
      position: 1,
    },
  ];

  return (
    <View style={{ flex: 1 }}>
      <MapView
        style={{ flex: 1 }}
        initialRegion={{
          latitude: 0,
          longitude: 0,
          latitudeDelta: 10,
          longitudeDelta: 10,
        }}>
        {markers.map((marker) => (
          <Marker
            key={marker.id}
            coordinate={marker.coordinate}
            title={marker.city}
            description={marker.text}>
            <Image
              source={require("./assets/marker.png")}
              style={{ width: 40, height: 40 }}
            />
          </Marker>
        ))}
      </MapView>
      <FloatingAction actions={actions} onPressItem={handleFABPress} />
      <Modal isVisible={isDialogVisible}>
        <View style={styles.modal}>
          <Text>Add Marker</Text>
          <TextInput
            style={styles.input}
            placeholder="City"
            value={city}
            onChangeText={(text) => setCity(text)}
          />
          <TextInput
            style={styles.input}
            placeholder="Text"
            value={text}
            onChangeText={(text) => setText(text)}
          />
          <View style={styles.buttonContainer}>
            <Text onPress={saveMarker} style={styles.button}>
              Save
            </Text>
            <Text
              onPress={() => setIsDialogVisible(false)}
              style={styles.button}>
              Cancel
            </Text>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  modal: {
    backgroundColor: "white",
    padding: 22,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 4,
    borderColor: "rgba(0, 0, 0, 0.1)",
  },
  input: {
    borderBottomWidth: 1,
    marginBottom: 15,
    width: "100%",
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
  },
  button: {
    color: "blue",
  },
});

export default MapScreen;
