import AsyncStorage from '@react-native-async-storage/async-storage';
import { Audio } from 'expo-av';
import React, { createContext, useEffect, useState } from 'react';

// Create the context
export const AudioContext = createContext();

// Provider component
export const AudioProvider = ({ children }) => {
  const [downloads, setDownloads] = useState([]);
  const [currentAudio, setCurrentAudio] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [sound, setSound] = useState(null);

  const playAudio = async (uri) => {
    try {
      if (sound) {
        await sound.stopAsync();
        await sound.unloadAsync();
      }

      const { sound: newSound } = await Audio.Sound.createAsync({ uri });
      setSound(newSound);
      setIsPlaying(true);
      setCurrentAudio(uri);
      await newSound.playAsync();

      newSound.setOnPlaybackStatusUpdate((status) => {
        if (status.didJustFinish) {
          setIsPlaying(false);
        }
      });
    } catch (error) {
      console.error('Error playing audio:', error);
    }
  };

  const pauseAudio = async () => {
    if (sound) {
      await sound.pauseAsync();
      setIsPlaying(false);
      setCurrentAudio(null);
    }
  };

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

  useEffect(() => {
    getDownloads();
  }, []);

  // Cleanup sound when component unmounts
  useEffect(() => {
    return () => {
      if (sound) {
        sound.unloadAsync();
      }
    };
  }, [sound]);

  return (
    <AudioContext.Provider
      value={{
        isPlaying,
        playAudio,
        pauseAudio,
        currentAudio,
        setCurrentAudio,
        downloads,
        setDownloads,
      }}
    >
      {children}
    </AudioContext.Provider>
  );
};
