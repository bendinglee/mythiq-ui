import React, { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Gamepad2, Zap, Download, Play, Settings, Sparkles } from 'lucide-react'
import { useGameGeneration } from '@/hooks/useApi'

const GameCreator = () => {
  const [gameData, setGameData] = useState({
    description: '',
    genre: 'rpg',
    difficulty: 'medium',
    style: 'fantasy'
  })
  
  const { generatedGame, generateGame, loading, error } = useGameGeneration()

  const handleGenerateGame = async () => {
    if (!gameData.description.trim()) return
    
    try {
      await generateGame(gameData)
    } catch (error) {
      console.error('Failed to generate game:', error)
    }
  }

  const gameGenres = [
    { value: 'rpg', label: 'RPG', color: 'bg-purple-500' },
    { value: 'platformer', label: 'Platformer', color: 'bg-blue-500' },
    { value: 'puzzle', label: 'Puzzle', color: 'bg-green-500' },
    { value: 'shooter', label: 'Shooter', color: 'bg-red-500' },
    { value: 'strategy', label: 'Strategy', color: 'bg-yellow-500' },
    { value: 'adventure', label: 'Adventure', color: 'bg-indigo-500' }
  ]

  const difficultyLevels = [
    { value: 'easy', label: 'Easy', description: 'Simple mechanics' },
    { value: 'medium', label: 'Medium', description: 'Balanced gameplay' },
    { value: 'hard', label: 'Hard', description: 'Complex systems' }
  ]

  const artStyles = [
    { value: 'fantasy', label: 'Fantasy' },
    { value: 'sci-fi', label: 'Sci-Fi' },
    { value: 'retro', label: 'Retro' },
    { value: 'modern', label: 'Modern' }
  ]

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center space-y-4">
        <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center mx-auto">
          <Gamepad2 className="w-8 h-8 text-white" />
        </div>
        <h2 className="text-3xl font-bold text-white">Ultimate Creator</h2>
        <p className="text-lg text-blue-300">Generate complete playable games instantly</p>
        <Badge variant="secondary" className="bg-blue-500/20 text-blue-300">
          <Zap className="w-3 h-3 mr-1" />
          AI-Powered Game Engine
        </Badge>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Game Configuration */}
        <div className="space-y-6">
          <Card className="bg-slate-800/50 border-slate-700">
            <CardHeader>
              <CardTitle className="text-white">Game Description</CardTitle>
              <CardDescription className="text-slate-400">
                Describe your game idea in detail
              </CardDescription>
            </CardHeader>
            <CardContent>
              <textarea
                value={gameData.description}
                onChange={(e) => setGameData({...gameData, description: e.target.value})}
                placeholder="A fantasy RPG where players explore magical dungeons, collect artifacts, and battle mythical creatures..."
                className="w-full h-32 p-3 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-slate-400 resize-none"
              />
            </CardContent>
          </Card>

          <Card className="bg-slate-800/50 border-slate-700">
            <CardHeader>
              <CardTitle className="text-white">Game Genre</CardTitle>
              <CardDescription className="text-slate-400">
                Choose your game type
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-3">
                {gameGenres.map((genre) => (
                  <button
                    key={genre.value}
                    onClick={() => setGameData({...gameData, genre: genre.value})}
                    className={`p-3 rounded-lg border-2 transition-all ${
                      gameData.genre === genre.value
                        ? `${genre.color} border-white text-white`
                        : 'bg-slate-700 border-slate-600 text-slate-300 hover:border-slate-500'
                    }`}
                  >
                    <div className="font-medium">{genre.label}</div>
                  </button>
                ))}
              </div>
            </CardContent>
          </Card>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card className="bg-slate-800/50 border-slate-700">
              <CardHeader>
                <CardTitle className="text-white text-lg">Difficulty</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {difficultyLevels.map((level) => (
                    <button
                      key={level.value}
                      onClick={() => setGameData({...gameData, difficulty: level.value})}
                      className={`w-full p-3 rounded-lg border text-left transition-all ${
                        gameData.difficulty === level.value
                          ? 'bg-blue-600 border-blue-500 text-white'
                          : 'bg-slate-700 border-slate-600 text-slate-300 hover:border-slate-500'
                      }`}
                    >
                      <div className="font-medium">{level.label}</div>
                      <div className="text-sm opacity-70">{level.description}</div>
                    </button>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card className="bg-slate-800/50 border-slate-700">
              <CardHeader>
                <CardTitle className="text-white text-lg">Art Style</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {artStyles.map((style) => (
                    <button
                      key={style.value}
                      onClick={() => setGameData({...gameData, style: style.value})}
                      className={`w-full p-3 rounded-lg border transition-all ${
                        gameData.style === style.value
                          ? 'bg-purple-600 border-purple-500 text-white'
                          : 'bg-slate-700 border-slate-600 text-slate-300 hover:border-slate-500'
                      }`}
                    >
                      {style.label}
                    </button>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          <Button
            onClick={handleGenerateGame}
            disabled={loading || !gameData.description.trim()}
            className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white py-3"
          >
            {loading ? (
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-blue-400 rounded-full animate-pulse"></div>
                <div className="w-2 h-2 bg-purple-400 rounded-full animate-pulse" style={{animationDelay: '0.2s'}}></div>
                <div className="w-2 h-2 bg-blue-400 rounded-full animate-pulse" style={{animationDelay: '0.4s'}}></div>
                <span>Generating Game...</span>
              </div>
            ) : (
              <div className="flex items-center space-x-2">
                <Sparkles className="w-4 h-4" />
                <span>Generate Game</span>
              </div>
            )}
          </Button>
        </div>

        {/* Game Preview */}
        <div className="space-y-6">
          <Card className="bg-slate-800/50 border-slate-700">
            <CardHeader>
              <CardTitle className="text-white">Game Preview</CardTitle>
              <CardDescription className="text-slate-400">
                Your generated game will appear here
              </CardDescription>
            </CardHeader>
            <CardContent>
              {generatedGame ? (
                <div className="space-y-4">
                  <div className="aspect-video bg-slate-900 rounded-lg border-2 border-slate-600 flex items-center justify-center">
                    <div className="text-center space-y-2">
                      <Gamepad2 className="w-12 h-12 text-blue-400 mx-auto" />
                      <p className="text-white font-medium">{generatedGame.title}</p>
                      <p className="text-slate-400 text-sm">{generatedGame.description}</p>
                    </div>
                  </div>
                  
                  <div className="flex space-x-2">
                    <Button className="flex-1 bg-green-600 hover:bg-green-700 text-white">
                      <Play className="w-4 h-4 mr-2" />
                      Play Game
                    </Button>
                    <Button className="flex-1 bg-blue-600 hover:bg-blue-700 text-white">
                      <Download className="w-4 h-4 mr-2" />
                      Download
                    </Button>
                  </div>

                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div className="bg-slate-700/50 p-3 rounded-lg">
                      <div className="text-slate-400">Genre</div>
                      <div className="text-white font-medium capitalize">{generatedGame.genre}</div>
                    </div>
                    <div className="bg-slate-700/50 p-3 rounded-lg">
                      <div className="text-slate-400">Difficulty</div>
                      <div className="text-white font-medium capitalize">{generatedGame.difficulty}</div>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="aspect-video bg-slate-900 rounded-lg border-2 border-dashed border-slate-600 flex items-center justify-center">
                  <div className="text-center space-y-2">
                    <Settings className="w-12 h-12 text-slate-500 mx-auto" />
                    <p className="text-slate-500">Configure your game and click Generate</p>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {error && (
            <Card className="bg-red-900/20 border-red-700">
              <CardContent className="pt-6">
                <p className="text-red-400">Error: {error}</p>
              </CardContent>
            </Card>
          )}

          <Card className="bg-slate-800/50 border-slate-700">
            <CardHeader>
              <CardTitle className="text-white text-lg">Quick Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <Button 
                variant="outline" 
                className="w-full justify-start border-slate-600 text-slate-300 hover:text-white"
                onClick={() => setGameData({...gameData, description: "A space adventure where players pilot starships through asteroid fields and battle alien fleets"})}
              >
                🚀 Space Adventure
              </Button>
              <Button 
                variant="outline" 
                className="w-full justify-start border-slate-600 text-slate-300 hover:text-white"
                onClick={() => setGameData({...gameData, description: "A medieval fantasy RPG with magic spells, dragon battles, and treasure hunting"})}
              >
                🐉 Fantasy RPG
              </Button>
              <Button 
                variant="outline" 
                className="w-full justify-start border-slate-600 text-slate-300 hover:text-white"
                onClick={() => setGameData({...gameData, description: "A puzzle platformer where players manipulate time to solve challenging levels"})}
              >
                ⏰ Time Puzzle
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}

export default GameCreator
