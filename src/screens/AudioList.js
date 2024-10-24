import React from 'react';
import { ScrollView } from 'react-native';
import { surahs } from '../data/surahs';
import SingleAudio from './SingleAudio';

const AudioList = () => {
  return (
    <ScrollView className="w-full p-4 flex flex-col gap-2 h-full overflow-y-scroll">
      {surahs.map((file) => (
        <SingleAudio key={file.name} file={file} />
      ))}
    </ScrollView>
  );
};

export default AudioList;
