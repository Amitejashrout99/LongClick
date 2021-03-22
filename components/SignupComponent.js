import React,{useState,useEffect,useRef} from 'react';
import {ScrollView,Text,StyleSheet} from 'react-native';
import {useSelector,useDispatch} from 'react-redux';
import {Input,Button} from 'react-native-elements';
import Icon from 'react-native-vector-icons/FontAwesome';
import {signupUser,StoreJWTToken} from '../redux/ActionCreators';
import * as Notifications from 'expo-notifications';



const Signup=(props)=>{

    let users= useSelector((state)=>state.users);
    let dispatch= useDispatch();

    const [firstname,setFirstname]=useState("");
    const [firstnameerror,setFirstnameerror]=useState("");
    const [firstnamedirty,setFirstnamedirty]=useState(false);
    const [lastname,setLastname]=useState("");
    const [lastnameerror,setLastnameerror]=useState("");
    const [lastnamedirty,setLastnamedirty]=useState(false);
    const [username,setUsername]= useState("");
    const [usernameerror,setUsernameerror]=useState("");
    const [usernamedirty,setUsernamedirty]=useState(false);
    const [password,setPassword]= useState("");
    const [passworderror,setPassworderror]=useState("");
    const [passwordnamedirty,setPasswordnamedirty]=useState(false);
    const [userjwt,setUserjwt]= useState(users.jwtToken);
    const [disabled,setDisabled]=useState(true);
    //console.log(users);



    useEffect(()=>{
        Notifications.setNotificationHandler({
            handleNotification:async()=>({
                shouldShowAlert: true,
                shouldPlaySound: true,
                shouldSetBadge: false
            }),
            handleSuccess:async()=>{
                console.log("Signup Notification triggered");
            }
        });
    },[]);

    useEffect(()=>{

        if(users.isSigningUp){
            props.navigation.setOptions({
                title:"Signing You Up...."
            });
        }

        if(users.hasSignedUp)
        {
            presentSignupSucessfullNotification();
        }
        if(users.isLogginIn)
        {
            props.navigation.setOptions({
                title:"Logging You In...."
            });
        }
        if(users.isAuthenticated && users.jwtToken!=null && users.jwtToken!=userjwt)
        {
            presentLoginSucessfullNotification();
            setUserjwt(users.jwtToken);
            dispatch(StoreJWTToken(users.jwtToken));
            props.navigation.setOptions({
                title:"Sign Up"
            });
            props.navigation.navigate('Home');

        }



    },[users.isSigningUp,users.hasSignedUp,users.isAuthenticated,users.isLogginIn,users.jwtToken])

    useEffect(()=>{
        if(firstname!="" && lastname!="" && username!="" && password!="")
        {
            setDisabled(false);
        }
    },[firstname,lastname,username,password]);

    const displayState=()=>{
        console.log(firstname+" "+lastname+" "+username+" "+password);
        dispatch(signupUser(firstname,lastname,username,password));
    }

    const obtainNotificationPermission=async()=>{
        let permission = await Notifications.getPermissionsAsync();
        console.log(permission);
        if(permission.status!=='granted')
        {
            permission= await Notifications.requestPermissionsAsync();
            console.log(permission);
            if(permission.status!=='granted')
            {
                Alert.alert('Permission not granted to show notification');
            }
        }
        return permission;
    }

    const presentSignupSucessfullNotification=async()=>{
        await obtainNotificationPermission();
        Notifications.scheduleNotificationAsync({
            content:{
                title:"Signup Successfull",
                body:'You have successfully signed-up'
            },
            trigger:null
        });
    }

    const presentLoginSucessfullNotification=async()=>{
        await obtainNotificationPermission();
        Notifications.scheduleNotificationAsync({
            content:{
                title:"Login Successfull",
                body:'You have successfully logged in'
            },
            trigger:null
        });
    }

    const validation=(type,value)=>{
        switch(type)
        {
            case 'firstname':
                if(value=='')
                {
                    setFirstnameerror("First Name field cannot be empty");
                    setDisabled(true);
                }
                else if(!isNaN(value)){
                    setFirstnameerror("First Name cannot contain numbers");
                    setDisabled(true);
                }
                else{
                    setFirstnameerror("");
                };
                break;
            case 'lastname':
                if(value=='')
                {
                    setLastnameerror("Last Name field cannot be empty");
                    setDisabled(true);
                }
                else if(!isNaN(value)){
                    setLastnameerror("Last Name cannot contain numbers");
                    setDisabled(true);
                }
                else{
                    setLastnameerror("");
                };
                break;
            case 'username':
                if(value=='')
                {
                    setUsernameerror("Username field cannot be left blank");
                    setDisabled(true);
                }
                else{
                    setUsernameerror("");
                }
                break;
            case 'password':
                if(value=='')
                {
                    setPassworderror("Password field cannot be left blank");
                    setDisabled(true);
                }
                else{
                    setPassworderror("");
                }
                break;
            default:
                setDisabled(true);
                
        }
    }



    return(
        <ScrollView contentContainerStyle={styles.container}>
            <Input
                placeholder="Firstname"
                label="Fisrt Name" 
                labelStyle={{color:"#512AD8"}}
                value={firstname}
                onChangeText={(value)=>{
                    setFirstname(value);
                    validation('firstname',value);
                }}
                onFocus={()=>setFirstnamedirty(true)}
                onBlur={()=>validation('firstname',firstname)}
                //onBlur={(value)=>validation('firstname',value)}
                errorMessage={firstnameerror}
                errorStyle={{color:`red`}}
            />
            <Input
                placeholder="Lastname"
                label="Last Name" 
                labelStyle={{color:"#512AD8"}}
                value={lastname}
                onChangeText={(value)=>{
                    setLastname(value);
                    validation('lastname',value);
                }}
                onFocus={()=>setLastnamedirty(true)}
                onBlur={()=>validation('lastname',lastname)}
                errorMessage={lastnameerror}
                errorStyle={{color:`red`}}
            />
            <Input
                placeholder="Username"
                label="Username" 
                labelStyle={{color:"#512AD8"}}
                value={username}
                onChangeText={(value)=>{
                    setUsername(value);
                    validation('username',value);
                }}
                onFocus={()=>setUsernamedirty(true)}
                onBlur={()=>validation('username',username)}
                errorMessage={usernameerror}
                errorStyle={{color:`red`}}
            />
            <Input
                placeholder="Password"
                label="Password" 
                labelStyle={{color:"#512AD8"}}
                value={password}
                onChangeText={(value)=>{
                    setPassword(value);
                    validation('password',value);
                }}
                onFocus={()=>setPasswordnamedirty(true)}
                onBlur={()=>validation('password',password)}
                secureTextEntry={true}
                errorMessage={passworderror}
                errorStyle={{color:`red`}}
            />
            <Button
                type="outline"
                title="Sign-Up"
                onPress={()=>displayState()}
                buttonStyle={{
                    width:200,
                    borderRadius:10,
                    borderWidth:2,
                    borderColor:"#512AD8",
                }}
                titleStyle={{
                    color:"#512AD8",
                    fontWeight:`bold`
                }}
                disabled={disabled}
                disabledStyle={{
                    borderColor:"#808080"
                }}
            />

        </ScrollView>
    );
}

const styles= StyleSheet.create({
    container:{
        flex:1,
        flexDirection:'column',
        alignItems:`center`,
        justifyContent:`center`,
    }
})

export default Signup;