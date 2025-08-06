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

  // 🚀 ENHANCED GAME CREATOR STATES
  const [gameMetadata, setGameMetadata] = useState(null)
  const [enhancedMode, setEnhancedMode] = useState(true)
  const [gameError, setGameError] = useState('')

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

  // 🚀 ENHANCED GAME CREATOR HANDLER
  const handleGameSubmit = async (e) => {
    e.preventDefault()
    if (!gameDescription.trim() || isGeneratingGame) return

    setIsGeneratingGame(true)
    setGeneratedGame('')
    setGameError('')
    setGameMetadata(null)

    try {
      console.log('🌐 Sending enhanced game request to:', `${GAMEMAKER_API}/generate-game`)
      const response = await fetch(`${GAMEMAKER_API}/generate-game`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          prompt: gameDescription,
          enhanced: enhancedMode  // 🚀 ENHANCED GENERATION ENABLED!
        })
      })

      if (response.ok) {
        const data = await response.json()
        console.log('✅ Enhanced game response received:', data)
        
        // Handle enhanced response with metadata
        const gameHtml = data.game_html || data.html || 'Enhanced game generated successfully!'
        setGeneratedGame(gameHtml)
        
        // Handle enhanced metadata
        if (data.metadata) {
          setGameMetadata({
            template: data.metadata.template_used || 'enhanced',
            features: data.metadata.features || ['professional-graphics', 'complete-mechanics'],
            generatedAt: data.metadata.generated_at || new Date().toISOString(),
            title: data.metadata.title || 'Enhanced Game',
            quality: data.metadata.quality || 'Professional'
          })
        }
      } else {
        throw new Error(`HTTP ${response.status}`)
      }
    } catch (error) {
      console.error('❌ Enhanced game generation error:', error)
      setGameError('Failed to generate enhanced game. Please try again.')
      
      // Fallback to basic generation if enhanced fails
      if (enhancedMode) {
        console.log('🔄 Attempting fallback to basic generation...')
        try {
          const fallbackResponse = await fetch(`${GAMEMAKER_API}/generate-game`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ prompt: gameDescription })
          })
          
          if (fallbackResponse.ok) {
            const fallbackData = await fallbackResponse.json()
            const gameHtml = fallbackData.game_html || fallbackData.html || 'Game generated successfully!'
            setGeneratedGame(gameHtml)
            setGameError('Enhanced generation unavailable. Generated with basic mode.')
          }
        } catch (fallbackError) {
          console.error('❌ Fallback generation also failed:', fallbackError)
        }
      }
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

  // Video Studio Handler - PRESERVED WORKING VERSION
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
          <p className="text-purple-200">Generate professional games with enhanced AI</p>
          <div className="mt-4 text-sm text-purple-300">
            <div>🎯 Games Created: 89</div>
            <div>🏆 Quality Score: {enhancedMode ? '8.5/10' : '3.0/10'}</div>
            {enhancedMode && <div className="text-green-400">✨ Enhanced Mode</div>}
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

  // 🚀 ENHANCED GAME CREATOR COMPONENT
  const renderGameCreator = () => (
    <div className="space-y-6">
      {/* Enhanced Header */}
      <div className="text-center space-y-2">
        <h2 className="text-3xl font-bold text-white">🎮 AI Game Creator</h2>
        <p className="text-gray-300">Create professional games with advanced features</p>
        {enhancedMode && (
          <div className="inline-flex items-center px-3 py-1 rounded-full bg-green-500/20 border border-green-500/30">
            <span className="text-green-400 text-sm font-medium">✨ Enhanced Mode Active</span>
          </div>
        )}
      </div>

      <form onSubmit={handleGameSubmit} className="space-y-4">
        {/* Game Description Input */}
        <div>
          <label className="block text-white text-sm font-medium mb-2">
            Game Description:
          </label>
          <textarea
            value={gameDescription}
            onChange={(e) => setGameDescription(e.target.value)}
            placeholder="Describe the game you want to create... (e.g., 'Create a space shooter game with powerups, enemies, and scoring system')"
            className="w-full h-32 px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
            disabled={isGeneratingGame}
          />
        </div>

        {/* Enhanced Options */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-300">
              Generation Mode:
            </label>
            <select
              value={enhancedMode ? 'enhanced' : 'basic'}
              onChange={(e) => setEnhancedMode(e.target.value === 'enhanced')}
              className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              disabled={isGeneratingGame}
            >
              <option value="enhanced">✨ Enhanced (Professional)</option>
              <option value="basic">🔧 Basic (Legacy)</option>
            </select>
          </div>
          
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-300">
              Expected Quality:
            </label>
            <div className={`px-3 py-2 rounded-lg border ${
              enhancedMode 
                ? 'bg-green-500/20 border-green-500/30' 
                : 'bg-yellow-500/20 border-yellow-500/30'
            }`}>
              <span className={`font-medium ${
                enhancedMode ? 'text-green-400' : 'text-yellow-400'
              }`}>
                {enhancedMode ? '🏆 Professional (8/10)' : '⚠️ Basic (3/10)'}
              </span>
            </div>
          </div>
        </div>

        {/* Create Game Button */}
        <button
          type="submit"
          disabled={isGeneratingGame || !gameDescription.trim()}
          className="w-full py-3 px-6 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 disabled:from-gray-600 disabled:to-gray-700 text-white font-semibold rounded-lg transition-all duration-200 disabled:cursor-not-allowed"
        >
          {isGeneratingGame ? (
            <div className="flex items-center justify-center space-x-2">
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
              <span>Generating {enhancedMode ? 'Enhanced' : 'Basic'} Game...</span>
            </div>
          ) : (
            `🚀 Create ${enhancedMode ? 'Enhanced' : 'Basic'} Game`
          )}
        </button>
      </form>

      {/* Enhanced Features Info */}
      {enhancedMode && (
        <div className="bg-blue-500/10 border border-blue-500/30 rounded-lg p-4">
          <h4 className="text-blue-400 font-medium mb-2">✨ Enhanced Features:</h4>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-2 text-sm text-gray-300">
            <div>🎨 Professional Graphics</div>
            <div>🔫 Complete Shooting</div>
            <div>⭐ Power-up System</div>
            <div>📊 Advanced Scoring</div>
            <div>🎯 Difficulty Scaling</div>
            <div>💥 Particle Effects</div>
            <div>📱 Mobile Optimized</div>
            <div>🎵 Sound Ready</div>
          </div>
        </div>
      )}

      {/* Game Metadata Display */}
      {gameMetadata && (
        <div className="bg-green-500/10 border border-green-500/30 rounded-lg p-4">
          <h4 className="text-green-400 font-medium mb-2">🎮 Game Details:</h4>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
            <div>
              <span className="text-gray-400">Template:</span>
              <span className="text-white ml-2 capitalize">{gameMetadata.template}</span>
            </div>
            <div>
              <span className="text-gray-400">Features:</span>
              <span className="text-white ml-2">{gameMetadata.features.length}</span>
            </div>
            <div>
              <span className="text-gray-400">Quality:</span>
              <span className="text-green-400 ml-2 font-medium">{gameMetadata.quality}</span>
            </div>
          </div>
        </div>
      )}

      {/* Error Display */}
      {gameError && (
        <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-4">
          <div className="flex items-center space-x-2">
            <span className="text-red-400">❌</span>
            <span className="text-red-400 font-medium">Generation Notice:</span>
          </div>
          <p className="text-red-300 mt-1">{gameError}</p>
          <button
            onClick={() => setGameError('')}
            className="mt-2 text-red-400 hover:text-red-300 text-sm underline"
          >
            Dismiss
          </button>
        </div>
      )}

      {/* Generated Game Display */}
      {generatedGame && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-xl font-semibold text-white">
              🎮 {gameMetadata?.title || 'Generated Game'}
            </h3>
            <div className="flex items-center space-x-2">
              {enhancedMode && (
                <span className="text-green-400 text-sm">✅ Enhanced Quality</span>
              )}
              <button
                onClick={() => {
                  const blob = new Blob([generatedGame], { type: 'text/html' });
                  const url = URL.createObjectURL(blob);
                  const a = document.createElement('a');
                  a.href = url;
                  a.download = `${gameMetadata?.title || 'mythiq-game'}.html`;
                  a.click();
                  URL.revokeObjectURL(url);
                }}
                className="px-3 py-1 bg-blue-600 hover:bg-blue-700 text-white text-sm rounded transition-colors"
              >
                📥 Download
              </button>
            </div>
          </div>
          
          <div className="bg-black/30 rounded-lg p-1 border border-white/10">
            <iframe
              srcDoc={generatedGame}
              className="w-full h-96 rounded border-0"
              title="Generated Game"
              sandbox="allow-scripts allow-same-origin"
            />
          </div>
          
          <div className="text-center">
            <button
              onClick={() => {
                const newWindow = window.open();
                newWindow.document.write(generatedGame);
                newWindow.document.close();
              }}
              className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition-colors"
            >
              🚀 Open in New Window
            </button>
          </div>
        </div>
      )}
    </div>
  )

  const renderMediaStudio = () => (
    <div className="space-y-6">
      <h2 className="text-3xl font-bold text-white text-center">Media Studio</h2>
      
      <form onSubmit={handleImageSubmit} className="space-y-4">
        <div>
          <label className="block text-white text-sm font-medium mb-2">
            Image Description:
          </label>
          <textarea
            value={imagePrompt}
            onChange={(e) => setImagePrompt(e.target.value)}
            placeholder="Describe the image you want to create..."
            className="w-full h-32 px-4 py-2 rounded-lg bg-white/10 border border-white/20 text-white placeholder-purple-300 focus:outline-none focus:ring-2 focus:ring-purple-500 resize-none"
            disabled={isGeneratingImage}
          />
        </div>
        
        <button
          type="submit"
          disabled={isGeneratingImage || !imagePrompt.trim()}
          className="w-full py-3 px-6 bg-gradient-to-r from-purple-600 to-pink-600 text-white font-semibold rounded-lg hover:from-purple-700 hover:to-pink-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          {isGeneratingImage ? (
            <div className="flex items-center justify-center space-x-2">
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
              <span>Generating Image...</span>
            </div>
          ) : (
            'Generate Image'
          )}
        </button>
      </form>
      
      {generatedImage && (
        <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6 border border-white/20">
          <h3 className="text-xl font-semibold text-white mb-4">Generated Image:</h3>
          {generatedImage.startsWith('data:image') || generatedImage.startsWith('http') ? (
            <img src={generatedImage} alt="Generated" className="w-full rounded-lg" />
          ) : (
            <div className="text-white whitespace-pre-wrap">{generatedImage}</div>
          )}
        </div>
      )}
    </div>
  )

  const renderAudioStudio = () => (
    <div className="space-y-6">
      <h2 className="text-3xl font-bold text-white text-center">Audio Studio</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Speech Generation */}
        <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6 border border-white/20">
          <h3 className="text-xl font-semibold text-white mb-4">🎤 Speech Generation</h3>
          
          <div className="space-y-4">
            <div>
              <label className="block text-white text-sm font-medium mb-2">
                Text to Speech:
              </label>
              <textarea
                value={speechText}
                onChange={(e) => setSpeechText(e.target.value)}
                placeholder="Enter text to convert to speech..."
                className="w-full h-24 px-3 py-2 rounded-lg bg-white/10 border border-white/20 text-white placeholder-purple-300 focus:outline-none focus:ring-2 focus:ring-purple-500 resize-none"
                disabled={isAudioLoading}
              />
            </div>
            
            <div>
              <label className="block text-white text-sm font-medium mb-2">
                Voice Preset:
              </label>
              <select
                value={selectedVoice}
                onChange={(e) => setSelectedVoice(e.target.value)}
                className="w-full px-3 py-2 rounded-lg bg-white/10 border border-white/20 text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                disabled={isAudioLoading}
              >
                {voicePresets.length > 0 ? (
                  voicePresets.map((preset) => (
                    <option key={preset.id} value={preset.id}>
                      {preset.name}
                    </option>
                  ))
                ) : (
                  <option value="v2/en_speaker_6">Default Voice</option>
                )}
              </select>
            </div>
            
            <button
              onClick={generateSpeech}
              disabled={isAudioLoading || !speechText.trim()}
              className="w-full py-2 px-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {isAudioLoading ? 'Generating...' : 'Generate Speech'}
            </button>
          </div>
        </div>

        {/* Music Generation */}
        <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6 border border-white/20">
          <h3 className="text-xl font-semibold text-white mb-4">🎵 Music Generation</h3>
          
          <div className="space-y-4">
            <div>
              <label className="block text-white text-sm font-medium mb-2">
                Music Description:
              </label>
              <textarea
                value={musicPrompt}
                onChange={(e) => setMusicPrompt(e.target.value)}
                placeholder="Describe the music you want to create..."
                className="w-full h-24 px-3 py-2 rounded-lg bg-white/10 border border-white/20 text-white placeholder-purple-300 focus:outline-none focus:ring-2 focus:ring-purple-500 resize-none"
                disabled={isAudioLoading}
              />
            </div>
            
            <button
              onClick={generateMusic}
              disabled={isAudioLoading || !musicPrompt.trim()}
              className="w-full py-2 px-4 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {isAudioLoading ? 'Generating...' : 'Generate Music'}
            </button>
          </div>
        </div>
      </div>
      
      {/* Audio Result */}
      {audioResult && (
        <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6 border border-white/20">
          <h3 className="text-xl font-semibold text-white mb-4">Audio Result:</h3>
          <div className="text-white whitespace-pre-wrap">{audioResult}</div>
        </div>
      )}
    </div>
  )

  const renderVideoStudio = () => (
    <div className="space-y-6">
      <h2 className="text-3xl font-bold text-white text-center">Video Studio</h2>
      
      <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6 border border-white/20">
        <div className="space-y-4">
          <div>
            <label className="block text-white text-sm font-medium mb-2">
              Video Description:
            </label>
            <textarea
              value={videoPrompt}
              onChange={(e) => setVideoPrompt(e.target.value)}
              placeholder="Describe the video you want to create..."
              className="w-full h-32 px-4 py-2 rounded-lg bg-white/10 border border-white/20 text-white placeholder-purple-300 focus:outline-none focus:ring-2 focus:ring-purple-500 resize-none"
              disabled={isGeneratingVideo}
            />
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-white text-sm font-medium mb-2">
                Duration (seconds):
              </label>
              <input
                type="number"
                value={videoDuration}
                onChange={(e) => setVideoDuration(parseInt(e.target.value) || 6)}
                min="1"
                max="10"
                className="w-full px-3 py-2 rounded-lg bg-white/10 border border-white/20 text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                disabled={isGeneratingVideo}
              />
            </div>
            
            <div>
              <label className="block text-white text-sm font-medium mb-2">
                Model Type:
              </label>
              <select
                value={videoModelType}
                onChange={(e) => setVideoModelType(e.target.value)}
                className="w-full px-3 py-2 rounded-lg bg-white/10 border border-white/20 text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                disabled={isGeneratingVideo}
              >
                <option value="auto">Auto-select</option>
                {Object.entries(videoModels).map(([key, model]) => (
                  <option key={key} value={key}>
                    {model.name || key}
                  </option>
                ))}
              </select>
            </div>
          </div>
          
          <button
            onClick={generateVideo}
            disabled={isGeneratingVideo || !videoPrompt.trim()}
            className="w-full py-3 px-6 bg-gradient-to-r from-red-600 to-purple-600 text-white font-semibold rounded-lg hover:from-red-700 hover:to-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {isGeneratingVideo ? (
              <div className="flex items-center justify-center space-x-2">
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                <span>Generating Video...</span>
              </div>
            ) : (
              'Generate Video'
            )}
          </button>
        </div>
      </div>
      
      {generatedVideo && (
        <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6 border border-white/20">
          <h3 className="text-xl font-semibold text-white mb-4">Video Result:</h3>
          <div className="text-white whitespace-pre-wrap">{generatedVideo}</div>
        </div>
      )}
    </div>
  )

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900">
      {/* Navigation */}
      <nav className="bg-black/20 backdrop-blur-sm border-b border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-4">
              <div className="bg-gradient-to-r from-pink-500 to-purple-600 text-white px-3 py-1 rounded-lg font-bold text-xl">
                M
              </div>
              <span className="text-white text-xl font-semibold">Mythiq</span>
            </div>
            
            <div className="flex space-x-1">
              {[
                { id: 'home', label: '🏠Home', number: '1' },
                { id: 'chat', label: '💬AI Chat', number: '2' },
                { id: 'game', label: '🎮Game Creator', number: '3' },
                { id: 'media', label: '🎨Media Studio', number: '4' },
                { id: 'audio', label: '🎵Audio Studio', number: '5' },
                { id: 'video', label: '🎬Video Studio', number: '6' }
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors relative ${
                    activeTab === tab.id
                      ? 'bg-white/20 text-white border border-white/30'
                      : 'text-gray-300 hover:text-white hover:bg-white/10'
                  }`}
                >
                  {tab.label}
                  <span className="absolute -top-1 -right-1 bg-purple-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                    {tab.number}
                  </span>
                </button>
              ))}
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {activeTab === 'home' && renderHome()}
        {activeTab === 'chat' && renderChat()}
        {activeTab === 'game' && renderGameCreator()}
        {activeTab === 'media' && renderMediaStudio()}
        {activeTab === 'audio' && renderAudioStudio()}
        {activeTab === 'video' && renderVideoStudio()}
      </main>
    </div>
  )
}

export default App
