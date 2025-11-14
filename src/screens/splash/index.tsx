import React, { useEffect } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Animated, {
  FadeInLeft,
  FadeInRight,
  ZoomIn,
} from 'react-native-reanimated';
import { useNavigation } from '@react-navigation/native';
import LinearGradient from 'react-native-linear-gradient';
import { useSelector } from 'react-redux';

const SplashScreen = () => {
  const navigation = useNavigation();
  const { isLoggedIn, isGuest } = useSelector((state: any) => state.user); // 👈 get from Redux

  useEffect(() => {
    setTimeout(() => {
      if (isLoggedIn || isGuest) {
        navigation.replace('bottomtab');
      } else {
        navigation.replace('login');
      }
    }, 2200);
  }, [isLoggedIn]);

  return (
    <LinearGradient
      colors={['white', 'grey']}
      style={styles.container}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
    >
      <Animated.View entering={ZoomIn.duration(600)} style={styles.inner}>
        <Animated.Text
          entering={FadeInLeft.duration(700)}
          style={styles.shopText}
        >
          Shop
        </Animated.Text>
        <Animated.Text
          entering={FadeInRight.duration(700)}
          style={styles.nowText}
        >
          Now
        </Animated.Text>
      </Animated.View>

      <Text style={styles.tagline}>Your style, your store ✨</Text>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  inner: {
    flexDirection: 'row',
    alignItems: 'flex-end',
  },
  shopText: {
    fontSize: 70,
    fontWeight: '800',
    color: 'white',
    letterSpacing: 1,
  },
  nowText: {
    fontSize: 70,
    fontWeight: '800',
    color: '#ffe259',
    marginLeft: 10,
  },
  tagline: {
    position: 'absolute',
    bottom: 80,
    color: 'white',
    fontSize: 18,
    fontWeight: '500',
    letterSpacing: 0.5,
  },
});

export default SplashScreen;
