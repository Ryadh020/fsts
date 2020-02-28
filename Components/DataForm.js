import React from "react"
import {View, Text, StyleSheet, Dimensions, TextInput} from "react-native"
import { Button } from "react-native-paper";

class Data extends React.Component {
    constructor(props){
        super(props)
        this.state = {
          n:0,
        }
    }

    // data object:
    data = {
      hauteur : "4",
      etat : "bon"
    }

    // push data to the table:


    render() {
      return(
        <View style={styles.dataContainer}>
          
          <View style={styles.output}>
            <Text>{this.data.hauteur}</Text>
            <Text>{this.data.etat}</Text>
          </View>

          <View style={styles.table}>
            <TextInput
              style={styles.input}
              placeholder={"tap"}
              onChangeText={e => this.data.hauteur = e}
            ></TextInput>
            <TextInput
              style={styles.input}
              placeholder={"tap"}
              onChangeText={e => this.data.etat = e}
            ></TextInput>

            <Button
              onPress={()=> this.setState({n : 2})}
            >submit</Button>
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

export default Data