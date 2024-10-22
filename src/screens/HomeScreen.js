// HomeScreen.js
import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { useEffect, useState } from 'react';
import { Text, View } from 'react-native';

const HomeScreen = ({ navigation }) => {
  const [userData, setUserData] = useState(null);

  const getUserData = async () => {
    try {
      const jsonValue = await AsyncStorage.getItem('userData');
      const jsonToken = await AsyncStorage.getItem('userToken');
      const data = jsonValue != null ? JSON.parse(jsonValue) : null;
      // const token = jsonToken != null ? JSON.parse(jsonToken) : null;
      // console.log(jsonToken)
      if (!jsonToken) {
        navigation.navigate('Login')
      }
      setUserData(data);
    } catch (error) {
      console.error('Error retrieving user data:', error);
    }
  };

  useEffect(() => {
    getUserData();
  }, []);

  return (
    <View className="flex-1 justify-center items-center bg-white">
      <Text className="text-2xl mb-5">User Information</Text>
      {userData ? (
        <Text className="text-lg">Welcome, {userData.name}!</Text>
      ) : (
        <Text className="text-lg">Loading user data...</Text>
      )}
    </View>
  );
};

export default HomeScreen;