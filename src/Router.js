import React from 'react';
import { Image, View } from 'react-native';
import { Scene, Router } from 'react-native-router-flux';
import GoogleMap from './components/GoogleMap';
import Detail from './components/Detail';

const RouterComponent = () => {
	return (
		<Router sceneStyle={{ paddingTop: 65, flexGrow: 1 }} >
			<Scene key="map">
				<Scene 
				key="googlemap" 
				component={GoogleMap} 
				title="Foodr3k"
				/>
				<Scene 
				key="detail" 
				component={Detail} 
				title="Details"
				/>
			</Scene>
		</Router>
	);
};

export default RouterComponent;
