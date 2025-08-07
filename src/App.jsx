import React, { useState, useEffect } from 'react'
import './App.css'

// ✅ PRESERVED: Original hardcoded API URLs for Railway deployment
const ASSISTANT_API = 'https://mythiq-assistant-production.up.railway.app'
const GAMEMAKER_API = 'https://mythiq-game-maker-production.up.railway.app'
const MEDIA_API = 'https://mythiq-media-creator-production.up.railway.app'
const AUDIO_API = 'https://mythiq-audio-creator-production.up.railway.app'
const VIDEO_API = 'https://mythiq-video-creator-production.up.railway.app'

function App() {
  // ✅ PRESERVED: All original state variables EXACTLY as they were
  const [activeTab, setActiveTab] = useState('home')
  const [messages, setMessages] = useState([])
  const [currentMessage, setCurrentMessage] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [gameDescription, setGameDescription] = useState('')
  const [generatedGame, setGeneratedGame] = useState(null) // 🔥 CHANGED: Now stores full game object
  const [isGeneratingGame, setIsGeneratingGame] = useState(false)
  const [gameError, setGameError] = useState('')
  const [generatedImage, setGeneratedImage] = useState('')
  const [isGeneratingImage, setIsGeneratingImage] = useState(false)

  // ✅ PRESERVED: Audio Studio states EXACTLY as they were
  const [speechText, setSpeechText] = useState('')
  const [musicPrompt, setMusicPrompt] = useState('')
  const [audioResult, setAudioResult] = useState('')
  const [isAudioLoading, setIsAudioLoading] = useState(false)
  const [voicePresets, setVoicePresets] = useState([])
  const [selectedVoice, setSelectedVoice] = useState('v2/en_speaker_6')

  // ✅ PRESERVED: Video Studio states EXACTLY as they were
  const [videoPrompt, setVideoPrompt] = useState('')
  const [videoDuration, setVideoDuration] = useState(5)
  const [videoModelType, setVideoModelType] = useState('auto')
  const [generatedVideo, setGeneratedVideo] = useState('')
  const [isGeneratingVideo, setIsGeneratingVideo] = useState(false)
  const [videoModels, setVideoModels] = useState([])

  // ✅ PRESERVED: Enhanced Game Creator states EXACTLY as they were
  const [gameMetadata, setGameMetadata] = useState(null)
  const [enhancedMode, setEnhancedMode] = useState(true)

  // 🔥 NEW: ULTIMATE GAME MAKER states
  const [ultimateMode, setUltimateMode] = useState(true)  // Always ultimate!
  const [freeAIMode, setFreeAIMode] = useState(false)
  const [generationMode, setGenerationMode] = useState('ultimate')

  // ✅ PRESERVED: Load voice presets and video models on component mount EXACTLY as original
  useEffect(() => {
    loadVoicePresets()
    loadVideoModels()
  }, [])

  // ✅ PRESERVED: loadVoicePresets function EXACTLY as original
  const loadVoicePresets = async () => {
    try {
      const response = await fetch(`${AUDIO_API}/voice-presets`)
      const data = await response.json()

      if (data.success && data.presets && data.presets.english) {
        setVoicePresets(data.presets.english)
      }
    } catch (error) {
      console.error('Error loading voice presets:', error)
    }
  }

  // ✅ PRESERVED: loadVideoModels function EXACTLY as original
  const loadVideoModels = async () => {
    try {
      const response = await fetch(`${VIDEO_API}/video-models`)
      const data = await response.json()

      if (data.success && data.models) {
        setVideoModels(data.models)
      }
    } catch (error) {
      console.error('Error loading video models:', error)
    }
  }

  // 🔥 NEW: Handle generation mode change for ULTIMATE system
  const handleGenerationModeChange = (e) => {
    const mode = e.target.value
    setGenerationMode(mode)
    
    // Update the corresponding state variables
    if (mode === 'ultimate') {
      setUltimateMode(true)
      setFreeAIMode(false)
      setEnhancedMode(false)
    } else if (mode === 'free-ai') {
      setUltimateMode(false)
      setFreeAIMode(true)
      setEnhancedMode(false)
    } else if (mode === 'enhanced') {
      setUltimateMode(false)
      setFreeAIMode(false)
      setEnhancedMode(true)
    } else { // basic
      setUltimateMode(false)
      setFreeAIMode(false)
      setEnhancedMode(false)
    }
  }

  // ✅ PRESERVED: AI Chat Handler EXACTLY as original
  const handleChatSubmit = async (e) => {
    e.preventDefault()
    if (!currentMessage.trim() || isLoading) return

    const userMessage = currentMessage.trim()
    setMessages(prev => [...prev, { type: 'user', content: userMessage }])
    setCurrentMessage('')
    setIsLoading(true)

    try {
      console.log('🤖 Sending chat request to:', `${ASSISTANT_API}/chat`)
      const response = await fetch(`${ASSISTANT_API}/chat`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ message: userMessage })
      })

      if (response.ok) {
        const data = await response.json()
        console.log('✅ Chat response received:', data)

        // PRESERVED: Use 'content' field from backend response
        const aiResponse = data.content || data.response || 'AI response received'

        setMessages(prev => [...prev, {
          type: 'ai',
          content: aiResponse
        }])
      } else {
        throw new Error(`HTTP ${response.status}`)
      }
    } catch (error) {
      console.error('❌ Chat error:', error)
      setMessages(prev => [...prev, {
        type: 'ai',
        content: 'Sorry, there was an error processing your request. Please try again.'
      }])
    } finally {
      setIsLoading(false)
    }
  }

  // 🔥 FIXED: ULTIMATE Game Creator Handler with Complete File Delivery
  const handleUltimateGameSubmit = async (e) => {
    e.preventDefault()
    if (!gameDescription.trim() || isGeneratingGame) return

    setIsGeneratingGame(true)
    setGeneratedGame(null)
    setGameError('')
    setGameMetadata(null)

    try {
      console.log('🔥 ULTIMATE GAME GENERATION STARTED...')
      
      let endpoint, requestBody;

      if (ultimateMode) {
        console.log('🔥 Using ULTIMATE generation...')
        endpoint = `${GAMEMAKER_API}/ultimate-generate-game`
      } else if (freeAIMode) {
        console.log('🤖 Using FREE AI generation...')
        endpoint = `${GAMEMAKER_API}/ai-generate-game`
      } else if (enhancedMode) {
        console.log('✨ Using Enhanced generation...')
        endpoint = `${GAMEMAKER_API}/generate-game`
      } else {
        console.log('🔧 Using Basic generation...')
        endpoint = `${GAMEMAKER_API}/generate-game`
      }

      requestBody = {
        prompt: gameDescription.trim(),
        mode: ultimateMode ? 'ultimate' : freeAIMode ? 'free-ai' : enhancedMode ? 'enhanced' : 'basic'
      }

      const response = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestBody)
      })

      const data = await response.json()
      console.log('✅ Game response received:', data)

      if (data.success && data.game) {
        setGeneratedGame(data.game)
        setGameError('')
        
        // Store game data globally for download/open functions
        window.lastGeneratedGame = data.game
        window.lastGameFiles = data.files
        
        // Set metadata
        setGameMetadata({
          template: data.game.type || (ultimateMode ? 'Ultimate AI-Enhanced' : freeAIMode ? 'AI Generated' : 'Enhanced'),
          features: data.game.features || (ultimateMode ? [
            'ai-generated-innovation',
            'professional-graphics', 
            'complete-mechanics',
            'mobile-optimized',
            'ultimate-quality',
            'bulletproof-reliability'
          ] : ['professional-graphics', 'complete-mechanics']),
          generatedAt: data.timestamp || new Date().toISOString(),
          title: data.game.title || `${ultimateMode ? 'Ultimate' : freeAIMode ? 'FREE AI' : 'Enhanced'} Game`,
          quality: data.game.difficulty || (ultimateMode ? '10/10' : freeAIMode ? '9/10' : '8/10'),
          generation_method: data.generation_method || (ultimateMode ? 'revolutionary_ultimate' : freeAIMode ? 'free_ai_innovation' : 'enhanced_polish'),
          generation_time: '< 30s',
          quality_guarantee: ultimateMode ? 'BRUTAL 10/10 QUALITY' : freeAIMode ? 'Revolutionary Quality' : 'Professional Quality'
        })
        
        console.log('🎉 Game generated successfully!')
      } else {
        // Handle API errors with user-friendly messages
        const errorMessage = data.user_message || data.error || 'Game generation failed. Please try again.'
        setGameError(errorMessage)
        setGeneratedGame(null)
        console.error('❌ Game generation failed:', data)
      }

    } catch (error) {
      console.error('❌ Game generation error:', error)
      setGameError('Network error. Please check your connection and try again.')
      setGeneratedGame(null)
    } finally {
      setIsGeneratingGame(false)
    }
  }

  // 🔥 NEW: Download Game Function
  const downloadGame = () => {
    if (!window.lastGameFiles || !window.lastGeneratedGame) {
      alert('No game available for download. Please generate a game first.')
      return
    }
    
    try {
      // Use the download URL from the backend
      const downloadUrl = `${GAMEMAKER_API}${window.lastGameFiles.download_url}`
      
      // Create a temporary link to trigger download
      const link = document.createElement('a')
      link.href = downloadUrl
      link.download = `${window.lastGeneratedGame.title.replace(/\s+/g, '_')}_game.zip`
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      
      console.log('📦 Game download started')
    } catch (error) {
      console.error('❌ Download error:', error)
      alert('Download failed. Please try again.')
    }
  }

  // 🔥 NEW: Open Game in New Window Function
  const openGameInNewWindow = () => {
    if (!window.lastGameFiles || !window.lastGeneratedGame) {
      alert('No game available to open. Please generate a game first.')
      return
    }
    
    try {
      // Use the play URL from the backend
      const playUrl = `${GAMEMAKER_API}${window.lastGameFiles.html_url}`
      
      // Open in new window/tab
      const gameWindow = window.open(playUrl, '_blank', 'width=1000,height=700,scrollbars=yes,resizable=yes')
      
      if (!gameWindow) {
        alert('Popup blocked. Please allow popups for this site and try again.')
      } else {
        console.log('🎮 Game opened in new window')
      }
    } catch (error) {
      console.error('❌ Open game error:', error)
      alert('Failed to open game. Please try again.')
    }
  }

  // ✅ PRESERVED: Media Studio Handler EXACTLY as original
  const handleMediaSubmit = async (e) => {
    e.preventDefault()
    if (!gameDescription.trim() || isGeneratingImage) return

    setIsGeneratingImage(true)
    setGeneratedImage('')

    try {
      const response = await fetch(`${MEDIA_API}/generate-image`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ prompt: gameDescription })
      })

      if (response.ok) {
        const data = await response.json()
        if (data.image_url) {
          setGeneratedImage(data.image_url)
        }
      } else {
        throw new Error(`HTTP ${response.status}`)
      }
    } catch (error) {
      console.error('Error generating image:', error)
    } finally {
      setIsGeneratingImage(false)
    }
  }

  // ✅ PRESERVED: Audio Studio Handler EXACTLY as original
  const handleAudioSubmit = async (e) => {
    e.preventDefault()
    if ((!speechText.trim() && !musicPrompt.trim()) || isAudioLoading) return

    setIsAudioLoading(true)
    setAudioResult('')

    try {
      let endpoint, requestBody;

      if (speechText.trim()) {
        endpoint = `${AUDIO_API}/generate-speech`
        requestBody = {
          text: speechText,
          voice: selectedVoice
        }
      } else if (musicPrompt.trim()) {
        endpoint = `${AUDIO_API}/generate-music`
        requestBody = {
          prompt: musicPrompt
        }
      }

      const response = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestBody)
      })

      if (response.ok) {
        const data = await response.json()
        if (data.audio_url) {
          setAudioResult(data.audio_url)
        }
      } else {
        throw new Error(`HTTP ${response.status}`)
      }
    } catch (error) {
      console.error('Error generating audio:', error)
    } finally {
      setIsAudioLoading(false)
    }
  }

  // ✅ PRESERVED: Video Studio Handler EXACTLY as original
  const handleVideoSubmit = async (e) => {
    e.preventDefault()
    if (!videoPrompt.trim() || isGeneratingVideo) return

    setIsGeneratingVideo(true)
    setGeneratedVideo('')

    try {
      const response = await fetch(`${VIDEO_API}/generate-video`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          prompt: videoPrompt,
          duration: videoDuration,
          model_type: videoModelType
        })
      })

      if (response.ok) {
        const data = await response.json()
        if (data.video_url) {
          setGeneratedVideo(data.video_url)
        }
      } else {
        throw new Error(`HTTP ${response.status}`)
      }
    } catch (error) {
      console.error('Error generating video:', error)
    } finally {
      setIsGeneratingVideo(false)
    }
  }

  // 🔥 NEW: Get expected quality based on mode
  const getExpectedQuality = () => {
    if (ultimateMode) return '🔥 ULTIMATE (10/10)'
    if (freeAIMode) return '🚀 Revolutionary (9/10)'
    if (enhancedMode) return '⭐ Professional (8/10)'
    return '🔧 Standard (6/10)'
  }

  // 🔥 NEW: Get button text based on mode
  const getButtonText = () => {
    if (isGeneratingGame) {
      if (ultimateMode) return '🔥 CREATING ULTIMATE GAME...'
      if (freeAIMode) return 'Generating FREE AI Game...'
      if (enhancedMode) return 'Generating Enhanced Game...'
      return 'Generating Basic Game...'
    }
    
    if (ultimateMode) return '🔥 CREATE ULTIMATE GAME'
    if (freeAIMode) return '🤖 Create FREE AI Game'
    if (enhancedMode) return '🚀 Create Enhanced Game'
    return '🔧 Create Basic Game'
  }

  // 🔥 NEW: Get mode description
  const getModeDescription = () => {
    if (ultimateMode) return 'BRUTALLY POWERFUL - Combines AI Innovation + Professional Polish + Bulletproof Reliability'
    if (freeAIMode) return 'Revolutionary AI-generated games with unique mechanics'
    if (enhancedMode) return 'Professional games with advanced features'
    return 'Basic functional games'
  }

  // 🔥 NEW: Render Game Display with Complete File Delivery
  const renderGameDisplay = () => {
    if (isGeneratingGame) {
      return (
        <div className="bg-gray-800 rounded-lg p-6 mt-6">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-yellow-400 mx-auto mb-4"></div>
            <h3 className="text-xl font-bold text-yellow-400 mb-2">🔥 Generating Your Ultimate Game...</h3>
            <p className="text-gray-300">Please wait while we create your revolutionary gaming experience...</p>
          </div>
        </div>
      )
    }
    
    if (gameError) {
      return (
        <div className="bg-red-900/50 border border-red-500 rounded-lg p-6 mt-6">
          <div className="text-center">
            <h3 className="text-xl font-bold text-red-400 mb-2">❌ Generation Failed</h3>
            <p className="text-red-300 mb-4">{gameError}</p>
            <button 
              onClick={() => setGameError('')}
              className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg transition-colors"
            >
              Try Again
            </button>
          </div>
        </div>
      )
    }
    
    if (generatedGame) {
      return (
        <div className="bg-gray-800 rounded-lg p-6 mt-6">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-xl font-bold text-yellow-400">Generated Game</h3>
            <div className="flex gap-2">
              <button 
                onClick={downloadGame}
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors flex items-center gap-2"
              >
                📦 Download
              </button>
              <button 
                onClick={openGameInNewWindow}
                className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg transition-colors flex items-center gap-2"
              >
                🎮 Open in New Window
              </button>
            </div>
          </div>
          
          <div className="bg-gray-900 rounded-lg p-4 mb-4">
            <h4 className="text-lg font-bold text-white mb-2">{generatedGame.title}</h4>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span className="text-gray-400">Type:</span>
                <span className="text-white ml-2">{generatedGame.type}</span>
              </div>
              <div>
                <span className="text-gray-400">Character:</span>
                <span className="text-white ml-2">{generatedGame.character}</span>
              </div>
              <div>
                <span className="text-gray-400">Theme:</span>
                <span className="text-white ml-2">{generatedGame.theme}</span>
              </div>
              <div>
                <span className="text-gray-400">Difficulty:</span>
                <span className="text-white ml-2">{generatedGame.difficulty || 'Medium'}</span>
              </div>
            </div>
            
            {generatedGame.features && generatedGame.features.length > 0 && (
              <div className="mt-3">
                <span className="text-gray-400">Features:</span>
                <div className="flex flex-wrap gap-1 mt-1">
                  {generatedGame.features.map((feature, index) => (
                    <span key={index} className="bg-yellow-600 text-yellow-100 px-2 py-1 rounded text-xs">
                      {feature}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
          
          {/* Game Preview iframe */}
          <div className="bg-white rounded-lg overflow-hidden" style={{height: '400px'}}>
            <iframe
              srcDoc={generatedGame.html}
              width="100%"
              height="100%"
              frameBorder="0"
              sandbox="allow-scripts allow-same-origin"
              title={generatedGame.title}
              className="w-full h-full"
            />
          </div>
          
          <div className="mt-4 text-center">
            <p className="text-gray-400 text-sm">
              🎉 Game generated successfully! Click "Open in New Window" for full-screen play or "Download" to get the game files.
            </p>
          </div>
        </div>
      )
    }
    
    return null
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900">
      {/* ✅ PRESERVED: Navigation Header EXACTLY as original */}
      <nav className="bg-black/20 backdrop-blur-sm border-b border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center">
              <h1 className="text-2xl font-bold text-white">Mythiq</h1>
            </div>
            <div className="flex space-x-4">
              {[
                { id: 'home', label: '🏠 Home', badge: '1' },
                { id: 'chat', label: '💬 AI Chat', badge: '2' },
                { id: 'game', label: '🔥 Ultimate Creator', badge: '3' },
                { id: 'media', label: '🎨 Media Studio', badge: '4' },
                { id: 'audio', label: '🎵 Audio Studio', badge: '5' },
                { id: 'video', label: '🎬 Video Studio', badge: '6' }
              ].map(tab => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`relative px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                    activeTab === tab.id
                      ? 'bg-white/20 text-white'
                      : 'text-gray-300 hover:text-white hover:bg-white/10'
                  }`}
                >
                  {tab.label}
                  <span className="absolute -top-1 -right-1 bg-orange-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                    {tab.badge}
                  </span>
                </button>
              ))}
            </div>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* ✅ PRESERVED: Home Tab with UPDATED Game Creator card */}
        {activeTab === 'home' && (
          <div className="space-y-8">
            <div className="text-center">
              <h2 className="text-4xl font-bold text-white mb-4">Welcome to Mythiq</h2>
              <p className="text-xl text-gray-300 mb-8">Your Ultimate AI-Powered Creative Platform</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {/* 🔥 UPDATED: Ultimate Game Creator Card */}
              <div className="bg-gradient-to-br from-orange-600 to-red-600 rounded-lg p-6 text-white transform hover:scale-105 transition-transform cursor-pointer"
                   onClick={() => setActiveTab('game')}>
                <div className="text-3xl mb-4">🔥</div>
                <h3 className="text-xl font-bold mb-2">Ultimate Game Creator</h3>
                <p className="text-orange-100 mb-4">Revolutionary AI-powered game generation with BRUTAL 10/10 quality</p>
                <div className="bg-orange-700/50 rounded p-2 text-sm">
                  <div className="font-semibold">🚀 NEW: Ultimate Mode</div>
                  <div>• AI Innovation + Professional Polish</div>
                  <div>• Bulletproof Reliability</div>
                  <div>• Complete File Downloads</div>
                </div>
              </div>

              {/* ✅ PRESERVED: Other cards exactly as original */}
              <div className="bg-gradient-to-br from-blue-600 to-purple-600 rounded-lg p-6 text-white transform hover:scale-105 transition-transform cursor-pointer"
                   onClick={() => setActiveTab('chat')}>
                <div className="text-3xl mb-4">💬</div>
                <h3 className="text-xl font-bold mb-2">AI Chat Assistant</h3>
                <p className="text-blue-100">Intelligent conversations and creative assistance</p>
              </div>

              <div className="bg-gradient-to-br from-green-600 to-teal-600 rounded-lg p-6 text-white transform hover:scale-105 transition-transform cursor-pointer"
                   onClick={() => setActiveTab('media')}>
                <div className="text-3xl mb-4">🎨</div>
                <h3 className="text-xl font-bold mb-2">Media Studio</h3>
                <p className="text-green-100">Generate stunning images and visual content</p>
              </div>

              <div className="bg-gradient-to-br from-purple-600 to-pink-600 rounded-lg p-6 text-white transform hover:scale-105 transition-transform cursor-pointer"
                   onClick={() => setActiveTab('audio')}>
                <div className="text-3xl mb-4">🎵</div>
                <h3 className="text-xl font-bold mb-2">Audio Studio</h3>
                <p className="text-purple-100">Create music and speech with AI</p>
              </div>

              <div className="bg-gradient-to-br from-yellow-600 to-orange-600 rounded-lg p-6 text-white transform hover:scale-105 transition-transform cursor-pointer"
                   onClick={() => setActiveTab('video')}>
                <div className="text-3xl mb-4">🎬</div>
                <h3 className="text-xl font-bold mb-2">Video Studio</h3>
                <p className="text-yellow-100">Generate dynamic video content</p>
              </div>

              <div className="bg-gradient-to-br from-gray-600 to-gray-800 rounded-lg p-6 text-white">
                <div className="text-3xl mb-4">🚀</div>
                <h3 className="text-xl font-bold mb-2">More Coming Soon</h3>
                <p className="text-gray-300">Additional AI tools and features in development</p>
              </div>
            </div>
          </div>
        )}

        {/* ✅ PRESERVED: AI Chat Tab EXACTLY as original */}
        {activeTab === 'chat' && (
          <div className="max-w-4xl mx-auto">
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6">
              <h2 className="text-2xl font-bold text-white mb-6">AI Chat Assistant</h2>
              
              <div className="bg-gray-900/50 rounded-lg p-4 h-96 overflow-y-auto mb-4">
                {messages.length === 0 ? (
                  <div className="text-center text-gray-400 mt-20">
                    <div className="text-4xl mb-4">💬</div>
                    <p>Start a conversation with your AI assistant!</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {messages.map((message, index) => (
                      <div key={index} className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}>
                        <div className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                          message.type === 'user' 
                            ? 'bg-blue-600 text-white' 
                            : 'bg-gray-700 text-gray-100'
                        }`}>
                          {message.content}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
                
                {isLoading && (
                  <div className="flex justify-start mt-4">
                    <div className="bg-gray-700 text-gray-100 px-4 py-2 rounded-lg">
                      <div className="flex items-center space-x-2">
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                        <span>AI is thinking...</span>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              <form onSubmit={handleChatSubmit} className="flex space-x-2">
                <input
                  type="text"
                  value={currentMessage}
                  onChange={(e) => setCurrentMessage(e.target.value)}
                  placeholder="Type your message..."
                  className="flex-1 px-4 py-2 bg-gray-800 text-white rounded-lg border border-gray-600 focus:border-blue-500 focus:outline-none"
                  disabled={isLoading}
                />
                <button
                  type="submit"
                  disabled={isLoading || !currentMessage.trim()}
                  className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  Send
                </button>
              </form>
            </div>
          </div>
        )}

        {/* 🔥 UPDATED: Ultimate Game Creator Tab with Complete File Delivery */}
        {activeTab === 'game' && (
          <div className="max-w-4xl mx-auto">
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6">
              <div className="text-center mb-6">
                <h2 className="text-3xl font-bold text-white mb-2">🔥 Ultimate Game Creator</h2>
                <p className="text-gray-300">Revolutionary AI-powered game generation with complete file delivery</p>
              </div>

              {/* 🔥 NEW: Generation Mode Selector */}
              <div className="mb-6">
                <label className="block text-white text-sm font-medium mb-2">Generation Mode</label>
                <select
                  value={generationMode}
                  onChange={handleGenerationModeChange}
                  className="w-full px-4 py-3 bg-gray-800 text-white rounded-lg border border-gray-600 focus:border-yellow-500 focus:outline-none"
                >
                  <option value="ultimate">🔥 ULTIMATE - Brutally Powerful (10/10)</option>
                  <option value="free-ai">🤖 FREE AI - Revolutionary Innovation (9/10)</option>
                  <option value="enhanced">⭐ Enhanced - Professional Quality (8/10)</option>
                  <option value="basic">🔧 Basic - Standard Quality (6/10)</option>
                </select>
                <p className="text-sm text-gray-400 mt-2">{getModeDescription()}</p>
              </div>

              {/* 🔥 NEW: Quality Indicator */}
              <div className="bg-gray-800/50 rounded-lg p-4 mb-6">
                <div className="flex justify-between items-center">
                  <span className="text-white font-medium">Expected Quality:</span>
                  <span className="text-yellow-400 font-bold">{getExpectedQuality()}</span>
                </div>
              </div>

              <form onSubmit={handleUltimateGameSubmit} className="space-y-4">
                <div>
                  <label className="block text-white text-sm font-medium mb-2">
                    Describe Your Game
                  </label>
                  <textarea
                    value={gameDescription}
                    onChange={(e) => setGameDescription(e.target.value)}
                    placeholder="Describe the game you want to create... (e.g., 'A darts game with realistic physics' or 'An underwater adventure with treasure hunting')"
                    className="w-full px-4 py-3 bg-gray-800 text-white rounded-lg border border-gray-600 focus:border-yellow-500 focus:outline-none h-32 resize-none"
                    disabled={isGeneratingGame}
                  />
                </div>

                <button
                  type="submit"
                  disabled={isGeneratingGame || !gameDescription.trim()}
                  className="w-full px-6 py-4 bg-gradient-to-r from-yellow-600 to-orange-600 text-white rounded-lg hover:from-yellow-700 hover:to-orange-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all transform hover:scale-105 font-bold text-lg"
                >
                  {getButtonText()}
                </button>
              </form>

              {/* 🔥 NEW: Game Display with Complete File Delivery */}
              {renderGameDisplay()}

              {/* ✅ PRESERVED: Game Metadata Display */}
              {gameMetadata && (
                <div className="bg-gray-800 rounded-lg p-4 mt-4">
                  <h4 className="text-lg font-bold text-yellow-400 mb-3">Generation Details</h4>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="text-gray-400">Template:</span>
                      <span className="text-white ml-2">{gameMetadata.template}</span>
                    </div>
                    <div>
                      <span className="text-gray-400">Quality:</span>
                      <span className="text-white ml-2">{gameMetadata.quality}</span>
                    </div>
                    <div>
                      <span className="text-gray-400">Method:</span>
                      <span className="text-white ml-2">{gameMetadata.generation_method}</span>
                    </div>
                    <div>
                      <span className="text-gray-400">Generated:</span>
                      <span className="text-white ml-2">{new Date(gameMetadata.generatedAt).toLocaleTimeString()}</span>
                    </div>
                  </div>
                  
                  {gameMetadata.features && (
                    <div className="mt-3">
                      <span className="text-gray-400">Features:</span>
                      <div className="flex flex-wrap gap-1 mt-1">
                        {gameMetadata.features.map((feature, index) => (
                          <span key={index} className="bg-yellow-600 text-yellow-100 px-2 py-1 rounded text-xs">
                            {feature}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        )}

        {/* ✅ PRESERVED: Media Studio Tab EXACTLY as original */}
        {activeTab === 'media' && (
          <div className="max-w-4xl mx-auto">
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6">
              <h2 className="text-2xl font-bold text-white mb-6">Media Studio</h2>
              
              <form onSubmit={handleMediaSubmit} className="space-y-4">
                <div>
                  <label className="block text-white text-sm font-medium mb-2">
                    Image Description
                  </label>
                  <textarea
                    value={gameDescription}
                    onChange={(e) => setGameDescription(e.target.value)}
                    placeholder="Describe the image you want to generate..."
                    className="w-full px-4 py-3 bg-gray-800 text-white rounded-lg border border-gray-600 focus:border-green-500 focus:outline-none h-32 resize-none"
                    disabled={isGeneratingImage}
                  />
                </div>

                <button
                  type="submit"
                  disabled={isGeneratingImage || !gameDescription.trim()}
                  className="w-full px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  {isGeneratingImage ? 'Generating Image...' : 'Generate Image'}
                </button>
              </form>

              {generatedImage && (
                <div className="mt-6">
                  <h3 className="text-xl font-bold text-white mb-4">Generated Image</h3>
                  <img src={generatedImage} alt="Generated" className="w-full rounded-lg" />
                </div>
              )}
            </div>
          </div>
        )}

        {/* ✅ PRESERVED: Audio Studio Tab EXACTLY as original */}
        {activeTab === 'audio' && (
          <div className="max-w-4xl mx-auto">
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6">
              <h2 className="text-2xl font-bold text-white mb-6">Audio Studio</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-gray-800/50 rounded-lg p-4">
                  <h3 className="text-lg font-bold text-white mb-4">Speech Generation</h3>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-white text-sm font-medium mb-2">Text to Speech</label>
                      <textarea
                        value={speechText}
                        onChange={(e) => setSpeechText(e.target.value)}
                        placeholder="Enter text to convert to speech..."
                        className="w-full px-3 py-2 bg-gray-700 text-white rounded border border-gray-600 focus:border-purple-500 focus:outline-none h-24 resize-none"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-white text-sm font-medium mb-2">Voice</label>
                      <select
                        value={selectedVoice}
                        onChange={(e) => setSelectedVoice(e.target.value)}
                        className="w-full px-3 py-2 bg-gray-700 text-white rounded border border-gray-600 focus:border-purple-500 focus:outline-none"
                      >
                        {voicePresets.map((voice) => (
                          <option key={voice} value={voice}>
                            {voice.replace('v2/en_speaker_', 'Speaker ')}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                </div>

                <div className="bg-gray-800/50 rounded-lg p-4">
                  <h3 className="text-lg font-bold text-white mb-4">Music Generation</h3>
                  <div>
                    <label className="block text-white text-sm font-medium mb-2">Music Prompt</label>
                    <textarea
                      value={musicPrompt}
                      onChange={(e) => setMusicPrompt(e.target.value)}
                      placeholder="Describe the music you want to generate..."
                      className="w-full px-3 py-2 bg-gray-700 text-white rounded border border-gray-600 focus:border-purple-500 focus:outline-none h-24 resize-none"
                    />
                  </div>
                </div>
              </div>

              <form onSubmit={handleAudioSubmit} className="mt-6">
                <button
                  type="submit"
                  disabled={isAudioLoading || (!speechText.trim() && !musicPrompt.trim())}
                  className="w-full px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  {isAudioLoading ? 'Generating Audio...' : 'Generate Audio'}
                </button>
              </form>

              {audioResult && (
                <div className="mt-6">
                  <h3 className="text-xl font-bold text-white mb-4">Generated Audio</h3>
                  <audio controls className="w-full">
                    <source src={audioResult} type="audio/mpeg" />
                    Your browser does not support the audio element.
                  </audio>
                </div>
              )}
            </div>
          </div>
        )}

        {/* ✅ PRESERVED: Video Studio Tab EXACTLY as original */}
        {activeTab === 'video' && (
          <div className="max-w-4xl mx-auto">
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6">
              <h2 className="text-2xl font-bold text-white mb-6">Video Studio</h2>
              
              <form onSubmit={handleVideoSubmit} className="space-y-4">
                <div>
                  <label className="block text-white text-sm font-medium mb-2">
                    Video Description
                  </label>
                  <textarea
                    value={videoPrompt}
                    onChange={(e) => setVideoPrompt(e.target.value)}
                    placeholder="Describe the video you want to generate..."
                    className="w-full px-4 py-3 bg-gray-800 text-white rounded-lg border border-gray-600 focus:border-yellow-500 focus:outline-none h-32 resize-none"
                    disabled={isGeneratingVideo}
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-white text-sm font-medium mb-2">Duration (seconds)</label>
                    <input
                      type="number"
                      value={videoDuration}
                      onChange={(e) => setVideoDuration(parseInt(e.target.value))}
                      min="1"
                      max="10"
                      className="w-full px-4 py-2 bg-gray-800 text-white rounded-lg border border-gray-600 focus:border-yellow-500 focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-white text-sm font-medium mb-2">Model Type</label>
                    <select
                      value={videoModelType}
                      onChange={(e) => setVideoModelType(e.target.value)}
                      className="w-full px-4 py-2 bg-gray-800 text-white rounded-lg border border-gray-600 focus:border-yellow-500 focus:outline-none"
                    >
                      <option value="auto">Auto</option>
                      {videoModels.map((model) => (
                        <option key={model} value={model}>{model}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={isGeneratingVideo || !videoPrompt.trim()}
                  className="w-full px-6 py-3 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  {isGeneratingVideo ? 'Generating Video...' : 'Generate Video'}
                </button>
              </form>

              {generatedVideo && (
                <div className="mt-6">
                  <h3 className="text-xl font-bold text-white mb-4">Generated Video</h3>
                  <video controls className="w-full rounded-lg">
                    <source src={generatedVideo} type="video/mp4" />
                    Your browser does not support the video element.
                  </video>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default App
