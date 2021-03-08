import React,{Component} from 'react';
import {Card,Button,Input} from 'react-native-elements';
import {ScrollView,Text,StyleSheet,View,Dimensions,ActivityIndicator,Alert} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import * as Permissions from 'expo-permissions';
import * as Notifications from 'expo-notifications';
import {Video,Audio} from 'expo-av';
import Icon from 'react-native-vector-icons/FontAwesome';
import {postNewClick,getStoredJWTToken} from '../redux/ActionCreators';
import {connect} from 'react-redux';


const mapStateToProps= state=>{
    return{
        clicks:state.clicks,
        users:state.users
    }
};

const mapDispatchToProps = dispatch=>({
    postNewClick:(title,description,category,fileUrl,token)=>dispatch(postNewClick(title,description,category,fileUrl,token)),
    getStoredJWTToken:()=>dispatch(getStoredJWTToken())
});




function RenderLoader({status})
{
    console.log(status);
    if(status)
    {
        return(
            <View style={{ alignItems:`center`,justifyContent:`center`,flex:1,margin:20}}>
                <ActivityIndicator size="large" color="#512DA8"/>
                <Text style={styles.loadingText}>Uploading Click ....</Text>
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

function RenderAuthenticationStatus({status})
{
    if(!status)
    {
        return(
            <View style={{flex:1,alignItems:`center`,justifyContent:`center`,marginTop:20}}>
                <Text style={{color:"#512AD8"}}>You need to be authenticated for uploading new click</Text>
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

class Upload extends Component{

    constructor(props)
    {
        super(props);
        this.state={
            videoUrl:'',
            title:"",
            description:"",
            category:"",
            uploadClickButtonStatus:true
        }

    }



    componentDidMount(){
        
        Notifications.setNotificationHandler({
            handleNotification:async()=>({
                shouldShowAlert: true,
                shouldPlaySound: true,
                shouldSetBadge: false
            }),
            handleSuccess:async()=>{
                console.log("Notification triggered");
            }
        });

        this.props.getStoredJWTToken();

    }

    componentDidUpdate(prevProps,prevState){
        if(this.props.users.isAuthenticated)
        {
            this.props.navigation.setOptions({
                headerRight:()=>(
                    <Icon
                        name="sign-out"
                        size={24}
                        color="#FFFFFF"
                        onPress={()=>Alert.alert(
                            "Logout",
                            "Are you sure to logout ?,This will remove all the stored credentials",
                            [
                                {
                                    text:'Cancel', 
                                    onPress:()=>{console.log("Not Deleted")},
                                    style:'cancel'
                                },
                                {
                                    text:'Logout',
                                    onPress:()=>{
                                        this.props.logoutUser();
                                        this.presentLogoutSuccessfullNotification();
                                    },
                                    style:"destructive"
                                }
                            ]
                        )} 
                    />
                )
            });
        }
        if(!this.props.users.isAuthenticated)
        {
            this.props.navigation.setOptions({
                headerRight:null
            });
        }
    }


    getVideoFromCamera= async()=>{
        const cameraPermission= await Permissions.askAsync(Permissions.CAMERA);
        const cameraRollPermission= await Permissions.askAsync(Permissions.MEDIA_LIBRARY);
        console.log(cameraPermission);
        if(cameraPermission.status==='granted' && cameraRollPermission.status==='granted')
        {
            let capturedVideo= await ImagePicker.launchCameraAsync({
                mediaTypes:ImagePicker.MediaTypeOptions.Videos,
                videoMaxDuration:20,
            });


            

            console.log(capturedVideo);
            if(!capturedVideo.cancelled)
            {
                this.setState({videoUrl:capturedVideo.uri});
            }
        }
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

    async presentLocalNotification()
    {
        console.log("Going");
        await this.obtainNotificationPermission;
        Notifications.scheduleNotificationAsync({
            content:{
                title:"Your New Click has been uploaded",
                body:'You can check your click in My clicks'
            },
            trigger:null
        });
    }

    postNewClick=()=>{
        this.props.postNewClick(this.state.title,this.state.description,this.state.category,this.state.videoUrl,this.props.users.jwtToken);
    }

    testMethod=()=>{
        alert(JSON.stringify(this.state));
    }


    render(){
        
        if(this.state.videoUrl==='')
        {
            return(
                <ScrollView>
                    <Card>
                        <Card.Title>Click Upload</Card.Title>
                        <Card.Divider/>
                        <Text>Please Click on the upload Video Button to upload a video</Text>
                        <Text>{this.state.data}</Text>
                            <Button 
                                title="Upload Click" 
                                raised 
                                icon={
                                        <Icon
                                            name="upload"
                                            size={24}
                                            color="black"
                                        />
                                }

                                buttonStyle={styles.buttonStyle}
                                onPress={()=>this.getVideoFromCamera()}
                            />
                    </Card>
                    <RenderAuthenticationStatus status={this.props.users.isAuthenticated}/>
                </ScrollView>
            );
        }
        else{
            
            return(
                
                <ScrollView>
                    <RenderLoader 
                        status={this.props.clicks.isUploading}
                    />
                    <Card>
                        <Card.Title>Click Preview</Card.Title>
                        <Card.Divider/>
                        <View style={styles.video}>
                            <Video
                                source={{uri:this.state.videoUrl}}
                                shouldPlay
                                isLooping
                                rate={1.0}
                                volume={0.0}
                                resizeMode="contain"
                                style={{width:width,height:400,margin:10}}
                            />
                        </View>
                    </Card>
                    <Card>
                        <Card.Title>Provide Click Details</Card.Title>
                        <Card.Divider/>
                        <View style={styles.inputItems}>
                            <Input label="Title" labelStyle={{color:"#512AD8"}} placeholder="Title of the click"
                                onChangeText={(value)=>{
                                    if(value=='')
                                    {
                                        this.setState({
                                            uploadClickButtonStatus:true,
                                            title:value
                                        });
                                    }
                                    else{
                                        this.setState({
                                            title:value,
                                            uploadClickButtonStatus:false
                                        });
                                    }
                                    
                                }}
                                value={this.state.title}
                            />
                            <Input label="Description" labelStyle={{color:"#512AD8"}} placeholder="Description of the click"
                                onChangeText={(value)=>{
                                    if(value=='')
                                    {
                                        this.setState({
                                            uploadClickButtonStatus:true,
                                            description:value
                                        });
                                    }
                                    else{
                                        this.setState({
                                            description:value,
                                            uploadClickButtonStatus:false
                                        });
                                    }
                                    
                                }}
                                value={this.state.description}
                            />
                            <Input label="Category" labelStyle={{color:"#512AD8"}} placeholder="Provide a category for the click"
                                onChangeText={(value)=>{
                                    if(value=='')
                                    {
                                        this.setState({
                                            uploadClickButtonStatus:true,
                                            category:value
                                        });
                                    }
                                    else{
                                        this.setState({
                                            category:value,
                                            uploadClickButtonStatus:false
                                        });
                                    }
                                    
                                }}
                                value={this.state.category}
                            />
                        </View>
                    </Card>
                    <Card>
                        <Button 
                            title="Retake Click" 
                            raised 
                            icon={
                                    <Icon
                                        name="upload"
                                        size={24}
                                        color="black"
                                    />
                            }
                            buttonStyle={styles.buttonStyle}    
                            onPress={()=>this.getVideoFromCamera()}
                        />
                        <Button 
                            title="Upload Click" 
                            raised
                            disabled={this.state.uploadClickButtonStatus && !this.props.users.isAuthenticated}
                            icon={
                                <Icon
                                    name="upload"
                                    size={24}
                                    color="black"
                                />
                            }
                            buttonStyle={styles.buttonStyle}
                            onPress={()=>this.postNewClick()}
                        />
                    </Card>
                    <RenderAuthenticationStatus status={this.props.users.isAuthenticated}/>
                </ScrollView>
            )
        }
    }
}

let width= Dimensions.get('window').width;
const styles= StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
    video:{
        flex:1,
        alignItems:'center',
        justifyContent:'center'
    },
    buttonStyle:{
        marginBottom: 20,
        backgroundColor:"#512AD8"
    },
    loadingView:{
        alignItems:`center`,
        justifyContent:`center`,
        flex:1,
        margin:20
    },
    loadingText:{
        color:`#512DAB`,
        fontSize:14,
        fontWeight:'bold',
        marginTop:20
    },
    inputItems:{
        flex:1,
        alignItems:'center',
        justifyContent:'center',
        margin:5
    }
});

export default connect(mapStateToProps,mapDispatchToProps)(Upload);