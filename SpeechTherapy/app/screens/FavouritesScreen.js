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
    ToastAndroid
} from 'react-native';
const fileManager = NativeModules.FileManager;
import {List, ListItem} from 'react-native-elements';
import Icon from 'react-native-vector-icons/EvilIcons';



var RecordingArray = //fileManager.getAllCategories();
 ["Greetings",
"Food/Drink",
"Questions",
"Goodbyes",
"About Myself",
"Weather"];

type Props = {};

class FavouritesScreen extends Component<Props> {

  constructor(props) {
    super(props)

  }
  onPressRecording= () => {
    ToastAndroid.show('Playing Recording', ToastAndroid.SHORT);
  }
  RemoveItemFromArray=(itemToDelete)=>{
    for (var i=RecordingArray.length-1; i>=0; i--) {
      if (RecordingArray[i] === itemToDelete) {
        RecordingArray.splice(i, 1);
      }
    }
    this.setState({RecordingArray});
  }
  removeRecording=(stringToDelete)=>{
    Alert.alert(
      "Warning",
      "Are you sure you want to unfavourite this?",
      [
        { text: "Cancel",onPress:() => console.log('Cancel Pressed'),
        style:'cancel'},
        {text: "OK",onPress:() => //fileManager.deleteCategory(stringToDelete)}
        {this.RemoveItemFromArray(stringToDelete)}}
      ], {cancelable:false}
    );
  }
  _keyExtractor = (item, index) => index.toString();

     render() {
       return (
         <List containerStyle = {{
           marginTop:0,
          marginBottom:80,borderTopWidth:0,borderBottomWidth:0}}>
          <FlatList
            data = {RecordingArray}
            extraData={this.state}
            keyExtractor={this._keyExtractor}
            //id={item.id}
            renderItem={({item}) => {
              return (
              <ListItem
                  title = {item}
                  titleStyle = {styles.recordingText}
                  onPress={this.onPressRecording}
                  rightIcon = {
                    <Icon
                      raised
                      name="minus"//try changing to ei-trash if trash doesnt work
                      size={40}
                      onPress= {
                        () =>this.removeRecording(item)
                      }
                    />
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
