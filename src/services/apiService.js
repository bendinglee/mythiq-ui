// Fixed API Service for Mythiq Platform
// Uses the unified agent gateway instead of individual microservices

class ApiService {
  constructor() {
    // Use the unified agent gateway
    this.baseURL = 'https://mythiq-agent-production.up.railway.app'
    this.headers = {
      'Content-Type': 'application/json',
      'Accept': 'application/json'
    }
  }

  async request(endpoint, options = {}) {
    try {
      const url = `${this.baseURL}${endpoint}`
      const config = {
        headers: this.headers,
        ...options
      }

      const response = await fetch(url, config)
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const data = await response.json()
      return data
    } catch (error) {
      console.error('API request failed:', error)
      throw error
    }
  }

  // Health check
  async checkHealth() {
    return this.request('/health')
  }

  // Chat with AI Assistant
  async chat(message) {
    return this.request('/chat', {
      method: 'POST',
      body: JSON.stringify({ message })
    })
  }

  // Generate game using agent gateway
  async generateGame(gameData) {
    const message = `Create a ${gameData.type || 'puzzle'} game about ${gameData.description}. Make it ${gameData.difficulty || 'medium'} difficulty.`
    
    return this.request('/process', {
      method: 'POST',
      body: JSON.stringify({ message })
    })
  }

  // Generate image using agent gateway
  async generateImage(imageData) {
    const message = `Generate an image: ${imageData.description}. Style: ${imageData.style || 'realistic'}. Size: ${imageData.size || 'medium'}.`
    
    return this.request('/process', {
      method: 'POST',
      body: JSON.stringify({ message })
    })
  }

  // Generate audio using agent gateway
  async generateAudio(audioData) {
    let message
    
    if (audioData.type === 'music') {
      message = `Generate music: ${audioData.description}. Genre: ${audioData.genre || 'ambient'}. Duration: ${audioData.duration || '30'} seconds.`
    } else if (audioData.type === 'speech') {
      message = `Generate speech: "${audioData.text}". Voice: ${audioData.voice || 'female'}. Language: ${audioData.language || 'english'}.`
    } else {
      message = `Generate audio: ${audioData.description}`
    }
    
    return this.request('/process', {
      method: 'POST',
      body: JSON.stringify({ message })
    })
  }

  // Generate video using agent gateway
  async generateVideo(videoData) {
    const message = `Generate a video: ${videoData.description}. Style: ${videoData.style || 'realistic'}. Duration: ${videoData.duration || '10'} seconds.`
    
    return this.request('/process', {
      method: 'POST',
      body: JSON.stringify({ message })
    })
  }

  // Process any message through the agent
  async processMessage(message) {
    return this.request('/process', {
      method: 'POST',
      body: JSON.stringify({ message })
    })
  }
}

// Create singleton instance
const apiService = new ApiService()

export default apiService

// Named exports for specific functions
export const {
  checkHealth,
  chat,
  generateGame,
  generateImage,
  generateAudio,
  generateVideo,
  processMessage
} = apiService
