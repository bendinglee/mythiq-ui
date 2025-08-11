import { useState } from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Sparkles, Bot, Gamepad2, Image, Music, Video, BarChart3 } from 'lucide-react'
import Dashboard from './components/Dashboard.jsx'
import AIAssistant from './components/AIAssistant.jsx'
import GameCreator from './components/GameCreator.jsx'
import MediaStudio from './components/MediaStudio.jsx'
import AudioStudio from './components/AudioStudio.jsx'
import VideoStudio from './components/VideoStudio.jsx'
import './App.css'

function App() {
  const [activeTab, setActiveTab] = useState('dashboard')

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      <div className="container mx-auto px-4 py-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg flex items-center justify-center">
              <Sparkles className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-white">Mythiq</h1>
              <p className="text-purple-300">AI Creative Platform</p>
            </div>
          </div>
          <Badge variant="secondary" className="bg-purple-500/20 text-purple-300">
            <Bot className="w-3 h-3 mr-1" />
            AI Powered
          </Badge>
        </div>

        {/* Main Content */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-6 bg-slate-800/50 border-slate-700">
            <TabsTrigger 
              value="dashboard" 
              className="data-[state=active]:bg-purple-600 data-[state=active]:text-white"
            >
              <BarChart3 className="w-4 h-4 mr-2" />
              Dashboard
            </TabsTrigger>
            <TabsTrigger 
              value="ai-assistant" 
              className="data-[state=active]:bg-blue-600 data-[state=active]:text-white"
            >
              <Bot className="w-4 h-4 mr-2" />
              AI Assistant
            </TabsTrigger>
            <TabsTrigger 
              value="game-creator" 
              className="data-[state=active]:bg-green-600 data-[state=active]:text-white"
            >
              <Gamepad2 className="w-4 h-4 mr-2" />
              Ultimate Creator
            </TabsTrigger>
            <TabsTrigger 
              value="media-studio" 
              className="data-[state=active]:bg-pink-600 data-[state=active]:text-white"
            >
              <Image className="w-4 h-4 mr-2" />
              Media Studio
            </TabsTrigger>
            <TabsTrigger 
              value="audio-studio" 
              className="data-[state=active]:bg-yellow-600 data-[state=active]:text-white"
            >
              <Music className="w-4 h-4 mr-2" />
              Audio Studio
            </TabsTrigger>
            <TabsTrigger 
              value="video-studio" 
              className="data-[state=active]:bg-red-600 data-[state=active]:text-white"
            >
              <Video className="w-4 h-4 mr-2" />
              Video Studio
            </TabsTrigger>
          </TabsList>

          <div className="mt-6">
            <TabsContent value="dashboard" className="space-y-6">
              <Dashboard />
            </TabsContent>

            <TabsContent value="ai-assistant" className="space-y-6">
              <AIAssistant />
            </TabsContent>

            <TabsContent value="game-creator" className="space-y-6">
              <GameCreator />
            </TabsContent>

            <TabsContent value="media-studio" className="space-y-6">
              <MediaStudio />
            </TabsContent>

            <TabsContent value="audio-studio" className="space-y-6">
              <AudioStudio />
            </TabsContent>

            <TabsContent value="video-studio" className="space-y-6">
              <VideoStudio />
            </TabsContent>
          </div>
        </Tabs>
      </div>
    </div>
  )
}

export default App
