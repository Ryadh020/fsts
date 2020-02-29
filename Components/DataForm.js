import React from "react"
import {View, Text, StyleSheet, Dimensions, TextInput} from "react-native"
import { Button } from "react-native-paper";
import { connect } from 'react-redux'

class Data extends React.Component {
    constructor(props){
        super(props)
        this.state = {
          
        }
        this._updateData = this._updateData.bind(this)
    }

    // data when editing the table form:
    editing = {
      hauteur : "",
      etat : ""
    }

    // all the data:
    data =[]

    // push data to the table:
    _updateData() {
      this.data.push(this.editing);
      let action = { type: "MarkerSubmited"}
      this.props.dispatch(action)
    }

    _popOutput() {
      if (this.props.Choosed) {
        return(
          <View style={styles.output}>
            <Text>R+{this.data[0].hauteur}</Text>   
            <Text>{this.data[0].etat}</Text>
          </View>
        )
      }
    }

    _inputTable() {
      if(this.props.clicked) {
        return(
          <View style={styles.table}>
            <TextInput
              style={styles.input}
              placeholder={"tappez la hauteur de la construction"}
              onChangeText={e => this.editing.hauteur = e}
            ></TextInput>
            <TextInput
              style={styles.input}
              placeholder={"tappez son etat"}
              onChangeText={e => this.editing.etat = e}
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
          
          {this._popOutput()}
          {this._inputTable()}

        </View>

      )
    }
}

const styles = StyleSheet.create({
  dataContainer: {
    position: "absolute",
    width: (Dimensions.get('window').width) ,
    height: (Dimensions.get('window').height),
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
  },
  table: {
    position: "absolute",
    top: (Dimensions.get('window').height) * 0.3,
    left: (Dimensions.get('window').height) * 0.025,
    width: (Dimensions.get('window').width) * 0.9,
    height: (Dimensions.get('window').height) * 0.4,
    display: "flex",
    flexDirection: "column",
    alignItems: "center",

    backgroundColor: "red",
    borderRadius: 20,
  },
  input: {
      width: (Dimensions.get('window').width) * 0.7,
      height:45,
      borderColor: 'gray', 
      borderWidth: 1 ,
      borderRadius: 15,
  },
  output: {
    position: "absolute",
    top: (Dimensions.get('window').height) * 0.05,
    left: (Dimensions.get('window').height) * 0.025,
    width: (Dimensions.get('window').width) * 0.9,
    height: (Dimensions.get('window').height) * 0.2,
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