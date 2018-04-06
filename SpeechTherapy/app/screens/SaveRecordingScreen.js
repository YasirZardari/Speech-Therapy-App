import React, { Component } from 'react';
import {
  StyleSheet,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StatusBar,
  NativeModules,
  ToastAndroid,
  CheckBox,
  AsyncStorage
} from 'react-native';

import DialogAndroid from 'react-native-dialogs';
import { Dropdown } from 'react-native-material-dropdown';


const Sound = require('react-native-sound');
const WavAudioRecord = NativeModules.WavAudioRecord;
const FileManager = NativeModules.FileManager;

const FAV_KEY = "recordingsInFavourites";
var TEMP_FILENAME = "";

// Separating this out because I'm using this in an "if" statement
let valNewCategory = '<New Category>';
let valUncategorized = 'uncategorised';

let categories = [
  { value: valNewCategory, },
];

type Props = {};
class SaveRecordingScreen extends Component<Props> {
  constructor(props) {
    super(props);

    var date = new Date();
    var nowTime = date.getHours() + "-" + date.getMinutes() + "-" + date.getSeconds();
    var nowDate = date.getDay() + "-" + (date.getMonth() + 1) + "-" + date.getFullYear();

    TEMP_FILENAME = nowTime + "_" + nowDate;

    this.state = {
      filename: nowTime + "_" + nowDate,
      category: valUncategorized,
      path: '/' + valUncategorized + "/",
      saveToFav: false,
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

  componentDidMount() {
    this.saveRecording();
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
    } else {
      this.setState({ category: value });
      this.setState({ path: '/' + value + '/'});
    }
  }

  saveRecording = () => {
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
  }

  onPressSave = () => {
    if (this.state.filename !== TEMP_FILENAME) {
      FileManager.renameMessageInCategory(valUncategorized, TEMP_FILENAME + ".wav", this.state.filename + ".wav")
      .then(function(resolve){
        if (this.state.category !== valUncategorized) {
            FileManager.moveMessageToCategoryFromCategory(valUncategorized, this.state.category, this.state.filename + ".wav");
        }
      }.bind(this));
    } else {
      if (this.state.category !== valUncategorized) {
        FileManager.moveMessageToCategoryFromCategory(valUncategorized, this.state.category, this.state.filename + ".wav");
      }
    }

    if (this.state.saveToFav) {
      this.addToFavourites();
    } else {
      this.props.navigation.navigate('MainMenu');
    }
  }

  async addToFavourites() {
    var dataStr;
    var dataJson = [];

    try {
        dataStr = await AsyncStorage.getItem(FAV_KEY);

        if (dataStr !== null) {
          dataJson = JSON.parse(dataStr);
        }
    } catch(error) {

    }

    for(var i = 0; i < dataJson.length; i++) {
      if (dataJson[i].filename === this.state.filename) {
        // If element already in array - remove it
        dataJson.splice(i,1);
      }
    }

    dataJson.push(
      { filename: this.state.filename,
        path: this.state.path + this.state.filename }
    );

    dataStr = JSON.stringify(dataJson);

    try {
      await AsyncStorage.setItem(FAV_KEY, dataStr);
    } catch (error) {
      // Error saving data
    }

    ToastAndroid.show(dataStr, ToastAndroid.SHORT);
    this.props.navigation.navigate('MainMenu');
  }

  onPressRerecord = () => {
    this.props.navigate.goBack('RecordScreen', { go_back_key: this.props.navigation.state.key });
  }

  onPressReplay = () => {
    ToastAndroid.show(TEMP_FILENAME, ToastAndroid.SHORT);
    var whoosh = new Sound(TEMP_FILENAME + ".wav", '/sdcard/MessageBank/' + valUncategorized, (error) => {

      if (error) {
        ToastAndroid.show("Error", ToastAndroid.SHORT);
        return;
      }

      whoosh.play((success) => {
        if(success) {
          ToastAndroid.show("Playing", ToastAndroid.SHORT);
        } else {
          ToastAndroid.show("Not Playing", ToastAndroid.SHORT);
        }
      });

    });
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
            onPress={this.onPressReplay}>
            <Text style={styles.buttonText}>Replay</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.replayContainerButton}
            onPress={() => goBack()}
            >
            <Text style={styles.buttonText}>Re-Record</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.saveContainer}>
          <TextInput
            style={styles.formText}
            autoCapitalize= 'words'
            placeholder="Tap here to name your recording.."
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

          <View style={styles.checkboxContainer}>
            <CheckBox
              value={this.state.saveToFav}
              onValueChange={() => this.setState({ saveToFav: !this.state.saveToFav })}
            />

            <Text style={{marginTop: 5, fontSize: 16}}> Add to Favourites</Text>
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
    backgroundColor: '#F5FCFF',
  },
  replayContainer: {
    flex: 1,
    paddingLeft: 30,
    paddingRight: 30,
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'stretch',
    backgroundColor: 'skyblue',
  },
  buttonContainer: {
    flexDirection: 'row',
    width: 320,
    paddingTop: 60,
    justifyContent: 'center',
    alignContent: 'center',
  },
  dropdownContainer: {
    paddingTop: 8,
    alignSelf: 'stretch',
  },
  checkboxContainer: {
    paddingTop: 16,
    alignSelf: 'stretch',
    flexDirection: 'row',
  },
  formText: {
    alignSelf: 'stretch',
    fontSize: 24,
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
