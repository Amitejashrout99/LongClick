import React,{Component} from 'react';
import {Card} from 'react-native-elements';
import {ScrollView,Text,View,StyleSheet,Dimensions} from 'react-native';
import {Video,Audio} from 'expo-av';
import VideoPlayer from 'expo-video-player'


function RenderVideoDetails()
{
    return(
        <Card>
            <Card.Title>Video Details</Card.Title>
            <Card.Divider/>
            <Text>All Video Details including the share icons and the favorites</Text>
        </Card>
    );
}

function RenderCommentDetails()
{
    return(
        <Card>
            <Card.Title>All Comments</Card.Title>
            <Card.Divider/>
            <Text>All Comments that are available</Text>
        </Card>
    );
}

function PostNewComment(){
    return(
        <Card>
            <Card.Title>Post New Comment Area</Card.Title>
            <Card.Divider/>
            <Text>New Comment will be posted here</Text>
        </Card>
    )
}






class ClickDetail extends Component{

    constructor(props)
    {
        super(props);
    }

    render(){
        
        const videoUrl= this.props.route.params.videoUrl;
        return(
                <ScrollView>
                    
                    <VideoPlayer
                        videoProps={{
                            shouldPlay: true,
                            resizeMode: Video.RESIZE_MODE_CONTAIN,
                            source: {
                            uri: videoUrl,
                            },
                        }}
                        inFullscreen={true}
                        width={width}
                        height={400}
                    />
                    <RenderVideoDetails/>
                    <RenderCommentDetails/>
                    <PostNewComment/>
                </ScrollView>
                
        );
    }
}

let width = Dimensions.get('window').width; //full width

const styles= StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
    videoStyle:{
        width:width,
        height:400
    }
});


export default ClickDetail;