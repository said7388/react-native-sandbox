import { FontAwesome } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as FileSystem from 'expo-file-system';
import React, { useCallback, useState } from 'react';
import { Alert, Text, TouchableOpacity, View } from 'react-native';
import { ProgressCircle } from 'react-native-progress'; // Import ProgressCircle
import { AudioContext } from '../context/AudioContext';

const ControllAudio = ({
  localUri,
  confirmDeleteFile,
  file,
  getDownloads,
  setLocalUri,
}) => {
  const { setDownloads } = React.useContext(AudioContext);
  const [downloading, setDownloading] = useState(false);
  const [downloadProgress, setDownloadProgress] = useState(0);

  // Function to download the audio file
  const downloadAudio = useCallback(async () => {
    try {
      setDownloading(true);
      setDownloadProgress(0); // Reset progress
      const localFilePath = `${FileSystem.documentDirectory}${file.name}`;

      const downloadResumable = FileSystem.createDownloadResumable(
        file.url,
        localFilePath,
        {},
        (progress) => {
          const progressPercentage = progress.totalBytesWritten / progress.totalBytesExpectedToWrite;
          setDownloadProgress(progressPercentage); // Update progress
        }
      );

      const downloadResult = await downloadResumable.downloadAsync();

      if (downloadResult.status === 200) {
        const downloads = await getDownloads();
        const isDownloaded = downloads.find(
          (download) => download === file.name,
        );
        if (!isDownloaded) {
          const updatedDownloads = [...downloads, file.name];
          setDownloads(updatedDownloads);
          await AsyncStorage.setItem(
            'downloads',
            JSON.stringify(updatedDownloads),
          );
        }
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

  return (
    <View>
      {localUri ? (
        <View className="flex-row items-center gap-2">
          <TouchableOpacity onPress={confirmDeleteFile}>
            <FontAwesome name="trash" size={24} color="red" />
          </TouchableOpacity>
        </View>
      ) : downloading ? (
        <View style={{ alignItems: 'center' }}>
          <ProgressCircle
            progress={downloadProgress}
            size={50}
            borderWidth={8}
            color={'green'}
            unfilledColor={'#e6e6e6'}
          />
          <Text>{Math.round(downloadProgress * 100)}%</Text> {/* Display percentage */}
        </View>
      ) : (
        <TouchableOpacity onPress={downloadAudio}>
          <FontAwesome name="download" size={24} color="green" />
        </TouchableOpacity>
      )}
    </View>
  );
};

export default ControllAudio;
