import * as ActionTypes from './ActionTypes';
import {baseUrl} from '../shared/baseUrl';
import * as SecureStore from 'expo-secure-store';
import { comments } from '../reducers/comments';
import * as VideoThumbnails from 'expo-video-thumbnails';

export const StoreJWTToken=(token)=>(dispatch)=>{
    console.log(token);
    SecureStore.isAvailableAsync().then((value)=>{
        if(value)
        {
            console.log("Async Storage is available on this device");
            SecureStore.setItemAsync('userJWT',JSON.stringify(
                {jwtToken:token}
            )).catch((error)=>{
                console.log(error);
            });
        }
        else{
            console.log("Async Storage is not available on this device");
        }
    }).catch((error)=>{
        console.log(error);
    });
};

export const getStoredJWTToken=()=>(dispatch)=>{
    SecureStore.getItemAsync('userJWT').then((token)=>{
        let jwttoken=JSON.parse(token);
        if(jwttoken!=null)
        {
            dispatch(verifyTokenValidity(jwttoken.jwtToken));
            return true;
        }
        else{
            dispatch(loginFailure("You are'nt authenticated, Please sign in"));
            return false;
        }
        
        
    }).catch((error)=>{
        console.log(error);
    });
};


export const removeStoredJWTToken=()=>(dispatch)=>{
    SecureStore.deleteItemAsync('userJWT').catch((error)=>{
        console.log(error);
    });
};

export const logoutUser=()=>(dispatch)=>{
    SecureStore.deleteItemAsync('userJWT').then(()=>{
        console.log("Logout Successful");
        dispatch(logoutSuccessfull());
    }).catch((error)=>{
        console.log(error);
        dispatch(logoutFailure());
    });
};

export const logoutSuccessfull=()=>({
    type:ActionTypes.LOGOUT_SUCCESSFULL
});

export const logoutFailure=(errMess)=>({
    type:ActionTypes.LOGOUT_FAILURE,
    payload:errMess
});


export const verifyTokenValidity=(token)=>(dispatch)=>{
    return fetch(baseUrl+'users/checkValidity/'+token).then((response)=>{
        if(response.ok)
        {
            return response;
        }
        else{
            var error= new Error('Error '+ response.status+ ':'+ response.statusText);
            error.response=response;
            throw error;
        }
    },(error)=>{
        var error= new Error('Error '+ response.status+ ':'+ response.statusText);
        error.response=response;
        throw error;
    }).then(
        response=>response.json()
    ).then(
        tokenObject=>dispatch(refreshTokenSuccessfull(tokenObject.token))
    ).catch(
        error=>dispatch(refreshTokenFailure(error.response.status))
    );
}

export const resetEditCommentErrorState=()=>({
    type:ActionTypes.RESET_EDIT_COMMENT_FAILURE_STATE
});

export const resetAddCommentErrorState=()=>({
    type:ActionTypes.RESET_ADD_COMMENT_FAILURE_STATE
});

export const refreshTokenSuccessfull=(token)=>({
    type:ActionTypes.REFRESH_TOKEN_SUCCESSFULL,
    payload:token
});

export const refreshTokenFailure=(errMess)=>({
    type:ActionTypes.REFRESH_TOKEN_FAILURE,
    payload:errMess
});


export const loginUser=(username,password)=>(dispatch)=>{
    
    dispatch(isLogginIn());
    console.log(username+" "+password);
    
    let credentialsObject={
        username:username,
        password:password
    };
    
    fetch(baseUrl+'users/login',{
        method:'POST',
        body:JSON.stringify(credentialsObject),
        headers:{
            'Content-Type':'application/json'
        },
        credentials:'same-origin'
    }).then((response)=>{
        
        if(response.ok)
        {
            return response;
        }
        else{
            var error= new Error('Error '+ response.status+ ':'+ response.statusText);
            error.response=response;
            throw error;
        }

    },(error)=>{
        
        var error= new Error('Error '+ response.status+ ':'+ response.statusText);
        error.response=response;
        throw error;
    
    }).then(

        response=> response.json()

    ).then(

        jwtToken=>{
            console.log(jwtToken),
            dispatch(loginSuccessfull(jwtToken.token))
        }

    ).catch((error)=>{

        console.log(error);
        dispatch(loginFailure(error))

    });
}

