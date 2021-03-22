import React,{Component} from 'react';
import {Card} from 'react-native-elements';
import {ScrollView,Text,FlatList, StyleSheet,View,Alert,ActivityIndicator,Dimensions,RefreshControl} from 'react-native';
import {connect} from 'react-redux';
import {Button,Tile,Image,Overlay} from 'react-native-elements';
import * as Notifications from 'expo-notifications';
import {getStoredJWTToken,fetchClickFavouriteStatus,logoutUser,createClicksThumbnails,fetchAllClicks} from '../redux/ActionCreators';
import Icon from 'react-native-vector-icons/FontAwesome';
import * as VideoThumbnails from 'expo-video-thumbnails';
import { baseUrl } from '../shared/baseUrl';
//var uniqid = require('uniqid');

const mapStateToProps=(state)=>{
    return{
        clicks:state.clicks,
        users:state.users
    }
};

const mapDispatchToProps=dispatch=>({
    getStoredJWTToken:()=>dispatch(getStoredJWTToken()),
    fetchClickFavouriteStatus:(videoId,token)=>dispatch(fetchClickFavouriteStatus(videoId,token)),
    logoutUser:()=>dispatch(logoutUser()),
    createClicksThumbnails:(videoIds)=>dispatch(createClicksThumbnails(videoIds)),
    fetchAllClicks:()=>dispatch(fetchAllClicks())
});

const wait = (timeout) => {
    return new Promise(resolve => setTimeout(resolve, timeout));
  }

class Home extends Component{

    constructor(props)
    {
        super(props);
        this.state={
            imageUrls:[],
            refreshing:false
        }
        
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
                console.log("Logout Notification triggered");
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

    async presentLogoutSuccessfullNotification()
    {
        await this.obtainNotificationPermission;
        Notifications.scheduleNotificationAsync({
            content:{
                title:"Logout Successfull",
                body:'You have been logged out successfully'
            },
            trigger:null
        });
    }

    async generateThumbnail(urls)
    {
        console.log("Called");
        let result=urls.map((url)=>{
            //console.log(url.url);
            let imageUri= VideoThumbnails.getThumbnailAsync(url.url,{time:2000});
            return imageUri;
        })
        
        let data= await Promise.all(result);
        this.setState({
            imageUrls:data
        });

    };

    

    componentDidUpdate(prevProps)
    {
        if(prevProps.users.isAuthenticated!=this.props.users.isAuthenticated && this.props.users.isAuthenticated)
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
        /*if(this.props.clicks.clicksUrls.length!=0 && this.state.imageUrls.length==0)
        {
            this.generateThumbnail(this.props.clicks.clicksUrls);
        }*/
        /*if(this.props.clicks.clicks.length!=0 && this.props.clicks.clicksThumbnails.length==0){
            this.props.createClicksThumbnails(this.props.clicks.clicks);
        }*/
    }

    
    render(){

        if(this.props.clicks.isLoading)
        {
            return(
                <View style={{ alignItems:`center`,justifyContent:`center`,flex:1,margin:20}}>
                    <ActivityIndicator size="large" color="#512DA8"/>
                    <Text style={styles.loadingText}>Fetching Your Clicks ....</Text>
                </View>
            );
        }
        else if(this.props.clicks.errMess!=null)
        {
            if(this.props.clicks.errMess==404)
            {
                return(
                    <View style={styles.container}>
                        <Text style={styles.loadingText}>You don't have any Clicks</Text>
                    </View>
                );
            }
            else if(errMess==401)
            {
                return(
                    <View style={styles.container}>
                        <Text style={styles.loadingText}>Not Authenticated</Text>
                    </View>
                );
            }
            else{

                return(
                    <View style={styles.container}>
                        <Text>{errMess}</Text>
                    </View>
                );
            }
            
        }
        else{
            
            
            const renderVideoList=({item,index})=>{
                //console.log(this.props.clicks.clickThumbnailUrls[+index]); 
                return(
                    <Tile
                        key={index}
                        width={width-26}
                        hideChevron={true}
                        title={item.title}
                        containerStyle={{height:500,backgroundColor:'#512AD8',borderRadius:10,marginLeft:13,marginRight:13,marginTop:5,zIndex:2}}
                        titleStyle={{color:`white`}}
                        imageSrc={{uri:this.props.clicks.clickThumbnailUrls[+index].url}}
                        onPress={()=>{
                            this.props.navigation.navigate('ClickDetail',
                            {
                                clickDetails:this.props.clicks.clicks[+index],
                                clickName:this.props.clicks.clicks[+index].title,
                                jwtToken:this.props.users.jwtToken,
                                videoId:item._id
                            });
                                this.props.fetchClickFavouriteStatus(item._id,this.props.users.jwtToken);
                        }}>
                        
                        <View>
                            <Text style={{color:`white`}}>{item.description}</Text>
                        </View>
                        
                    </Tile>
                    
                );
            }
    
            return(
                <ScrollView refreshControl={<RefreshControl refreshing={this.state.refreshing} 
                    onRefresh={()=>{
                        this.setState({refreshing:true})
                        wait(2000).then(() =>{
                            this.setState({refreshing:false});
                            this.props.fetchAllClicks();
                        });
                    }}/>}>
                    <FlatList
                        data={this.props.clicks.clicks}
                        renderItem={renderVideoList}
                        keyExtractor={item => item._id.toString()}
                        ItemSeparatorComponent={()=><View style={{
                            height:5,
                            width: "100%",
                            backgroundColor:'transparent',
                          }} />}
                    />                      
                </ScrollView>
                
            );
        }
        
    }

}

let height = Dimensions.get('screen').height; //full width
let width = Dimensions.get('screen').width; //full width

const styles= StyleSheet.create({
    videoPlayer:{
        width:100,
        height:100
    },
    loadingText:{
        fontWeight:`bold`,
        color:"#512AD8",
        fontSize:14,
        marginTop:20
    }
});

export default connect(mapStateToProps,mapDispatchToProps)(Home);