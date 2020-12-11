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
import {
  Button,
  StyleSheet,
  Dimensions,
  TextInput,
  View,
  Text,
  Alert,
} from 'react-native';
// import RNDictation, {dictationEvent} from 'react-native-speech-recognization';
import {DictationPanel, RNDictation} from 'react-native-speech-recognization';

const Space = () => <View style={{height: 20}} />;

export default class App extends Component<{}> {
  state = {
    status: '--',
    message: '',
  };

  constructor(props) {
    super(props);
  }

  render() {
    return (
      <View style={styles.container}>
        <Text>{this.state.status}</Text>
        <TextInput
          multiline
          numberOfLines={10}
          textAlignVertical="top"
          style={{
            borderColor: '#666',
            borderWidth: StyleSheet.hairlineWidth,
            width: '90%',
          }}
          value={this.state.message}
          onChangeText={(text) => {
            this.setState({message: text});
          }}
        />
        <Space />
        <Button
          title="CheckIsSupport"
          onPress={async () => {
            try {
              const result = await RNDictation.isSupport();
              if (result) {
                Alert.alert('Info', 'Support your device');
              } else {
                Alert.alert('Error', 'Do not Support your device!!!');
              }
            } catch (error) {
              Alert.alert('Error', error.message);
            }
          }}
        />
        <Space />
        <DictationPanel
          onStartRecord={() => {
            this.setState({status: 'Listening...'});
          }}
          onEndRecord={(text) => {
            this.setState({status: 'Done'});
          }}
          onComplete={(text) => {
            this.setState((prevState) => ({
              message: `${prevState.message || ''}${text}`,
            }));
          }}
        />
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
