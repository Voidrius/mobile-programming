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
  TouchableOpacity,
} from 'react-native';
import Modal from 'react-native-modal';
import {WebView} from 'react-native-webview';
import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {useNavigation} from '@react-navigation/native';
import axios from 'axios';

const Stack = createNativeStackNavigator();

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
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
  detailsContainer: {
    paddingHorizontal: 20,
    paddingVertical: 10,
  },
  videoButton: {
    color: 'blue',
    textDecorationLine: 'underline',
    marginTop: 10,
    marginBottom: 10,
  },
  modalContent: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  webview: {
    width: 300,
    height: 300,
  },
  genreText: {
    fontSize: 14,
    color: 'gray',
  },
});

function MoviesList({navigation}) {
  const [movies, setMovies] = useState([]);

  useEffect(() => {
    axios
      .get(
        'https://api.themoviedb.org/3/movie/now_playing?api_key=15ef9e772da6656c75fbd9f1773cb945&append_to_response=genres,videos',
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
  const [isModalVisible, setModalVisible] = useState(false);
  const [modalVideo, setModalVideo] = useState(null);
  const [movieVideoData, setMovieVideoData] = useState(null);

  useEffect(() => {
    axios
      .get(
        `https://api.themoviedb.org/3/movie/${movie.id}?api_key=15ef9e772da6656c75fbd9f1773cb945&append_to_response=videos,genres`,
      )
      .then(response => {
        setMovieVideoData(response.data);
      });
  }, [movie.id]);

  const toggleModal = video => {
    setModalVisible(!isModalVisible);
    setModalVideo(video);
  };

  let IMAGEPATH = 'http://image.tmdb.org/t/p/w500';
  let imageurl = IMAGEPATH + movie.backdrop_path;

  return (
    <View>
      <Image source={{uri: imageurl}} style={styles.image} />
      <Text style={styles.title}>{movie.title}</Text>
      <Text style={styles.text}>{movie.release_date}</Text>
      <Text style={styles.text}>{movie.overview}</Text>

      {movieVideoData && movieVideoData.genres && (
        <>
          <Text style={styles.title}>Genres:</Text>
          <ScrollView style={styles.detailsContainer}>
            {movieVideoData.genres.map((genre, index) => (
              <Text key={index} style={styles.genreText}>
                {genre.name}
              </Text>
            ))}
          </ScrollView>
        </>
      )}

      {movieVideoData &&
      movieVideoData.videos &&
      movieVideoData.videos.results &&
      movieVideoData.videos.results.length > 0 ? (
        movieVideoData.videos.results.map((video, index) => (
          <TouchableOpacity key={index} onPress={() => toggleModal(video)}>
            <Text style={styles.videoButton}>{video.name}</Text>
          </TouchableOpacity>
        ))
      ) : (
        <Text>No videos available</Text>
      )}

      <Modal isVisible={isModalVisible} onBackdropPress={toggleModal}>
        <View style={styles.modalContent}>
          {modalVideo && (
            <WebView
              source={{
                uri: `https://www.youtube.com/embed/${modalVideo.key}?rel=0&autoplay=0&showinfo=0&controls=1`,
              }}
              style={styles.webview}
            />
          )}
        </View>
      </Modal>
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
