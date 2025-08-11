import React, { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Gamepad2, Sparkles, Download, Play, Settings, Zap } from 'lucide-react'
import { useApi } from '@/hooks/useApi'

const GameCreator = () => {
  const [gameDescription, setGameDescription] = useState('')
  const [gameType, setGameType] = useState('rpg')
  const [difficulty, setDifficulty] = useState('medium')
  const { generateGame, isLoading } = useApi()

  const handleGenerateGame = async () => {
    if (!gameDescription.trim()) return
    
    await generateGame({
      description: gameDescription,
      type: gameType,
      difficulty: difficulty
    })
  }

  const gameTypes = [
    { id: 'rpg', name: 'RPG', description: 'Role-playing adventure games' },
    { id: 'puzzle', name: 'Puzzle', description: 'Brain-teasing challenges' },
    { id: 'action', name: 'Action', description: 'Fast-paced gameplay' },
    { id: 'strategy', name: 'Strategy', description: 'Tactical thinking games' },
    { id: 'adventure', name: 'Adventure', description: 'Story-driven exploration' },
    { id: 'casual', name: 'Casual', description: 'Easy-to-play games' }
  ]

  const exampleGames = [
    "A space exploration RPG where players discover alien civilizations",
    "A puzzle game about connecting magical crystals to save the kingdom",
    "An action platformer featuring a ninja cat with special abilities",
    "A strategy game about building and managing a futuristic city"
  ]

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center space-y-4">
        <div className="flex justify-center">
          <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center">
            <Gamepad2 className="w-8 h-8 text-white" />
          </div>
        </div>
        <h2 className="text-3xl font-bold text-white">Game Creator</h2>
        <p className="text-lg text-blue-300">Design and generate amazing games with AI</p>
        <Badge variant="secondary" className="bg-blue-500/20 text-blue-300">
          <Zap className="w-3 h-3 mr-1" />
          AI-Powered Game Engine
        </Badge>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Game Creation Form */}
        <div className="lg:col-span-2">
          <Card className="bg-slate-800/50 border-slate-700">
            <CardHeader>
              <CardTitle className="text-white">Create Your Game</CardTitle>
              <CardDescription className="text-slate-400">
                Describe your game idea and let AI bring it to life
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Game Description */}
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  Game Description
                </label>
                <textarea
                  value={gameDescription}
                  onChange={(e) => setGameDescription(e.target.value)}
                  placeholder="Describe your game idea in detail..."
                  className="w-full p-3 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-slate-400 resize-none focus:outline-none focus:ring-2 focus:ring-blue-500"
                  rows="4"
                />
              </div>

              {/* Game Type Selection */}
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-3">
                  Game Type
                </label>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  {gameTypes.map((type) => (
                    <button
                      key={type.id}
                      onClick={() => setGameType(type.id)}
                      className={`p-3 rounded-lg border transition-colors ${
                        gameType === type.id
                          ? 'bg-blue-600/30 border-blue-500 text-blue-300'
                          : 'bg-slate-700/30 border-slate-600 text-slate-300 hover:bg-slate-700/50'
                      }`}
                    >
                      <div className="font-medium">{type.name}</div>
                      <div className="text-xs opacity-70">{type.description}</div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Difficulty Level */}
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-3">
                  Difficulty Level
                </label>
                <div className="flex space-x-3">
                  {['easy', 'medium', 'hard'].map((level) => (
                    <button
                      key={level}
                      onClick={() => setDifficulty(level)}
                      className={`px-4 py-2 rounded-lg border transition-colors ${
                        difficulty === level
                          ? 'bg-blue-600/30 border-blue-500 text-blue-300'
                          : 'bg-slate-700/30 border-slate-600 text-slate-300 hover:bg-slate-700/50'
                      }`}
                    >
                      {level.charAt(0).toUpperCase() + level.slice(1)}
                    </button>
                  ))}
                </div>
              </div>

              {/* Generate Button */}
              <Button
                onClick={handleGenerateGame}
                disabled={!gameDescription.trim() || isLoading}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3"
              >
                {isLoading ? (
                  <>
                    <Sparkles className="w-4 h-4 mr-2 animate-spin" />
                    Generating Game...
                  </>
                ) : (
                  <>
                    <Gamepad2 className="w-4 h-4 mr-2" />
                    Generate Game
                  </>
                )}
              </Button>
            </CardContent>
          </Card>

          {/* Generated Game Preview */}
          <Card className="bg-slate-800/50 border-slate-700 mt-6">
            <CardHeader>
              <CardTitle className="text-white">Game Preview</CardTitle>
              <CardDescription className="text-slate-400">
                Your generated game will appear here
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-12 text-slate-400">
                <Gamepad2 className="w-16 h-16 mx-auto mb-4 text-slate-500" />
                <p>Generate a game to see the preview</p>
                <p className="text-sm mt-2">Your game will include gameplay mechanics, visuals, and interactive elements</p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Example Games */}
          <Card className="bg-slate-800/50 border-slate-700">
            <CardHeader>
              <CardTitle className="text-white text-lg">Example Games</CardTitle>
              <CardDescription className="text-slate-400">
                Try these game ideas
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              {exampleGames.map((game, index) => (
                <button
                  key={index}
                  onClick={() => setGameDescription(game)}
                  className="w-full text-left p-3 bg-slate-700/30 hover:bg-slate-700/50 rounded-lg text-sm text-slate-300 transition-colors"
                >
                  {game}
                </button>
              ))}
            </CardContent>
          </Card>

          {/* Game Features */}
          <Card className="bg-slate-800/50 border-slate-700">
            <CardHeader>
              <CardTitle className="text-white text-lg">Game Features</CardTitle>
              <CardDescription className="text-slate-400">
                What your games include
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="space-y-2">
                <div className="flex items-center space-x-2">
                  <Play className="w-4 h-4 text-green-500" />
                  <span className="text-sm text-slate-300">Interactive gameplay</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Settings className="w-4 h-4 text-blue-500" />
                  <span className="text-sm text-slate-300">Customizable mechanics</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Download className="w-4 h-4 text-purple-500" />
                  <span className="text-sm text-slate-300">Export ready</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Sparkles className="w-4 h-4 text-yellow-500" />
                  <span className="text-sm text-slate-300">AI-generated content</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Quick Actions */}
          <Card className="bg-slate-800/50 border-slate-700">
            <CardHeader>
              <CardTitle className="text-white text-lg">Quick Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button variant="outline" className="w-full justify-start border-slate-600 text-slate-300">
                <Download className="w-4 h-4 mr-2" />
                Export Game
              </Button>
              <Button variant="outline" className="w-full justify-start border-slate-600 text-slate-300">
                <Play className="w-4 h-4 mr-2" />
                Test Game
              </Button>
              <Button variant="outline" className="w-full justify-start border-slate-600 text-slate-300">
                <Settings className="w-4 h-4 mr-2" />
                Game Settings
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}

export default GameCreator
