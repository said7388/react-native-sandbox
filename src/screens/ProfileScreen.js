import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { useEffect, useState } from 'react';
import { Image, Text, View } from 'react-native';

const ProfileScreen = () => {
  const [userData, setUserData] = useState(null);

  const getUserData = async () => {
    try {
      const jsonValue = await AsyncStorage.getItem('userData');
      const jsonToken = await AsyncStorage.getItem('userToken');
      const data = jsonValue != null ? JSON.parse(jsonValue) : null;
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
    <View className="flex-1 items-center p-4 py-12 bg-white">
      <Image
        source={{ uri: userData?.photo }}
        className="w-24 h-24 rounded-full mb-4 border border-gray-300"
      />
      <View className="w-full bg-gray-50 p-4 rounded-lg shadow-md">
        <Text className="text-2xl font-bold mb-2 text-center">
          {userData?.name}
        </Text>
        <Text className="text-gray-600 mb-1">
          Email: {userData?.email}
        </Text>
        <Text className="text-gray-600">
          Role: {userData?.role}
        </Text>
      </View>
    </View>
  );
};

export default ProfileScreen;
