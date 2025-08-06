import React, { useState } from 'react';
import './App.css';

function App() {
  // ✅ ALL ORIGINAL STATE VARIABLES PRESERVED
  const [activeTab, setActiveTab] = useState('home');
  const [chatMessages, setChatMessages] = useState([]);
  const [chatInput, setChatInput] = useState('');
  const [gameDescription, setGameDescription] = useState('');
  const [gameMode, setGameMode] = useState('enhanced'); // ✅ KEPT ORIGINAL DEFAULT
  const [generatedGame, setGeneratedGame] = useState(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [imagePrompt, setImagePrompt] = useState('');
  const [generatedImage, setGeneratedImage] = useState(null);
  const [audioText, setAudioText] = useState('');
  const [audioType, setAudioType] = useState('speech');
  const [generatedAudio, setGeneratedAudio] = useState(null);
  const [videoPrompt, setVideoPrompt] = useState('');
  const [generatedVideo, setGeneratedVideo] = useState(null);

  // ✅ ENHANCED GAME GENERATION WITH FREE AI SUPPORT
  const generateGame = async () => {
    if (!gameDescription.trim()) {
      alert('Please enter a game description');
      return;
    }

    setIsGenerating(true);
    setGeneratedGame(null);

    try {
      let gameData;
      let endpoint;
      let requestBody;

      // ✅ SMART ENDPOINT SELECTION
      if (gameMode === 'free-ai') {
        // 🆕 NEW: FREE AI endpoint
        endpoint = 'https://mythiq-game-maker-production.up.railway.app/ai-generate-game';
        requestBody = { prompt: gameDescription };
      } else {
        // ✅ PRESERVED: Original enhanced/basic endpoint
        endpoint = 'https://mythiq-game-maker-production.up.railway.app/generate-game';
        requestBody = { 
          prompt: gameDescription, 
          enhanced: gameMode === 'enhanced' 
        };
      }

      const response = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(requestBody)
      });

      if (!response.ok) {
        throw new Error(`Generation failed: ${response.status}`);
      }

      const data = await response.json();

      // ✅ SMART RESPONSE HANDLING
      if (gameMode === 'free-ai') {
        // 🆕 FREE AI response format
        gameData = {
          html: data.game_html,
          title: data.game_title || 'FREE AI Generated Game',
          template: data.template_used || 'AI Generated',
          features: data.features || ['AI Generated', 'Unique Design'],
          quality: data.quality_score || '9/10',
          metadata: {
            generation_time: data.generation_time,
            ai_model: data.ai_model_used || 'Groq Llama 3',
            mode: 'FREE AI',
            uniqueness: 'Completely Unique'
          }
        };
      } else {
        // ✅ PRESERVED: Original enhanced/basic response format
        gameData = {
          ...data,
          metadata: {
            mode: gameMode === 'enhanced' ? 'Enhanced' : 'Basic',
            template_based: true
          }
        };
      }

      setGeneratedGame(gameData);

    } catch (error) {
      console.error('Game generation failed:', error);
      
      // ✅ INTELLIGENT FALLBACK SYSTEM
      if (gameMode === 'free-ai') {
        try {
          console.log('FREE AI failed, falling back to Enhanced mode...');
          const fallbackResponse = await fetch('https://mythiq-game-maker-production.up.railway.app/generate-game', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ prompt: gameDescription, enhanced: true })
          });
          
          if (fallbackResponse.ok) {
            const fallbackData = await fallbackResponse.json();
            setGeneratedGame({
              ...fallbackData,
              title: (fallbackData.title || 'Generated Game') + ' (Fallback)',
              metadata: { 
                fallback: true, 
                original_mode: 'FREE AI',
                mode: 'Enhanced Fallback'
              }
            });
          } else {
            throw new Error('Fallback also failed');
          }
        } catch (fallbackError) {
          alert('Game generation failed. Please try again or use Enhanced mode.');
        }
      } else {
        alert('Game generation failed. Please try again.');
      }
    } finally {
      setIsGenerating(false);
    }
  };

  // ✅ PRESERVED: Original chat function UNCHANGED
  const sendChatMessage = async () => {
    if (!chatInput.trim()) return;

    const userMessage = { role: 'user', content: chatInput };
    setChatMessages(prev => [...prev, userMessage]);
    setChatInput('');

    try {
      const response = await fetch('https://mythiq-ai-chat-production.up.railway.app/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: chatInput,
          conversation_history: chatMessages
        })
      });

      const data = await response.json();
      const assistantMessage = { role: 'assistant', content: data.response };
      setChatMessages(prev => [...prev, assistantMessage]);
    } catch (error) {
      console.error('Chat error:', error);
      const errorMessage = { role: 'assistant', content: 'Sorry, I encountered an error. Please try again.' };
      setChatMessages(prev => [...prev, errorMessage]);
    }
  };

  // ✅ PRESERVED: Original image generation UNCHANGED
  const generateImage = async () => {
    if (!imagePrompt.trim()) return;
    
    try {
      const response = await fetch('https://mythiq-media-studio-production.up.railway.app/generate-image', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt: imagePrompt,
          style: 'photorealistic'
        })
      });

      const data = await response.json();
      setGeneratedImage(data.image_url);
    } catch (error) {
      console.error('Image generation error:', error);
    }
  };

  // ✅ PRESERVED: Original audio generation UNCHANGED
  const generateAudio = async () => {
    if (!audioText.trim()) return;
    
    try {
      const endpoint = audioType === 'speech' ? '/generate-speech' : '/generate-music';
      const response = await fetch(`https://mythiq-audio-studio-production.up.railway.app${endpoint}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          text: audioText,
          voice: 'default'
        })
      });

      const data = await response.json();
      setGeneratedAudio(data.audio_url);
    } catch (error) {
      console.error('Audio generation error:', error);
    }
  };

  // ✅ PRESERVED: Original video generation UNCHANGED
  const generateVideo = async () => {
    if (!videoPrompt.trim()) return;
    
    try {
      const response = await fetch('https://mythiq-video-studio-production.up.railway.app/generate-video', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt: videoPrompt,
          duration: 6
        })
      });

      const data = await response.json();
      setGeneratedVideo(data);
    } catch (error) {
      console.error('Video generation error:', error);
    }
  };

  // 🆕 NEW: Helper components for enhanced UI (optional, graceful degradation)
  const QualityIndicator = ({ mode }) => {
    const qualities = {
      'free-ai': { score: '9/10', label: 'Revolutionary', color: '#00ff88' },
      'enhanced': { score: '7/10', label: 'Professional', color: '#ffa500' },
      'basic': { score: '6/10', label: 'Standard', color: '#888888' }
    };
    
    const quality = qualities[mode] || qualities['enhanced'];
    
    return (
      <div style={{ color: quality.color, fontWeight: 'bold', fontSize: '14px' }}>
        🏆 {quality.label} ({quality.score})
      </div>
    );
  };

  const ModeDescription = ({ mode }) => {
    const descriptions = {
      'free-ai': '🤖 Uses advanced AI to create completely unique games never seen before. Every generation is different!',
      'enhanced': '✨ Uses professional templates with enhanced graphics and features.',
      'basic': '🔧 Simple, reliable game generation using basic templates.'
    };
    
    return (
      <div style={{ fontSize: '12px', color: '#ccc', marginTop: '5px', fontStyle: 'italic' }}>
        {descriptions[mode] || descriptions['enhanced']}
      </div>
    );
  };

  return (
    <div className="App">
      {/* ✅ PRESERVED: Original header and navigation UNCHANGED */}
      <header className="App-header">
        <div className="nav-container">
          <div className="logo">
            <span className="logo-icon">M</span>
            <span className="logo-text">Mythiq</span>
          </div>
          <nav className="nav-tabs">
            <button 
              className={`nav-tab ${activeTab === 'home' ? 'active' : ''}`}
              onClick={() => setActiveTab('home')}
            >
              🏠Home<span className="tab-number">1</span>
            </button>
            <button 
              className={`nav-tab ${activeTab === 'chat' ? 'active' : ''}`}
              onClick={() => setActiveTab('chat')}
            >
              💬AI Chat<span className="tab-number">2</span>
            </button>
            <button 
              className={`nav-tab ${activeTab === 'game' ? 'active' : ''}`}
              onClick={() => setActiveTab('game')}
            >
              🎮Game Creator<span className="tab-number">3</span>
            </button>
            <button 
              className={`nav-tab ${activeTab === 'media' ? 'active' : ''}`}
              onClick={() => setActiveTab('media')}
            >
              🎨Media Studio<span className="tab-number">4</span>
            </button>
            <button 
              className={`nav-tab ${activeTab === 'audio' ? 'active' : ''}`}
              onClick={() => setActiveTab('audio')}
            >
              🎵Audio Studio<span className="tab-number">5</span>
            </button>
            <button 
              className={`nav-tab ${activeTab === 'video' ? 'active' : ''}`}
              onClick={() => setActiveTab('video')}
            >
              🎬Video Studio<span className="tab-number">6</span>
            </button>
          </nav>
        </div>
      </header>

      <main className="main-content">
        {/* ✅ PRESERVED: Original home section UNCHANGED */}
        {activeTab === 'home' && (
          <div className="home-content">
            <h1>Welcome to Mythiq</h1>
            <p>Your AI-powered creative platform</p>
            <div className="feature-grid">
              <div className="feature-card" onClick={() => setActiveTab('chat')}>
                <div className="feature-icon">🤖</div>
                <h3>AI Assistant</h3>
                <p>Chat with our advanced AI powered by Groq Llama 3.1</p>
                <div className="feature-stats">
                  <span>💬 Conversations: 1,247</span>
                  <span>⚡ Avg Response: 1.2s</span>
                  <span>🔥 Enhanced Mode</span>
                </div>
              </div>
              <div className="feature-card" onClick={() => setActiveTab('game')}>
                <div className="feature-icon">🎮</div>
                <h3>Game Creator</h3>
                <p>Generate professional games with enhanced AI</p>
                <div className="feature-stats">
                  <span>🎯 Games Created: 89</span>
                  <span>⭐ Quality Score: 8.5/10</span>
                  <span>🔥 Enhanced Mode</span>
                </div>
              </div>
              <div className="feature-card" onClick={() => setActiveTab('media')}>
                <div className="feature-icon">🎨</div>
                <h3>Media Studio</h3>
                <p>Create stunning images with AI generation</p>
                <div className="feature-stats">
                  <span>🖼️ Images Generated: 456</span>
                  <span>⭐ Quality Score: 9.2/10</span>
                </div>
              </div>
              <div className="feature-card" onClick={() => setActiveTab('audio')}>
                <div className="feature-icon">🎵</div>
                <h3>Audio Studio</h3>
                <p>Generate speech and music with AI</p>
                <div className="feature-stats">
                  <span>🎤 Speech Generated: 234</span>
                  <span>🎵 Music Created: 156</span>
                </div>
              </div>
              <div className="feature-card" onClick={() => setActiveTab('video')}>
                <div className="feature-icon">🎬</div>
                <h3>Video Studio</h3>
                <p>Create amazing videos with AI generation</p>
                <div className="feature-stats">
                  <span>🎬 Videos Created: 78</span>
                  <span>⭐ Quality Score: 9.5/10</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ✅ PRESERVED: Original chat section UNCHANGED */}
        {activeTab === 'chat' && (
          <div className="chat-content">
            <h2>💬 AI Chat Assistant</h2>
            <p>Powered by Groq Llama 3.1 - Lightning fast responses</p>
            <div className="chat-container">
              <div className="chat-messages">
                {chatMessages.map((message, index) => (
                  <div key={index} className={`message ${message.role}`}>
                    <div className="message-content">{message.content}</div>
                  </div>
                ))}
              </div>
              <div className="chat-input-container">
                <input
                  type="text"
                  value={chatInput}
                  onChange={(e) => setChatInput(e.target.value)}
                  placeholder="Ask me anything..."
                  onKeyPress={(e) => e.key === 'Enter' && sendChatMessage()}
                />
                <button onClick={sendChatMessage}>Send</button>
              </div>
            </div>
          </div>
        )}

        {/* 🔧 ENHANCED: Game Creator with FREE AI support */}
        {activeTab === 'game' && (
          <div className="game-content">
            <h2>🎮 AI Game Creator</h2>
            <p>Create professional games with advanced features</p>
            
            {/* 🆕 NEW: FREE AI badge (only shows when FREE AI selected) */}
            {gameMode === 'free-ai' && (
              <div style={{ 
                background: 'linear-gradient(45deg, #00ff88, #00cc66)', 
                color: '#000', 
                padding: '10px', 
                borderRadius: '8px', 
                marginBottom: '20px',
                fontWeight: 'bold',
                textAlign: 'center'
              }}>
                ✨ FREE AI Mode Active - Revolutionary Technology!
              </div>
            )}
            
            <div className="game-form">
              <label>Game Description:</label>
              <textarea
                value={gameDescription}
                onChange={(e) => setGameDescription(e.target.value)}
                placeholder="Describe the game you want to create... (e.g., 'Create a space shooter game with powerups, enemies, and scoring system')"
                rows="4"
              />
              
              <div className="form-row" style={{ display: 'flex', gap: '20px', marginBottom: '20px' }}>
                <div className="form-group" style={{ flex: 1 }}>
                  <label>Generation Mode:</label>
                  <select 
                    value={gameMode} 
                    onChange={(e) => setGameMode(e.target.value)}
                    style={{ width: '100%', padding: '8px', marginBottom: '5px' }}
                  >
                    <option value="enhanced">✨ Enhanced (Professional)</option>
                    <option value="basic">🔧 Basic (Legacy)</option>
                    <option value="free-ai">🤖 FREE AI (Revolutionary)</option>
                  </select>
                  <ModeDescription mode={gameMode} />
                </div>
                
                <div className="form-group" style={{ flex: 1 }}>
                  <label>Expected Quality:</label>
                  <QualityIndicator mode={gameMode} />
                </div>
              </div>
              
              <button 
                onClick={generateGame} 
                disabled={isGenerating}
                className="generate-button"
                style={{
                  width: '100%',
                  padding: '12px',
                  fontSize: '16px',
                  fontWeight: 'bold',
                  border: 'none',
                  borderRadius: '8px',
                  background: gameMode === 'free-ai' 
                    ? 'linear-gradient(45deg, #00ff88, #00cc66)' 
                    : 'linear-gradient(45deg, #667eea, #764ba2)',
                  color: gameMode === 'free-ai' ? '#000' : '#fff',
                  cursor: isGenerating ? 'not-allowed' : 'pointer',
                  opacity: isGenerating ? 0.7 : 1
                }}
              >
                {isGenerating ? '⏳ Generating...' : 
                 gameMode === 'free-ai' ? '🤖 Create FREE AI Game' : 
                 gameMode === 'enhanced' ? '✨ Create Enhanced Game' : '🔧 Create Basic Game'}
              </button>
            </div>

            {/* 🆕 NEW: Enhanced features display (optional) */}
            {gameMode === 'free-ai' && (
              <div style={{ marginTop: '20px', padding: '15px', background: 'rgba(0,255,136,0.1)', borderRadius: '8px' }}>
                <h3>✨ FREE AI Features:</h3>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '10px', marginTop: '10px' }}>
                  <span>🤖 AI-Generated Concepts</span>
                  <span>🎨 Unique Visual Design</span>
                  <span>⚡ Advanced Mechanics</span>
                  <span>📱 Mobile Optimized</span>
                  <span>🎯 Professional Quality</span>
                  <span>🔄 Never Repeats</span>
                  <span>💰 Zero Cost</span>
                  <span>🚀 Revolutionary Tech</span>
                </div>
              </div>
            )}

            {gameMode === 'enhanced' && (
              <div style={{ marginTop: '20px', padding: '15px', background: 'rgba(255,165,0,0.1)', borderRadius: '8px' }}>
                <h3>✨ Enhanced Features:</h3>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '10px', marginTop: '10px' }}>
                  <span>🎨 Professional Graphics</span>
                  <span>🔫 Complete Shooting</span>
                  <span>⭐ Power-up System</span>
                  <span>📊 Advanced Scoring</span>
                  <span>💥 Particle Effects</span>
                  <span>📱 Mobile Optimized</span>
                  <span>🎵 Sound Ready</span>
                </div>
              </div>
            )}

            {/* ✅ ENHANCED: Game result display with better metadata */}
            {generatedGame && (
              <div className="game-result" style={{ marginTop: '30px' }}>
                <div style={{ marginBottom: '20px', padding: '15px', background: 'rgba(255,255,255,0.05)', borderRadius: '8px' }}>
                  <h3>🎮 Game Details:</h3>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '10px', marginTop: '10px', fontSize: '14px' }}>
                    <span>Template: {generatedGame.template || 'Standard'}</span>
                    <span>Features: {generatedGame.features ? generatedGame.features.join(', ') : 'Complete'}</span>
                    <span>Quality: {generatedGame.quality || 'Professional'}</span>
                    {generatedGame.metadata && (
                      <span>Mode: {generatedGame.metadata.mode || 'Enhanced'}</span>
                    )}
                  </div>
                </div>
                
                <div className="enhanced-game">
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px' }}>
                    <h3>🎮 {generatedGame.title || 'Generated Game'}</h3>
                    <div style={{ display: 'flex', gap: '10px' }}>
                      {generatedGame.metadata?.mode === 'FREE AI' && (
                        <span style={{ background: '#00ff88', color: '#000', padding: '4px 8px', borderRadius: '4px', fontSize: '12px', fontWeight: 'bold' }}>
                          🤖 FREE AI Generated
                        </span>
                      )}
                      {generatedGame.metadata?.fallback && (
                        <span style={{ background: '#ffa500', color: '#000', padding: '4px 8px', borderRadius: '4px', fontSize: '12px', fontWeight: 'bold' }}>
                          🔄 Fallback Mode
                        </span>
                      )}
                      <span style={{ background: '#667eea', color: '#fff', padding: '4px 8px', borderRadius: '4px', fontSize: '12px', fontWeight: 'bold' }}>
                        ✅ Enhanced Quality
                      </span>
                    </div>
                  </div>
                  
                  <div className="game-container" style={{ border: '2px solid #333', borderRadius: '8px', overflow: 'hidden' }}>
                    {generatedGame.html ? (
                      <iframe
                        srcDoc={generatedGame.html}
                        title="Generated Game"
                        width="100%"
                        height="400px"
                        style={{ border: 'none' }}
                      />
                    ) : (
                      <div style={{ padding: '20px', textAlign: 'center', color: '#888' }}>
                        Game content not available
                      </div>
                    )}
                  </div>
                  
                  {/* 🆕 NEW: Enhanced metadata display (optional) */}
                  {generatedGame.metadata && (
                    <div style={{ marginTop: '15px', padding: '10px', background: 'rgba(255,255,255,0.05)', borderRadius: '8px' }}>
                      <h4>🔍 Generation Details:</h4>
                      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '10px', marginTop: '10px', fontSize: '12px' }}>
                        {generatedGame.metadata.generation_time && (
                          <span>⏱️ Generated in: {generatedGame.metadata.generation_time}</span>
                        )}
                        {generatedGame.metadata.ai_model && (
                          <span>🤖 AI Model: {generatedGame.metadata.ai_model}</span>
                        )}
                        {generatedGame.metadata.uniqueness && (
                          <span>✨ Uniqueness: {generatedGame.metadata.uniqueness}</span>
                        )}
                        {generatedGame.metadata.mode && (
                          <span>🎯 Mode: {generatedGame.metadata.mode}</span>
                        )}
                      </div>
                    </div>
                  )}
                  
                  <button 
                    style={{
                      marginTop: '15px',
                      padding: '10px 20px',
                      background: 'linear-gradient(45deg, #667eea, #764ba2)',
                      color: '#fff',
                      border: 'none',
                      borderRadius: '6px',
                      cursor: 'pointer',
                      fontWeight: 'bold'
                    }}
                    onClick={() => {
                      const newWindow = window.open('', '_blank');
                      newWindow.document.write(generatedGame.html || '<p>No game content available</p>');
                      newWindow.document.close();
                    }}
                  >
                    🚀 Open in New Window
                  </button>
                </div>
              </div>
            )}
          </div>
        )}

        {/* ✅ PRESERVED: Original media section UNCHANGED */}
        {activeTab === 'media' && (
          <div className="media-content">
            <h2>🎨 Media Studio</h2>
            <p>Create stunning images with AI generation</p>
            <div className="media-form">
              <label>Image Description:</label>
              <textarea
                value={imagePrompt}
                onChange={(e) => setImagePrompt(e.target.value)}
                placeholder="Describe the image you want to create..."
                rows="3"
              />
              <button onClick={generateImage}>🎨 Generate Image</button>
            </div>
            {generatedImage && (
              <div className="image-result">
                <img src={generatedImage} alt="Generated" style={{ maxWidth: '100%', borderRadius: '8px' }} />
              </div>
            )}
          </div>
        )}

        {/* ✅ PRESERVED: Original audio section UNCHANGED */}
        {activeTab === 'audio' && (
          <div className="audio-content">
            <h2>🎵 Audio Studio</h2>
            <p>Generate speech and music with AI</p>
            <div className="audio-form">
              <label>Audio Type:</label>
              <select value={audioType} onChange={(e) => setAudioType(e.target.value)}>
                <option value="speech">🎤 Speech Generation</option>
                <option value="music">🎵 Music Generation</option>
              </select>
              <label>Text/Description:</label>
              <textarea
                value={audioText}
                onChange={(e) => setAudioText(e.target.value)}
                placeholder={audioType === 'speech' ? 'Enter text to convert to speech...' : 'Describe the music you want to create...'}
                rows="3"
              />
              <button onClick={generateAudio}>🎵 Generate Audio</button>
            </div>
            {generatedAudio && (
              <div className="audio-result">
                <audio controls src={generatedAudio} style={{ width: '100%' }} />
              </div>
            )}
          </div>
        )}

        {/* ✅ PRESERVED: Original video section UNCHANGED */}
        {activeTab === 'video' && (
          <div className="video-content">
            <h2>🎬 Video Studio</h2>
            <p>Create amazing videos with AI generation</p>
            <div className="video-form">
              <label>Video Description:</label>
              <textarea
                value={videoPrompt}
                onChange={(e) => setVideoPrompt(e.target.value)}
                placeholder="Describe the video you want to create..."
                rows="3"
              />
              <button onClick={generateVideo}>🎬 Generate Video</button>
            </div>
            {generatedVideo && (
              <div className="video-result">
                <div className="video-details">
                  <h3>🎬 Video Details:</h3>
                  <div className="details-grid">
                    <span>Model: {generatedVideo.model_used || 'Mochi-1'}</span>
                    <span>Quality: {generatedVideo.quality || 'Highest'}</span>
                    <span>Duration: {generatedVideo.duration || '6'} seconds</span>
                    <span>Generation Time: {generatedVideo.generation_time || '45'} seconds</span>
                    <span>Resolution: {generatedVideo.resolution || '848x480'}</span>
                    <span>Format: {generatedVideo.format || 'mp4'}</span>
                    <span>File Size: {generatedVideo.file_size || '2.5 MB'}</span>
                  </div>
                </div>
                {generatedVideo.video_url && (
                  <video controls src={generatedVideo.video_url} style={{ width: '100%', borderRadius: '8px' }} />
                )}
              </div>
            )}
          </div>
        )}
      </main>
    </div>
  );
}

export default App;
