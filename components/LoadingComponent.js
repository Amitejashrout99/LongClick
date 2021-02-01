import React from 'react';
import {StyleSheet,Text,View,ActivityIndicator} from 'react-native';

const styles= StyleSheet.create({
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

export const Loading=()=>{
    return(
        <View style={styles.loadingView}>
            <ActivityIndicator size="large" color="#512DA8"/>
            <Text style={styles.loadingText}>Uploading Click ....</Text>
        </View>
    )
};