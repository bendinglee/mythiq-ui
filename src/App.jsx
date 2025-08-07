import React, { useState, useEffect, useRef } from 'react';
import './App.css';

// Enhanced Revolutionary Ultimate Game Maker Frontend
// Version: 15.0.0 - REVOLUTIONARY EXPANSION
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
    { value: 'pixel_art', label: 'Pixel Art (Retro 8-bit)' },
    { value: 'vector', label: 'Vector Graphics (Clean)' },
    { value: 'low_poly', label: '3D Low-Poly (Modern)' },
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
    { value: 'html5', label: 'HTML5/JavaScript (Web)' },
    { value: 'unity', label: 'Unity Project (C#)' },
    { value: 'godot', label: 'Godot Project (GDScript)' },
    { value: 'unreal', label: 'Unreal Engine (C++)' },
    { value: 'gamemaker', label: 'GameMaker Studio' },
    { value: 'construct3', label: 'Construct 3' },
    { value: 'phaser', label: 'Phaser.js Framework' },
    { value: 'python', label: 'Python/Pygame' },
    { value: 'javascript', label: 'Pure JavaScript' },
    { value: 'android', label: 'Android APK' },
    { value: 'ios', label: 'iOS App' },
    { value: 'windows', label: 'Windows Executable' }
  ];

  // Utility functions
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const showMessage = (message, type = 'info') => {
    if (type === 'error') {
      setError(message);
      setTimeout(() => setError(''), 5000);
    } else {
      setSuccess(message);
      setTimeout(() => setSuccess(''), 5000);
    }
  };

  // Enhanced game generation function
  const handleUltimateGameSubmit = async () => {
    if (!gamePrompt.trim()) {
      showMessage('Please enter a game description', 'error');
      return;
    }

    setIsLoading(true);
    setError('');
    setSuccess('');

    try {
      const endpoint = gameMode === 'ultimate' ? '/ultimate-generate-game' : 
                     gameMode === 'free_ai' ? '/ai-generate-game' : '/generate-game';

      const requestData = {
        prompt: gamePrompt,
        mode: gameMode,
        category: gameCategory !== 'auto' ? gameCategory : undefined,
        art_style: artStyle !== 'auto' ? artStyle : undefined,
        multiplayer_mode: multiplayerMode,
        custom_settings: customSettings
      };

      const response = await fetch(`https://mythiq-game-maker-production.up.railway.app${endpoint}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestData)
      });

      const data = await response.json();

      if (data.success) {
        setGeneratedGame(data.game);
        setGameHistory(prev => [data.game, ...prev.slice(0, 9)]); // Keep last 10 games
        showMessage(`${gameMode.toUpperCase()} game generated successfully!`);
        
        // Auto-scroll to preview
        setTimeout(() => {
          gamePreviewRef.current?.scrollIntoView({ behavior: 'smooth' });
        }, 500);
      } else {
        throw new Error(data.message || 'Game generation failed');
      }
    } catch (error) {
      console.error('Game generation error:', error);
      showMessage(`Generation failed: ${error.message}`, 'error');
    } finally {
      setIsLoading(false);
    }
  };

  // Download game function
  const downloadGame = async () => {
    if (!generatedGame) return;

    try {
      const response = await fetch(`https://mythiq-game-maker-production.up.railway.app/download-game/${generatedGame.id}`);
      
      if (response.ok) {
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `${generatedGame.title.replace(/\s+/g, '_')}_${generatedGame.id}.zip`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        window.URL.revokeObjectURL(url);
        showMessage('Game downloaded successfully!');
      } else {
        throw new Error('Download failed');
      }
    } catch (error) {
      showMessage(`Download failed: ${error.message}`, 'error');
    }
  };

  // Export code function
  const exportCode = async () => {
    if (!generatedGame) return;

    try {
      const response = await fetch(`https://mythiq-game-maker-production.up.railway.app/export-code/${generatedGame.id}/${exportFormat}`);
      
      if (response.ok) {
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `${generatedGame.title.replace(/\s+/g, '_')}_${exportFormat}_${generatedGame.id}.zip`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        window.URL.revokeObjectURL(url);
        showMessage(`${exportFormat.toUpperCase()} code exported successfully!`);
      } else {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Export failed');
      }
    } catch (error) {
      showMessage(`Export failed: ${error.message}`, 'error');
    }
  };

  // Open game in new window
  const openGameInNewWindow = () => {
    if (!generatedGame) return;
    
    const gameUrl = `https://mythiq-game-maker-production.up.railway.app/play-game/${generatedGame.id}`;
    window.open(gameUrl, '_blank', 'width=800,height=600,scrollbars=yes,resizable=yes');
    showMessage('Game opened in new window!');
  };

  // Existing media generation functions (preserved)
  const handleChatSubmit = async () => {
    if (!inputMessage.trim()) return;

    const userMessage = { role: 'user', content: inputMessage };
    setMessages(prev => [...prev, userMessage]);
    setInputMessage('');
    setIsLoading(true);

    try {
      const response = await fetch('https://mythiq-assistant-production.up.railway.app/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: inputMessage })
      });

      const data = await response.json();
      
      if (data.success) {
        const assistantMessage = { role: 'assistant', content: data.response };
        setMessages(prev => [...prev, assistantMessage]);
      } else {
        throw new Error(data.message || 'Chat failed');
      }
    } catch (error) {
      const errorMessage = { role: 'assistant', content: `Error: ${error.message}` };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleImageGeneration = async () => {
    if (!imagePrompt.trim()) return;
    
    setIsLoading(true);
    try {
      const response = await fetch('https://mythiq-media-creator-production.up.railway.app/generate-image', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt: imagePrompt })
      });

      const data = await response.json();
      if (data.success) {
        setGeneratedImage(data.image_url);
        showMessage('Image generated successfully!');
      } else {
        throw new Error(data.message || 'Image generation failed');
      }
    } catch (error) {
      showMessage(`Image generation failed: ${error.message}`, 'error');
    } finally {
      setIsLoading(false);
    }
  };

  const handleAudioGeneration = async () => {
    if (!audioPrompt.trim()) return;
    
    setIsLoading(true);
    try {
      const response = await fetch('https://mythiq-audio-creator-production.up.railway.app/generate-audio', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt: audioPrompt })
      });

      const data = await response.json();
      if (data.success) {
        setGeneratedAudio(data.audio_url);
        showMessage('Audio generated successfully!');
      } else {
        throw new Error(data.message || 'Audio generation failed');
      }
    } catch (error) {
      showMessage(`Audio generation failed: ${error.message}`, 'error');
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
        body: JSON.stringify({ prompt: videoPrompt })
      });

      const data = await response.json();
      if (data.success) {
        setGeneratedVideo(data.video_url);
        showMessage('Video generated successfully!');
      } else {
        throw new Error(data.message || 'Video generation failed');
      }
    } catch (error) {
      showMessage(`Video generation failed: ${error.message}`, 'error');
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
        body: JSON.stringify({ text: speechText, voice: voiceType })
      });

      const data = await response.json();
      if (data.success) {
        setGeneratedSpeech(data.audio_url);
        showMessage('Speech generated successfully!');
      } else {
        throw new Error(data.message || 'Speech generation failed');
      }
    } catch (error) {
      showMessage(`Speech generation failed: ${error.message}`, 'error');
    } finally {
      setIsLoading(false);
    }
  };

  const handleMusicGeneration = async () => {
    if (!musicPrompt.trim()) return;
    
    setIsLoading(true);
    try {
      const response = await fetch('https://mythiq-audio-creator-production.up.railway.app/generate-music', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt: musicPrompt })
      });

      const data = await response.json();
      if (data.success) {
        setGeneratedMusic(data.audio_url);
        showMessage('Music generated successfully!');
      } else {
        throw new Error(data.message || 'Music generation failed');
      }
    } catch (error) {
      showMessage(`Music generation failed: ${error.message}`, 'error');
    } finally {
      setIsLoading(false);
    }
  };

  // Effect hooks
  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Render game display component
  const renderGameDisplay = () => {
    if (!generatedGame) return null;

    return (
      <div className="game-display" ref={gamePreviewRef}>
        <div className="game-info">
          <h3>{generatedGame.title}</h3>
          <div className="game-meta">
            <span className="game-type">{generatedGame.type.toUpperCase()}</span>
            <span className="game-quality">{generatedGame.quality}</span>
            <span className="game-character">{generatedGame.character}</span>
          </div>
          <div className="game-details">
            <p><strong>Theme:</strong> {generatedGame.theme}</p>
            <p><strong>Difficulty:</strong> {generatedGame.difficulty}</p>
            <p><strong>Art Style:</strong> {generatedGame.art_style}</p>
            <p><strong>Multiplayer:</strong> {generatedGame.multiplayer_mode}</p>
            <p><strong>Features:</strong> {generatedGame.features.join(', ')}</p>
          </div>
        </div>
        
        <div className="game-preview">
          <iframe
            src={`https://mythiq-game-maker-production.up.railway.app/play-game/${generatedGame.id}`}
            title={generatedGame.title}
            width="100%"
            height="400"
            frameBorder="0"
            style={{ borderRadius: '10px', border: '2px solid #333' }}
          />
        </div>
        
        <div className="game-actions">
          <button className="action-btn primary" onClick={openGameInNewWindow}>
            🚀 Open in New Window
          </button>
          <button className="action-btn secondary" onClick={downloadGame}>
            📥 Download ZIP
          </button>
          <div className="export-section">
            <select 
              value={exportFormat} 
              onChange={(e) => setExportFormat(e.target.value)}
              className="export-select"
            >
              {exportFormats.map(format => (
                <option key={format.value} value={format.value}>
                  {format.label}
                </option>
              ))}
            </select>
            <button className="action-btn export" onClick={exportCode}>
              💻 Export Code
            </button>
          </div>
        </div>
      </div>
    );
  };

  // Render game history
  const renderGameHistory = () => {
    if (gameHistory.length === 0) return null;

    return (
      <div className="game-history">
        <h3>Recent Games</h3>
        <div className="history-grid">
          {gameHistory.map((game, index) => (
            <div key={game.id} className="history-item" onClick={() => setGeneratedGame(game)}>
              <div className="history-title">{game.title}</div>
              <div className="history-meta">
                <span>{game.type}</span>
                <span>{game.quality}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  };

  return (
    <div className="app">
      {/* Header */}
      <header className="app-header">
        <div className="header-content">
          <h1 className="app-title">🎮 MYTHIQ.AI - Revolutionary Ultimate Game Maker</h1>
          <p className="app-subtitle">Enhanced v15.0.0 - Advanced Features & Code Export</p>
        </div>
      </header>

      {/* Navigation */}
      <nav className="app-nav">
        <button 
          className={`nav-btn ${activeTab === 'ultimate-creator' ? 'active' : ''}`}
          onClick={() => setActiveTab('ultimate-creator')}
        >
          🎯 Ultimate Creator
        </button>
        <button 
          className={`nav-btn ${activeTab === 'multiplayer' ? 'active' : ''}`}
          onClick={() => setActiveTab('multiplayer')}
        >
          👥 Multiplayer
        </button>
        <button 
          className={`nav-btn ${activeTab === 'ai-chat' ? 'active' : ''}`}
          onClick={() => setActiveTab('ai-chat')}
        >
          💬 AI Assistant
        </button>
        <button 
          className={`nav-btn ${activeTab === 'media-studio' ? 'active' : ''}`}
          onClick={() => setActiveTab('media-studio')}
        >
          🎨 Media Studio
        </button>
        <button 
          className={`nav-btn ${activeTab === 'audio-studio' ? 'active' : ''}`}
          onClick={() => setActiveTab('audio-studio')}
        >
          🎵 Audio Studio
        </button>
        <button 
          className={`nav-btn ${activeTab === 'video-studio' ? 'active' : ''}`}
          onClick={() => setActiveTab('video-studio')}
        >
          🎬 Video Studio
        </button>
      </nav>

      {/* Status Messages */}
      {error && <div className="status-message error">{error}</div>}
      {success && <div className="status-message success">{success}</div>}

      {/* Main Content */}
      <main className="app-main">
        {/* Ultimate Creator Tab */}
        {activeTab === 'ultimate-creator' && (
          <div className="tab-content">
            <div className="creator-section">
              <h2>🚀 Enhanced Ultimate Game Creator</h2>
              <p>Create revolutionary games with advanced AI, multiple categories, art styles, and code export!</p>
              
              {/* Game Generation Form */}
              <div className="generation-form">
                <div className="form-row">
                  <div className="form-group">
                    <label>Game Description</label>
                    <textarea
                      value={gamePrompt}
                      onChange={(e) => setGamePrompt(e.target.value)}
                      placeholder="Describe your dream game... (e.g., 'Create an epic RPG with dragons and magic spells' or 'Build a sandbox world with unlimited creativity')"
                      rows={3}
                      className="game-prompt-input"
                    />
                  </div>
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label>Quality Mode</label>
                    <select value={gameMode} onChange={(e) => setGameMode(e.target.value)}>
                      <option value="ultimate">Ultimate (10/10) - Revolutionary Features</option>
                      <option value="free_ai">FREE AI (9/10) - Advanced AI Enhancement</option>
                      <option value="enhanced">Enhanced (8/10) - Professional Quality</option>
                      <option value="basic">Basic (7/10) - Standard Features</option>
                    </select>
                  </div>

                  <div className="form-group">
                    <label>Game Category</label>
                    <select value={gameCategory} onChange={(e) => setGameCategory(e.target.value)}>
                      {gameCategories.map(category => (
                        <option key={category.value} value={category.value}>
                          {category.label}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label>Art Style</label>
                    <select value={artStyle} onChange={(e) => setArtStyle(e.target.value)}>
                      {artStyles.map(style => (
                        <option key={style.value} value={style.value}>
                          {style.label}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="form-group">
                    <label>Multiplayer Mode</label>
                    <select value={multiplayerMode} onChange={(e) => setMultiplayerMode(e.target.value)}>
                      {multiplayerModes.map(mode => (
                        <option key={mode.value} value={mode.value}>
                          {mode.label}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="form-actions">
                  <button 
                    className="generate-btn"
                    onClick={handleUltimateGameSubmit}
                    disabled={isLoading || !gamePrompt.trim()}
                  >
                    {isLoading ? '🔄 Generating...' : '🎮 CREATE ULTIMATE GAME'}
                  </button>
                </div>
              </div>

              {/* Game Display */}
              {renderGameDisplay()}

              {/* Game History */}
              {renderGameHistory()}
            </div>
          </div>
        )}

        {/* Multiplayer Tab */}
        {activeTab === 'multiplayer' && (
          <div className="tab-content">
            <div className="multiplayer-section">
              <h2>👥 Multiplayer Game Creator</h2>
              <p>Create and play games with friends in real-time!</p>
              
              <div className="multiplayer-options">
                <div className="option-card">
                  <h3>🏠 Create Room</h3>
                  <p>Host a multiplayer game session</p>
                  <button className="option-btn">Create Room</button>
                </div>
                
                <div className="option-card">
                  <h3>🔍 Join Room</h3>
                  <p>Join an existing game session</p>
                  <input type="text" placeholder="Enter room code" />
                  <button className="option-btn">Join Room</button>
                </div>
                
                <div className="option-card">
                  <h3>🎲 Quick Match</h3>
                  <p>Find random players to play with</p>
                  <button className="option-btn">Quick Match</button>
                </div>
              </div>

              {multiplayerRoom && (
                <div className="room-info">
                  <h3>Room: {multiplayerRoom.id}</h3>
                  <div className="players-list">
                    <h4>Connected Players ({connectedPlayers.length})</h4>
                    {connectedPlayers.map(player => (
                      <div key={player.id} className="player-item">
                        {player.name} {player.isHost && '👑'}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* AI Chat Tab (Existing functionality preserved) */}
        {activeTab === 'ai-chat' && (
          <div className="tab-content">
            <div className="chat-section">
              <h2>💬 AI Assistant</h2>
              <div className="chat-container">
                <div className="messages-container">
                  {messages.map((message, index) => (
                    <div key={index} className={`message ${message.role}`}>
                      <div className="message-content">{message.content}</div>
                    </div>
                  ))}
                  <div ref={messagesEndRef} />
                </div>
                
                <div className="chat-input-container">
                  <input
                    type="text"
                    value={inputMessage}
                    onChange={(e) => setInputMessage(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && handleChatSubmit()}
                    placeholder="Ask me anything..."
                    disabled={isLoading}
                  />
                  <button onClick={handleChatSubmit} disabled={isLoading || !inputMessage.trim()}>
                    {isLoading ? '⏳' : '📤'}
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Media Studio Tab (Existing functionality preserved) */}
        {activeTab === 'media-studio' && (
          <div className="tab-content">
            <div className="media-section">
              <h2>🎨 Media Studio</h2>
              <div className="media-generator">
                <div className="generator-form">
                  <input
                    type="text"
                    value={imagePrompt}
                    onChange={(e) => setImagePrompt(e.target.value)}
                    placeholder="Describe the image you want to generate..."
                  />
                  <button onClick={handleImageGeneration} disabled={isLoading || !imagePrompt.trim()}>
                    {isLoading ? '🔄 Generating...' : '🎨 Generate Image'}
                  </button>
                </div>
                
                {generatedImage && (
                  <div className="generated-content">
                    <h3>Generated Image:</h3>
                    <img src={generatedImage} alt="Generated" style={{maxWidth: '100%', borderRadius: '10px'}} />
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Audio Studio Tab (Existing functionality preserved) */}
        {activeTab === 'audio-studio' && (
          <div className="tab-content">
            <div className="audio-section">
              <h2>🎵 Audio Studio</h2>
              
              {/* Speech Generation */}
              <div className="audio-generator">
                <h3>🗣️ Text to Speech</h3>
                <div className="generator-form">
                  <textarea
                    value={speechText}
                    onChange={(e) => setSpeechText(e.target.value)}
                    placeholder="Enter text to convert to speech..."
                    rows={3}
                  />
                  <div className="voice-options">
                    <label>
                      <input
                        type="radio"
                        value="female"
                        checked={voiceType === 'female'}
                        onChange={(e) => setVoiceType(e.target.value)}
                      />
                      Female Voice
                    </label>
                    <label>
                      <input
                        type="radio"
                        value="male"
                        checked={voiceType === 'male'}
                        onChange={(e) => setVoiceType(e.target.value)}
                      />
                      Male Voice
                    </label>
                  </div>
                  <button onClick={handleSpeechGeneration} disabled={isLoading || !speechText.trim()}>
                    {isLoading ? '🔄 Generating...' : '🗣️ Generate Speech'}
                  </button>
                </div>
                
                {generatedSpeech && (
                  <div className="generated-content">
                    <h4>Generated Speech:</h4>
                    <audio controls src={generatedSpeech} style={{width: '100%'}} />
                  </div>
                )}
              </div>

              {/* Music Generation */}
              <div className="audio-generator">
                <h3>🎵 AI Music Generator</h3>
                <div className="generator-form">
                  <input
                    type="text"
                    value={musicPrompt}
                    onChange={(e) => setMusicPrompt(e.target.value)}
                    placeholder="Describe the music you want to generate..."
                  />
                  <button onClick={handleMusicGeneration} disabled={isLoading || !musicPrompt.trim()}>
                    {isLoading ? '🔄 Generating...' : '🎵 Generate Music'}
                  </button>
                </div>
                
                {generatedMusic && (
                  <div className="generated-content">
                    <h4>Generated Music:</h4>
                    <audio controls src={generatedMusic} style={{width: '100%'}} />
                  </div>
                )}
              </div>

              {/* Sound Effects */}
              <div className="audio-generator">
                <h3>🔊 Sound Effects</h3>
                <div className="generator-form">
                  <input
                    type="text"
                    value={audioPrompt}
                    onChange={(e) => setAudioPrompt(e.target.value)}
                    placeholder="Describe the sound effect you want..."
                  />
                  <button onClick={handleAudioGeneration} disabled={isLoading || !audioPrompt.trim()}>
                    {isLoading ? '🔄 Generating...' : '🔊 Generate Audio'}
                  </button>
                </div>
                
                {generatedAudio && (
                  <div className="generated-content">
                    <h4>Generated Audio:</h4>
                    <audio controls src={generatedAudio} style={{width: '100%'}} />
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Video Studio Tab (Existing functionality preserved) */}
        {activeTab === 'video-studio' && (
          <div className="tab-content">
            <div className="video-section">
              <h2>🎬 Video Studio</h2>
              <div className="video-generator">
                <div className="generator-form">
                  <textarea
                    value={videoPrompt}
                    onChange={(e) => setVideoPrompt(e.target.value)}
                    placeholder="Describe the video you want to generate..."
                    rows={3}
                  />
                  <button onClick={handleVideoGeneration} disabled={isLoading || !videoPrompt.trim()}>
                    {isLoading ? '🔄 Generating...' : '🎬 Generate Video'}
                  </button>
                </div>
                
                {generatedVideo && (
                  <div className="generated-content">
                    <h3>Generated Video:</h3>
                    <video controls style={{width: '100%', maxWidth: '600px', borderRadius: '10px'}}>
                      <source src={generatedVideo} type="video/mp4" />
                      Your browser does not support the video element.
                    </video>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="app-footer">
        <p>© 2024 MYTHIQ.AI - Revolutionary Ultimate Game Maker v15.0.0 Enhanced</p>
        <p>🚀 Advanced Features | 💻 Code Export | 👥 Multiplayer | 🎨 Media Studio</p>
      </footer>
    </div>
  );
};

export default App;
