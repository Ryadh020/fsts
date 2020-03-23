import React from 'react';
import MapView, { Marker, Polygon, Polyline } from 'react-native-maps';
import { StyleSheet, View, Dimensions, Text, TouchableOpacity, Image} from 'react-native';
import { connect } from 'react-redux'

import DrawingTools from '../Components/DrawingTools' // components takes in charge displaying drawing tools.
import Data from "../Components/DataForm" // a table to put data about the marker/line/polygone.

let PolygoneId = 0; // for polygones counting

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

        // polygons data :
      polygons: [],   // to contain polygones and show them on mapping the array
      polygoneEditing: null,  // to contains polygons data
      creatingHole: false,  // detect if a hole is on creating
      

        // PolyLines data :
        //////////////
        ///////////////
        ////////////////////
        //////////////////////
        ////////////////////////
      scrollable : false,  // for map scrolling
      text: "ezezeezezez",      // just for debuging
    }
    this._Darw = this._Darw.bind(this)
  }

    // Helper location:
  latLng = {latitude: 36.365, longitude: 6.61472}

    // the list of markers
  markers = []

  
    // pop up marker data on cliking the marker:
  _shapeFocused(id) {
    // send the component key to the global state:
    let action = { type: "ShapeFocused", value: id}
    this.props.dispatch(action)
  }

    // select the clicked drawing tool
  _MarkerTool() {
    let action = { type: "Marker", value: "Marker" }
    this.props.dispatch(action)
  }
  _LineTool() {
    let action = { type: "Line", value: "Line" }
    this.props.dispatch(action)
  }
  _PolygoneTool() {
    let action = { type: "Polygone", value: "Polygone" }
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
        // set global state to true (marker is created):
      let action = { type: "MarkerCreated"}
      this.props.dispatch(action)


    } else if (this.props.tool == "Line") {
      this.Lines.push(<LineCreator cords={latLng} data={this.state.LineNumber} key={"MN-" + this.state.LineNumber}></LineCreator>) // push a new LIne to the list :
      this.setState({LineNumber : this.state.LineNumber + 1}) // update the counter of Lines : *"change to lines later"
    } 


    else if (this.props.tool == "Polygone") {
      const { polygoneEditing, creatingHole } = this.state;
      if (!polygoneEditing) {
        this.setState({
          polygoneEditing: {
            PolygoneId: PolygoneId++,
            coordinates: [e.nativeEvent.coordinate],
            holes: [],
          },
        });
      } else if (!creatingHole) {
        this.setState({
          polygoneEditing: {
            ...polygoneEditing,
            coordinates: [...polygoneEditing.coordinates, e.nativeEvent.coordinate],
          },
        });
      } else {
        const holes = [...polygoneEditing.holes];
        holes[holes.length - 1] = [
          ...holes[holes.length - 1],
          e.nativeEvent.coordinate,
        ];
        this.setState({
          polygoneEditing: {
            ...polygoneEditing,
            PolygoneId: PolygoneId++, // keep incrementing id to trigger display refresh
            coordinates: [...polygoneEditing.coordinates],
            holes,
          },
        });
      }
    }
  }
    // finish drawing:
  finish() {
    const { polygons, polygoneEditing } = this.state;
    this.setState({
      polygons: [...polygons, polygoneEditing],
      polygoneEditing: null,
      creatingHole: false,
    });
      // set global state to true (polygon is created):
    let action = { type: "PolygoneCreated"}
    this.props.dispatch(action)
  }


    // start creating a hole:
  createHole() {
    const { polygoneEditing, creatingHole } = this.state;
    if (!creatingHole) {
      this.setState({
        creatingHole: true,
        polygoneEditing: {
          ...polygoneEditing,
          holes: [...polygoneEditing.holes, []],
        },
      });
    } else {
      const holes = [...polygoneEditing.holes];
      if (holes[holes.length - 1].length === 0) {
        holes.pop();
        this.setState({
          polygoneEditing: {
            ...polygoneEditing,
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

    if (this.state.polygoneEditing) {
      mapOptions.scrollEnabled = false;
      mapOptions.onPanDrag = e => this.onPress(e);
    }

    return (
      <View>
        <MapView
          mapType = {this.props.mapType}
          initialRegion = {this.state.region}
          style={styles.mapStyle} 
          scrollEnabled={this.state.scrollable}
          onLongPress={this._Darw}
          onPress={() => this._HideDataTable()}
        >


        {this.markers.map(index =>(
          <Marker
            onPress={()=> {this._MarkerTool(), this._shapeFocused(index.key)} }  
            coordinate={index.latiLngi}
            key={"MN-" + index.key}
          >
          </Marker>
        ))}




<Polyline
		coordinates={[
			{ latitude: 36.365, longitude: 6.61472 },
      { latitude: 36.380, longitude: 6.61490 },
      { latitude: 36.390, longitude: 6.61950 },  
		]}
		strokeColor="red" // fallback for when `strokeColors` is not supported by the map-provider
		strokeWidth={6}
	/>






        {this.state.polygons.map(polygon => (
          <Polygon
            tappable={true}
            onPress={()=> {this._PolygoneTool(),this._shapeFocused(polygon.PolygoneId)}}

            key={polygon.PolygoneId}
            coordinates={polygon.coordinates}
            holes={polygon.holes}
            strokeColor="#F00"
            fillColor="rgba(255,0,0,0.5)"
            strokeWidth={1}
          />
        ))}

        {this.state.polygoneEditing && (
          <Polygon
            key={this.state.polygoneEditing.PolygoneId}
            coordinates={this.state.polygoneEditing.coordinates}
            holes={this.state.polygoneEditing.holes}
            strokeColor="#000"
            fillColor="rgba(255,0,0,0.5)"
            strokeWidth={1}
          />
        )}
        </MapView>

        <Text style={{position: "absolute", top: 0, left: 0}}>{this.state.text}</Text>  


        <View style={styles.buttonContainer}>
          {this.state.polygoneEditing && (
            <TouchableOpacity
              style={[styles.bubble, styles.button]}
            >
            <Image 
              style={{width: 30, height: 30}} 
              source={require("../Images/back.png")}
            />
          </TouchableOpacity>
          )}
          {this.state.polygoneEditing && (
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
          {this.state.polygoneEditing && (
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
