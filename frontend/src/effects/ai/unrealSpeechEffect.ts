import axios from 'axios';
import { unrealSpeechConfig } from '../../config/unrealSpeechConfig';
import { API_UNREAL_SPEECH, UNREAL_SPEECH_KEY } from '../../utils/api-urls';

export const unrealSpeechStream = async (text: string) => {
  const voiceConfig = unrealSpeechConfig.male;
  const requestBody = {
    Text: text,
    VoiceId: voiceConfig.voiceId,
    Bitrate: '192k',
    Speed: voiceConfig.speed,
    Pitch: voiceConfig.pitch,
    Codec: 'libmp3lame',
    Temperature: 0.25
  };

  const config = {
    headers: {
      accept: 'audio/mpeg',
      'content-type': 'application/json',
      Authorization: `Bearer ${UNREAL_SPEECH_KEY}`
    },
    responseType: 'arraybuffer'
  };

  try {
    const response = await axios.post(API_UNREAL_SPEECH, requestBody, config);
    const audioBlob = new Blob([response.data], { type: 'audio/mpeg' });
    const audioUrl = URL.createObjectURL(audioBlob);
    return audioUrl;
  } catch (error) {
    console.error('Error fetching audio:', error);
    throw error;
  }
};
