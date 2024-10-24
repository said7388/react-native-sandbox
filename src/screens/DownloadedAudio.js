// @flow strict

import * as React from 'react';
import { ScrollView } from 'react-native';
import { AudioContext } from '../context/AudioContext';
import AudioPlayer from './AudioPlayer';

function DownloadedAudio() {
  const { downloads, setDownloads } = React.useContext(AudioContext);

  return (
    <ScrollView className="w-full p-4 flex flex-col gap-2 h-full overflow-y-scroll">
      {downloads.map((file, i) => (
        <AudioPlayer key={i} file={file} setDownloads={setDownloads} />
      ))}
    </ScrollView>
  );
}

export default DownloadedAudio;
