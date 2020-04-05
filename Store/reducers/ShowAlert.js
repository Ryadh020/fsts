const initialState = { alert : false }

  
function showAlert(state = initialState, action) {
    let nextState
    switch (action.type) {
      case 'ShowAlert':
        nextState = { 
          ...state, 
          alert : true,
        }
        return nextState || state
      case 'HideAlert':
        nextState = { 
            ...state, 
            alert : false,
          }
        return nextState || state
      default:
      return state
    }
  }
  
  export default showAlert