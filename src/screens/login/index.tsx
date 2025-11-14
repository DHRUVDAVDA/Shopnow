import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { TextInput } from 'react-native-paper';
import LinearGradient from 'react-native-linear-gradient';
import { useDispatch } from 'react-redux';
import { login } from '../../store/userSlice';
import { clearCart } from '../../store/cartSlice';
import { loginUser } from '../../utils/apiCalls';
import useNetworkStatus from '../../components/networkStatus';

const LoginScreen = () => {
  const navigation = useNavigation();
  const dispatch = useDispatch();

  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const isConnected = useNetworkStatus();

  const handleLogin = async () => {
    if (!username || !email || !password) {
      Alert.alert('Error', 'Please enter all fields');
      return;
    }

    // if (!isConnected && isConnected !== null) {
    //   Alert.alert('', 'Please check network connection!');
    //   return;
    // }

    try {
      setLoading(true);
      const data = await loginUser(username, password); // call API
      console.log('Login success:', data);

      // if token received, consider login successful
      if (data?.token) {
        dispatch(
          login({
            username,
            email,
            password,
            isGuest: false,
            isLoggedIn: true,
            token: data.token,
          }),
        );
        dispatch(clearCart());
        navigation.navigate('bottomtab');
      } else {
        Alert.alert('Error', 'Invalid response from server');
      }
    } catch (error: any) {
      Alert.alert('Login Failed', error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <LinearGradient colors={['white', 'grey']} style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.title}>Welcome Back 👋</Text>

        <TextInput
          mode="outlined"
          label="Username"
          value={username}
          onChangeText={setUsername}
          style={styles.input}
        />

        <TextInput
          mode="outlined"
          label="Email"
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          autoCapitalize="none"
          style={styles.input}
        />

        <TextInput
          mode="outlined"
          label="Password"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
          style={styles.input}
        />

        <TouchableOpacity
          style={[styles.button, loading && { opacity: 0.6 }]}
          onPress={handleLogin}
          disabled={loading}
        >
          <Text style={styles.buttonText}>
            {loading ? 'Logging in...' : 'Log In'}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={() => navigation.navigate('bottomtab')}>
          <Text style={styles.linkText}>Continue as Guest</Text>
        </TouchableOpacity>
      </View>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 25,
  },
  title: {
    color: '#fff',
    fontSize: 26,
    fontWeight: '700',
    marginBottom: 15,
  },
  input: {
    width: '100%',
    marginBottom: 15,
    backgroundColor: 'white',
    borderRadius: 10,
  },
  button: {
    backgroundColor: 'grey',
    width: '100%',
    paddingVertical: 14,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 10,
    marginBottom: 15,
  },
  buttonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: '600',
  },
  linkText: {
    color: 'white',
    fontSize: 15,
    textDecorationLine: 'underline',
  },
});

export default LoginScreen;