export const isLogginIn=()=>({
    type:ActionTypes.ATTEMPTING_TO_LOGIN,
})

export const loginSuccessfull=(jwtToken)=>({
    type:ActionTypes.LOGIN_SUCCESSFULL,
    payload:jwtToken
});

export const loginFailure=(errMess)=>({
    type:ActionTypes.LOGIN_FAILURE,
    payload:errMess
});

export const signupUser=(firstname,lastname,username,password)=>async(dispatch)=>{
    
    dispatch(isSigningUpUser());
    let newUser={
        "firstname":firstname,
        "lastname":lastname,
        "username":username,
        "password":password
    }

    console.log(JSON.stringify(newUser));

    return fetch(baseUrl+'users/signup',{
        method:'POST',
        body:JSON.stringify(newUser),
        headers:{
            'Content-Type':'application/json'
        },
        credentials:'same-origin'
    }).then((response)=>{
        if(response.ok)
        {
            return response;
        }
        else{
            var error= new Error('Error '+ response.status+ ':'+ response.statusText);
            error.response=response;
            throw error;
        }
    },(error)=>{
        var error= new Error('Error '+ response.status+ ':'+ response.statusText);
        error.response=response;
        throw error;
    
    }).then(
        response=>response.json()
    ).then(
        async data=>{
            await dispatch(signUpSucessfull(true));
            let loginData= await fetch(baseUrl+'users/login',{
                method:'POST',
                body:JSON.stringify({
                    "username":username,
                    "password":password
                }),
                headers:{
                    'Content-Type':'application/json'
                },
                credentials:'same-origin'
            });
            let loginResult= await loginData.json();
            
            await dispatch(isLogginIn());

            return loginResult;
        }
    ).then(
        loginResult=>dispatch(loginSuccessfull(loginResult.token))
    ).catch((error)=>{
        dispatch(signUpFailure(error.response.status))
    });

};

export const isSigningUpUser=()=>({
    type:ActionTypes.ATTEMPTING_TO_SIGNUP
});

export const signUpSucessfull=(status)=>({
    type:ActionTypes.SIGNUP_SUCCESSFULL,
    payload:status
});

export const signUpFailure=(errMess)=>({
    type:ActionTypes.SIGNUP_FAILURE,
    payload:errMess
});

export const fetchAllClicks=()=>async(dispatch)=>{
    dispatch(clicksLoading());

    let url=[];
    return fetch(baseUrl+'click/clickDownload').then((response)=>{
        console.log(response);
        if(response.ok)
        {
            return response;
        }
        else{
            var error= new Error('Error '+ response.status+ ': '+ response.statusText);
            error.response=response;
            throw error;
        }
    },(error)=>{
        var errMess= new Error(error.message)
        throw errMess;
    }).then(
        response=>response.json()
    ).then(
        async clicks=>{
            //dispatch(addClick(clicks))
            let videoUrlPromises=clicks.map(async(click)=>{
                let response= await fetch(baseUrl+'click/clickDownload/'+click._id);
                let signedUrl= await response.json();
                
                return signedUrl;
            });
        
            let result= await Promise.all(videoUrlPromises);
            console.log(result);
            dispatch(addAllClicksUrls(result));

            return clicks;
        }
    ).then(
        
        async clicks=>{

            let thumbnailUrlPromise=clicks.map(async(click)=>{
                let response= await fetch(baseUrl+'click/clickThumbnailDownload/'+click._id);
                let thumbnailSignedUrl=await response.json();

                return thumbnailSignedUrl;
            });

            let result= await Promise.all(thumbnailUrlPromise);
            console.log(result);
            dispatch(addAllClicksThumbnails(result));

            return clicks;

        }

    ).then(
        clicks=>dispatch(addClick(clicks))
    ).catch(
        error=>dispatch(addClicksFailed(error.response.status))
    );
};

