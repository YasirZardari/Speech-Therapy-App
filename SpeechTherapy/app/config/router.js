import { StackNavigator } from 'react-navigation';

import MainMenu from '../screens/MainMenu';
import RecordScreen from '../screens/RecordScreen';
import CategoriesScreen from '../screens/CategoriesScreen';
import CategoryScreen from '../screens/CategoryScreen';
import SaveRecordingScreen from '../screens/SaveRecordingScreen';
import TTSScreen from '../screens/TTSScreen';
import FavouritesScreen from '../screens/FavouritesScreen';

export const Root = StackNavigator({
  MainMenu: {
    screen: MainMenu,
    navigationOptions: {
      title: 'Message Banking',
      headerStyle: { backgroundColor: '#52b2d8' },
      headerTitleStyle: {color: '#FFFFFF' },
      headerTintColor: '#FFFFFF',
      fontFamily:'sans-serif-condensed'
    }
  },
  RecordScreen: {
    screen: RecordScreen,
    navigationOptions: {
      title: 'Make a Recording',
      headerStyle: { backgroundColor: '#52b2d8' },
      headerTitleStyle: { color: '#FFFFFF' },
      headerTintColor: '#FFFFFF',
      fontFamily:'sans-serif-condensed'
    }
  },
  CategoriesScreen: {
    screen: CategoriesScreen,
    navigationOptions: {
      title: 'Categories',
      headerStyle: { backgroundColor: '#52b2d8' },
      headerTitleStyle: { color: '#FFFFFF' },
      headerTintColor: '#FFFFFF',
      fontFamily:'sans-serif-condensed'
    }
  },
  CategoryScreen: {
    screen: CategoryScreen,
    navigationOptions: {

      headerStyle: { backgroundColor: '#52b2d8' },

      headerTitleStyle: { color: '#FFFFFF' },
      headerTintColor: '#FFFFFF',
      fontFamily:'sans-serif-condensed'
    }
  },
  FavouritesScreen: {
    screen: FavouritesScreen,
    navigationOptions: {
      title:'Favourites',

      headerStyle: { backgroundColor: '#52b2d8' },

      headerTitleStyle: { color: '#FFFFFF' },
      headerTintColor: '#FFFFFF',
      fontFamily:'sans-serif-condensed'
    }
  },
  SaveRecordingScreen: {
    screen: SaveRecordingScreen,
    navigationOptions: {
      title: 'Save Recording',
      headerStyle: { backgroundColor: '#52b2d8' },
      headerTitleStyle: { color: '#FFFFFF' },
      headerTintColor: '#FFFFFF',
      fontFamily:'sans-serif-condensed'
    }
  },
  TTSScreen: {
    screen: TTSScreen,
    navigationOptions: {
      title: 'Text-to-Speech',
      headerStyle: {backgroundColor: '#52b2d8'},
      headerTitleStyle: {color: '#FFFFFF' },
      headerTintColor: '#FFFFFF',
      fontFamily:'sans-serif-condensed'

    }
  }
  
});

// { headerMode: 'none' } add to stack navigator to remove the action bar
