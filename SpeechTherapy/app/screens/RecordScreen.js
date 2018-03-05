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

var pathSet = false;
var hasPermission = false;
var isRecording = false;


type Props = {};
class RecordScreen extends Component<Props> {

  onPressRecord = () => {
    if (!hasPermission) {
      WavAudioRecord.checkAuthorisation()
      .then(function(result) {
        if (result) {
          ToastAndroid.show('Rec Auth True', ToastAndroid.SHORT);
        } else {
          ToastAndroid.show('Rec Auth False', ToastAndroid.SHORT);
        }
      });
    }

    if (!pathSet) {
      WavAudioRecord.setPath("/testaudio.wav");
      ToastAndroid.show('Path Set', ToastAndroid.SHORT);
      pathSet = true;
    }

    if (!isRecording) {
      promiseReturn = WavAudioRecord.startRecording();
      ToastAndroid.show('Rec Started', ToastAndroid.SHORT);
    } else {
      WavAudioRecord.stopRecording();
      WavAudioRecord.saveRecording();
      ToastAndroid.show('Rec Stopped and Saved', ToastAndroid.SHORT);
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
