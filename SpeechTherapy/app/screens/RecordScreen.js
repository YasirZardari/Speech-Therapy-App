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
      filename: ''
    }
    this.filename = '';

    this.hasPermission = false;
    this.isRecording = false;
  }

  // Check if user has mic permission before rendering components
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
      // start recording
      WavAudioRecord.startRecording();
      this.isRecording = true;
      ToastAndroid.show('Rec Started', ToastAndroid.SHORT);
    } else {
      // stop recording
      WavAudioRecord.stopRecording();
      this.isRecording = false;

      WavAudioRecord.setPath("/" + "myfilename" + ".wav");
      WavAudioRecord.saveRecording()
      .then(function(success){
        // on promise resolve
        ToastAndroid.show('Rec Saved', ToastAndroid.SHORT);
        this.props.navigation.navigate('MainMenu');
      },function(fail){
        // on promise reject
      })
      .catch(function(){
        ToastAndroid.show('Error Saving', ToastAndroid.SHORT);
      });

      //this.props.navigation.navigate('SaveRecordingScreen');
    }
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
