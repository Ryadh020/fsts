import * as React from 'react';
import {View, Text, StyleSheet, Image} from 'react-native'
import { Provider } from 'react-redux'
import Store from './Store/configureStore'
import Route from './Navigation/Route'

export default class App extends React.Component {

  constructor(props) {
    super(props)
    this.state = {
      no : 1,
    }
  }

  componentDidMount() {
    setTimeout(() => {
      this.setState({no: 2})
    }, 4000);
  }

render() {
  return (
    this.state.no === 1 ? 
    <View style={styles.introPage}>
      <Text style={styles.logo}>FSTS</Text>


      <View style={styles.touche}>
        <Text>Made with</Text>
        <Image
          style={{width: 30, height:30}}
          source={require("./Images/love.png")}
        ></Image>
        <Text>and </Text>
        <Image
          source={require("./Images/milk.png")}
        ></Image>
      </View>

    </View>
    :
    <Provider store={Store}>
      <Route></Route>
    </Provider>
  )
}

}

const styles = StyleSheet.create({
  introPage: {
    display:"flex",
    flex: 1,
    justifyContent:"space-around", 
    alignItems: "center"
  },
  logo: {
    fontSize: 80,
  },
  touche: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
  }
})

