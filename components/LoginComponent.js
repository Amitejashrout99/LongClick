import React,{Component} from 'react';
import {ScrollView,Text,StyleSheet,View,ActivityIndicator} from 'react-native';
import {Input,Button,CheckBox} from 'react-native-elements';
import Icon from 'react-native-vector-icons/FontAwesome';
import {connect} from 'react-redux';
import * as Notifications from 'expo-notifications';
import {loginUser,StoreJWTToken,getStoredJWTToken,removeStoredJWTToken} from '../redux/ActionCreators';

const mapStateToProps= state =>{
    return{
        users:state.users,
    };
};

const mapDispatchToProps= dispatch=>({
    
    loginUser:(username,password)=>dispatch(loginUser(username,password)),
    StoreJWTToken:(token)=>dispatch(StoreJWTToken(token)),
    getStoredJWTToken:()=>dispatch(getStoredJWTToken()),
    removeStoredJWTToken:()=>dispatch(removeStoredJWTToken())

});

function RenderLoader({status})
{
    console.log(status);
    if(status)
    {
        return(
            <View style={{ alignItems:`center`,justifyContent:`center`,flex:1,margin:20}}>
                <ActivityIndicator size="large" color="#512DA8"/>
                <Text style={styles.loadingText}>Logging You In ....</Text>
            </View>
        );
    }
    else{
        return(
            <View>

            </View>
        )
    }
}


class Login extends Component{
    
    constructor(props)
    {
        super(props);
        this.state={
            username:"",
            password:"",
            remember:false,
            disabled:true,
            isAuthenticated:false
        }
    }


    handleLogin=()=>{
            
        this.props.loginUser(this.state.username,this.state.password);
        
        
    }

    componentDidMount()
    {
        Notifications.setNotificationHandler({
            handleNotification:async()=>({
                shouldShowAlert: true,
                shouldPlaySound: true,
                shouldSetBadge: false
            }),
            handleSuccess:async()=>{
                console.log("Login Notification triggered");
            }
        });
        this.props.getStoredJWTToken();

    }

    async obtainNotificationPermission(){
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

    async presentLoginRememberMeSuccessfullNotification()
    {
        await this.obtainNotificationPermission;
        Notifications.scheduleNotificationAsync({
            content:{
                title:"Authentication Successfull",
                body:'Logged In Successfully'
            },
            trigger:null
        });
    }

    async presentLoginNotRememberMeSuccessfullNotification()
    {
        await this.obtainNotificationPermission;
        Notifications.scheduleNotificationAsync({
            content:{
                title:"Authentication Successfull",
                body:'You have been successfully logged in'
            },
            trigger:null
        });
    }



    componentDidUpdate(prevProps,prevState)
    {
        if(prevProps.users.isAuthenticated!=this.props.users.isAuthenticated && this.state.remember && this.props.users.isAuthenticated)
        {
            this.props.StoreJWTToken(this.props.users.jwtToken);
            this.presentLoginRememberMeSuccessfullNotification();
        }
        if(prevProps.users.isAuthenticated!=this.props.users.isAuthenticated && !this.state.remember && this.props.users.isAuthenticated)
        {
            this.props.removeStoredJWTToken();
            this.presentLoginNotRememberMeSuccessfullNotification();
        }
    }



    render()
    {
        return(
            <View style={styles.test}>
                <RenderLoader status={this.props.users.isLogginIn} />
                <Input 
                    placeholder="Username..." 
                    label="Username" 
                    labelStyle={{color:"#512AD8"}}
                    value={this.state.username}
                    onChangeText={(value)=>{
                        if(value=='' || this.state.password=='')
                        {
                            this.setState({
                                disabled:true,
                                username:value
                            });
                        }
                        else if(value=='' && this.state.password!='')
                        {
                            this.setState({
                                disabled:true,
                                username:value
                            });
                        }
                        else{
                            this.setState({
                                disabled:false,
                                username:value
                            });
                        }
                    }}
                />
                <Input 
                    placeholder="Password..." 
                    label="Password" 
                    labelStyle={{color:"#512AD8"}} 
                    secureTextEntry={true}
                    value={this.state.password}
                    onChangeText={(value)=>{
                        if(value=='' || this.state.username=='')
                        {
                            this.setState({
                                disabled:true,
                                password:value
                            });
                        }
                        else if(value=='' && this.state.username!='')
                        {
                            this.setState({
                                disabled:true,
                                password:value
                            });
                        }
                        else{
                            this.setState({
                                disabled:false,
                                password:value
                            });
                        }
                    }}
                />
                <CheckBox
                    title="Remember Me" 
                    checked={this.state.remember}
                    center
                    onPress={()=>this.setState({remember:!this.state.remember})}
                    containerStyle={{
                        margin:20,
                        backgroundColor:null
                    }}
                />
                <Button 
                    icon={<Icon name="sign-in" size={24} color="#FFFFFF" />}
                    title="Login"  
                    raised
                    iconRight
                    type="solid"
                    buttonStyle={{
                        backgroundColor:"#512AD8",
                        width:200,
                        borderRadius:10
                    }}
                    disabled={this.state.disabled}
                    onPress={()=>this.handleLogin()}
                />
            </View>
        );
    }
}

const styles= StyleSheet.create({
    test:{
        alignItems:`center`,
        justifyContent:`center`,
        flex:1
    },
    loadingText:{
        color:`#512DAB`,
        fontSize:14,
        fontWeight:'bold',
        marginTop:20
    }
})

export default  connect(mapStateToProps,mapDispatchToProps)(Login);