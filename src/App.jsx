import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { MessageCircle, Gamepad2, Image, Video, Music, Sparkles, Users, Zap, TrendingUp } from 'lucide-react'
import './App.css'

function App() {
  const [activeTab, setActiveTab] = useState('home')

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-2 mb-4">
            <Sparkles className="h-8 w-8 text-purple-400" />
            <h1 className="text-4xl font-bold text-white">Mythiq AI</h1>
          </div>
          <p className="text-xl text-purple-200 mb-4">Your all-in-one creative platform powered by advanced AI</p>
          <Badge variant="secondary" className="bg-green-500/20 text-green-400 border-green-500/30">
            All Services Online
          </Badge>
        </div>

        {/* Navigation Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-4 mb-8 bg-white/10 backdrop-blur-sm">
            <TabsTrigger value="home" className="data-[state=active]:bg-purple-500 data-[state=active]:text-white">
              <Sparkles className="h-4 w-4 mr-2" />
              Home
            </TabsTrigger>
            <TabsTrigger value="chat" className="data-[state=active]:bg-purple-500 data-[state=active]:text-white">
              <MessageCircle className="h-4 w-4 mr-2" />
              AI Chat
            </TabsTrigger>
            <TabsTrigger value="games" className="data-[state=active]:bg-purple-500 data-[state=active]:text-white">
              <Gamepad2 className="h-4 w-4 mr-2" />
              Game Creator
            </TabsTrigger>
            <TabsTrigger value="media" className="data-[state=active]:bg-purple-500 data-[state=active]:text-white">
              <Image className="h-4 w-4 mr-2" />
              Media Studio
            </TabsTrigger>
          </TabsList>

          {/* Home Tab */}
          <TabsContent value="home" className="space-y-6">
            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
              <Card className="bg-white/10 backdrop-blur-sm border-white/20">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium text-white">Total Creations</CardTitle>
                  <TrendingUp className="h-4 w-4 text-purple-400" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-white">1,247</div>
                  <p className="text-xs text-purple-200">+12% from last month</p>
                </CardContent>
              </Card>
              <Card className="bg-white/10 backdrop-blur-sm border-white/20">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium text-white">Games Created</CardTitle>
                  <Gamepad2 className="h-4 w-4 text-green-400" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-white">342</div>
                  <p className="text-xs text-green-200">+8% from last month</p>
                </CardContent>
              </Card>
              <Card className="bg-white/10 backdrop-blur-sm border-white/20">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium text-white">Media Generated</CardTitle>
                  <Image className="h-4 w-4 text-blue-400" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-white">756</div>
                  <p className="text-xs text-blue-200">+15% from last month</p>
                </CardContent>
              </Card>
              <Card className="bg-white/10 backdrop-blur-sm border-white/20">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium text-white">Chat Sessions</CardTitle>
                  <MessageCircle className="h-4 w-4 text-yellow-400" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-white">2,149</div>
                  <p className="text-xs text-yellow-200">+23% from last month</p>
                </CardContent>
              </Card>
            </div>

            {/* Feature Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card className="bg-white/10 backdrop-blur-sm border-white/20 hover:bg-white/15 transition-all duration-300">
                <CardHeader>
                  <div className="flex items-center gap-2">
                    <MessageCircle className="h-6 w-6 text-purple-400" />
                    <CardTitle className="text-white">AI Assistant</CardTitle>
                    <Badge variant="secondary" className="bg-green-500/20 text-green-400 border-green-500/30 ml-auto">
                      Online
                    </Badge>
                  </div>
                  <CardDescription className="text-purple-200">
                    Intelligent conversation and creative guidance
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-purple-100 mb-4">
                    Chat with our advanced AI for creative inspiration, technical help, and project guidance.
                  </p>
                  <Button className="w-full bg-purple-600 hover:bg-purple-700">
                    Start Chatting
                  </Button>
                </CardContent>
              </Card>

              <Card className="bg-white/10 backdrop-blur-sm border-white/20 hover:bg-white/15 transition-all duration-300">
                <CardHeader>
                  <div className="flex items-center gap-2">
                    <Gamepad2 className="h-6 w-6 text-green-400" />
                    <CardTitle className="text-white">Game Creator</CardTitle>
                    <Badge variant="secondary" className="bg-green-500/20 text-green-400 border-green-500/30 ml-auto">
                      Online
                    </Badge>
                  </div>
                  <CardDescription className="text-green-200">
                    Generate playable games from simple descriptions
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-green-100 mb-4">
                    Create platformers, puzzles, RPGs, and more with our AI game generation engine.
                  </p>
                  <Button className="w-full bg-green-600 hover:bg-green-700">
                    Create Game
                  </Button>
                </CardContent>
              </Card>

              <Card className="bg-white/10 backdrop-blur-sm border-white/20 hover:bg-white/15 transition-all duration-300">
                <CardHeader>
                  <div className="flex items-center gap-2">
                    <Image className="h-6 w-6 text-blue-400" />
                    <CardTitle className="text-white">Media Studio</CardTitle>
                    <Badge variant="secondary" className="bg-green-500/20 text-green-400 border-green-500/30 ml-auto">
                      Online
                    </Badge>
                  </div>
                  <CardDescription className="text-blue-200">
                    Generate images, videos, and audio content
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-blue-100 mb-4">
                    Create stunning visuals, animations, and soundtracks for your projects.
                  </p>
                  <Button className="w-full bg-blue-600 hover:bg-blue-700">
                    Create Media
                  </Button>
                </CardContent>
              </Card>
            </div>

            {/* Quick Start Examples */}
            <Card className="bg-white/10 backdrop-blur-sm border-white/20">
              <CardHeader>
                <CardTitle className="text-white">Quick Start Examples</CardTitle>
                <CardDescription className="text-purple-200">
                  Try these prompts to get started with Mythiq AI
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <h4 className="font-semibold text-purple-300">💬 Chat Examples</h4>
                    <div className="space-y-1 text-sm text-purple-100">
                      <p>"Help me brainstorm game ideas"</p>
                      <p>"Explain game development basics"</p>
                      <p>"What makes a good user interface?"</p>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <h4 className="font-semibold text-green-300">🎮 Game Examples</h4>
                    <div className="space-y-1 text-sm text-green-100">
                      <p>"Create a ninja platformer game"</p>
                      <p>"Make a space puzzle adventure"</p>
                      <p>"Build a medieval RPG quest"</p>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <h4 className="font-semibold text-blue-300">🎨 Media Examples</h4>
                    <div className="space-y-1 text-sm text-blue-100">
                      <p>"Generate a fantasy character"</p>
                      <p>"Create epic battle music"</p>
                      <p>"Make a walking animation"</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* AI Chat Tab */}
          <TabsContent value="chat" className="space-y-6">
            <Card className="bg-white/10 backdrop-blur-sm border-white/20">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <MessageCircle className="h-5 w-5" />
                  AI Chat Assistant
                </CardTitle>
                <CardDescription className="text-purple-200">
                  Intelligent conversation and creative guidance
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-center py-12">
                  <MessageCircle className="h-16 w-16 text-purple-400 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold text-white mb-2">Chat Interface Coming Soon</h3>
                  <p className="text-purple-200 mb-6">
                    Real-time chat with our advanced AI assistant will be available here.
                  </p>
                  <Button className="bg-purple-600 hover:bg-purple-700">
                    <Zap className="h-4 w-4 mr-2" />
                    Enable Chat Interface
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Game Creator Tab */}
          <TabsContent value="games" className="space-y-6">
            <Card className="bg-white/10 backdrop-blur-sm border-white/20">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <Gamepad2 className="h-5 w-5" />
                  Game Creator Studio
                </CardTitle>
                <CardDescription className="text-green-200">
                  Generate playable games from simple descriptions
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-center py-12">
                  <Gamepad2 className="h-16 w-16 text-green-400 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold text-white mb-2">Game Creation Tools Coming Soon</h3>
                  <p className="text-green-200 mb-6">
                    Advanced game generation interface with live preview will be available here.
                  </p>
                  <Button className="bg-green-600 hover:bg-green-700">
                    <Zap className="h-4 w-4 mr-2" />
                    Enable Game Creator
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Media Studio Tab */}
          <TabsContent value="media" className="space-y-6">
            <Card className="bg-white/10 backdrop-blur-sm border-white/20">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <Image className="h-5 w-5" />
                  Media Creation Studio
                </CardTitle>
                <CardDescription className="text-blue-200">
                  Generate images, videos, and audio content
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                  <div className="text-center">
                    <Image className="h-12 w-12 text-blue-400 mx-auto mb-2" />
                    <h4 className="font-semibold text-white">Images</h4>
                    <p className="text-sm text-blue-200">Generate stunning visuals</p>
                  </div>
                  <div className="text-center">
                    <Video className="h-12 w-12 text-purple-400 mx-auto mb-2" />
                    <h4 className="font-semibold text-white">Videos</h4>
                    <p className="text-sm text-purple-200">Create animations</p>
                  </div>
                  <div className="text-center">
                    <Music className="h-12 w-12 text-yellow-400 mx-auto mb-2" />
                    <h4 className="font-semibold text-white">Audio</h4>
                    <p className="text-sm text-yellow-200">Generate soundtracks</p>
                  </div>
                </div>
                <div className="text-center">
                  <h3 className="text-xl font-semibold text-white mb-2">Media Studio Coming Soon</h3>
                  <p className="text-blue-200 mb-6">
                    Advanced media generation tools with live preview will be available here.
                  </p>
                  <Button className="bg-blue-600 hover:bg-blue-700">
                    <Zap className="h-4 w-4 mr-2" />
                    Enable Media Studio
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}

export default App
