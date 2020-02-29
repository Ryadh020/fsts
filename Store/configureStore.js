import { createStore, combineReducers } from 'redux';

import toggleTool from './reducers/toggleToolsReducer'
import showTable from './reducers/showTableReducer'

const reducers = combineReducers({
    toggleTool,
    showTable
})

export default createStore(reducers)