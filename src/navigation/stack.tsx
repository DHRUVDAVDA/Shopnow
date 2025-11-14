import { createNativeStackNavigator } from '@react-navigation/native-stack';
import ProductDetailScreen from '../screens/product';
import HomeScreen from '../screens/home';
import Bottomtab from './bottomtab';
import SplashScreen from '../screens/splash';
import LoginScreen from '../screens/login';
import DrawerNavigator from './drawer';
import { SafeAreaView } from 'react-native-safe-area-context';

const Stack = createNativeStackNavigator();

export default function Stacks() {
  return (
    <SafeAreaView style={{ flex: 1 }}>
      <Stack.Navigator
        initialRouteName="splash"
        screenOptions={{ headerShown: false }}
      >
        <Stack.Screen
          component={DrawerNavigator}
          name="bottomtab"
          options={{ headerShown: false, animation: 'simple_push' }}
        />
        <Stack.Screen
          component={SplashScreen}
          name="splash"
          options={{ headerShown: false, animation: 'simple_push' }}
        />
        <Stack.Screen
          component={LoginScreen}
          name="login"
          options={{ headerShown: false, animation: 'simple_push' }}
        />
        <Stack.Screen
          component={ProductDetailScreen}
          name="productdetail"
          options={{ headerShown: false, animation: 'simple_push' }}
        />
      </Stack.Navigator>
    </SafeAreaView>
  );
}

export const HomeStack = () => {
  const Stack = createNativeStackNavigator();
  return (
    <Stack.Navigator initialRouteName="Home">
      <Stack.Screen
        component={HomeScreen}
        name="Home"
        options={{ headerShown: false, animation: 'simple_push' }}
      />
    </Stack.Navigator>
  );
};
