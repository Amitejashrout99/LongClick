import React,{Component} from 'react';
import {ScrollView,Text,StyleSheet,View,ActivityIndicator} from 'react-native';
import {Input,Button,CheckBox} from 'react-native-elements';
import Icon from 'react-native-vector-icons/FontAwesome';
import {connect} from 'react-redux';
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

function StoreToken({isAuthenticated,token,isRememberMe,storeToken,removeStoredToken})
{
    //console.log(isAuthenticated+" "+token+" "+isRememberMe);
    if(isAuthenticated && isRememberMe)
    {
        storeToken(token);
        return(
            <View style={{marginTop:20}}>
                <Text style={{color:"#512AD8"}}>You have been successfully logged in</Text>
                <Text style={{color:"#512AD8"}}>No Need to Login again</Text>
            </View>
        )
    }
    else if(isAuthenticated && !isRememberMe)
    {
        removeStoredToken();
        return(
            <View style={{marginTop:20}}>
                <Text style={{color:"#512AD8"}}>You have been successfully Logged in</Text>
            </View>
        )
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
        this.props.getStoredJWTToken();
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
                <StoreToken 
                    isAuthenticated={this.props.users.isAuthenticated} 
                    token={this.props.users.jwtToken}
                    isRememberMe={this.state.remember}
                    storeToken={this.props.StoreJWTToken}
                    removeStoredToken={this.props.removeStoredJWTToken} 
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