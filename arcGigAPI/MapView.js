import React from 'react';
import MapView, { MAP_TYPES, Marker, Polygon  } from 'react-native-maps';
import { StyleSheet, View, Dimensions, Text, TouchableOpacity, } from 'react-native';
import { connect } from 'react-redux'

import DrawingTools from '../Components/DrawingTools' // components takes in charge displaying drawing tools.
import MarkerCreator from '../Components/DrawingTools/MarkerCreator' // components takes in charge drawing markers.
import LineCreator from '../Components/DrawingTools/LineCreator' // components takes in charge drawing markers.
import Data from "../Components/DataForm" // a table to put data about the marker/line/polygone.

let id = 0;

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
      LineNumber: 0,  // number of Lines (counter) "use it to assign keys and helps with counting"

      polygons: [],   // to contain polygones and show them on mapping the array
      editing: null,  // to contains polygons data
      creatingHole: false,  // detect if a hole is on creating

      DrawingTool : "Marker"
    }
    this._Darw = this._Darw.bind(this)
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

    // pop up marker data on cliking the marker:
  _showMarkerData() {
    // get the key of the component

    // send the component key to the global state:
    let action = { type: "MarkerChoosed", value: {componentKey}}
    this.props.dispatch(action)
  }

  _Darw(e) {
    const latLng = e.nativeEvent.coordinate  // change the marker location to the touched one
    if (this.props.tool == "Marker") {
      this.markers.push(<MarkerCreator onPress={() => this._showData()} cords={latLng} data={this.state.markerNumber} key={"MN-" + this.state.markerNumber}></MarkerCreator>) // push a new marker to the list :
      this.setState({markerNumber : this.state.markerNumber + 1}) // update the counter of markers :
        // set global state to true (marker is clicked):
      let action = { type: "MarkerClicked"}
      this.props.dispatch(action)

    } else if (this.props.tool == "Line") {
      this.Lines.push(<LineCreator cords={latLng} data={this.state.LineNumber} key={"MN-" + this.state.LineNumber}></LineCreator>) // push a new LIne to the list :
      this.setState({LineNumber : this.state.LineNumber + 1}) // update the counter of Lines : *"change to lines later"
    } 
    else if (this.props.tool == "Polygone") {
      const { editing, creatingHole } = this.state;
      if (!editing) {
        this.setState({
          editing: {
            id: id++,
            coordinates: [e.nativeEvent.coordinate],
            holes: [],
          },
        });
      } else if (!creatingHole) {
        this.setState({
          editing: {
            ...editing,
            coordinates: [...editing.coordinates, e.nativeEvent.coordinate],
          },
        });
      } else {
        const holes = [...editing.holes];
        holes[holes.length - 1] = [
          ...holes[holes.length - 1],
          e.nativeEvent.coordinate,
        ];
        this.setState({
          editing: {
            ...editing,
            id: id++, // keep incrementing id to trigger display refresh
            coordinates: [...editing.coordinates],
            holes,
          },
        });
      }
    }
  }
    // finish drawing:
  finish() {
    const { polygons, editing } = this.state;
    this.setState({
      polygons: [...polygons, editing],
      editing: null,
      creatingHole: false,
    });
  }
    // start creating a hole:
  createHole() {
    const { editing, creatingHole } = this.state;
    if (!creatingHole) {
      this.setState({
        creatingHole: true,
        editing: {
          ...editing,
          holes: [...editing.holes, []],
        },
      });
    } else {
      const holes = [...editing.holes];
      if (holes[holes.length - 1].length === 0) {
        holes.pop();
        this.setState({
          editing: {
            ...editing,
            holes,
          },
        });
      }
      this.setState({ creatingHole: false });
    }
  }

  render() {
    const mapOptions = {
      scrollEnabled: true,
    };

    if (this.state.editing) {
      mapOptions.scrollEnabled = false;
      mapOptions.onPanDrag = e => this.onPress(e);
    }

    return (
      <View>
        <MapView
          mapType = {this.props.mapType}
          initialRegion = {this.state.region}
          style={styles.mapStyle} 
          onLongPress={this._Darw}
        >
        {this.markers}
        {this.Lines}
        {this.state.polygons.map(polygon => (
          <Polygon
            key={polygon.id}
            coordinates={polygon.coordinates}
            holes={polygon.holes}
            strokeColor="#F00"
            fillColor="rgba(255,0,0,0.5)"
            strokeWidth={1}
          />
        ))}
        {this.state.editing && (
          <Polygon
            key={this.state.editing.id}
            coordinates={this.state.editing.coordinates}
            holes={this.state.editing.holes}
            strokeColor="#000"
            fillColor="rgba(255,0,0,0.5)"
            strokeWidth={1}
          />
        )}
        </MapView>
        <View style={styles.buttonContainer}>
          {this.state.editing && (
            <TouchableOpacity
              onPress={() => this.createHole()}
              style={[styles.bubble, styles.button]}
            >
              <Text>
                {this.state.creatingHole ? 'Finish Hole' : 'Create Hole'}
              </Text>
            </TouchableOpacity>
          )}
          {this.state.editing && (
            <TouchableOpacity
              onPress={() => this.finish()}
              style={[styles.bubble, styles.button]}
            >
              <Text>Finish</Text>
            </TouchableOpacity>
          )}
        </View>
        <DrawingTools/>
        <Data/>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  mapStyle: {
    width: (Dimensions.get('window').width),
    height: (Dimensions.get('window').height) * 0.93,
  },
  buttonContainer: {
    position: "absolute",
    flexDirection: 'row',
    marginVertical: 20,
    backgroundColor: 'transparent',
  },
  bubble: {
    backgroundColor: 'rgba(255,255,255,0.7)',
    paddingHorizontal: 18,
    paddingVertical: 12,
    borderRadius: 20,
  },
  button: {
    width: 80,
    paddingHorizontal: 12,
    alignItems: 'center',
    marginHorizontal: 10,
  },
});

const mapStateToProps = (state) => {
  return {
    tool: state.toggleTool.tool,
    clicked: state.showTable.clicked,
  }
}

export default connect(mapStateToProps)(App) // connect the drawingtools component to the global state
