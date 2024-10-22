// WelcomeScreen.js
import React, { useEffect, useRef } from 'react';
import { Animated, StyleSheet, View } from 'react-native';

const WelcomeScreen = ({ navigation }) => {
  const fadeAnim = useRef(new Animated.Value(0)).current; // Initial value for opacity: 0

  useEffect(() => {
    // Fade in animation
    Animated.timing(fadeAnim, {
      toValue: 1, // Final value for opacity: 1
      duration: 2000, // Duration of the animation
      useNativeDriver: true, // Use native driver for better performance
    }).start();

    const timer = setTimeout(() => {
      navigation.replace('Login'); // Change 'Home' to the name of your main screen
    }, 3000); // 3 seconds before navigating

    return () => clearTimeout(timer); // Clean up the timer on unmount
  }, [fadeAnim, navigation]);

  return (
    <View style={styles.container}>
      <Animated.Text style={[styles.welcomeText, { opacity: fadeAnim }]}>
        Welcome to My App!
      </Animated.Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#000', // Black background
  },
  welcomeText: {
    color: '#fff', // White text
    fontSize: 24,
    fontWeight: 'bold',
  },
});

export default WelcomeScreen;
