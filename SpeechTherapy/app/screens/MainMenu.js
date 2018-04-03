import React, { Component } from 'react';
import {
  StyleSheet,
  View,
  Text,
  Dimensions,
  TouchableOpacity
} from 'react-native';


class MainMenu extends Component<Props> {
  onPressRecord = () => {
    this.props.navigation.navigate('RecordScreen');
  }
  onPressCategories = () => {
    this.props.navigation.navigate('CategoriesScreen');
  }
  onPressFavourites = () => {
   this.props.navigation.navigate('FavouritesScreen');
  }
  onPressTTS = () => {
    this.props.navigation.navigate('TTSScreen');
  }

  render() {
    return (
      <View style={styles.container}>
      <View style ={{paddingBottom:30}}>
        <TouchableOpacity
          style={[styles.button]}
          onPress={this.onPressRecord}
        >
          <Text style={styles.buttonText}>Make a Recording</Text>
        </TouchableOpacity>
        </View>
        <View style ={{paddingBottom:30}}>
        <TouchableOpacity
          style={[styles.button]}
          onPress={this.onPressCategories}
        >
          <Text style={styles.buttonText}>Categories</Text>
        </TouchableOpacity>
        </View>
        <View style ={{paddingBottom:30}}>
        <TouchableOpacity
          style={[styles.button]}
          onPress={this.onPressFavourites}
        >
          <Text style={styles.buttonText}>Favourites</Text>
        </TouchableOpacity>
        </View>
         <View style ={{paddingBottom:30}}>
        <TouchableOpacity
          style={[styles.button]}
          onPress={this.onPressTTS}
        >
          <Text style={styles.buttonText}>Text-to-Speech</Text>
        </TouchableOpacity>
      </View>
      </View>
    );
  }
}
export default MainMenu;

const styles = StyleSheet.create({
  container: {
    flex:1,
    flexDirection: 'column', 
    justifyContent: 'center', 
    alignItems: 'center',
    alignContent:'center',
    backgroundColor: '#F5FCFF',
  },
  button: {
   backgroundColor: '#52b2d8',
 //  left: (Dimensions.get('window').width / 2-150),
   padding: 23,
   width:300, // Dimensions.get('window').width/1.30,
   height: 80,
   borderRadius: 10,
   elevation: 6,
  },
  buttonText: {
  //  padding: 15,
    fontSize: 25,
    textAlign: 'center',
    justifyContent: 'center',
    color: 'white',
    fontFamily:'sans-serif-condensed'
  }
});
