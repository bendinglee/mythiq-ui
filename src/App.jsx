import React, { useState, useEffect, useRef } from 'react';
import './App.css';

// Enhanced Revolutionary Ultimate Game Maker Frontend
// Version: 15.0.0 - DISPLAY FIXED VERSION
// Compatible with UltimateGameCreator architecture

const App = () => {
  // Core state management
  const [activeTab, setActiveTab] = useState('ultimate-creator');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Game generation state
  const [gamePrompt, setGamePrompt] = useState('');
  const [gameMode, setGameMode] = useState('ultimate');
  const [gameCategory, setGameCategory] = useState('auto');
  const [artStyle, setArtStyle] = useState('auto');
  const [multiplayerMode, setMultiplayerMode] = useState('single_player');
  const [generatedGame, setGeneratedGame] = useState(null);
  const [gameHistory, setGameHistory] = useState([]);

  // Advanced features state
  const [exportFormat, setExportFormat] = useState('html5');
  const [customSettings, setCustomSettings] = useState({
    difficulty: 'auto',
    theme: 'auto',
    features: []
  });

  // Multiplayer state
  const [multiplayerRoom, setMultiplayerRoom] = useState(null);
  const [connectedPlayers, setConnectedPlayers] = useState([]);
  const [isHost, setIsHost] = useState(false);

  // Chat and media state (existing functionality preserved)
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState('');
  const [generatedImage, setGeneratedImage] = useState('');
  const [generatedAudio, setGeneratedAudio] = useState('');
  const [generatedVideo, setGeneratedVideo] = useState('');
  const [generatedSpeech, setGeneratedSpeech] = useState('');
  const [generatedMusic, setGeneratedMusic] = useState('');

  // Media generation state
  const [imagePrompt, setImagePrompt] = useState('');
  const [audioPrompt, setAudioPrompt] = useState('');
  const [videoPrompt, setVideoPrompt] = useState('');
  const [speechText, setSpeechText] = useState('');
  const [musicPrompt, setMusicPrompt] = useState('');
  const [voiceType, setVoiceType] = useState('female');

  // Refs
  const messagesEndRef = useRef(null);
  const gamePreviewRef = useRef(null);

  // Game categories and options
  const gameCategories = [
    { value: 'auto', label: 'Auto-Detect from Prompt' },
    { value: 'rpg', label: 'RPG (Role-Playing Games)' },
    { value: 'sandbox', label: 'Sandbox (Creative Building)' },
    { value: 'strategy', label: 'Strategy (Tactical Games)' },
    { value: 'puzzle', label: 'Puzzle (Logic Games)' },
    { value: 'simulation', label: 'Simulation (Life/Business)' },
    { value: 'darts', label: 'Darts (Classic Sports)' },
    { value: 'basketball', label: 'Basketball (Sports)' },
    { value: 'underwater', label: 'Underwater (Adventure)' },
    { value: 'medieval', label: 'Medieval (Fantasy)' },
    { value: 'space', label: 'Space (Sci-Fi Action)' },
    { value: 'racing', label: 'Racing (High-Speed)' }
  ];

  const artStyles = [
    { value: 'auto', label: 'Auto-Select Style' },
    { value: 'pixel', label: 'Pixel Art (Retro 8-bit)' },
    { value: 'vector', label: 'Vector Graphics (Clean)' },
    { value: '3d_lowpoly', label: '3D Low-Poly (Modern)' },
    { value: 'hand_drawn', label: 'Hand-Drawn (Artistic)' },
    { value: 'photorealistic', label: 'Photorealistic (High-Fidelity)' },
    { value: 'abstract', label: 'Abstract (Geometric)' }
  ];

  const multiplayerModes = [
    { value: 'single_player', label: 'Single Player' },
    { value: 'competitive', label: 'Competitive (Head-to-Head)' },
    { value: 'cooperative', label: 'Cooperative (Team-Based)' },
    { value: 'turn_based', label: 'Turn-Based (Strategic)' },
    { value: 'real_time', label: 'Real-Time (Live Action)' }
  ];

  const exportFormats = [
    { value: 'html5', label: 'HTML5 (Web Browser)' },
    { value: 'unity', label: 'Unity Project (C#)' },
    { value: 'godot', label: 'Godot Project (GDScript)' },
    { value: 'phaser', label: 'Phaser.js (JavaScript)' },
    { value: 'android', label: 'Android APK' },
    { value: 'ios', label: 'iOS App' },
    { value: 'windows', label: 'Windows Executable' },
    { value: 'mac', label: 'macOS Application' },
    { value: 'linux', label: 'Linux Binary' },
    { value: 'steam', label: 'Steam Ready' },
    { value: 'itch', label: 'Itch.io Package' },
    { value: 'gamemaker', label: 'GameMaker Studio' }
  ];

  // Game generation function
  const handleUltimateGameSubmit = async () => {
    if (!gamePrompt.trim()) {
      setError('Please enter a game description');
      return;
    }

    setIsLoading(true);
    setError('');
    setSuccess('');

    try {
      const endpoint = gameMode === 'ultimate' ? '/ultimate-generate-game' : 
                     gameMode === 'free_ai' ? '/ai-generate-game' : '/generate-game';
      
      const response = await fetch(`https://mythiq-game-maker-production.up.railway.app${endpoint}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          prompt: gamePrompt,
          mode: gameMode,
          category: gameCategory,
          art_style: artStyle,
          multiplayer_mode: multiplayerMode,
          export_format: exportFormat,
          custom_settings: customSettings
        }),
      });

      if (!response.ok) {
        throw new Error(`Generation failed: ${response.status}`);
      }

      const data = await response.json();
      
      if (data.success && data.game) {
        setGeneratedGame(data.game);
        setSuccess('Game generated successfully!');
        
        // Add to history
        const newGame = {
          id: data.game.id || Date.now(),
          prompt: gamePrompt,
          mode: gameMode,
          timestamp: new Date().toISOString(),
          ...data.game
        };
        setGameHistory(prev => [newGame, ...prev.slice(0, 9)]);
      } else {
        throw new Error(data.error || 'Generation failed');
      }
    } catch (err) {
      console.error('Game generation error:', err);
      setError(`Generation failed: ${err.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  // Download game function
  const downloadGame = async () => {
    if (!generatedGame?.id) return;
    
    try {
      const response = await fetch(`https://mythiq-game-maker-production.up.railway.app/download-game/${generatedGame.id}`);
      if (response.ok) {
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `${generatedGame.title || 'game'}.zip`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        window.URL.revokeObjectURL(url);
      }
    } catch (err) {
      console.error('Download failed:', err);
      setError('Download failed');
    }
  };

  // Open game in new window
  const openGameInNewWindow = () => {
    if (!generatedGame?.id) return;
    
    const gameUrl = `https://mythiq-game-maker-production.up.railway.app/play-game/${generatedGame.id}`;
    window.open(gameUrl, '_blank', 'width=800,height=600');
  };

  // Render game display
  const renderGameDisplay = () => {
    if (!generatedGame) return null;

    return (
      <div style={{ marginTop: '20px', padding: '20px', border: '2px solid #4CAF50', borderRadius: '10px', backgroundColor: '#f9f9f9' }}>
        <h3 style={{ color: '#2E7D32', marginBottom: '15px' }}>🎮 Generated Game: {generatedGame.title}</h3>
        
        {generatedGame.html && (
          <div style={{ marginBottom: '15px' }}>
            <iframe
              ref={gamePreviewRef}
              srcDoc={generatedGame.html}
              style={{
                width: '100%',
                height: '400px',
                border: '1px solid #ddd',
                borderRadius: '5px',
                backgroundColor: 'white'
              }}
              title="Game Preview"
            />
          </div>
        )}
        
        <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
          <button
            onClick={openGameInNewWindow}
            style={{
              padding: '10px 20px',
              backgroundColor: '#2196F3',
              color: 'white',
              border: 'none',
              borderRadius: '5px',
              cursor: 'pointer',
              fontSize: '14px'
            }}
          >
            🚀 Open in New Window
          </button>
          
          <button
            onClick={downloadGame}
            style={{
              padding: '10px 20px',
              backgroundColor: '#FF9800',
              color: 'white',
              border: 'none',
              borderRadius: '5px',
              cursor: 'pointer',
              fontSize: '14px'
            }}
          >
            📥 Download
          </button>
        </div>
        
        {generatedGame.description && (
          <p style={{ marginTop: '15px', color: '#666', fontSize: '14px' }}>
            {generatedGame.description}
          </p>
        )}
      </div>
    );
  };

  // Chat functions (preserved from original)
  const handleSendMessage = async () => {
    if (!inputMessage.trim()) return;

    const userMessage = { role: 'user', content: inputMessage };
    setMessages(prev => [...prev, userMessage]);
    setInputMessage('');
    setIsLoading(true);

    try {
      const response = await fetch('https://mythiq-assistant-production.up.railway.app/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: inputMessage }),
      });

      if (response.ok) {
        const data = await response.json();
        setMessages(prev => [...prev, { role: 'assistant', content: data.response }]);
      } else {
        setMessages(prev => [...prev, { role: 'assistant', content: 'Sorry, I encountered an error. Please try again.' }]);
      }
    } catch (error) {
      setMessages(prev => [...prev, { role: 'assistant', content: 'Sorry, I encountered an error. Please try again.' }]);
    } finally {
      setIsLoading(false);
    }
  };

  // Media generation functions (preserved from original)
  const handleImageGeneration = async () => {
    if (!imagePrompt.trim()) return;
    setIsLoading(true);
    try {
      const response = await fetch('https://mythiq-media-creator-production.up.railway.app/generate-image', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt: imagePrompt }),
      });
      if (response.ok) {
        const data = await response.json();
        setGeneratedImage(data.image_url);
        setSuccess('Image generated successfully!');
      }
    } catch (error) {
      setError('Image generation failed');
    } finally {
      setIsLoading(false);
    }
  };

  const handleAudioGeneration = async () => {
    if (!audioPrompt.trim()) return;
    setIsLoading(true);
    try {
      const response = await fetch('https://mythiq-audio-creator-production.up.railway.app/generate-music', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt: audioPrompt }),
      });
      if (response.ok) {
        const data = await response.json();
        setGeneratedAudio(data.audio_url);
        setSuccess('Audio generated successfully!');
      }
    } catch (error) {
      setError('Audio generation failed');
    } finally {
      setIsLoading(false);
    }
  };

  const handleVideoGeneration = async () => {
    if (!videoPrompt.trim()) return;
    setIsLoading(true);
    try {
      const response = await fetch('https://mythiq-video-creator-production.up.railway.app/generate-video', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt: videoPrompt }),
      });
      if (response.ok) {
        const data = await response.json();
        setGeneratedVideo(data.video_url);
        setSuccess('Video generated successfully!');
      }
    } catch (error) {
      setError('Video generation failed');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSpeechGeneration = async () => {
    if (!speechText.trim()) return;
    setIsLoading(true);
    try {
      const response = await fetch('https://mythiq-audio-creator-production.up.railway.app/generate-speech', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: speechText, voice: voiceType }),
      });
      if (response.ok) {
        const data = await response.json();
        setGeneratedSpeech(data.audio_url);
        setSuccess('Speech generated successfully!');
      }
    } catch (error) {
      setError('Speech generation failed');
    } finally {
      setIsLoading(false);
    }
  };

  // Auto-scroll chat
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  return (
    <div style={{ 
      fontFamily: 'Arial, sans-serif', 
      maxWidth: '1200px', 
      margin: '0 auto', 
      padding: '20px',
      backgroundColor: '#f5f5f5',
      minHeight: '100vh'
    }}>
      {/* Header */}
      <div style={{ 
        textAlign: 'center', 
        marginBottom: '30px',
        padding: '20px',
        backgroundColor: 'white',
        borderRadius: '10px',
        boxShadow: '0 2px 10px rgba(0,0,0,0.1)'
      }}>
        <h1 style={{ 
          color: '#2E7D32', 
          marginBottom: '10px',
          fontSize: '2.5em',
          fontWeight: 'bold'
        }}>
          🎮 MYTHIQ AI - Revolutionary Ultimate Game Maker
        </h1>
        <p style={{ 
          color: '#666', 
          fontSize: '1.1em',
          margin: '0'
        }}>
          Enhanced v15.0.0 - Advanced Features & Code Export
        </p>
      </div>

      {/* Navigation Tabs */}
      <div style={{ 
        display: 'flex', 
        marginBottom: '20px',
        backgroundColor: 'white',
        borderRadius: '10px',
        padding: '10px',
        boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
        flexWrap: 'wrap',
        gap: '5px'
      }}>
        {[
          { id: 'ultimate-creator', label: '🎯 Ultimate Creator', color: '#4CAF50' },
          { id: 'multiplayer', label: '👥 Multiplayer', color: '#2196F3' },
          { id: 'chat', label: '💬 AI Assistant', color: '#9C27B0' },
          { id: 'media', label: '🎨 Media Studio', color: '#FF5722' },
          { id: 'audio', label: '🎵 Audio Studio', color: '#FF9800' },
          { id: 'video', label: '🎬 Video Studio', color: '#E91E63' }
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            style={{
              padding: '12px 20px',
              backgroundColor: activeTab === tab.id ? tab.color : '#f0f0f0',
              color: activeTab === tab.id ? 'white' : '#333',
              border: 'none',
              borderRadius: '8px',
              cursor: 'pointer',
              fontSize: '14px',
              fontWeight: 'bold',
              transition: 'all 0.3s ease',
              flex: '1',
              minWidth: '150px'
            }}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Status Messages */}
      {error && (
        <div style={{ 
          padding: '15px', 
          backgroundColor: '#ffebee', 
          color: '#c62828', 
          borderRadius: '8px', 
          marginBottom: '20px',
          border: '1px solid #ef5350'
        }}>
          ❌ {error}
        </div>
      )}
      
      {success && (
        <div style={{ 
          padding: '15px', 
          backgroundColor: '#e8f5e8', 
          color: '#2e7d32', 
          borderRadius: '8px', 
          marginBottom: '20px',
          border: '1px solid #4caf50'
        }}>
          ✅ {success}
        </div>
      )}

      {/* Ultimate Game Creator Tab */}
      {activeTab === 'ultimate-creator' && (
        <div style={{ 
          backgroundColor: 'white', 
          padding: '30px', 
          borderRadius: '10px',
          boxShadow: '0 2px 10px rgba(0,0,0,0.1)'
        }}>
          <h2 style={{ color: '#4CAF50', marginBottom: '20px', fontSize: '1.8em' }}>
            🎮 Enhanced Ultimate Game Creator
          </h2>
          <p style={{ color: '#666', marginBottom: '25px', fontSize: '1.1em' }}>
            Create revolutionary games with advanced AI, multiple categories, art styles, and code export!
          </p>

          {/* Game Description */}
          <div style={{ marginBottom: '20px' }}>
            <label style={{ 
              display: 'block', 
              marginBottom: '8px', 
              fontWeight: 'bold',
              color: '#333',
              fontSize: '1.1em'
            }}>
              Game Description
            </label>
            <textarea
              value={gamePrompt}
              onChange={(e) => setGamePrompt(e.target.value)}
              placeholder="Describe your dream game... (e.g., 'Create an epic RPG with dragons and magic spells')"
              style={{
                width: '100%',
                height: '100px',
                padding: '15px',
                border: '2px solid #ddd',
                borderRadius: '8px',
                fontSize: '16px',
                resize: 'vertical',
                fontFamily: 'Arial, sans-serif'
              }}
            />
          </div>

          {/* Settings Grid */}
          <div style={{ 
            display: 'grid', 
            gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', 
            gap: '20px', 
            marginBottom: '25px' 
          }}>
            {/* Quality Mode */}
            <div>
              <label style={{ 
                display: 'block', 
                marginBottom: '8px', 
                fontWeight: 'bold',
                color: '#333'
              }}>
                Quality Mode
              </label>
              <select
                value={gameMode}
                onChange={(e) => setGameMode(e.target.value)}
                style={{
                  width: '100%',
                  padding: '12px',
                  border: '2px solid #ddd',
                  borderRadius: '8px',
                  fontSize: '14px',
                  backgroundColor: 'white'
                }}
              >
                <option value="ultimate">Ultimate (10/10) - Revolutionary Features</option>
                <option value="free_ai">FREE AI (9/10) - Advanced AI Enhanced</option>
                <option value="enhanced">Enhanced (8/10) - Professional Quality</option>
                <option value="basic">Basic (7/10) - Standard Features</option>
              </select>
            </div>

            {/* Game Category */}
            <div>
              <label style={{ 
                display: 'block', 
                marginBottom: '8px', 
                fontWeight: 'bold',
                color: '#333'
              }}>
                Game Category
              </label>
              <select
                value={gameCategory}
                onChange={(e) => setGameCategory(e.target.value)}
                style={{
                  width: '100%',
                  padding: '12px',
                  border: '2px solid #ddd',
                  borderRadius: '8px',
                  fontSize: '14px',
                  backgroundColor: 'white'
                }}
              >
                {gameCategories.map(category => (
                  <option key={category.value} value={category.value}>
                    {category.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Art Style */}
            <div>
              <label style={{ 
                display: 'block', 
                marginBottom: '8px', 
                fontWeight: 'bold',
                color: '#333'
              }}>
                Art Style
              </label>
              <select
                value={artStyle}
                onChange={(e) => setArtStyle(e.target.value)}
                style={{
                  width: '100%',
                  padding: '12px',
                  border: '2px solid #ddd',
                  borderRadius: '8px',
                  fontSize: '14px',
                  backgroundColor: 'white'
                }}
              >
                {artStyles.map(style => (
                  <option key={style.value} value={style.value}>
                    {style.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Multiplayer Mode */}
            <div>
              <label style={{ 
                display: 'block', 
                marginBottom: '8px', 
                fontWeight: 'bold',
                color: '#333'
              }}>
                Multiplayer Mode
              </label>
              <select
                value={multiplayerMode}
                onChange={(e) => setMultiplayerMode(e.target.value)}
                style={{
                  width: '100%',
                  padding: '12px',
                  border: '2px solid #ddd',
                  borderRadius: '8px',
                  fontSize: '14px',
                  backgroundColor: 'white'
                }}
              >
                {multiplayerModes.map(mode => (
                  <option key={mode.value} value={mode.value}>
                    {mode.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Generate Button */}
          <button
            onClick={handleUltimateGameSubmit}
            disabled={isLoading}
            style={{
              width: '100%',
              padding: '18px',
              backgroundColor: isLoading ? '#ccc' : '#4CAF50',
              color: 'white',
              border: 'none',
              borderRadius: '10px',
              fontSize: '18px',
              fontWeight: 'bold',
              cursor: isLoading ? 'not-allowed' : 'pointer',
              transition: 'all 0.3s ease',
              marginBottom: '20px'
            }}
          >
            {isLoading ? '🔄 Generating...' : '🎮 CREATE ULTIMATE GAME'}
          </button>

          {/* Generated Game Display */}
          {renderGameDisplay()}
        </div>
      )}

      {/* Other tabs content preserved from original... */}
      {activeTab === 'chat' && (
        <div style={{ backgroundColor: 'white', padding: '20px', borderRadius: '10px', boxShadow: '0 2px 10px rgba(0,0,0,0.1)' }}>
          <h2 style={{ color: '#9C27B0', marginBottom: '20px' }}>💬 AI Assistant</h2>
          <div style={{ height: '400px', overflowY: 'auto', border: '1px solid #ddd', padding: '15px', marginBottom: '15px', borderRadius: '8px', backgroundColor: '#fafafa' }}>
            {messages.map((msg, index) => (
              <div key={index} style={{ marginBottom: '15px', padding: '10px', backgroundColor: msg.role === 'user' ? '#e3f2fd' : '#f3e5f5', borderRadius: '8px' }}>
                <strong>{msg.role === 'user' ? 'You' : 'AI Assistant'}:</strong> {msg.content}
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>
          <div style={{ display: 'flex', gap: '10px' }}>
            <input
              type="text"
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
              placeholder="Ask me anything..."
              style={{ flex: 1, padding: '12px', border: '2px solid #ddd', borderRadius: '8px', fontSize: '14px' }}
            />
            <button onClick={handleSendMessage} disabled={isLoading} style={{ padding: '12px 20px', backgroundColor: '#9C27B0', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer' }}>
              Send
            </button>
          </div>
        </div>
      )}

      {/* Media Studio Tab */}
      {activeTab === 'media' && (
        <div style={{ backgroundColor: 'white', padding: '20px', borderRadius: '10px', boxShadow: '0 2px 10px rgba(0,0,0,0.1)' }}>
          <h2 style={{ color: '#FF5722', marginBottom: '20px' }}>🎨 Media Studio</h2>
          <div style={{ marginBottom: '20px' }}>
            <input
              type="text"
              value={imagePrompt}
              onChange={(e) => setImagePrompt(e.target.value)}
              placeholder="Describe the image you want to generate..."
              style={{ width: '100%', padding: '12px', border: '2px solid #ddd', borderRadius: '8px', fontSize: '14px', marginBottom: '10px' }}
            />
            <button onClick={handleImageGeneration} disabled={isLoading} style={{ padding: '12px 20px', backgroundColor: '#FF5722', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer' }}>
              Generate Image
            </button>
          </div>
          {generatedImage && (
            <div style={{ marginTop: '20px' }}>
              <img src={generatedImage} alt="Generated" style={{ maxWidth: '100%', borderRadius: '8px' }} />
            </div>
          )}
        </div>
      )}

      {/* Audio Studio Tab */}
      {activeTab === 'audio' && (
        <div style={{ backgroundColor: 'white', padding: '20px', borderRadius: '10px', boxShadow: '0 2px 10px rgba(0,0,0,0.1)' }}>
          <h2 style={{ color: '#FF9800', marginBottom: '20px' }}>🎵 Audio Studio</h2>
          
          {/* Music Generation */}
          <div style={{ marginBottom: '30px' }}>
            <h3>🎼 Music Generation</h3>
            <input
              type="text"
              value={audioPrompt}
              onChange={(e) => setAudioPrompt(e.target.value)}
              placeholder="Describe the music you want..."
              style={{ width: '100%', padding: '12px', border: '2px solid #ddd', borderRadius: '8px', fontSize: '14px', marginBottom: '10px' }}
            />
            <button onClick={handleAudioGeneration} disabled={isLoading} style={{ padding: '12px 20px', backgroundColor: '#FF9800', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer' }}>
              Generate Music
            </button>
            {generatedAudio && (
              <div style={{ marginTop: '15px' }}>
                <audio controls style={{ width: '100%' }}>
                  <source src={generatedAudio} type="audio/mpeg" />
                </audio>
              </div>
            )}
          </div>

          {/* Speech Generation */}
          <div>
            <h3>🗣️ Speech Generation</h3>
            <textarea
              value={speechText}
              onChange={(e) => setSpeechText(e.target.value)}
              placeholder="Enter text to convert to speech..."
              style={{ width: '100%', height: '100px', padding: '12px', border: '2px solid #ddd', borderRadius: '8px', fontSize: '14px', marginBottom: '10px', resize: 'vertical' }}
            />
            <div style={{ marginBottom: '10px' }}>
              <select
                value={voiceType}
                onChange={(e) => setVoiceType(e.target.value)}
                style={{ padding: '8px', border: '2px solid #ddd', borderRadius: '8px', marginRight: '10px' }}
              >
                <option value="female">Female Voice</option>
                <option value="male">Male Voice</option>
              </select>
              <button onClick={handleSpeechGeneration} disabled={isLoading} style={{ padding: '12px 20px', backgroundColor: '#FF9800', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer' }}>
                Generate Speech
              </button>
            </div>
            {generatedSpeech && (
              <div style={{ marginTop: '15px' }}>
                <audio controls style={{ width: '100%' }}>
                  <source src={generatedSpeech} type="audio/mpeg" />
                </audio>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Video Studio Tab */}
      {activeTab === 'video' && (
        <div style={{ backgroundColor: 'white', padding: '20px', borderRadius: '10px', boxShadow: '0 2px 10px rgba(0,0,0,0.1)' }}>
          <h2 style={{ color: '#E91E63', marginBottom: '20px' }}>🎬 Video Studio</h2>
          <div style={{ marginBottom: '20px' }}>
            <input
              type="text"
              value={videoPrompt}
              onChange={(e) => setVideoPrompt(e.target.value)}
              placeholder="Describe the video you want to generate..."
              style={{ width: '100%', padding: '12px', border: '2px solid #ddd', borderRadius: '8px', fontSize: '14px', marginBottom: '10px' }}
            />
            <button onClick={handleVideoGeneration} disabled={isLoading} style={{ padding: '12px 20px', backgroundColor: '#E91E63', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer' }}>
              Generate Video
            </button>
          </div>
          {generatedVideo && (
            <div style={{ marginTop: '20px' }}>
              <video controls style={{ width: '100%', maxHeight: '400px' }}>
                <source src={generatedVideo} type="video/mp4" />
                Your browser does not support the video element.
              </video>
            </div>
          )}
        </div>
      )}

      {/* Footer */}
      <div style={{ 
        textAlign: 'center', 
        marginTop: '40px', 
        padding: '20px',
        backgroundColor: 'white',
        borderRadius: '10px',
        boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
        color: '#666'
      }}>
        <p>© 2024 MYTHIQ AI - Revolutionary Ultimate Game Maker v15.0.0 Enhanced</p>
        <p>🚀 Advanced Features | 💻 Code Export | 👥 Multiplayer | 🎨 Media Studio</p>
      </div>
    </div>
  );
};

export default App;
