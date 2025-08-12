// Fixed useApi Hook for Mythiq Platform
// Updated to work with the unified agent gateway

import { useState, useCallback } from 'react'
import apiService from '../services/apiService'

export const useApi = () => {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const makeRequest = useCallback(async (requestFn) => {
    setLoading(true)
    setError(null)
    
    try {
      const result = await requestFn()
      setLoading(false)
      return result
    } catch (err) {
      setError(err.message || 'An error occurred')
      setLoading(false)
      throw err
    }
  }, [])

  return {
    loading,
    error,
    makeRequest
  }
}

// Specific hooks for each feature
export const useChat = () => {
  const [messages, setMessages] = useState([
    { role: 'assistant', content: 'Hello! I\'m your AI assistant. How can I help you today?' }
  ])
  const { loading, error, makeRequest } = useApi()

  const sendMessage = useCallback(async (message) => {
    // Add user message immediately
    setMessages(prev => [...prev, { role: 'user', content: message }])

    try {
      const result = await makeRequest(() => apiService.chat(message))
      
      // Add assistant response
      if (result.success && result.response) {
        const assistantMessage = result.response.result || result.response.message || 'I received your message.'
        setMessages(prev => [...prev, { role: 'assistant', content: assistantMessage }])
      } else {
        throw new Error('No response from assistant')
      }
    } catch (err) {
      // Add error message
      setMessages(prev => [...prev, { 
        role: 'assistant', 
        content: 'Sorry, I encountered an error. Please try again.' 
      }])
    }
  }, [makeRequest])

  return {
    messages,
    sendMessage,
    loading,
    error
  }
}

export const useGameGeneration = () => {
  const [generatedGame, setGeneratedGame] = useState(null)
  const { loading, error, makeRequest } = useApi()

  const generateGame = useCallback(async (gameData) => {
    try {
      const result = await makeRequest(() => apiService.generateGame(gameData))
      
      if (result.success && result.response) {
        setGeneratedGame(result.response.result)
        return result.response.result
      } else {
        throw new Error('Game generation failed')
      }
    } catch (err) {
      setGeneratedGame(null)
      throw err
    }
  }, [makeRequest])

  return {
    generatedGame,
    generateGame,
    loading,
    error
  }
}

export const useImageGeneration = () => {
  const [generatedImage, setGeneratedImage] = useState(null)
  const { loading, error, makeRequest } = useApi()

  const generateImage = useCallback(async (imageData) => {
    try {
      const result = await makeRequest(() => apiService.generateImage(imageData))
      
      if (result.success && result.response) {
        setGeneratedImage(result.response.result)
        return result.response.result
      } else {
        throw new Error('Image generation failed')
      }
    } catch (err) {
      setGeneratedImage(null)
      throw err
    }
  }, [makeRequest])

  return {
    generatedImage,
    generateImage,
    loading,
    error
  }
}

export const useAudioGeneration = () => {
  const [generatedAudio, setGeneratedAudio] = useState(null)
  const { loading, error, makeRequest } = useApi()

  const generateAudio = useCallback(async (audioData) => {
    try {
      const result = await makeRequest(() => apiService.generateAudio(audioData))
      
      if (result.success && result.response) {
        setGeneratedAudio(result.response.result)
        return result.response.result
      } else {
        throw new Error('Audio generation failed')
      }
    } catch (err) {
      setGeneratedAudio(null)
      throw err
    }
  }, [makeRequest])

  return {
    generatedAudio,
    generateAudio,
    loading,
    error
  }
}

export const useVideoGeneration = () => {
  const [generatedVideo, setGeneratedVideo] = useState(null)
  const { loading, error, makeRequest } = useApi()

  const generateVideo = useCallback(async (videoData) => {
    try {
      const result = await makeRequest(() => apiService.generateVideo(videoData))
      
      if (result.success && result.response) {
        setGeneratedVideo(result.response.result)
        return result.response.result
      } else {
        throw new Error('Video generation failed')
      }
    } catch (err) {
      setGeneratedVideo(null)
      throw err
    }
  }, [makeRequest])

  return {
    generatedVideo,
    generateVideo,
    loading,
    error
  }
}

// Health check hook
export const useHealthCheck = () => {
  const [isHealthy, setIsHealthy] = useState(null)
  const { loading, error, makeRequest } = useApi()

  const checkHealth = useCallback(async () => {
    try {
      const result = await makeRequest(() => apiService.checkHealth())
      setIsHealthy(result.status === 'healthy')
      return result
    } catch (err) {
      setIsHealthy(false)
      throw err
    }
  }, [makeRequest])

  return {
    isHealthy,
    checkHealth,
    loading,
    error
  }
}
