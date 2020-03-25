const initialState = { tool: "", drawingPan: false}  // the globale state of drawing tools

  // change the state to the spicified one of the the tools
function toggleTool(state = initialState, action) {
    let nextState
    switch (action.type) {
      case 'Marker':
        nextState = { 
          ...state, 
          tool: action.value
        }
        return nextState || state
      case 'MarkerPan':
        nextState = { 
          ...state, 
          drawingPan: action.value
        }
        return nextState || state
      case 'Line':
        nextState = {
          ...state,
          tool: action.value
        }
        return nextState || state
      case 'LinePan':
        nextState = { 
          ...state, 
          drawingPan: action.value
        }
        return nextState || state
      case 'Polygone':
        nextState = {
          ...state,
          tool: action.value
        }
        return nextState || state
      case 'PolygonPan':
        nextState = { 
          ...state, 
          drawingPan: action.value
        }
        return nextState || state
      case 'disabled':
        nextState = { 
          ...state, 
          tool: action.value,
          drawingPan : false
        }
        return nextState || state
      default:
      return state
    }
  }
  
  export default toggleTool






