import React, { Component } from 'react';
import {
  StyleSheet,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  NativeModules,
  ToastAndroid
} from 'react-native';
import Tts from 'react-native-tts';

const WavAudioRecord = NativeModules.WavAudioRecord;

type Props = {};
class TTSScreen extends Component<Props> {
  constructor(props) {
    super(props);
    this.state = {phrase: ''};
  }
  onPressSpeak = () => {
    Tts.speak(this.state.phrase);
    ToastAndroid.show('Playing phrase', ToastAndroid.SHORT);
  }

  render() {
    return (
      <View style={styles.container}>

        <View style={styles.textInputContainer}>
          <TextInput
            multiLine = {true}
            style={styles.textInput}
            placeholder="Tap to enter a phrase here.."
            onChangeText={TextInputValue => this.setState({phrase: TextInputValue})}
          />
        </View>

        <View style={styles.buttonContainer}>
          <TouchableOpacity style={styles.button}
            onPress={this.onPressSpeak}>
            <Text style={styles.buttonText}>Speak</Text>
          </TouchableOpacity>

        </View>
        <TouchableOpacity style= {[styles.button,{top:450}]}
          onPress = {() => this.setState({phrase :''})}>
          <Text style ={styles.buttonText}>Clear Text</Text>
        </TouchableOpacity>
      </View>
    );
  }
}
export default TTSScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5FCFF',
  },
  buttonContainer: {
    flex: 1,
    width: 320,
    justifyContent: 'flex-start',
  },
  button: {
    height: 70,
    marginBottom: 15,
    alignSelf: 'stretch',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#52b2d8',
    borderRadius: 10,
    elevation: 5
  },
  buttonText: {
    fontSize: 36,
    color: '#FFFFFF',
    fontFamily:'sans-serif-condensed'
  },
  textInputContainer: {
    flex: 2,
    paddingLeft: 30,
    paddingRight: 30,
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'stretch',
  },
  textInput: {
    alignSelf: 'stretch',
    fontSize: 32,
    fontFamily:'sans-serif-condensed'
  }
});
