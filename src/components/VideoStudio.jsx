import React, { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Video, Download, Play, Pause, Film, Sparkles } from 'lucide-react'
import { useVideoGeneration } from '@/hooks/useApi'

const VideoStudio = () => {
  const [videoData, setVideoData] = useState({
    description: '',
    style: 'realistic',
    duration: '5',
    aspect: '16:9'
  })
  
  const [isPlaying, setIsPlaying] = useState(false)
  const { generatedVideo, generateVideo, loading, error } = useVideoGeneration()

  const handleGenerateVideo = async () => {
    if (!videoData.description.trim()) return
    
    try {
      await generateVideo(videoData)
    } catch (error) {
      console.error('Failed to generate video:', error)
    }
  }

  const videoStyles = [
    { value: 'realistic', label: 'Realistic', description: 'Photorealistic footage' },
    { value: 'animated', label: 'Animated', description: 'Cartoon-style animation' },
    { value: 'cinematic', label: 'Cinematic', description: 'Movie-like quality' },
    { value: 'abstract', label: 'Abstract', description: 'Artistic and surreal' },
    { value: 'vintage', label: 'Vintage', description: 'Retro film aesthetic' },
    { value: 'futuristic', label: 'Futuristic', description: 'Sci-fi style' }
  ]

  const durations = [
    { value: '3', label: '3 seconds' },
    { value: '5', label: '5 seconds' },
    { value: '10', label: '10 seconds' },
    { value: '15', label: '15 seconds' }
  ]

  const aspectRatios = [
    { value: '16:9', label: '16:9', description: 'Widescreen' },
    { value: '9:16', label: '9:16', description: 'Vertical/Mobile' },
    { value: '1:1', label: '1:1', description: 'Square' },
    { value: '4:3', label: '4:3', description: 'Classic TV' }
  ]

  const examplePrompts = [
    "A time-lapse of a flower blooming in a garden",
    "A majestic eagle soaring over mountain peaks",
    "Waves crashing against rocky cliffs at sunset",
    "A bustling city street with people walking",
    "Northern lights dancing across a starry sky",
    "A cozy fireplace with flames flickering warmly"
  ]

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center space-y-4">
        <div className="w-16 h-16 bg-gradient-to-r from-red-500 to-pink-500 rounded-full flex items-center justify-center mx-auto">
          <Video className="w-8 h-8 text-white" />
        </div>
        <h2 className="text-3xl font-bold text-white">Video Studio</h2>
        <p className="text-lg text-red-300">Generate stunning videos with AI</p>
        <Badge variant="secondary" className="bg-red-500/20 text-red-300">
          <Film className="w-3 h-3 mr-1" />
          AI Video Generation
        </Badge>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Video Configuration */}
        <div className="space-y-6">
          <Card className="bg-slate-800/50 border-slate-700">
            <CardHeader>
              <CardTitle className="text-white">Video Description</CardTitle>
              <CardDescription className="text-slate-400">
                Describe the video scene you want to create
              </CardDescription>
            </CardHeader>
            <CardContent>
              <textarea
                value={videoData.description}
                onChange={(e) => setVideoData({...videoData, description: e.target.value})}
                placeholder="A peaceful lake surrounded by mountains, with gentle ripples on the water surface and birds flying overhead..."
                className="w-full h-32 p-3 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-slate-400 resize-none"
              />
            </CardContent>
          </Card>

          <Card className="bg-slate-800/50 border-slate-700">
            <CardHeader>
              <CardTitle className="text-white">Video Style</CardTitle>
              <CardDescription className="text-slate-400">
                Choose your preferred visual style
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-3">
                {videoStyles.map((style) => (
                  <button
                    key={style.value}
                    onClick={() => setVideoData({...videoData, style: style.value})}
                    className={`p-3 rounded-lg border-2 text-left transition-all ${
                      videoData.style === style.value
                        ? 'bg-red-600 border-red-500 text-white'
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

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card className="bg-slate-800/50 border-slate-700">
              <CardHeader>
                <CardTitle className="text-white text-lg">Duration</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {durations.map((duration) => (
                    <button
                      key={duration.value}
                      onClick={() => setVideoData({...videoData, duration: duration.value})}
                      className={`w-full p-3 rounded-lg border transition-all ${
                        videoData.duration === duration.value
                          ? 'bg-pink-600 border-pink-500 text-white'
                          : 'bg-slate-700 border-slate-600 text-slate-300 hover:border-slate-500'
                      }`}
                    >
                      {duration.label}
                    </button>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card className="bg-slate-800/50 border-slate-700">
              <CardHeader>
                <CardTitle className="text-white text-lg">Aspect Ratio</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {aspectRatios.map((aspect) => (
                    <button
                      key={aspect.value}
                      onClick={() => setVideoData({...videoData, aspect: aspect.value})}
                      className={`w-full p-3 rounded-lg border text-left transition-all ${
                        videoData.aspect === aspect.value
                          ? 'bg-purple-600 border-purple-500 text-white'
                          : 'bg-slate-700 border-slate-600 text-slate-300 hover:border-slate-500'
                      }`}
                    >
                      <div className="font-medium">{aspect.label}</div>
                      <div className="text-sm opacity-70">{aspect.description}</div>
                    </button>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          <Button
            onClick={handleGenerateVideo}
            disabled={loading || !videoData.description.trim()}
            className="w-full bg-gradient-to-r from-red-600 to-pink-600 hover:from-red-700 hover:to-pink-700 text-white py-3"
          >
            {loading ? (
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-red-400 rounded-full animate-pulse"></div>
                <div className="w-2 h-2 bg-pink-400 rounded-full animate-pulse" style={{animationDelay: '0.2s'}}></div>
                <div className="w-2 h-2 bg-red-400 rounded-full animate-pulse" style={{animationDelay: '0.4s'}}></div>
                <span>Generating Video...</span>
              </div>
            ) : (
              <div className="flex items-center space-x-2">
                <Sparkles className="w-4 h-4" />
                <span>Generate Video</span>
              </div>
            )}
          </Button>
        </div>

        {/* Video Preview */}
        <div className="space-y-6">
          <Card className="bg-slate-800/50 border-slate-700">
            <CardHeader>
              <CardTitle className="text-white">Generated Video</CardTitle>
              <CardDescription className="text-slate-400">
                Your AI-generated video will appear here
              </CardDescription>
            </CardHeader>
            <CardContent>
              {generatedVideo ? (
                <div className="space-y-4">
                  <div className="aspect-video bg-slate-900 rounded-lg border-2 border-slate-600 overflow-hidden relative">
                    <video 
                      src={generatedVideo.url} 
                      className="w-full h-full object-cover"
                      controls={false}
                    />
                    <div className="absolute inset-0 flex items-center justify-center">
                      <Button
                        onClick={() => setIsPlaying(!isPlaying)}
                        className="bg-red-600 hover:bg-red-700 text-white w-16 h-16 rounded-full"
                      >
                        {isPlaying ? <Pause className="w-6 h-6" /> : <Play className="w-6 h-6" />}
                      </Button>
                    </div>
                  </div>
                  
                  <div className="flex space-x-2">
                    <Button className="flex-1 bg-green-600 hover:bg-green-700 text-white">
                      <Download className="w-4 h-4 mr-2" />
                      Download
                    </Button>
                    <Button className="flex-1 bg-blue-600 hover:bg-blue-700 text-white">
                      <Film className="w-4 h-4 mr-2" />
                      Enhance
                    </Button>
                  </div>

                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div className="bg-slate-700/50 p-3 rounded-lg">
                      <div className="text-slate-400">Style</div>
                      <div className="text-white font-medium capitalize">{generatedVideo.style}</div>
                    </div>
                    <div className="bg-slate-700/50 p-3 rounded-lg">
                      <div className="text-slate-400">Duration</div>
                      <div className="text-white font-medium">{generatedVideo.duration}s</div>
                    </div>
                    <div className="bg-slate-700/50 p-3 rounded-lg">
                      <div className="text-slate-400">Aspect</div>
                      <div className="text-white font-medium">{generatedVideo.aspect}</div>
                    </div>
                    <div className="bg-slate-700/50 p-3 rounded-lg">
                      <div className="text-slate-400">Quality</div>
                      <div className="text-white font-medium">HD</div>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="aspect-video bg-slate-900 rounded-lg border-2 border-dashed border-slate-600 flex items-center justify-center">
                  <div className="text-center space-y-2">
                    <Video className="w-12 h-12 text-slate-500 mx-auto" />
                    <p className="text-slate-500">Describe your video and click Generate</p>
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
              <CardTitle className="text-white text-lg">Example Prompts</CardTitle>
              <CardDescription className="text-slate-400">
                Click to try these video ideas
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-2">
              {examplePrompts.map((prompt, index) => (
                <button
                  key={index}
                  onClick={() => setVideoData({...videoData, description: prompt})}
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

export default VideoStudio
