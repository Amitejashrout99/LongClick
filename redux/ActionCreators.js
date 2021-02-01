import * as ActionTypes from './ActionTypes';
import {baseUrl} from '../shared/baseUrl';


export const fetchAllClicks=()=>(dispatch)=>{
    dispatch(clicksLoading());

    let url=[];
    return fetch(baseUrl+'downloadSnap').then((response)=>{
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
        clicks=>{
            dispatch(addClicks(clicks)),
            clicks.map((click)=>{
                fetch(baseUrl+'downloadSnap/'+click._id).then((response)=>{
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
                    signedUrl=>url.push(signedUrl.url)
                ).catch(
                    error=>dispatch(addClicksFailed(error))
                );
            }),

            dispatch(addClicksUrl(url))
        }
        
        
    ).catch(
        error=>dispatch(addClicksFailed(error))
    );
};


export const postNewClick=(name,title,fileUrl)=>(dispatch)=>{
    dispatch(newClickUploading());
    
    let newClickData={
        "name":name,
        "title":title,
    }

    let fileType=fileUrl.split("/")[9].split('.')[1];
    let fileName="Ravi"+Math.floor(Math.random()*100);


    let newClick={
        "uri":fileUrl,
        "type":'video/mp4',
        "name":`${fileName}.${fileType}`
    }

    console.log(newClick);
    console.log(newClickData);
    
    let formData= new FormData();
    formData.append('videoSnap',newClick);
    formData.append('document',JSON.stringify(newClickData));

    return fetch(baseUrl+'uploadSnap',{
        method:'POST',
        body:formData,
        headers:{
            'Content-Type':'multipart/form-data'
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
        postData=>{
            console.log(postData),
            dispatch(updateAllClicks(postData.dbInfo)),
            fetch(baseUrl+'downloadSnap/'+postData.dbInfo._id).then((response)=>{
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
                newClickSignedUrl=>dispatch(updateAllClicksUrl(newClickSignedUrl.url))
            ).catch((error)=>{
                console.log(error)
            })
        }
    ).catch((error)=>{
        console.log(error);
    });


}


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



export const clicksLoading=()=>({
    type:ActionTypes.LOAD_ALL_CLICKS
});

export const addClicks=(clicks)=>({
    type:ActionTypes.ADD_ALL_CLICKS,
    payload:clicks
});

export const addClicksUrl=(url)=>({
    type:ActionTypes.ADD_ALL_CLICKS_URL,
    payload:url
});

export const addClicksFailed=(error)=>({
    type:ActionTypes.CLICKS_ADD_FAILED,
    payload:error
});


