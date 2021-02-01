import React,{Component} from 'react';
import {Card} from 'react-native-elements';
import {ScrollView,Text,View,StyleSheet} from 'react-native';

class Group extends Component{

    constructor(props)
    {
        super(props);
    }

    render(){
        return(
            <View style={styles.container}>
                <Text>Groups Component</Text>
            </View>
            
        );
    }
}

const styles= StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        alignItems: 'center',
        justifyContent: 'center',
    }
});


export default Group;