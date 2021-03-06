import React, { Component } from 'react';
import {
    StyleSheet,
    Alert,
    Text,
    View,
    FlatList,
    Dimensions,
    TextInput,
    Button,
    NativeModules,
    TouchableOpacity,
    TouchableHighlight,
    ToastAndroid,
    AsyncStorage
} from 'react-native';
const fileManager = NativeModules.FileManager;
import {List, ListItem} from 'react-native-elements';
import Icon from 'react-native-vector-icons/EvilIcons';
import { MenuProvider } from 'react-native-popup-menu';
import {
  Menu,
  MenuOptions,
  MenuOption,
  MenuTrigger,
} from 'react-native-popup-menu';
const FAV_KEY = "recordingsInFavourites";
const Sound = require('react-native-sound');

type Props = {};

class FavouritesScreen extends Component<Props> {

  constructor(props) {
    super(props)

     this.state = {
      JsonDataForList: [],
     }
    this.getFavourites()
    .then((val) =>{
      //ToastAndroid.show(val, ToastAndroid.SHORT);
    });
  }

  async getFavourites() {
    try
    {
        dataStr = await AsyncStorage.getItem(FAV_KEY);

        if (dataStr !== null)
        {
          dataJson = JSON.parse(dataStr);
          this.setState({ JsonDataForList: dataJson });
        }
    }
     catch(error)
     {

     }

    return dataStr;
  }



  async tryRenameInFavourites(valueToRename, newName) {
    var dataStr;
    var dataJson = [];
    var objectToModify;
    var objectPosition = 0;

    try {
        dataStr = await AsyncStorage.getItem(FAV_KEY);

        if (dataStr !== null) {
          dataJson = JSON.parse(dataStr);
        }
    } catch(error) {

    }

    for(var i = 0; i < dataJson.length; i++) {
      if (dataJson[i].filename === valueToRename) {
        objectToModify = dataJson[i];
        objectPosition = i;
      }
    }

    // Create new object to put into storage
    var newPath = objectToModify.path.substring( 0, objectToModify.path.indexOf( valueToRename ) ) + newName;
    objectToModify.filename = newName;
    objectToModify.path = newPath;
    dataJson[objectPosition] = objectToModify;

    dataStr = JSON.stringify(dataJson);

    try {
      await AsyncStorage.setItem(FAV_KEY, dataStr);
    } catch (error) {
      // Error saving data
    }
    try
    {
        dataStr2 = await AsyncStorage.getItem(FAV_KEY);

        if (dataStr2 !== null)
        {
          dataJson2 = JSON.parse(dataStr2);
          this.setState({ JsonDataForList: dataJson2 });
        }
    }
     catch(error)
     {

     }
  }

  async tryChangeCategoryInFavourites(filename, newCategory) {
    var dataStr;
    var dataJson = [];
    var objectToModify;
    var objectPosition = 0;

    try {
        dataStr = await AsyncStorage.getItem(FAV_KEY);

        if (dataStr !== null) {
          dataJson = JSON.parse(dataStr);
        }
    } catch(error) {

    }

    for(var i = 0; i < dataJson.length; i++) {
      if (dataJson[i].filename === valueToRename) {
        objectToModify = dataJson[i];
        objectPosition = i;
      }
    }

    // Create new object to put into storage
    var newPath = "/" + newCategory + "/" + filename;
    objectToModify.path = newPath;
    dataJson[objectPosition] = objectToModify;

    dataStr = JSON.stringify(dataJson);

    try {
      await AsyncStorage.setItem(FAV_KEY, dataStr);
    } catch (error) {
      // Error saving data
    }
    try
    {
        dataStr2 = await AsyncStorage.getItem(FAV_KEY);

        if (dataStr2 !== null)
        {
          dataJson2 = JSON.parse(dataStr2);
          this.setState({ JsonDataForList: dataJson2 });
        }
    }
     catch(error)
     {

     }

  }

