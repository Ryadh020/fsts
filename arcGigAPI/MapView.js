import React from 'react';
import  MapView  from 'react-native-maps';
import { Marker } from 'react-native-maps';

import { StyleSheet, Text, View, Dimensions, Button, TouchableOpacity} from 'react-native';
//import { TouchableOpacity } from 'react-native-gesture-handler';
//import { Button } from 'react-native-paper';

export default class App extends React.Component {

  constructor(props) {
    super(props)
    this.state = {
      region : {
        latitude: 36.365,
        longitude: 6.61472,
        latitudeDelta: 0.0922,
        longitudeDelta: 0.0421,
      }
    }
  }


  render() {
    return (
      <MapView
          mapType = {this.props.mapType}
          initialRegion = {this.state.region}
          style={styles.mapStyle} 
          onLongPress={this._makeMarker}
        >
      </MapView>
    );
  }
}

const styles = StyleSheet.create({
  mapStyle: {
    width: (Dimensions.get('window').width),
    height: (Dimensions.get('window').height) * 0.89,
  }
});
