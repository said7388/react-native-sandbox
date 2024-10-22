import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import React, { useState } from 'react';
import { Alert, Button, Text, TextInput, View } from 'react-native';

const LoginScreen = ({ navigation }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = async () => {
    try {
      const response = await axios.post('https://api.medser.us/api/auth/login', {
        email,
        password,
      });

      // Save the login response data in AsyncStorage
      await AsyncStorage.setItem('userToken', response.data.data.token); 
      await AsyncStorage.setItem('userData', JSON.stringify(response.data.data.user)); 
      navigation.replace('Main');
    } catch (error) {
      if (error.response) {
        Alert.alert('Error', error.response.data.message || 'Login failed!');
      } else if (error.request) {
        Alert.alert('Error', 'No response from the server. Please try again later.');
      } else {
        Alert.alert('Error', error.message);
      }
    };
  };

  return (
    <View className="flex-1 justify-center p-5 bg-white">
      <Text className="text-center text-3xl mb-5">
        Account Login
      </Text>
      <TextInput
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        autoCapitalize="none"
        className="h-12 border-[#ccc] border mb-5 px-5 rounded-md"
      />
      <TextInput
        placeholder="Password"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
        className="h-12 border-[#ccc] border mb-5 px-5 rounded-md"
      />
      <Button
        title="Login"
        onPress={handleLogin}
        className="bg-blue-500 rounded-md"
      />
    </View>
  );
};

export default LoginScreen;