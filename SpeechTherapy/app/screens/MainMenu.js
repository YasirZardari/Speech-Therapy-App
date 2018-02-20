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
    // Go to record screen
    this.props.navigation.navigate('RecordScreen');
  }

  render() {
    return (
      <View style={styles.container}>
        <Text>Welcome to MainMenu</Text>
        <TouchableOpacity
          style={styles.button}
          onPress={this.onPressRecord}
        >
          <Text>Record</Text>
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
