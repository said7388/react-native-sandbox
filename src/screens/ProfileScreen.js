import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { useEffect, useState } from 'react';
import { Alert, Image, Text, TouchableOpacity, View } from 'react-native';

const ProfileScreen = ({ navigation }) => {
  const [userData, setUserData] = useState(null);

  const getUserData = async () => {
    try {
      const jsonValue = await AsyncStorage.getItem('userData');
      const jsonToken = await AsyncStorage.getItem('userToken');
      const data = jsonValue != null ? JSON.parse(jsonValue) : null;
      if (!jsonToken) {
        navigation.navigate('Login');
      }
      setUserData(data);
    } catch (error) {
      console.error('Error retrieving user data:', error);
    }
  };

  const handleLogout = async () => {
    // Clear user data and token from AsyncStorage
    await AsyncStorage.removeItem('userData');
    await AsyncStorage.removeItem('userToken');

    // Navigate to the Login screen
    navigation.navigate('Login');
  };

  const confirmLogout = () => {
    Alert.alert('Logout', 'Are you sure you want to logout?', [
      {
        text: 'Cancel',
        style: 'cancel',
      },
      { text: 'OK', onPress: handleLogout },
    ]);
  };

  useEffect(() => {
    getUserData();
  }, []);

  return (
    <View className="flex-1 items-center p-4 py-12 bg-gray-50">
      {/* Profile Picture */}
      <Image
        source={{ uri: userData?.photo }}
        className="w-32 h-32 rounded-full mb-4 border border-gray-300"
      />
      {/* User Information */}
      <View className="w-full bg-white p-6 rounded-lg shadow-lg">
        <Text className="text-2xl font-bold mb-2 text-center text-gray-800">
          {userData?.name}
        </Text>
        <Text className="text-gray-600 mb-1 text-center">
          Email: {userData?.email}
        </Text>
        <Text className="text-gray-600 text-center">
          Role: {userData?.role}
        </Text>
      </View>
      {/* Logout Button */}
      <TouchableOpacity
        onPress={confirmLogout}
        className="mt-8 bg-red-500 rounded-md py-2 px-12 shadow-md w-fit"
      >
        <Text className="text-white text-center font-medium">Logout</Text>
      </TouchableOpacity>
    </View>
  );
};

export default ProfileScreen;
