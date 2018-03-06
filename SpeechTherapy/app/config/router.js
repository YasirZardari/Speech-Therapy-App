import { StackNavigator } from 'react-navigation';

import MainMenu from '../screens/MainMenu';
import RecordScreen from '../screens/RecordScreen';
import CategoriesScreen from '../screens/CategoriesScreen';

export const Root = StackNavigator({
  MainMenu: {
    screen: MainMenu
  },
  RecordScreen: {
    screen: RecordScreen
  },
  CategoriesScreen: {
    screen: CategoriesScreen
  }
});

// { headerMode: 'none' } add to stack navigator to remove the action bar
