import React from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { BarChart3, Users, Zap, TrendingUp, Activity, Star } from 'lucide-react'

const Dashboard = () => {
  const stats = [
    {
      title: "Total Generations",
      value: "2,847",
      change: "+12%",
      icon: Zap,
      color: "text-blue-500"
    },
    {
      title: "Active Users",
      value: "1,234",
      change: "+8%",
      icon: Users,
      color: "text-green-500"
    },
    {
      title: "Success Rate",
      value: "98.5%",
      change: "+2%",
      icon: TrendingUp,
      color: "text-purple-500"
    },
    {
      title: "Avg Response Time",
      value: "1.2s",
      change: "-15%",
      icon: Activity,
      color: "text-orange-500"
    }
  ]

  const recentActivity = [
    { type: "Game", title: "Space Adventure RPG", time: "2 minutes ago", status: "completed" },
    { type: "Image", title: "Fantasy Landscape", time: "5 minutes ago", status: "completed" },
    { type: "Audio", title: "Epic Battle Music", time: "8 minutes ago", status: "completed" },
    { type: "Video", title: "Product Demo", time: "12 minutes ago", status: "processing" },
    { type: "Chat", title: "AI Assistant Query", time: "15 minutes ago", status: "completed" }
  ]

  return (
    <div className="space-y-6">
      {/* Welcome Section */}
      <div className="text-center space-y-4">
        <h2 className="text-4xl font-bold text-white">Welcome to Mythiq</h2>
        <p className="text-xl text-purple-300">Your AI-powered creative platform</p>
        <div className="flex justify-center space-x-2">
          <Badge variant="secondary" className="bg-purple-500/20 text-purple-300">
            <Star className="w-3 h-3 mr-1" />
            Premium Plan
          </Badge>
          <Badge variant="secondary" className="bg-green-500/20 text-green-300">
            All Systems Operational
          </Badge>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <Card key={index} className="bg-slate-800/50 border-slate-700">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-slate-300">
                {stat.title}
              </CardTitle>
              <stat.icon className={`h-4 w-4 ${stat.color}`} />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-white">{stat.value}</div>
              <p className="text-xs text-slate-400">
                <span className="text-green-400">{stat.change}</span> from last month
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Quick Actions */}
        <Card className="bg-slate-800/50 border-slate-700">
          <CardHeader>
            <CardTitle className="text-white">Quick Actions</CardTitle>
            <CardDescription className="text-slate-400">
              Jump into your favorite creative tools
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <button className="p-4 bg-purple-600/20 border border-purple-500/30 rounded-lg hover:bg-purple-600/30 transition-colors">
                <BarChart3 className="w-6 h-6 text-purple-400 mb-2" />
                <div className="text-sm font-medium text-white">Generate Game</div>
              </button>
              <button className="p-4 bg-blue-600/20 border border-blue-500/30 rounded-lg hover:bg-blue-600/30 transition-colors">
                <Zap className="w-6 h-6 text-blue-400 mb-2" />
                <div className="text-sm font-medium text-white">Create Image</div>
              </button>
              <button className="p-4 bg-green-600/20 border border-green-500/30 rounded-lg hover:bg-green-600/30 transition-colors">
                <Activity className="w-6 h-6 text-green-400 mb-2" />
                <div className="text-sm font-medium text-white">Make Audio</div>
              </button>
              <button className="p-4 bg-orange-600/20 border border-orange-500/30 rounded-lg hover:bg-orange-600/30 transition-colors">
                <TrendingUp className="w-6 h-6 text-orange-400 mb-2" />
                <div className="text-sm font-medium text-white">Generate Video</div>
              </button>
            </div>
          </CardContent>
        </Card>

        {/* Recent Activity */}
        <Card className="bg-slate-800/50 border-slate-700">
          <CardHeader>
            <CardTitle className="text-white">Recent Activity</CardTitle>
            <CardDescription className="text-slate-400">
              Your latest creations and interactions
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentActivity.map((activity, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-slate-700/30 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                    <div>
                      <div className="text-sm font-medium text-white">{activity.title}</div>
                      <div className="text-xs text-slate-400">{activity.type} • {activity.time}</div>
                    </div>
                  </div>
                  <Badge 
                    variant={activity.status === 'completed' ? 'default' : 'secondary'}
                    className={activity.status === 'completed' 
                      ? 'bg-green-500/20 text-green-400' 
                      : 'bg-yellow-500/20 text-yellow-400'
                    }
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
            All Mythiq services are running smoothly
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="flex items-center justify-between p-3 bg-slate-700/30 rounded-lg">
              <span className="text-sm text-slate-300">AI Assistant</span>
              <Badge className="bg-green-500/20 text-green-400">Online</Badge>
            </div>
            <div className="flex items-center justify-between p-3 bg-slate-700/30 rounded-lg">
              <span className="text-sm text-slate-300">Media Generation</span>
              <Badge className="bg-green-500/20 text-green-400">Online</Badge>
            </div>
            <div className="flex items-center justify-between p-3 bg-slate-700/30 rounded-lg">
              <span className="text-sm text-slate-300">Game Engine</span>
              <Badge className="bg-green-500/20 text-green-400">Online</Badge>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

export default Dashboard
