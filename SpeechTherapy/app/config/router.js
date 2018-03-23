import { StackNavigator } from 'react-navigation';

import MainMenu from '../screens/MainMenu';
import RecordScreen from '../screens/RecordScreen';
import CategoriesScreen from '../screens/CategoriesScreen';
import CategoryScreen from '../screens/CategoryScreen';
import SaveRecordingScreen from '../screens/SaveRecordingScreen';
import TTSScreen from '../screens/TTSScreen';

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
  CategoryScreen: {
    screen: CategoryScreen
  },
  SaveRecordingScreen: {
    screen: SaveRecordingScreen,
    navigationOptions: {
      title: 'Save Recording',
      headerStyle: { backgroundColor: '#03A9F4' },
      headerTitleStyle: { color: '#FFFFFF' },
      headerTintColor: '#FFFFFF',
    }
  },
  TTSScreen: {
    screen: TTSScreen
  }
});

// { headerMode: 'none' } add to stack navigator to remove the action bar
