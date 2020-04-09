import React from 'react'
import { StyleSheet, View, TouchableOpacity, Image} from 'react-native';
import { connect } from 'react-redux'

class DrawingTools extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
          toolsOpen : false
        }
        this._MarkerTool = this._MarkerTool.bind(this)
        this._LineTool = this._LineTool.bind(this)
        this._PolygoneTool = this._PolygoneTool.bind(this)

        this._DrawingToolsToggle = this._DrawingToolsToggle.bind(this)
    }

        // show the tools "drawing tools button"
    _DrawingToolsToggle() {
        if(!this.state.toolsOpen) {  // if the drawing toolBar is closed 
          styles.DrawingButtons = {  // Spand the toolBar
            position : "absolute",
            height: 210,
            top : 140,
            right : 15,
            display : "flex",
            flexDirection : "column",
            justifyContent : "space-around",
            alignItems : "center",
          }
          this.setState({ toolsOpen : true });  // use it to change to change the button image and detect toolBar state
        } else if(this.state.toolsOpen) {
          styles.DrawingButtons = {  // Shrink the toolBar
            position : "absolute",
            height: 0,
            top : 160,
            right : 15,
            display : "flex",
            flexDirection : "column",
            justifyContent : "space-around",
            alignItems : "center",
          }
          let action = { type: "disabled", value: "" }  // reset the globale state to disable drawing
          this.props.dispatch(action)

          this.setState({ toolsOpen : false });
        }  
    }
    
        // change the components to put in the set array (marker/line/polygone) 
        // creat and send actions with the spicified data to the toggleToll reducer
    _MarkerTool() {
          // select the drawing tool
        let action = { type: "Marker", value: "Marker" }
        this.props.dispatch(action)

          // select the panel drawing tool
        let action2 = { type: "MarkerPan", value: "MarkerPan" }
        this.props.dispatch(action2)
    }
    _LineTool() {
        let action = { type: "Line", value: "Line" }
        this.props.dispatch(action)

          // select the panel drawing tool
        let action2 = { type: "LinePan", value: "LinePan" }
        this.props.dispatch(action2)
    }
    _PolygoneTool() {
        let action = { type: "Polygone", value: "Polygone"}
        this.props.dispatch(action)

          // select the panel drawing tool
        let action2 = { type: "PolygonPan", value: "PolygonPan" }
        this.props.dispatch(action2)
    }

    render() {
          // the defalt Button image to show or hide drawingTools 
        let ShowHideButtonImage = this.state.toolsOpen? require("../Images/x.png") : require("../Images/brush.png") ;
          // return
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
            <TouchableOpacity onPress={this._DrawingToolsToggle} style={styles.xoContainer}>
              <Image style={styles.XO} 
                     source={ShowHideButtonImage} 
              />
            </TouchableOpacity>
          </View>
        )
    }
}

const styles = StyleSheet.create({
    DrawingButtons : {  // for the right side buttons (marker/line/Polygone ....etc.)
      position : "absolute",
      height: 0,
      top : "30%",
      right : 15,
      display : "flex",
      flexDirection : "column",
      justifyContent : "space-around",
      alignItems : "center",
    },
    logoContainer : {
      display : "flex",
      justifyContent : "center",
      alignItems : "center",
      width : 45,
      height : 45,
      padding : 10,
      backgroundColor: 'rgba(255,255,255,0.7)',
      borderRadius : 50
    },
    xoContainer : {
      display : "flex",
      justifyContent : "center",
      alignItems : "center",
      width : 45,
      height : 45,
      padding : 10,
      backgroundColor : "white",
      borderRadius : 50
    },
    XO : { // ordinary button
        width : 30,
        height : 30,
        borderRadius : 50,
    },
    logo : { // ordinary button
        width : 40,
        height : 40,

        borderRadius : 50,
    }
  });

  const mapStateToProps = (state) => {
    return {
      tool: state.toggleTool.tool
    }
  }
  
  export default connect(mapStateToProps)(DrawingTools) // connect the drawingtools component to the global state
  