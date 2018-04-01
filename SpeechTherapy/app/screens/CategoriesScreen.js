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
  _keyExtractor = (item, index) => index.toString();
   render() {
       return (
         <View style = {styles.container}>
        <View style = {{flex:1}}>
         <View style = {{flex:1,padding:5, alignItems:'stretch'}}>
          <TextInput
            value = {this.state.temp}
            underlineColorAndroid='transparent'
            autoCorrect = {false}
            multiLine = {false}
            onChangeText={TextInputValue => this.setState({temp: TextInputValue })}
            placeholder="Tap Here To Name A New Category"
            autoCapitalize='words'
            style={styles.enterText}
        />
       </View>
        <View style = {{flex:1}}>
        <TouchableOpacity
          onPress={this.AddItemsToArray}
          style = {styles.button}>
        <Text style = {styles.buttonText}>
            TAP HERE TO CONFIRM THIS NEW CATEGORY
        </Text>
        </TouchableOpacity>
       </View>
    </View>
      <View style = {{flex:4}}>
        <FlatList
          style = {{flex:1}}
          data = {CategoryArray}
          extraData={this.state}
          keyExtractor={this._keyExtractor}
          renderItem={({item}) => {
            return (
            <ListItem
                title = {item}
                titleStyle = {styles.categoryText}
                onPress={this.onPressCategory}
                rightIcon = {
                  <Icon
                    raised
                    name="trash"
                    size={40}
                    onPress= {() =>this.deleteCategory(item)}
                  />
                }
            />
         )}}
        />
        </View>
    </View>
  );}
}
export default CategoriesScreen;


const styles = StyleSheet.create({
  container: {
  flex:1
  },
  enterText: {
    alignContent:'stretch',
    textAlign: 'center',
    fontFamily:'sans-serif-condensed'
  },
  categoryText: {
    fontSize:23,
    padding:22,
    textAlign:'left',
    fontFamily: 'sans-serif-condensed'
  },
  button: {
   backgroundColor: '#52b2d8',
   width:Dimensions.get('window').width,
   height:55,
   elevation:4,
   justifyContent:'center',
   alignItems:'center'
  },
  buttonText: {
    color:'white',
    fontFamily:'sans-serif-condensed',
    fontWeight:'bold'
  }
})
