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
    ScrollView
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
import DialogAndroid from 'react-native-dialogs';

import { StackNavigator } from 'react-navigation';

const FileManager = NativeModules.FileManager;
const Sound = require('react-native-sound');



type Props = {};
class CategoryScreen extends Component<Props> {
  
  constructor(props) {
    super(props);

    this.state = {
      flatListData: null,
      catName: null
    };

    this.onPressRecording = this.onPressRecording.bind(this);
    this.moveMessage = this.moveMessage.bind(this);
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


  moveMessage(message) {

    FileManager.moveMessageToUncategorised(this.state.catName, message)
    .then(
      function(messages) {

        this.loadData(this.state.catName);
        this.setState({ 
          refresh: !this.state.refresh
        });
        this.forceUpdate();

      }
    .bind(this));
   
  }


  removeRecording=(stringToDelete)=>{

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
        {text: "OK",onPress: () => this.moveMessage(stringToDelete),
        }
      ], {cancelable:false}
    );
  }

  renameRecording = (toRename) => {

    this.setState({
      fileToRename: toRename
    });

    this.showDialog(toRename);

  }

  showDialog = function (toRename) {
    var dialog = new DialogAndroid();
    dialog.set({
      title: 'Rename File',
      content: 'New file name',
      positiveText: 'OK',
      negativeText: 'Cancel',
      input: {
        callback: this.dialogInputCallback,
      }
    });
    dialog.show();
  }

  dialogInputCallback = (input) => {

    if (input !== '') {

      FileManager.renameMessageInCategory(this.state.catName, this.state.fileToRename, input + '.wav')
      .then(function(messages) {
        //ToastAndroid.show(messages, ToastAndroid.SHORT);
      }.bind(this));

      this.loadData(this.state.catName);
      this.setState({ 
        refresh: !this.state.refresh
      });
      this.forceUpdate();

    }

  }

  deleteRecording = (file) => {
     FileManager.deleteFile(this.state.catName, file)
      .then(function(messages) {
        ToastAndroid.show("Deleted", ToastAndroid.SHORT);
      }.bind(this));

      this.loadData(this.state.catName);
      this.setState({ 
        refresh: !this.state.refresh
      });
      this.forceUpdate();
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

                  <ScrollView style={{ maxHeight: 200 }}>

                    <MenuOption value={1} onSelect={() => this.renameRecording(item)} >
                      <Text style={{color: 'blue'}}>Rename</Text>
                    </MenuOption>

                    <MenuOption value={2} onSelect={() => this.removeRecording(item)} >
                      <Text style={{color: 'red'}}>Uncategorise File</Text>
                    </MenuOption>

                    <MenuOption value={3} onSelect={() => this.deleteRecording(item)} >
                      <Text style={{color: 'red'}}>Delete</Text>
                    </MenuOption>

                  </ScrollView>
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
    height:120
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