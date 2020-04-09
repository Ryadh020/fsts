import React from 'react';
import MapView, { Marker, Polygon, Polyline, ProviderPropType } from 'react-native-maps';
import { StyleSheet, View, Dimensions, Text, TouchableOpacity, Image, FlatList} from 'react-native';
import { connect } from 'react-redux'
import RNPickerSelect from 'react-native-picker-select';
import { MAP_TYPES } from 'react-native-maps';
import { AsyncStorage } from 'react-native';

import DrawingTools from '../Components/DrawingTools' // components takes in charge displaying drawing tools.
import Data from "../Components/DataForm" // a table to put data about the marker/line/polygone.
import Saved from "../Components/SavedMapInfo"

let PolygoneId = 0; // for polygones counting
let lineId = 0;  // for Polylines counting
let markerId = 0;  // for markers counting
let shapes = {       // a temporal database of drawed shapes
      markers: [],
      polylines: [],
      polygones: [],
    } 

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
      mapType: MAP_TYPES.STANDARD, // map type

      mapsKeys : [],  // contain all saved maps keys

      workName: "empty",        // the actual workspace name:
      alertMessage : "HELLO WORLD",      // alert message
      saved : false,      // to detect if the previous project is saved

      sandwish: true,

        // markers data
      markers: [],   
      markersEditing: null,
      markerIconURL : require("../Images/Markers/home.png"),  // (default marker icon) & to detect the changing of select form
      markerIcon : "home",  
      markerColor : require("../Images/Markers/black.png"),   // for panel


        // polygons data :
      polygons: [],   // to contain polygones and show them on mapping the array
      polygoneEditing: null,  // to contains polygons data
      creatingHole: false,  // detect if a hole is on creating
        // drawing panel carachteristics :
          // for panel
      polygoneFillURL: require("../Images/Polygone/black.png"),
      polygoneBorderURL: require("../Images/Polygone/black_hole.png"),
          // for drawing
      polygoneStrokeColor : "gray",
      polygoneFillColor: "gray",
      

        // PolyLines data :
      polylines: [],
      LineEditing: null,
      drawLine : false,
      scrollable : true,  // for map scrolling
        //  drawing panel carachteristics :
          // for panel
      polylineStrokeColor: "black",
      polylineStrokeWidth: 4,
          // for drawing
      polylineFillURL: require("../Images/Polygone/black_hole.png"),
      polylineWidhtURL: require("../Images/Polygone/1.png"),
    }
    this._Darw = this._Darw.bind(this)
    this._changeMapType = this._changeMapType.bind(this)
  }

    // change the map type :
  _changeMapType() {
    this.state.mapType == MAP_TYPES.STANDARD? this.setState({ mapType : MAP_TYPES.SATELLITE }):this.setState({ mapType : MAP_TYPES.STANDARD })
  }



    // get all saved maps keys:
  _getSavedMaps =  async () => {
    try {
      let Keys = await AsyncStorage.getAllKeys(); // get all keys of saved maps
      this.setState({mapsKeys: Keys})
    }
    catch (error) {
      console.log("Erro geting keys")
    }
  }
    // show the list of saved maps:
  componentDidMount() {  // chage it with a global state that detect new saved maps (refreshable):
    this._getSavedMaps()
  }
  
  _sandwishBar() {
    this.setState({sandwish: true})
  }


    // get saved maps from the Storage :
  _getData =  async (key) => {
    
    // get data:
    try {
        let value = await AsyncStorage.getItem(`${key}`);
        let AllShapes = JSON.parse(value)

        if (value !== null) {
          this.setState({
            sandwish: false,
            workName: AllShapes.name,
            markers : AllShapes.markers,
            polylines : AllShapes.polylines,
            polygons : AllShapes.polygones,
          })
        }
    }
    catch (error) {
      console.log("Erro")
    }
  }


  _fillDrawedShapes() {
      // fill a temporal database to send it to the storage
    shapes.markers = this.state.markers
    shapes.polylines = this.state.polylines
    shapes.polygones = this.state.polygons   
  }


  // store data function:
  _storeData = async () => {
    try {
      // send data
    await AsyncStorage.setItem(`${this.state.workName}`, JSON.stringify(shapes));
    console.log("data saved")

    this.setState({saved: true,})  // tell that the project is saved

    } catch (error) {
      console.log("error");
    }
  };

    // Helpers :
  latLng = {latitude: 36.365, longitude: 6.61472}

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
      const { markers } = this.state;
      this.setState({
        markers: [...markers, {latiLngi : latLng, key : markerId, icon : this.state.markerIconURL,}],
      });
      // update the counter of markers :
      markerId++
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


        {this.state.markers.map(index =>(
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

        {this.props.drawingPan == "MarkerPan" && (
        <View style={styles.FloatingContainer}>
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
          </View>
        )}

        {this.props.drawingPan == "PolygonPan" && (
        <View  style={styles.FloatingContainer}>
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
          <View  style={styles.FloatingContainer}>
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

        <View style={[styles.manageButtonsContainer, styles.container]}>
          <View style={styles.manageButtons}>
            <TouchableOpacity
              onPress={() => this._sandwishBar()}
            >
              <Image 
                source={require("../Images/Manage/new.png")} 
                style={{width: 25, height: 25}}
              />
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => console.log("else")}
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


        <View style={[styles.drawingContainer, styles.float, styles.column]}>
          <TouchableOpacity onPress={this._changeMapType} style={styles.MapTypeButton}>
            <Image 
              style={{width: 45, height: 45}} 
              source={this.state.mapType == MAP_TYPES.STANDARD? require("../Images/earth.png"): require("../Images/map.png") } 
            />
          </TouchableOpacity>
          <DrawingTools/>
        </View>
      
        <Data/>

        {this.state.sandwish && (
          <View style={styles.savedWorkContainer}>
            <FlatList
              style={styles.savedWorkList}
              data={this.state.mapsKeys}
              renderItem={({ item }) => <Saved title={item} showSavedMap={this._getData}></Saved>}
              keyExtractor={item => item}
            />
          </View>
        )}


      </View>
    );
  }
}

App.propTypes = {
  provider: ProviderPropType,
};

  const styles = StyleSheet.create({
    savedWorkContainer: {
      position: "absolute",
      left: "0%",
      bottom: "0%",
  
      width: (Dimensions.get('window').width),
      height: (Dimensions.get('window').height),
      paddingTop: 300,
  
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
  
      backgroundColor: 'rgba(0,0,0,0.5)',
    },
    float : {
      position : "absolute",
    },
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
    container: {
      position: "absolute",
      left: "0%",
  
      width: (Dimensions.get('window').width),
      height: 50,
  
      display: "flex",
      justifyContent: "center",
      alignItems: "center"
    },
    Button: {
      width: 35,
      height: 35,
      margin: 5,
  
      backgroundColor: 'rgba(255,255,255,0.7)',
      borderBottomLeftRadius: 25,
      borderBottomRightRadius: 25,
    },
    /* the mapView style */
    mapStyle: {
      width: (Dimensions.get('window').width),
      height: (Dimensions.get('window').height) * 0.93,
    },
    /* the drawing buttons style */
    drawingContainer: {
      top: "30%",
      left: "4%",
  
    },
    MapTypeButton : {
      backgroundColor : "hsla(44, 0%, 85%, 0.5)",
      borderRadius : 50,
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
    FloatingContainer: {
      position: "absolute",
      left: 0,
      bottom: 50,
      width: "100%",
      height: "25%",
  
      display: "flex",
      flexDirection: "column",
      justifyContent: "center",
      alignItems: "center",
    },
    panelContainer: {
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
      paddingLeft: 25,
      marginBottom: 15,
    
      flexDirection: 'row',
      alignItems: "center",
    
      backgroundColor: 'rgba(255,255,255,0.7)',
      borderRadius: 20
    },
    polyButtonContainer: {
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
  }
}

export default connect(mapStateToProps)(App) // connect the drawingtools component to the global state
