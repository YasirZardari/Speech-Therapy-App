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
// import CategoryScreen from '../screens/CategoryScreen';


var CategoryArray = [
"Food",
"Drink",
"Questions",
"Goodbyes",
"About Myself",
"Weather",
"News",
"Sports",
"Greetings"
];
// var CategoryScreens = [new CategoryScreen()]
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
  //  fileManager.createCategory(this.state.temp.toString());
    this.setState({CategoryArray});
    this.state.temp = "";
    ToastAndroid.show('New Category Created', ToastAndroid.SHORT);
    }
  RemoveItemFromArray=(itemToDelete)=>{
    for (var i=CategoryArray.length-1; i>=0; i--) {
      if (CategoryArray[i] === itemToDelete) {
        CategoryArray.splice(i, 1);
      }
    }
    this.setState({CategoryArray});
  }
  deleteCategory=(stringToDelete)=>{
    Alert.alert(
      "Warning",
      "Are you sure you want to delete this category?",
      [
        { text: "Cancel",onPress:() => console.log('Cancel Pressed'),
        style:'cancel'},
        {text: "OK",onPress:() => //{fileManager.deleteCategory(stringToDelete)}}
      {this.RemoveItemFromArray(stringToDelete)}}
      ], {cancelable:false}
    );
  }
  _keyExtractor = (item, index) => index.toString();

     render() {
       return (
         <List containerStyle = {{
           marginTop:0, height:(Dimensions.get('window').height) -100,
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
        <TouchableOpacity
        onPress={this.AddItemsToArray}
        style={{backgroundColor: '#52b2d8',width:Dimensions.get('window').width,
          height:55,elevation:4,justifyContent:'center',alignItems:'center'}}>
        <Text style= {{color:'white',fontFamily:'sans-serif-condensed',
          fontWeight:'bold'}}>
        TAP HERE TO CONFIRM THIS NEW CATEGORY
        </Text>
        </TouchableOpacity>
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
                  onPress={this.onPressCategory}
                  rightIcon = {
                    <Icon
                      raised
                      name="trash"
                      size={40}
                      onPress= {
                        () =>this.deleteCategory(item)
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
