import { StackNavigator } from 'react-navigation';

import MainMenu from '../screens/MainMenu';

export const Root = StackNavigator({
  MainMenu: {
    screen: MainMenu
  }
});
