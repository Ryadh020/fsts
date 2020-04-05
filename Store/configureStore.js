import { createStore, combineReducers } from 'redux';

import toggleTool from './reducers/toggleToolsReducer'
import showTable from './reducers/showTableReducer'
import showData from './reducers/showDataReducer'
import showAlert from './reducers/ShowAlert'
import NewWork from './reducers/newWork'

const reducers = combineReducers({
    toggleTool,
    showTable,
    showData,
    showAlert,
    NewWork
})

export default createStore(reducers)