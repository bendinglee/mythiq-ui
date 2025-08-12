import React, { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Music, Mic, Download, Play, Pause, Volume2, Activity } from 'lucide-react'
import { useAudioGeneration } from '@/hooks/useApi'

const AudioStudio = () => {
  const [audioData, setAudioData] = useState({
    description: '',
    type: 'music',
    duration: '30',
    style: 'ambient'
  })
  
  const [isPlaying, setIsPlaying] = useState(false)
  const { generatedAudio, generateAudio, loading, error } = useAudioGeneration()

  const handleGenerateAudio = async () => {
    if (!audioData.description.trim()) return
    
    try {
      await generateAudio(audioData)
    } catch (error) {
      console.error('Failed to generate audio:', error)
    }
  }

  const audioTypes = [
    { value: 'music', label: 'Music', icon: Music, description: 'Background music and melodies' },
    { value: 'speech', label: 'Speech', icon: Mic, description: 'Text-to-speech generation' },
    { value: 'effects', label: 'Sound Effects', icon: Volume2, description: 'Audio effects and ambience' }
  ]

  const musicStyles = [
    { value: 'ambient', label: 'Ambient', description: 'Atmospheric and calming' },
    { value: 'electronic', label: 'Electronic', description: 'Synthesized beats' },
    { value: 'orchestral', label: 'Orchestral', description: 'Classical instruments' },
    { value: 'rock', label: 'Rock', description: 'Guitar-driven energy' },
    { value: 'jazz', label: 'Jazz', description: 'Smooth and sophisticated' },
    { value: 'cinematic', label: 'Cinematic', description: 'Epic and dramatic' }
  ]

  const durations = [
    { value: '15', label: '15 seconds' },
    { value: '30', label: '30 seconds' },
    { value: '60', label: '1 minute' },
    { value: '120', label: '2 minutes' }
  ]

  const examplePrompts = {
    music: [
      "Peaceful piano melody for meditation",
      "Upbeat electronic dance track",
      "Epic orchestral battle theme",
      "Relaxing acoustic guitar ambient"
    ],
    speech: [
      "Welcome to our amazing platform",
      "Thank you for choosing our service",
      "Please follow the instructions carefully",
      "Have a wonderful day ahead"
    ],
    effects: [
      "Rain falling on leaves",
      "Spaceship engine humming",
      "Medieval sword clashing",
      "Ocean waves crashing"
    ]
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center space-y-4">
        <div className="w-16 h-16 bg-gradient-to-r from-green-500 to-blue-500 rounded-full flex items-center justify-center mx-auto">
          <Music className="w-8 h-8 text-white" />
        </div>
        <h2 className="text-3xl font-bold text-white">Audio Studio</h2>
        <p className="text-lg text-green-300">Create music, speech, and sound effects</p>
        <Badge variant="secondary" className="bg-green-500/20 text-green-300">
          <Activity className="w-3 h-3 mr-1" />
          AI Audio Generation
        </Badge>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Audio Configuration */}
        <div className="space-y-6">
          <Card className="bg-slate-800/50 border-slate-700">
            <CardHeader>
              <CardTitle className="text-white">Audio Type</CardTitle>
              <CardDescription className="text-slate-400">
                Choose what type of audio to generate
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 gap-3">
                {audioTypes.map((type) => {
                  const IconComponent = type.icon
                  return (
                    <button
                      key={type.value}
                      onClick={() => setAudioData({...audioData, type: type.value})}
                      className={`p-4 rounded-lg border-2 text-left transition-all ${
                        audioData.type === type.value
                          ? 'bg-green-600 border-green-500 text-white'
                          : 'bg-slate-700 border-slate-600 text-slate-300 hover:border-slate-500'
                      }`}
                    >
                      <div className="flex items-center space-x-3">
                        <IconComponent className="w-5 h-5" />
                        <div>
                          <div className="font-medium">{type.label}</div>
                          <div className="text-sm opacity-70">{type.description}</div>
                        </div>
                      </div>
                    </button>
                  )
                })}
              </div>
            </CardContent>
          </Card>

          <Card className="bg-slate-800/50 border-slate-700">
            <CardHeader>
              <CardTitle className="text-white">Description</CardTitle>
              <CardDescription className="text-slate-400">
                Describe the audio you want to create
              </CardDescription>
            </CardHeader>
            <CardContent>
              <textarea
                value={audioData.description}
                onChange={(e) => setAudioData({...audioData, description: e.target.value})}
                placeholder={
                  audioData.type === 'music' 
                    ? "A peaceful ambient track with soft piano and nature sounds..."
                    : audioData.type === 'speech'
                    ? "Welcome to our platform. We're excited to have you here..."
                    : "The sound of rain falling gently on a forest canopy..."
                }
                className="w-full h-32 p-3 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-slate-400 resize-none"
              />
            </CardContent>
          </Card>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {audioData.type === 'music' && (
              <Card className="bg-slate-800/50 border-slate-700">
                <CardHeader>
                  <CardTitle className="text-white text-lg">Music Style</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {musicStyles.map((style) => (
                      <button
                        key={style.value}
                        onClick={() => setAudioData({...audioData, style: style.value})}
                        className={`w-full p-3 rounded-lg border text-left transition-all ${
                          audioData.style === style.value
                            ? 'bg-blue-600 border-blue-500 text-white'
                            : 'bg-slate-700 border-slate-600 text-slate-300 hover:border-slate-500'
                        }`}
                      >
                        <div className="font-medium">{style.label}</div>
                        <div className="text-sm opacity-70">{style.description}</div>
                      </button>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            <Card className="bg-slate-800/50 border-slate-700">
              <CardHeader>
                <CardTitle className="text-white text-lg">Duration</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {durations.map((duration) => (
                    <button
                      key={duration.value}
                      onClick={() => setAudioData({...audioData, duration: duration.value})}
                      className={`w-full p-3 rounded-lg border transition-all ${
                        audioData.duration === duration.value
                          ? 'bg-purple-600 border-purple-500 text-white'
                          : 'bg-slate-700 border-slate-600 text-slate-300 hover:border-slate-500'
                      }`}
                    >
                      {duration.label}
                    </button>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          <Button
            onClick={handleGenerateAudio}
            disabled={loading || !audioData.description.trim()}
            className="w-full bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700 text-white py-3"
          >
            {loading ? (
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                <div className="w-2 h-2 bg-blue-400 rounded-full animate-pulse" style={{animationDelay: '0.2s'}}></div>
                <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" style={{animationDelay: '0.4s'}}></div>
                <span>Generating Audio...</span>
              </div>
            ) : (
              <div className="flex items-center space-x-2">
                <Music className="w-4 h-4" />
                <span>Generate Audio</span>
              </div>
            )}
          </Button>
        </div>

        {/* Audio Preview */}
        <div className="space-y-6">
          <Card className="bg-slate-800/50 border-slate-700">
            <CardHeader>
              <CardTitle className="text-white">Generated Audio</CardTitle>
              <CardDescription className="text-slate-400">
                Your AI-generated audio will appear here
              </CardDescription>
            </CardHeader>
            <CardContent>
              {generatedAudio ? (
                <div className="space-y-4">
                  <div className="bg-slate-900 rounded-lg border-2 border-slate-600 p-6">
                    <div className="flex items-center justify-center space-x-4 mb-4">
                      <Button
                        onClick={() => setIsPlaying(!isPlaying)}
                        className="bg-green-600 hover:bg-green-700 text-white w-12 h-12 rounded-full"
                      >
                        {isPlaying ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5" />}
                      </Button>
                      <div className="flex-1">
                        <div className="h-2 bg-slate-700 rounded-full overflow-hidden">
                          <div className="h-full bg-gradient-to-r from-green-500 to-blue-500 w-1/3 rounded-full"></div>
                        </div>
                      </div>
                      <span className="text-slate-400 text-sm">0:15 / 0:30</span>
                    </div>
                    
                    <div className="text-center">
                      <p className="text-white font-medium">{generatedAudio.title}</p>
                      <p className="text-slate-400 text-sm">{generatedAudio.description}</p>
                    </div>
                  </div>
                  
                  <div className="flex space-x-2">
                    <Button className="flex-1 bg-blue-600 hover:bg-blue-700 text-white">
                      <Download className="w-4 h-4 mr-2" />
                      Download
                    </Button>
                    <Button className="flex-1 bg-purple-600 hover:bg-purple-700 text-white">
                      <Volume2 className="w-4 h-4 mr-2" />
                      Enhance
                    </Button>
                  </div>

                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div className="bg-slate-700/50 p-3 rounded-lg">
                      <div className="text-slate-400">Type</div>
                      <div className="text-white font-medium capitalize">{generatedAudio.type}</div>
                    </div>
                    <div className="bg-slate-700/50 p-3 rounded-lg">
                      <div className="text-slate-400">Duration</div>
                      <div className="text-white font-medium">{generatedAudio.duration}s</div>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="bg-slate-900 rounded-lg border-2 border-dashed border-slate-600 p-8 text-center">
                  <Music className="w-12 h-12 text-slate-500 mx-auto mb-4" />
                  <p className="text-slate-500">Configure your audio and click Generate</p>
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
              <CardDescription className="text-slate-400">
                Try these example prompts
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-2">
              {examplePrompts[audioData.type]?.map((prompt, index) => (
                <button
                  key={index}
                  onClick={() => setAudioData({...audioData, description: prompt})}
                  className="w-full text-left p-3 bg-slate-700/50 hover:bg-slate-700 border border-slate-600 rounded-lg text-sm text-slate-300 hover:text-white transition-colors"
                >
                  {prompt}
                </button>
              ))}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}

export default AudioStudio
