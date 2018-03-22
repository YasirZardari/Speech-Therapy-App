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

type Props = {};
class RecordScreen extends Component<Props> {
  constructor(props) {
    super(props);

    this.state = {
      hasPermission: false,
      isRecording: false,
      buttonText: 'Start Recording'
    }
  }

  // Check if user has mic permission before rendering components.
  // TODO: implement manual permission request, incase permission check fails.
  componentWillMount() {
    if (!this.state.hasPermission) {
      WavAudioRecord.checkAuthorisation().then(function(hasPermission) {
        if (hasPermission) {
          ToastAndroid.show('Has Mic Permission', ToastAndroid.SHORT);
        } else {
          ToastAndroid.show('No Mic Permission', ToastAndroid.SHORT);
        }
      });
      this.setState({ hasPermission: true });
    }
  }

  onPressRecord = () => {
    if (!this.state.isRecording) {
      // start recording
      WavAudioRecord.startRecording();
      this.setState({ isRecording: true, buttonText: 'Stop Recording'});
      ToastAndroid.show('Rec Started', ToastAndroid.SHORT);
    } else {
      // stop recording
      WavAudioRecord.stopRecording();
      this.setState({ isRecording: false, buttonText: 'Start Recording' });

      this.props.navigation.navigate('SaveRecordingScreen');
    }
  }

  render() {
    return (
      <View style={styles.container}>

        <View style={styles.buttonContainer}>
          <TouchableOpacity style={[styles.button, this.state.isRecording && styles.buttonOnRec]}
            onPress={this.onPressRecord}>
            <Text style={styles.buttonText}>{ this.state.buttonText }</Text>
          </TouchableOpacity>
        </View>

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
  buttonOnRec: {
    backgroundColor: 'red'
  },
  buttonText: {
    fontSize: 36
  }
});
