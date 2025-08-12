import React, { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Send, Bot, User, Sparkles, MessageCircle } from 'lucide-react'
import { useChat } from '@/hooks/useApi'

const AIAssistant = () => {
  const [message, setMessage] = useState('')
  const { messages, sendMessage, loading } = useChat()

  const handleSendMessage = async () => {
    if (!message.trim()) return
    
    try {
      await sendMessage(message)
      setMessage('')
    } catch (error) {
      console.error('Failed to send message:', error)
    }
  }

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSendMessage()
    }
  }

  const exampleQuestions = [
    "How do I create a fantasy RPG game?",
    "Generate a logo for my startup",
    "Create ambient music for meditation",
    "What are the latest AI trends?",
    "Help me brainstorm video ideas"
  ]

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center space-y-4">
        <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center mx-auto">
          <Bot className="w-8 h-8 text-white" />
        </div>
        <h2 className="text-3xl font-bold text-white">AI Assistant</h2>
        <p className="text-lg text-purple-300">Your intelligent creative companion</p>
        <Badge variant="secondary" className="bg-purple-500/20 text-purple-300">
          <Sparkles className="w-3 h-3 mr-1" />
          Powered by Advanced AI
        </Badge>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Chat Interface */}
        <div className="lg:col-span-2">
          <Card className="bg-slate-800/50 border-slate-700 h-[600px] flex flex-col">
            <CardHeader>
              <CardTitle className="text-white flex items-center">
                <MessageCircle className="w-5 h-5 mr-2" />
                Chat with AI
              </CardTitle>
              <CardDescription className="text-slate-400">
                Ask anything about creative projects, get instant help
              </CardDescription>
            </CardHeader>
            
            {/* Messages Area */}
            <CardContent className="flex-1 flex flex-col">
              <div className="flex-1 space-y-4 overflow-y-auto mb-4 max-h-[400px]">
                {messages.length === 0 ? (
                  <div className="text-center text-slate-400 pt-8">
                    <Bot className="w-12 h-12 mx-auto mb-4 text-slate-500" />
                    <p>Start a conversation with your AI assistant!</p>
                  </div>
                ) : (
                  messages.map((msg, index) => (
                    <div key={index} className={`flex items-start space-x-2 ${
                      msg.role === 'user' ? 'justify-end' : 'justify-start'
                    }`}>
                      <div className={`flex items-start space-x-2 ${
                        msg.role === 'user' ? 'flex-row-reverse space-x-reverse' : ''
                      }`}>
                        <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                          msg.role === 'assistant' 
                            ? 'bg-purple-500' 
                            : 'bg-slate-700'
                        }`}>
                          {msg.role === 'assistant' ? (
                            <Bot className="w-4 h-4 text-white" />
                          ) : (
                            <User className="w-4 h-4 text-white" />
                          )}
                        </div>
                        <div className={`max-w-[80%] p-3 rounded-lg ${
                          msg.role === 'assistant'
                            ? 'bg-slate-700 text-white'
                            : 'bg-purple-600 text-white'
                        }`}>
                          <p className="text-sm">{msg.content}</p>
                          <p className="text-xs opacity-70 mt-1">{msg.timestamp}</p>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>

              {/* Input Area */}
              <div className="flex space-x-2">
                <div className="flex-1">
                  <textarea
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    onKeyPress={handleKeyPress}
                    placeholder="Ask me anything..."
                    className="w-full p-3 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-slate-400 resize-none"
                    rows="2"
                    disabled={loading}
                  />
                </div>
                <Button
                  onClick={handleSendMessage}
                  disabled={loading || !message.trim()}
                  className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 h-auto"
                >
                  {loading ? (
                    <div className="w-2 h-2 bg-purple-400 rounded-full animate-pulse" />
                  ) : (
                    <Send className="w-4 h-4" />
                  )}
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Example Questions */}
        <div className="space-y-4">
          <Card className="bg-slate-800/50 border-slate-700">
            <CardHeader>
              <CardTitle className="text-white text-lg">Example Questions</CardTitle>
              <CardDescription className="text-slate-400">
                Try these to get started
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-2">
              {exampleQuestions.map((question, index) => (
                <button
                  key={index}
                  onClick={() => setMessage(question)}
                  className="w-full text-left p-3 bg-slate-700/50 hover:bg-slate-700 border border-slate-600 rounded-lg text-sm text-slate-300 hover:text-white transition-colors"
                >
                  {question}
                </button>
              ))}
            </CardContent>
          </Card>

          <Card className="bg-slate-800/50 border-slate-700">
            <CardHeader>
              <CardTitle className="text-white text-lg">AI Capabilities</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                <span className="text-sm text-slate-300">Creative brainstorming</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                <span className="text-sm text-slate-300">Technical guidance</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                <span className="text-sm text-slate-300">Project planning</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                <span className="text-sm text-slate-300">Content optimization</span>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}

export default AIAssistant
