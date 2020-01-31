import React from 'react';
import  MapView  from 'react-native-maps';
import { Marker } from 'react-native-maps';
import { StyleSheet, Text, View, Dimensions, Button, TouchableOpacity} from 'react-native';

export default class App extends React.Component {

  constructor(props) {
    super(props)
    this.state = {
      region : {    // for initial region of the map
        latitude: 36.365,
        longitude: 6.61472,
        latitudeDelta: 0.0922,
        longitudeDelta: 0.0421,
      },
      markerNumber: 0  // number of markers (counter)
    }
    this._makeMarker = this._makeMarker.bind(this)
  }

  latLng = {  // Marker location:
    latitude: 36.365,
    longitude: 6.61472,
  }

    // the list of markers
  set = []
  
  _makeMarker(e) {
    this.latLng = e.nativeEvent.coordinate  // change the marker location to the touched one
      // push a new marker to the list :
    this.set.push(<Marker
      coordinate={ { latitude: this.latLng.latitude, longitude: this.latLng.longitude, }}
      title={"valle"}
      description={"oued rhumel"}
      key={"MN-" + this.state.markerNumber}
    ></Marker>)
      // update the counter of markers :
    this.setState({markerNumber : this.state.markerNumber + 1})
  }

  render() {
    return (
      <MapView
          mapType = {this.props.mapType}
          initialRegion = {this.state.region}
          style={styles.mapStyle} 
          onLongPress={this._makeMarker}
        >
      {this.set}
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