export const addAllClicksUrls=(clicksUrls)=>({
    type:ActionTypes.GENERATE_ALL_CLICKS_URL_SUCCESSFULL,
    payload:clicksUrls
});

export const addAllClicksUrlsFailure=(errMess)=>({
    type:ActionTypes.GENERATE_ALL_CLICKS_URL_FAILURE,
    payload:errMess
});

export const addAllClicksThumbnails=(thumbnailUrls)=>({
    type:ActionTypes.GENERATE_CLICKS_THUMBNAILS_SUCCESSFULL,
    payload:thumbnailUrls
});

export const addAllClicksThumbnailsFailure=(errMess)=>({
    type:ActionTypes.GENERATE_CLICKS_THUMBNAILS_FAILURE,
    payload:errMess
});



export const fetchClickSignedUrl=(videoId)=>(dispatch)=>{
    console.log(videoId);
    return fetch(baseUrl+'click/clickDownload/'+videoId).then((response)=>{
        if(response.ok)
        {
            return response;
        }
        else{
            var error= new Error('Error '+ response.status+ ': '+ response.statusText);
            error.response=response;
            throw error;
        }           
    },(error)=>{
        var errMess= new Error(error.message)
        throw errMess;
    }).then(
        response=>response.json()
    ).then(
        signedUrl=>dispatch(addClicksUrl(signedUrl.url))
    ).catch(
        error=>dispatch(addClicksFailed(error.response.status))
    );
}

/*export const createClicksThumbnails=(videoIds)=>async(dispatch)=>{
    //console.log(videoIds);
    let videoUrlPromises=videoIds.map(async(videoId)=>{
        let response= await fetch(baseUrl+'click/clickDownload/'+videoId._id);
        let signedUrl= await response.json();
        
        return signedUrl;
    });

    let result= await Promise.all(videoUrlPromises);
    //let thumbnailUrls=[];
    result.map(async(result)=>{
        let clickThumbnailUrl= await VideoThumbnails.getThumbnailAsync(result.url,{
            time:2000
        });
        dispatch(addThumbnailUrl(clickThumbnailUrl));     
        console.log(clickThumbnailUrl);
    });
    
    //let thumbnailUrl= await Promise.all(thumbnailUrlsPromise);

    console.log(result);
    //console.log(thumbnailUrls);
}*/

export const clicksLoading=()=>({
    type:ActionTypes.LOAD_ALL_CLICKS
});

export const addClick=(click)=>({
    type:ActionTypes.ADD_ALL_CLICKS,
    payload:click
});

export const addClicksUrl=(url)=>({
    type:ActionTypes.ADD_ALL_CLICKS_URL,
    payload:url
});

export const addClicksFailed=(error)=>({
    type:ActionTypes.CLICKS_ADD_FAILED,
    payload:error
});


