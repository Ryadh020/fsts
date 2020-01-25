import React from 'react';
import  MapView  from 'react-native-maps';
import { Marker } from 'react-native-maps';
import { StyleSheet, Text, View, Dimensions, Button, TouchableOpacity} from 'react-native';

export default class App extends React.Component {

  constructor(props) {
    super(props)
    this.state = {
      region : {
        latitude: 36.365,
        longitude: 6.61472,
        latitudeDelta: 0.0922,
        longitudeDelta: 0.0421,
      },
      latLng : {
        latitude: 0,
        longitude: 0,
      },
    }
    this._makeMarker = this._makeMarker.bind(this)
  }

  _makeMarker(e) {
    this.setState({latLng : e.nativeEvent.coordinate})
  }


  render() {
    return (
      <MapView
          mapType = {this.props.mapType}
          initialRegion = {this.state.region}
          style={styles.mapStyle} 
          onLongPress={this._makeMarker}
        >
        <Marker
          draggable
          coordinate={this.state.latLng}
          title={"valle"}
          description={"oued rhumel"}
          onDragEnd={(e) => this.setState({ x: e.nativeEvent.coordinate })}
        ></Marker>
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
