import * as ACTION_TYPES from '../redux/ActionTypes';

export const clicks=(state={
    isLoading:true,
    errMess:null,
    clicks:[],
    clicksUrl:[],
    isUploading:false
},action)=>{
    switch(action.type)
    {
        case ACTION_TYPES.LOAD_ALL_CLICKS:
            
            return{...state,isLoading:true,errMess:null,clicks:[]};
        
        case ACTION_TYPES.ADD_ALL_CLICKS:

            return{...state, isLoading:false, errMess:null,clicks:action.payload};

        case ACTION_TYPES.ADD_ALL_CLICKS_URL:

            return{...state,clicksUrl:action.payload};

        case ACTION_TYPES.CLICKS_ADD_FAILED:

            return{...state, isLoading:false, errMess:action.payload,clicks:[]};

        case ACTION_TYPES.UPLOADING_NEW_CLICK:

            return{...state,isUploading:true};


        case ACTION_TYPES.UPDATE_ALL_CLICKS:
            return{...state,clicks:state.clicks.concat(action.payload),isUploading:false};

        case ACTION_TYPES.UPDATE_ALL_CLICKS_URL:

            return{...state,clicksUrl:state.clicksUrl.concat(action.payload),isUploading:false};

        default:
            return state;

    }
}