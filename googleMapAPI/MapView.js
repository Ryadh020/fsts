import React from 'react';
import MapView, { Marker, Polygon, Polyline, ProviderPropType } from 'react-native-maps';
import { MAP_TYPES } from 'react-native-maps';
import { StyleSheet, View, Dimensions, Text, TouchableOpacity, Image, TextInput} from 'react-native';
import { connect } from 'react-redux'
import RNPickerSelect from 'react-native-picker-select';
import { AsyncStorage } from 'react-native';

import DrawingTools from '../Components/DrawingTools' // components takes in charge displaying drawing tools.
import Data from "../Components/DataForm" // a table to put data about the marker/line/polygone.

let PolygoneId = 0; // for polygones counting
let lineId = 0;  // for Polylines counting
let shapes  // a temporal database of drawed shapes

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
      mapType : MAP_TYPES.STANDARD,



      workName: "empty",        // the actual workspace name:

      alertMessage : "HELLO WORLD",      // alert message

      saved : false,      // to detect if the previous project is saved

      deleteAlert: false,



      markerNumber: 0,  // number of markers (counter) "use it to assign keys and helps with counting"

      // Marker drawing panel carachteristics :
      markerIconURL : require("../Images/Markers/home.png"),  // (default marker icon) & to detect the changing of select form
      markerIcon : "home",
        // for panel
      markerColor : require("../Images/Markers/black.png"),

      // Polygone drawing panel carachteristics :
        // for panel
      polygoneFillURL: require("../Images/Polygone/black.png"),
      polygoneBorderURL: require("../Images/Polygone/black_hole.png"),
        // for drawing
      polygoneStrokeColor : "gray",
      polygoneFillColor: "gray",

      // Polyline drawing panel carachteristics :
      polylineStrokeColor: "black",
      polylineStrokeWidth: 4,

      polylineFillURL: require("../Images/Polygone/black_hole.png"),
      polylineWidhtURL: require("../Images/Polygone/1.png"),


        // polygons data :
      polygons: [],   // to contain polygones and show them on mapping the array
      polygoneEditing: null,  // to contains polygons data
      creatingHole: false,  // detect if a hole is on creating
      

        // PolyLines data :
      polylines: [],
      LineEditing: null,
      drawLine : false,

      scrollable : true,  // for map scrolling
      text: " ",      // just for debuging
    }
    this._Darw = this._Darw.bind(this)
    this._changeMapType = this._changeMapType.bind(this)
  }

    // the map type change function
  _changeMapType() {
    this.state.mapType == MAP_TYPES.STANDARD? this.setState({ mapType : MAP_TYPES.SATELLITE }):this.setState({ mapType : MAP_TYPES.STANDARD })
  }

    // Helper location:
  latLng = {latitude: 36.365, longitude: 6.61472}

    // the list of markers
  markers = []

  _deleteAllShapes() {
      this.markers = []
      this.setState({polylines : [], polygons: [], saved: false, workName: "empty"})
  }


  // create a new map of work space : 
  _newWorkSpace() {
    if(this.state.workName == "empty") { // detect if there is no current work space (there is not):
        // pop up name work text Input
      let action = { type: "NewWork"}
      this.props.dispatch(action)

    } else if(this.state.workName !== "empty") {
      if(this.state.saved) {  // detect if the work is saved : (it is)

          // delete all the previous work:
        this._deleteAllShapes()
          // pop up name work text Input
        let action = { type: "NewWork"}
        this.props.dispatch(action)

      } else {

        this.setState({alertMessage : "save your current work or delete it"})
          // pop up an alert message
        let action = { type: "ShowAlert"}
        this.props.dispatch(action)
        setTimeout(() => {
          let action = { type: "HideAlert"}
          this.props.dispatch(action)
        }, 1500);
      }
    }
  }

    // add a name to the current work space:
  _fillWorkSpaceName() {
    // create a temporal database of shapes with name
    shapes = {
      name: this.state.workName,
      markers: [],
      polylines: [],
      polygones: []
    }
      // hide text input:
    let action = { type: "NewWorkDone"}
    this.props.dispatch(action)
      // the new work is not saved:
    this.setState({saved: false})
  }

  _fillDrawedShapes() {
    // detect if there is a name:
    if(this.state.workName !== "empty") {
        // fill a temporal database to send it to the storage
        shapes.markers = this.markers
        shapes.polylines = this.state.polylines
        shapes.polygones = this.state.polygons   
    } else {
      console.log("there is no curent project, set a name");
        // pop up an alert message
      this.setState({alertMessage : "there is no curent project, set a name"})
      let action = { type: "ShowAlert"}
      this.props.dispatch(action)
      setTimeout(() => {
        let action2 = { type: "HideAlert"}
        this.props.dispatch(action2)
      }, 1500);
        // pop up name work text Input
      let action3 = { type: "NewWork"}
      this.props.dispatch(action3)
    }
  }


  // store data function:
  _storeData = async () => {
  if(this.state.workName !== "empty") {

    try {
      // send data
    await AsyncStorage.setItem(`${this.state.workName}`, JSON.stringify(shapes));
    console.log("data saved")

    this.setState({saved: true,})  // tell that the project is saved

    } catch (error) {
      console.log("error");
    }

  } else {
    return;
  }
  };
  
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
    if(this.state.workName !== "empty") {
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
              polygoneStrokeColor: this.state.polygoneStrokeColor,
              polygoneFillColor: this.state.polygoneFillColor
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
    }else {
      this.setState({alertMessage : "create a new project"})
      let action = { type: "ShowAlert"}
      this.props.dispatch(action)
      setTimeout(() => {
        let action2 = { type: "HideAlert"}
        this.props.dispatch(action2)
      }, 1500);
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
    if(this.state.workName !== "empty") {
      const { LineEditing } = this.state;
      if(this.state.drawLine) {
        if (!LineEditing) {
          this.setState({
            LineEditing: {
              lineId: lineId++,
              coordinates: [e.nativeEvent.coordinate],
              polylineStrokeColor: this.state.polylineStrokeColor,
              polylineStrokeWidth: this.state.polylineStrokeWidth 
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
    }else {
      this.setState({alertMessage : "create a new project"})
      let action = { type: "ShowAlert"}
      this.props.dispatch(action)
      setTimeout(() => {
        let action2 = { type: "HideAlert"}
        this.props.dispatch(action2)
      }, 1500);
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
          mapType = {this.state.mapType}
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

            strokeColor={polyline.polylineStrokeColor}
            strokeWidth={polyline.polylineStrokeWidth}
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

            strokeColor= {polygon.polygoneStrokeColor}
            fillColor={polygon.polygoneFillColor}
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
                //placeholder={{}}
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
                //placeholder={{}}
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
        <View  style={{position: "absolute", left:0, bottom: 0}}>
          <View style={styles.polyPanelContainer}>
            <Image 
                source={this.state.polygoneFillURL} 
                style={{width: 25, height: 25}}
            />
            <View style={styles.polyBtn} > 
              <RNPickerSelect
                //placeholder={{}}
                onValueChange={(value) => {
                  if(value == 'red') {
                    this.setState({polygoneFillColor : "red", polygoneFillURL: require("../Images/Polygone/red.png")})
                  } else if(value == 'green') {
                    this.setState({polygoneFillColor : "green", polygoneFillURL: require("../Images/Polygone/green.png")})
                  } else if(value == 'yellow') {
                    this.setState({polygoneFillColor : "yellow", polygoneFillURL: require("../Images/Polygone/yellow.png")})
                  }
                }}

                items={[
                  { label: 'red', value: 'red', color: 'red'},
                  { label: 'green', value: 'green', color: 'green'},
                  { label: 'yellow', value: 'yellow', color: 'yellow'},
                ]}
              />
            </View>
            <Image 
              source={this.state.polygoneBorderURL} 
              style={{width: 25, height: 25}}
            />
            <View style={styles.polyBtn} > 
              <RNPickerSelect
                onValueChange={(value) => {
                  if (value == 'red') {
                    this.setState({polygoneStrokeColor : "red", polygoneBorderURL: require("../Images/Polygone/red_hole.png")})
                  } else if (value == 'green') {
                    this.setState({polygoneStrokeColor : "green", polygoneBorderURL: require("../Images/Polygone/green_hole.png")})
                  }else if (value == 'yellow') {
                    this.setState({polygoneStrokeColor : "yellow", polygoneBorderURL: require("../Images/Polygone/yellow_hole.png")})
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

          <View style={styles.polyButtonContainer}>
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
        </View>
        )}
     
        {this.props.drawingPan == "LinePan"  && (
          <View  style={{position: "absolute", left:0, bottom: 0}}>
          <View style={styles.polyPanelContainer}>
            <Image 
                source={this.state.polylineFillURL} 
                style={{width: 25, height: 25}}
            />
            <View style={styles.polyBtn} > 
              <RNPickerSelect
                //placeholder={{}}
                onValueChange={(value) =>{
                  if(value == "red") {
                    this.setState({polylineStrokeColor: "red", polylineFillURL: require("../Images/Polygone/red_hole.png")})
                  } else if(value == "green") {
                    this.setState({polylineStrokeColor: "green", polylineFillURL: require("../Images/Polygone/green_hole.png")})
                  } else if(value == "yellow") {
                    this.setState({polylineStrokeColor: "yellow", polylineFillURL: require("../Images/Polygone/yellow_hole.png")})
                  }
                }}

                items={[
                  { label: 'red', value: 'red', color: 'red'  },
                  { label: 'green', value: 'green', color: 'green'  },
                  { label: 'yellow', value: 'yellow', color: 'yellow'  },
                ]}
              />
            </View>


            <Image 
              source={this.state.polylineWidhtURL} 
              style={{width: 25, height: 25}}
            />
            <View style={styles.polyBtn} > 
              <RNPickerSelect
                onValueChange={(value) => {
                  if(value == "1") {
                    this.setState({polylineStrokeWidth : 4, polylineWidhtURL: require("../Images/Polygone/1.png")})
                  } else if(value == "2") {
                    this.setState({polylineStrokeWidth : 6, polylineWidhtURL: require("../Images/Polygone/2.png")})
                  } else if(value == "3") {
                    this.setState({polylineStrokeWidth : 8, polylineWidhtURL: require("../Images/Polygone/3.png")})
                  }
                }}
                items={[
                  { label: '1', value: '1'},
                  { label: '2', value: '2'},
                  { label: '3', value: '3'},
                ]}
              />
            </View>

          </View>

          <View style={styles.polyButtonContainer}>
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
            
          </View>
          
        )}



        <Data/>
        <DrawingTools/>


        <View style={[styles.manageButtonsContainer, styles.container]}>
          <View style={styles.manageButtons}>
            <TouchableOpacity
              onPress={() => { this._newWorkSpace()} }
            >
              <Image 
                source={require("../Images/Manage/new.png")} 
                style={{width: 25, height: 25}}
              />
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => this.setState({deleteAlert: true})}
            >
              <Image 
                source={require("../Images/Manage/delete.png")} 
                style={{width: 25, height: 25}}
              />
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => {
                this._fillDrawedShapes()
                this._storeData()
              }}
            >
              <Image 
                source={require("../Images/Manage/save.png")} 
                style={{width: 22, height: 22}}
              />
            </TouchableOpacity>
          </View>
        </View>

        {this.props.newWork && (
          <View style={[styles.NameInputContainer, styles.container]}>
            <View style={styles.NameInput}>
            <TouchableOpacity
                onPress={() => {     
                  let action = { type: "NewWorkDone"}
                  this.props.dispatch(action)
                }}
              style={{width: 25, height: 25, margin: 10}}
              >
                <Image 
                  source={require("../Images/x.png")} 
                  style={{width: 25, height: 25}}
                />
              </TouchableOpacity>

              <TextInput
                style={styles.inputDetails}
                placeholder={"Title Name"}
                onChangeText={e => this.setState({workName : e})}
              ></TextInput>

              <TouchableOpacity
                onPress={() => this._fillWorkSpaceName()}
              style={{width: 25, height: 25, margin: 10}}
              >
                <Image 
                  source={require("../Images/done.png")} 
                  style={{width: 25, height: 25}}
                />
              </TouchableOpacity>
              
            </View>
          </View>
        )}


        {this.state.deleteAlert && (
          <View style={[styles.NameInputContainer, styles.container]}>
            <View style={styles.column}>
              <Text style={styles.deletealert}>Delete current work</Text>
              <View style={styles.row}>
                <TouchableOpacity onPress={()=> {this._deleteAllShapes(), this.setState({deleteAlert: false})} } style={styles.Button}>
                  <Text style={{textAlign: "center"}}>yes</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={()=> this.setState({deleteAlert: false})} style={styles.Button}>
                  <Text style={{textAlign: "center"}}>no</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        )}



        <View style={[styles.curentWorkContainer]}>
          <View style={styles.curentWork}>
            <Text>{this.state.workName}</Text>
          </View>
        </View>

        {this.props.alert && (
          <View style={[styles.AlertMessageContainer, styles.container]}>
            <View style={styles.AlertMessage}>
              <Text>{this.state.alertMessage}</Text>
            </View>
          </View>
        )}

        <TouchableOpacity onPress={this._changeMapType} style={styles.MapType}>
            <Image 
              style={{width: 45, height: 45}} 
              source={this.state.mapType == MAP_TYPES.STANDARD? require("../Images/earth.png"): require("../Images/map.png") } 
            />
        </TouchableOpacity>
      </View>
    );
  }
}

App.propTypes = {
  provider: ProviderPropType,
};


const styles = StyleSheet.create({
  column: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
  },
  row: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
  },
  Button: {
    width: 35,
    height: 35,
    margin: 5,

    backgroundColor: 'rgba(255,255,255,0.7)',
    borderBottomLeftRadius: 25,
    borderBottomRightRadius: 25,
  },
  /* change map type button */
  MapType : { // ordinary button
    position : "absolute",
    top : "27%",
    left : 15,

    display : "flex",
    justifyContent : "center",
    alignItems : "center",
    width : 45,
    height : 45,
    padding : 5,
    backgroundColor : "hsla(44, 0%, 85%, 0.5)",
    borderRadius : 50
  },
  mapStyle: {
    width: (Dimensions.get('window').width),
    height: (Dimensions.get('window').height) * 0.93,
  },
  buttonContainer: {
    position: "absolute",
    bottom: "5%",
    left: "15%",
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
    bottom: "12%",
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
  // Polypanel:
  polyPanelContainer: {
    width: 190,
    position: "relative",
    bottom: "27%",
    left: "100%",
    paddingLeft: 25,
  
    flexDirection: 'row',
    alignItems: "center",
  
    backgroundColor: 'rgba(255,255,255,0.7)',
    borderRadius: 20
  },
  polyButtonContainer: {
    position: "relative",
    bottom: "25%",
    left: "45%",
  
    flexDirection: 'row',
    alignItems: "center",
  
    backgroundColor: 'rgba(255,255,255,0.7)',
    borderRadius: 20
  },
  polyBtn: {
    width: 60,
    paddingHorizontal: 16,
    alignItems: 'center',
    marginHorizontal: 0,
  },

  // All buttons Container :
  container: {
    position: "absolute",
    left: "0%",

    width: (Dimensions.get('window').width),
    height: 50,

    display: "flex",
    justifyContent: "center",
    alignItems: "center"
  },

  // manage buttons:
  manageButtonsContainer: {
    bottom: "1%",
  },
  manageButtons: {
    flexDirection: 'row',
    alignItems: "center",
    justifyContent: "space-between",

    width: 150,
    padding: 10,
  
    backgroundColor: 'rgba(255,255,255,0.7)',
    borderRadius: 15
  },
    // Name input:
  NameInputContainer: {
    bottom: "80%",
  },
  NameInput: {
    flexDirection: 'row',
    alignItems: "center",
    justifyContent: "space-between",

    padding: 3,
  
    backgroundColor: 'rgba(255,255,255,0.6)',
    borderRadius: 25
  },
  inputDetails: {
    width: 200,
    height:45,
    paddingLeft: 15,

    borderColor: 'gray', 
    borderWidth: 0.3 ,
    borderRadius: 15,
  },
    // Alert  message:
    AlertMessageContainer: {
    bottom: "90%",
  },
  AlertMessage: {
    flexDirection: 'row',
    alignItems: "center",
    justifyContent: "center",
  
    width: 150,
    padding: 10,
    
    backgroundColor: 'rgba(255,50,0,0.6)',
    borderRadius: 10
  },
  // delete alert:
  deletealert: {
    padding: 5,
    backgroundColor: 'rgba(255,255,255,0.6)',
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
  },
  // current work: 
  curentWorkContainer: {
    position: "absolute",
    bottom: "94%",
    left: "0%",
    paddingLeft: 5,

    width: (Dimensions.get('window').width),
    height: 50,

    display: "flex",
    justifyContent: "center",
    alignItems: "flex-start"
  },
  curentWork: {
    flexDirection: 'row',
    alignItems: "center",
    justifyContent: "center",
  
    width: 150,
    padding: 8,
    
    backgroundColor: 'rgba(250,250,250,0.6)',
    borderBottomLeftRadius: 15,
    borderBottomRightRadius: 15,
    borderTopRightRadius: 15,
  },
});

const mapStateToProps = (state) => {
  return {
    tool: state.toggleTool.tool,
    drawingPan: state.toggleTool.drawingPan,
    clicked: state.showTable.clicked,
    alert: state.showAlert.alert,
    newWork: state.NewWork.newWork,
  }
}

export default connect(mapStateToProps)(App) // connect the drawingtools component to the global state
