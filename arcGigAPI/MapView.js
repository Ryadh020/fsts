import React from 'react';
import  MapView  from 'react-native-maps';
import { Marker, Polygon  } from 'react-native-maps';
import { StyleSheet, View, Dimensions } from 'react-native';
import { connect } from 'react-redux'

import DrawingTools from '../Components/DrawingTools' // components takes in charge displaying drawing tools
import MarkerCreator from '../Components/DrawingTools/MarkerCreator' // components takes in charge drawing markers
import LineCreator from '../Components/DrawingTools/LineCreator' // components takes in charge drawing markers

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
      markerNumber: 0,
      LineNumber: 0,
      polygoneNumber:0,  // number of markers (counter) "use it to assign keys and helps with counting"
      DrawingTool : "Marker"
    }
    this._Darw = this._Darw.bind(this)
    this._addNewPoint = this._addNewPoint.bind(this)
  }

    // Helper location:
  latLng = {latitude: 36.365, longitude: 6.61472}

    // the list of markers
  markers = []
    // the list of Lines
  Lines = []
    // the list of Plygones
  Plygones = []
  
    // array to contain polygone cordinates:
  polygoneCordinates = []

  _Darw(e) {
    const latLng = e.nativeEvent.coordinate  // change the marker location to the touched one
    if (this.props.tool == "Marker") {
      this.markers.push(<MarkerCreator cords={latLng} key={"MN-" + this.state.markerNumber}></MarkerCreator>) // push a new marker to the list :
      this.setState({markerNumber : this.state.markerNumber + 1}) // update the counter of markers :
    } else if (this.props.tool == "Line") {
      this.Lines.push(<LineCreator cords={latLng} key={"MN-" + this.state.LineNumber}></LineCreator>) // push a new LIne to the list :
      this.setState({LineNumber : this.state.LineNumber + 1}) // update the counter of Lines : *"change to lines later"
    } 
    
    else if (this.props.tool == "Polygone") {
        // set the initial polygone cordinate
      this.polygoneCordinates = [latLng]

      this.Plygones.push(
        <Polygon 
          coordinates={this.polygoneCordinates}
          strokeWidth={2}
          strokeColor={"rgba(252, 240, 0 ,1)"}
          fillColor={"rgba(252, 97, 86 ,0.5)"}
          tappable={true}
          onPress={this._addNewPoint} // replace it to the mapView instead <-------:
          key={"MN-" + this.state.polygoneNumber}
        ></Polygon>
      )
              // update the counter of markers :
      this.setState({markerNumber : this.state.polygoneNumber + 1}) // <-----: change it place
    }
  }

  
        //add new point cordinates to the polygone:
    _addNewPoint(e) {  
        // push a new cordinate to the polygone :
      this.polygoneCordinates.push(e.nativeEvent.coordinate)
  
      this.setState({markerNumber : this.state.polygoneNumber + 1})
    }
  

  render() {
    return (
      <View>
        <MapView
          mapType = {this.props.mapType}
          initialRegion = {this.state.region}
          style={styles.mapStyle} 
          onLongPress={this._Darw}
          onPress={this._addNewPoint}
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
