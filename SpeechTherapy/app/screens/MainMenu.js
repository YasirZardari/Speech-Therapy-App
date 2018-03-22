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
  onPressTTS = () => {
    this.props.navigation.navigate('TTSScreen');
  }

  render() {
    return (
      <View style={styles.container}>
        {/* <Text>Welcome to MainMenu</Text> */}

        <TouchableOpacity
          style={styles.button}
          onPress={this.onPressRecord}
        >
          <Text style={styles.buttonText}>Record Audio</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.button2}
          onPress={this.onPressCategories}
        >
          <Text style={styles.buttonText}>Categories</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.button3}
          onPress={this.onPressCategories}
        >
          <Text style={styles.buttonText}>Favourites</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.button4}
          onPress={this.onPressCategories}
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
    //alignItems: 'center',
    backgroundColor: '#007aff',
    position: 'absolute',
    top:50,
    left: (Dimensions.get('window').width / 2) - 150,
    padding: 10,
    width: 300,
    height: 80
  },
  button2: {
    //alignItems: 'center',
    position: 'absolute',
    top:170,
    left: (Dimensions.get('window').width / 2) - 150,
    backgroundColor: '#007aff',
    padding: 10,
    width: 300,
    height: 80
  },
  button3: {
    position: 'absolute',
    top:290,
    left: (Dimensions.get('window').width / 2) - 150,
    backgroundColor: '#007aff',
    padding: 10,
    width: 300,
    height: 80
  },
  button4: {
    position: 'absolute',
    top:410,
    left: (Dimensions.get('window').width / 2) - 150,
    backgroundColor: '#007aff',
    padding: 10,
    width: 300,
    height: 80
  },
  buttonText: {
    padding: 20,
    fontSize: 25,
    textAlign: 'center',
    justifyContent: 'center',
    color: 'white'
  }
});
