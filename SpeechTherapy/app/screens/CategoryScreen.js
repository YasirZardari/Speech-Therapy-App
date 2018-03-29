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
import { List, ListItem } from 'react-native-elements';
import Icon from 'react-native-vector-icons/EvilIcons';

var RecordingArray = ["Recording 1",
"Recording 2",
"Recording 3",
"Recording 4",
"Recording 5",
"Recording 6"];

type Props = {};
class CategoryScreen extends Component<Props> {
  constructor(props) {
    super(props);
    this.state = {  }


    //this.props.navigation.navigate('MainMenu'); // testing
  }

  RemoveItemFromArray = (itemToDelete) => {
    for (var i=RecordingArray.length-1; i>=0; i--) {
      if (RecordingArray[i] === itemToDelete) {
        RecordingArray.splice(i, 1);
      }
    }
    this.setState({RecordingArray});
  }

  removeRecording = (stringToDelete) => {
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
