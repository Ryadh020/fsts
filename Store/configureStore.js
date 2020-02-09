import { createStore, combineReducers } from 'redux';

import toggleTool from './reducers/toggleToolsReducer'

const reducers = combineReducers({
    toggleTool
})

export default createStore(reducers)