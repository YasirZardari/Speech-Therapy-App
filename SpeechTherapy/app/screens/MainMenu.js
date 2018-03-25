import React, { Component } from 'react';
import {
  StyleSheet,
  View,
  Text,
  Dimensions,
  Platform,
  TouchableOpacity
} from 'react-native';


type Props = {};
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
        {/* <Text>Welcome to MainMenu</Text> */}

        <TouchableOpacity
          style={[styles.button,{top:70}]}
          onPress={this.onPressRecord}
        >
          <Text style={styles.buttonText}>Make a Recording</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.button,{top:190}]}
          onPress={this.onPressCategories}
        >
          <Text style={styles.buttonText}>Categories</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.button,{top:310}]}
          onPress={this.onPressFavourites}
        >
          <Text style={styles.buttonText}>Favourites</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.button,{top:430}]}
          onPress={this.onPressTTS}
        >
          <Text style={styles.buttonText}>Text-to-Speech</Text>
        </TouchableOpacity>

      </View>
    );
  }
}
export default MainMenu;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5FCFF',
  },
  button: {
  backgroundColor: '#52b2d8',
   position: 'absolute',
   left: (Dimensions.get('window').width / 2) - 150,
   padding: 10,
   width: 300,
   height: 80,
   borderRadius: 10,
   elevation: 6
  },
  buttonText: {
    padding: 15,
    fontSize: 25,
    textAlign: 'center',
    justifyContent: 'center',
    color: 'white',
    fontFamily:'sans-serif-condensed'
  }
});
