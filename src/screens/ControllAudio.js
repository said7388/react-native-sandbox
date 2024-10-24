import { FontAwesome } from '@expo/vector-icons';
import React from 'react';
import { Text, TouchableOpacity, View } from 'react-native';

const ControllAudio = ({ localUri, confirmDeleteFile, downloading, downloadAudio }) => {
  return (
    <View>
      {localUri ? (
        <View className="flex-row items-center gap-2">
          <TouchableOpacity onPress={confirmDeleteFile}>
            <FontAwesome name="trash" size={24} color="red" />
          </TouchableOpacity>
        </View>
      ) : downloading ? (
        <Text>
          Downloading...
        </Text>
      ) : (
        <TouchableOpacity onPress={downloadAudio}>
          <FontAwesome name="download" size={24} color="green" />
        </TouchableOpacity>
      )}
    </View>
  );
};

export default ControllAudio;
