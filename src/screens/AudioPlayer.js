import { AntDesign, FontAwesome } from '@expo/vector-icons';
import { Audio } from 'expo-av';
import * as FileSystem from 'expo-file-system';
import React, { useEffect, useState } from 'react';
import { Alert, Text, TouchableOpacity, View } from 'react-native';

const AudioPlayer = ({ file }) => {
  const [sound, setSound] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [downloading, setDownloading] = useState(false);
  const [localUri, setLocalUri] = useState(null);

  // Function to download the audio file
  const downloadAudio = async () => {
    try {
      setDownloading(true);
      const localFilePath = `${FileSystem.documentDirectory}${file.name}`;

      const downloadResult = await FileSystem.downloadAsync(file.url, localFilePath);

      if (downloadResult.status === 200) {
        Alert.alert('Success', `${file.name} downloaded successfully!`);
        setLocalUri(localFilePath); // Store the local URI
      } else {
        Alert.alert('Error', `Failed to download ${file.name}`);
      }
    } catch (error) {
      Alert.alert('Error', `Error downloading ${file.name}: ${error.message}`);
    } finally {
      setDownloading(false);
    }
  };

  // Function to load and play the downloaded audio
  const playAudio = async () => {
    if (!localUri) {
      Alert.alert('Please download the audio first!');
      return;
    }

    try {
      // Check if a sound is already playing and stop it before starting a new one
      if (sound) {
        await sound.stopAsync();
        await sound.unloadAsync();
      }

      const { sound: newSound } = await Audio.Sound.createAsync(
        { uri: localUri }
      );

      // Set the sound state
      setSound(newSound);
      setIsPlaying(true);

      // Play the sound
      await newSound.playAsync();

      // Update playback status
      newSound.setOnPlaybackStatusUpdate((status) => {
        if (status.didJustFinish) {
          setIsPlaying(false);
        }
      });
    } catch (error) {
      Alert.alert('Error', `Error playing ${file.name}: ${error.message}`);
    }
  };

  // Function to pause the audio playback
  const pauseAudio = async () => {
    if (sound) {
      await sound.pauseAsync();
      setIsPlaying(false);
    }
  };

  // Function to confirm and delete the audio file
  const confirmDeleteFile = () => {
    Alert.alert(
      'Confirm Deletion',
      `Are you sure you want to delete ${file.name}?`,
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Delete',
          onPress: deleteFile,
          style: 'destructive',
        },
      ],
      { cancelable: true }
    );
  };

  const deleteFile = async () => {
    if (localUri) {
      await FileSystem.deleteAsync(localUri);
      setLocalUri(null);
      Alert.alert('Success', `${file.name} deleted successfully!`);
    } else {
      Alert.alert('Error', `No file found for ${file.name}`);
    }
  };

  // Cleanup the audio player when the component unmounts
  useEffect(() => {
    return () => {
      if (sound) {
        sound.unloadAsync();
      }
    };
  }, [sound]);

  return (
    <View className="flex-row items-center p-4 bg-gray-50 border-b border-gray-200 w-full rounded">
      <Text className="flex-1 text-base font-medium">{file.name}</Text>
      {localUri ? (
        <View className="flex-row items-center gap-2">
          {!isPlaying ? (
            <TouchableOpacity onPress={playAudio}>
              <AntDesign name="playcircleo" size={24} color="green" className="mr-4" />
            </TouchableOpacity>
          ) : (
            <TouchableOpacity onPress={pauseAudio}>
              <AntDesign name="pausecircleo" size={24} color="orange" className="mr-4" />
            </TouchableOpacity>
          )}
          <TouchableOpacity onPress={confirmDeleteFile}>
            <FontAwesome name="trash" size={24} color="red" />
          </TouchableOpacity>
        </View>
      ) : (
        downloading ? <Text>Downloading...</Text> :
        <TouchableOpacity onPress={downloadAudio}>
          <FontAwesome name="download" size={24} color="green" />
        </TouchableOpacity>
      )}
    </View>
  );
};

export default AudioPlayer;
