import * as ACTION_TYPES from '../redux/ActionTypes';

export const favourites=(state={
    isLoading:false,
    errMess:null,
    favourites:[],
    isFavourite:false
},action)=>{
    switch(action.type)
    {
        case ACTION_TYPES.LOAD_ALL_FAVOURITES:
            return {...state,isLoading:true,errMess:null,favourites:[]};
        
        case ACTION_TYPES.ADD_FAVOURITES_SUCCESSFULL:
            return{...state,isLoading:false,errMess:null,favourites:action.payload};
        
        case ACTION_TYPES.ADD_FAVOURITES_FAILURE:
            return {...state,isLoading:false,errMess:action.payload,favourites:[]};

        case ACTION_TYPES.CHECK_FAVOURITE_SUCCESSFULL:
            return{...state,isFavourite:action.payload};

        case ACTION_TYPES.CHECK_FAVOURITE_FAILURE:
            return{...state,errMess:action.payload,isFavourite:false};

        case ACTION_TYPES.MAKE_FAVOURITE_SUCCESSFULL:
            return{...state,favourites:action.payload,isFavourite:true};
        
        case ACTION_TYPES.MAKE_FAVOURITE_FAILURE:
            return{...state,errMess:action.payload};

        case ACTION_TYPES.REMOVE_FAVOURITE_SUCCESSFULL:
            return{...state,favourites:action.payload,isFavourite:false};
        
        case ACTION_TYPES.REMOVE_FAVOURITE_FAILURE:
            return{...state,errMess:action.payload};

        default:
            return state;
    }
};