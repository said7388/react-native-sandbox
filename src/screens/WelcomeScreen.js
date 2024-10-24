// WelcomeScreen.js
import React, { useEffect, useRef } from 'react';
import { Animated, View } from 'react-native';

const WelcomeScreen = ({ navigation }) => {
  const fadeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    // Fade in animation
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 2000,
      useNativeDriver: true,
    }).start();

    const timer = setTimeout(() => {
      navigation.replace('Main');
    }, 3000);

    return () => clearTimeout(timer);
  }, [fadeAnim, navigation]);

  return (
    <View className="flex-1 justify-center items-center bg-black">
      <Animated.Text
        style={[{ opacity: fadeAnim }]}
        className="text-white text-2xl font-bold"
      >
        Welcome to My App!
      </Animated.Text>
    </View>
  );
};

export default WelcomeScreen;
