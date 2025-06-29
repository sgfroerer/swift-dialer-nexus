import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { Target, TrendingUp, Award, Trophy, ChevronLeft, ChevronRight, ChevronDown, ChevronUp, Clock, Phone, CheckCircle } from "lucide-react";
import { contactService } from "@/services/contactService";

interface GlobalSidebarProps {
  collapsed: boolean;
  onToggle: () => void;
  sessionStats?: {
    callsMade: number;
    connected: number;
    startTime: Date;
  };
}

export const GlobalSidebar = ({ collapsed, onToggle, sessionStats }: GlobalSidebarProps) => {
  const [liveMetricsOpen, setLiveMetricsOpen] = useState(true);
  const [achievementsOpen, setAchievementsOpen] = useState(true);
  const [stats, setStats] = useState(contactService.getStats());

  // Update stats every 5 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setStats(contactService.getStats());
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  const totalContacts = stats.contacts.total;
  const completionPercentage = sessionStats && totalContacts > 0 
    ? ((sessionStats.callsMade || 0) / totalContacts) * 100 
    : 0;

  const formatTime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    
    if (hours > 0) {
      return `${hours}h ${minutes}m`;
    }
    return `${minutes}m ${secs}s`;
  };

  return (
    <div className={`${collapsed ? 'w-20' : 'w-80'} bg-white border-r border-gray-200 transition-all duration-300 ease-in-out flex flex-col flex-shrink-0 fixed left-0 top-0 h-full z-50 shadow-lg`}>
      {/* Sidebar Header */}
      <div className="p-4 border-b border-gray-200 flex items-center justify-between bg-gray-50">
        {!collapsed && (
          <h2 className="font-semibold text-gray-800 text-lg">Campaign Stats</h2>
        )}
        <Button
          variant="ghost"
          size="sm"
          onClick={onToggle}
          className="hover:bg-gray-200 transition-colors"
        >
          {collapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
        </Button>
      </div>

      {/* Sidebar Content */}
      <div className={`flex-1 overflow-y-auto ${collapsed ? 'p-2' : 'p-4'} space-y-4`}>
        {collapsed ? (
          // Collapsed sidebar - icon only view with better spacing
          <div className="space-y-6">
            <div className="flex flex-col items-center space-y-2 p-2">
              <Target className="h-6 w-6 text-blue-600" />
              <div className="text-xs text-center">
                <div className="font-bold text-lg">{sessionStats?.callsMade || 0}</div>
                <div className="text-gray-500 text-xs">Calls</div>
              </div>
            </div>
            
            <div className="flex flex-col items-center space-y-2 p-2">
              <TrendingUp className="h-6 w-6 text-green-600" />
              <div className="text-xs text-center">
                <div className="font-bold text-lg">{sessionStats?.connected || 0}</div>
                <div className="text-gray-500 text-xs">Connected</div>
              </div>
            </div>
            
            <div className="flex flex-col items-center space-y-2 p-2">
              <Award className="h-6 w-6 text-yellow-600" />
              <div className="text-xs text-center">
                <div className="font-bold text-lg">0</div>
                <div className="text-gray-500 text-xs">Achievements</div>
              </div>
            </div>
            
            <div className="flex flex-col items-center space-y-2 p-2">
              <Trophy className="h-6 w-6 text-purple-600" />
              <div className="text-xs text-center">
                <div className="font-bold text-lg">
                  {sessionStats && sessionStats.callsMade > 0 
                    ? Math.round(((sessionStats.connected || 0) / sessionStats.callsMade) * 100) 
                    : 0}%
                </div>
                <div className="text-gray-500 text-xs">Rate</div>
              </div>
            </div>
          </div>
        ) : (
          // Expanded sidebar - full view
          <>
            {/* Campaign Progress */}
            <Card className="bg-gradient-to-r from-blue-50 to-purple-50 border-blue-200">
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center space-x-2 text-lg">
                  <Target className="h-5 w-5 text-blue-600" />
                  <span>Campaign Progress</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">
                    Call {sessionStats?.callsMade || 0} of {totalContacts}
                  </span>
                  <span className="text-sm text-gray-600">{Math.round(completionPercentage)}%</span>
                </div>
                <Progress value={completionPercentage} className="h-3" />
                
                <div className="grid grid-cols-2 gap-4 mt-4">
                  <div className="text-center p-3 bg-white rounded-lg border">
                    <div className="text-2xl font-bold text-green-600">{sessionStats?.connected || 0}</div>
                    <div className="text-xs text-gray-600">Connected</div>
                  </div>
                  <div className="text-center p-3 bg-white rounded-lg border">
                    <div className="text-2xl font-bold text-blue-600">
                      {sessionStats && sessionStats.callsMade > 0 
                        ? Math.round(((sessionStats.connected || 0) / sessionStats.callsMade) * 100) 
                        : 0}%
                    </div>
                    <div className="text-xs text-gray-600">Success Rate</div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Live Metrics - Collapsible */}
            <Collapsible open={liveMetricsOpen} onOpenChange={setLiveMetricsOpen}>
              <Card>
                <CollapsibleTrigger asChild>
                  <CardHeader className="pb-3 cursor-pointer hover:bg-gray-50 transition-colors">
                    <CardTitle className="flex items-center justify-between text-lg">
                      <div className="flex items-center space-x-2">
                        <TrendingUp className="h-5 w-5 text-green-600" />
                        <span>Live Metrics</span>
                      </div>
                      {liveMetricsOpen ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                    </CardTitle>
                  </CardHeader>
                </CollapsibleTrigger>
                <CollapsibleContent>
                  <CardContent className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">Session Time</span>
                      <Badge variant="outline" className="font-mono">
                        <Clock className="h-3 w-3 mr-1" />
                        {sessionStats 
                          ? formatTime(Math.floor((Date.now() - sessionStats.startTime.getTime()) / 1000))
                          : '0m 0s'
                        }
                      </Badge>
                    </div>
                    
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">Current Streak</span>
                      <Badge variant="outline" className="bg-orange-50 border-orange-200">
                        <span className="mr-1">🔥</span>
                        0
                      </Badge>
                    </div>
                    
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">Best Streak</span>
                      <Badge variant="outline" className="bg-purple-50 border-purple-200">
                        <span className="mr-1">⭐</span>
                        0
                      </Badge>
                    </div>
                  </CardContent>
                </CollapsibleContent>
              </Card>
            </Collapsible>

            {/* Achievements - Collapsible */}
            <Collapsible open={achievementsOpen} onOpenChange={setAchievementsOpen}>
              <Card>
                <CollapsibleTrigger asChild>
                  <CardHeader className="pb-3 cursor-pointer hover:bg-gray-50 transition-colors">
                    <CardTitle className="flex items-center justify-between text-lg">
                      <div className="flex items-center space-x-2">
                        <Award className="h-5 w-5 text-yellow-600" />
                        <span>Achievements</span>
                      </div>
                      {achievementsOpen ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                    </CardTitle>
                  </CardHeader>
                </CollapsibleTrigger>
                <CollapsibleContent>
                  <CardContent className="space-y-3">
                    <div className="p-3 rounded-lg border bg-gray-50">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center space-x-2">
                          <div className="p-1 rounded bg-gray-100">
                            <Phone className="h-4 w-4" />
                          </div>
                          <div>
                            <div className="font-medium text-sm">First Call</div>
                            <div className="text-xs text-gray-600">Make your first call</div>
                          </div>
                        </div>
                        <Badge variant="outline" className="bg-gray-500 text-white border-0 text-xs">
                          common
                        </Badge>
                      </div>
                      <div className="space-y-1">
                        <div className="flex justify-between text-xs">
                          <span>0/1</span>
                          <span>0%</span>
                        </div>
                        <Progress value={0} className="h-2" />
                      </div>
                    </div>
                  </CardContent>
                </CollapsibleContent>
              </Card>
            </Collapsible>

            {/* Performance */}
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
                    {sessionStats && sessionStats.callsMade > 0 
                      ? Math.round(((sessionStats.connected || 0) / sessionStats.callsMade) * 100) 
                      : 0}%
                  </div>
                  <div className="text-sm text-gray-600 mb-4">Connection Rate</div>
                  
                  <div className="space-y-2">
                    {sessionStats && sessionStats.callsMade >= 10 && (
                      <Badge className="bg-blue-500">Consistent Caller</Badge>
                    )}
                    {sessionStats && (sessionStats.connected || 0) >= 5 && (
                      <Badge className="bg-green-500">Great Connector</Badge>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          </>
        )}
      </div>
    </div>
  );
};