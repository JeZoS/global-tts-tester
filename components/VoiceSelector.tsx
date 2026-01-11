import React from 'react';
import { SUPPORTED_VOICES } from '../constants';
import { User } from 'lucide-react';

interface VoiceSelectorProps {
  selectedVoice: string;
  onChange: (voice: string) => void;
  disabled?: boolean;
}

export const VoiceSelector: React.FC<VoiceSelectorProps> = ({ selectedVoice, onChange, disabled }) => {
  return (
    <div className="relative">
      <label className="block text-sm font-medium text-slate-700 mb-1 flex items-center gap-2">
        <User className="w-4 h-4" />
        Voice
      </label>
      <div className="relative">
        <select
          value={selectedVoice}
          onChange={(e) => onChange(e.target.value)}
          disabled={disabled}
          className="appearance-none block w-full rounded-lg border-slate-300 bg-white py-3 pl-3 pr-10 text-slate-900 shadow-sm ring-1 ring-inset ring-slate-300 focus:ring-2 focus:ring-indigo-600 sm:text-sm sm:leading-6 disabled:bg-slate-100 disabled:text-slate-500 transition-all"
        >
          {SUPPORTED_VOICES.map((voice) => (
            <option key={voice.name} value={voice.name}>
              {voice.name} ({voice.description})
            </option>
          ))}
        </select>
        <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-slate-500">
           <svg className="h-4 w-4 fill-current" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/></svg>
        </div>
      </div>
    </div>
  );
};
