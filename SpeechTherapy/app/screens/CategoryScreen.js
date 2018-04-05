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
import { StackNavigator } from 'react-navigation';

const FileManager = NativeModules.FileManager;


type Props = {};
class CategoryScreen extends Component<Props> {
  
  constructor(props) {
    super(props);

    this.state = {
      flatListData: null,
      catName: null
    };
  }

  componentWillMount() {
    const { params } = this.props.navigation.state;
    const catName = params ? params.catName : null;
    this.loadData(catName);
  }

  loadData(name) {
  
    FileManager.getAllMessageFilePathFromCategory(name)
    .then(function(messages) {

      this.setState({
        flatListData: JSON.parse(messages)
      });

    }.bind(this));

    this.setState({
        catName: name
    });

  }

  moveMessage(message) {
    ToastAndroid.show(this.state.catName, ToastAndroid.SHORT);

    FileManager.moveMessageToRootFromCategory(this.state.catName, message)
    .then(
      function(messages) {
        ToastAndroid.show("callback", ToastAndroid.SHORT);
      }
    );
    
  }

  removeRecording=(stringToDelete)=>{

    Alert.alert(
      "Warning",
      "Are you sure you want to remove "+ stringToDelete + " from this category?",
      [
        {text: "Cancel",onPress:() => console.log('Cancel Pressed'),
        style:'cancel'},
        {text: "OK",onPress: () => this.moveMessage(stringToDelete),
        }
      ], {cancelable:false}
    );
  }

  render() {

    if (!this.state.flatListData) {
      return ( 
      <List containerStyle = {{
       marginTop:0,
       marginBottom:80,
       borderTopWidth:0,
       borderBottomWidth:0}} >
      
      </List> );
    }

    return (
      <List containerStyle = {{
        marginTop:0,
       marginBottom:80,
       borderTopWidth:0,
       borderBottomWidth:0}}>
      <FlatList
        data = {this.state.flatListData}
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
                  onPress= {() => this.removeRecording(item)}
                />
              }
              containerStyle = {styles.container}
              />
            )
        }}
      />
      </List>
    );

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