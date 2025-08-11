import { useState, useCallback } from 'react'
import apiService from '@/services/apiService'

export const useApi = () => {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState(null)
  const [chat, setChat] = useState([
    {
      role: 'assistant',
      content: 'Hello! I\'m your AI assistant. How can I help you create something amazing today?',
      timestamp: new Date().toLocaleTimeString()
    }
  ])

  const handleApiCall = useCallback(async (apiCall, onSuccess) => {
    setIsLoading(true)
    setError(null)
    
    try {
      const response = await apiCall()
      
      if (response.success) {
        onSuccess?.(response.data)
        return response.data
      } else {
        throw new Error(response.error || 'API call failed')
      }
    } catch (err) {
      setError(err.message)
      console.error('API Error:', err)
      return null
    } finally {
      setIsLoading(false)
    }
  }, [])

  // Chat functionality
  const sendMessage = useCallback(async (message) => {
    // Add user message immediately
    const userMessage = {
      role: 'user',
      content: message,
      timestamp: new Date().toLocaleTimeString()
    }
    
    setChat(prev => [...prev, userMessage])
    
    // Send to API and get response
    const response = await handleApiCall(
      () => apiService.sendChatMessage(message),
      (data) => {
        const assistantMessage = {
          role: 'assistant',
          content: data.message,
          timestamp: new Date().toLocaleTimeString()
        }
        setChat(prev => [...prev, assistantMessage])
      }
    )
    
    return response
  }, [handleApiCall])

  // Game generation
  const generateGame = useCallback(async (gameData) => {
    return handleApiCall(
      () => apiService.generateGame(gameData),
      (data) => {
        console.log('Game generated:', data)
        // Handle successful game generation
      }
    )
  }, [handleApiCall])

  // Image generation
  const generateImage = useCallback(async (imageData) => {
    return handleApiCall(
      () => apiService.generateImage(imageData),
      (data) => {
        console.log('Image generated:', data)
        // Handle successful image generation
      }
    )
  }, [handleApiCall])

  // Audio generation
  const generateAudio = useCallback(async (audioData) => {
    return handleApiCall(
      () => apiService.generateAudio(audioData),
      (data) => {
        console.log('Audio generated:', data)
        // Handle successful audio generation
      }
    )
  }, [handleApiCall])

  // Video generation
  const generateVideo = useCallback(async (videoData) => {
    return handleApiCall(
      () => apiService.generateVideo(videoData),
      (data) => {
        console.log('Video generated:', data)
        // Handle successful video generation
      }
    )
  }, [handleApiCall])

  // Health check
  const checkHealth = useCallback(async () => {
    return handleApiCall(
      () => apiService.healthCheck(),
      (data) => {
        console.log('Health check:', data)
      }
    )
  }, [handleApiCall])

  return {
    // State
    isLoading,
    error,
    chat,
    
    // Chat functions
    sendMessage,
    
    // Generation functions
    generateGame,
    generateImage,
    generateAudio,
    generateVideo,
    
    // Utility functions
    checkHealth,
    
    // Chat management
    clearChat: () => setChat([{
      role: 'assistant',
      content: 'Hello! I\'m your AI assistant. How can I help you create something amazing today?',
      timestamp: new Date().toLocaleTimeString()
    }]),
    
    // Error management
    clearError: () => setError(null)
  }
}

export default useApi
