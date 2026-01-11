import React, { useState, useCallback, useEffect } from 'react';
import { LanguageSelector } from './components/LanguageSelector';
import { VoiceSelector } from './components/VoiceSelector';
import { AudioPlayer } from './components/AudioPlayer';
import { generateSpeech } from './services/ttsService';
import { HistoryItem } from './types';
import { DEFAULT_API_URL, DEFAULT_TEXTS, SUPPORTED_VOICES } from './constants';
import { Mic, Activity, Sparkles, AlertCircle, Trash2, Play, Settings, RotateCcw } from 'lucide-react';

const App: React.FC = () => {
  const [text, setText] = useState<string>(DEFAULT_TEXTS['en']);
  const [langCode, setLangCode] = useState<string>("en");
  const [voice, setVoice] = useState<string>(SUPPORTED_VOICES[0].name); // Default to first voice name
  const [apiUrl, setApiUrl] = useState<string>(DEFAULT_API_URL);
  
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [currentAudio, setCurrentAudio] = useState<string | null>(null);
  const [history, setHistory] = useState<HistoryItem[]>([]);

  // Update text when language changes, only if the user hasn't heavily modified it 
  // or if it matches a default text of another language
  const handleLanguageChange = (newCode: string) => {
    setLangCode(newCode);
    const newDefault = DEFAULT_TEXTS[newCode] || "";
    
    // Check if current text is one of the defaults (meaning user likely hasn't typed a custom message)
    // or if the box is empty
    const isDefaultText = Object.values(DEFAULT_TEXTS).includes(text) || text.trim() === "";
    
    if (isDefaultText) {
      setText(newDefault);
    }
  };

  const handleGenerate = useCallback(async () => {
    if (!text.trim()) {
      setError("Please enter some text to convert.");
      return;
    }
    if (!apiUrl.trim()) {
      setError("API Endpoint URL cannot be empty.");
      return;
    }

    setIsLoading(true);
    setError(null);
    setCurrentAudio(null);

    try {
      const result = await generateSpeech(text, langCode, voice, apiUrl);
      setCurrentAudio(result.audioContent);
      
      // Add to history
      const newItem: HistoryItem = {
        id: Date.now().toString(),
        text: text,
        langCode: langCode,
        voice: voice,
        timestamp: Date.now(),
        audioContent: result.audioContent
      };
      setHistory(prev => [newItem, ...prev].slice(0, 5)); // Keep last 5
    } catch (err: any) {
      setError(err.message || "Failed to generate speech. Please try again.");
    } finally {
      setIsLoading(false);
    }
  }, [text, langCode, voice, apiUrl]);

  const handleClearHistory = () => {
    setHistory([]);
    setCurrentAudio(null);
  };

  const loadFromHistory = (item: HistoryItem) => {
    setText(item.text);
    setLangCode(item.langCode);
    setVoice(item.voice || SUPPORTED_VOICES[0].name);
    setCurrentAudio(item.audioContent);
    setError(null);
  };

  const resetApiUrl = () => {
    setApiUrl(DEFAULT_API_URL);
  };

  return (
    <div className="min-h-screen bg-slate-50 pb-12">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-slate-200">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-indigo-600 rounded-lg flex items-center justify-center shadow-lg shadow-indigo-200">
                <Mic className="text-white w-6 h-6" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-slate-900 tracking-tight">Global TTS Tester</h1>
                <p className="text-xs text-slate-500 font-medium">Internal API Verification Tool</p>
              </div>
            </div>
            <div className="hidden sm:flex items-center gap-2 text-sm text-slate-500 bg-slate-100 px-3 py-1 rounded-full border border-slate-200">
              <Activity className="w-4 h-4 text-green-500" />
              <span>Status: System Ready</span>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Main Controls - Left Column */}
          <div className="lg:col-span-7 space-y-6">
            
            {/* API Configuration Card */}
            <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
               <div className="bg-slate-50 px-4 py-3 border-b border-slate-100 flex items-center justify-between">
                 <h3 className="text-sm font-semibold text-slate-700 flex items-center gap-2">
                   <Settings className="w-4 h-4" />
                   Configuration
                 </h3>
               </div>
               <div className="p-4">
                  <label className="block text-xs font-medium text-slate-500 mb-1">
                    API Endpoint
                  </label>
                  <div className="flex gap-2">
                    <input 
                      type="text" 
                      value={apiUrl}
                      onChange={(e) => setApiUrl(e.target.value)}
                      className="block w-full rounded-md border-slate-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 text-xs text-slate-600 font-mono py-2"
                      placeholder="https://..."
                    />
                    <button 
                      onClick={resetApiUrl}
                      title="Reset to default"
                      className="p-2 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-md transition-colors"
                    >
                      <RotateCcw className="w-4 h-4" />
                    </button>
                  </div>
               </div>
            </div>

            {/* Input Card */}
            <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
              <div className="space-y-6">
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <LanguageSelector 
                    selectedCode={langCode} 
                    onChange={handleLanguageChange}
                    disabled={isLoading}
                  />
                  <VoiceSelector
                    selectedVoice={voice}
                    onChange={setVoice}
                    disabled={isLoading}
                  />
                </div>

                <div className="relative">
                  <label className="block text-sm font-medium text-slate-700 mb-1">
                    Text Input
                  </label>
                  <textarea
                    value={text}
                    onChange={(e) => setText(e.target.value)}
                    disabled={isLoading}
                    placeholder="Type something here to convert to speech..."
                    className="block w-full rounded-lg border-slate-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm min-h-[160px] resize-none p-4 transition-all"
                  />
                  <div className="absolute bottom-3 right-3 text-xs text-slate-400 pointer-events-none">
                    {text.length} chars
                  </div>
                </div>

                {error && (
                  <div className="rounded-lg bg-red-50 p-4 border border-red-100 flex items-start gap-3">
                    <AlertCircle className="w-5 h-5 text-red-600 mt-0.5 flex-shrink-0" />
                    <p className="text-sm text-red-700">{error}</p>
                  </div>
                )}

                <button
                  onClick={handleGenerate}
                  disabled={isLoading || !text.trim()}
                  className={`w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl text-white font-medium shadow-lg transition-all transform active:scale-[0.98]
                    ${isLoading || !text.trim() 
                      ? 'bg-slate-300 cursor-not-allowed shadow-none' 
                      : 'bg-gradient-to-r from-indigo-600 to-indigo-700 hover:from-indigo-500 hover:to-indigo-600 hover:shadow-indigo-200'
                    }`}
                >
                  {isLoading ? (
                    <>
                      <svg className="animate-spin -ml-1 mr-2 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Generating...
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-5 h-5" />
                      Convert to Speech
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>

          {/* Results & History - Right Column */}
          <div className="lg:col-span-5 space-y-6">
            
            {/* Active Output Card */}
            <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 relative overflow-hidden">
               {currentAudio ? (
                  <div className="space-y-4 animate-in fade-in slide-in-from-bottom-4 duration-500">
                    <div className="flex items-center justify-between mb-2">
                       <h2 className="text-lg font-semibold text-slate-800">Result</h2>
                       <span className="inline-flex items-center rounded-md bg-green-50 px-2 py-1 text-xs font-medium text-green-700 ring-1 ring-inset ring-green-600/20">Success</span>
                    </div>
                    <AudioPlayer base64Audio={currentAudio} autoPlay={true} />
                    <div className="pt-2">
                        <h4 className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">Preview Text</h4>
                        <p className="text-sm text-slate-600 italic border-l-2 border-indigo-200 pl-3 line-clamp-3">
                            "{text}"
                        </p>
                    </div>
                  </div>
               ) : (
                 <div className="h-full min-h-[200px] flex flex-col items-center justify-center text-center p-6 text-slate-400 border-2 border-dashed border-slate-100 rounded-xl">
                    <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mb-4">
                        <Activity className="w-8 h-8 text-slate-300" />
                    </div>
                    <p className="text-sm font-medium text-slate-500">No audio generated yet</p>
                    <p className="text-xs text-slate-400 mt-1 max-w-[200px]">Select a language, voice, and enter text to hear the result.</p>
                 </div>
               )}
            </div>

            {/* Recent History */}
            {history.length > 0 && (
              <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
                 <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
                    <h3 className="text-sm font-semibold text-slate-900">Recent Tests</h3>
                    <button onClick={handleClearHistory} className="text-xs text-slate-400 hover:text-red-500 flex items-center gap-1 transition-colors">
                        <Trash2 className="w-3 h-3" />
                        Clear
                    </button>
                 </div>
                 <div className="divide-y divide-slate-100">
                    {history.map((item) => (
                        <div 
                            key={item.id} 
                            onClick={() => loadFromHistory(item)}
                            className={`p-4 hover:bg-slate-50 cursor-pointer transition-colors group ${currentAudio === item.audioContent && item.text === text && item.voice === voice ? 'bg-indigo-50/50' : ''}`}
                        >
                            <div className="flex items-start justify-between">
                                <div className="space-y-1">
                                    <div className="flex items-center gap-2">
                                        <span className="inline-flex items-center rounded bg-slate-100 px-2 py-0.5 text-xs font-medium text-slate-800 uppercase">
                                            {item.langCode}
                                        </span>
                                        {item.voice && (
                                          <span className="inline-flex items-center rounded bg-indigo-50 px-2 py-0.5 text-xs font-medium text-indigo-700 border border-indigo-100">
                                            {item.voice}
                                          </span>
                                        )}
                                        <span className="text-xs text-slate-400">
                                            {new Date(item.timestamp).toLocaleTimeString()}
                                        </span>
                                    </div>
                                    <p className="text-sm text-slate-600 line-clamp-1 font-medium group-hover:text-indigo-600 transition-colors">
                                        {item.text}
                                    </p>
                                </div>
                                <div className="text-indigo-600 opacity-0 group-hover:opacity-100 transition-opacity">
                                    <Play className="w-4 h-4 fill-current" />
                                </div>
                            </div>
                        </div>
                    ))}
                 </div>
              </div>
            )}

          </div>
        </div>
      </main>
    </div>
  );
};

export default App;
