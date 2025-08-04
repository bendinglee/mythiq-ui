import React, { useState, useRef, useEffect } from 'react';
import './App.css';

function App() {
  const [activeTab, setActiveTab] = useState('chat');
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [gamePrompt, setGamePrompt] = useState('');
  const [gameResult, setGameResult] = useState('');
  const [mediaPrompt, setMediaPrompt] = useState('');
  const [mediaResult, setMediaResult] = useState('');
  
  // Audio Studio states
  const [speechText, setSpeechText] = useState('');
  const [musicPrompt, setMusicPrompt] = useState('');
  const [audioResult, setAudioResult] = useState('');
  const [isAudioLoading, setIsAudioLoading] = useState(false);
  const [voicePresets, setVoicePresets] = useState([]);
  const [selectedVoice, setSelectedVoice] = useState('v2/en_speaker_6');
  
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Load voice presets on component mount
  useEffect(() => {
    loadVoicePresets();
  }, []);

  const loadVoicePresets = async () => {
    try {
      const audioApiUrl = import.meta.env.VITE_AUDIO_API || 'https://mythiq-audio-creator-production.up.railway.app';
      const response = await fetch(`${audioApiUrl}/voice-presets`);
      const data = await response.json();
      
      if (data.success && data.presets && data.presets.english) {
        setVoicePresets(data.presets.english);
      }
    } catch (error) {
      console.error('Error loading voice presets:', error);
    }
  };

  const sendMessage = async () => {
    if (!inputMessage.trim() || isLoading) return;

    const userMessage = { role: 'user', content: inputMessage };
    setMessages(prev => [...prev, userMessage]);
    setInputMessage('');
    setIsLoading(true);

    try {
      const assistantApiUrl = import.meta.env.VITE_ASSISTANT_API || 'https://mythiq-assistant-production.up.railway.app';
      const response = await fetch(`${assistantApiUrl}/chat`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: inputMessage,
          conversation_history: messages
        }),
      });

      const data = await response.json();
      
      if (data.success) {
        const assistantMessage = { role: 'assistant', content: data.response };
        setMessages(prev => [...prev, assistantMessage]);
      } else {
        throw new Error(data.error || 'Failed to get response');
      }
    } catch (error) {
      console.error('Error:', error);
      const errorMessage = { 
        role: 'assistant', 
        content: 'Sorry, I encountered an error. Please try again.' 
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const generateGame = async () => {
    if (!gamePrompt.trim() || isLoading) return;

    setIsLoading(true);
    setGameResult('');

    try {
      const gameApiUrl = import.meta.env.VITE_GAME_API || 'https://mythiq-game-maker-production.up.railway.app';
      const response = await fetch(`${gameApiUrl}/generate-game`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          prompt: gamePrompt
        }),
      });

      const data = await response.json();
      
      if (data.success) {
        setGameResult(data.game_concept || data.message);
      } else {
        throw new Error(data.error || 'Failed to generate game');
      }
    } catch (error) {
      console.error('Error:', error);
      setGameResult('Sorry, I encountered an error generating the game. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const generateMedia = async () => {
    if (!mediaPrompt.trim() || isLoading) return;

    setIsLoading(true);
    setMediaResult('');

    try {
      const mediaApiUrl = import.meta.env.VITE_MEDIA_API || 'https://mythiq-media-creator-production.up.railway.app';
      const response = await fetch(`${mediaApiUrl}/generate-video`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          prompt: mediaPrompt
        }),
      });

      const data = await response.json();
      
      if (data.success) {
        setMediaResult(data.video_concept || data.message);
      } else {
        throw new Error(data.error || 'Failed to generate media');
      }
    } catch (error) {
      console.error('Error:', error);
      setMediaResult('Sorry, I encountered an error generating media. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const generateSpeech = async () => {
    if (!speechText.trim() || isAudioLoading) return;

    setIsAudioLoading(true);
    setAudioResult('');

    try {
      const audioApiUrl = import.meta.env.VITE_AUDIO_API || 'https://mythiq-audio-creator-production.up.railway.app';
      const response = await fetch(`${audioApiUrl}/generate-speech`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          text: speechText,
          voice_preset: selectedVoice
        }),
      });

      const data = await response.json();
      
      if (data.success) {
        setAudioResult(`✅ Speech generated successfully!\n\n${data.message || data.status}`);
      } else {
        throw new Error(data.error || 'Failed to generate speech');
      }
    } catch (error) {
      console.error('Error:', error);
      setAudioResult('❌ Sorry, I encountered an error generating speech. Please try again.');
    } finally {
      setIsAudioLoading(false);
    }
  };

  const generateMusic = async () => {
    if (!musicPrompt.trim() || isAudioLoading) return;

    setIsAudioLoading(true);
    setAudioResult('');

    try {
      const audioApiUrl = import.meta.env.VITE_AUDIO_API || 'https://mythiq-audio-creator-production.up.railway.app';
      const response = await fetch(`${audioApiUrl}/generate-music`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          prompt: musicPrompt,
          duration: 10
        }),
      });

      const data = await response.json();
      
      if (data.success) {
        setAudioResult(`🎵 Music generated successfully!\n\n${data.message || data.status}`);
      } else {
        throw new Error(data.error || 'Failed to generate music');
      }
    } catch (error) {
      console.error('Error:', error);
      setAudioResult('❌ Sorry, I encountered an error generating music. Please try again.');
    } finally {
      setIsAudioLoading(false);
    }
  };

  const handleKeyPress = (e, action) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      action();
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-white mb-2">
            🚀 Mythiq AI Platform
          </h1>
          <p className="text-gray-300">
            Your Complete AI-Powered Creative Suite
          </p>
        </div>

        {/* Navigation Tabs */}
        <div className="flex flex-wrap justify-center gap-4 mb-8">
          <button
            onClick={() => setActiveTab('chat')}
            className={`px-6 py-3 rounded-lg font-medium transition-all ${
              activeTab === 'chat'
                ? 'bg-blue-600 text-white shadow-lg'
                : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
            }`}
          >
            💬 AI Assistant
          </button>
          <button
            onClick={() => setActiveTab('game')}
            className={`px-6 py-3 rounded-lg font-medium transition-all ${
              activeTab === 'game'
                ? 'bg-green-600 text-white shadow-lg'
                : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
            }`}
          >
            🎮 Game Maker
          </button>
          <button
            onClick={() => setActiveTab('media')}
            className={`px-6 py-3 rounded-lg font-medium transition-all ${
              activeTab === 'media'
                ? 'bg-red-600 text-white shadow-lg'
                : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
            }`}
          >
            🎬 Media Creator
          </button>
          <button
            onClick={() => setActiveTab('audio')}
            className={`px-6 py-3 rounded-lg font-medium transition-all ${
              activeTab === 'audio'
                ? 'bg-purple-600 text-white shadow-lg'
                : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
            }`}
          >
            🎵 Audio Studio
          </button>
        </div>

        {/* Chat Tab */}
        {activeTab === 'chat' && (
          <div className="max-w-4xl mx-auto">
            <div className="bg-gray-800 rounded-lg shadow-xl p-6">
              <div className="text-center mb-6">
                <h2 className="text-2xl font-bold text-white mb-2">💬 AI Assistant</h2>
                <p className="text-gray-400">Chat with your intelligent AI companion</p>
              </div>
              
              <div className="h-96 overflow-y-auto mb-4 p-4 bg-gray-900 rounded-lg">
                {messages.length === 0 ? (
                  <div className="text-center text-gray-500 mt-20">
                    <p>👋 Hello! I'm your AI assistant. How can I help you today?</p>
                  </div>
                ) : (
                  messages.map((message, index) => (
                    <div
                      key={index}
                      className={`mb-4 ${
                        message.role === 'user' ? 'text-right' : 'text-left'
                      }`}
                    >
                      <div
                        className={`inline-block p-3 rounded-lg max-w-xs lg:max-w-md ${
                          message.role === 'user'
                            ? 'bg-blue-600 text-white'
                            : 'bg-gray-700 text-gray-100'
                        }`}
                      >
                        <p className="whitespace-pre-wrap">{message.content}</p>
                      </div>
                    </div>
                  ))
                )}
                {isLoading && (
                  <div className="text-left mb-4">
                    <div className="inline-block p-3 rounded-lg bg-gray-700 text-gray-100">
                      <p>🤔 Thinking...</p>
                    </div>
                  </div>
                )}
                <div ref={messagesEndRef} />
              </div>
              
              <div className="flex gap-2">
                <input
                  type="text"
                  value={inputMessage}
                  onChange={(e) => setInputMessage(e.target.value)}
                  onKeyPress={(e) => handleKeyPress(e, sendMessage)}
                  placeholder="Type your message..."
                  className="flex-1 p-3 bg-gray-700 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  disabled={isLoading}
                />
                <button
                  onClick={sendMessage}
                  disabled={isLoading || !inputMessage.trim()}
                  className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  {isLoading ? '⏳' : '📤'}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Game Maker Tab */}
        {activeTab === 'game' && (
          <div className="max-w-4xl mx-auto">
            <div className="bg-gray-800 rounded-lg shadow-xl p-6">
              <div className="text-center mb-6">
                <h2 className="text-2xl font-bold text-white mb-2">🎮 Game Maker</h2>
                <p className="text-gray-400">Create amazing game concepts with AI</p>
              </div>
              
              <div className="space-y-4">
                <textarea
                  value={gamePrompt}
                  onChange={(e) => setGamePrompt(e.target.value)}
                  placeholder="Describe your game idea... (e.g., 'A space adventure game with puzzle elements')"
                  className="w-full p-4 bg-gray-700 text-white rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-green-500"
                  rows="4"
                />
                
                <button
                  onClick={generateGame}
                  disabled={isLoading || !gamePrompt.trim()}
                  className="w-full py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium"
                >
                  {isLoading ? '🎲 Creating Game...' : '🎮 Generate Game Concept'}
                </button>
                
                {gameResult && (
                  <div className="mt-6 p-4 bg-gray-900 rounded-lg">
                    <h3 className="text-lg font-semibold text-white mb-2">🎯 Game Concept:</h3>
                    <p className="text-gray-300 whitespace-pre-wrap">{gameResult}</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Media Creator Tab */}
        {activeTab === 'media' && (
          <div className="max-w-4xl mx-auto">
            <div className="bg-gray-800 rounded-lg shadow-xl p-6">
              <div className="text-center mb-6">
                <h2 className="text-2xl font-bold text-white mb-2">🎬 Media Creator</h2>
                <p className="text-gray-400">Generate video and media concepts</p>
              </div>
              
              <div className="space-y-4">
                <textarea
                  value={mediaPrompt}
                  onChange={(e) => setMediaPrompt(e.target.value)}
                  placeholder="Describe your video idea... (e.g., 'A cinematic trailer for a sci-fi movie')"
                  className="w-full p-4 bg-gray-700 text-white rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-red-500"
                  rows="4"
                />
                
                <button
                  onClick={generateMedia}
                  disabled={isLoading || !mediaPrompt.trim()}
                  className="w-full py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium"
                >
                  {isLoading ? '🎬 Creating Media...' : '🎥 Generate Media Concept'}
                </button>
                
                {mediaResult && (
                  <div className="mt-6 p-4 bg-gray-900 rounded-lg">
                    <h3 className="text-lg font-semibold text-white mb-2">🎭 Media Concept:</h3>
                    <p className="text-gray-300 whitespace-pre-wrap">{mediaResult}</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Audio Studio Tab */}
        {activeTab === 'audio' && (
          <div className="max-w-4xl mx-auto space-y-6">
            <div className="text-center">
              <h2 className="text-2xl font-bold text-white mb-2">🎵 Audio Studio</h2>
              <p className="text-gray-400">Generate speech and music with AI</p>
            </div>
            
            {/* Speech Generation */}
            <div className="bg-gray-800 rounded-lg shadow-xl p-6">
              <h3 className="text-xl font-semibold text-white mb-4">🎤 Speech Generation</h3>
              
              {/* Voice Selection */}
              {voicePresets.length > 0 && (
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Voice Preset:
                  </label>
                  <select
                    value={selectedVoice}
                    onChange={(e) => setSelectedVoice(e.target.value)}
                    className="w-full p-3 bg-gray-700 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                  >
                    {voicePresets.map((preset) => (
                      <option key={preset.id} value={preset.id}>
                        {preset.name} ({preset.gender})
                      </option>
                    ))}
                  </select>
                </div>
              )}
              
              <textarea
                value={speechText}
                onChange={(e) => setSpeechText(e.target.value)}
                placeholder="Enter text to convert to speech... (e.g., 'Hello, welcome to Mythiq AI Platform!')"
                className="w-full p-4 bg-gray-700 text-white rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-purple-500"
                rows="3"
              />
              
              <button
                onClick={generateSpeech}
                disabled={isAudioLoading || !speechText.trim()}
                className="mt-3 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium"
              >
                {isAudioLoading ? '🎤 Generating Speech...' : '🗣️ Generate Speech'}
              </button>
            </div>
            
            {/* Music Generation */}
            <div className="bg-gray-800 rounded-lg shadow-xl p-6">
              <h3 className="text-xl font-semibold text-white mb-4">🎵 Music Generation</h3>
              
              <input
                type="text"
                value={musicPrompt}
                onChange={(e) => setMusicPrompt(e.target.value)}
                placeholder="Describe the music you want (e.g., 'upbeat electronic dance music', 'calm piano melody')"
                className="w-full p-4 bg-gray-700 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
              
              <button
                onClick={generateMusic}
                disabled={isAudioLoading || !musicPrompt.trim()}
                className="mt-3 px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium"
              >
                {isAudioLoading ? '🎵 Generating Music...' : '🎶 Generate Music'}
              </button>
            </div>
            
            {/* Audio Results */}
            {audioResult && (
              <div className="bg-gray-800 rounded-lg shadow-xl p-6">
                <h3 className="text-lg font-semibold text-white mb-2">🎧 Audio Result:</h3>
                <div className="p-4 bg-gray-900 rounded-lg">
                  <p className="text-gray-300 whitespace-pre-wrap">{audioResult}</p>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Footer */}
        <div className="text-center mt-12 text-gray-400">
          <p>🚀 Powered by Mythiq AI Platform - Your Creative AI Companion</p>
        </div>
      </div>
    </div>
  );
}

export default App;
