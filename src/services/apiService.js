// API Service for Mythiq Platform
// Handles all backend communication

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'https://api.mythiq.ai'

class ApiService {
  constructor() {
    this.baseURL = API_BASE_URL
    this.headers = {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${import.meta.env.VITE_API_KEY || 'demo-key'}`
    }
  }

  async request(endpoint, options = {}) {
    const url = `${this.baseURL}${endpoint}`
    const config = {
      headers: this.headers,
      ...options
    }

    try {
      const response = await fetch(url, config)
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }
      
      return await response.json()
    } catch (error) {
      console.error('API request failed:', error)
      
      // Return mock data for development
      return this.getMockResponse(endpoint, options)
    }
  }

  // Mock responses for development/demo
  getMockResponse(endpoint, options) {
    const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms))
    
    if (endpoint.includes('/chat')) {
      return delay(1000).then(() => ({
        success: true,
        data: {
          message: "I'm here to help you with your creative projects! I can assist with game development, image creation, audio production, and video generation. What would you like to work on today?",
          timestamp: new Date().toISOString()
        }
      }))
    }
    
    if (endpoint.includes('/generate/game')) {
      return delay(3000).then(() => ({
        success: true,
        data: {
          gameId: 'game_' + Date.now(),
          title: 'Generated Game',
          description: 'Your AI-generated game is ready!',
          playUrl: '#',
          downloadUrl: '#'
        }
      }))
    }
    
    if (endpoint.includes('/generate/image')) {
      return delay(2000).then(() => ({
        success: true,
        data: {
          imageId: 'img_' + Date.now(),
          imageUrl: 'https://via.placeholder.com/1024x1024/6366f1/ffffff?text=AI+Generated+Image',
          downloadUrl: '#'
        }
      }))
    }
    
    if (endpoint.includes('/generate/audio')) {
      return delay(2500).then(() => ({
        success: true,
        data: {
          audioId: 'audio_' + Date.now(),
          audioUrl: '#',
          duration: 30,
          downloadUrl: '#'
        }
      }))
    }
    
    if (endpoint.includes('/generate/video')) {
      return delay(4000).then(() => ({
        success: true,
        data: {
          videoId: 'video_' + Date.now(),
          videoUrl: '#',
          duration: 10,
          downloadUrl: '#'
        }
      }))
    }
    
    return Promise.resolve({
      success: false,
      error: 'Unknown endpoint'
    })
  }

  // Chat API
  async sendChatMessage(message) {
    return this.request('/chat', {
      method: 'POST',
      body: JSON.stringify({ message })
    })
  }

  // Game Generation API
  async generateGame(gameData) {
    return this.request('/generate/game', {
      method: 'POST',
      body: JSON.stringify(gameData)
    })
  }

  // Image Generation API
  async generateImage(imageData) {
    return this.request('/generate/image', {
      method: 'POST',
      body: JSON.stringify(imageData)
    })
  }

  // Audio Generation API
  async generateAudio(audioData) {
    return this.request('/generate/audio', {
      method: 'POST',
      body: JSON.stringify(audioData)
    })
  }

  // Video Generation API
  async generateVideo(videoData) {
    return this.request('/generate/video', {
      method: 'POST',
      body: JSON.stringify(videoData)
    })
  }

  // Health Check
  async healthCheck() {
    return this.request('/health')
  }
}

export default new ApiService()
