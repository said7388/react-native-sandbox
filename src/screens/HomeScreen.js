// HomeScreen.js
import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';

const HomeScreen = () => {
  const [userData, setUserData] = useState(null);

  const getUserData = async () => {
    try {
      const jsonValue = await AsyncStorage.getItem('userData');
      const jsonToken = await AsyncStorage.getItem('userToken');
      const data = jsonValue != null ? JSON.parse(jsonValue) : null;
      // const token = jsonToken != null ? JSON.parse(jsonToken) : null;
      console.log(jsonToken)
      setUserData(data);
    } catch (error) {
      console.error('Error retrieving user data:', error);
    }
  };

  useEffect(() => {
    getUserData();
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>User Information</Text>
      {userData ? (
        <Text style={styles.text}>Welcome, {userData.name}!</Text>
      ) : (
        <Text style={styles.text}>Loading user data...</Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 24,
    marginBottom: 20,
  },
  text: {
    fontSize: 18,
  },
});

export default HomeScreen;
