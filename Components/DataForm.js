import React from "react"
import {View, Text, StyleSheet, Dimensions, TextInput} from "react-native"
import { Button } from "react-native-paper";
import { connect } from 'react-redux'

const width = Dimensions.get('window').width;
const height = Dimensions.get('window').height;

class Data extends React.Component {
    constructor(props){
        super(props)
        this.state = {
          editing : {},  // to store live data when filling inputs
          markersdata : []
        }
        this._updateData = this._updateData.bind(this)
    }

    // data when editing the table form:


    // all the data:
    

    // push data to the table:
    _updateData() {
      const { markersdata } = this.state;

      this.setState({markersdata : [...markersdata, this.state.editing]})
        // refresh the data after subbmitting
      this.setState({editing : {}})

      //this.markersdata.push(this.state.editing);

        // hide the dataTable:
      let action = { type: "MarkerSubmited"}
      this.props.dispatch(action)
    }

    

    componentDidMount() {           // pop up the data of the choosed shape
      if (this.props.Choosed) {
       // this.markersdata.map(index => {
          return(
            <View style={styles.output}>
              <Text>R+{this.state.markersdata[this.props.id].hauteur}</Text>
              <Text>{this.state.markersdata[this.props.id].etat}</Text>
            </View>
          )
       // })

      } else if(!this.props.Choosed){
        return;
      }
    }

    _inputTable() {
      if(this.props.clicked) {
        const { editing } = this.state;
        return(
          <View style={styles.table}>
            <TextInput
              style={styles.input}
              placeholder={"tappez la hauteur de la construction"}
              onChangeText={e => {this.setState({editing : {...editing, hauteur : e} })} }
            ></TextInput>
            <TextInput
              style={styles.input}
              placeholder={"tappez son etat"}
              onChangeText={e => this.setState({editing : {...editing, etat : e} })}
            ></TextInput>

            <Button
              onPress={this._updateData}
            >submit</Button>
          </View>
        )
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
    top: (height) * 0.3,
    left: (height) * 0.025,
    width: (width) * 0.9,
    height: (height) * 0.4,
    display: "flex",
    flexDirection: "column",
    alignItems: "center",

    backgroundColor: "red",
    borderRadius: 20,
  },
  input: {
      width: (width) * 0.7,
      height:45,
      borderColor: 'gray', 
      borderWidth: 1 ,
      borderRadius: 15,
  },
  output: {
    position: "absolute",
    top: (height) * 0.05,
    left: (height) * 0.025,
    width: (width) * 0.9,
    height: (height) * 0.2,
    display: "flex",
    flexDirection: "column",
    alignItems: "center",

    backgroundColor: "green",
    borderRadius: 20,
  }
})

const mapStateToProps = (state) => {
  return {
    tool: state.toggleTool.tool,
    clicked: state.showTable.clicked,
    Choosed: state.showData.shoosed,
    id: state.showData.id,
  }
}

export default connect(mapStateToProps)(Data) // connect the drawingtools component to the global state