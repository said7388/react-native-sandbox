// @flow strict

import AsyncStorage from '@react-native-async-storage/async-storage';
import * as React from 'react';

function DownloadedAudio() {

  const getDownloads = async () => {
    try {
      const jsonValue = await AsyncStorage.getItem('downloads');
      const data = jsonValue != null ? JSON.parse(jsonValue) : [];

      return data;
    } catch (error) {
      console.error('Error retrieving user data:', error);
    };
  };

  return (
    <div>
      
    </div>
  );
};

export default DownloadedAudio;