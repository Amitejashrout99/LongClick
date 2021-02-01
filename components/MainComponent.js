import React,{Component} from 'react';
import {NavigationContainer,DrawerActions} from '@react-navigation/native';
import {connect} from 'react-redux';

import { createStackNavigator } from '@react-navigation/stack';
import { createDrawerNavigator } from '@react-navigation/drawer';

import {fetchAllClicks} from '../redux/ActionCreators';

import Icon from 'react-native-vector-icons/FontAwesome';

import Home from './HomeComponent';
import Group from './GroupComponent';
import Upload from './UploadComponent';
import ClickDetail from './ClickDetailComponent';

const mapStateToProps= state =>{
    return{
        
    }
};

const MapDispatchToProps= dispatch=>({
    fetchAllClicks:()=>dispatch(fetchAllClicks())
});


const HomeNavigator= createStackNavigator();
function HomeStack()
{
    return(
        <HomeNavigator.Navigator
            initialRouteName="Home"
            headerMode="screen"
            screenOptions={{
                headerTintColor: '#fff',
                headerStyle: { backgroundColor: '#512DA8' },
                headerTitleStyle:{
                    color: "#fff"
                }
            }}
        >

            <HomeNavigator.Screen 
                name="Home"
                component={Home}
                options={({navigation})=>({
                    title:"Click Feed",
                    headerLeft:()=>(<Icon
                        name="bars"
                        size={24}
                        color="#FFFFFF"
                        onPress={()=>navigation.dispatch(DrawerActions.toggleDrawer())}
                    />)
                })}
            />

            <HomeNavigator.Screen
                name="ClickDetail"
                component={ClickDetail}
                options={({navigation})=>({
                    title:"Click Details",
                })}
            />
        </HomeNavigator.Navigator>
    )
};

const GroupNavigator =  createStackNavigator();
function GroupNavigatorStack()
{
    return(
        <GroupNavigator.Navigator 
            initialRouteName="MyGroups"
            headerMode="screen"
            screenOptions={{
                headerTintColor: '#fff',
                headerStyle: { backgroundColor: '#512DA8' },
                headerTitleStyle:{
                    color: "#fff"
                }
            }}
        >

            <GroupNavigator.Screen
                name="MyGroups"
                component={Group}
                options={({navigation})=>({
                    title:"My Groups",
                    headerLeft:()=>(
                        <Icon
                        name="bars"
                        size={24}
                        color="#FFFFFF"
                        onPress={()=>navigation.dispatch(DrawerActions.toggleDrawer())}
                    />)
                })}
            />



        </GroupNavigator.Navigator>
    )
};


const UploadNavigator =  createStackNavigator();
function UploadNavigatorStack()
{
    return(
        <UploadNavigator.Navigator
            headerMode="screen"
            screenOptions={{
                headerTintColor: '#fff',
                headerStyle: { backgroundColor: '#512DA8' },
                headerTitleStyle:{
                    color: "#fff"
                }
            }}
        >

            <UploadNavigator.Screen
                name="UploadClick"
                component={Upload}
                options={({navigation})=>({
                    title:"Upload Click",
                    headerLeft:()=>(
                        <Icon
                        name="bars"
                        size={24}
                        color="#FFFFFF"
                        onPress={()=>navigation.dispatch(DrawerActions.toggleDrawer())}
                    />)
                })}
            />



        </UploadNavigator.Navigator>
    )
};


const MainDrawerNavigator= createDrawerNavigator();
function MainDrawerStack()
{
    return(
        <MainDrawerNavigator.Navigator
            initialRouteName="Home"
            drawerContentOptions={{
                activeBackgroundColor:"#D1C4E9",
            }}
        >

            <MainDrawerNavigator.Screen
                name="Home"
                component={HomeStack}
                options={{
                    title:"Click Feed",
                    drawerIcon:({focused,size})=>(<Icon
                        
                        name="list"
                        size={24}
                        color={"#D1C4E9"}
                    />)
                }}
            />

            <MainDrawerNavigator.Screen
                name="Group"
                component={GroupNavigatorStack}
                options={{
                    title:"My Groups",
                    drawerIcon:({focused,size})=>(<Icon
                        
                        name="users"
                        size={24}
                        color={"#D1C4E9"}
                    />)
                }}
            />

            <MainDrawerNavigator.Screen
                name="UploadClick"
                component={UploadNavigatorStack}
                options={{
                    title:"Upload New Click",
                    drawerIcon:({focused,size})=>(<Icon
                        
                        name="video-camera"
                        size={24}
                        color={"#D1C4E9"}
                    />)
                }}
            />



        </MainDrawerNavigator.Navigator>
    )
}



class Main extends Component{

    constructor(props)
    {
        super(props);
    }

    componentDidMount()
    {
        this.props.fetchAllClicks();
    }

    render(){
        return(
            <NavigationContainer>
                <MainDrawerStack/>
            </NavigationContainer>
        )
    }

};

export default connect(mapStateToProps,MapDispatchToProps)(Main);

