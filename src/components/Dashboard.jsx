import React, { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { 
  BarChart3, 
  Users, 
  Zap, 
  TrendingUp, 
  Activity, 
  Clock, 
  Star,
  Gamepad2,
  Image,
  Music,
  Video,
  MessageCircle,
  Sparkles
} from 'lucide-react'

const Dashboard = () => {
  const [stats, setStats] = useState({
    totalGenerations: 1247,
    activeUsers: 89,
    successRate: 94.2,
    avgResponseTime: 2.3
  })

  const [recentActivity, setRecentActivity] = useState([
    { id: 1, type: 'game', title: 'Fantasy RPG Generated', time: '2 minutes ago', status: 'completed' },
    { id: 2, type: 'image', title: 'Dragon Artwork Created', time: '5 minutes ago', status: 'completed' },
    { id: 3, type: 'audio', title: 'Ambient Music Track', time: '8 minutes ago', status: 'completed' },
    { id: 4, type: 'video', title: 'Nature Scene Video', time: '12 minutes ago', status: 'completed' },
    { id: 5, type: 'chat', title: 'AI Assistant Conversation', time: '15 minutes ago', status: 'completed' }
  ])

  const quickActions = [
    { 
      title: 'Create Game', 
      description: 'Generate a new game instantly',
      icon: Gamepad2,
      color: 'from-blue-500 to-purple-500',
      action: 'game'
    },
    { 
      title: 'Generate Image', 
      description: 'Create stunning artwork',
      icon: Image,
      color: 'from-pink-500 to-purple-500',
      action: 'image'
    },
    { 
      title: 'Make Music', 
      description: 'Compose audio tracks',
      icon: Music,
      color: 'from-green-500 to-blue-500',
      action: 'audio'
    },
    { 
      title: 'Create Video', 
      description: 'Generate video content',
      icon: Video,
      color: 'from-red-500 to-pink-500',
      action: 'video'
    }
  ]

  const systemStatus = [
    { service: 'AI Assistant', status: 'operational', uptime: '99.9%' },
    { service: 'Game Creator', status: 'operational', uptime: '99.7%' },
    { service: 'Media Studio', status: 'operational', uptime: '99.8%' },
    { service: 'Audio Studio', status: 'operational', uptime: '99.6%' },
    { service: 'Video Studio', status: 'operational', uptime: '99.5%' }
  ]

  const getActivityIcon = (type) => {
    switch (type) {
      case 'game': return <Gamepad2 className="w-4 h-4" />
      case 'image': return <Image className="w-4 h-4" />
      case 'audio': return <Music className="w-4 h-4" />
      case 'video': return <Video className="w-4 h-4" />
      case 'chat': return <MessageCircle className="w-4 h-4" />
      default: return <Activity className="w-4 h-4" />
    }
  }

  const getActivityColor = (type) => {
    switch (type) {
      case 'game': return 'text-blue-400'
      case 'image': return 'text-pink-400'
      case 'audio': return 'text-green-400'
      case 'video': return 'text-red-400'
      case 'chat': return 'text-purple-400'
      default: return 'text-slate-400'
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center space-y-4">
        <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-blue-500 rounded-full flex items-center justify-center mx-auto">
          <BarChart3 className="w-8 h-8 text-white" />
        </div>
        <h2 className="text-3xl font-bold text-white">Dashboard</h2>
        <p className="text-lg text-purple-300">Your AI creative platform overview</p>
        <Badge variant="secondary" className="bg-purple-500/20 text-purple-300">
          <Sparkles className="w-3 h-3 mr-1" />
          Real-time Analytics
        </Badge>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="bg-slate-800/50 border-slate-700">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-slate-400">Total Generations</CardTitle>
            <Zap className="h-4 w-4 text-yellow-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">{stats.totalGenerations.toLocaleString()}</div>
            <p className="text-xs text-green-400 flex items-center mt-1">
              <TrendingUp className="w-3 h-3 mr-1" />
              +12% from last month
            </p>
          </CardContent>
        </Card>

        <Card className="bg-slate-800/50 border-slate-700">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-slate-400">Active Users</CardTitle>
            <Users className="h-4 w-4 text-blue-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">{stats.activeUsers}</div>
            <p className="text-xs text-green-400 flex items-center mt-1">
              <TrendingUp className="w-3 h-3 mr-1" />
              +8% from yesterday
            </p>
          </CardContent>
        </Card>

        <Card className="bg-slate-800/50 border-slate-700">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-slate-400">Success Rate</CardTitle>
            <Star className="h-4 w-4 text-green-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">{stats.successRate}%</div>
            <p className="text-xs text-green-400 flex items-center mt-1">
              <TrendingUp className="w-3 h-3 mr-1" />
              +2.1% improvement
            </p>
          </CardContent>
        </Card>

        <Card className="bg-slate-800/50 border-slate-700">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-slate-400">Avg Response Time</CardTitle>
            <Clock className="h-4 w-4 text-purple-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">{stats.avgResponseTime}s</div>
            <p className="text-xs text-green-400 flex items-center mt-1">
              <TrendingUp className="w-3 h-3 mr-1" />
              15% faster
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Quick Actions */}
        <Card className="bg-slate-800/50 border-slate-700">
          <CardHeader>
            <CardTitle className="text-white">Quick Actions</CardTitle>
            <CardDescription className="text-slate-400">
              Jump into creating with one click
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {quickActions.map((action, index) => {
              const IconComponent = action.icon
              return (
                <Button
                  key={index}
                  variant="outline"
                  className="w-full justify-start h-auto p-4 border-slate-600 hover:border-slate-500 bg-slate-700/50 hover:bg-slate-700"
                >
                  <div className={`w-10 h-10 rounded-lg bg-gradient-to-r ${action.color} flex items-center justify-center mr-4`}>
                    <IconComponent className="w-5 h-5 text-white" />
                  </div>
                  <div className="text-left">
                    <div className="font-medium text-white">{action.title}</div>
                    <div className="text-sm text-slate-400">{action.description}</div>
                  </div>
                </Button>
              )
            })}
          </CardContent>
        </Card>

        {/* Recent Activity */}
        <Card className="bg-slate-800/50 border-slate-700">
          <CardHeader>
            <CardTitle className="text-white">Recent Activity</CardTitle>
            <CardDescription className="text-slate-400">
              Latest generations and interactions
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentActivity.map((activity) => (
                <div key={activity.id} className="flex items-center space-x-3 p-3 bg-slate-700/30 rounded-lg">
                  <div className={`${getActivityColor(activity.type)}`}>
                    {getActivityIcon(activity.type)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-white truncate">
                      {activity.title}
                    </p>
                    <p className="text-xs text-slate-400">{activity.time}</p>
                  </div>
                  <Badge 
                    variant="secondary" 
                    className="bg-green-500/20 text-green-400 text-xs"
                  >
                    {activity.status}
                  </Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* System Status */}
      <Card className="bg-slate-800/50 border-slate-700">
        <CardHeader>
          <CardTitle className="text-white">System Status</CardTitle>
          <CardDescription className="text-slate-400">
            All services are operational
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
            {systemStatus.map((service, index) => (
              <div key={index} className="bg-slate-700/30 p-4 rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-white">{service.service}</span>
                  <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                </div>
                <div className="text-xs text-slate-400">Uptime: {service.uptime}</div>
                <div className="text-xs text-green-400 capitalize">{service.status}</div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Performance Chart Placeholder */}
      <Card className="bg-slate-800/50 border-slate-700">
        <CardHeader>
          <CardTitle className="text-white">Usage Analytics</CardTitle>
          <CardDescription className="text-slate-400">
            Generation activity over the last 7 days
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-64 bg-slate-900/50 rounded-lg border border-slate-600 flex items-center justify-center">
            <div className="text-center space-y-2">
              <BarChart3 className="w-12 h-12 text-slate-500 mx-auto" />
              <p className="text-slate-500">Analytics chart will be displayed here</p>
              <p className="text-xs text-slate-600">Real-time data visualization</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

export default Dashboard
