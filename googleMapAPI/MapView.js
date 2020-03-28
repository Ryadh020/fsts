import React from 'react';
import MapView, { Marker, Polygon, Polyline, ProviderPropType } from 'react-native-maps';
import { StyleSheet, View, Dimensions, Text, TouchableOpacity, Image} from 'react-native';
import { connect } from 'react-redux'
import RNPickerSelect from 'react-native-picker-select';

import DrawingTools from '../Components/DrawingTools' // components takes in charge displaying drawing tools.
import Data from "../Components/DataForm" // a table to put data about the marker/line/polygone.

let PolygoneId = 0; // for polygones counting
let lineId = 0;  // for Polylines counting

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
      markerIconURL : require("../Images/Markers/home.png"),  // (default marker icon) & to detect the changing of select form
      markerIcon : "home",
      markerColor : require("../Images/Markers/black.png"),

        // polygons data :
      polygons: [],   // to contain polygones and show them on mapping the array
      polygoneEditing: null,  // to contains polygons data
      creatingHole: false,  // detect if a hole is on creating
      

        // PolyLines data :
      polylines: [],
      LineEditing: null,
      drawLine : false,

      scrollable : true,  // for map scrolling
      text: "debuging",      // just for debuging
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
                          key : this.state.markerNumber,
                          icon : this.state.markerIconURL,
                        }
                       )
         // update the counter of markers :
      this.setState({markerNumber : this.state.markerNumber + 1})
        // set global state to true (marker is created):
      let action = { type: "MarkerCreated"}
      this.props.dispatch(action)
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
  finishPolygone() {
    if (this.state.polygoneEditing) {
      const { polygons, polygoneEditing } = this.state;
      this.setState({
        polygons: [...polygons, polygoneEditing],
        polygoneEditing: null,
        creatingHole: false
      });
        // set global state to true (polygon is created):
      let action = { type: "PolygoneCreated"}
      this.props.dispatch(action)
  
        // set global state to true (polygon is created):
      let action2 = { type: "disabled", value : "Polygone"}
      this.props.dispatch(action2)
    } else {
      return
    }
  }

    // start creating a hole:
  createHole() {
    if (this.state.polygoneEditing) {
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
    } else {
      return
    }


  }
  // start line 
  startLine(){
    this.setState({scrollable : false, drawLine: true}) // stop scrolling the map
  }

  // when fiishing creating polyline :
  finishLine() {
    if (this.state.LineEditing) {
      const { polylines, LineEditing } = this.state;
      this.setState({
        polylines: [...polylines, LineEditing],
        LineEditing: null,
        drawLine: false,
  
        scrollable : true // enavle map scrolling
      });
        // set global state to true (polyline is created):
      let action = { type: "PolygoneCreated"}
      this.props.dispatch(action)
  
        // set global state to true (polyline is created):
      let action2 = { type: "disabled", value : "Line"}
      this.props.dispatch(action2)
    } else {
      return // show an eroor message later
    }



  }

  // add data to polyline array when pan dragging (to draw it in the render):
  onPanDrag(e) {
    const { LineEditing } = this.state;
    if(this.state.drawLine) {
      if (!LineEditing) {
        this.setState({
          LineEditing: {
            lineId: lineId++,
            coordinates: [e.nativeEvent.coordinate],
          },
        });
      } else {
        this.setState({
          LineEditing: {
            ...LineEditing,
            coordinates: [...LineEditing.coordinates, e.nativeEvent.coordinate],
          },
        });
      }
    }else {
      return;
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
          onPanDrag={e => this.onPanDrag(e)}
        >


        {this.markers.map(index =>(
          <Marker
            onPress={()=> {this._MarkerTool(), this._shapeFocused(index.key)} }  
            coordinate={index.latiLngi}
            key={"MN-" + index.key}
            icon={index.icon}
            draggable
          >
          </Marker>
        ))}


        {this.state.polylines.map(polyline => (
          <Polyline
            tappable={true}
            onPress={()=> {this._LineTool(), this._shapeFocused(polyline.lineId), this.setState({text : "done"})}}

            key={polyline.lineId}
            coordinates={polyline.coordinates}
            strokeColor="#000"
            fillColor="rgba(255,0,0,0.5)"
            strokeWidth={5}
          />
        ))}

        {this.state.LineEditing && (
          <Polyline
            key="editingPolyline"
            coordinates={this.state.LineEditing.coordinates}
            strokeColor="#F00"
            fillColor="rgba(255,0,0,0.5)"
            strokeWidth={1}
          />
        )}



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

        {this.props.drawingPan == "MarkerPan" && (
          <View style={styles.panelContainer}>

            <Image 
                source={this.state.markerIconURL} 
                style={{width: 25, height: 25}}
              />
            <View style={styles.btn} > 
              <RNPickerSelect
                placeholder={{}}
                onValueChange={(value) => {
                  if(value == "trash") {
                    this.setState({markerIcon : "trash", markerIconURL : require("../Images/Markers/trash.png")})
                  } else if(value == "light") {
                    this.setState({markerIcon : "light", markerIconURL : require("../Images/Markers/light.png")})
                  } else if(value == "chair") {
                    this.setState({markerIcon : "chair", markerIconURL : require("../Images/Markers/chair.png")})
                  }
                }}
                items={[
                  { label: 'trash', value: 'trash' },
                  { label: 'light', value: 'light'},
                  { label: 'chair', value: 'chair'},
                ]}
              />
            </View>





            <Image 
              source={this.state.markerColor} 
              style={{width: 25, height: 25}}
            />
            <View style={styles.btn} > 
              <RNPickerSelect
                onValueChange={(value) => {
                  if (value == "red") {
                    this.setState({markerColor : require("../Images/Markers/red.png")})
                    if (this.state.markerIcon == "trash") {
                      this.setState({markerIconURL : require("../Images/Markers/trash_red.png")})
                    } else if (this.state.markerIcon == "light") {
                      this.setState({markerIconURL : require("../Images/Markers/light_red.png")})
                    } else if (this.state.markerIcon == "chair") {
                      this.setState({markerIconURL : require("../Images/Markers/chair_red.png")})
                    }else if (this.state.markerIcon == "home") {
                      this.setState({markerIconURL : require("../Images/Markers/home_red.png")})
                    }
                  } else if (value == "green") {
                    this.setState({markerColor : require("../Images/Markers/green.png")})
                    if (this.state.markerIcon == "trash") {
                      this.setState({markerIconURL : require("../Images/Markers/trash_green.png")})
                    } else if (this.state.markerIcon == "light") {
                      this.setState({markerIconURL : require("../Images/Markers/light_green.png")})
                    } else if (this.state.markerIcon == "chair") {
                      this.setState({markerIconURL : require("../Images/Markers/chair_green.png")})
                    }else if (this.state.markerIcon == "home") {
                      this.setState({markerIconURL : require("../Images/Markers/home_green.png")})
                    }
                  } else if (value == "yellow") {
                    this.setState({markerColor : require("../Images/Markers/yellow.png")})
                    if (this.state.markerIcon == "trash") {
                      this.setState({markerIconURL : require("../Images/Markers/trash_yellow.png")})
                    } else if (this.state.markerIcon == "light") {
                      this.setState({markerIconURL : require("../Images/Markers/light_yellow.png")})
                    } else if (this.state.markerIcon == "chair") {
                      this.setState({markerIconURL : require("../Images/Markers/chair_yellow.png")})
                    }else if (this.state.markerIcon == "home") {
                      this.setState({markerIconURL : require("../Images/Markers/home_yellow.png")})
                    }
                  } else {
                    this.setState({markerColor : require("../Images/Markers/red.png")})
                    if (this.state.markerIcon == "trash") {
                      this.setState({markerIconURL : require("../Images/Markers/trash.png")})
                    } else if (this.state.markerIcon == "light") {
                      this.setState({markerIconURL : require("../Images/Markers/light.png")})
                    } else if (this.state.markerIcon == "chair") {
                      this.setState({markerIconURL : require("../Images/Markers/chair.png")})
                    }
                  }
                }}
                items={[
                  { label: 'red', value: 'red', color: 'red'  },
                  { label: 'green', value: 'green', color: 'green'  },
                  { label: 'yellow', value: 'yellow', color: 'yellow'  },
                ]}
              />
            </View>

          </View>
        )}

        {this.props.drawingPan == "PolygonPan" && (
          <View style={styles.buttonContainer}>
            <TouchableOpacity
              style={[styles.bubble, styles.button]}
            >
              <Image 
              style={{width: 20, height: 20}} 
              source={this.state.polygoneEditing? require("../Images/back.png"): require("../Images/back_blured.png")}
              />
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => this.createHole()}
              style={[styles.bubble, styles.button]}
            >     
              <Image 
                source={this.state.creatingHole ? require("../Images/finish_hole.png") : require("../Images/hole.png")} 
                style={{width: 30, height: 30}}
              />
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => this.finishPolygone()}
              style={[styles.bubble, styles.button]}
            >
              <Image 
                source={this.state.polygoneEditing? require("../Images/done.png"): require("../Images/done_blured.png")}
                style={{width: 25, height: 25}}
              />
            </TouchableOpacity>
          </View>
        )}
     
        {this.props.drawingPan == "LinePan"  && (
          <View style={styles.buttonContainer}>
            <TouchableOpacity
              style={[styles.bubble, styles.button]}
            >
              <Image 
              style={{width: 20, height: 20}} 
              source={this.state.LineEditing? require("../Images/back.png"): require("../Images/back_blured.png")}
              />
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => this.startLine()}
              style={[styles.bubble, styles.button]}
            >     
              <Image 
                source={this.state.LineEditing? require("../Images/start_blured.png"): require("../Images/start.png")} 
                style={{width: 30, height: 30}}
              />
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => this.finishLine()}
              style={[styles.bubble, styles.button]}
            >
              <Image 
                source={this.state.LineEditing? require("../Images/done.png"): require("../Images/done_blured.png")} 
                style={{width: 25, height: 25}}
              />
            </TouchableOpacity>
          </View>
        )}



        <Data/>
        <DrawingTools/>
      </View>
    );
  }
}

App.propTypes = {
  provider: ProviderPropType,
};


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
    alignItems: "center",
    marginVertical: 20,
    backgroundColor: 'rgba(255,255,255,0.7)',
    borderRadius: 20
  },
  bubble: {
    paddingHorizontal: 18,
    paddingVertical: 12,
  },
  button: {
    width: 80,
    paddingHorizontal: 12,
    alignItems: 'center',
    marginHorizontal: 10,
  },
  // panel:
  panelContainer: {
    position: "absolute",
    bottom: "15%",
    left: "26%",
    paddingLeft: 25,

    flexDirection: 'row',
    alignItems: "center",

    backgroundColor: 'rgba(255,255,255,0.7)',
    borderRadius: 20
  },
  btn: {
    width: 60,
    paddingHorizontal: 16,
    alignItems: 'center',
    marginHorizontal: 0,
  },
});

const mapStateToProps = (state) => {
  return {
    tool: state.toggleTool.tool,
    drawingPan: state.toggleTool.drawingPan,
    clicked: state.showTable.clicked,
  }
}

export default connect(mapStateToProps)(App) // connect the drawingtools component to the global state
