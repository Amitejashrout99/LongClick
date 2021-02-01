import React,{Component} from 'react';
import {Card,Button} from 'react-native-elements';
import {ScrollView,Text,StyleSheet,View,Dimensions,ActivityIndicator} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import * as Permissions from 'expo-permissions';
import * as Notifications from 'expo-notifications';
import {Video,Audio} from 'expo-av';
import Icon from 'react-native-vector-icons/FontAwesome';
import {postNewClick} from '../redux/ActionCreators';
import {connect} from 'react-redux';
import {Loading} from './LoadingComponent';
import { block } from 'react-native-reanimated';

const mapStateToProps= state=>{
    return{
        clicks:state.clicks
    }
};

const mapDispatchToProps = dispatch=>({
    postNewClick:(username,title,fileUrl)=>dispatch(postNewClick(username,title,fileUrl))
});


function RenderLoader({status})
{
    console.log(status);
    if(status)
    {
        alert("Click has been uploaded");
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

class Upload extends Component{

    constructor(props)
    {
        super(props);
        this.state={
            videoUrl:'',
            name:"Ravi",
            caption:"",
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
        this.props.postNewClick(this.state.name,this.state.caption,this.state.videoUrl);
    }


    render(){
        
        //console.log(this.props.clicks.isUploading);
        if(this.state.videoUrl==='')
        {
            return(
                <View>
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
                </View>
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
                </ScrollView>
            )
        }
    }
}

let width= Dimensions.get('window').width;
const styles= StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
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
    }
});

export default connect(mapStateToProps,mapDispatchToProps)(Upload);