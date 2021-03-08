import React,{Component} from 'react';
import {View,Text,StyleSheet,ScrollView,Image,SafeAreaView} from 'react-native';
import { DrawerItemList } from '@react-navigation/drawer';


class DrawerScreen extends Component
{
    constructor(props)
    {
        super(props);
    }

    render(){
        
        
        return(
            <ScrollView>
                <SafeAreaView style={styles.container} forceInset={{top:'always',horizontal:'never'}}>
                <View style={styles.drawerHeader}>
                    <View style={{flex:1}}>
                    <Image source={require('../components/images/logo.png')}
                        style={styles.drawerImage}/>
                    </View>
                    <View style={{flex:2}}>
                    <Text style={styles.drawerHeaderText}>
                        longClick
                    </Text>
                    </View>
                </View>
                <DrawerItemList {...this.props} />
                </SafeAreaView>
          </ScrollView>
            
        );
    }
}
const styles = StyleSheet.create({
    container: {
      flex: 1,
    },
    drawerHeader: {
      backgroundColor: '#512DA8',
      height: 140,
      alignItems: 'center',
      justifyContent: 'center',
      flex: 1,
      flexDirection: 'row'
    },
    drawerHeaderText: {
      color: 'white',
      fontSize: 24,
      fontWeight: 'bold',
      marginLeft:10
    },
    drawerImage: {
      margin: 10,
      width: 80,
      height: 60
    }
});



export default DrawerScreen;

