// LoginScreen.js
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import React, { useState } from 'react';
import { Alert, Button, StyleSheet, Text, TextInput, View } from 'react-native';

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
      await AsyncStorage.setItem('userToken', response.data.data.token); // Save token or other data
      await AsyncStorage.setItem('userData', JSON.stringify(response.data.data.user)); // Save user data
      navigation.replace('Home');
    } catch (error) {
      if (error.response) {
        Alert.alert('Error', error.response.data.message || 'Login failed!');
      } else if (error.request) {
        Alert.alert('Error', 'No response from the server. Please try again later.');
      } else {
        Alert.alert('Error', error.message);
      }
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Login</Text>
      <TextInput
        style={styles.input}
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        autoCapitalize="none"
      />
      <TextInput
        style={styles.input}
        placeholder="Password"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />
      <Button title="Login" onPress={handleLogin} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 20,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 32,
    marginBottom: 20,
    textAlign: 'center',
  },
  input: {
    height: 50,
    borderColor: '#ccc',
    borderWidth: 1,
    marginBottom: 20,
    paddingHorizontal: 10,
  },
});

export default LoginScreen;
