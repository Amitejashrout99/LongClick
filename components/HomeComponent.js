import React,{Component} from 'react';
import {Card} from 'react-native-elements';
import {ScrollView,Text,FlatList, StyleSheet,View} from 'react-native';
import {connect} from 'react-redux';
import {Button,Tile} from 'react-native-elements';
import {getStoredJWTToken} from '../redux/ActionCreators';

const mapStateToProps=(state)=>{
    return{
        clicks:state.clicks,
        users:state.users
    }
};

const mapDispatchToProps=dispatch=>({
    getStoredJWTToken:()=>dispatch(getStoredJWTToken())
});



class Home extends Component{

    constructor(props)
    {
        super(props);
        
    }

    componentDidMount()
    {
        this.props.getStoredJWTToken();
    }
    

    handleVideoRef=(component)=>{
        console.log(this.props.clicks);
        this.playbackInstance = component;
        console.log(this.playbackInstance);
        this.playbackInstance.loadAsync({ uri: 'http://d23dyxeqlo5psv.cloudfront.net/big_buck_bunny.mp4' }, { shouldPlay: true, positionMillis: 0 })
        //this.playbackObject.loadAsync({ uri: videoUrl }, { shouldPlay: true, positionMillis: 0 })
    }
    
    render(){

        const renderVideoList=({item,index})=>{
            return(
                <Tile
                    key={index}
                    hideChevron={true}
                    title={item.title}
                    caption={item.description}
                    featured
                    onPress={()=>this.props.navigation.navigate('ClickDetail',
                        {
                            clickDetails:this.props.clicks.clicks[+index],
                            clickName:this.props.clicks.clicks[+index].title,
                            jwtToken:this.props.users.jwtToken,
                            videoId:item._id
                        }
                    )}>
                </Tile>
            );
        }


        console.log(this.props.clicks.clicks);
        return(
            <ScrollView>
                <FlatList
                    data={this.props.clicks.clicks}
                    renderItem={renderVideoList}
                    keyExtractor={item => item._id.toString()}
                />                      
            </ScrollView>
            
        );
    }

}

const styles= StyleSheet.create({
    videoPlayer:{
        width:100,
        height:100
    },
});

export default connect(mapStateToProps,mapDispatchToProps)(Home);