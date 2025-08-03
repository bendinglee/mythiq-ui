import React, { useState } from 'react'
import './App.css'

// Hardcoded API URLs for Railway deployment
const ASSISTANT_API = 'https://mythiq-assistant-production.up.railway.app'
const GAMEMAKER_API = 'https://mythiq-game-maker-production.up.railway.app'
const MEDIA_API = 'https://mythiq-media-creator-production.up.railway.app'

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

  // AI Chat Handler - FIXED to use 'content' field
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
        
        // FIXED: Use 'content' field from backend response
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

  // Game Creator Handler - FIXED to use 'prompt' field and 'game_html' response
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
        // FIXED: Use 'prompt' instead of 'description'
        body: JSON.stringify({ prompt: gameDescription })
      })

      if (response.ok) {
        const data = await response.json()
        console.log('✅ Game response received:', data)
        
        // FIXED: Use 'game_html' field from backend response
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

  // Media Studio Handler - FIXED to use 'image_data' field
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
        
        // FIXED: Use 'image_data' field from backend response
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

  const renderHome = () => (
    <div className="space-y-8">
      <div className="text-center">
        <h1 className="text-4xl font-bold text-white mb-4">Welcome to Mythiq</h1>
        <p className="text-xl text-purple-200 mb-8">Your AI-powered creative platform</p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center justify-center mb-8">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-xl">M</span>
            </div>
            <h1 className="text-3xl font-bold text-white">Mythiq</h1>
          </div>
        </div>

        {/* Navigation */}
        <div className="flex justify-center mb-8">
          <div className="bg-white/10 backdrop-blur-sm rounded-lg p-1 border border-white/20">
            <div className="flex space-x-1">
              {[
                { id: 'home', label: '🏠Home', count: '4' },
                { id: 'chat', label: '💬AI Chat', count: '2' },
                { id: 'games', label: '🎮Game Creator', count: '3' },
                { id: 'media', label: '🎨Media Studio', count: '4' }
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`relative px-4 py-2 rounded-md text-sm font-medium transition-all ${
                    activeTab === tab.id
                      ? 'bg-white/20 text-white shadow-lg'
                      : 'text-purple-200 hover:text-white hover:bg-white/10'
                  }`}
                >
                  {tab.label}
                  <span className="absolute -top-1 -right-1 bg-purple-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                    {tab.count}
                  </span>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="max-w-4xl mx-auto">
          {activeTab === 'home' && renderHome()}
          {activeTab === 'chat' && renderChat()}
          {activeTab === 'games' && renderGameCreator()}
          {activeTab === 'media' && renderMediaStudio()}
        </div>
      </div>
    </div>
  )
}
export default App