export const postNewClick=(title,description,category,fileUrl,token)=>(dispatch)=>{
    dispatch(newClickUploading());
    
    console.log(fileUrl);

    let newClickData={
        "title":title,
        "description":description,
        "category":category
    }

    //let fileType=fileUrl.split("/")[9].split('.')[1];
    let uploadTime= new Date();
    let fileName=uploadTime.getHours()+""+uploadTime.getMinutes()+""+uploadTime.getSeconds();


    let newClick={
        "uri":fileUrl,
        "type":'video/mp4',
        "name":`${fileName}.mp4`
    }

    console.log(newClick);
    console.log(newClickData);
    
    let formData= new FormData();
    formData.append('videoSnap',newClick);
    formData.append('document',JSON.stringify(newClickData));

    return fetch(baseUrl+'click/clickUpload',{
        method:'POST',
        body:formData,
        headers:{
            'Content-Type':'multipart/form-data',
            'Authorization':'Bearer '+token
        },
        credentials:'same-origin'
    }).then((response)=>{
        if(response.ok)
        {
            return response;
        }
        else{
            var error= new Error('Error '+ response.status+ ':'+ response.statusText);
            error.response=response;
            throw error;
        }
    },(error)=>{
        var errmess= new Error(error.message);
        throw errmess;
    }).then(
        response=>response.json()
    ).then(
        async postData=>{
            //console.log(postData)

            let response= await fetch(baseUrl+'click/clickDownload/'+postData.dbInfo._id);
            let signedUrl= await response.json();
            
            //console.log(signedUrl);

            return [postData,signedUrl];
        }
    ).then(
        
        async([postData,signedUrl])=>{

            let thumbnailUrl= await VideoThumbnails.getThumbnailAsync(signedUrl.url,{time:2000});
            let thumbnailData={
                "uri":thumbnailUrl.uri,
                "type":'image/jpg',
                "name":`${postData.dbInfo._id}thumbnail.jpg`
            };
    
            console.log(postData+" "+signedUrl+" "+thumbnailData);

            console.log(thumbnailData);
            let formData1= new FormData();
            formData1.append('thumbnail',thumbnailData);

            let thumbnailResponse= await fetch(baseUrl+'click/clickThumbnailUpload/'+postData.dbInfo._id,{
                method:'PUT',
                body:formData1,
                headers:{
                    'Content-Type':'multipart/form-data',
                    'Authorization':'Bearer '+token
                },
                credentials:`same-origin`});

            let thumbnailResult= await thumbnailResponse.json();
            console.log(thumbnailResult);
            
            return[postData,signedUrl];
        }

    ).then(
        async([postData,signedUrl])=>{
            let signedThumbnailUrlResponse= await fetch(baseUrl+'click/clickThumbnailDownload/'+postData.dbInfo._id);
            let signedThumbnailUrlResult= await signedThumbnailUrlResponse.json();

            await dispatch(updateAllClicksThumbnailsUrl(signedThumbnailUrlResult));
            await dispatch(updateAllClicksUrl(signedUrl));
            await dispatch(updateAllClicks(postData.dbInfo));
        }
    ).catch((error)=>{
        console.log(error);
    });


}

 /*async signedUrl=>{
            let thumbnailUrl= await VideoThumbnails.getThumbnailAsync(signedUrl.url,{time:2000});
            dispatch(updateAllClicksThumbnailsUrl(thumbnailUrl));
        }*/

export const newClickUploading=()=>({
    type:ActionTypes.UPLOADING_NEW_CLICK
});

export const updateAllClicks=(newClick)=>({
    type:ActionTypes.UPDATE_ALL_CLICKS,
    payload:newClick
});

export const updateAllClicksUrl=(newClickUrl)=>({
    type:ActionTypes.UPDATE_ALL_CLICKS_URL,
    payload:newClickUrl
});

export const updateAllClicksThumbnailsUrl=(newThumbnailUrl)=>({
    type:ActionTypes.UPDATE_ALL_CLICKS_THUMBNAILS_URLS,
    payload:newThumbnailUrl
});


export const fetchAllComments=(videoId)=>(dispatch)=>{
    dispatch(loadingComments());
    
    return fetch(baseUrl+'click/clickDownload/'+videoId+'/comments').then((response)=>{
        if(response.ok)
        {
            return response;
        }
        else{
            var error= new Error('Error '+ response.status+ ':'+ response.statusText);
            error.response=response;
            throw error;
        }
    },(error)=>{
        var errMess= new Error(error.message)
        throw errMess;
    }).then(
        response=>response.json()
    ).then(
        allComments=>dispatch(addAllComments(allComments))
    ).catch(error=>addCommentsFailed(error.response.status));

};

export const loadingComments=()=>({
    type:ActionTypes.LOAD_ALL_COMMENTS
});

export const addAllComments=(comments)=>({
    type:ActionTypes.ADD_ALL_COMMENTS,
    payload:comments
});

