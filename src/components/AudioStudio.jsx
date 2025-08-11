import React, { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Music, Mic, Sparkles, Download, Play, Pause, Volume2 } from 'lucide-react'
import { useApi } from '@/hooks/useApi'

const AudioStudio = () => {
  const [audioDescription, setAudioDescription] = useState('')
  const [audioType, setAudioType] = useState('music')
  const [duration, setDuration] = useState('30')
  const [isPlaying, setIsPlaying] = useState(false)
  const { generateAudio, isLoading } = useApi()

  const handleGenerateAudio = async () => {
    if (!audioDescription.trim()) return
    
    await generateAudio({
      description: audioDescription,
      type: audioType,
      duration: duration
    })
  }

  const audioTypes = [
    { id: 'music', name: 'Music', description: 'Background music and songs', icon: Music },
    { id: 'speech', name: 'Speech', description: 'Voice narration and dialogue', icon: Mic },
    { id: 'effects', name: 'Sound Effects', description: 'Audio effects and ambience', icon: Volume2 }
  ]

  const durations = [
    { id: '15', name: '15 seconds', description: 'Short clips' },
    { id: '30', name: '30 seconds', description: 'Standard length' },
    { id: '60', name: '1 minute', description: 'Extended audio' },
    { id: '120', name: '2 minutes', description: 'Long form' }
  ]

  const examplePrompts = [
    "Epic orchestral battle music with dramatic crescendos",
    "Calm ambient nature sounds with birds and flowing water",
    "Upbeat electronic dance music with synthesizers",
    "Professional voice narration for a product demo"
  ]

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center space-y-4">
        <div className="flex justify-center">
          <div className="w-16 h-16 bg-gradient-to-r from-green-500 to-blue-500 rounded-full flex items-center justify-center">
            <Music className="w-8 h-8 text-white" />
          </div>
        </div>
        <h2 className="text-3xl font-bold text-white">Audio Studio</h2>
        <p className="text-lg text-green-300">Create music, speech, and sound effects</p>
        <Badge variant="secondary" className="bg-green-500/20 text-green-300">
          <Volume2 className="w-3 h-3 mr-1" />
          AI Audio Generation
        </Badge>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Audio Creation Form */}
        <div className="lg:col-span-2">
          <Card className="bg-slate-800/50 border-slate-700">
            <CardHeader>
              <CardTitle className="text-white">Create Audio</CardTitle>
              <CardDescription className="text-slate-400">
                Describe the audio you want to generate
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Audio Description */}
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  Audio Description
                </label>
                <textarea
                  value={audioDescription}
                  onChange={(e) => setAudioDescription(e.target.value)}
                  placeholder="Describe the audio you want to create..."
                  className="w-full p-3 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-slate-400 resize-none focus:outline-none focus:ring-2 focus:ring-green-500"
                  rows="4"
                />
              </div>

              {/* Audio Type Selection */}
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-3">
                  Audio Type
                </label>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  {audioTypes.map((type) => {
                    const IconComponent = type.icon
                    return (
                      <button
                        key={type.id}
                        onClick={() => setAudioType(type.id)}
                        className={`p-4 rounded-lg border transition-colors ${
                          audioType === type.id
                            ? 'bg-green-600/30 border-green-500 text-green-300'
                            : 'bg-slate-700/30 border-slate-600 text-slate-300 hover:bg-slate-700/50'
                        }`}
                      >
                        <IconComponent className="w-6 h-6 mx-auto mb-2" />
                        <div className="font-medium">{type.name}</div>
                        <div className="text-xs opacity-70">{type.description}</div>
                      </button>
                    )
                  })}
                </div>
              </div>

              {/* Duration Selection */}
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-3">
                  Duration
                </label>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  {durations.map((dur) => (
                    <button
                      key={dur.id}
                      onClick={() => setDuration(dur.id)}
                      className={`p-3 rounded-lg border transition-colors ${
                        duration === dur.id
                          ? 'bg-green-600/30 border-green-500 text-green-300'
                          : 'bg-slate-700/30 border-slate-600 text-slate-300 hover:bg-slate-700/50'
                      }`}
                    >
                      <div className="font-medium">{dur.name}</div>
                      <div className="text-xs opacity-70">{dur.description}</div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Generate Button */}
              <Button
                onClick={handleGenerateAudio}
                disabled={!audioDescription.trim() || isLoading}
                className="w-full bg-green-600 hover:bg-green-700 text-white py-3"
              >
                {isLoading ? (
                  <>
                    <Sparkles className="w-4 h-4 mr-2 animate-spin" />
                    Generating Audio...
                  </>
                ) : (
                  <>
                    <Music className="w-4 h-4 mr-2" />
                    Generate Audio
                  </>
                )}
              </Button>
            </CardContent>
          </Card>

          {/* Audio Player */}
          <Card className="bg-slate-800/50 border-slate-700 mt-6">
            <CardHeader>
              <CardTitle className="text-white">Audio Player</CardTitle>
              <CardDescription className="text-slate-400">
                Your generated audio will appear here
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-12 text-slate-400">
                <Music className="w-16 h-16 mx-auto mb-4 text-slate-500" />
                <p>Generate audio to see the player</p>
                <p className="text-sm mt-2">High-quality audio created with advanced AI</p>
                
                {/* Mock Audio Player */}
                <div className="mt-8 max-w-md mx-auto">
                  <div className="bg-slate-700/50 rounded-lg p-4">
                    <div className="flex items-center justify-center space-x-4 mb-4">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setIsPlaying(!isPlaying)}
                        className="border-slate-600"
                        disabled
                      >
                        {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                      </Button>
                      <div className="text-sm text-slate-400">00:00 / 00:00</div>
                    </div>
                    <div className="w-full bg-slate-600 rounded-full h-2">
                      <div className="bg-green-500 h-2 rounded-full w-0"></div>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Example Prompts */}
          <Card className="bg-slate-800/50 border-slate-700">
            <CardHeader>
              <CardTitle className="text-white text-lg">Example Prompts</CardTitle>
              <CardDescription className="text-slate-400">
                Try these audio ideas
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              {examplePrompts.map((prompt, index) => (
                <button
                  key={index}
                  onClick={() => setAudioDescription(prompt)}
                  className="w-full text-left p-3 bg-slate-700/30 hover:bg-slate-700/50 rounded-lg text-sm text-slate-300 transition-colors"
                >
                  {prompt}
                </button>
              ))}
            </CardContent>
          </Card>

          {/* Audio Features */}
          <Card className="bg-slate-800/50 border-slate-700">
            <CardHeader>
              <CardTitle className="text-white text-lg">Features</CardTitle>
              <CardDescription className="text-slate-400">
                What you get with AI audio
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="space-y-2">
                <div className="flex items-center space-x-2">
                  <Music className="w-4 h-4 text-green-500" />
                  <span className="text-sm text-slate-300">High-quality audio</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Mic className="w-4 h-4 text-blue-500" />
                  <span className="text-sm text-slate-300">Natural voice synthesis</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Volume2 className="w-4 h-4 text-purple-500" />
                  <span className="text-sm text-slate-300">Custom sound effects</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Download className="w-4 h-4 text-orange-500" />
                  <span className="text-sm text-slate-300">Multiple formats</span>
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
                Download Audio
              </Button>
              <Button variant="outline" className="w-full justify-start border-slate-600 text-slate-300">
                <Play className="w-4 h-4 mr-2" />
                Preview Audio
              </Button>
              <Button variant="outline" className="w-full justify-start border-slate-600 text-slate-300">
                <Sparkles className="w-4 h-4 mr-2" />
                Generate Variations
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}

export default AudioStudio
