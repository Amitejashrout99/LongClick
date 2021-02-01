import {createStore,combineReducers,applyMiddleware} from 'redux';
import logger from 'redux-logger';
import thunk from 'redux-thunk';
import {clicks} from '../reducers/click';

export const ConfigureStore=()=>{
    const store=createStore(combineReducers({
        clicks:clicks
    }),applyMiddleware(thunk,logger));

    return store;
};

