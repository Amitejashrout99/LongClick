import * as ACTION_TYPES from '../redux/ActionTypes';

export const comments=(state={
    isLoading:true,
    errMess:null,
    editCommentErrMess:null,
    addCommentErrMess:null,
    comments:[]
},action)=>{
    switch(action.type)
    {
        case ACTION_TYPES.LOAD_ALL_COMMENTS:
            return{...state,isLoading:true,errMess:null,comments:[]};

        case ACTION_TYPES.ADD_ALL_COMMENTS:
            return{...state,isLoading:false,errMess:null,comments:action.payload};

        case ACTION_TYPES.COMMENTS_ADD_FAILED:
            
            return {...state,isLoading:false,errMess:action.payload,comments:[]};
        
        case ACTION_TYPES.START_EDIT_COMMENT:

            return{...state,isLoading:true};

        case ACTION_TYPES.EDIT_COMMENT_SUCCESSFULL:
            return{...state,isLoading:false,comments:action.payload};

        case ACTION_TYPES.EDIT_COMMENT_FAILURE:
            return{...state,isLoading:false,editCommentErrMess:action.payload};

        case ACTION_TYPES.RESET_EDIT_COMMENT_FAILURE_STATE:
            return{...state,editCommentErrMess:null};
        
        case ACTION_TYPES.RESET_ADD_COMMENT_FAILURE_STATE:
            return{...state,addCommentErrMess:null};

        case ACTION_TYPES.START_ADDING_COMMENT:
            return{...state,isLoading:true};
        
        case ACTION_TYPES.ADD_COMMENT_SUCCESSFULL:
            return{...state,isLoading:false,errMess:null,comments:action.payload};

        case ACTION_TYPES.ADD_COMMENT_FAILURE:
            return{...state,isLoading:false,addCommentErrMess:action.payload};

        default:
            return state;

    }
}