import { createStore, combineReducers } from 'redux';

import toggleTool from './reducers/toggleToolsReducer'
import showTable from './reducers/showTableReducer'
import showData from './reducers/showDataReducer'

const reducers = combineReducers({
    toggleTool,
    showTable,
    showData
})

export default createStore(reducers)