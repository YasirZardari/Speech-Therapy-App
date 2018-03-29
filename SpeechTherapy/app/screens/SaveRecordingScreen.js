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

import DialogAndroid from 'react-native-dialogs';
import { Dropdown } from 'react-native-material-dropdown';


const Sound = require('react-native-sound');
const WavAudioRecord = NativeModules.WavAudioRecord;
const FileManager = NativeModules.FileManager;

// Separating this out because I'm using this in an "if" statement
let valNewCategory = '<New Category>';
let valUncategorized = '<All Files>';

let categories = [
  { value: valUncategorized, },
  { value: valNewCategory, },
];

type Props = {};
class SaveRecordingScreen extends Component<Props> {
  constructor(props) {
    super(props);

    this.state = {
      filename: 'speechrec',
      category: valUncategorized,
      path: '',
    }

    FileManager.getAllCategories()
    .then(function(returnedCategories){
      var jsonCat = JSON.parse(returnedCategories);
      for(var i = 0; i < jsonCat.length; i++) {
        if(!this.alreadyInArray(categories,jsonCat[i])) {
            categories.push({ value: jsonCat[i] });
        }
      }
    }.bind(this));

    this.onPressSave = this.onPressSave.bind(this);
  }

  alreadyInArray = function (array,str) {
    for(x in array) {
      if (array[x].value === str) {
        return true;
      }
    }
    return false;
  }

  showDialog = function () {
    var dialog = new DialogAndroid();
    dialog.set({
      title: 'Create a category',
      content: 'New category name',
      positiveText: 'OK',
      negativeText: 'Cancel',
      input: {
        callback: this.dialogInputCallback,
      }
    });
    dialog.show();
  }

  onCreateNewCategory = () => {
    this.showDialog();
  }

  dialogInputCallback = (input) => {
    if (input !== '') {
      FileManager.createCategory(input);
      var newObject = { value: input };
      categories.push(newObject);
    }
  }

  onCategoryChosen = (value,index,data) => {
    if (value === valNewCategory) {
      this.onCreateNewCategory();
    } else if (value === valUncategorized) {
      this.setState({ category: '', path: '' });
    } else {
      this.setState({ category: value });
      this.setState({ path: '/' + value + '/'});
    }
  }

  onPressSave = () => {
    // set filepath, if field empty - give default name "speechrec"
    if (this.state.filename === '') {
      this.setState({ filename:'speechrec' });
    }

    WavAudioRecord.setPath(this.state.path + this.state.filename + ".wav");

    // If promise is not resolved, recoring still will save.
    // If for some reason the saving process fails,
    // user will be redirected to main menu and file will be lost. (For now).
    WavAudioRecord.saveRecording()
    .then(function(resolvedVal){
      // on promise resolve
      ToastAndroid.show('Recording Saved', ToastAndroid.SHORT);
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

  onPressRerecord = () => {
    this.props.navigate.goBack('RecordScreen', { go_back_key: this.props.navigation.state.key });
  }

  onPressReplay = () => {
    var whoosh = new Sound('/sdcard/MessageBank/Test1.wav')
  }

render() {
    const {goBack} = this.props.navigation;

    return (
      <View style={styles.container}>
        <StatusBar
          backgroundColor="#52b2d8"
          barStyle="light-content"
        />

        <View style={styles.replayContainer}>
          <TouchableOpacity style={styles.replayContainerButton}
            onPress={this.onPressReply}>
            <Text style={styles.buttonText}>Replay</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.replayContainerButton}
            onPress={() => goBack()}>
            <Text style={styles.buttonText}>Re-Record</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.saveContainer}>
          <TextInput
            style={styles.formText}
            autoCapitalize= 'words'
            placeholder="Name"
            onChangeText={(filename) => this.setState({ filename })}
          />

          <View style={styles.dropdownContainer}>
            <Dropdown
              label='Assign a Category'
              value={valUncategorized}
              data={categories}
              onChangeText={this.onCategoryChosen}
            />
          </View>

          <View style={styles.buttonContainer}>
            <TouchableOpacity style={styles.saveContainerButton}
              onPress={this.onPressSave}>
              <Text style={styles.buttonText}>Save</Text>
            </TouchableOpacity>

            <TouchableOpacity style={[styles.saveContainerButton, {backgroundColor: '#d85454'}]}
              onPress={this.onPressSave}>
              <Text style={styles.buttonText}>Cancel</Text>
            </TouchableOpacity>
          </View>
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
  saveContainer: {
    flex: 2,
    paddingLeft: 30,
    paddingRight: 30,
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'stretch',
    backgroundColor: 'green',
  },
  replayContainer: {
    flex: 1,
    paddingLeft: 30,
    paddingRight: 30,
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'stretch',
    backgroundColor: 'tomato',
  },
  buttonContainer: {
    flexDirection: 'row',
    width: 320,
    justifyContent: 'center',
    alignItems: 'center',
  },
  dropdownContainer: {
    alignSelf: 'stretch',
  },
  formText: {
    alignSelf: 'stretch',
    fontSize: 32,
    fontFamily:'sans-serif-condensed'
  },
  saveContainerButton: {
    flex: 1,
    height: 70,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#52b2d8',
    borderRadius: 10,
    elevation: 5
  },
  replayContainerButton: {
    height: 70,
    marginTop: 10,
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'stretch',
    backgroundColor: '#52b2d8',
    borderRadius: 10,
    elevation: 5
  },
  buttonText: {
    fontSize: 36,
    color: '#FFFFFF',
    fontFamily:'sans-serif-condensed'
  },
});
