import {createStore,combineReducers,applyMiddleware} from 'redux';
import logger from 'redux-logger';
import thunk from 'redux-thunk';
import {clicks} from '../reducers/click';
import {users} from '../reducers/user';
import {comments} from '../reducers/comments';
import {favourites} from '../reducers/favourite';


export const ConfigureStore=()=>{
    const store=createStore(combineReducers({
        clicks:clicks,
        users:users,
        comments:comments,
        favourites:favourites
    }),applyMiddleware(thunk,logger));

    return store;
};

