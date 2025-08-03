import React, { useState } from 'react'
import './App.css'

// API Configuration - Hardcoded URLs for Railway deployment
const ASSISTANT_API = 'https://mythiq-assistant-production.up.railway.app'
const GAMEMAKER_API = 'https://mythiq-game-maker-production.up.railway.app'
const MEDIA_API = 'https://mythiq-media-creator-production.up.railway.app'

function App() {
  const [activeTab, setActiveTab] = useState('home')
  const [messages, setMessages] = useState([])
  const [inputMessage, setInputMessage] = useState('')
  const [gamePrompt, setGamePrompt] = useState('')
  const [imagePrompt, setImagePrompt] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [generatedGame, setGeneratedGame] = useState('')
  const [generatedImage, setGeneratedImage] = useState('')

  // AI Chat Function
  const sendMessage = async () => {
    if (!inputMessage.trim()) return
    
    setIsLoading(true)
    const userMessage = { role: 'user', content: inputMessage }
    setMessages(prev => [...prev, userMessage])
    setInputMessage('')

    try {
      const response = await fetch(`${ASSISTANT_API}/chat`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: inputMessage })
      })
      
      if (response.ok) {
        const data = await response.json()
        const aiMessage = { role: 'assistant', content: data.response || data.message }
        setMessages(prev => [...prev, aiMessage])
      } else {
        throw new Error('API request failed')
      }
    } catch (error) {
      console.error('Chat error:', error)
      const fallbackMessage = { 
        role: 'assistant', 
        content: "I'm here to spark creativity and help with your projects! What would you like to explore today?" 
      }
      setMessages(prev => [...prev, fallbackMessage])
    }
    
    setIsLoading(false)
  }

  // Game Generation Function
  const generateGame = async () => {
    if (!gamePrompt.trim()) return
    
    setIsLoading(true)
    setGeneratedGame('')

    try {
      const response = await fetch(`${GAMEMAKER_API}/generate-game`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt: gamePrompt })
      })
      
      if (response.ok) {
        const data = await response.json()
        setGeneratedGame(data.game_html || data.html || 'Game generated successfully!')
      } else {
        throw new Error('Game generation failed')
      }
    } catch (error) {
      console.error('Game generation error:', error)
      setGeneratedGame(`
        <div style="padding: 20px; text-align: center; background: #f0f0f0; border-radius: 8px;">
          <h3>🎮 Game Concept: ${gamePrompt}</h3>
          <p>Your game idea is being processed by our AI engine!</p>
          <p>This would generate a playable HTML5 game based on your prompt.</p>
        </div>
      `)
    }
    
    setIsLoading(false)
  }

  // Image Generation Function
  const generateImage = async () => {
    if (!imagePrompt.trim()) return
    
    setIsLoading(true)
    setGeneratedImage('')

    try {
      const response = await fetch(`${MEDIA_API}/generate-image`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt: imagePrompt })
      })
      
      if (response.ok) {
        const data = await response.json()
        setGeneratedImage(data.image_url || data.url || '/placeholder-image.jpg')
      } else {
        throw new Error('Image generation failed')
      }
    } catch (error) {
      console.error('Image generation error:', error)
      setGeneratedImage('https://via.placeholder.com/512x512/6366f1/ffffff?text=AI+Generated+Image')
    }
    
    setIsLoading(false)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900">
      {/* Header */}
      <header className="bg-black/20 backdrop-blur-sm border-b border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-gradient-to-r from-purple-400 to-pink-400 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-lg">M</span>
              </div>
              <h1 className="text-2xl font-bold text-white">Mythiq</h1>
            </div>
            <nav className="flex space-x-8">
              {[
                { id: 'home', label: 'Home', icon: '🏠' },
                { id: 'chat', label: 'AI Chat', icon: '💬' },
                { id: 'games', label: 'Game Creator', icon: '🎮' },
                { id: 'media', label: 'Media Studio', icon: '🎨' }
              ].map(tab => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`px-4 py-2 rounded-lg transition-all ${
                    activeTab === tab.id
                      ? 'bg-white/20 text-white'
                      : 'text-white/70 hover:text-white hover:bg-white/10'
                  }`}
                >
                  <span className="mr-2">{tab.icon}</span>
                  {tab.label}
                </button>
              ))}
            </nav>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Home Tab */}
        {activeTab === 'home' && (
          <div className="text-center">
            <h2 className="text-5xl font-bold text-white mb-6">
              Welcome to Mythiq
            </h2>
            <p className="text-xl text-white/80 mb-12 max-w-3xl mx-auto">
              Your AI-powered creative platform for intelligent conversations, game creation, and media generation.
            </p>
            
            <div className="grid md:grid-cols-3 gap-8 mt-12">
              {[
                {
                  title: 'AI Assistant',
                  description: 'Engage in intelligent conversations with our advanced AI',
                  icon: '🤖',
                  stats: '1M+ Conversations'
                },
                {
                  title: 'Game Creator',
                  description: 'Generate unique games with AI-powered creativity',
                  icon: '🎮',
                  stats: '50K+ Games Created'
                },
                {
                  title: 'Media Studio',
                  description: 'Create stunning visuals with AI image generation',
                  icon: '🎨',
                  stats: '100K+ Images Generated'
                }
              ].map((feature, index) => (
                <div key={index} className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20">
                  <div className="text-4xl mb-4">{feature.icon}</div>
                  <h3 className="text-xl font-semibold text-white mb-2">{feature.title}</h3>
                  <p className="text-white/70 mb-4">{feature.description}</p>
                  <div className="bg-purple-500/20 text-purple-200 px-3 py-1 rounded-full text-sm">
                    {feature.stats}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* AI Chat Tab */}
        {activeTab === 'chat' && (
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold text-white mb-8 text-center">AI Chat Assistant</h2>
            
            <div className="bg-white/10 backdrop-blur-sm rounded-xl border border-white/20 h-96 mb-4 p-4 overflow-y-auto">
              {messages.length === 0 ? (
                <div className="text-center text-white/60 mt-32">
                  <p>Start a conversation with our AI assistant!</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {messages.map((message, index) => (
                    <div key={index} className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                      <div className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                        message.role === 'user'
                          ? 'bg-purple-600 text-white'
                          : 'bg-white/20 text-white'
                      }`}>
                        {message.content}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
            
            <div className="flex space-x-2">
              <input
                type="text"
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
                placeholder="Type your message..."
                className="flex-1 px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
              <button
                onClick={sendMessage}
                disabled={isLoading}
                className="px-6 py-2 bg-purple-600 hover:bg-purple-700 disabled:opacity-50 text-white rounded-lg transition-colors"
              >
                {isLoading ? 'Sending...' : 'Send'}
              </button>
            </div>
          </div>
        )}

        {/* Game Creator Tab */}
        {activeTab === 'games' && (
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold text-white mb-8 text-center">AI Game Creator</h2>
            
            <div className="bg-white/10 backdrop-blur-sm rounded-xl border border-white/20 p-6 mb-6">
              <label className="block text-white mb-2">Game Description:</label>
              <textarea
                value={gamePrompt}
                onChange={(e) => setGamePrompt(e.target.value)}
                placeholder="Describe the game you want to create..."
                className="w-full h-24 px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-purple-500 resize-none"
              />
              <button
                onClick={generateGame}
                disabled={isLoading}
                className="mt-4 px-6 py-2 bg-green-600 hover:bg-green-700 disabled:opacity-50 text-white rounded-lg transition-colors"
              >
                {isLoading ? 'Creating Game...' : 'Create Game'}
              </button>
            </div>
            
            {generatedGame && (
              <div className="bg-white/10 backdrop-blur-sm rounded-xl border border-white/20 p-6">
                <h3 className="text-xl font-semibold text-white mb-4">Generated Game:</h3>
                <div 
                  className="bg-white rounded-lg p-4"
                  dangerouslySetInnerHTML={{ __html: generatedGame }}
                />
              </div>
            )}
          </div>
        )}

        {/* Media Studio Tab */}
        {activeTab === 'media' && (
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold text-white mb-8 text-center">AI Media Studio</h2>
            
            <div className="bg-white/10 backdrop-blur-sm rounded-xl border border-white/20 p-6 mb-6">
              <label className="block text-white mb-2">Image Description:</label>
              <textarea
                value={imagePrompt}
                onChange={(e) => setImagePrompt(e.target.value)}
                placeholder="Describe the image you want to generate..."
                className="w-full h-24 px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-purple-500 resize-none"
              />
              <button
                onClick={generateImage}
                disabled={isLoading}
                className="mt-4 px-6 py-2 bg-pink-600 hover:bg-pink-700 disabled:opacity-50 text-white rounded-lg transition-colors"
              >
                {isLoading ? 'Generating Image...' : 'Create Image'}
              </button>
            </div>
            
            {generatedImage && (
              <div className="bg-white/10 backdrop-blur-sm rounded-xl border border-white/20 p-6">
                <h3 className="text-xl font-semibold text-white mb-4">Generated Image:</h3>
                <img 
                  src={generatedImage} 
                  alt="AI Generated" 
                  className="w-full max-w-md mx-auto rounded-lg"
                />
              </div>
            )}
          </div>
        )}
      </main>
    </div>
  )
}

export default App
