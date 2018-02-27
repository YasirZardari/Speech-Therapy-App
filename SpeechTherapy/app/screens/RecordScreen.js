import React, { Component } from 'react';
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity
} from 'react-native';

type Props = {};
class RecordScreen extends Component<Props> {
  WavAudioRecord.setPath("/test");
  var isRecording = false;
  
  onPressRecord = () => {
    if (!isRecording) {
      WavAudioRecord.startRecording();
    } else {
      WavAudioRecord.stopRecording();
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
