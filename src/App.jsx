import React, { useState, useEffect } from 'react'

// API URLs
const ASSISTANT_API = import.meta.env.VITE_ASSISTANT_API || 'https://mythiq-assistant-production.up.railway.app'
const GAMEMAKER_API = import.meta.env.VITE_GAMEMAKER_API || 'https://mythiq-game-maker-production.up.railway.app'
const MEDIA_API = import.meta.env.VITE_MEDIA_API || 'https://mythiq-media-creator-production.up.railway.app'
const AUDIO_API = import.meta.env.VITE_AUDIO_API || 'https://mythiq-audio-creator-production.up.railway.app'
const VIDEO_API = import.meta.env.VITE_VIDEO_API || 'https://mythiq-video-creator-production.up.railway.app'

function App() {
  // Existing states
  const [activeTab, setActiveTab] = useState('home')
  const [chatInput, setChatInput] = useState('')
  const [chatResponse, setChatResponse] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [gameDescription, setGameDescription] = useState('')
  const [gameHtml, setGameHtml] = useState('')
  const [isGameLoading, setIsGameLoading] = useState(false)
  const [imagePrompt, setImagePrompt] = useState('')
  const [imageResult, setImageResult] = useState('')
  const [isImageLoading, setIsImageLoading] = useState(false)

  // Audio states
  const [speechText, setSpeechText] = useState('')
  const [musicPrompt, setMusicPrompt] = useState('')
  const [audioResult, setAudioResult] = useState('')
  const [isAudioLoading, setIsAudioLoading] = useState(false)
  const [voicePresets, setVoicePresets] = useState([])
  const [selectedVoice, setSelectedVoice] = useState('')

  // Video states
  const [videoPrompt, setVideoPrompt] = useState('')
  const [videoDuration, setVideoDuration] = useState(6)
  const [videoModelType, setVideoModelType] = useState('auto')
  const [generatedVideo, setGeneratedVideo] = useState('')
  const [isGeneratingVideo, setIsGeneratingVideo] = useState(false)
  const [videoModels, setVideoModels] = useState([])

  // Load voice presets on component mount
  useEffect(() => {
    const loadVoicePresets = async () => {
      try {
        const response = await fetch(`${AUDIO_API}/voice-presets`)
        const data = await response.json()
        if (data.success && data.presets) {
          setVoicePresets(data.presets)
          if (data.presets.length > 0) {
            setSelectedVoice(data.presets[0].id)
          }
        }
      } catch (error) {
        console.error('Error loading voice presets:', error)
      }
    }

    loadVoicePresets()
  }, [])

  // Load video models on component mount
  useEffect(() => {
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

    loadVideoModels()
  }, [])

  // Existing handlers
  const handleChatSubmit = async () => {
    if (!chatInput.trim() || isLoading) return

    setIsLoading(true)
    setChatResponse('')

    try {
      const response = await fetch(`${ASSISTANT_API}/chat`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ content: chatInput }),
      })

      const data = await response.json()
      const aiResponse = data.content || data.response || 'AI response received'
      setChatResponse(aiResponse)
    } catch (error) {
      console.error('Error:', error)
      setChatResponse('Sorry, I encountered an error. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  const handleGameSubmit = async () => {
    if (!gameDescription.trim() || isGameLoading) return

    setIsGameLoading(true)
    setGameHtml('')

    try {
      const response = await fetch(`${GAMEMAKER_API}/create-game`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ prompt: gameDescription }),
      })

      const data = await response.json()
      const gameHtml = data.game_html || data.html || 'Game generated successfully!'
      setGameHtml(gameHtml)
    } catch (error) {
      console.error('Error:', error)
      setGameHtml('Sorry, I encountered an error creating the game. Please try again.')
    } finally {
      setIsGameLoading(false)
    }
  }

  const handleImageSubmit = async () => {
    if (!imagePrompt.trim() || isImageLoading) return

    setIsImageLoading(true)
    setImageResult('')

    try {
      const response = await fetch(`${MEDIA_API}/generate-image`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ prompt: imagePrompt }),
      })

      const data = await response.json()
      const imageData = data.image_data || data.image_url || data.url || 'Image generated successfully!'
      setImageResult(imageData)
    } catch (error) {
      console.error('Error:', error)
      setImageResult('Sorry, I encountered an error generating the image. Please try again.')
    } finally {
      setIsImageLoading(false)
    }
  }

  // Audio handlers
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

  // FIXED Video generation handler
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
            <div>⭐ Success Rate: 94%</div>
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
            <div>🎵 Music Created: 156</div>
          </div>
        </div>
        
        <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6 border border-white/20">
          <div className="text-3xl mb-4">🎬</div>
          <h3 className="text-xl font-semibold text-white mb-2">Video Studio</h3>
          <p className="text-purple-200">Create amazing videos with AI generation</p>
          <div className="mt-4 text-sm text-purple-300">
            <div>🎥 Videos Created: 78</div>
            <div>⭐ Quality Score: 9.5/10</div>
          </div>
        </div>
      </div>
    </div>
  )

  const renderVideoStudio = () => (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-white mb-2">🎬 Video Studio</h2>
        <p className="text-gray-400">Create amazing videos with AI generation</p>
      </div>
      
      <div className="bg-gray-800 rounded-lg p-6">
        <h3 className="text-xl font-semibold text-white mb-4">🎥 Video Generation</h3>
        
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Video Model:</label>
            <select 
              value={videoModelType} 
              onChange={(e) => setVideoModelType(e.target.value)}
              className="w-full p-3 bg-gray-700 text-white rounded-lg border border-gray-600 focus:border-purple-500 focus:outline-none"
            >
              <option value="auto">Auto-Select Best Model</option>
              <option value="photorealistic">Photorealistic (Mochi-1)</option>
              <option value="creative">Creative (CogVideoX-5B)</option>
              <option value="animation">Animation (AnimateDiff)</option>
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Duration: {videoDuration} seconds
            </label>
            <input
              type="range"
              min="2"
              max="6"
              value={videoDuration}
              onChange={(e) => setVideoDuration(parseInt(e.target.value))}
              className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer slider"
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
            className="w-full p-3 bg-gray-700 text-white rounded-lg resize-none border border-gray-600 focus:border-purple-500 focus:outline-none"
            rows="3"
          />
          
          <button
            onClick={generateVideo}
            disabled={isGeneratingVideo || !videoPrompt.trim()}
            className={`w-full py-3 px-6 rounded-lg font-medium transition-all ${
              isGeneratingVideo || !videoPrompt.trim()
                ? 'bg-gray-600 text-gray-400 cursor-not-allowed'
                : 'bg-red-600 text-white hover:bg-red-700'
            }`}
          >
            {isGeneratingVideo ? '🎬 Generating Video...' : '🎥 Generate Video'}
          </button>
        </div>
        
        {generatedVideo && (
          <div className="mt-6 p-4 bg-gray-700 rounded-lg">
            <h4 className="text-lg font-semibold text-white mb-2">📹 Video Results</h4>
            <pre className="text-green-400 whitespace-pre-wrap text-sm">{generatedVideo}</pre>
          </div>
        )}
      </div>
      
      {videoModels && Object.keys(videoModels).length > 0 && (
        <div className="bg-gray-800 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-white mb-4">Available Models:</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {Object.entries(videoModels).map(([key, model]) => (
              <div key={key} className="bg-gray-700 rounded-lg p-4">
                <h4 className="font-semibold text-white">{model.name}</h4>
                <p className="text-sm text-gray-300">Quality: {model.quality}</p>
                <p className="text-sm text-gray-300">Max: {model.max_duration}s</p>
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
        <div className="flex items-center justify-center mb-8">
          <div className="bg-pink-500 rounded-lg p-3 mr-4">
            <span className="text-white font-bold text-xl">M</span>
          </div>
          <h1 className="text-3xl font-bold text-white">Mythiq</h1>
        </div>
        
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

        <div className="max-w-4xl mx-auto">
          {activeTab === 'home' && renderHome()}
          
          {activeTab === 'chat' && (
            <div className="space-y-6">
              <div className="text-center">
                <h2 className="text-2xl font-bold text-white mb-2">💬 AI Chat Assistant</h2>
                <p className="text-gray-400">Powered by Groq Llama 3.1</p>
              </div>
              
              <div className="bg-gray-800 rounded-lg p-6">
                <div className="space-y-4">
                  <textarea
                    value={chatInput}
                    onChange={(e) => setChatInput(e.target.value)}
                    placeholder="Ask me anything..."
                    className="w-full p-3 bg-gray-700 text-white rounded-lg resize-none"
                    rows="3"
                  />
                  <button
                    onClick={handleChatSubmit}
                    disabled={isLoading}
                    className={`w-full py-3 px-6 rounded-lg font-medium transition-all ${
                      isLoading
                        ? 'bg-gray-600 text-gray-400 cursor-not-allowed'
                        : 'bg-blue-600 text-white hover:bg-blue-700'
                    }`}
                  >
                    {isLoading ? 'Thinking...' : 'Send Message'}
                  </button>
                </div>
                
                {chatResponse && (
                  <div className="mt-6 p-4 bg-gray-700 rounded-lg">
                    <h3 className="text-lg font-semibold text-white mb-2">AI Response:</h3>
                    <p className="text-gray-300 whitespace-pre-wrap">{chatResponse}</p>
                  </div>
                )}
              </div>
            </div>
          )}

          {activeTab === 'game' && (
            <div className="space-y-6">
              <div className="text-center">
                <h2 className="text-2xl font-bold text-white mb-2">🎮 Game Creator</h2>
                <p className="text-gray-400">Generate playable games with AI</p>
              </div>
              
              <div className="bg-gray-800 rounded-lg p-6">
                <div className="space-y-4">
                  <textarea
                    value={gameDescription}
                    onChange={(e) => setGameDescription(e.target.value)}
                    placeholder="Describe the game you want to create..."
                    className="w-full p-3 bg-gray-700 text-white rounded-lg resize-none"
                    rows="3"
                  />
                  <button
                    onClick={handleGameSubmit}
                    disabled={isGameLoading}
                    className={`w-full py-3 px-6 rounded-lg font-medium transition-all ${
                      isGameLoading
                        ? 'bg-gray-600 text-gray-400 cursor-not-allowed'
                        : 'bg-orange-600 text-white hover:bg-orange-700'
                    }`}
                  >
                    {isGameLoading ? 'Creating Game...' : 'Create Game'}
                  </button>
                </div>
                
                {gameHtml && (
                  <div className="mt-6">
                    <h3 className="text-lg font-semibold text-white mb-2">Generated Game:</h3>
                    <div className="bg-white rounded-lg p-4">
                      <iframe
                        srcDoc={gameHtml}
                        className="w-full h-96 border-0"
                        title="Generated Game"
                      />
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {activeTab === 'media' && (
            <div className="space-y-6">
              <div className="text-center">
                <h2 className="text-2xl font-bold text-white mb-2">🎨 Media Studio</h2>
                <p className="text-gray-400">Create stunning images with AI</p>
              </div>
              
              <div className="bg-gray-800 rounded-lg p-6">
                <div className="space-y-4">
                  <textarea
                    value={imagePrompt}
                    onChange={(e) => setImagePrompt(e.target.value)}
                    placeholder="Describe the image you want to create..."
                    className="w-full p-3 bg-gray-700 text-white rounded-lg resize-none"
                    rows="3"
                  />
                  <button
                    onClick={handleImageSubmit}
                    disabled={isImageLoading}
                    className={`w-full py-3 px-6 rounded-lg font-medium transition-all ${
                      isImageLoading
                        ? 'bg-gray-600 text-gray-400 cursor-not-allowed'
                        : 'bg-pink-600 text-white hover:bg-pink-700'
                    }`}
                  >
                    {isImageLoading ? 'Generating Image...' : 'Generate Image'}
                  </button>
                </div>
                
                {imageResult && (
                  <div className="mt-6 p-4 bg-gray-700 rounded-lg">
                    <h3 className="text-lg font-semibold text-white mb-2">Generated Image:</h3>
                    <p className="text-gray-300">{imageResult}</p>
                  </div>
                )}
              </div>
            </div>
          )}

          {activeTab === 'audio' && (
            <div className="space-y-6">
              <div className="text-center">
                <h2 className="text-2xl font-bold text-white mb-2">🎵 Audio Studio</h2>
                <p className="text-gray-400">Generate speech and music with AI</p>
              </div>
              
              <div className="bg-gray-800 rounded-lg p-6">
                <h3 className="text-xl font-semibold text-white mb-4">🎤 Speech Generation</h3>
                <div className="space-y-4">
                  {voicePresets.length > 0 && (
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">Voice:</label>
                      <select 
                        value={selectedVoice} 
                        onChange={(e) => setSelectedVoice(e.target.value)}
                        className="w-full p-3 bg-gray-700 text-white rounded-lg"
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
                    placeholder="Enter text to convert to speech..."
                    className="w-full p-3 bg-gray-700 text-white rounded-lg resize-none"
                    rows="3"
                  />
                  <button
                    onClick={generateSpeech}
                    disabled={isAudioLoading || !speechText.trim()}
                    className={`w-full py-3 px-6 rounded-lg font-medium transition-all ${
                      isAudioLoading || !speechText.trim()
                        ? 'bg-gray-600 text-gray-400 cursor-not-allowed'
                        : 'bg-blue-600 text-white hover:bg-blue-700'
                    }`}
                  >
                    {isAudioLoading ? 'Generating Speech...' : 'Generate Speech'}
                  </button>
                </div>
              </div>
              
              <div className="bg-gray-800 rounded-lg p-6">
                <h3 className="text-xl font-semibold text-white mb-4">🎵 Music Generation</h3>
                <div className="space-y-4">
                  <input
                    type="text"
                    value={musicPrompt}
                    onChange={(e) => setMusicPrompt(e.target.value)}
                    placeholder="Describe the music you want (e.g., 'upbeat electronic dance music')"
                    className="w-full p-3 bg-gray-700 text-white rounded-lg"
                  />
                  <button
                    onClick={generateMusic}
                    disabled={isAudioLoading || !musicPrompt.trim()}
                    className={`w-full py-3 px-6 rounded-lg font-medium transition-all ${
                      isAudioLoading || !musicPrompt.trim()
                        ? 'bg-gray-600 text-gray-400 cursor-not-allowed'
                        : 'bg-green-600 text-white hover:bg-green-700'
                    }`}
                  >
                    {isAudioLoading ? 'Generating Music...' : 'Generate Music'}
                  </button>
                </div>
              </div>
              
              {audioResult && (
                <div className="bg-gray-800 rounded-lg p-6">
                  <h3 className="text-lg font-semibold text-white mb-2">🎧 Audio Results</h3>
                  <pre className="text-green-400 whitespace-pre-wrap">{audioResult}</pre>
                </div>
              )}
            </div>
          )}

          {activeTab === 'video' && renderVideoStudio()}
        </div>
      </div>
    </div>
  )
}

export default App
}

export default App
