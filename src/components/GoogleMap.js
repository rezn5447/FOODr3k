'use strict';

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
import Footer from './Footer';

const { width, height } = Dimensions.get('window');

// Github HQ:
// lat: 37.782227,
// lng: -122.391050

const ASPECT_RATIO = width / height;
const LATITUDE = 37.782227;
const LONGITUDE = -122.391050;
const LATITUDE_DELTA = 0.08;
const LONGITUDE_DELTA = LATITUDE_DELTA * ASPECT_RATIO;

// const CLIENT_ID = '27037c67-f394-4cfd-ab51-069ac71132fb';
// const OPENTABLE_ENDPOINT = 'https://platform.otqa.com/sync/listings?latitude="37.782227"&longitude="-122.391050"';
// const API_DEBOUNCE_TIME = 2000;

class GoogleMap extends Component {
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
          key: 82479372,
          title: 'You are here.',
          description: 'Welcome to FOODr3k!',
          coordinate: {
          latitude: LATITUDE,
          longitude: LONGITUDE,
          }
        },
      restaurants: [],
      markers: [],
      selectedRestaurant: {},
      selectedImage: null
    };
  }
  componentWillMount() {
    axios.get('https://platform.otqa.com/sync/listings?limit=5&zip="94107"', {
      headers: { Authorization: 'bearer 27037c67-f394-4cfd-ab51-069ac71132fb' }
    })
    .then(response => {
      this.setState({ restaurants: response.data });
      // console.log(this.state.restaurants);
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
            latitude: parseFloat(restaurant.latitude),
            longitude: parseFloat(restaurant.longitude),
        } }]
    }); 
    this.fitAnimation()
  }

  fitAnimation() {
    const { markers } = this.state;
    this.map.fitToCoordinates([markers[0].coordinate, markers[1].coordinate], {
      edgePadding: { top: 100, right: 100, bottom: 100, left: 100 },
      animated: true,
    });
  }
  randomRestaurant() {
     const { items } = this.state.restaurants;
     const randRestaurant = _.sample(items);
     this.setState({ selectedRestaurant: randRestaurant });
     axios.get(`https://opentable.herokuapp.com/api/restaurants?name=${this.state.selectedRestaurant.name}&city=${this.state.selectedRestaurant.city}`)
    .then(response => {
      this.setState({ selectedImage: response.data.restaurants[0].image_url });
    });
    this.setRestaurantMarker(this.state.selectedRestaurant);
  }

  render() {
    return (

          <View style={styles.container}>
            <MapView
              showsUserLocation
              showsMyLocationButton
              key={1}
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
                  id={marker.key || 1}
                  key={marker.key || 1}
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
            <Footer 
            restaurant={this.state.selectedRestaurant} 
            selectedImage={this.state.selectedImage} 
            />
          </View>

    );
  }
}
GoogleMap.propTypes = {
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
export default GoogleMap;
