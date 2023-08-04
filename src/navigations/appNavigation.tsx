import {createStackNavigator} from '@react-navigation/stack';
import {NavigationContainer} from '@react-navigation/native';
import Chatting from '../view/chatting';
import {Splash} from '../view/splash';
import {SCREENS} from './navigationRoutes';
import {Signup} from '../view/signup';
import {Login} from '../view/login';
import Map from '../view/map';

const Stack = createStackNavigator();

const AppNavigation = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen
          name={SCREENS.SPLASH}
          component={Splash}
          options={{headerShown: false}}
        />
        <Stack.Screen
          name={SCREENS.LOGIN}
          component={Login}
          options={{headerShown: false}}
        />
        <Stack.Screen
          name={SCREENS.SIGNUP}
          component={Signup}
          options={{headerShown: false}}
        />

        <Stack.Screen
          name={SCREENS.MAP}
          component={Map}
          options={{
            headerShown: false,
          }}
        />
        <Stack.Screen name={SCREENS.CHATTING} component={Chatting} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default AppNavigation;
