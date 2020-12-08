/**
 * Sample React Native App
 *
 * adapted from App.js generated by the following command:
 *
 * react-native init example
 *
 * https://github.com/facebook/react-native
 */

import React, {Component} from 'react';
import {Button, StyleSheet, Text, View} from 'react-native';
import RNDictation from 'react-native-dictation';

export default class App extends Component<{}> {
  state = {
    status: 'starting',
    message: '--',
  };

  constructor(props) {
    super(props);
    RNDictation.addEventListener('onSuccess', (text) => {
      this.setState({message: text});
    });
  }

  render() {
    return (
      <View style={styles.container}>
        <Button
          title="start"
          onPress={() => {
            RNDictation.startRecord();
          }}
        />

        <Button
          title="end"
          onPress={() => {
            RNDictation.endRecord();
          }}
        />
        <Text>{this.state.message}</Text>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5FCFF',
  },
  welcome: {
    fontSize: 20,
    textAlign: 'center',
    margin: 10,
  },
  instructions: {
    textAlign: 'center',
    color: '#333333',
    marginBottom: 5,
  },
});
