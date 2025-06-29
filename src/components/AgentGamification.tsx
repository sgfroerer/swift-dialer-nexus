import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Trophy, Target, Zap, Star, Award, TrendingUp, Clock, Phone, CheckCircle } from "lucide-react";
import { contactService } from "@/services/contactService";

interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: React.ReactNode;
  unlocked: boolean;
  progress: number;
  maxProgress: number;
  rarity: 'common' | 'rare' | 'epic' | 'legendary';
}

interface SessionMetrics {
  callsMade: number;
  connected: number;
  streak: number;
  sessionTime: number;
  averageCallDuration: number;
  bestStreak: number;
}

export const AgentGamification = ({ sessionStats }: { sessionStats: any }) => {
  const [achievements, setAchievements] = useState<Achievement[]>([
    {
      id: 'first-call',
      title: 'First Call',
      description: 'Make your first call',
      icon: <Phone className="h-4 w-4" />,
      unlocked: false,
      progress: 0,
      maxProgress: 1,
      rarity: 'common'
    },
    {
      id: 'call-streak-5',
      title: 'Hot Streak',
      description: 'Make 5 calls in a row',
      icon: <Zap className="h-4 w-4" />,
      unlocked: false,
      progress: 0,
      maxProgress: 5,
      rarity: 'rare'
    },
    {
      id: 'connected-10',
      title: 'Connector',
      description: 'Connect with 10 prospects',
      icon: <CheckCircle className="h-4 w-4" />,
      unlocked: false,
      progress: 0,
      maxProgress: 10,
      rarity: 'epic'
    },
    {
      id: 'daily-goal',
      title: 'Daily Champion',
      description: 'Complete 50 calls in one day',
      icon: <Trophy className="h-4 w-4" />,
      unlocked: false,
      progress: 0,
      maxProgress: 50,
      rarity: 'legendary'
    }
  ]);

  const [metrics, setMetrics] = useState<SessionMetrics>({
    callsMade: 0,
    connected: 0,
    streak: 0,
    sessionTime: 0,
    averageCallDuration: 0,
    bestStreak: 0
  });

  const [showConfetti, setShowConfetti] = useState(false);

  useEffect(() => {
    // Update metrics based on session stats
    setMetrics(prev => ({
      ...prev,
      callsMade: sessionStats.callsMade || 0,
      connected: sessionStats.connected || 0,
      sessionTime: sessionStats.startTime ? Math.floor((Date.now() - sessionStats.startTime.getTime()) / 1000) : 0
    }));

    // Check for achievement unlocks
    checkAchievements();
  }, [sessionStats]);

  const checkAchievements = () => {
    setAchievements(prev => prev.map(achievement => {
      let newProgress = achievement.progress;
      let unlocked = achievement.unlocked;

      switch (achievement.id) {
        case 'first-call':
          newProgress = Math.min(sessionStats.callsMade || 0, 1);
          break;
        case 'call-streak-5':
          newProgress = Math.min(metrics.streak, 5);
          break;
        case 'connected-10':
          newProgress = Math.min(sessionStats.connected || 0, 10);
          break;
        case 'daily-goal':
          newProgress = Math.min(sessionStats.callsMade || 0, 50);
          break;
      }

      if (newProgress >= achievement.maxProgress && !unlocked) {
        unlocked = true;
        triggerAchievementUnlock(achievement.title);
      }

      return {
        ...achievement,
        progress: newProgress,
        unlocked
      };
    }));
  };

  const triggerAchievementUnlock = (title: string) => {
    setShowConfetti(true);
    setTimeout(() => setShowConfetti(false), 3000);
  };

  const getRarityColor = (rarity: Achievement['rarity']) => {
    switch (rarity) {
      case 'common': return 'bg-gray-500';
      case 'rare': return 'bg-blue-500';
      case 'epic': return 'bg-purple-500';
      case 'legendary': return 'bg-yellow-500';
      default: return 'bg-gray-500';
    }
  };

  const formatTime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    
    if (hours > 0) {
      return `${hours}h ${minutes}m`;
    }
    return `${minutes}m ${secs}s`;
  };

  const stats = contactService.getStats();
  const totalContacts = stats.contacts.total;
  const completionPercentage = totalContacts > 0 ? ((sessionStats.callsMade || 0) / totalContacts) * 100 : 0;

  return (
    <div className="space-y-4">
      {/* Confetti Effect */}
      {showConfetti && (
        <div className="fixed inset-0 pointer-events-none z-50">
          <div className="absolute inset-0 bg-gradient-to-r from-yellow-400 via-red-500 to-pink-500 opacity-20 animate-pulse" />
          <div className="flex items-center justify-center h-full">
            <div className="text-6xl animate-bounce">🎉</div>
          </div>
        </div>
      )}

      {/* Current Progress */}
      <Card className="bg-gradient-to-r from-blue-50 to-purple-50 border-blue-200">
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center space-x-2 text-lg">
            <Target className="h-5 w-5 text-blue-600" />
            <span>Campaign Progress</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium">Call {sessionStats.callsMade || 0} of {totalContacts}</span>
            <span className="text-sm text-gray-600">{Math.round(completionPercentage)}%</span>
          </div>
          <Progress value={completionPercentage} className="h-3" />
          
          <div className="grid grid-cols-2 gap-4 mt-4">
            <div className="text-center p-3 bg-white rounded-lg border">
              <div className="text-2xl font-bold text-green-600">{sessionStats.connected || 0}</div>
              <div className="text-xs text-gray-600">Connected</div>
            </div>
            <div className="text-center p-3 bg-white rounded-lg border">
              <div className="text-2xl font-bold text-blue-600">
                {sessionStats.callsMade > 0 ? Math.round(((sessionStats.connected || 0) / sessionStats.callsMade) * 100) : 0}%
              </div>
              <div className="text-xs text-gray-600">Success Rate</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Live Metrics */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center space-x-2 text-lg">
            <TrendingUp className="h-5 w-5 text-green-600" />
            <span>Live Metrics</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex justify-between items-center">
            <span className="text-sm text-gray-600">Session Time</span>
            <Badge variant="outline" className="font-mono">
              <Clock className="h-3 w-3 mr-1" />
              {formatTime(metrics.sessionTime)}
            </Badge>
          </div>
          
          <div className="flex justify-between items-center">
            <span className="text-sm text-gray-600">Current Streak</span>
            <Badge variant="outline" className={metrics.streak > 0 ? "bg-orange-50 border-orange-200" : ""}>
              <Zap className="h-3 w-3 mr-1" />
              {metrics.streak}
            </Badge>
          </div>
          
          <div className="flex justify-between items-center">
            <span className="text-sm text-gray-600">Best Streak</span>
            <Badge variant="outline" className="bg-purple-50 border-purple-200">
              <Star className="h-3 w-3 mr-1" />
              {metrics.bestStreak}
            </Badge>
          </div>
        </CardContent>
      </Card>

      {/* Achievements */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center space-x-2 text-lg">
            <Award className="h-5 w-5 text-yellow-600" />
            <span>Achievements</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {achievements.map((achievement) => (
            <div 
              key={achievement.id} 
              className={`p-3 rounded-lg border transition-all duration-200 ${
                achievement.unlocked 
                  ? 'bg-green-50 border-green-200 shadow-sm' 
                  : 'bg-gray-50 border-gray-200'
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center space-x-2">
                  <div className={`p-1 rounded ${achievement.unlocked ? 'bg-green-100' : 'bg-gray-100'}`}>
                    {achievement.icon}
                  </div>
                  <div>
                    <div className="font-medium text-sm">{achievement.title}</div>
                    <div className="text-xs text-gray-600">{achievement.description}</div>
                  </div>
                </div>
                <Badge 
                  variant="outline" 
                  className={`${getRarityColor(achievement.rarity)} text-white border-0 text-xs`}
                >
                  {achievement.rarity}
                </Badge>
              </div>
              
              <div className="space-y-1">
                <div className="flex justify-between text-xs">
                  <span>{achievement.progress}/{achievement.maxProgress}</span>
                  <span>{Math.round((achievement.progress / achievement.maxProgress) * 100)}%</span>
                </div>
                <Progress 
                  value={(achievement.progress / achievement.maxProgress) * 100} 
                  className="h-2"
                />
              </div>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Performance Gauge */}
      <Card className="bg-gradient-to-r from-green-50 to-blue-50 border-green-200">
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center space-x-2 text-lg">
            <Trophy className="h-5 w-5 text-yellow-600" />
            <span>Performance</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center">
            <div className="text-3xl font-bold text-green-600 mb-2">
              {sessionStats.callsMade > 0 ? Math.round(((sessionStats.connected || 0) / sessionStats.callsMade) * 100) : 0}%
            </div>
            <div className="text-sm text-gray-600 mb-4">Connection Rate</div>
            
            <div className="space-y-2">
              {sessionStats.callsMade >= 10 && (
                <Badge className="bg-blue-500">Consistent Caller</Badge>
              )}
              {(sessionStats.connected || 0) >= 5 && (
                <Badge className="bg-green-500">Great Connector</Badge>
              )}
              {metrics.streak >= 3 && (
                <Badge className="bg-orange-500">On Fire!</Badge>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};