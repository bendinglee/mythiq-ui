import { useState } from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Sparkles, Bot, Gamepad2, Image, Music, Video, BarChart3 } from 'lucide-react'
import Dashboard from './components/Dashboard'
import AIAssistant from './components/AIAssistant'
import GameCreator from './components/GameCreator'
import MediaStudio from './components/MediaStudio'
import AudioStudio from './components/AudioStudio'
import VideoStudio from './components/VideoStudio'
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
          <Badge variant="secondary" className="bg-green-500/20 text-green-400 border-green-500/30">
            ✨ All Systems Operational
          </Badge>
        </div>

        {/* Main Navigation Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-6 bg-slate-800/50 border border-slate-700">
            <TabsTrigger 
              value="dashboard" 
              className="flex items-center space-x-2 data-[state=active]:bg-purple-600 data-[state=active]:text-white"
            >
              <BarChart3 className="w-4 h-4" />
              <span className="hidden sm:inline">Dashboard</span>
            </TabsTrigger>
            <TabsTrigger 
              value="assistant" 
              className="flex items-center space-x-2 data-[state=active]:bg-purple-600 data-[state=active]:text-white"
            >
              <Bot className="w-4 h-4" />
              <span className="hidden sm:inline">AI Assistant</span>
            </TabsTrigger>
            <TabsTrigger 
              value="games" 
              className="flex items-center space-x-2 data-[state=active]:bg-purple-600 data-[state=active]:text-white"
            >
              <Gamepad2 className="w-4 h-4" />
              <span className="hidden sm:inline">Game Creator</span>
            </TabsTrigger>
            <TabsTrigger 
              value="media" 
              className="flex items-center space-x-2 data-[state=active]:bg-purple-600 data-[state=active]:text-white"
            >
              <Image className="w-4 h-4" />
              <span className="hidden sm:inline">Media Studio</span>
            </TabsTrigger>
            <TabsTrigger 
              value="audio" 
              className="flex items-center space-x-2 data-[state=active]:bg-purple-600 data-[state=active]:text-white"
            >
              <Music className="w-4 h-4" />
              <span className="hidden sm:inline">Audio Studio</span>
            </TabsTrigger>
            <TabsTrigger 
              value="video" 
              className="flex items-center space-x-2 data-[state=active]:bg-purple-600 data-[state=active]:text-white"
            >
              <Video className="w-4 h-4" />
              <span className="hidden sm:inline">Video Studio</span>
            </TabsTrigger>
          </TabsList>

          {/* Tab Content */}
          <div className="mt-6">
            <TabsContent value="dashboard" className="space-y-6">
              <Dashboard />
            </TabsContent>

            <TabsContent value="assistant" className="space-y-6">
              <AIAssistant />
            </TabsContent>

            <TabsContent value="games" className="space-y-6">
              <GameCreator />
            </TabsContent>

            <TabsContent value="media" className="space-y-6">
              <MediaStudio />
            </TabsContent>

            <TabsContent value="audio" className="space-y-6">
              <AudioStudio />
            </TabsContent>

            <TabsContent value="video" className="space-y-6">
              <VideoStudio />
            </TabsContent>
          </div>
        </Tabs>
      </div>
    </div>
  )
}

export default App
