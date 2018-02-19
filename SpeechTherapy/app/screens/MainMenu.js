import React, { Component } from 'react';
import {
  StyleSheet,
  View,
  Text
} from 'react-native';

type Props = {};
class MainMenu extends Component<Props> {
  render() {
    return (
      <View>
        <Text>Welcome to MainMenu</Text>
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
  welcome: {
    fontSize: 20,
    textAlign: 'center',
    margin: 10,
  },
  instructions: {
    textAlign: 'center',
    color: '#333333',
    marginBottom: 5,
  },
});
