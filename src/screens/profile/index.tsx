import React from 'react';
import { StyleSheet, Text, View, TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { useSelector, useDispatch } from 'react-redux';
import { logout } from '../../store/userSlice';
import { clearCart } from '../../store/cartSlice';
import { useNavigation } from '@react-navigation/native';

export const ProfileScreen = () => {
  const dispatch = useDispatch();
  const navigation = useNavigation();
  const { username, email, isLoggedIn } = useSelector(
    (state: any) => state.user,
  );

  const handleLogout = () => {
    dispatch(logout());
    dispatch(clearCart());
    navigation.replace('login');
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Icon name="person" size={90} color="#4facfe" />
        <Text style={styles.title}>
          {isLoggedIn ? 'My Profile' : 'Guest Account'}
        </Text>
      </View>

      {isLoggedIn ? (
        <View style={styles.infoContainer}>
          <View style={styles.infoBox}>
            <Text style={styles.label}>Username</Text>
            <Text style={styles.value}>{username}</Text>
          </View>

          <View style={styles.infoBox}>
            <Text style={styles.label}>Email</Text>
            <Text style={styles.value}>{email}</Text>
          </View>

          <TouchableOpacity style={styles.logoutBtn} onPress={handleLogout}>
            <Text style={styles.logoutText}>Logout</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <View style={styles.guestBox}>
          <Text style={styles.infoText}>
            You’re currently browsing as a guest.
          </Text>

          <TouchableOpacity
            style={styles.loginBtn}
            onPress={() => navigation.navigate('login')}
          >
            <Text style={styles.loginText}>Login / Register</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f7f9fc',
    padding: 20,
    alignItems: 'center',
  },
  header: {
    alignItems: 'center',
    marginTop: 50,
    marginBottom: 30,
  },
  title: {
    fontSize: 22,
    fontWeight: '700',
    color: '#333',
    marginTop: 10,
  },
  infoContainer: {
    width: '100%',
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 20,
    elevation: 4,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 6,
  },
  infoBox: {
    marginBottom: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
    paddingBottom: 10,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: '#666',
    marginBottom: 4,
  },
  value: {
    fontSize: 16,
    color: '#111',
  },
  logoutBtn: {
    marginTop: 25,
    backgroundColor: '#f44336',
    paddingVertical: 14,
    borderRadius: 10,
    alignItems: 'center',
  },
  logoutText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '700',
  },
  guestBox: {
    alignItems: 'center',
    marginTop: 50,
  },
  infoText: {
    fontSize: 16,
    color: '#555',
    textAlign: 'center',
    marginBottom: 20,
  },
  loginBtn: {
    backgroundColor: '#4facfe',
    paddingVertical: 14,
    paddingHorizontal: 40,
    borderRadius: 10,
  },
  loginText: {
    color: '#fff',
    fontWeight: '700',
    fontSize: 16,
  },
});
