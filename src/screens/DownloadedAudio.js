// @flow strict

import AsyncStorage from '@react-native-async-storage/async-storage';
import * as React from 'react';
import { ScrollView } from 'react-native';
import AudioPlayer from './AudioPlayer';

function DownloadedAudio() {
  const [downloads, setDownloads] = React.useState([]);

  const getDownloads = async () => {
    try {
      const jsonValue = await AsyncStorage.getItem('downloads');
      const data = jsonValue != null ? JSON.parse(jsonValue) : [];
      setDownloads(data);
      return data;
    } catch (error) {
      console.error('Error retrieving user data:', error);
    };
  };

  React.useEffect(() => {
    getDownloads();
  }, []);

  return (
    <ScrollView className="w-full p-4 flex flex-col gap-2 h-full overflow-y-scroll">
      {downloads.map((file, i) => (
        <AudioPlayer
          key={i}
          file={file}
          setDownloads={setDownloads}
        />
      ))}
    </ScrollView>
  );
};

export default DownloadedAudio;