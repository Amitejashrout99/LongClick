import React,{Component} from 'react';
import {Card, ListItem,Rating,BottomSheet, Button,Input,Icon} from 'react-native-elements';
import {ScrollView,Text,View,StyleSheet,Dimensions,ActivityIndicator,FlatList,Alert,PanResponder} from 'react-native';
import {Video,Audio} from 'expo-av';
import VideoPlayer from 'expo-video-player';
import {connect} from 'react-redux';
import {fetchAllComments,fetchClickSignedUrl,editComment,addComment,getStoredJWTToken,
    verifyTokenValidity,resetAddCommentErrorState,resetEditCommentErrorState} from '../redux/ActionCreators';
import Swipeout from 'react-native-swipeout';

const mapStateToProps= state =>{
    return{
        comments:state.comments,
        clicks:state.clicks,
        users:state.users
    }
};

const mapDispatchToProps= dispatch =>({
    fetchAllComments:(videoId)=>dispatch(fetchAllComments(videoId)),
    fetchClickSignedUrl:(videoId)=>dispatch(fetchClickSignedUrl(videoId)),
    editComment:(videoId,commentId,newComment,newRating,token)=>dispatch(editComment(videoId,commentId,newComment,newRating,token)),
    addComment:(videoId,comment,rating,token)=>dispatch(addComment(videoId,comment,rating,token)),
    getStoredJWTToken:()=>dispatch(getStoredJWTToken()),
    verifyTokenValidity:(token)=>dispatch(verifyTokenValidity(token)),
    resetAddCommentErrorState:()=>dispatch(resetAddCommentErrorState()),
    resetEditCommentErrorState:()=>dispatch(resetEditCommentErrorState())
});

function RenderVideoPlayer({signedUrl})
{
    
    if(signedUrl===null)
    {
        return(
            <Card>
                <Card.Title style={styles.headerText}>Fetching Video Details</Card.Title>
                <Card.Divider/>
                <View style={{ alignItems:`center`,justifyContent:`center`,flex:1,margin:20}}>
                    <ActivityIndicator size="large" color="#512DA8"/>
                    <Text style={styles.loadingText}>Fetching Video ....</Text>
                </View>
            </Card>
        );
    }
    else{
        return(
                    <VideoPlayer
                        videoProps={{
                            shouldPlay: true,
                            resizeMode: Video.RESIZE_MODE_CONTAIN,
                            source: {
                                uri:signedUrl,
                            },
                        }}
                        inFullscreen={true}
                        width={width}
                        height={400}
                    />
        )
    }
}


function RenderVideoDetails({click})
{
    return(
        <View>
            <Card>
                <Card.Title style={styles.headerText}>Click Details</Card.Title>
                <Card.Divider/>
                <Text style={styles.baseText}>Description:
                    {"\n"} 
                    <Text style={styles.dataText}>{click.description}</Text>
                </Text>
                <Text style={styles.baseText}>Category:
                    {"\n"} 
                    <Text style={styles.dataText}>{click.category}</Text>
                </Text>
            </Card>
        </View>
    );
}

function RenderEditCommentErrors({error,isAuthenticated,jwtToken,refreshToken,resetEditErrorState})
{
    if(error===401 && isAuthenticated)
    {
        Alert.alert(
            'Authentication Failure',
            'Token has expired, Please Sign in Again',
            [
                {
                    text:'Cancel',
                    style:'cancel',
                },
                {
                    text:'Refresh Token',
                    style:'default',
                    onPress:()=>{
                        refreshToken(jwtToken);
                        resetEditErrorState();
                    }
                }
            ]
        );
        return null;
    }
    else if(error===401 && !isAuthenticated)
    {
        Alert.alert(
            'Authentication Failure',
            'You need to sign in for this opeartion'
        );
        return null;
    }
    else{
        return null;
    }
}

