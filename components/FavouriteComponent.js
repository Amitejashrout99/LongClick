import React,{useState,useEffect} from 'react';
import {StyleSheet,View,Text,ActivityIndicator,FlatList,ScrollView,RefreshControl} from 'react-native';
import {ListItem} from 'react-native-elements';
import {useSelector,useDispatch} from 'react-redux';
import {fetchAllFavourites,checkClickFavouriteStatus} from '../redux/ActionCreators';

const wait = (timeout) => {
    return new Promise(resolve => setTimeout(resolve, timeout));
  }

const RenderFavouritesList=({allFavs,isLoading,errMess,props,jwtToken,dispatch,setFavouriteStatus})=>{
    if(isLoading)
    {
        return(
            <View style={{ alignItems:`center`,justifyContent:`center`,flex:1,margin:20}}>
                <ActivityIndicator size="large" color="#512DA8"/>
                <Text style={styles.loadingText}>Fetching Your Favourite Clicks ....</Text>
            </View>
        );
    }
    else if(errMess!=null)
    {
        if(errMess==404)
        {
            return(
                <View style={styles.container}>
                    <Text style={styles.loadingText}>You don't have any Favourites</Text>
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

        const renderFavouritesList=({item,index})=>{
            return(
                <ListItem
                    key={index}
                    onPress={()=>{
                        props.navigation.navigate('ClickDetail',
                        {
                            clickDetails:item,
                            clickName:item.title,
                            jwtToken:jwtToken,
                            videoId:item._id
                        });
                        dispatch(setFavouriteStatus(true));
                    }}>
                    <ListItem.Content>
                        <ListItem.Title>{item.title}</ListItem.Title>
                        <ListItem.Subtitle>{item.description}</ListItem.Subtitle>
                    </ListItem.Content>
                    <ListItem.Chevron/>
                </ListItem>
            );
        };


        return(
            <ScrollView>
                <FlatList
                    data={allFavs}
                    renderItem={renderFavouritesList}
                    keyExtractor={item=> item._id.toString()}
                />
            </ScrollView>
        );
    }

}


function UserFavourites(props)
{
    const favourites=useSelector((state)=>state.favourites);
    const users=useSelector((state)=>state.users);
    const [authenticated,setAuthenticated]= useState(users.isAuthenticated);
    const [refreshing, setRefreshing] = useState(false);

    const dispatch=useDispatch();

    
    const onRefresh=()=>{
        setRefreshing(true);
        wait(2000).then(() =>{
            setRefreshing(false);
            dispatch(fetchAllFavourites(users.jwtToken));
        });
    };

    useEffect(()=>{
        dispatch(fetchAllFavourites(users.jwtToken));
    },[]);

    if(authenticated)
    {
        return(
            <ScrollView refreshControl={
                <RefreshControl 
                    refreshing={refreshing}
                    onRefresh={onRefresh} 
                />}>
                    <RenderFavouritesList allFavs={favourites.favourites} errMess={favourites.errMess} 
                    isLoading={favourites.isLoading} props={props} jwtToken={users.jwtToken} dispatch={dispatch} 
                    setFavouriteStatus={checkClickFavouriteStatus} />
            </ScrollView>
        );
    }
    else{
        return(
            <ScrollView>
                <View style={styles.container}>
                    <Text style={styles.loadingText}>You need to be signed in to view your favourites</Text>
                </View>
            </ScrollView>
        )
    }

}

const styles= StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        alignItems: 'center',
        justifyContent: 'center',
    },
    loadingText:{
        fontWeight:`bold`,
        color:"#512AD8",
        fontSize:14,
        marginTop:20
    }
});

export default UserFavourites;