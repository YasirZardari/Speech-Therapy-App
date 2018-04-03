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
import { List, ListItem } from 'react-native-elements';
import Icon from 'react-native-vector-icons/EvilIcons';
const Sound = require('react-native-sound');

var RecordingArray = [];

var Category;

/*var RecordingArray = ["Recording 1",
"Recording 2",
"Recording 3",
"Recording 4",
"Recording 5",
"Recording 6"];
*/



type Props = {};
class CategoryScreen extends Component<Props> {
  constructor(props) {
    super(props);
    this.state = {  }
  
    
    
    

    
    //this.props.navigation.navigate('MainMenu'); // testing
  }
  
  componentWillMount() {
     RecordingArray = [];
     Category = this.props.navigation.state.params.str;

     fileManager.getAllMessageFilePathFromCategory(Category)
    .then(function(returnedCategories){
      var jsonCat = JSON.parse(returnedCategories);
      for(var i = 0; i < jsonCat.length; i++) {
        if(!this.alreadyInArray(RecordingArray,jsonCat[i])) {
          RecordingArray.push(jsonCat[i]);
        }
      }
      this.setState({RecordingArray});

    }.bind(this));
	   //ToastAndroid.show(Category, ToastAndroid.SHORT);
  }

  onPressRecording = (val) => {
    //ToastAndroid.show("Pressed " + val, ToastAndroid.SHORT);
    var dir = '/sdcard/MessageBank/' + Category;
    var whoosh = new Sound(val, dir, (error) => {

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

  alreadyInArray = function (array,str) {
    for(var i = 0; i < array.length; i++) {
      if (array[i] === str) {
        return true;
      }
    }
    return false;
  }

  RemoveItemFromArray = (itemToDelete) => {
    for (var i=RecordingArray.length-1; i>=0; i--) {
      if (RecordingArray[i] === itemToDelete) {
        RecordingArray.splice(i, 1);
      }
    }
    this.setState({RecordingArray});
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
      "Are you sure you want to remove "+ stringToDelete + " from this category?",
      [
        {text: "Cancel",onPress:() => console.log('Cancel Pressed'),
        style:'cancel'},
        {text: "OK",onPress:() => //fileManager.deleteCategory(stringToDelete)}
        {this.RemoveItemFromArray(stringToDelete)}}
      ], {cancelable:false}
    );
  }

  render(){
    return(
      <List containerStyle = {{
        marginTop:0,
       marginBottom:80,
       borderTopWidth:0,
       borderBottomWidth:0}}>
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
              onPress={() => {this.onPressRecording(item)}}
              rightIcon = {
                <Icon
                  name="minus"
                  size={40}
                  onPress= {() =>this.removeRecording(item)}
                />
              }
              containerStyle = {styles.container}
              />
            )
        }}
      />
      </List>
    )
  }
}
export default CategoryScreen;

const styles = StyleSheet.create({
  container: {
    borderBottomWidth :1,
    height:80
  },
  recordingText: {
    fontSize:23,
    padding:22,
    textAlign:'left',
    fontFamily: 'sans-serif-condensed'

  }
});
