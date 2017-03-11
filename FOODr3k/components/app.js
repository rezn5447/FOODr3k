import React, { Component } from 'react';

import { Screen, Spinner, Examples } from '@shoutem/ui';
import { stringify as queryString } from 'query-string';

const OPENTABLE_ENDPOINT = 'http://opentable.herokuapp.com/api/restaurants?zip=94107';

class App extends Component {
   state = {
        mapRegion: null,
        gpsAccuracy: null,
        recommendations: [],
        lookingFor: null,
        headerLocation: null,
        otApiCall: null
    }
    watchID = null

    componentWillMount() {
        this.watchID = navigator.geolocation.watchPosition((position) => {
            let region = {
                latitude: position.coords.latitude,
                longitude: position.coords.longitude,
                latitudeDelta: 0.00922*1.5,
                longitudeDelta: 0.00421*1.5
            }

            this.onRegionChange(region, position.coords.accuracy);
        });
    }

    componentWillUnmount() {
        navigator.geolocation.clearWatch(this.watchID);
    }

}