  async getFavourites() {
    try
    {
        dataStr = await AsyncStorage.getItem(FAV_KEY);

        if (dataStr !== null)
        {
          dataJson = JSON.parse(dataStr);
          this.setState({ JsonDataForList: dataJson });
        }
    }
     catch(error)
     {

     }

    return dataStr;
  }

  async removeFromFavourites(valueToRemove) {
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
      if (dataJson[i].filename === valueToRemove) {
        // If element in array - remove it
        dataJson.splice(i,1);
      }
    }

    dataStr = JSON.stringify(dataJson);

    try {
      await AsyncStorage.setItem(FAV_KEY, dataStr);
    } catch (error) {
      // Error saving data
    }
    try
    {
        dataStr2 = await AsyncStorage.getItem(FAV_KEY);

        if (dataStr2 !== null)
        {
          dataJson2 = JSON.parse(dataStr2);
          this.setState({ JsonDataForList: dataJson2 });
        }
    }
     catch(error)
     {

     }

    //ToastAndroid.show(dataStr, ToastAndroid.SHORT);
  }

  removeFavouriteWarning = (favouriteToRemove) => {
    Alert.alert(
      "Warning",
      "Are you sure you want to remove '" + favouriteToRemove + "' from your favourites?",
      [
        { text: "Cancel",onPress:() => console.log('Cancel Pressed'),
        style:'cancel'},
        {text: "OK",onPress:() =>
          {
            this.removeFromFavourites(favouriteToRemove);
          }
      }

      ], {cancelable:false}
    );
  }

  onPressRecording= (val) => {
    var n = val.lastIndexOf('/');
    var wavFile = val.substring(n + 1);
    var categoryDir = val.substring(1,n + 1);
    var root = '/sdcard/MessageBank/';
    categoryDir = root + categoryDir;
    wavFile += '.wav';

    var whoosh = new Sound(wavFile, categoryDir, (error) => {

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
    //ToastAndroid.show(categoryDir, ToastAndroid.SHORT);
    //ToastAndroid.show(wavFile, ToastAndroid.SHORT);
  }

     render() {
       return (
          <List containerStyle = {{
            marginTop:0,
           marginBottom:80,borderTopWidth:0,borderBottomWidth:0}}>
          <FlatList
            data = {this.state.JsonDataForList}
            extraData={this.state}
            renderItem={({item}) =>{
              return (
               <ListItem
                   title = {item.filename}
                   titleStyle = {styles.recordingText}
                   onPress={() => {this.onPressRecording(item.path)}}
                   keyExtractor={(item, index) => index}
                   rightIcon = {
                    <MenuProvider style={styles.menuStyle}>
                     <Menu>
                     <MenuTrigger>
                     <Icon
                       name="pencil"
                       size={40}
                     />
                     </MenuTrigger>
                     <MenuOptions>
                       <MenuOption onSelect={() => alert(`RenameFunctionGoesHere`)} >
                         <Text style={{color: 'blue'}}>Rename</Text>
                       </MenuOption>
                       <MenuOption onSelect={() => this.removeFavouriteWarning(item)} >
                         <Text style={{color: 'red'}}>Delete</Text>
                       </MenuOption>
                       <MenuOption onSelect={() => alert(`error`)} disabled={true} text='Filler' />
                     </MenuOptions>
                     </Menu>
                     </MenuProvider>
                  }
                  containerStyle = {styles.container}
                  />
              )
            }
          }
          />
        </List>
      );
  }
}
export default FavouritesScreen;


const styles = StyleSheet.create({
  container: {
  borderBottomWidth :1,
  height:80,
  padding:25
  },
    menuStyle: {
    flex: 1,
    paddingTop: 17,
  },
  enterText: {
    textAlign: 'center',
    height: 45,
    width:350,
    borderTopWidth:0,
    fontFamily:'sans-serif-condensed'
  },
  recordingText: {
    fontSize:23,
    padding:22,
    textAlign:'left',
    fontFamily: 'sans-serif-condensed'

  }
})
