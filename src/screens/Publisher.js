import AgoraRTC from 'agora-rtc-sdk-ng';
import axios from 'axios';
import React, { useEffect, useRef } from 'react';
import { StyleSheet, View } from 'react-native';

const API_URL1 = 'https://api.medser.us/api/physician/streaming/token';
const jwt =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6ImFidS5zYWlkQHRldG9uZWxlY3Ryb25pY3MuY29tIiwiaWQiOjgsInJvbGUiOiJkb2N0b3IiLCJpYXQiOjE3Mjg5NzI5NTMsImV4cCI6MTczMTU2NDk1M30.-lvMJAo4JWqfCozs8pSsIqKl6NqiJNSvGogxtj2G-qg';

const Publisher = () => {
  const localVideoRef = useRef(null);
  const client = useRef(null);

  useEffect(() => {
    const APP_ID = 'fbb5c0d82e244fadb0cd0fa402d1fdc4';

    const fetchToken = async () => {
      try {
        const response = await axios.get(API_URL1, {
          headers: {
            Authorization: `Bearer ${jwt}`,
          },
        });

        return {
          token: response.data.token,
          channelName: response.data.channelName,
        };
      } catch (error) {
        console.error('Error fetching token:', error);
        return null;
      }
    };

    const init = async () => {
      try {
        const res = await fetchToken();
        client.current = AgoraRTC.createClient({ mode: 'live', codec: 'vp8' });
        client.current.setClientRole('host');

        // Join the channel and capture the host's UID
        await client.current.join(APP_ID, res.channelName, res.token || null, null);

        // Create and publish local tracks
        const [micTrack, camTrack] = await AgoraRTC.createMicrophoneAndCameraTracks().catch((error) => {
          console.log('Failed to create tracks:', error);
          return [];
        });

        if (camTrack) {
          // Play the local video track in the localVideoRef
          camTrack.play(localVideoRef.current);
        }

        if (micTrack && camTrack) {
          await client.current.publish([micTrack, camTrack]);
          console.log('Published local tracks.');
        }
      } catch (error) {
        console.log('Error during stream initialization:', error);
      }
    };

    // Initialize the publisher
    init();

    // Cleanup on component unmount
    return () => {
      if (client.current) {
        client.current.leave();
        console.log('Left the channel.');
      }
    };
  }, []);

  return (
    <View style={styles.container}>
      <View
        ref={localVideoRef}
        style={styles.localVideo}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#000',
  },
  localVideo: {
    width: 300,
    height: 300,
    backgroundColor: 'blue',
  },
});

export default Publisher;
