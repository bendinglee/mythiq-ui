import React, { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Video, Sparkles, Download, Play, Pause, Film, Camera } from 'lucide-react'
import { useApi } from '@/hooks/useApi'

const VideoStudio = () => {
  const [videoDescription, setVideoDescription] = useState('')
  const [videoStyle, setVideoStyle] = useState('realistic')
  const [videoDuration, setVideoDuration] = useState('10')
  const [isPlaying, setIsPlaying] = useState(false)
  const { generateVideo, isLoading } = useApi()

  const handleGenerateVideo = async () => {
    if (!videoDescription.trim()) return
    
    await generateVideo({
      description: videoDescription,
      style: videoStyle,
      duration: videoDuration
    })
  }

  const videoStyles = [
    { id: 'realistic', name: 'Realistic', description: 'Photorealistic video' },
    { id: 'animated', name: 'Animated', description: 'Cartoon-style animation' },
    { id: 'cinematic', name: 'Cinematic', description: 'Movie-quality footage' },
    { id: 'documentary', name: 'Documentary', description: 'Professional documentary style' },
    { id: 'artistic', name: 'Artistic', description: 'Creative and stylized' },
    { id: 'commercial', name: 'Commercial', description: 'Marketing and promotional' }
  ]

  const durations = [
    { id: '5', name: '5 seconds', description: 'Quick clips' },
    { id: '10', name: '10 seconds', description: 'Standard length' },
    { id: '15', name: '15 seconds', description: 'Extended clips' },
    { id: '30', name: '30 seconds', description: 'Long form' }
  ]

  const examplePrompts = [
    "A time-lapse of a flower blooming in a garden",
    "A futuristic car driving through a neon-lit city at night",
    "A chef preparing a gourmet meal in a professional kitchen",
    "An animated character walking through a magical forest"
  ]

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center space-y-4">
        <div className="flex justify-center">
          <div className="w-16 h-16 bg-gradient-to-r from-red-500 to-purple-500 rounded-full flex items-center justify-center">
            <Video className="w-8 h-8 text-white" />
          </div>
        </div>
        <h2 className="text-3xl font-bold text-white">Video Studio</h2>
        <p className="text-lg text-red-300">Create amazing videos with AI</p>
        <Badge variant="secondary" className="bg-red-500/20 text-red-300">
          <Film className="w-3 h-3 mr-1" />
          AI Video Generation
        </Badge>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Video Creation Form */}
        <div className="lg:col-span-2">
          <Card className="bg-slate-800/50 border-slate-700">
            <CardHeader>
              <CardTitle className="text-white">Create Video</CardTitle>
              <CardDescription className="text-slate-400">
                Describe your video concept and let AI create it
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Video Description */}
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  Video Description
                </label>
                <textarea
                  value={videoDescription}
                  onChange={(e) => setVideoDescription(e.target.value)}
                  placeholder="Describe the video you want to create..."
                  className="w-full p-3 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-slate-400 resize-none focus:outline-none focus:ring-2 focus:ring-red-500"
                  rows="4"
                />
              </div>

              {/* Video Style Selection */}
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-3">
                  Video Style
                </label>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  {videoStyles.map((style) => (
                    <button
                      key={style.id}
                      onClick={() => setVideoStyle(style.id)}
                      className={`p-3 rounded-lg border transition-colors ${
                        videoStyle === style.id
                          ? 'bg-red-600/30 border-red-500 text-red-300'
                          : 'bg-slate-700/30 border-slate-600 text-slate-300 hover:bg-slate-700/50'
                      }`}
                    >
                      <div className="font-medium">{style.name}</div>
                      <div className="text-xs opacity-70">{style.description}</div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Duration Selection */}
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-3">
                  Video Duration
                </label>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  {durations.map((duration) => (
                    <button
                      key={duration.id}
                      onClick={() => setVideoDuration(duration.id)}
                      className={`p-3 rounded-lg border transition-colors ${
                        videoDuration === duration.id
                          ? 'bg-red-600/30 border-red-500 text-red-300'
                          : 'bg-slate-700/30 border-slate-600 text-slate-300 hover:bg-slate-700/50'
                      }`}
                    >
                      <div className="font-medium">{duration.name}</div>
                      <div className="text-xs opacity-70">{duration.description}</div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Generate Button */}
              <Button
                onClick={handleGenerateVideo}
                disabled={!videoDescription.trim() || isLoading}
                className="w-full bg-red-600 hover:bg-red-700 text-white py-3"
              >
                {isLoading ? (
                  <>
                    <Sparkles className="w-4 h-4 mr-2 animate-spin" />
                    Generating Video...
                  </>
                ) : (
                  <>
                    <Video className="w-4 h-4 mr-2" />
                    Generate Video
                  </>
                )}
              </Button>
            </CardContent>
          </Card>

          {/* Video Player */}
          <Card className="bg-slate-800/50 border-slate-700 mt-6">
            <CardHeader>
              <CardTitle className="text-white">Video Player</CardTitle>
              <CardDescription className="text-slate-400">
                Your generated video will appear here
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-12 text-slate-400">
                <Video className="w-16 h-16 mx-auto mb-4 text-slate-500" />
                <p>Generate a video to see the player</p>
                <p className="text-sm mt-2">High-quality videos created with advanced AI</p>
                
                {/* Mock Video Player */}
                <div className="mt-8 max-w-md mx-auto">
                  <div className="bg-slate-700/50 rounded-lg p-4">
                    <div className="aspect-video bg-slate-600 rounded-lg mb-4 flex items-center justify-center">
                      <Camera className="w-12 h-12 text-slate-500" />
                    </div>
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
                      <div className="bg-red-500 h-2 rounded-full w-0"></div>
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
                Try these video ideas
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              {examplePrompts.map((prompt, index) => (
                <button
                  key={index}
                  onClick={() => setVideoDescription(prompt)}
                  className="w-full text-left p-3 bg-slate-700/30 hover:bg-slate-700/50 rounded-lg text-sm text-slate-300 transition-colors"
                >
                  {prompt}
                </button>
              ))}
            </CardContent>
          </Card>

          {/* Video Features */}
          <Card className="bg-slate-800/50 border-slate-700">
            <CardHeader>
              <CardTitle className="text-white text-lg">Features</CardTitle>
              <CardDescription className="text-slate-400">
                What you get with AI videos
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="space-y-2">
                <div className="flex items-center space-x-2">
                  <Video className="w-4 h-4 text-red-500" />
                  <span className="text-sm text-slate-300">HD video quality</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Film className="w-4 h-4 text-purple-500" />
                  <span className="text-sm text-slate-300">Multiple styles</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Camera className="w-4 h-4 text-blue-500" />
                  <span className="text-sm text-slate-300">Professional quality</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Download className="w-4 h-4 text-green-500" />
                  <span className="text-sm text-slate-300">Export ready</span>
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
                Download Video
              </Button>
              <Button variant="outline" className="w-full justify-start border-slate-600 text-slate-300">
                <Play className="w-4 h-4 mr-2" />
                Preview Video
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

export default VideoStudio
