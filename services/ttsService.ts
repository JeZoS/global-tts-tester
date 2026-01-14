import { AudioResponse } from '../types';

export const generateSpeech = async (text: string, langCode: string, voice: string, apiUrl: string): Promise<AudioResponse> => {
  try {
    const response = await fetch(apiUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        text,
        langCode,
        voice,
      }),
    });

    if (!response.ok) {
      throw new Error(`API Error: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();
    
    // Validate response shape
    if (!data.audioContent) {
      throw new Error("Invalid response: No audio content received.");
    }

    return data as AudioResponse;
  } catch (error) {
    console.error("TTS Service Error:", error);
    throw error;
  }
};
