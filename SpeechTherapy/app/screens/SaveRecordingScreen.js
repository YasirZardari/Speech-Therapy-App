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
class SaveRecordingScreen extends Component<Props> {
  constructor(props) {
    super(props);

    this.state = {
      filename: ''
    }

    this.filename = '';
  }

  onPressSave = () => {
    // set filepath, if field empty - give default name "speechrec"
    this.filename = this.state.filename;
    if (this.filename === '') {
      this.filename = 'speechrec';
    }

    WavAudioRecord.setPath("/" + this.filename + ".wav");
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
            onPress={this.onPressSave}>
            <Text style={styles.buttonText}>Save</Text>
          </TouchableOpacity>
        </View>

      </View>
    );
  }
}
export default SaveRecordingScreen;

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
