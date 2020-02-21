import React from 'react';
import { Marker  } from 'react-native-maps';

class LineCreator extends React.Component {
  constructor(props) {
      super(props)
      this.state = {
        markerNumber: 0,
      }
  }

  render() {
      return(
        <Marker
          coordinate={this.props.cords}
          title={"Line"}
          description={"TEST"}
        ></Marker>
      )
  }
}

export default LineCreator;