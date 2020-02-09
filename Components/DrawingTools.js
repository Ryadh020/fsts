import React from 'react'
import { StyleSheet, View, TouchableOpacity, Image} from 'react-native';

export default class DrawingTools extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            DrawingTool : "Marker"
        }
        this._MarkerTool = this._MarkerTool.bind(this)
        this._LineTool = this._LineTool.bind(this)
        this._PolygoneTool = this._PolygoneTool.bind(this)

        this._ShowTools = this._ShowTools.bind(this)
    }

        // show the tools
    _ShowTools() {
        styles.DrawingButtons = {
        position : "absolute",
        height: 210,
        top : 110,
        right : 15,
        display : "flex",
        flexDirection : "column",
        justifyContent : "space-around",
        alignItems : "center",
        }
        this.setState({ DrawingTool : "Polygone" });
    }
    
        // change the components to put in the set array (marker/line/polygone)
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
        return(
          <View style={styles.DrawingButtons}>
            <TouchableOpacity onPress={this._MarkerTool} style={styles.logoContainer}>
              <Image style={styles.logo} source={require("../Images/marker.png")} />
            </TouchableOpacity>
            <TouchableOpacity onPress={this._LineTool} style={styles.logoContainer}>
              <Image style={styles.logo} source={require("../Images/line.png")} />
            </TouchableOpacity>
            <TouchableOpacity onPress={this._PolygoneTool} style={styles.logoContainer}>
              <Image style={styles.logo} source={require("../Images/Polygone.png")} />
            </TouchableOpacity>
            <TouchableOpacity onPress={this._ShowTools} style={styles.logoContainer}>
              <Image style={styles.XO} source={require("../Images/brush.png")} />
            </TouchableOpacity>
          </View>
        )
    }
}

const styles = StyleSheet.create({
    DrawingButtons : {  // for the right side buttons (marker/line/Polygone ....etc.)
      position : "absolute",
      height: 0,
      top : 140,
      right : 15,
      display : "flex",
      flexDirection : "column",
      justifyContent : "space-around",
      alignItems : "center"
    },
    logoContainer : {
      display : "flex",
      justifyContent : "center",
      alignItems : "center",
      width : 45,
      height : 45,
      padding : 10,
      backgroundColor : "hsla(44, 0%, 85%, 0.8)",
      borderRadius : 50
    },
    XO : { // ordinary button
        width : 30,
        height : 30,
        borderRadius : 50,
    },
    logo : { // ordinary button
        width : 30,
        height : 30,
        borderRadius : 50,
    }
  });
  