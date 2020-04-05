const initialState = { newWork : false }

  
function NewWork(state = initialState, action) {
    let nextState
    switch (action.type) {
      case 'NewWork':
        nextState = { 
          ...state, 
          newWork : true,
        }
        return nextState || state
      case 'NewWorkDone':
        nextState = { 
            ...state, 
            newWork : false,
          }
        return nextState || state
      default:
      return state
    }
  }
  
  export default NewWork