import React from 'react';
import MapView, { Marker, Polygon  } from 'react-native-maps';
import { StyleSheet, View, Dimensions, Text, TouchableOpacity, Image} from 'react-native';
import { connect } from 'react-redux'

import DrawingTools from '../Components/DrawingTools' // components takes in charge displaying drawing tools.
import Data from "../Components/DataForm" // a table to put data about the marker/line/polygone.

let id = 0; // for polgones counting

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

      //DrawingTool : "Marker"
    }
    this._Darw = this._Darw.bind(this)
  }

    // Helper location:
  latLng = {latitude: 36.365, longitude: 6.61472}

    // the list of markers
  markers = []
    // the list of Lines
  Lines = []
  
    // array to contain polygone cordinates:
  polygoneCordinates = []

  
    // pop up marker data on cliking the marker:
  _shapeFocused(id) {
    // send the component key to the global state:
    let action = { type: "ShapeFocused", value: id}
    this.props.dispatch(action)
  }

  _HideDataTable() {
    let action = { type: "shapeBlured"}
    this.props.dispatch(action)
  }

  _Darw(e) {
    const latLng = e.nativeEvent.coordinate  // change the marker location to the touched one
    if (this.props.tool == "Marker") {
        // push a new marker data to the list :
      this.markers.push(
                         {latiLngi : latLng,
                          key : this.state.markerNumber
                        }
                       )
         // update the counter of markers :
      this.setState({markerNumber : this.state.markerNumber + 1})
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
          onPress={() => this._HideDataTable()}
        >


        {this.markers.map(index =>(
          <Marker
            onPress={()=> this._shapeFocused(index.key) } 
            coordinate={index.latiLngi}
            key={"MN-" + index.key}
          >
          </Marker>
        ))}


        


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
              style={[styles.bubble, styles.button]}
            >
            <Image 
              style={{width: 30, height: 30}} 
              source={require("../Images/back.png")}
            />
          </TouchableOpacity>
          )}
          {this.state.editing && (
            <TouchableOpacity
              onPress={() => this.createHole()}
              style={[styles.bubble, styles.button]}
            >     
              <Image 
                source={this.state.creatingHole ? require("../Images/finish_hole.png") : require("../Images/hole.png")} 
                style={{width: 35, height: 35}}
              />
            </TouchableOpacity>
          )}
          {this.state.editing && (
            <TouchableOpacity
              onPress={() => this.finish()}
              style={[styles.bubble, styles.button]}
            >
              <Image 
                source={require("../Images/done.png")} 
                style={{width: 30, height: 30}}
              />
            </TouchableOpacity>
          )}
        </View>
        <Data/>
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
  buttonContainer: {
    position: "absolute",
    bottom: 35,
    left: 55,
    flexDirection: 'row',
    marginVertical: 20,
    backgroundColor: 'rgba(255,255,255,0.7)',
    borderRadius: 20
  },
  bubble: {
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
