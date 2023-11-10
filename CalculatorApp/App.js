import React, { useState } from 'react';
import { View, Text, Button, TextInput, StyleSheet, TouchableOpacity } from 'react-native';

export default function App() {
  const [number1, setNumber1] = useState('');
  const [number2, setNumber2] = useState('');
  const [result, setResult] = useState(0);

  const addNumbers = () => {
    const sum = parseFloat(number1) + parseFloat(number2);
    setResult(sum);
  };

  const subtractNumbers = () => {
    const sum = parseFloat(number1) - parseFloat(number2);
    setResult(sum);
  };

  const divideNumbers = () => {
    const sum = parseFloat(number1) / parseFloat(number2);
    setResult(sum);
  };

  const multiplyNumbers = () => {
    const sum = parseFloat(number1) * parseFloat(number2);
    setResult(sum);
  }

  return (
    <View style={styles.container}>
      <Text>Calculator App</Text>
      <TextInput
        style={styles.input}
        placeholder="Enter number 1"
        keyboardType="numeric"
        value={number1}
        onChangeText={(text) => setNumber1(text)}
      />
      <TextInput
        style={styles.input}
        placeholder="Enter number 2"
        keyboardType="numeric"
        value={number2}
        onChangeText={(text) => setNumber2(text)}
      />
      <TouchableOpacity onPress={addNumbers} style={styles.appButtonContainer}>
      <Text style={styles.appButtonText}>Add Numbers</Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={subtractNumbers} style={styles.appButtonContainer}>
      <Text style={styles.appButtonText}>Subtract Numbers</Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={multiplyNumbers} style={styles.appButtonContainer}>
      <Text style={styles.appButtonText}>Multiply Numbers</Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={divideNumbers} style={styles.appButtonContainer}>
      <Text style={styles.appButtonText}>Divide Numbers</Text>
      </TouchableOpacity>

      <Text>Result: {result}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 5,
  },
  input: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    margin: 10,
    padding: 5,
    width: 200,
    textAlign: 'center',
  },
    appButtonContainer: {
      elevation: 8,
      backgroundColor: "#009688",
      borderRadius: 10,
      paddingVertical: 10,
      paddingHorizontal: 12,
      marginVertical: 5,
      width: 180
    },
    appButtonText: {
      fontSize: 18,
      color: "#fff",
      fontWeight: "bold",
      alignSelf: "center",
      textTransform: "uppercase"
    }
});