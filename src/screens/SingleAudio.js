
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as FileSystem from 'expo-file-system';
import React, { useCallback, useEffect, useState } from 'react';
import { Alert, Text, View } from 'react-native';
import { AudioContext } from '../context/AudioContext';
import ControllAudio from './ControllAudio';

const SingleAudio = ({ file }) => {
  const [localUri, setLocalUri] = useState(null);
  const { setDownloads } = React.useContext(AudioContext);

  // Helper function to get downloaded files from AsyncStorage
  const getDownloads = async () => {
    try {
      const jsonValue = await AsyncStorage.getItem('downloads');
      return jsonValue != null ? JSON.parse(jsonValue) : [];
    } catch (error) {
      console.error('Error retrieving downloads:', error);
      return [];
    }
  };

  // Function to delete the audio file
  const handleDeleteFile = useCallback(async () => {
    try {
      await deleteFromFileSystem(file.name);
      const downloads = await getDownloads();
      const updatedDownloads = downloads.filter((item) => item !== file.name);
      await AsyncStorage.setItem('downloads', JSON.stringify(updatedDownloads));

      setDownloads(updatedDownloads);
      setLocalUri(null);
      Alert.alert('Success', `${file.name} deleted successfully!`);
    } catch (error) {
      Alert.alert('Error', `Error deleting ${file.name}: ${error.message}`);
    }
  }, [file, getDownloads]);

  const deleteFromFileSystem = async (fileName) => {
    try {
      const filePath = `${FileSystem.documentDirectory}${fileName}`;
      await FileSystem.deleteAsync(filePath);
      return true;
    } catch (error) {
      console.error('Error deleting file:', error);
      return false;
    }
  };

  // Confirm deletion before proceeding
  const confirmDeleteFile = useCallback(() => {
    Alert.alert(
      'Confirm Deletion',
      `Are you sure you want to delete ${file.name}?`,
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Delete', onPress: handleDeleteFile, style: 'destructive' },
      ],
      { cancelable: true },
    );
  }, [handleDeleteFile, file.name]);

  // Load the local file if it exists
  useEffect(() => {
    const loadFile = async () => {
      try {
        const localFilePath = `${FileSystem.documentDirectory}${file.name}`;
        const fileInfo = await FileSystem.getInfoAsync(localFilePath);
        const downloads = await getDownloads();
        const isDownloaded = downloads.includes(file.name);

        if (fileInfo.exists && isDownloaded) {
          setLocalUri(localFilePath);
        }
      } catch (error) {
        Alert.alert('Error', `Error loading ${file.name}: ${error.message}`);
      }
    };

    loadFile();
  }, [file, getDownloads]);

  return (
    <View className="flex-row items-center p-4 bg-gray-50 border-b border-gray-200 w-full rounded">
      <Text className="flex-1 text-base font-medium">{file.name}</Text>
      <ControllAudio
        localUri={localUri}
        confirmDeleteFile={confirmDeleteFile}
        setLocalUri={setLocalUri}
        file={file}
        getDownloads={getDownloads}
      />
    </View>
  );
};

export default SingleAudio;