function RenderPostNewCommentError({error,isAuthenticated,jwtToken,refreshToken,resetAddErrorState})
{
    if(error===401 && isAuthenticated)
    {
        Alert.alert(
            'Authentication Failure',
            'Token has expired, Please Sign in Again',
            [
                {
                    text:'Cancel',
                    style:'cancel',
                },
                {
                    text:'Refresh Token',
                    style:'default',
                    onPress:()=>{
                        refreshToken(jwtToken)
                        resetAddErrorState()
                    }
                }
            ]
        );
        return null;
    }
    else if(error===401 && !isAuthenticated)
    {
        Alert.alert(
            'Authentication Failure',
            'You need to sign in for this opeartion'
        );
        return null;
    }
    else{
        return null;
    }
}


function RenderCommentDetails({comments,isAuthenticated,openBottomSheet,jwtToken,refreshToken,resetEditErrorFunction})
{
    
    const renderCommentList=({item,index})=>{

        const rightButton = [
            {
                text:'Edit',
                type:'primary',
                onPress:()=>{
                    if(isAuthenticated)

                    {
                        openBottomSheet(index);
                    }
                    else{
                        alert("You need to authenticate for editing the comment");
                    }
                }
            },
            {
                text: 'Delete', 
                type: 'delete',
                onPress: () => {
                    alert("Delete is working")
                }
            }
        ];

        const leftButton = [
            {
                text: 'Info',
                color:'#FFFFFF', 
                backgroundColor: '#512AD8',
                onPress: () => {
                    Alert.alert(
                        "Comment Details",
                        `Comment posted by ${item.author.firstname}`
                    );
                }
            },
        ];

        return(
            <Swipeout left={leftButton} right={rightButton} autoClose={true}>
                <ScrollView>
                    <ListItem key={index}>
                        <ListItem.Content>
                            <ListItem.Title>{item.comment}</ListItem.Title>
                            <Rating imageSize={10} type='star' readonly startingValue={item.rating} />
                            <RenderEditCommentErrors
                                error={comments.editCommentErrMess} 
                                isAuthenticated={isAuthenticated}
                                jwtToken={jwtToken}
                                refreshToken={refreshToken}
                                resetEditErrorState={resetEditErrorFunction}
                            />
                        </ListItem.Content>
                    </ListItem>
                </ScrollView>
            </Swipeout>
            
        );

    }
    
    
    if(comments.isLoading)
    {
        return(
            <Card>
                <Card.Title style={styles.headerText}>All Comments</Card.Title>
                <Card.Divider/>
                <View style={{ alignItems:`center`,justifyContent:`center`,flex:1,margin:20}}>
                    <ActivityIndicator size="large" color="#512DA8"/>
                    <Text style={styles.loadingText}>Fetching Comments for this video ....</Text>
                </View>
            </Card>
        );
    }
    else if(comments.comments.comments.length==0)
    {
        return(
            <Card>
                <Card.Title style={styles.headerText}>All Comments</Card.Title>
                <Card.Divider/>
                <Text>No Comments Posted Yet for this click</Text>
            </Card>
        )
    }
    else{
        return(
            <Card>
                <Card.Title style={styles.headerText}>All Comments</Card.Title>
                <Card.Divider/>
                <FlatList
                    data={comments.comments.comments}
                    renderItem={renderCommentList}
                    keyExtractor={item=> item._id.toString()} 
                />
                
            </Card>
        );
    }
}

