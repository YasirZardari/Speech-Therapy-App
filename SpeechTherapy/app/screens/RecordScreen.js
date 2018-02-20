import React, { Component } from 'react';
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity
} from 'react-native';

type Props = {};
class RecordScreen extends Component<Props> {
  render() {
    return (
      <View style={styles.container}>
        <Text>Welcome to Record Screen</Text>
      </View>
    );
  }
}
export default RecordScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5FCFF',
  }
});
