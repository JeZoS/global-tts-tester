export interface AudioResponse {
  message: string;
  audioContent: string;
}

export interface LanguageDefinition {
  code: string;
  name: string;
  backendMapping: string[]; // Visual reference to what the backend uses
}

export interface VoiceDefinition {
  name: string;
  description: string;
}

export interface HistoryItem {
  id: string;
  text: string;
  langCode: string;
  voice: string;
  timestamp: number;
  audioContent: string;
}
