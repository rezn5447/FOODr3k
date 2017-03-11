import React, { Component } from 'react';
import axios from 'axios';
import _ from 'lodash';
import {
  StyleSheet,
  View,
  Text,
  Dimensions,
  TouchableOpacity,
} from 'react-native';
import MapView, { MAP_TYPES } from 'react-native-maps';
const { width, height } = Dimensions.get('window');

// Github HQ:
// lat: 37.782227,
// lng: -122.391050

const ASPECT_RATIO = width / height;
const LATITUDE = 37.782227;
const LONGITUDE = -122.391050;
const LATITUDE_DELTA = 0.01;
const LONGITUDE_DELTA = LATITUDE_DELTA * ASPECT_RATIO;

const CLIENT_ID = '27037c67-f394-4cfd-ab51-069ac71132fb';
const OPENTABLE_ENDPOINT = 'https://platform.otqa.com/sync/listings?latitude="37.782227"&longitude="-122.391050"';
const API_DEBOUNCE_TIME = 2000;

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      region: {
        latitude: LATITUDE,
        longitude: LONGITUDE,
        latitudeDelta: LATITUDE_DELTA,
        longitudeDelta: LONGITUDE_DELTA,
      },
        userPosition: {
          id: 0,
          key: 0,
          title: 'You are here.',
          description: 'Welcome to FOODr3k!',
          coordinate: {
          latitude: LATITUDE,
          longitude: LONGITUDE,
          }
        },
      restaurants: [],
      markers: []
    };
  }
  componentWillMount() {

    axios.get('https://platform.otqa.com/sync/listings?latitude="37.782227"&longitude="-122.391050"', {
      headers: {"Authorization": "bearer 27037c67-f394-4cfd-ab51-069ac71132fb"}
    })
    .then(response => {
      console.log(response)
      this.setState({ restaurants: response.data })
      console.log(this.state.restaurants)
      this.randomRestaurant();
    });
  }
  componentDidMount() {
  }
  onRegionChange(region) {
    this.setState({ region });
  }
  setRestaurantMarker(restaurant) {
    this.setState({
      markers: [
        this.state.userPosition,
        { title: restaurant.name,
          key: restaurant.id,
          image: restaurant.image_url,
          coordinate: {
            latitude: restaurant.lat,
            longitude: restaurant.lng,
        } }]
    });
    console.log(this.state.markers);
  }
  fitAninmation() {
    // this.map.fitToCoordinates([MARKERS[2], MARKERS[3]], {
    //   edgePadding: { top: 100, right: 100, bottom: 100, left: 100 },
    //   animated: true,
    // });
  }
  randomRestaurant() {
     const { restaurants } = this.state.restaurants;
     const randRestaurant = _.sample(restaurants);
     this.setRestaurantMarker(randRestaurant);
    }

  render() {
    return (
      <View style={styles.container}>
        <MapView
          showsUserLocation
          showsMyLocationButton
          provider={this.props.provider}
          ref={ref => { this.map = ref; }}
          mapType={MAP_TYPES.STANDARD}
          style={styles.map}
          initialRegion={this.state.region}
          onRegionChange={region => this.onRegionChange(region)}
        >
          {this.state.markers.map(marker => (
            <MapView.Marker
              title={marker.title}
              key={marker.key}
              description={marker.description}
              coordinate={marker.coordinate}
            />
          ))}
        </MapView>
        <View style={[styles.bubble, styles.latlng]}>
          <Text style={{ textAlign: 'center' }}>
            {this.state.userPosition.coordinate.latitude.toPrecision(7)},
            {this.state.userPosition.coordinate.longitude.toPrecision(7)}
          </Text>
        </View>
        <View style={styles.buttonContainer}>
          <TouchableOpacity
            onPress={() => this.randomRestaurant()}
            style={[styles.bubble, styles.button]}
          >
            <Text>Restaurant Choice</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }
}
App.propTypes = {
  provider: MapView.ProviderPropType,
};
const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  map: {
    ...StyleSheet.absoluteFillObject,
  },
  bubble: {
    backgroundColor: 'rgba(255,255,255,0.7)',
    paddingHorizontal: 18,
    paddingVertical: 12,
    borderRadius: 20,
  },
  latlng: {
    width: 200,
    alignItems: 'stretch',
  },
  button: {
    width: 100,
    paddingHorizontal: 12,
    alignItems: 'center',
    marginHorizontal: 10,
  },
  buttonContainer: {
    flexDirection: 'row',
    marginVertical: 20,
    backgroundColor: 'transparent',
  },
});

export default App;