export const addCommentsFailed=(errMess)=>({
    type:ActionTypes.COMMENTS_ADD_FAILED,
    payload:errMess
});

export const addComment=(videoId,comment,rating,token)=>(dispatch)=>{
    dispatch(startEditingComment());
    console.log(videoId+" "+comment+" "+rating+" "+token);
    let commentObj={
        "comment":comment,
        "rating":rating
    };

    return fetch(baseUrl+'click/clickDownload/'+videoId+'/comments',{
        method:'POST',
        body:JSON.stringify(commentObj),
        headers:{
            'Content-Type':'Application/json',
            'Authorization':'Bearer '+token
        },
        credentials:`same-origin`
    }).then((response)=>{
        if(response.ok)
        {
            return response;
        }
        else{
            var error= new Error('Error '+ response.status+ ':'+ response.statusText);
            error.response=response;
            throw error;
        }
    },(error)=>{
        var errMess= new Error(error.message)
        throw errMess;
    }).then(
        response=>response.json()
    ).then(
        updatedComments=>dispatch(addCommentSuccessfull(updatedComments))
    ).catch(
        error=>dispatch(addCommentFailure(error.response.status)));
};



export const startAddingComment=()=>({
    type:ActionTypes.START_ADDING_COMMENT
});

export const addCommentSuccessfull=(comments)=>({
    type:ActionTypes.ADD_COMMENT_SUCCESSFULL,
    payload:comments
});

export const addCommentFailure=(errMess)=>({
    type:ActionTypes.ADD_COMMENT_FAILURE,
    payload:errMess
});


export const editComment=(videoId,commentId,newComment,newRating,token)=>(dispatch)=>{
    console.log(videoId+" "+commentId+" "+newComment+" "+newRating+" "+token);
    
    let commentBody={
        "comment":newComment,
        "rating":newRating
    }

    console.log(JSON.stringify(commentBody));
    
    dispatch(startEditingComment());

    return fetch(baseUrl+'click/clickDownload/'+videoId+'/comments/'+commentId,{
        method:'PUT',
        body:JSON.stringify(commentBody),
        headers:{
            'Content-Type':'application/json',
            'Authorization':'Bearer '+token
        },
        credentials:'same-origin'

    }).then((response)=>{
        if(response.ok)
        {
            return response;
        }
        else{
            var error= new Error('Error '+ response.status+ ':'+ response.statusText);
            error.response=response;
            throw error;
        }
    },(error)=>{
        var errMess= new Error(error.message)
        throw errMess;
    }).then(
        response=>response.json()
    ).then(
        allComments=>dispatch(editingCommentSuccessfull(allComments))
    ).catch(
        error=>dispatch(editingCommentFailure(error.response.status)));
};



export const startEditingComment=()=>({
    type:ActionTypes.START_EDIT_COMMENT
});

export const editingCommentSuccessfull=(comments)=>({
    type:ActionTypes.EDIT_COMMENT_SUCCESSFULL,
    payload:comments
});

export const editingCommentFailure=(errMess)=>({
    type:ActionTypes.EDIT_COMMENT_FAILURE,
    payload:errMess
});


export const fetchAllFavourites=(token)=>(dispatch)=>{
    dispatch(loadAllFavourites());
    return fetch(baseUrl+'favourite/userFavourite',{
        method:'GET',
        headers:{
            'Content-Type':'Application/json',
            'Authorization':'Bearer '+token
        },
        credentials:'same-origin'
    }).then((response)=>{
        if(response.ok)
        {
            return response;
        }
        else{
            var error= new Error('Error '+ response.status+ ':'+ response.statusText);
            error.response=response;
            throw error;
        }
    },(error)=>{
        var errMess= new Error(error.message)
        throw errMess;
    }).then(
        response=>response.json()
    ).then(
        allFavourites=>dispatch(addAllFavourites(allFavourites.favourite.videos))
    ).catch(
        error=>dispatch(addFavouritesFailure(error.response.status))
    );
};

