import * as ACTION_TYPES from '../redux/ActionTypes';

export const users=(state={

    isLogginIn:false,
    errMess:null,
    jwtToken:null,
    isAuthenticated:false,
},action)=>{

    switch(action.type)
    {
        case ACTION_TYPES.ATTEMPTING_TO_LOGIN:
            return{...state,isLogginIn:true,errMess:null,jwtToken:null,isAuthenticated:false};
        
        case ACTION_TYPES.LOGIN_SUCCESSFULL:
            return{...state,isLogginIn:false,errMess:null,jwtToken:action.payload,isAuthenticated:true};

        case ACTION_TYPES.LOGIN_FAILURE:

            return{...state,isLogginIn:false,errMess:action.payload,jwtToken:null,isAuthenticated:false};

        case ACTION_TYPES.LOGOUT_SUCCESSFULL:
            return{...state,jwtToken:null,isAuthenticated:false};

        case ACTION_TYPES.LOGOUT_FAILURE:
            return {...state,errMess:action.payload};

        case ACTION_TYPES.REFRESH_TOKEN_SUCCESSFULL:
            return {...state,jwtToken:action.payload,isAuthenticated:true};
        
        case ACTION_TYPES.REFRESH_TOKEN_FAILURE:
            return{...state,errMess:action.payload};

        default:

            return state;

    }

};

