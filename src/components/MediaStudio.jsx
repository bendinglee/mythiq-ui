import React, { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Image, Sparkles, Download, Eye, Palette, Zap } from 'lucide-react'
import { useApi } from '@/hooks/useApi'

const MediaStudio = () => {
  const [imageDescription, setImageDescription] = useState('')
  const [imageStyle, setImageStyle] = useState('realistic')
  const [imageSize, setImageSize] = useState('1024x1024')
  const { generateImage, isLoading } = useApi()

  const handleGenerateImage = async () => {
    if (!imageDescription.trim()) return
    
    await generateImage({
      description: imageDescription,
      style: imageStyle,
      size: imageSize
    })
  }

  const imageStyles = [
    { id: 'realistic', name: 'Realistic', description: 'Photorealistic images' },
    { id: 'artistic', name: 'Artistic', description: 'Painterly and stylized' },
    { id: 'cartoon', name: 'Cartoon', description: 'Fun and animated style' },
    { id: 'abstract', name: 'Abstract', description: 'Creative and conceptual' },
    { id: 'vintage', name: 'Vintage', description: 'Retro and classic look' },
    { id: 'futuristic', name: 'Futuristic', description: 'Sci-fi and modern' }
  ]

  const imageSizes = [
    { id: '512x512', name: 'Square (512x512)', description: 'Perfect for avatars' },
    { id: '1024x1024', name: 'Large Square (1024x1024)', description: 'High quality square' },
    { id: '1024x768', name: 'Landscape (1024x768)', description: 'Wide format' },
    { id: '768x1024', name: 'Portrait (768x1024)', description: 'Tall format' }
  ]

  const examplePrompts = [
    "A majestic mountain landscape at sunset with golden light",
    "A futuristic city with flying cars and neon lights",
    "A cute cartoon cat wearing a wizard hat and cape",
    "An abstract painting with vibrant colors and flowing shapes"
  ]

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center space-y-4">
        <div className="flex justify-center">
          <div className="w-16 h-16 bg-gradient-to-r from-pink-500 to-purple-500 rounded-full flex items-center justify-center">
            <Image className="w-8 h-8 text-white" />
          </div>
        </div>
        <h2 className="text-3xl font-bold text-white">Media Studio</h2>
        <p className="text-lg text-pink-300">Create stunning images with AI</p>
        <Badge variant="secondary" className="bg-pink-500/20 text-pink-300">
          <Palette className="w-3 h-3 mr-1" />
          Advanced Image Generation
        </Badge>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Image Creation Form */}
        <div className="lg:col-span-2">
          <Card className="bg-slate-800/50 border-slate-700">
            <CardHeader>
              <CardTitle className="text-white">Create Image</CardTitle>
              <CardDescription className="text-slate-400">
                Describe your vision and watch AI bring it to life
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Image Description */}
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  Image Description
                </label>
                <textarea
                  value={imageDescription}
                  onChange={(e) => setImageDescription(e.target.value)}
                  placeholder="Describe the image you want to create..."
                  className="w-full p-3 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-slate-400 resize-none focus:outline-none focus:ring-2 focus:ring-pink-500"
                  rows="4"
                />
              </div>

              {/* Style Selection */}
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-3">
                  Art Style
                </label>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  {imageStyles.map((style) => (
                    <button
                      key={style.id}
                      onClick={() => setImageStyle(style.id)}
                      className={`p-3 rounded-lg border transition-colors ${
                        imageStyle === style.id
                          ? 'bg-pink-600/30 border-pink-500 text-pink-300'
                          : 'bg-slate-700/30 border-slate-600 text-slate-300 hover:bg-slate-700/50'
                      }`}
                    >
                      <div className="font-medium">{style.name}</div>
                      <div className="text-xs opacity-70">{style.description}</div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Size Selection */}
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-3">
                  Image Size
                </label>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {imageSizes.map((size) => (
                    <button
                      key={size.id}
                      onClick={() => setImageSize(size.id)}
                      className={`p-3 rounded-lg border transition-colors ${
                        imageSize === size.id
                          ? 'bg-pink-600/30 border-pink-500 text-pink-300'
                          : 'bg-slate-700/30 border-slate-600 text-slate-300 hover:bg-slate-700/50'
                      }`}
                    >
                      <div className="font-medium">{size.name}</div>
                      <div className="text-xs opacity-70">{size.description}</div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Generate Button */}
              <Button
                onClick={handleGenerateImage}
                disabled={!imageDescription.trim() || isLoading}
                className="w-full bg-pink-600 hover:bg-pink-700 text-white py-3"
              >
                {isLoading ? (
                  <>
                    <Sparkles className="w-4 h-4 mr-2 animate-spin" />
                    Generating Image...
                  </>
                ) : (
                  <>
                    <Image className="w-4 h-4 mr-2" />
                    Generate Image
                  </>
                )}
              </Button>
            </CardContent>
          </Card>

          {/* Generated Image Preview */}
          <Card className="bg-slate-800/50 border-slate-700 mt-6">
            <CardHeader>
              <CardTitle className="text-white">Generated Image</CardTitle>
              <CardDescription className="text-slate-400">
                Your AI-created image will appear here
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-12 text-slate-400">
                <Image className="w-16 h-16 mx-auto mb-4 text-slate-500" />
                <p>Generate an image to see the result</p>
                <p className="text-sm mt-2">High-quality images created with advanced AI technology</p>
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
                Try these creative ideas
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              {examplePrompts.map((prompt, index) => (
                <button
                  key={index}
                  onClick={() => setImageDescription(prompt)}
                  className="w-full text-left p-3 bg-slate-700/30 hover:bg-slate-700/50 rounded-lg text-sm text-slate-300 transition-colors"
                >
                  {prompt}
                </button>
              ))}
            </CardContent>
          </Card>

          {/* Image Features */}
          <Card className="bg-slate-800/50 border-slate-700">
            <CardHeader>
              <CardTitle className="text-white text-lg">Features</CardTitle>
              <CardDescription className="text-slate-400">
                What you get with AI images
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="space-y-2">
                <div className="flex items-center space-x-2">
                  <Zap className="w-4 h-4 text-yellow-500" />
                  <span className="text-sm text-slate-300">Lightning fast generation</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Eye className="w-4 h-4 text-blue-500" />
                  <span className="text-sm text-slate-300">High resolution output</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Palette className="w-4 h-4 text-purple-500" />
                  <span className="text-sm text-slate-300">Multiple art styles</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Download className="w-4 h-4 text-green-500" />
                  <span className="text-sm text-slate-300">Download ready</span>
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
                Download Image
              </Button>
              <Button variant="outline" className="w-full justify-start border-slate-600 text-slate-300">
                <Eye className="w-4 h-4 mr-2" />
                View Full Size
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

export default MediaStudio
