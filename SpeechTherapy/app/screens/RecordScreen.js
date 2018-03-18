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

const WavAudioRecord = NativeModules.WavAudioRecord;

type Props = {};
class RecordScreen extends Component<Props> {
  constructor(props) {
    super(props);
    this.state = {filename: ''};

    this.filename = '';
    this.hasPermission = false;
    this.isRecording = false;
  }

  componentWillMount() {
    if (!this.hasPermission) {
      WavAudioRecord.checkAuthorisation().then(function(hasPermission) {
        if (hasPermission) {
          ToastAndroid.show('Has Mic Permission', ToastAndroid.SHORT);
        } else {
          ToastAndroid.show('No Mic Permission', ToastAndroid.SHORT);
        }
      });
      this.hasPermission = true;
    }
  }

  onPressRecord = () => {
    if (!this.isRecording) {
      WavAudioRecord.startRecording();
      ToastAndroid.show('Rec Started', ToastAndroid.SHORT);
    } else {
      WavAudioRecord.stopRecording();

      // set filepath
      this.filename = this.state.filename;
      if (this.filename === '') {
        this.filename = 'speechrec';
      }
      WavAudioRecord.setPath("/" + this.filename + ".wav");

      // save recording
      WavAudioRecord.saveRecording().then(function(allowedToSave){
        if (allowedToSave) {
            ToastAndroid.show('Rec Stopped and Saved', ToastAndroid.SHORT);
            pathSet = false;
        } else {
          ToastAndroid.show('Rec Stopped, Not Saved', ToastAndroid.SHORT);
        }
      });
    }
    this.isRecording = !this.isRecording;
  }

  render() {
    return (
      <View style={styles.container}>

        <View style={styles.textInputContainer}>
          <TextInput
            style={styles.textInput}
            placeholder="File name"
            onChangeText={(filename) => this.setState({filename})}
          />
        </View>

        <View style={styles.buttonContainer}>
          <TouchableOpacity style={styles.button}
            onPress={this.onPressRecord}>
            <Text style={styles.buttonText}>Record</Text>
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
