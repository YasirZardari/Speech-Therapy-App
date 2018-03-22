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

    this.phrase = '';
  }

  componentWillMount() {
    
  }

  onPressSpeak = () => {
    Tts.speak(this.phrase);
  }

  render() {
    return (
      <View style={styles.container}>

        <View style={styles.textInputContainer}>
          <TextInput
            style={styles.textInput}
            placeholder="Enter your phrase here."
            onChangeText={(phrase) => this.setState({phrase})}
          />
        </View>

        <View style={styles.buttonContainer}>
          <TouchableOpacity style={styles.button}
            onPress={this.onPressSpeak}>
            <Text style={styles.buttonText}>Speak</Text>
          </TouchableOpacity>
        </View>

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
    justifyContent: 'flex-start',
    paddingTop: 10
  },
  button: {
    height: 150,
    width: 320,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#64B5F6'
  },
  buttonText: {
    fontSize: 36
  },
  textInputContainer: {
    flex: 1,
    justifyContent: 'flex-end',
    paddingBottom: 10
  },
  textInput: {
    height: 40,
    width: 320,
    fontSize: 24
  }
});