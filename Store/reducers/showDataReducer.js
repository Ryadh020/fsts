const initialState = { shoosed : false, id : 0, located: false }  // the number of the selected shape

  // change the state to the spicified one of the the tools
function showData(state = initialState, action) {
    let nextState
    switch (action.type) {
      case 'ShapeFocused':
        nextState = { 
          ...state, 
          shoosed : true,
          id : action.value,  // make the clicked to false to detect that the marker is clicked 
        }
        return nextState || state
      case 'shapeBlured':
        nextState = {
          ...state,
          shoosed : false,
          //id : action.value,
        }
        return nextState || state

      case 'LOcationFocused':
        nextState = { 
          ...state, 
          located : true,
        }
        return nextState || state
      case 'LOcationBlured':
        nextState = {
          ...state,
          located : false,
        }
        return nextState || state

      default:
      return state
    }
  }
  
  export default showData