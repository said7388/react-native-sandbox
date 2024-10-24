// SettingsScreen.js
import React from 'react';
import { View } from 'react-native';
import AudioList from './AudioList';

const SettingsScreen = () => {
  return (
    <View className="flex-1 justify-center items-center bg-white">
      <AudioList />
    </View>
  );
};

export default SettingsScreen;