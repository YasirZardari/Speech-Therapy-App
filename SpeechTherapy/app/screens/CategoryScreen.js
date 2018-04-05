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
import { MenuProvider } from 'react-native-popup-menu';
import {
  Menu,
  MenuOptions,
  MenuOption,
  MenuTrigger,
} from 'react-native-popup-menu';
import { List, ListItem } from 'react-native-elements';
import Icon from 'react-native-vector-icons/EvilIcons';

import { StackNavigator } from 'react-navigation';

const FileManager = NativeModules.FileManager;
const Sound = require('react-native-sound');
const uncat = 'uncategorised';



type Props = {};
class CategoryScreen extends Component<Props> {
  
  constructor(props) {
    super(props);

    this.state = {
      flatListData: null,
      catName: null,
      moveSelection: null,
      fileToMove: null
    };

    this.onPressRecording = this.onPressRecording.bind(this);
    this.moveMessage = this.moveMessage.bind(this);
  }

  componentWillMount() {
    const { params } = this.props.navigation.state;
    const catName = params ? params.catName : null;
    this.loadData(catName);
  }


  prepareMove(file){
    FileManager.getAllCategories()
    .then(function(message) {
      this.setState({
        moveSelection: JSON.parse(message),
        fileToMove: file
      });
    }.bind(this));
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


  onPressRecording = (val) => {
    //ToastAndroid.show("Pressed " + val, ToastAndroid.SHORT);
    var dir = '/sdcard/MessageBank/' + this.state.catName;
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

  finaliseMove(result) {
    this.loadData(this.state.catName);
    this.setState({ 
    refresh: !this.state.refresh,
    moveSelection: null,
    fileToMove: null
    });
    this.forceUpdate();
  }

  deleteRecording(file){
    FileManager.deleteFile(this.state.catName, file);
  }


  moveMessage(destination, file) {
    if(destination === uncat)
      FileManager.moveMessageToUncategorised(this.state.catName, file)
      .then(this.finaliseMove(result).bind(this));
    else
      FileManager.moveMessageToCategoryFromCategory(this.state.catName, destination, file)
      .then(this.finaliseMove(result).bind(this));
   
  }


  uncategoriseRecording=(stringToDelete)=>{

    if (this.state.catName === 'uncategorised') {
      ToastAndroid.show('Cannot move this', ToastAndroid.SHORT);
      return;
    }

    Alert.alert(
      "Warning",
      "Are you sure you want to remove "+ stringToDelete + " from " + this.state.catName,
      [
        {text: "Cancel",onPress:() => console.log('Cancel Pressed'),
        style:'cancel'},
        {text: "OK",onPress: () => this.moveMessage(uncat, stringToDelete),
        }
      ], {cancelable:false}
    );
  }

  renameRecording = (toRename) => {

    

  }

  render() {

    if (!this.state.flatListData) {
      return ( 
      <List containerStyle = {{
       marginTop:0,
       marginBottom:80,
       borderTopWidth:0,
       borderBottomWidth:0}} >
      
      </List> 
      );
    }

    if(this.state.moveSelection){
      return (
        <FlatList
          data = {this.state.moveSelection}
          extraData={this.state}
          keyExtractor={this._keyExtractor}
          renderItem={({item}) =>{
            return (
              <ListItem
                title = {item}
                titleStyle = {styles.recordingText}
                onPress={() => {this.moveMessage(item, this.fileToMove)}}
                containerStyle = {styles.container}
                />
            )
          }}
          />
      );
    }

    return(
      <FlatList
        data = { this.state.flatListData }
        extraData={ this.state.refresh }
        keyExtractor={ this._keyExtractor }
        //id={ item.id }
        renderItem={({item}) => {
          return (
          <ListItem
              title = {item}
              titleStyle = { styles.recordingText }
              onPress={() => { this.onPressRecording(item)} }
              rightIcon = {
                <MenuProvider style={styles.container2}>
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
                  <MenuOption onSelect={() => this.uncategoriseRecording(item)} >
                    <Text style={{color: 'blue'}}>Uncategorise File</Text>
                  </MenuOption>
                  <MenuOption onSelect={() => this.prepareMove(item)} >
                    <Text style={{color: 'blue'}}>Move file to a different category</Text>
                  </MenuOption>
                  <MenuOption onSelect={() => this.deleteRecording(item)} >
                    <Text style={{color: 'red'}}>Delete File</Text>
                  </MenuOption>
                  <MenuOption onSelect={() => alert(`Not called`)} disabled={true} text='Filler' />
                </MenuOptions>
                </Menu>
                </MenuProvider>
              }
              containerStyle = {styles.container}
              />
            )
        }}
      />
    )
  }

}
export default CategoryScreen;

const styles = StyleSheet.create({
  container: {
    borderBottomWidth :1,
    height:80
  },
  container2: {
    flex: 1,
    paddingTop: 17,
  },
  recordingText: {
    fontSize:23,
    padding:22,
    textAlign:'left',
    fontFamily: 'sans-serif-condensed'

  }
});