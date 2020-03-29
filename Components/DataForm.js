import React from "react"
import {View, Text, StyleSheet, Dimensions, TextInput, TouchableOpacity, Image} from "react-native"
import { Button } from "react-native-paper";
import { connect } from 'react-redux'
import RNPickerSelect from 'react-native-picker-select';

const width = Dimensions.get('window').width;
const height = Dimensions.get('window').height;

class Data extends React.Component {
    constructor(props){
        super(props)
        this.state = {
          editing : {},  // to store live data when filling inputs
          markersdata : [],
          polyLinesData : [],
          polygonsData: [],
        }
        this._updateData = this._updateData.bind(this)
    }

    // push data to the table:
    _updateData() {
        // push data to markers array :
      if(this.props.tool == "Marker") {
        const { markersdata } = this.state;
          // fill the markers array with live data
        this.setState({markersdata : [...markersdata, this.state.editing]})
          // refresh the data after subbmitting
        this.setState({editing : {}})
          // hide the dataTable:
        let action = { type: "MarkerSubmited"}
        this.props.dispatch(action)
      } 
      
      else if(this.props.tool == "Line") {
        const { polyLinesData } = this.state;
        // fill the lines array with live data
      this.setState({polyLinesData : [...polyLinesData, this.state.editing]})
        // refresh the data after subbmitting
      this.setState({editing : {}})
        // hide the dataTable:
      let action = { type: "MarkerSubmited"}
      this.props.dispatch(action)
      } 
      
      else if(this.props.tool == "Polygone") {
        const { polygonsData } = this.state;
          // fill the polygons array with live data
        this.setState({polygonsData : [...polygonsData, this.state.editing]})
          // refresh the data after subbmitting
        this.setState({editing : {}})
          // hide the dataTable:
        let action = { type: "PolygoneSubmited"}
        this.props.dispatch(action)
      }


    }

    componentDidMount() {           // pop up the data of the choosed shape
      if (this.props.Choosed) {
        if(this.props.tool == "Marker") {
          return(
            <View style={styles.output}>
              <Text /*{this.state.markersdata[this.props.id].more}*/ style={styles.outputText}> remarques: </Text>
              <TouchableOpacity
                  style={{ margin: 5}}
                  onPress={console.log("get galerie")}
              >
                    <Image 
                      source={require("../Images/done.png")} 
                      style={{width: 25, height: 25}}
                    />
              </TouchableOpacity>
            </View>
          )
        } else if(this.props.tool == "Polygone") {
          return(
            <View style={styles.output}>
              <Text /* {this.state.polygonsData[this.props.id].etat}*/style={styles.outputText} > etat : </Text>
              <Text /* {this.state.polygonsData[this.props.id].hauteur}*/style={styles.outputText} > Hauteur: </Text>

              <Text /*{this.state.markersdata[this.props.id].more}*/ style={styles.outputText}> remarques: </Text>
              <TouchableOpacity
                  style={{ margin: 5}}
                  onPress={console.log("get galerie")}
              >
                    <Image 
                      source={require("../Images/done.png")} 
                      style={{width: 25, height: 25}}
                    />
              </TouchableOpacity>
            </View>
          )
        } else if(this.props.tool == "Line") {
          return(
            <View style={styles.output}>
              <Text /* {this.state.polygonsData[this.props.id].etat}*/style={styles.outputText} > etat : </Text>
              <Text /* {this.state.polygonsData[this.props.id].largeur}*/style={styles.outputText} > Largeur: </Text>

              <Text /*{this.state.markersdata[this.props.id].more}*/ style={styles.outputText}> remarques: </Text>
              <TouchableOpacity
                  style={{ margin: 5}}
                  onPress={console.log("get galerie")}
              >
                    <Image 
                      source={require("../Images/done.png")} 
                      style={{width: 25, height: 25}}
                    />
              </TouchableOpacity>
            </View>
          )
        }


      } else if(!this.props.Choosed){
        return;
      }
    }

