import { FontAwesome } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as FileSystem from 'expo-file-system';
import React, { useCallback, useEffect, useState } from 'react';
import { Alert, Text, TouchableOpacity, View } from 'react-native';
import { AudioContext } from '../context/AudioContext';

const SingleAudio = ({ file }) => {
  const [downloading, setDownloading] = useState(false);
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
    };
  };

  // Function to download the audio file
  const downloadAudio = useCallback(async () => {
    try {
      setDownloading(true);
      const localFilePath = `${FileSystem.documentDirectory}${file.name}`;
      const downloadResult = await FileSystem.downloadAsync(file.url, localFilePath);

      if (downloadResult.status === 200) {
        const downloads = await getDownloads();
        const isDownloaded = downloads.find((download) => download === file.name);
        if (!isDownloaded) {
          const updatedDownloads = [...downloads, file.name];
          setDownloads(updatedDownloads);
          await AsyncStorage.setItem('downloads', JSON.stringify(updatedDownloads));
        };
        Alert.alert('Success', `${file.name} downloaded successfully!`);
        setLocalUri(localFilePath);
      } else {
        Alert.alert('Error', `Failed to download ${file.name}`);
      }
    } catch (error) {
      console.error('Error downloading file:', error);
      Alert.alert('Error', `Error downloading ${file.name}: ${error.message}`);
    } finally {
      setDownloading(false);
    }
  }, [file]);

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
      { cancelable: true }
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
        };
      } catch (error) {
        Alert.alert('Error', `Error loading ${file.name}: ${error.message}`);
      };
    };

    loadFile();
  }, [file, getDownloads]);

  return (
    <View className="flex-row items-center p-4 bg-gray-50 border-b border-gray-200 w-full rounded">
      <Text className="flex-1 text-base font-medium">{file.name}</Text>
      {localUri ? (
        <View className="flex-row items-center gap-2">
          <TouchableOpacity onPress={confirmDeleteFile}>
            <FontAwesome name="trash" size={24} color="red" />
          </TouchableOpacity>
        </View>
      ) : downloading ? (
        <Text>Downloading...</Text>
      ) : (
        <TouchableOpacity onPress={downloadAudio}>
          <FontAwesome name="download" size={24} color="green" />
        </TouchableOpacity>
      )}
    </View>
  );
};

export default SingleAudio;