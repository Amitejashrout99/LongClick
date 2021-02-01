import { StatusBar } from 'expo-status-bar';
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import Main from './components/MainComponent';
import {Provider} from 'react-redux';
import {ConfigureStore} from './redux/ConfigureStore';

export default function App() {
  
  const store= ConfigureStore();
  
  return (
    <Provider store={store}>
       <Main/>
    </Provider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
