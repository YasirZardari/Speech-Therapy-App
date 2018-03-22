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
import {List, ListItem} from 'react-native-elements';
import Icon from 'react-native-vector-icons/EvilIcons'; 
import CategoryScreen from '../screens/CategoryScreen';

var CategoryArray = ["Greetings",
"Food/Drink",
"Questions",
"Goodbyes",
"About Myself",
"Weather"];

var CategoryScreens = [new CategoryScreen()]
type Props = {};
class CategoriesScreen extends Component<Props> {

  constructor(props) {
    super(props)
    this.state = {
      temp: '',
    };
  }
  onPressCategory = () => {
    this.props.navigation.navigate('CategoryScreen')
  }
  AddItemsToArray=()=>{
    if (this.state.temp == ""){
      ToastAndroid.show('Please enter a name for your new category', ToastAndroid.SHORT);
      return;
    }
    //Adding Items To Array.
     CategoryArray.push(this.state.temp.toString());
    this.setState({CategoryArray});
    this.state.temp = "";

    ToastAndroid.show('New Category Created', ToastAndroid.SHORT);
    }
  RemoveItemFromArray=(itemToDelete)=>{
    for (var i=CategoryArray.length-1; i>=0; i--) {
      if (array[i] === this.state.temp.toString()) {
        array.splice(i, 1);
      }
    }
  }
  deleteCategory=(stringToDelete)=>{
    Alert.alert(
      "Warning",
      "Are you sure you want to delete this category?",
      [
        { text: "Cancel",onPress:() => console.log('Cancel Pressed'),
        style:'cancel'},
        {text: "OK",onPress:() => {this.RemoveItemFromArray}}
      ], {cancelable:false}
    );
  }
  _keyExtractor = (item, index) => item.id;

     render() {
       return (
         <List containerStyle = {{
           marginTop:0,
          marginBottom:80}}>
        <TextInput
            value = {this.state.temp}
            onChangeText={TextInputValue => this.setState({temp : TextInputValue })}
            placeholder="Click Here To Name A New Category"
            autoCapitalize='words'
            style={styles.enterText}
        />
        <Button
        title="Click Here To Confirm This New Category" onPress={this.AddItemsToArray}
        style=""
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
                  titleStyle = {{fontSize:25,padding:22,textAlign:'left'}}
                  onPress={this.onPressCategory}
                  rightIcon = {
                    <Icon
                      name="trash" //try changing to ei-trash if trash doesnt work
                      size={40}
                      onPress= {
                        this.deleteCategory
                      }
                    />
                  }
                  containerStyle = {{borderBottomWidth :1,height:80,padding:25}}
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
   flex: 1,
   justifyContent: 'center',
   alignItems: 'center',
   backgroundColor: 'white'
  },
  enterText: {
    textAlign: 'center',
    height: 45,
    width:350
  },
  categoryText: {
    padding: 20,
    fontSize: 25,
    textAlign: 'center',
    justifyContent: 'center',
    color: '#007aff'
  }
})
