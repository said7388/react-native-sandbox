import { AntDesign, FontAwesome } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Audio } from 'expo-av';
import * as FileSystem from 'expo-file-system';
import React, { useCallback, useEffect, useState } from 'react';
import { Alert, Text, TouchableOpacity, View } from 'react-native';

const AudioPlayer = ({ file: fileName, setDownloads }) => {
  const [sound, setSound] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [localUri, setLocalUri] = useState(null);
  const [isLoading, setIsLoading] = useState(true); // Loading state for file handling

  // Helper function to retrieve downloaded files from AsyncStorage
  const getDownloads = useCallback(async () => {
    try {
      const jsonValue = await AsyncStorage.getItem('downloads');
      return jsonValue ? JSON.parse(jsonValue) : [];
    } catch (error) {
      console.error('Error retrieving downloads:', error);
      return [];
    }
  }, []);

  // Function to load and play the downloaded audio
  const playAudio = useCallback(async () => {
    if (!localUri) {
      Alert.alert('Error', `No file found for ${fileName}`);
      return;
    };

    try {
      // Stop and unload any existing sound
      if (sound) {
        await sound.stopAsync();
        await sound.unloadAsync();
      }

      const { sound: newSound } = await Audio.Sound.createAsync({ uri: localUri });
      setSound(newSound);
      setIsPlaying(true);

      // Play the sound and handle playback status updates
      await newSound.playAsync();
      newSound.setOnPlaybackStatusUpdate((status) => {
        if (status.didJustFinish) {
          setIsPlaying(false);
        }
      });
    } catch (error) {
      Alert.alert('Error', `Error playing ${fileName}: ${error.message}`);
    }
  }, [fileName, localUri, sound]);

  // Function to pause the audio playback
  const pauseAudio = useCallback(async () => {
    if (sound) {
      await sound.pauseAsync();
      setIsPlaying(false);
    }
  }, [sound]);

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
      setIsPlaying(false);
      Alert.alert('Success', `${fileName} deleted successfully!`);
    } catch (error) {
      Alert.alert('Error', `Error deleting ${fileName}: ${error.message}`);
    }
  }, [localUri, fileName, getDownloads]);

  const deleteFromFileSystem = async (fileName) => {
    try {
      const filePath = `${FileSystem.documentDirectory}${fileName}`;
      await FileSystem.deleteAsync(filePath);
      // console.log(`${fileName} deleted from file system.`);
      return true;
    } catch (error) {
      // console.error(`Error deleting ${fileName} from file system:`, error);
      return false;
    };
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
  }

  return (
    <View className="flex-row items-center p-4 bg-gray-50 border-b border-gray-200 w-full rounded">
      <Text className="flex-1 text-base font-medium">{fileName}</Text>
      <View className="flex-row items-center gap-2">
        {!isPlaying ? (
          <TouchableOpacity onPress={playAudio}>
            <AntDesign name="playcircleo" size={24} color="green" />
          </TouchableOpacity>
        ) : (
          <TouchableOpacity onPress={pauseAudio}>
            <AntDesign name="pausecircleo" size={24} color="orange" />
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
