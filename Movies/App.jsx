import React, {useState, useEffect} from 'react';
import {
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  View,
  Image,
  TouchableHighlight,
} from 'react-native';
import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import axios from 'axios';

const Stack = createNativeStackNavigator();

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  movieItem: {
    margin: 5,
    flex: 1,
    flexDirection: 'row',
  },
  movieItemImage: {
    marginRight: 5,
  },
  movieItemTitle: {
    fontWeight: 'bold',
  },
  movieItemText: {
    flexWrap: 'wrap',
  },
  image: {
    height: 250,
    resizeMode: 'contain',
  },
  title: {
    fontWeight: 'bold',
    fontSize: 15,
    marginTop: 10,
  },
  text: {
    fontSize: 12,
    marginTop: 5,
    flexWrap: 'wrap',
  },
});

function MoviesList({navigation}) {
  const [movies, setMovies] = useState([]);

  useEffect(() => {
    axios
      .get(
        'https://api.themoviedb.org/3/movie/now_playing?api_key=15ef9e772da6656c75fbd9f1773cb945&append_to_response=videos',
      )
      .then(response => {
        console.log(response.data.results);
        setMovies(response.data.results);
      });
  }, []);

  if (movies.length === 0) {
    return (
      <View style={{flex: 1, padding: 20}}>
        <Text>Loading, please wait...</Text>
      </View>
    );
  }

  const itemPressed = index => {
    navigation.navigate('MovieDetails', {movie: movies[index]});
  };

  let movieItems = movies.map(function (movie, index) {
    return (
      <TouchableHighlight
        onPress={() => itemPressed(index)}
        underlayColor="lightgray"
        key={index}>
        <MovieListItem movie={movie} key={index} />
      </TouchableHighlight>
    );
  });

  return <ScrollView>{movieItems}</ScrollView>;
}

const MovieListItem = props => {
  let IMAGEPATH = 'http://image.tmdb.org/t/p/w500';
  let imageurl = IMAGEPATH + props.movie.poster_path;

  return (
    <View style={styles.movieItem}>
      <View style={styles.movieItemImage}>
        <Image source={{uri: imageurl}} style={{width: 99, height: 146}} />
      </View>
      <View style={{marginRight: 50}}>
        <Text style={styles.movieItemTitle}>{props.movie.title}</Text>
        <Text style={styles.movieItemText}>{props.movie.release_date}</Text>
        <Text
          numberOfLines={6}
          ellipsizeMode="tail"
          style={styles.movieItemText}>
          {props.movie.overview}
        </Text>
      </View>
    </View>
  );
};

const MovieListScreen = ({navigation}) => {
  return (
    <SafeAreaView>
      <StatusBar />
      <ScrollView contentInsetAdjustmentBehavior="automatic">
        <MoviesList navigation={navigation} />
      </ScrollView>
    </SafeAreaView>
  );
};

const MovieDetailScreen = ({route}) => {
  const {movie} = route.params;
  let IMAGEPATH = 'http://image.tmdb.org/t/p/w500';
  let imageurl = IMAGEPATH + movie.backdrop_path;

  return (
    <View>
      <Image source={{uri: imageurl}} style={styles.image} />
      <Text style={styles.title}>{movie.title}</Text>
      <Text style={styles.text}>{movie.release_date}</Text>
      <Text style={styles.text}>{movie.overview}</Text>
    </View>
  );
};

function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen
          name="MoviesList"
          component={MovieListScreen}
          options={{title: 'MovieList'}}
        />
        <Stack.Screen
          name="MovieDetails"
          component={MovieDetailScreen}
          options={{title: 'MovieDetails'}}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

export default App;
