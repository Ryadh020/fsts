import React from 'react';
import  MapView  from 'react-native-maps';
import { Marker } from 'react-native-maps';
import { StyleSheet, Text, View, Dimensions, Button, TouchableOpacity} from 'react-native';

export default class App extends React.Component {

  constructor(props) {
    super(props)
    this.state = {
      region : {    //  initial cordinates for the map
        latitude: 36.365,
        longitude: 6.61472,
        latitudeDelta: 0.0922,
        longitudeDelta: 0.0421,
      },
      markerNumber: 0,  // number of markers (counter) "use it to assign keys and helps with counting"
      DrawingTool : "Marker"
    }
    this._makeMarker = this._makeMarker.bind(this)

    this._MarkerTool = this._MarkerTool.bind(this)
    this._LineTool = this._LineTool.bind(this)
    this._PolygoneTool = this._PolygoneTool.bind(this)
  }

  latLng = {  // Marker location:
    latitude: 36.365,
    longitude: 6.61472,
  }

    // the list of markers
  set = []
  
  _makeMarker(e) {
    this.latLng = e.nativeEvent.coordinate  // change the marker location to the touched one
    if (this.state.DrawingTool == "Marker") {
            // push a new marker to the list :
      this.set.push(<Marker
        coordinate={ { latitude: this.latLng.latitude, longitude: this.latLng.longitude, }}
        title={"Marker"}
        description={"oued rhumel"}
        key={"MN-" + this.state.markerNumber}
      ></Marker>)
        // update the counter of markers :
      this.setState({markerNumber : this.state.markerNumber + 1})
    } else if (this.state.DrawingTool == "Line") {
            // push a new marker to the list :
      this.set.push(<Marker
        coordinate={ { latitude: this.latLng.latitude, longitude: this.latLng.longitude, }}
        title={"Line"}
        description={"oued rhumel"}
        key={"MN-" + this.state.markerNumber}
      ></Marker>)
            // update the counter of markers :
      this.setState({markerNumber : this.state.markerNumber + 1})
    } else if (this.state.DrawingTool == "Polygone") {
                  // push a new marker to the list :
      this.set.push(<Marker
        coordinate={ { latitude: this.latLng.latitude, longitude: this.latLng.longitude, }}
        title={"Polygone"}
        description={"oued rhumel"}
        key={"MN-" + this.state.markerNumber}
      ></Marker>)
              // update the counter of markers :
      this.setState({markerNumber : this.state.markerNumber + 1})
    }
  }

  _MarkerTool() {
    this.setState({ DrawingTool : "Marker" });
  }
  _LineTool() {
    this.setState({ DrawingTool : "Line" });
  }
  _PolygoneTool() {
    this.setState({ DrawingTool : "Polygone" });
  }

  render() {
    return (
      <View>
        <MapView
          mapType = {this.props.mapType}
          initialRegion = {this.state.region}
          style={styles.mapStyle} 
          onLongPress={this._makeMarker}
        >
        {this.set}
        </MapView>
        <View style={styles.DrawingButtons}>
          <TouchableOpacity onPress={this._MarkerTool} style={styles.MapType}><Text>Mrk</Text></TouchableOpacity>
          <TouchableOpacity onPress={this._LineTool} style={styles.MapType}><Text>Lne</Text></TouchableOpacity>
          <TouchableOpacity onPress={this._PolygoneTool} style={styles.MapType}><Text>Plg</Text></TouchableOpacity>
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  mapStyle: {
    width: (Dimensions.get('window').width),
    height: (Dimensions.get('window').height) * 0.93,
  },
  MapType : { // ordinary button
      display : "flex",
      justifyContent : "center",
      alignItems : "center",
      width : 45,
      height : 45,
      padding : 5,
      backgroundColor : "red",
      borderRadius : 50
  },
  DrawingButtons : {  // for the right side buttons (marker/line/Polygone ....etc.)
      position : "absolute",
      top : 150,
      right : 15,
      display : "flex",
      flexDirection : "column",
      justifyContent : "space-around",
      alignItems : "center"
  }
});