function PostNewComment({isAuthenticated,isLoading,videoId,token,newComment,setComment,
    newRating,setRating,getCommentObj,addNewComment,error,refreshToken,resetAddErrorFunction})
{
    
    
    const LeftToRightSwipe=({moveX,moveY,dx,dy})=>{
        if(dx>100)
        {
            return true;
        }
        else{
            return false;
        }
    }
    
    const panResponder= PanResponder.create({
        onStartShouldSetPanResponder:(e,gestureState)=>{
            return true;
        },
        onPanResponderEnd:(e,gestureState)=>{
            if(LeftToRightSwipe(gestureState))
            {
                if(isAuthenticated)
                {
                    let commentObj=getCommentObj();
                    if(commentObj.comment==='')
                    {
                        Alert.alert(
                            'Comment Required',
                            'Comment must be provided' 
                        );
                    }
                    else{
                        addNewComment(videoId,commentObj.comment,commentObj.rating,token);
                    }
                }
                else{
                    Alert.alert(
                        'Authentication Failure',
                        'You need to be signed in to post comment'
                    );
                }
            }
            return true;
        }
    });
    
    return(
        <View {...panResponder.panHandlers}>
            <Card>
                <Card.Title style={styles.headerText}>Your Comment</Card.Title>
                <Card.Divider/>
                
                <Input 
                    placeholder="Comment" 
                    label="Your Comment" 
                    labelStyle={{color:"#512AD8"}}
                    value={newComment}
                    onChangeText={(value)=>setComment(value)}
                    style={{width:400,marginTop:20}}                
                />
                <Rating showRating type='star' ratingCount={5} imageSize={30} startingValue={newRating}
                    onFinishRating={(rating)=>setRating(rating)}/>
                <Text style={{color:"#512AD8",marginLeft:10,fontWeight:`bold`}}>Swipe on the card to post your comment</Text>
                <AddCommentLoader isLoading={isLoading}/>
                <RenderPostNewCommentError 
                    error={error} 
                    isAuthenticated={isAuthenticated}
                    jwtToken={token}
                    refreshToken={refreshToken}
                    resetAddErrorState={resetAddErrorFunction}
                />
            </Card>
        </View>
        
    )
}

function AddCommentLoader({isLoading})
{
    if(isLoading)
    {
        return(
            <View style={{ alignItems:`center`,justifyContent:`center`,flex:1,margin:20}}>
                <ActivityIndicator size="large" color="#512DA8"/>
                <Text style={styles.loadingText}>Posting Your Comment  ....</Text>
            </View>
        );
    }
    else{
        return null;
    }
}

function RenderEditCommentLoader({isLoading}){
    if(isLoading)
    {
        return(
            <View style={{ alignItems:`center`,justifyContent:`center`,flex:1,margin:20}}>
                <ActivityIndicator size="large" color="#512DA8"/>
                <Text style={styles.loadingText}>Editing Comment  ....</Text>
            </View>
        );
    }
    else{
        return null;
    }
}




class ClickDetail extends Component{

    constructor(props)
    {
        super(props);
        this.state={
            isEditSheetVisible:false,
            comment:'',
            rating:0,
            commentIdToModify:0,
            newComment:'',
            newRating:2
        }
    }

    componentDidMount(){
        this.props.fetchAllComments(this.props.route.params.videoId);
        this.props.fetchClickSignedUrl(this.props.route.params.videoId);
        this.props.getStoredJWTToken();
    }

    openBottomSheet=(commentIndex)=>{
        this.setState({
            isEditSheetVisible:true,
            commentIdToModify:this.props.comments.comments.comments[+commentIndex]._id,
            comment:this.props.comments.comments.comments[+commentIndex].comment,
            rating:this.props.comments.comments.comments[+commentIndex].rating
        });
    }


    editComment=(videoId,commentId,newComment,newRating,token)=>{
        this.props.editComment(videoId,commentId,newComment,newRating,token);
    }

    addComment=(videoId,comment,rating,token)=>{
        this.props.addComment(videoId,comment,rating,token);
    }

    setNewComment=(comment)=>{
        this.setState({newComment:comment});
    }

    setNewRating=(rating)=>{
        this.setState({newRating:rating});
    }

    displayCommentRating=()=>{
        
        let commentObj={
            "comment":this.state.newComment,
            "rating":this.state.newRating
        }
        return commentObj;
    }

