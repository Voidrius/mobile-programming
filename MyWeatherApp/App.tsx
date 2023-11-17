import React, {useState, useEffect} from 'react';
import {SafeAreaView, ScrollView, Text, StyleSheet} from 'react-native';
import {Header, Card, Input, Button, Image} from 'react-native-elements';
import Dialog from 'react-native-dialog';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import useAxios from 'axios-hooks';
import Icon from 'react-native-vector-icons/FontAwesome';

const App = () => {
  const [modalVisible, setModalVisible] = useState(false);
  const [cityName, setCityName] = useState('');
  const [cities, setCities] = useState([]);

  useEffect(() => {
    getData();
  }, []);

  useEffect(() => {
    storeData();
  }, [cities]);

  const openDialog = () => {
    setModalVisible(true);
  };

  const cancelCity = () => {
    setModalVisible(false);
  };

  const addCity = () => {
    setCities([...cities, {id: Math.random(), name: cityName}]);
    setModalVisible(false);
  };

  const deleteCity = deleteCityId => {
    let filteredArray = cities.filter(city => city.id !== deleteCityId);
    setCities(filteredArray);
  };

  const refreshForecast = async cityId => {
    const cityIndex = cities.findIndex(city => city.id === cityId);

    if (cityIndex !== -1) {
      const updatedCities = [...cities];
      const city = updatedCities[cityIndex];

      try {
        const response = await axios.get(
          `https://api.openweathermap.org/data/2.5/weather?q=${city.name}&appid=YOUR_API_KEY_HERE&units=metric`,
        );

        const updatedCity = {
          ...city,
          weather: response.data.weather[0].main,
          temp: response.data.main.temp,
        };

        updatedCities[cityIndex] = updatedCity;
        setCities(updatedCities);
      } catch (error) {
        console.error('Error refreshing weather forecast:', error.message);
      }
    }
  };

  const storeData = async () => {
    try {
      await AsyncStorage.setItem('@cities', JSON.stringify(cities));
    } catch (e) {
      console.log('Cities saving error!');
    }
  };

  const getData = async () => {
    try {
      const value = await AsyncStorage.getItem('@cities');
      if (value !== null) {
        setCities(JSON.parse(value));
      }
    } catch (e) {
      console.log('Cities loading error!');
    }
  };

  return (
    <SafeAreaView>
      <Header
        centerComponent={{text: 'Weather App', style: {color: '#fff'}}}
        rightComponent={{icon: 'add', color: '#fff', onPress: openDialog}}
      />
      <Dialog.Container visible={modalVisible}>
        <Dialog.Title>Add a new city</Dialog.Title>
        <Input
          onChangeText={text => setCityName(text)}
          placeholder="Type city name here"
        />
        <Dialog.Button label="Add" onPress={addCity} />
        <Dialog.Button label="Cancel" onPress={cancelCity} />
      </Dialog.Container>

      <ScrollView>
        {cities.map(city => (
          <WeatherForecast
            key={city.id}
            city={city}
            deleteCity={deleteCity}
            refreshForecast={refreshForecast}
          />
        ))}
      </ScrollView>
    </SafeAreaView>
  );
};

const WeatherForecast = ({city, deleteCity, refreshForecast}) => {
  const API_KEY = '963a8e299d5d22712b3af18ba22cf4a8';
  const URL = 'https://api.openweathermap.org/data/2.5/weather?q=';

  const [{data, loading, error}, refetch] = useAxios(
    `${URL}${city.name}&appid=${API_KEY}&units=metric`,
  );

  const deleteCityHandler = () => {
    deleteCity(city.id);
  };

  if (loading) {
    return <LoadingCard />;
  }

  if (error) {
    return <ErrorCard />;
  }
  return (
    <Card containerStyle={styles.card}>
      <Card.Title style={styles.cardTitle}>{data.name}</Card.Title>
      <Text style={styles.cardText}>Main: {data.weather[0].main}</Text>
      <Text style={styles.cardText}>Temp: {data.main.temp} °C</Text>
      <Text style={styles.cardText}>Feels like: {data.main.feels_like} °C</Text>
      <Text style={styles.cardText}>
        Min - Max: {data.main.temp_min} {data.main.temp_max} °C
      </Text>
      <Text style={styles.cardText}>Humidity: {data.main.humidity} %</Text>
      <Image
        source={{
          uri: `https://openweathermap.org/img/w/${data.weather[0].icon}.png`,
        }}
        style={{width: 70, height: 50}}
      />
      <Button title="Refresh" onPress={refreshForecast} />
      <Button title="Remove" onPress={deleteCityHandler} />
    </Card>
  );
};

const LoadingCard = () => (
  <Card>
    <Card.Title>Loading....</Card.Title>
  </Card>
);

const ErrorCard = () => (
  <Card>
    <Card.Title>Error while fetching weather data!</Card.Title>
  </Card>
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f0f0f0',
  },
  headerText: {
    color: '#fff',
  },
  card: {
    borderRadius: 10,
    backgroundColor: '#fff',
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  cardText: {
    fontSize: 16,
  },
});

export default App;
