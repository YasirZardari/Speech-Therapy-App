import React, { Component } from 'react';
import {
  StyleSheet,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StatusBar,
  NativeModules,
  ToastAndroid
} from 'react-native';

const WavAudioRecord = NativeModules.WavAudioRecord;
const FileManager = NativeModules.FileManager;

type Props = {};
class SaveRecordingScreen extends Component<Props> {
  constructor(props) {
    super(props);

    this.state = {
      filename: '',
      category: ''
    }
  }

  onPressSave = () => {
    // set filepath, if field empty - give default name "speechrec"
    if (this.state.filename === '') {
      this.setState({ filename:'speechrec' });
      ToastAndroid.show("Filename: " + this.state.filename, ToastAndroid.SHORT);
    }

    WavAudioRecord.setPath("/" + this.state.filename + ".wav");

    // If promise is not resolved, recoring still will save.
    // If for some reason the saving process fails,
    // user will be redirected to main menu and file will be lost. (For now).
    WavAudioRecord.saveRecording()
    .then(function(resolvedVal){
      // on promise resolve
      ToastAndroid.show('Rec Saved', ToastAndroid.SHORT);
    },function(rejectVal){
      // on promise reject
      ToastAndroid.show('Rec NOT Saved', ToastAndroid.SHORT);
    })
    .catch(function(err){
      ToastAndroid.show(err.toString(), ToastAndroid.SHORT);
    });

    // take user to main menu after executing 'save' function
    this.props.navigation.navigate('MainMenu');
  }

  render() {
    return (
      <View style={styles.container}>
        <StatusBar
          backgroundColor="#0288D1"
          barStyle="light-content"
        />

        <View style={styles.formContainer}>
          <TextInput
            style={styles.formText}
            placeholder="Name"
            onChangeText={(filename) => this.setState({ filename })}
          />

          <View style={styles.categoryContainer}>
            <Text style={styles.formText}>Select category</Text>

            <TouchableOpacity style={styles.categoryButton}
              onPress={this.onPressSave}>
              <Text style={styles.buttonText}>+</Text>
            </TouchableOpacity>
          </View>

        </View>

        <View style={styles.buttonContainer}>
          <TouchableOpacity style={styles.bigButton}
            onPress={this.onPressSave}>
            <Text style={styles.buttonText}>Save</Text>
          </TouchableOpacity>

          <TouchableOpacity style={[styles.bigButton, {backgroundColor: '#F44336'}]}
            onPress={this.onPressSave}>
            <Text style={styles.buttonText}>Cancel</Text>
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
  formContainer: {
    flex: 2,
    justifyContent: 'center',
    alignItems: 'center',
  },
  categoryContainer: {
    flexDirection: 'row',
    marginTop: 30
  },
  buttonContainer: {
    flex: 1,
    width: 320,
    justifyContent: 'flex-start',
  },
  formText: {
    alignSelf: 'stretch',
    fontSize: 32
  },
  categoryButton: {
    width:50,
    height: 50,
    marginLeft: 30,
    backgroundColor: 'yellow',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#03A9F4'
  },
  bigButton: {
    height: 70,
    marginBottom: 15,
    alignSelf: 'stretch',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#03A9F4'
  },
  buttonText: {
    fontSize: 36,
    color: '#FFFFFF'
  },
});
