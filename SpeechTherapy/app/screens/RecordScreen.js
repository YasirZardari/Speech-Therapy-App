import React, { Component } from 'react';
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  NativeModules,
  ToastAndroid
} from 'react-native';

const WavAudioRecord = NativeModules.WavAudioRecord;

var isRecording = false;
var pathSet = false;

type Props = {};
class RecordScreen extends Component<Props> {

  onPressRecord = () => {
    if (!pathSet) {
      WavAudioRecord.setPath("/testaudio.wav");
      ToastAndroid.show('Path Set', ToastAndroid.SHORT);
      pathSet = true;
    }

    if (!isRecording) {
      WavAudioRecord.startRecording();
      ToastAndroid.show('Recording Started', ToastAndroid.SHORT);
    } else {
      WavAudioRecord.stopRecording();
      ToastAndroid.show('Recording Stopped', ToastAndroid.SHORT);
    }
    isRecording = !isRecording;
  }

  render() {
    return (
      <View style={styles.container}>
        <Text>Welcome to Record Screen</Text>

        <TouchableOpacity
          style={styles.button}
          onPress={this.onPressRecord}
        >
          <Text>Record</Text>
        </TouchableOpacity>
      </View>
    );
  }
}
export default RecordScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5FCFF',
  },
  button: {
    alignItems: 'center',
    backgroundColor: '#DDDDDD',
    padding: 10
  }
});
