import React, { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Image, Download, Sparkles, Palette, Zap } from 'lucide-react'
import { useImageGeneration } from '@/hooks/useApi'

const MediaStudio = () => {
  const [imageData, setImageData] = useState({
    description: '',
    style: 'realistic',
    size: '1024x1024',
    quality: 'high'
  })
  
  const { generatedImage, generateImage, loading, error } = useImageGeneration()

  const handleGenerateImage = async () => {
    if (!imageData.description.trim()) return
    
    try {
      await generateImage(imageData)
    } catch (error) {
      console.error('Failed to generate image:', error)
    }
  }

  const artStyles = [
    { value: 'realistic', label: 'Realistic', description: 'Photorealistic images' },
    { value: 'artistic', label: 'Artistic', description: 'Painterly style' },
    { value: 'cartoon', label: 'Cartoon', description: 'Animated style' },
    { value: 'abstract', label: 'Abstract', description: 'Abstract art' },
    { value: 'vintage', label: 'Vintage', description: 'Retro aesthetic' },
    { value: 'futuristic', label: 'Futuristic', description: 'Sci-fi style' }
  ]

  const imageSizes = [
    { value: '512x512', label: '512×512', description: 'Square small' },
    { value: '1024x1024', label: '1024×1024', description: 'Square large' },
    { value: '1024x768', label: '1024×768', description: 'Landscape' },
    { value: '768x1024', label: '768×1024', description: 'Portrait' }
  ]

  const examplePrompts = [
    "A majestic dragon soaring over a medieval castle at sunset",
    "A futuristic cityscape with flying cars and neon lights",
    "A serene forest path with magical glowing mushrooms",
    "A steampunk airship floating above Victorian London",
    "An underwater palace with coral gardens and tropical fish"
  ]

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center space-y-4">
        <div className="w-16 h-16 bg-gradient-to-r from-pink-500 to-purple-500 rounded-full flex items-center justify-center mx-auto">
          <Image className="w-8 h-8 text-white" />
        </div>
        <h2 className="text-3xl font-bold text-white">Media Studio</h2>
        <p className="text-lg text-pink-300">Create stunning images with AI</p>
        <Badge variant="secondary" className="bg-pink-500/20 text-pink-300">
          <Palette className="w-3 h-3 mr-1" />
          Advanced Image Generation
        </Badge>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Image Configuration */}
        <div className="space-y-6">
          <Card className="bg-slate-800/50 border-slate-700">
            <CardHeader>
              <CardTitle className="text-white">Image Description</CardTitle>
              <CardDescription className="text-slate-400">
                Describe the image you want to create
              </CardDescription>
            </CardHeader>
            <CardContent>
              <textarea
                value={imageData.description}
                onChange={(e) => setImageData({...imageData, description: e.target.value})}
                placeholder="A cute cartoon cat wearing a wizard hat and cape, sitting on a stack of magical books..."
                className="w-full h-32 p-3 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-slate-400 resize-none"
              />
            </CardContent>
          </Card>

          <Card className="bg-slate-800/50 border-slate-700">
            <CardHeader>
              <CardTitle className="text-white">Art Style</CardTitle>
              <CardDescription className="text-slate-400">
                Choose your preferred artistic style
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-3">
                {artStyles.map((style) => (
                  <button
                    key={style.value}
                    onClick={() => setImageData({...imageData, style: style.value})}
                    className={`p-3 rounded-lg border-2 text-left transition-all ${
                      imageData.style === style.value
                        ? 'bg-pink-600 border-pink-500 text-white'
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

          <Card className="bg-slate-800/50 border-slate-700">
            <CardHeader>
              <CardTitle className="text-white">Image Size</CardTitle>
              <CardDescription className="text-slate-400">
                Select dimensions for your image
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-3">
                {imageSizes.map((size) => (
                  <button
                    key={size.value}
                    onClick={() => setImageData({...imageData, size: size.value})}
                    className={`p-3 rounded-lg border-2 text-left transition-all ${
                      imageData.size === size.value
                        ? 'bg-purple-600 border-purple-500 text-white'
                        : 'bg-slate-700 border-slate-600 text-slate-300 hover:border-slate-500'
                    }`}
                  >
                    <div className="font-medium">{size.label}</div>
                    <div className="text-sm opacity-70">{size.description}</div>
                  </button>
                ))}
              </div>
            </CardContent>
          </Card>

          <Button
            onClick={handleGenerateImage}
            disabled={loading || !imageData.description.trim()}
            className="w-full bg-gradient-to-r from-pink-600 to-purple-600 hover:from-pink-700 hover:to-purple-700 text-white py-3"
          >
            {loading ? (
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-pink-400 rounded-full animate-pulse"></div>
                <div className="w-2 h-2 bg-purple-400 rounded-full animate-pulse" style={{animationDelay: '0.2s'}}></div>
                <div className="w-2 h-2 bg-pink-400 rounded-full animate-pulse" style={{animationDelay: '0.4s'}}></div>
                <span>Generating Image...</span>
              </div>
            ) : (
              <div className="flex items-center space-x-2">
                <Sparkles className="w-4 h-4" />
                <span>Generate Image</span>
              </div>
            )}
          </Button>
        </div>

        {/* Image Preview */}
        <div className="space-y-6">
          <Card className="bg-slate-800/50 border-slate-700">
            <CardHeader>
              <CardTitle className="text-white">Generated Image</CardTitle>
              <CardDescription className="text-slate-400">
                Your AI-generated artwork will appear here
              </CardDescription>
            </CardHeader>
            <CardContent>
              {generatedImage ? (
                <div className="space-y-4">
                  <div className="aspect-square bg-slate-900 rounded-lg border-2 border-slate-600 overflow-hidden">
                    <img 
                      src={generatedImage.url} 
                      alt={generatedImage.description}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  
                  <div className="flex space-x-2">
                    <Button className="flex-1 bg-green-600 hover:bg-green-700 text-white">
                      <Download className="w-4 h-4 mr-2" />
                      Download
                    </Button>
                    <Button className="flex-1 bg-blue-600 hover:bg-blue-700 text-white">
                      <Zap className="w-4 h-4 mr-2" />
                      Enhance
                    </Button>
                  </div>

                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div className="bg-slate-700/50 p-3 rounded-lg">
                      <div className="text-slate-400">Style</div>
                      <div className="text-white font-medium capitalize">{generatedImage.style}</div>
                    </div>
                    <div className="bg-slate-700/50 p-3 rounded-lg">
                      <div className="text-slate-400">Size</div>
                      <div className="text-white font-medium">{generatedImage.size}</div>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="aspect-square bg-slate-900 rounded-lg border-2 border-dashed border-slate-600 flex items-center justify-center">
                  <div className="text-center space-y-2">
                    <Image className="w-12 h-12 text-slate-500 mx-auto" />
                    <p className="text-slate-500">Describe your image and click Generate</p>
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
                Click to try these ideas
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-2">
              {examplePrompts.map((prompt, index) => (
                <button
                  key={index}
                  onClick={() => setImageData({...imageData, description: prompt})}
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

export default MediaStudio
