import React, { useState, useEffect } from 'react';
import { SUPPORTED_LANGUAGES } from '../constants';
import { Globe } from 'lucide-react';

interface LanguageSelectorProps {
  selectedCode: string;
  onChange: (code: string) => void;
  disabled?: boolean;
}

export const LanguageSelector: React.FC<LanguageSelectorProps> = ({ selectedCode, onChange, disabled }) => {
  const [isCustomMode, setIsCustomMode] = useState(() => {
    return selectedCode !== '' && !SUPPORTED_LANGUAGES.some(l => l.code === selectedCode);
  });

  useEffect(() => {
    if (selectedCode === '') {
      // Do nothing, empty state when switching to custom mode
    } else if (SUPPORTED_LANGUAGES.some(l => l.code === selectedCode)) {
      setIsCustomMode(false);
    } else {
      setIsCustomMode(true);
    }
  }, [selectedCode]);

  return (
    <div className="relative">
      <label className="block text-sm font-medium text-slate-700 mb-1 flex items-center gap-2">
        <Globe className="w-4 h-4" />
        Target Language
      </label>
      <div className="relative flex gap-2 w-full">
        <div className={`relative ${isCustomMode ? 'w-1/2' : 'w-full'}`}>
          <select
            value={isCustomMode ? 'custom' : selectedCode}
            onChange={(e) => {
              if (e.target.value === 'custom') {
                setIsCustomMode(true);
                onChange('');
              } else {
                setIsCustomMode(false);
                onChange(e.target.value);
              }
            }}
            disabled={disabled}
            className="appearance-none block w-full rounded-lg border-slate-300 bg-white py-3 pl-3 pr-10 text-slate-900 shadow-sm ring-1 ring-inset ring-slate-300 focus:ring-2 focus:ring-indigo-600 sm:text-sm sm:leading-6 disabled:bg-slate-100 disabled:text-slate-500 transition-all"
          >
            {SUPPORTED_LANGUAGES.map((lang) => (
              <option key={lang.code} value={lang.code}>
                {lang.name} ({lang.code})
              </option>
            ))}
            <option value="custom">Custom...</option>
          </select>
          <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-slate-500">
             <svg className="h-4 w-4 fill-current" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/></svg>
          </div>
        </div>
        
        {isCustomMode && (
          <input
            type="text"
            value={selectedCode}
            onChange={(e) => onChange(e.target.value)}
            disabled={disabled}
            placeholder="e.g. fr-CA"
            className="block w-1/2 rounded-lg border-slate-300 bg-white py-3 px-3 text-slate-900 shadow-sm ring-1 ring-inset ring-slate-300 focus:ring-2 focus:ring-indigo-600 sm:text-sm sm:leading-6 disabled:bg-slate-100 disabled:text-slate-500 transition-all"
          />
        )}
      </div>
      <p className="mt-1 text-xs text-slate-500 min-h-[16px]">
        {isCustomMode ? (
          "Enter a custom BCP-47 language code"
        ) : (
          `Backend maps to: ${SUPPORTED_LANGUAGES.find(l => l.code === selectedCode)?.backendMapping.join(", ")}`
        )}
      </p>
    </div>
  );
};
