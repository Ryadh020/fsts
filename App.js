import * as React from 'react';
import {View, Text, StyleSheet} from 'react-native'
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
    }, 2000);
  }

render() {
  return (
    this.state.no === 1 ? 
    <View style={styles.introPage}>
      <Text style={styles.logo}>FSTS</Text>
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
    justifyContent:"center", 
    alignItems: "center"
  },
  logo: {
    fontSize: 80,
    backgroundColor: "red"
  }
})