    ratingCompleted=(rating)=>
    {
        this.setState({rating:rating});
    }
    render(){
        
        const videoId=this.props.route.params.videoId;
        //console.log(videoId);
        const clickDetails=this.props.route.params.clickDetails;
        return(
                <ScrollView>
                    
                    <RenderVideoPlayer signedUrl={this.props.clicks.clicksUrl} />
                    <RenderVideoDetails click={clickDetails} />
                    <RenderCommentDetails comments={this.props.comments} 
                        isAuthenticated={this.props.users.isAuthenticated}
                        openBottomSheet={this.openBottomSheet}
                        jwtToken={this.props.users.jwtToken}
                        refreshToken={this.props.verifyTokenValidity}
                        resetEditErrorFunction={this.props.resetEditCommentErrorState}
                    />
                    <PostNewComment 
                        isAuthenticated={this.props.users.isAuthenticated}
                        isLoading={this.props.comments.isLoading}
                        newComment={this.state.newComment}
                        setComment={this.setNewComment}
                        newRating={this.state.newRating}
                        setRating={this.setNewRating}
                        getCommentObj={this.displayCommentRating}
                        addNewComment={this.addComment}
                        videoId={videoId}
                        token={this.props.users.jwtToken}
                        error={this.props.comments.addCommentErrMess}
                        refreshToken={this.props.verifyTokenValidity}
                        resetAddErrorFunction={this.props.resetAddCommentErrorState}
                    />
                    <BottomSheet 
                        isVisible={this.state.isEditSheetVisible}
                        containerStyle={{backgroundColor: 'rgba(0.5, 0.25, 0, 0.2)'}}
                        modalProps={{
                            animationType:`fade`
                        }}
                    >
                        <View style={{backgroundColor:'#FFFFFF'}}>
                            <Input 
                                placeholder="Comment" 
                                label="Modify Comment" 
                                labelStyle={{color:"#512AD8"}}
                                value={this.state.comment}
                                onChangeText={(value)=>this.setState({comment:value})}
                                style={{width:400,marginTop:20}}
                                
                            />
                            <Text style={{color:"#512AD8",marginLeft:10,fontWeight:`bold`}}>Modify Rating</Text>
                            <Rating showRating type='star' ratingCount={5} imageSize={30} startingValue={this.state.rating}
                                onFinishRating={this.ratingCompleted}/>
                            <View style={{flex: 1,flexDirection: 'row',justifyContent: 'space-around',marginTop:5}}>
                                <Button title="Edit Comment" 
                                        buttonStyle={{
                                            backgroundColor:"#512AD8",
                                            width:150,
                                            borderRadius:10
                                        }} 
                                        onPress={()=>
                                            this.editComment(videoId,this.state.commentIdToModify,this.state.comment,this.state.rating,this.props.users.jwtToken)} />
                                <Button title="Close"
                                        buttonStyle={{
                                            backgroundColor:"#f01818",
                                            width:150,
                                            borderRadius:10
                                        }}
                                        onPress={()=>this.setState({isEditSheetVisible:false})} />
                            </View>
                            <RenderEditCommentErrors 
                                error={this.props.comments.editCommentErrMess} 
                                isAuthenticated={this.props.users.isAuthenticated}
                                jwtToken={this.props.users.jwtToken}
                                refreshToken={this.props.verifyTokenValidity} 
                            />
                            <RenderEditCommentLoader isLoading={this.props.comments.isLoading}/>
                         </View>
                    </BottomSheet>


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
    },
    headerText:{
        color:`#512AD8`,
        fontWeight:'bold',
        fontSize:35
    },
    baseText:{
        color:`#050505`,
        fontWeight:`bold`,
        fontSize:25
    },
    dataText:{
        color:`#512AD8`,
        fontWeight:'bold',
        fontSize:15
    },
    loadingText:{
        color:`#512DAB`,
        fontSize:14,
        fontWeight:'bold',
        marginTop:20
    },
});


export default connect(mapStateToProps,mapDispatchToProps)(ClickDetail);