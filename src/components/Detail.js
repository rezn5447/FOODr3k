'use strict';

import React, { Component } from 'react';
import axios from 'axios';
import { text } from 'react-native-communications';

import {
  StyleSheet,
  View,
  Image,
  Linking
} from 'react-native';

import { Container, Content, Card, CardItem, Left, Body, Thumbnail, Text, Button, Icon } from 'native-base';
import Footer from './Footer';
// const CONSUMER_KEY = 'e2KmXgeif_G8HWWmz7bMHw';
// const CONSUMER_SECRET = 'jQMEqYH6YQx5IoTaIYG-UM-I0Ht3sS-u';
// const TOKEN =	'jQMEqYH6YQx5IoTaIYG-UM-I0Ht3sS-u';
// const TOKEN_SECRET = 'BHj48rKTM5MQEroH6rwjtQvuzys';

class Detail extends Component {
	componentWillMount() {
	}

  render() {
		const { 
			address,  
			city,  
			name, 
			phone_number, 
			reservation_url, 
			profile_url, 
			state, 
			country 
		} = this.props.selectedRestaurant;
		console.log(this.props.selectedImage);
    return (
			<Container>
				<Content>
					<Card>
						<CardItem bordered>
							<Left>
								<Thumbnail source={{ uri: `${this.props.selectedImage}`}}/>
								<Body>
									<Text>{name}</Text>
									<Text note>{address}</Text>
									<Text note>{`${city}, ${state} ${country}`}</Text>
								</Body>
							</Left>
						</CardItem>
						<CardItem>
							<Body style={{ flex: 1, flexDirection: 'column', justifyContent: 'space-around', height: 300 }}>
								<Button full onPress={() => Linking.openURL(reservation_url)}>
									<Text>Reserve a table</Text>
								</Button>
								<Button full onPress={() => Linking.openURL(reservation_url)}>
									<Text>Profile</Text>
								</Button>
								<Button full onPress={() => text(phone_number, "I'm hungry!")}>
									<Text>Call Business</Text>
								</Button>
							</Body>
						</CardItem>
					</Card>
				</Content>
				<Footer />
			</Container>
    );
  }
}

const styles = StyleSheet.create({

});


export default Detail;

/*

https://api.yelp.com/v2/search/?oauth_consumer_key=e2KmXgeif_G8HWWmz7bMHw&oauth_token=jQMEqYH6YQx5IoTaIYG-UM-I0Ht3sS-u&oauth_signature_method=HMAC-SHA1&oauth_timestamp=1489301058&oauth_nonce=ykTc35&oauth_version=1.0&oauth_signature=toTKV0qiYb0nwMVkMyCZvWr9ueU=&term=One Market Restaurant&location=San Francisco, CA&limit=1
-----

this.props.selectedRestaurant

address
:
"1 Market Street"


address2
:
""


city
:
"San Francisco"


country
:
"US"


is_restaurant_in_group
:
false


latitude
:
"37.7938190"


longitude
:
"-122.3950890"


metro_name
:
"San Francisco Bay Area"


name
:
"One Market Restaurant"


phone_number
:
"4157775577x"


postal_code
:
"94105"


profile_url
:
"http://www.opentable.com/restaurant/profile/4"


reservation_url
:
"http://www.opentable.com/restaurant/profile/4"


rid
:
4


state
:
"CA"


*/
