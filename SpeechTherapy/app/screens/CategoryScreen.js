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
    TouchableOpacity,
    TouchableHighlight,
    ToastAndroid
} from 'react-native';
import { List, ListItem} from 'react-native-elements';

var RecordingArray = ["Recording",
"Recording",
"Recording",
"Recording",
"Recording",
"Recording"];

deleteCategory=(stringToDelete)=>{
  Alert.alert(
    "Warning",
    "Are you sure you want to delete this category?",
    [
      {text: "Cancel",onPress:() => console.log('Cancel Pressed'),
      style:'cancel'},
      {text: "OK",onPress:() => {this.RemoveItemFromArray}}
    ], {cancelable:false}
  );
}

class CategoryScreen extends Component<Props> {

  constructor(props) {
    super(props)
    this.state = {temp: ''}
  }
  render(){
    return(
      <List containerStyle = {{
        marginTop:0,
       marginBottom:80}}>
      <FlatList
        data = {RecordingArray}
        extraData={this.state}
        keyExtractor={this._keyExtractor}
        //id={item.id}
        renderItem={({item}) => {
          return (
          <ListItem
               // <TouchableHighlight
               //  onPress={() => this.onPressCategory(item)}>
               //   <Text style={styles.categoryText}>{item}</Text>
               // </TouchableHighlight>
              title = {item}
              titleStyle = {{fontSize:25}}
              rightIcon = {
                <Icon
                  name="trash"
                  size={40}
                  onPress= {this.deleteCategory}
                />
              }
              containerStyle = {{borderBottomWidth :1},{height:80}}
              />
            )
        }}
      />
      </List>
    )
  }
}
export default CategoryScreen;
