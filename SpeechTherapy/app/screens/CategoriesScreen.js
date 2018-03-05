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
class CategoriesScreen extends Component<Props> {

  render() {
    return (
      <View style={styles.container}>
      <Text style={styles.headingText}>Categories</Text>
      <TouchableOpacity
      style={styles.button}
      onPress={this.onPressCategory}
      >
      <Text style={styles.buttonText}>Category1</Text>
      </TouchableOpacity>

      <TouchableOpacity
      style={styles.button2}
      onPress={this.onPressCategory}
      >
      <Text style={styles.buttonText}>Category2</Text>
      </TouchableOpacity>

      <TouchableOpacity
      style={styles.button3}
      onPress={this.onPressCategory}
      >
      <Text style={styles.buttonText}>Category3</Text>
      </TouchableOpacity>

      <TouchableOpacity
      style={styles.button4}
      onPress={this.onPressCategory}
      >
      <Text style={styles.buttonText}>Category4</Text>
      </TouchableOpacity>

      <TouchableOpacity
      style={styles.button5}
      onPress={this.onPressCategory}
      >
      <Text style={styles.buttonText}>Category5</Text>
      </TouchableOpacity>

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
    backgroundColor: '#F5FCFF',
  },
  button: {
    //alignItems: 'center',
    backgroundColor: '#336699',
    position: 'absolute',
    top:100,
    left: (Dimensions.get('window').width / 2) - 150,
    padding: 10,
    width: 300,
    height: 80
  },
  button2: {
    //alignItems: 'center',
    position: 'absolute',
    top:200,
    left: (Dimensions.get('window').width / 2) - 150,
    backgroundColor: '#336699',
    padding: 10,
    width: 300,
    height: 80
  },
  button3: {
    position: 'absolute',
    top:300,
    left: (Dimensions.get('window').width / 2) - 150,
    backgroundColor: '#336699',
    padding: 10,
    width: 300,
    height: 80
  },
  button4: {
    position: 'absolute',
    top:400,
    left: (Dimensions.get('window').width / 2) - 150,
    backgroundColor: '#336699',
    padding: 10,
    width: 300,
    height: 80
  },
  button5: {
    position: 'absolute',
    top:500,
    left: (Dimensions.get('window').width / 2) - 150,
    backgroundColor: '#336699',
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
  },
  headingText: {
    position: 'absolute',
    fontSize: 25,
    top: 30,
    textAlign: 'center',
    justifyContent: 'center',
    color: 'grey'
  }
});
