import React from 'react';
import  MapView  from 'react-native-maps';
import { Marker } from 'react-native-maps';
import { StyleSheet, View, Dimensions } from 'react-native';
import { connect } from 'react-redux'

import DrawingTools from '../Components/DrawingTools'

class App extends React.Component {

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
  }

  latLng = {  // Marker location:
    latitude: 36.365,
    longitude: 6.61472,
  }

    // the list of markers
  markers = []
    // the list of Lines
  Lines = []
    // the list of Plygones
  Plygones = []
  
  _makeMarker(e) {
    this.latLng = e.nativeEvent.coordinate  // change the marker location to the touched one
    if (this.props.tool == "Marker") {
            // push a new marker to the list :
      this.markers.push(<Marker
        coordinate={ { latitude: this.latLng.latitude, longitude: this.latLng.longitude, }}
        title={"Marker"}
        description={"oued rhumel"}
        key={"MN-" + this.state.markerNumber}
      ></Marker>)
        // update the counter of markers :
      this.setState({markerNumber : this.state.markerNumber + 1})
    } else if (this.props.tool == "Line") {
            // push a new marker to the list :
      this.Lines.push(<Marker
        coordinate={ { latitude: this.latLng.latitude, longitude: this.latLng.longitude, }}
        title={"Line"}
        description={"oued rhumel"}
        key={"MN-" + this.state.markerNumber}
      ></Marker>)
            // update the counter of markers :
      this.setState({markerNumber : this.state.markerNumber + 1})
    } else if (this.props.tool == "Polygone") {
                  // push a new marker to the list :
      this.Plygones.push(<Marker
        coordinate={ { latitude: this.latLng.latitude, longitude: this.latLng.longitude, }}
        title={"Polygone"}
        description={"oued rhumel"}
        key={"MN-" + this.state.markerNumber}
      ></Marker>)
              // update the counter of markers :
      this.setState({markerNumber : this.state.markerNumber + 1})
    }
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
        {this.markers}
        {this.Lines}
        {this.Plygones}
        </MapView>
        <DrawingTools/>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  mapStyle: {
    width: (Dimensions.get('window').width),
    height: (Dimensions.get('window').height) * 0.93,
  },
});

const mapStateToProps = (state) => {
  return {
    tool: state.toggleTool.tool
  }
}

export default connect(mapStateToProps)(App) // connect the drawingtools component to the global state