export const loadAllFavourites=()=>({
    type:ActionTypes.LOAD_ALL_FAVOURITES
});

export const addAllFavourites=(favourites)=>({
    type:ActionTypes.ADD_FAVOURITES_SUCCESSFULL,
    payload:favourites
});

export const addFavouritesFailure=(errMess)=>({
    type:ActionTypes.ADD_FAVOURITES_FAILURE,
    payload:errMess
});


export const fetchClickFavouriteStatus=(videoId,token)=>(dispatch)=>{
    return fetch(baseUrl+'favourite/checkFavourite/'+videoId,{
        method:'GET',
        headers:{
            'Content-Type':'Application/json',
            'Authorization':'Bearer '+token
        },
        credentials:'same-origin'
    }).then((response)=>{
        if(response.ok)
        {
            return response;
        }
        else{
            var error= new Error('Error '+ response.status+ ':'+ response.statusText);
            error.response=response;
            throw error;
        }
    },(error)=>{
        var errMess= new Error(error.message)
        throw errMess;
    }).then(
        response=>response.json()
    ).then(
        status=>dispatch(checkClickFavouriteStatus(status.status))
    ).catch(
        error=>dispatch(checkClickFavouriteFailure(error.response.status))
    );
};

export const checkClickFavouriteStatus=(status)=>({
    type:ActionTypes.CHECK_FAVOURITE_SUCCESSFULL,
    payload:status
});

export const checkClickFavouriteFailure=(errMess)=>({
    type:ActionTypes.CHECK_FAVOURITE_FAILURE,
    payload:errMess
});

export const addClickToFavourites=(token,videoId)=>(dispatch)=>{
    
    console.log(token+" "+videoId);
    
    return fetch(baseUrl+'favourite/addFavourite/'+videoId,{
        method:'POST',
        headers:{
            'Authorization':'Bearer '+token
        },
        credentials:'same-origin'
    }).then((response)=>{
        if(response.ok)
        {
            return response;
        }
        else{
            var error= new Error('Error '+ response.status+ ':'+ response.statusText);
            error.response=response;
            throw error;
        }
    },(error)=>{
        var errMess= new Error(error.message)
        throw errMess;
    }).then(
        response=>response.json()
    ).then(
        newFavourites=>dispatch(addClickToFavourite(newFavourites.favourite.videos))
    ).catch(
        error=>dispatch(addClickToFavouriteFailure(error.response.status))
    );
};


export const addClickToFavourite=(favourites)=>({
    type:ActionTypes.MAKE_FAVOURITE_SUCCESSFULL,
    payload:favourites
});

export const addClickToFavouriteFailure=(errMess)=>({
    type:ActionTypes.MAKE_FAVOURITE_FAILURE,
    payload:errMess
});


export const removeClickFromFavourites=(token,videoId)=>(dispatch)=>{
    console.log(token+" "+videoId);

    return fetch(baseUrl+'favourite/removeFavourite/'+videoId,{
        method:'DELETE',
        headers:{
            'Authorization':'Bearer '+token
        },
        credentials:'same-origin'
    }).then((response)=>{
        if(response.ok)
        {
            return response;
        }
        else{
            var error= new Error('Error '+ response.status+ ':'+ response.statusText);
            error.response=response;
            throw error;
        }
    },(error)=>{
        var errMess= new Error(error.message)
        throw errMess;
    }).then(
        response=>response.json()
    ).then(
        modifiedFavourites=>dispatch(removeClickFromFavourite(modifiedFavourites.favourite.videos))
    ).catch(
        error=>dispatch(removeClickFromFavourite(error.response.status))
    );
};




export const removeClickFromFavourite=(favourites)=>({
    type:ActionTypes.REMOVE_FAVOURITE_SUCCESSFULL,
    payload:favourites
});


export const removeClickFromFavouriteFailure=(errMess)=>({
    type:ActionTypes.REMOVE_FAVOURITE_FAILURE,
    payload:errMess
});