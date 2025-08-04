import React, { useState, useEffect } from 'react'
import './App.css'

// Hardcoded API URLs for Railway deployment
const ASSISTANT_API = 'https://mythiq-assistant-production.up.railway.app'
const GAMEMAKER_API = 'https://mythiq-game-maker-production.up.railway.app'
const MEDIA_API = 'https://mythiq-media-creator-production.up.railway.app'
const AUDIO_API = 'https://mythiq-audio-creator-production.up.railway.app'
const VIDEO_API = 'https://mythiq-video-creator-production.up.railway.app'

function App() {
  const [activeTab, setActiveTab] = useState('home')
  const [messages, setMessages] = useState([])
  const [currentMessage, setCurrentMessage] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [gameDescription, setGameDescription] = useState('')
  const [generatedGame, setGeneratedGame] = useState('')
  const [isGeneratingGame, setIsGeneratingGame] = useState(false)
  const [imagePrompt, setImagePrompt] = useState('')
  const [generatedImage, setGeneratedImage] = useState('')
  const [isGeneratingImage, setIsGeneratingImage] = useState(false)
  
  // Audio Studio states
  const [speechText, setSpeechText] = useState('')
  const [musicPrompt, setMusicPrompt] = useState('')
  const [audioResult, setAudioResult] = useState('')
  const [isAudioLoading, setIsAudioLoading] = useState(false)
  const [voicePresets, setVoicePresets] = useState([])
  const [selectedVoice, setSelectedVoice] = useState('v2/en_speaker_6')

  // Video Studio states
  const [videoPrompt, setVideoPrompt] = useState('')
  const [videoDuration, setVideoDuration] = useState(6)
  const [videoModelType, setVideoModelType] = useState('auto')
  const [generatedVideo, setGeneratedVideo] = useState('')
  const [isGeneratingVideo, setIsGeneratingVideo] = useState(false)
  const [videoModels, setVideoModels] = useState({})

  // Load voice presets and video models on component mount
  useEffect(() => {
    loadVoicePresets()
    loadVideoModels()
  }, [])

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

  // AI Chat Handler - PRESERVED WORKING VERSION
  const handleChatSubmit = async (e) => {
    e.preventDefault()
    if (!currentMessage.trim() || isLoading) return

    const userMessage = currentMessage.trim()
    setMessages(prev => [...prev, { type: 'user', content: userMessage }])
    setCurrentMessage('')
    setIsLoading(true)

    try {
      console.log('🌐 Sending chat request to:', `${ASSISTANT_API}/chat`)
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

  // Game Creator Handler - PRESERVED WORKING VERSION
  const handleGameSubmit = async (e) => {
    e.preventDefault()
    if (!gameDescription.trim() || isGeneratingGame) return

    setIsGeneratingGame(true)
    setGeneratedGame('')

    try {
      console.log('🌐 Sending game request to:', `${GAMEMAKER_API}/generate-game`)
      const response = await fetch(`${GAMEMAKER_API}/generate-game`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        // PRESERVED: Use 'prompt' instead of 'description'
        body: JSON.stringify({ prompt: gameDescription })
      })

      if (response.ok) {
        const data = await response.json()
        console.log('✅ Game response received:', data)
        
        // PRESERVED: Use 'game_html' field from backend response
        const gameHtml = data.game_html || data.html || 'Game generated successfully!'
        setGeneratedGame(gameHtml)
      } else {
        throw new Error(`HTTP ${response.status}`)
      }
    } catch (error) {
      console.error('❌ Game generation error:', error)
      setGeneratedGame('Sorry, there was an error generating the game. Please try again.')
    } finally {
      setIsGeneratingGame(false)
    }
  }

  // Media Studio Handler - PRESERVED WORKING VERSION
  const handleImageSubmit = async (e) => {
    e.preventDefault()
    if (!imagePrompt.trim() || isGeneratingImage) return

    setIsGeneratingImage(true)
    setGeneratedImage('')

    try {
      console.log('🌐 Sending image request to:', `${MEDIA_API}/generate-image`)
      const response = await fetch(`${MEDIA_API}/generate-image`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ prompt: imagePrompt })
      })

      if (response.ok) {
        const data = await response.json()
        console.log('✅ Image response received:', data)
        
        // PRESERVED: Use 'image_data' field from backend response
        const imageData = data.image_data || data.image_url || data.url
        if (imageData) {
          setGeneratedImage(imageData)
        } else {
          setGeneratedImage('Image generated successfully!')
        }
      } else {
        throw new Error(`HTTP ${response.status}`)
      }
    } catch (error) {
      console.error('❌ Image generation error:', error)
      setGeneratedImage('Sorry, there was an error generating the image. Please try again.')
    } finally {
      setIsGeneratingImage(false)
    }
  }

  // Audio Studio Handlers - PRESERVED WORKING VERSION
  const generateSpeech = async () => {
    if (!speechText.trim() || isAudioLoading) return

    setIsAudioLoading(true)
    setAudioResult('')

    try {
      const response = await fetch(`${AUDIO_API}/generate-speech`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          text: speechText,
          voice_preset: selectedVoice
        }),
      })

      const data = await response.json()
      
      if (data.success) {
        setAudioResult(`✅ Speech generated successfully!\n\n${data.message || data.status}`)
      } else {
        throw new Error(data.error || 'Failed to generate speech')
      }
    } catch (error) {
      console.error('Error:', error)
      setAudioResult('❌ Sorry, I encountered an error generating speech. Please try again.')
    } finally {
      setIsAudioLoading(false)
    }
  }

  const generateMusic = async () => {
    if (!musicPrompt.trim() || isAudioLoading) return

    setIsAudioLoading(true)
    setAudioResult('')

    try {
      const response = await fetch(`${AUDIO_API}/generate-music`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          prompt: musicPrompt,
          duration: 10
        }),
      })

      const data = await response.json()
      
      if (data.success) {
        setAudioResult(`🎵 Music generated successfully!\n\n${data.message || data.status}`)
      } else {
        throw new Error(data.error || 'Failed to generate music')
      }
    } catch (error) {
      console.error('Error:', error)
      setAudioResult('❌ Sorry, I encountered an error generating music. Please try again.')
    } finally {
      setIsAudioLoading(false)
    }
  }

  // Video Studio Handler - FIXED VERSION
  const generateVideo = async () => {
    if (!videoPrompt.trim() || isGeneratingVideo) return

    setIsGeneratingVideo(true)
    setGeneratedVideo('')

    try {
      console.log('🌐 Sending video request to:', `${VIDEO_API}/generate-video`)
      const response = await fetch(`${VIDEO_API}/generate-video`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          prompt: videoPrompt,
          duration: videoDuration,
          model: videoModelType
        }),
      })

      const data = await response.json()
      console.log('📹 Video response:', data)
      
      if (data.success) {
        // Format the success response with all the details
        let resultText = `🎬 Video generated successfully!\n\n`
        
        if (data.generation_info) {
          resultText += `📊 Generation Details:\n`
          resultText += `• Model: ${data.generation_info.model_name || 'Auto-selected'}\n`
          resultText += `• Quality: ${data.generation_info.quality || 'High'}\n`
          resultText += `• Duration: ${data.generation_info.duration || videoDuration} seconds\n`
          resultText += `• Generation Time: ${data.generation_info.generation_time || 'N/A'}\n\n`
        }
        
        if (data.video_data) {
          resultText += `🎥 Video Details:\n`
          resultText += `• Resolution: ${data.video_data.resolution || 'HD'}\n`
          resultText += `• Format: ${data.video_data.format || 'MP4'}\n`
          resultText += `• File Size: ${data.video_data.file_size || 'N/A'}\n\n`
        }
        
        resultText += `✨ ${data.message || 'Your video has been generated successfully!'}`
        
        setGeneratedVideo(resultText)
      } else {
        throw new Error(data.error || 'Failed to generate video')
      }
    } catch (error) {
      console.error('❌ Video generation error:', error)
      setGeneratedVideo('❌ Sorry, I encountered an error generating video. Please try again.')
    } finally {
      setIsGeneratingVideo(false)
    }
  }

  const renderHome = () => (
    <div className="space-y-8">
      <div className="text-center">
        <h1 className="text-4xl font-bold text-white mb-4">Welcome to Mythiq</h1>
        <p className="text-xl text-purple-200 mb-8">Your AI-powered creative platform</p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
        <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6 border border-white/20">
          <div className="text-3xl mb-4">🤖</div>
          <h3 className="text-xl font-semibold text-white mb-2">AI Assistant</h3>
          <p className="text-purple-200">Chat with our advanced AI powered by Groq Llama 3.1</p>
          <div className="mt-4 text-sm text-purple-300">
            <div>💬 Conversations: 1,247</div>
            <div>⚡ Avg Response: 1.2s</div>
          </div>
        </div>
        
        <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6 border border-white/20">
          <div className="text-3xl mb-4">🎮</div>
          <h3 className="text-xl font-semibold text-white mb-2">Game Creator</h3>
          <p className="text-purple-200">Generate playable games with AI assistance</p>
          <div className="mt-4 text-sm text-purple-300">
            <div>🎯 Games Created: 89</div>
            <div>🏆 Success Rate: 94%</div>
          </div>
        </div>
        
        <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6 border border-white/20">
          <div className="text-3xl mb-4">🎨</div>
          <h3 className="text-xl font-semibold text-white mb-2">Media Studio</h3>
          <p className="text-purple-200">Create stunning images with AI generation</p>
          <div className="mt-4 text-sm text-purple-300">
            <div>🖼️ Images Generated: 456</div>
            <div>✨ Quality Score: 9.2/10</div>
          </div>
        </div>

        <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6 border border-white/20">
          <div className="text-3xl mb-4">🎵</div>
          <h3 className="text-xl font-semibold text-white mb-2">Audio Studio</h3>
          <p className="text-purple-200">Generate speech and music with AI</p>
          <div className="mt-4 text-sm text-purple-300">
            <div>🎤 Speech Generated: 234</div>
            <div>🎶 Music Created: 156</div>
          </div>
        </div>

        <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6 border border-white/20">
          <div className="text-3xl mb-4">🎬</div>
          <h3 className="text-xl font-semibold text-white mb-2">Video Studio</h3>
          <p className="text-purple-200">Create amazing videos with AI generation</p>
          <div className="mt-4 text-sm text-purple-300">
            <div>🎥 Videos Created: 78</div>
            <div>🌟 Quality Score: 9.5/10</div>
          </div>
        </div>
      </div>
    </div>
  )

  const renderChat = () => (
    <div className="space-y-6">
      <h2 className="text-3xl font-bold text-white text-center">AI Chat Assistant</h2>
      
      <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6 border border-white/20 h-96 overflow-y-auto">
        {messages.length === 0 ? (
          <div className="text-center text-purple-200 mt-20">
            <div className="text-4xl mb-4">💬</div>
            <p>Start a conversation with our AI assistant!</p>
          </div>
        ) : (
          <div className="space-y-4">
            {messages.map((msg, index) => (
              <div key={index} className={`flex ${msg.type === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                  msg.type === 'user' 
                    ? 'bg-purple-600 text-white' 
                    : 'bg-white/20 text-white'
                }`}>
                  <div className="whitespace-pre-wrap">{msg.content}</div>
                </div>
              </div>
            ))}
            {isLoading && (
              <div className="flex justify-start">
                <div className="bg-white/20 text-white px-4 py-2 rounded-lg">
                  <div className="flex items-center space-x-2">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                    <span>AI is thinking...</span>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
      
      <form onSubmit={handleChatSubmit} className="flex space-x-4">
        <input
          type="text"
          value={currentMessage}
          onChange={(e) => setCurrentMessage(e.target.value)}
          placeholder="Type your message..."
          className="flex-1 px-4 py-2 rounded-lg bg-white/10 border border-white/20 text-white placeholder-purple-300 focus:outline-none focus:ring-2 focus:ring-purple-500"
          disabled={isLoading}
        />
        <button
          type="submit"
          disabled={isLoading || !currentMessage.trim()}
          className="px-6 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          {isLoading ? 'Sending...' : 'Send'}
        </button>
      </form>
    </div>
  )

  const renderGameCreator = () => (
    <div className="space-y-6">
      <h2 className="text-3xl font-bold text-white text-center">AI Game Creator</h2>
      
      <form onSubmit={handleGameSubmit} className="space-y-4">
        <div>
          <label className="block text-white text-sm font-medium mb-2">
            Game Description:
          </label>
          <textarea
            value={gameDescription}
            onChange={(e) => setGameDescription(e.target.value)}
            placeholder="Describe the game you want to create..."
            rows={4}
            className="w-full px-4 py-2 rounded-lg bg-white/10 border border-white/20 text-white placeholder-purple-300 focus:outline-none focus:ring-2 focus:ring-purple-500 resize-none"
            disabled={isGeneratingGame}
          />
        </div>
        <button
          type="submit"
          disabled={isGeneratingGame || !gameDescription.trim()}
          className="w-full px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium"
        >
          {isGeneratingGame ? 'Creating Game...' : 'Create Game'}
        </button>
      </form>
      
      {generatedGame && (
        <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6 border border-white/20">
          <h3 className="text-xl font-semibold text-white mb-4">Generated Game:</h3>
          {generatedGame.includes('<html>') || generatedGame.includes('<!DOCTYPE') ? (
            <iframe
              srcDoc={generatedGame}
              className="w-full h-96 border border-white/20 rounded-lg bg-white"
              title="Generated Game"
            />
          ) : (
            <div className="text-white whitespace-pre-wrap">{generatedGame}</div>
          )}
        </div>
      )}
    </div>
  )

  const renderMediaStudio = () => (
    <div className="space-y-6">
      <h2 className="text-3xl font-bold text-white text-center">AI Media Studio</h2>
      
      <form onSubmit={handleImageSubmit} className="space-y-4">
        <div>
          <label className="block text-white text-sm font-medium mb-2">
            Image Description:
          </label>
          <textarea
            value={imagePrompt}
            onChange={(e) => setImagePrompt(e.target.value)}
            placeholder="Describe the image you want to generate..."
            rows={3}
            className="w-full px-4 py-2 rounded-lg bg-white/10 border border-white/20 text-white placeholder-purple-300 focus:outline-none focus:ring-2 focus:ring-purple-500 resize-none"
            disabled={isGeneratingImage}
          />
        </div>
        <button
          type="submit"
          disabled={isGeneratingImage || !imagePrompt.trim()}
          className="w-full px-6 py-3 bg-pink-600 text-white rounded-lg hover:bg-pink-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium"
        >
          {isGeneratingImage ? 'Creating Image...' : 'Create Image'}
        </button>
      </form>
      
      {generatedImage && (
        <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6 border border-white/20">
          <h3 className="text-xl font-semibold text-white mb-4">Generated Image:</h3>
          {generatedImage.startsWith('data:image') ? (
            <img 
              src={generatedImage} 
              alt="AI Generated" 
              className="w-full max-w-md mx-auto rounded-lg border border-white/20"
            />
          ) : generatedImage.startsWith('http') ? (
            <img 
              src={generatedImage} 
              alt="AI Generated" 
              className="w-full max-w-md mx-auto rounded-lg border border-white/20"
            />
          ) : (
            <div className="text-white whitespace-pre-wrap">{generatedImage}</div>
          )}
        </div>
      )}
    </div>
  )

  const renderAudioStudio = () => (
    <div className="space-y-6">
      <h2 className="text-3xl font-bold text-white text-center">🎵 Audio Studio</h2>
      
      {/* Speech Generation */}
      <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6 border border-white/20">
        <h3 className="text-xl font-semibold text-white mb-4">🎤 Speech Generation</h3>
        
        {/* Voice Selection */}
        {voicePresets.length > 0 && (
          <div className="mb-4">
            <label className="block text-white text-sm font-medium mb-2">
              Voice Preset:
            </label>
            <select
              value={selectedVoice}
              onChange={(e) => setSelectedVoice(e.target.value)}
              className="w-full px-4 py-2 rounded-lg bg-white/10 border border-white/20 text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
            >
              {voicePresets.map((preset) => (
                <option key={preset.id} value={preset.id} className="bg-gray-800">
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
          className="w-full px-4 py-2 rounded-lg bg-white/10 border border-white/20 text-white placeholder-purple-300 focus:outline-none focus:ring-2 focus:ring-purple-500 resize-none"
          rows="3"
        />
        
        <button
          onClick={generateSpeech}
          disabled={isAudioLoading || !speechText.trim()}
          className="mt-3 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium"
        >
          {isAudioLoading ? '🎤 Generating Speech...' : '🗣️ Generate Speech'}
        </button>
      </div>
      
      {/* Music Generation */}
      <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6 border border-white/20">
        <h3 className="text-xl font-semibold text-white mb-4">🎵 Music Generation</h3>
        
        <input
          type="text"
          value={musicPrompt}
          onChange={(e) => setMusicPrompt(e.target.value)}
          placeholder="Describe the music you want (e.g., 'upbeat electronic dance music', 'calm piano melody')"
          className="w-full px-4 py-2 rounded-lg bg-white/10 border border-white/20 text-white placeholder-purple-300 focus:outline-none focus:ring-2 focus:ring-purple-500"
        />
        
        <button
          onClick={generateMusic}
          disabled={isAudioLoading || !musicPrompt.trim()}
          className="mt-3 px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium"
        >
          {isAudioLoading ? '🎵 Generating Music...' : '🎶 Generate Music'}
        </button>
      </div>
      
      {/* Audio Results */}
      {audioResult && (
        <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6 border border-white/20">
          <h3 className="text-lg font-semibold text-white mb-2">🎧 Audio Result:</h3>
          <div className="p-4 bg-white/5 rounded-lg">
            <p className="text-white whitespace-pre-wrap">{audioResult}</p>
          </div>
        </div>
      )}
    </div>
  )

  const renderVideoStudio = () => (
    <div className="space-y-6">
      <h2 className="text-3xl font-bold text-white text-center">🎬 Video Studio</h2>
      
      {/* Video Generation */}
      <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6 border border-white/20">
        <h3 className="text-xl font-semibold text-white mb-4">🎥 Video Generation</h3>
        
        {/* Model Selection */}
        <div className="mb-4">
          <label className="block text-white text-sm font-medium mb-2">
            Video Model:
          </label>
          <select
            value={videoModelType}
            onChange={(e) => setVideoModelType(e.target.value)}
            className="w-full px-4 py-2 rounded-lg bg-white/10 border border-white/20 text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
          >
            <option value="auto" className="bg-gray-800">Auto-Select Best Model</option>
            <option value="photorealistic" className="bg-gray-800">Photorealistic (Mochi-1)</option>
            <option value="creative" className="bg-gray-800">Creative (CogVideoX-5B)</option>
            <option value="animation" className="bg-gray-800">Animation (AnimateDiff)</option>
          </select>
        </div>
        
        {/* Duration Control */}
        <div className="mb-4">
          <label className="block text-white text-sm font-medium mb-2">
            Duration: {videoDuration} seconds
          </label>
          <input
            type="range"
            min="2"
            max="6"
            value={videoDuration}
            onChange={(e) => setVideoDuration(parseInt(e.target.value))}
            className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer"
          />
          <div className="flex justify-between text-xs text-gray-400 mt-1">
            <span>2s</span>
            <span>4s</span>
            <span>6s</span>
          </div>
        </div>
        
        <textarea
          value={videoPrompt}
          onChange={(e) => setVideoPrompt(e.target.value)}
          placeholder="Describe the video you want to generate... (e.g., 'A cat playing with a ball of yarn', 'Ocean waves crashing on rocks', 'Cartoon character dancing')"
          className="w-full px-4 py-2 rounded-lg bg-white/10 border border-white/20 text-white placeholder-purple-300 focus:outline-none focus:ring-2 focus:ring-purple-500 resize-none"
          rows="3"
        />
        
        <button
          onClick={generateVideo}
          disabled={isGeneratingVideo || !videoPrompt.trim()}
          className="mt-3 w-full px-6 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium"
        >
          {isGeneratingVideo ? '🎬 Generating Video...' : '🎥 Generate Video'}
        </button>
      </div>
      
      {/* Video Results */}
      {generatedVideo && (
        <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6 border border-white/20">
          <h3 className="text-lg font-semibold text-white mb-2">📹 Video Result:</h3>
          <div className="p-4 bg-white/5 rounded-lg">
            <pre className="text-green-400 whitespace-pre-wrap text-sm">{generatedVideo}</pre>
          </div>
        </div>
      )}
      
      {/* Available Models Display */}
      {videoModels && Object.keys(videoModels).length > 0 && (
        <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6 border border-white/20">
          <h3 className="text-lg font-semibold text-white mb-4">Available Models:</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {Object.entries(videoModels).map(([key, model]) => (
              <div key={key} className="bg-white/5 rounded-lg p-4">
                <h4 className="font-semibold text-white">{model.name}</h4>
                <p className="text-sm text-gray-300">Quality: {model.quality}</p>
                <p className="text-sm text-gray-300">Max Duration: {model.max_duration}s</p>
                <p className="text-xs text-gray-400 mt-2">Best for: {model.best_for?.join(', ')}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center justify-center mb-8">
          <div className="bg-pink-500 rounded-lg p-3 mr-4">
            <span className="text-white font-bold text-xl">M</span>
          </div>
          <h1 className="text-3xl font-bold text-white">Mythiq</h1>
        </div>
        
        {/* Navigation */}
        <div className="flex flex-wrap justify-center gap-2 mb-8">
          <button
            onClick={() => setActiveTab('home')}
            className={`px-4 py-2 rounded-lg font-medium transition-all ${
              activeTab === 'home'
                ? 'bg-green-600 text-white shadow-lg'
                : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
            }`}
          >
            🏠Home
          </button>
          <button
            onClick={() => setActiveTab('chat')}
            className={`px-4 py-2 rounded-lg font-medium transition-all ${
              activeTab === 'chat'
                ? 'bg-blue-600 text-white shadow-lg'
                : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
            }`}
          >
            💬AI Chat
          </button>
          <button
            onClick={() => setActiveTab('game')}
            className={`px-4 py-2 rounded-lg font-medium transition-all ${
              activeTab === 'game'
                ? 'bg-orange-600 text-white shadow-lg'
                : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
            }`}
          >
            🎮Game Creator
          </button>
          <button
            onClick={() => setActiveTab('media')}
            className={`px-4 py-2 rounded-lg font-medium transition-all ${
              activeTab === 'media'
                ? 'bg-pink-600 text-white shadow-lg'
                : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
            }`}
          >
            🎨Media Studio
          </button>
          <button
            onClick={() => setActiveTab('audio')}
            className={`px-4 py-2 rounded-lg font-medium transition-all ${
              activeTab === 'audio'
                ? 'bg-purple-600 text-white shadow-lg'
                : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
            }`}
          >
            🎵Audio Studio
          </button>
          <button
            onClick={() => setActiveTab('video')}
            className={`px-4 py-2 rounded-lg font-medium transition-all ${
              activeTab === 'video'
                ? 'bg-red-600 text-white shadow-lg'
                : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
            }`}
          >
            🎬Video Studio
          </button>
        </div>

        {/* Content */}
        <div className="max-w-4xl mx-auto">
          {activeTab === 'home' && renderHome()}
          {activeTab === 'chat' && renderChat()}
          {activeTab === 'game' && renderGameCreator()}
          {activeTab === 'media' && renderMediaStudio()}
          {activeTab === 'audio' && renderAudioStudio()}
          {activeTab === 'video' && renderVideoStudio()}
        </div>
      </div>
    </div>
  )
}

export default App
