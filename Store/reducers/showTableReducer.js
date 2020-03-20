const initialState = { clicked : false}  // detect if the drawing tool is cliked

  // change the state to the spicified one of the the tools
function showTable(state = initialState, action) {
    let nextState
    switch (action.type) {
      case 'MarkerCreated':
        nextState = { 
          ...state, 
          clicked : true,  // make the clicked to false to detect that the marker is clicked 
        }
        return nextState || state
      case 'MarkerSubmited':
        nextState = { 
            ...state, 
            clicked : false,  // make the clicked to false to detect that the marker is clicked 
        }
        return nextState || state
      case 'LineCreated':
        nextState = {
          ...state,
          clicked : true
        }
        return nextState || state
      case 'LineSubmited':
        nextState = {
          ...state,
        clicked : false
      }
        return nextState || state
      case 'PolygoneCreated':
        nextState = {
          ...state,
          clicked : true
        }
        return nextState || state
      case 'PolygoneSubmited':
        nextState = { 
            ...state, 
          clicked : false,  // make the clicked to false to detect that the marker is clicked 
      }
        return nextState || state
      default:
      return state
    }
  }
  
  export default showTable