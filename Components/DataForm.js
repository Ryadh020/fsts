import React from "react"
import {View, Text, StyleSheet, Dimensions, TextInput} from "react-native"

class Data extends React.Component {
    constructor(props){
        super(props)
        this.state = {
          input : "test",
        }
    }


    
    render() {
      return(
        <View style={styles.dataContainer}>
          
          <View style={styles.output}>
            <Text>{this.state.input}</Text>
            <Text>{this.state.input}</Text>
          </View>

          <View style={styles.table}>
            <TextInput
              style={styles.input}
              placeholder={"test"}
            ></TextInput>
            <TextInput
              style={styles.input}
              placeholder={"test"}
            ></TextInput>
          </View>
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
    top: (Dimensions.get('window').height) * 0.5,
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
    top: (Dimensions.get('window').height) * 0.25,
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

export default Data