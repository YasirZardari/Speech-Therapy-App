import React, { Component } from 'react';
import {
  StyleSheet,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  NativeModules,
  ToastAndroid,
  Dimensions
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import Pulse from 'react-native-pulse'; //npm install react-native-pulse --save

const WavAudioRecord = NativeModules.WavAudioRecord;

type Props = {};
class RecordScreen extends Component<Props> {
  constructor(props) {
    super(props);
    this.state = {
      hasPermission: false,
      isRecording: false,
      buttonText: 'Start Recording',
      micIcon: 'mic-none',
      pulse: false
    }
  }

  componentWillMount() {
    if (!this.state.hasPermission) {
      WavAudioRecord.checkAuthorisation().then(function(hasPermission) {
        if (!hasPermission) {
          ToastAndroid.show('No Mic Permission', ToastAndroid.SHORT);
        }
      });
      this.setState({ hasPermission: true });
    }
  }

  onPressRecord = () => {
    if (!this.state.isRecording) {
      // start recording

      this.setState({pulse:true})
      WavAudioRecord.startRecording();
      this.setState({ isRecording: true, buttonText: 'Stop Recording',
      micIcon:'mic'});
    } else {
      this.setState({pulse:false})
      WavAudioRecord.stopRecording();
      this.setState({ isRecording: false, buttonText: 'Start Recording',micIcon:'mic-none' });
      this.props.navigation.navigate('SaveRecordingScreen');
    }
  }

  render() {
    return (
      <View style={styles.container}>{
        this.state.pulse ? <Pulse
          color ='skyblue'
          numPulses={10}
          diameter={350}
<<<<<<< HEAD
          speed={12}
=======
          speed={20}
>>>>>>> recsavescreen
          duration ={1000}
          style= {{top:40, justifyContent:'center'}}/>: null
      }
        <View style={styles.buttonContainer}>
        <Icon
          name= {this.state.micIcon}
          size={100}
          style = {{top:150,left:(Dimensions.get('window').width / 2)-97
        }}
        />
          <TouchableOpacity style={[styles.button,{top:290},
            {justifyContent:'center'},{width: 320},
             this.state.isRecording && styles.buttonOnRec]}
            onPress={this.onPressRecord}>
            <Text style={styles.buttonText}>{ this.state.buttonText }</Text>
          </TouchableOpacity>
        </View>
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
    backgroundColor: '#F5FCFF'
  },
  buttonContainer: {
    flex: 1,
    justifyContent: 'flex-start',
    paddingTop: 10
  },
  button: {
    height: 100,
    alignItems: 'center',
    backgroundColor: '#52b2d8',
    top: 290,
    borderRadius: 10,
    elevation: 6
  },
  buttonOnRec: {
    backgroundColor: '#d85454'
  },
  buttonText: {
    fontSize: 30,
    fontFamily:'sans-serif-condensed',
    color: 'white'
  },
  textInputContainer: {
    flex: 1,
    justifyContent: 'flex-end',
    paddingBottom: 10,
    fontFamily:'sans-serif-condensed'
  },
  textInput: {
    height: 40,
    width: 320,
    fontSize: 24,
    fontFamily:'sans-serif-condensed'
  }
});
