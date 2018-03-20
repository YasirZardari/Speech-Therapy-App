import { StackNavigator } from 'react-navigation';

import MainMenu from '../screens/MainMenu';
import RecordScreen from '../screens/RecordScreen';
import CategoriesScreen from '../screens/CategoriesScreen';
import CategoryScreen from '../screens/CategoryScreen';
import FavouritesScreen from '../screens/FavouritesScreen';
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
  CategoryScreen: {
    screen: CategoryScreen
  },
  FavouritesScreen: {
    screen: FavouritesScreen
  },
  SaveRecordingScreen: {
   screen: SaveRecordingScreen
  }
});

// { headerMode: 'none' } add to stack navigator to remove the action bar
