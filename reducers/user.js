import * as ACTION_TYPES from '../redux/ActionTypes';

export const users=(state={

    isLogginIn:false,
    isSigningUp:false,
    hasSignedUp:false,
    errMess:null,
    jwtToken:null,
    isAuthenticated:false,
},action)=>{

    switch(action.type)
    {
        case ACTION_TYPES.ATTEMPTING_TO_LOGIN:
            return{...state,isLogginIn:true,errMess:null,jwtToken:null,isAuthenticated:false,hasSignedUp:false};
        
        case ACTION_TYPES.LOGIN_SUCCESSFULL:
            return{...state,isLogginIn:false,errMess:null,jwtToken:action.payload,isAuthenticated:true,hasSignedUp:false};

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

        case ACTION_TYPES.ATTEMPTING_TO_SIGNUP:
            return{...state,isSigningUp:true};
        
        case ACTION_TYPES.SIGNUP_SUCCESSFULL:
            return{...state,isSigningUp:false,hasSignedUp:action.payload};
        
        case ACTION_TYPES.SIGNUP_FAILURE:
            return{...state,errMess:action.payload,isSigningUp:false};


        default:

            return state;

    }

};

