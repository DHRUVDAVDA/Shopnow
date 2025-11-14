import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import {
  createDrawerNavigator,
  DrawerContentScrollView,
} from '@react-navigation/drawer';
import Icon from 'react-native-vector-icons/MaterialIcons';
import Bottomtab from './bottomtab';
import { useSelector, useDispatch } from 'react-redux';
import { logout } from '../store/userSlice';
import { ProfileScreen } from '../screens/profile';
import { useNavigation, useNavigationState } from '@react-navigation/native';
import { clearCart } from '../store/cartSlice';

const Drawer = createDrawerNavigator();

const CustomDrawerContent = ({ navigation }) => {
  const { username, isLoggedIn } = useSelector((state: any) => state.user);
  const dispatch = useDispatch();

  // ✅ Get current route name
  const currentRouteName = useNavigationState(
    (state: any) => state.routes[state.index]?.name,
  );

  const isOnProfile = currentRouteName === 'Profile';
  const isOnHome = currentRouteName === 'HomeTabs';

  return (
    <DrawerContentScrollView contentContainerStyle={styles.drawerContainer}>
      <View style={styles.profileHeader}>
        <Icon name="person" size={70} color="#4facfe" />
        <Text style={styles.userName}>
          {isLoggedIn ? `Hi, ${username}` : 'Guest User'}
        </Text>
      </View>

      <View style={styles.divider} />

      {/* ✅ Conditional Button: Show Home if on Profile, or Profile if on Home */}
      {isOnProfile ? (
        <TouchableOpacity
          style={styles.drawerItem}
          onPress={() => navigation.navigate('HomeTabs')}
        >
          <Icon name="home" size={24} color="#4facfe" />
          <Text style={styles.drawerLabel}>Home</Text>
        </TouchableOpacity>
      ) : (
        <TouchableOpacity
          style={styles.drawerItem}
          onPress={() => navigation.navigate('Profile')}
        >
          <Icon name="account-circle" size={24} color="#4facfe" />
          <Text style={styles.drawerLabel}>Profile</Text>
        </TouchableOpacity>
      )}

      {isLoggedIn ? (
        <>
          <TouchableOpacity
            style={styles.drawerItem}
            onPress={() => {
              dispatch(logout());
              dispatch(clearCart());
              navigation.closeDrawer();
              navigation.replace('login');
            }}
          >
            <Icon name="logout" size={24} color="#f44336" />
            <Text style={[styles.drawerLabel, { color: '#f44336' }]}>
              Logout
            </Text>
          </TouchableOpacity>
        </>
      ) : (
        <TouchableOpacity
          style={styles.drawerItem}
          onPress={() => navigation.navigate('login')}
        >
          <Icon name="login" size={24} color="#4caf50" />
          <Text style={[styles.drawerLabel, { color: '#4caf50' }]}>Login</Text>
        </TouchableOpacity>
      )}
    </DrawerContentScrollView>
  );
};

// ✅ Main Drawer Navigator
export default function DrawerNavigator() {
  const navigation = useNavigation();
  return (
    <Drawer.Navigator
      drawerContent={props => <CustomDrawerContent {...props} />}
      screenOptions={{
        headerShown: false,
        drawerActiveTintColor: 'black',
        drawerLabelStyle: { fontSize: 15 },
        swipeEdgeWidth: 80,
        // headerLeft: ({ tintColor }) => (
        //   <Icon.Button
        //     name="menu"
        //     size={24}
        //     color={tintColor}
        //     backgroundColor="transparent"
        //     underlayColor="transparent"
        //     onPress={() => navigation?.openDrawer()}
        //   />
        // ),
      }}
    >
      <Drawer.Screen
        name="HomeTabs"
        component={Bottomtab}
        options={{ title: 'Home' }}
      />
      <Drawer.Screen
        name="Profile"
        component={ProfileScreen}
        options={{
          //   headerShown: true,
          headerTitle: 'Profile',
        }}
      />
    </Drawer.Navigator>
  );
}

const styles = StyleSheet.create({
  drawerContainer: {
    flex: 1,
    paddingTop: 20,
  },
  profileHeader: {
    alignItems: 'center',
    marginBottom: 15,
  },
  userName: {
    marginTop: 8,
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
  },
  divider: {
    height: 1,
    backgroundColor: '#ddd',
    marginVertical: 10,
  },
  drawerItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 20,
  },
  drawerLabel: {
    fontSize: 16,
    marginLeft: 15,
    color: '#333',
  },
});
