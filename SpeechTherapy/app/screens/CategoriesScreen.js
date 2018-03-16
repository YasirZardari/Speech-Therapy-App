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
    TouchableHighlight
} from 'react-native'

var CategoryArray = ["MainMenu",
"Category2",
"Category3",
"Category4",
"Category5"];

type Props = {};
class CategoriesScreen extends Component<Props> {

  constructor(props) {

         super(props)
         this.state = {temp: ''}

       }

       AddItemsToArray=()=>{

      //Adding Items To Array.
      CategoryArray.push( this.state.temp.toString() );

      Alert.alert(CategoryArray.toString());
  }

  //_keyExtractor = (item, index) => item.id;

  onPressCategory(destination) {
    this.props.navigation.navigate(destination);
  }
     render() {
       return (
        <View style={styles.container}>
        <TextInput

            placeholder="Click Here To Name A New Category"

            onChangeText={TextInputValue => this.setState({ temp : TextInputValue }) }

            style={styles.enterText}

        />
        <Button title="Click Here To Confirm This New Category" onPress={this.AddItemsToArray} />
          <FlatList
            //keyExtractor={this._keyExtractor}
            data={CategoryArray}
          //extraData={this.state}
            //id={item.id}
            renderItem={({item}) => {
                return(
                  <TouchableHighlight
                    onPress={() => this.onPressCategory(item)}>
                    <Text style={styles.categoryText}>{item}</Text>
                  </TouchableHighlight>
                )
              }
            }
          />
        </View>

      );
  }
}
export default CategoriesScreen;


const styles = StyleSheet.create({
  container: {
   flex: 1,
   justifyContent: 'center',
   alignItems: 'center',
   backgroundColor: '#007aff'
  },
  enterText: {
    textAlign: 'center',
    marginBottom: 6,
    height: 45,
    width:350
  },
  categoryText: {
    padding: 20,
    fontSize: 25,
    textAlign: 'center',
    justifyContent: 'center',
    color: 'white'
  }
})
