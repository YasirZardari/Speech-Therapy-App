import React, { Component } from 'react';
import {
  StyleSheet,
  View,
  Text,
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

  render() {
    return (
      <View style={styles.container}>
        <Text>Welcome to MainMenu</Text>

        <TouchableOpacity
          style={styles.button}
          onPress={this.onPressRecord}
        >
          <Text>Record Audio</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.button}
          onPress={this.onPressCategories}
        >
          <Text>Categories</Text>
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
    alignItems: 'center',
    backgroundColor: '#DDDDDD',
    padding: 10
  }
});
