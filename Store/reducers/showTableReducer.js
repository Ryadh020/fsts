const initialState = { clicked : false }  // detect if the drawing tool is cliked

  // change the state to the spicified one of the the tools
function showTable(state = initialState, action) {
    let nextState
    switch (action.type) {
      case 'MarkerClicked':
        nextState = { 
          ...state, 
          clicked : true  // make the clicked to false to detect that the marker is clicked 
        }
        return nextState || state
      case 'LineClicked':
        nextState = {
          ...state,
          clicked : true
        }
        return nextState || state
      case 'PolygoneClicked':
        nextState = {
          ...state,
          clicked : true
        }
        return nextState || state
      default:
      return state
    }
  }
  
  export default showTable