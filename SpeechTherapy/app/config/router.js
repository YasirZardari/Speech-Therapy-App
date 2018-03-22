import { StackNavigator } from 'react-navigation';

import MainMenu from '../screens/MainMenu';
import RecordScreen from '../screens/RecordScreen';
import CategoriesScreen from '../screens/CategoriesScreen';
import SaveRecordingScreen from '../screens/SaveRecordingScreen';

export const Root = StackNavigator({
  MainMenu: {
    screen: MainMenu
  },
  RecordScreen: {
    screen: RecordScreen
  },
  CategoriesScreen: {
    screen: CategoriesScreen
  },
  SaveRecordingScreen: {
    screen: SaveRecordingScreen,
    navigationOptions: {
      title: 'Save Recording',
      headerStyle: { backgroundColor: '#03A9F4' },
      headerTitleStyle: { color: '#FFFFFF' },
      headerTintColor: '#FFFFFF',
    }
  }
});

// { headerMode: 'none' } add to stack navigator to remove the action bar
