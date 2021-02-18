import * as ACTION_TYPES from '../redux/ActionTypes';

export const favourites=(state={
    isLoading:false,
    errMess:null,
    favourites:[]
},action)=>{
    switch(action.type)
    {
        case ACTION_TYPES.LOAD_ALL_FAVOURITES:
            return {...state,isLoading:true,errMess:null,favourites:[]};
        
        case ACTION_TYPES.ADD_FAVOURITES_SUCCESSFULL:
            return{...state,isLoading:false,errMess:null,favourites:action.payload};
        
        case ACTION_TYPES.ADD_FAVOURITES_FAILURE:
            return {...state,isLoading:false,errMess:action.payload,favourites:[]};

        default:
            return state;
    }
};