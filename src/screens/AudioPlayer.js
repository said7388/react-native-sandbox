import { AntDesign, FontAwesome } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as FileSystem from 'expo-file-system';
import React, { useCallback, useContext, useEffect, useRef, useState } from 'react';
import { Alert, Text, TouchableOpacity, View } from 'react-native';
import { AudioContext } from '../context/AudioContext';

const AudioPlayer = ({ file: fileName, setDownloads }) => {
  const { playAudio, pauseAudio, isPlaying, currentAudio } = useContext(AudioContext);
  const [sound, setSound] = useState(null);
  const [localUri, setLocalUri] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const progressIntervalRef = useRef(null);

  const getDownloads = useCallback(async () => {
    try {
      const jsonValue = await AsyncStorage.getItem('downloads');
      return jsonValue ? JSON.parse(jsonValue) : [];
    } catch (error) {
      console.error('Error retrieving downloads:', error);
      return [];
    };
  }, []);

  // Function to delete the audio file
  const handleDeleteFile = useCallback(async () => {
    try {
      await deleteFromFileSystem(fileName);
      const downloads = await getDownloads();
      const updatedDownloads = downloads.filter((item) => item !== fileName);
      await AsyncStorage.setItem('downloads', JSON.stringify(updatedDownloads));

      setDownloads(updatedDownloads);
      setLocalUri(null);
      setSound(null);
      // setIsPlaying(false);
      Alert.alert('Success', `${fileName} deleted successfully!`);
    } catch (error) {
      Alert.alert('Error', `Error deleting ${fileName}: ${error.message}`);
    }
  }, [fileName, getDownloads]);

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
      `Are you sure you want to delete ${fileName}?`,
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Delete', onPress: handleDeleteFile, style: 'destructive' },
      ],
      { cancelable: true }
    );
  }, [handleDeleteFile, fileName]);

  // Load the local file if it exists
  useEffect(() => {
    const loadFile = async () => {
      try {
        const localFilePath = `${FileSystem.documentDirectory}${fileName}`;
        const fileInfo = await FileSystem.getInfoAsync(localFilePath);
        const downloads = await getDownloads();
        const isDownloaded = downloads.includes(fileName);

        if (fileInfo.exists && isDownloaded) {
          setLocalUri(localFilePath);
        } else {
          await handleDeleteFile();
          console.log(`${fileName} is not downloaded.`);
        }
      } catch (error) {
        Alert.alert('Error', `Error loading ${fileName}: ${error.message}`);
      } finally {
        setIsLoading(false);
      }
    };

    loadFile();
  }, [fileName, getDownloads]);

  // Cleanup the sound object when the component unmounts
  useEffect(() => {
    return () => {
      if (sound) {
        sound.unloadAsync();
        clearInterval(progressIntervalRef.current);
      }
    };
  }, [sound]);

  // Disable interactions if the file is still loading
  if (isLoading) {
    return (
      <View className="flex-row items-center p-4 bg-gray-50 border-b border-gray-200 w-full rounded">
        <Text className="flex-1 text-base font-medium">Loading {fileName}...</Text>
      </View>
    );
  };

  return (
    <View className="flex-row items-center p-4 bg-gray-50 border-b border-gray-200 w-full rounded">
      <Text className="flex-1 text-base font-medium">{fileName}</Text>
      <View className="flex-row items-center gap-2">
        {(isPlaying && currentAudio === localUri) ? (
          <TouchableOpacity onPress={pauseAudio}>
            <AntDesign name="pausecircleo" size={24} color="orange" />
          </TouchableOpacity>
        ) : (
          <TouchableOpacity onPress={() => playAudio(localUri)}>
            <AntDesign name="playcircleo" size={24} color="green" />
          </TouchableOpacity>
        )}
        <TouchableOpacity onPress={confirmDeleteFile}>
          <FontAwesome name="trash" size={24} color="red" />
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default AudioPlayer;