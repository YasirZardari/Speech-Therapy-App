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
import CategoryScreen from '../screens/CategoryScreen';

var CategoryArray = []; //fileManager.getAllCategories();

var CategoryScreens = [new CategoryScreen()]
type Props = {};

class CategoriesScreen extends Component<Props> {
  constructor(props) {
    super(props)
    this.state = {
      temp: '',
    };

    fileManager.getAllCategories()
    .then(function(returnedCategories){
      var jsonCat = JSON.parse(returnedCategories);
      for(var i = 0; i < jsonCat.length; i++) {
        if(!this.alreadyInArray(CategoryArray,jsonCat[i])) {
          CategoryArray.push(jsonCat[i]);
        }
      }
      this.setState({CategoryArray});

    }.bind(this));
  }

  onPressCategory = () => {
    this.props.navigation.navigate('CategoryScreen');
  }

  alreadyInArray = function (array,str) {
    for(var i = 0; i < array.length; i++) {
      if (array[i] === str) {
        return true;
      }
    }
    return false;
  }

  AddItemsToArray = () => {
    if (this.state.temp == ""){
      ToastAndroid.show('Please enter a name for your new category', ToastAndroid.SHORT);
      return;
    }
    if (this.alreadyInArray(CategoryArray,this.state.temp)) {
      ToastAndroid.show('Category already exists', ToastAndroid.SHORT);
      return;
    }
    //Adding Items To Array.
    CategoryArray.push(this.state.temp.toString());
    fileManager.createCategory(this.state.temp);

    this.setState({CategoryArray});
    this.state.temp = "";
    ToastAndroid.show('New Category Created', ToastAndroid.SHORT);
  }

  RemoveItemFromArray = (itemToDelete) => {
    for (var i=CategoryArray.length-1; i>=0; i--) {
      if (CategoryArray[i] === itemToDelete) {
        CategoryArray.splice(i, 1);
      }
    }
    this.setState({CategoryArray});
  }

  deleteCategory = (stringToDelete) => {
    Alert.alert(
      "Warning",
      "Are you sure you want to delete this category?",
      [
        { text: "Cancel",onPress:() => console.log('Cancel Pressed'),
        style:'cancel'},
        {text: "OK",onPress:() =>
          {
            fileManager.deleteCategory(stringToDelete);
            this.RemoveItemFromArray(stringToDelete);
          }
      }
      ], {cancelable:false}
    );
  }
  _keyExtractor = (item, index) => item.id;

     render() {
       return (
         <List containerStyle = {{
           marginTop:0,
          marginBottom:80,borderTopWidth:0,borderBottomWidth:0}}>
        <TextInput
            value = {this.state.temp}
            underlineColorAndroid='transparent'
            autoCorrect = {false}
            onChangeText={TextInputValue => this.setState({temp : TextInputValue })}
            placeholder="Tap Here To Name A New Category"
            autoCapitalize='words'
            style={styles.enterText}
        />
        <Button
        title="Tap Here To Confirm This New Category" onPress={this.AddItemsToArray}
        style={{backgroundColor: '#52b2d8'}}
        />
          <FlatList
            data = {CategoryArray}
            extraData={this.state}
            keyExtractor={this._keyExtractor}
            //id={item.id}
            renderItem={({item}) => {
              return (
              <ListItem
                  title = {item}
                  titleStyle = {styles.categoryText}
                  onPress={ this.onPressCategory }
                  rightIcon = {
                    <Icon
                      raised
                      name="trash"//try changing to ei-trash if trash doesnt work
                      size={40}
                      onPress= {
                        () => this.deleteCategory(item)
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
export default CategoriesScreen;


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
  categoryText: {
    fontSize:23,
    padding:22,
    textAlign:'left',
    fontFamily: 'sans-serif-condensed'

  }
})
