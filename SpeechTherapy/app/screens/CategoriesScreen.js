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
import { StackNavigator } from 'react-navigation';

var CategoryArray = []; //fileManager.getAllCategories();

var CategoryScreens = [new CategoryScreen()]
type Props = {};


class CategoriesScreen extends Component<Props> {
  constructor(props) {
    super(props)
    this.state = {
      temp: '',
      isShowing : false
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

  onPressCategory = (cat) => {

    ToastAndroid.show(cat, ToastAndroid.SHORT);
    this.props.navigation.navigate('CategoryScreen', {
      catName: cat,
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
    this.setState({isShowing:false});
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
      "Are you sure you want to delete the category '" + stringToDelete + "'?",
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
            onChangeText={TextInputValue => this.setState({
              temp: TextInputValue,
              isShowing: true,
             })}
            placeholder="Tap Here To Name A New Category"
            placeholderTextColor='white'
            autoCapitalize='words'
            style={styles.enterText}
        />

       </View>
        {!!this.state.isShowing && <View style = {{flex:2}}>
        <TouchableOpacity
          onPress={this.AddItemsToArray}
          style = {styles.button}>
        <Text style = {styles.buttonText}>
            TAP HERE TO CONFIRM THIS NEW CATEGORY
        </Text>

        </TouchableOpacity>

       </View>
     }
    </View>
      <View style = {{flex:2}}>
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
                onPress={ () => this.onPressCategory(item) }
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
    flex: 1,
    alignContent:'stretch',
    color:'white',
    backgroundColor: '#52b2d8',
    fontSize:15,
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