    _inputTable() {
      if(this.props.created) {
        const { editing } = this.state;
          if(this.props.tool == "Marker") { 
            return(
              <View style={styles.table}>
                <TextInput
                  style={styles.inputDetails}
                  placeholder={"Remarks..."}
                  onChangeText={e => this.setState({editing : {...editing, more : e} })}
                ></TextInput>
    
                <View style={{display: "flex", flexDirection: "row", justifyContent: "space-between", width: 100, margin: 15}}>
                  <TouchableOpacity
                    onPress={console.log()}
                  >
                    <Image 
                      source={require("../Images/done.png")} 
                      style={{width: 25, height: 25}}
                    />
                  </TouchableOpacity>

                  <TouchableOpacity
                    onPress={this._updateData}
                  >
                    <Image 
                      source={require("../Images/done.png")} 
                      style={{width: 25, height: 25}}
                    />
                  </TouchableOpacity>
                </View>
 
              </View>
            )
          } else if(this.props.tool == "Line") {
            return(
              <View style={styles.table}>
                <RNPickerSelect
                  placeholder={{label: 'deffinez letat de la voirie', value: 'deffinez letat de la voirie' }}
                  onValueChange={(value) => {
                    if(value == "bon") {
                      this.setState({editing : {...editing, etat : "bon"} })
                    } else if(value == "moyen") {
                      this.setState({editing : {...editing, etat : "moyen"} })
                    } else if(value == "mauvais") {
                      this.setState({editing : {...editing, etat : "mauvais"} })
                    }
                  }}
                  items={[
                    { label: 'bon', value: 'bon' },
                    { label: 'moyen', value: 'moyen'},
                    { label: 'mauvais', value: 'mauvais'},
                  ]}
                />


                <TextInput
                  style={styles.input}
                  placeholder={"Largeur de la voirie"}
                  onChangeText={e => {this.setState({editing : {...editing, largeur : e} })} }
                ></TextInput>


                <TextInput
                  style={styles.inputDetails}
                  placeholder={"Remarks..."}
                  onChangeText={e => this.setState({editing : {...editing, more : e} })}
                ></TextInput>




                <View style={{display: "flex", flexDirection: "row", justifyContent: "space-between", width: 100, margin: 15}}>
                  <TouchableOpacity
                    onPress={console.log()}
                  >
                    <Image 
                      source={require("../Images/done.png")} 
                      style={{width: 25, height: 25}}
                    />
                  </TouchableOpacity>

                  <TouchableOpacity
                    onPress={this._updateData}
                  >
                    <Image 
                      source={require("../Images/done.png")} 
                      style={{width: 25, height: 25}}
                    />
                </TouchableOpacity>
              </View>
            </View>
            )
          } else if (this.props.tool == "Polygone") {
            return(
              <View style={styles.table}>

                <RNPickerSelect
                  placeholder={{label: 'deffinez letat de la construction', value: 'deffinez letat de la construction' }}
                  onValueChange={(value) => {
                    if(value == "bon") {
                      this.setState({editing : {...editing, etat : "bon"} })
                    } else if(value == "moyen") {
                      this.setState({editing : {...editing, etat : "moyen"} })
                    } else if(value == "mauvais") {
                      this.setState({editing : {...editing, etat : "mauvais"} })
                    }
                  }}
                  items={[
                    { label: 'bon', value: 'bon' },
                    { label: 'moyen', value: 'moyen'},
                    { label: 'mauvais', value: 'mauvais'},
                  ]}
                />


                <TextInput
                  style={styles.input}
                  placeholder={"hauteur de la construction"}
                  onChangeText={e => {this.setState({editing : {...editing, largeur : e} })} }
                ></TextInput>


                <TextInput
                  style={styles.inputDetails}
                  placeholder={"Remarks..."}
                  onChangeText={e => this.setState({editing : {...editing, more : e} })}
                ></TextInput>




                <View style={{display: "flex", flexDirection: "row", justifyContent: "space-between", width: 100, margin: 15}}>
                  <TouchableOpacity
                    onPress={console.log()}
                  >
                    <Image 
                      source={require("../Images/done.png")} 
                      style={{width: 25, height: 25}}
                    />
                  </TouchableOpacity>

                  <TouchableOpacity
                    onPress={this._updateData}
                  >
                    <Image 
                      source={require("../Images/done.png")} 
                      style={{width: 25, height: 25}}
                    />
                </TouchableOpacity>
              </View>
              </View>
            )
          }
        }
    }
    render() {
      return(
        <View style={styles.dataContainer}>
          
          {this.componentDidMount()}
          {this._inputTable()}

        </View>

      )
    }
}

const styles = StyleSheet.create({
  dataContainer: {
    position: "absolute",
    width: (width) ,
    height: (height),
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
  },
  table: {
    position: "absolute",
    top: (height) * 0.5,
    left: (height) * 0.06,
    width: (width) * 0.75,
    display: "flex",
    flexDirection: "column",
    alignItems: "center",

    backgroundColor: 'rgba(255,255,255,0.7)',
    borderRadius: 20,
  },
  input: {
    width: (width) * 0.7,
    height:45,
    paddingLeft: 15,

    borderColor: 'gray', 
    borderWidth: 0.3 ,
    borderRadius: 10,
  },
  inputDetails: {
    width: (width) * 0.7,
    height:105,
    paddingLeft: 15,
    marginTop: 10,

    borderColor: 'gray', 
    borderWidth: 0.3 ,
    borderTopLeftRadius: 15,
    borderTopRightRadius: 15,
  },
  output: {
    position: "absolute",
    top: (height) * 0.1,
    left: (height) * 0.11,
    width: (width) * 0.6,
    display: "flex",
    flexDirection: "column",
    alignItems: "center",

    backgroundColor: 'rgba(255,255,255,0.7)',
    borderRadius: 20,
  },
  outputText: {
    borderBottomColor: "black",
    borderBottomWidth: 1, 
    margin: 10
  }
})

const mapStateToProps = (state) => {
  return {
    tool: state.toggleTool.tool,
    created: state.showTable.clicked,
    Choosed: state.showData.shoosed,
    id: state.showData.id,
  }
}

export default connect(mapStateToProps)(Data) // connect the drawingtools component to the global state