import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line } from "recharts";
import { Play, Pause, Square, Users, Phone, Clock, TrendingUp, Target, CheckCircle, XCircle, Eye, Loader2, TrendingDown } from "lucide-react";
import { contactService } from "@/services/contactService";
import { useToast } from "@/hooks/use-toast";

interface Campaign {
  id: string;
  name: string;
  status: "active" | "paused" | "completed";
  contacts: number;
  completed: number;
  connected: number;
  dialingMode: "predictive" | "adaptive" | "preview";
  startDate: Date;
  endDate?: Date;
  description: string;
  targetCallsPerDay: number;
  averageCallDuration: number;
}

export const CampaignDashboard = () => {
  const [campaigns, setCampaigns] = useState<Campaign[]>([
    {
      id: "1",
      name: "Q4 Retail Property Outreach",
      status: "active",
      contacts: 500,
      completed: 187,
      connected: 23,
      dialingMode: "predictive",
      startDate: new Date(2024, 9, 1),
      description: "Targeting retail property owners for Q4 investment opportunities",
      targetCallsPerDay: 50,
      averageCallDuration: 180
    },
    {
      id: "2", 
      name: "Shopping Center Owners",
      status: "paused",
      contacts: 250,
      completed: 89,
      connected: 12,
      dialingMode: "adaptive",
      startDate: new Date(2024, 8, 15),
      description: "Focus on shopping center and mall property owners",
      targetCallsPerDay: 30,
      averageCallDuration: 240
    },
    {
      id: "3",
      name: "Office Building Survey",
      status: "completed",
      contacts: 100,
      completed: 100,
      connected: 34,
      dialingMode: "preview",
      startDate: new Date(2024, 7, 1),
      endDate: new Date(2024, 8, 30),
      description: "Survey of office building owners for market research",
      targetCallsPerDay: 20,
      averageCallDuration: 300
    }
  ]);

  const [liveStats, setLiveStats] = useState(contactService.getStats());
  const [selectedCampaign, setSelectedCampaign] = useState<Campaign | null>(null);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const [loadingCampaignId, setLoadingCampaignId] = useState<string | null>(null);
  const { toast } = useToast();

  // Analytics data
  const callVolumeData = [
    { day: 'Mon', calls: 65, connected: 23 },
    { day: 'Tue', calls: 78, connected: 31 },
    { day: 'Wed', calls: 82, connected: 29 },
    { day: 'Thu', calls: 95, connected: 38 },
    { day: 'Fri', calls: 88, connected: 35 },
  ];

  const dispositionData = [
    { name: 'Connected', value: 156, color: '#22c55e' },
    { name: 'Voicemail', value: 89, color: '#3b82f6' },
    { name: 'No Answer', value: 124, color: '#f59e0b' },
    { name: 'Busy', value: 45, color: '#ef4444' },
    { name: 'Do Not Call', value: 12, color: '#6b7280' },
  ];

  const performanceData = [
    { hour: '9AM', rate: 24 },
    { hour: '10AM', rate: 31 },
    { hour: '11AM', rate: 28 },
    { hour: '12PM', rate: 18 },
    { hour: '1PM', rate: 15 },
    { hour: '2PM', rate: 35 },
    { hour: '3PM', rate: 42 },
    { hour: '4PM', rate: 38 },
    { hour: '5PM', rate: 29 },
  ];

  // Update stats every 5 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setLiveStats(contactService.getStats());
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active": return "bg-green-500";
      case "paused": return "bg-yellow-500";
      case "completed": return "bg-blue-500";
      default: return "bg-gray-500";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "active": return <Play className="h-4 w-4" />;
      case "paused": return <Pause className="h-4 w-4" />;
      case "completed": return <Square className="h-4 w-4" />;
      default: return null;
    }
  };

  const toggleCampaignStatus = async (campaignId: string) => {
    setLoadingCampaignId(campaignId);
    
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    setCampaigns(prev => prev.map(campaign => {
      if (campaign.id === campaignId && campaign.status !== "completed") {
        const newStatus = campaign.status === "active" ? "paused" : "active";
        
        toast({
          title: `Campaign ${newStatus}`,
          description: `${campaign.name} has been ${newStatus}`,
        });
        
        return { ...campaign, status: newStatus };
      }
      return campaign;
    }));
    
    setLoadingCampaignId(null);
  };

  const viewCampaignDetails = (campaign: Campaign) => {
    setSelectedCampaign(campaign);
    setIsDetailsOpen(true);
  };

  const calculateDaysRunning = (startDate: Date, endDate?: Date) => {
    const end = endDate || new Date();
    const diffTime = Math.abs(end.getTime() - startDate.getTime());
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  };

  const formatDuration = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  const totalCalls = callVolumeData.reduce((sum, day) => sum + day.calls, 0);
  const totalConnected = callVolumeData.reduce((sum, day) => sum + day.connected, 0);
  const connectionRate = Math.round((totalConnected / totalCalls) * 100);

  return (
    <div className="space-y-8">
      {/* Live Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="hover:shadow-lg transition-shadow duration-200">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Contacts</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{liveStats.contacts.total}</div>
            <div className="flex items-center space-x-4 text-xs text-muted-foreground mt-2">
              <span className="flex items-center">
                <Target className="h-3 w-3 mr-1" />
                {liveStats.contacts.pending} pending
              </span>
              <span className="flex items-center">
                <CheckCircle className="h-3 w-3 mr-1" />
                {liveStats.contacts.contacted} contacted
              </span>
            </div>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow duration-200">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Calls Today</CardTitle>
            <Phone className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalCalls}</div>
            <div className="flex items-center text-xs text-muted-foreground">
              <TrendingUp className="h-3 w-3 mr-1 text-green-500" />
              +12% from last week
            </div>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow duration-200">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Connection Rate</CardTitle>
            <Target className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{connectionRate}%</div>
            <div className="flex items-center text-xs text-muted-foreground">
              <TrendingUp className="h-3 w-3 mr-1 text-green-500" />
              +3% from last week
            </div>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow duration-200">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg Call Duration</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">3:24</div>
            <div className="flex items-center text-xs text-muted-foreground">
              <TrendingDown className="h-3 w-3 mr-1 text-red-500" />
              -8% from last week
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Analytics Charts - First Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Call Volume Chart */}
        <Card className="hover:shadow-lg transition-shadow duration-200">
          <CardHeader>
            <CardTitle>Daily Call Volume</CardTitle>
            <CardDescription>Calls made vs connections this week</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={callVolumeData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="day" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="calls" fill="#3b82f6" name="Total Calls" />
                <Bar dataKey="connected" fill="#22c55e" name="Connected" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Call Disposition Pie Chart */}
        <Card className="hover:shadow-lg transition-shadow duration-200">
          <CardHeader>
            <CardTitle>Call Dispositions</CardTitle>
            <CardDescription>Breakdown of call outcomes</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={dispositionData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={100}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {dispositionData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
            <div className="grid grid-cols-2 gap-2 mt-4">
              {dispositionData.map((item) => (
                <div key={item.name} className="flex items-center space-x-2">
                  <div 
                    className="w-3 h-3 rounded-full" 
                    style={{ backgroundColor: item.color }}
                  />
                  <span className="text-sm">{item.name}: {item.value}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Analytics Charts - Second Row (Side by Side) */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Contact Status Overview */}
        <Card className="hover:shadow-lg transition-shadow duration-200">
          <CardHeader>
            <CardTitle>Contact Status Overview</CardTitle>
            <CardDescription>Real-time breakdown of contact status in your lists</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Badge className="bg-blue-500">Pending</Badge>
                  <span className="text-sm">Ready to call</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Progress value={(liveStats.contacts.pending / liveStats.contacts.total) * 100} className="w-32" />
                  <span className="text-sm font-medium">{liveStats.contacts.pending}</span>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Badge className="bg-green-500">Contacted</Badge>
                  <span className="text-sm">Successfully reached</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Progress value={(liveStats.contacts.contacted / liveStats.contacts.total) * 100} className="w-32" />
                  <span className="text-sm font-medium">{liveStats.contacts.contacted}</span>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Badge className="bg-gray-500">Completed</Badge>
                  <span className="text-sm">Finished processing</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Progress value={(liveStats.contacts.completed / liveStats.contacts.total) * 100} className="w-32" />
                  <span className="text-sm font-medium">{liveStats.contacts.completed}</span>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Badge variant="destructive">Do Not Call</Badge>
                  <span className="text-sm">Excluded from calling</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Progress value={(liveStats.contacts.dnc / liveStats.contacts.total) * 100} className="w-32" />
                  <span className="text-sm font-medium">{liveStats.contacts.dnc}</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Hourly Connection Rate */}
        <Card className="hover:shadow-lg transition-shadow duration-200">
          <CardHeader>
            <CardTitle>Hourly Connection Rate</CardTitle>
            <CardDescription>Connection rate by hour of the day</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={performanceData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="hour" />
                <YAxis />
                <Tooltip formatter={(value) => [`${value}%`, 'Connection Rate']} />
                <Line 
                  type="monotone" 
                  dataKey="rate" 
                  stroke="#3b82f6" 
                  strokeWidth={3}
                  dot={{ fill: '#3b82f6', strokeWidth: 2, r: 4 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Campaigns List */}
      <Card className="hover:shadow-lg transition-shadow duration-200">
        <CardHeader>
          <CardTitle>Active Campaigns</CardTitle>
          <CardDescription>Manage your calling campaigns and monitor progress</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {campaigns.map((campaign) => (
              <div key={campaign.id} className="flex items-center justify-between p-6 border rounded-lg hover:bg-gray-50 transition-colors">
                <div className="flex-1">
                  <div className="flex items-center space-x-3 mb-3">
                    <h3 className="font-medium text-lg">{campaign.name}</h3>
                    <Badge variant="outline" className={`${getStatusColor(campaign.status)} text-white border-0`}>
                      {getStatusIcon(campaign.status)}
                      <span className="ml-1 capitalize">{campaign.status}</span>
                    </Badge>
                    <Badge variant="secondary">{campaign.dialingMode}</Badge>
                  </div>
                  
                  <div className="flex items-center space-x-6 text-sm text-gray-600 mb-4">
                    <span>{campaign.contacts} contacts</span>
                    <span>{campaign.completed} completed</span>
                    <span>{campaign.connected} connected</span>
                    <span>{calculateDaysRunning(campaign.startDate, campaign.endDate)} days running</span>
                  </div>

                  <div className="flex items-center space-x-2">
                    <Progress 
                      value={(campaign.completed / campaign.contacts) * 100} 
                      className="flex-1 max-w-md h-3" 
                    />
                    <span className="text-sm text-gray-500 min-w-[60px]">
                      {Math.round((campaign.completed / campaign.contacts) * 100)}% complete
                    </span>
                  </div>
                </div>

                <div className="flex items-center space-x-3 ml-6">
                  {campaign.status !== "completed" && (
                    <Button 
                      variant={campaign.status === "active" ? "destructive" : "default"}
                      size="sm"
                      onClick={() => toggleCampaignStatus(campaign.id)}
                      disabled={loadingCampaignId === campaign.id}
                      className="hover:scale-105 transition-transform min-w-[100px]"
                    >
                      {loadingCampaignId === campaign.id ? (
                        <Loader2 className="h-4 w-4 mr-1 animate-spin" />
                      ) : campaign.status === "active" ? (
                        <Pause className="h-4 w-4 mr-1" />
                      ) : (
                        <Play className="h-4 w-4 mr-1" />
                      )}
                      {campaign.status === "active" ? "Pause" : "Resume"}
                    </Button>
                  )}
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => viewCampaignDetails(campaign)}
                    className="hover:scale-105 transition-transform min-w-[120px]"
                  >
                    <Eye className="h-4 w-4 mr-1" />
                    View Details
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Campaign Performance */}
      <Card className="hover:shadow-lg transition-shadow duration-200">
        <CardHeader>
          <CardTitle>Campaign Performance</CardTitle>
          <CardDescription>Progress and metrics for active campaigns</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-medium">Q4 Sales Outreach</h4>
                  <p className="text-sm text-gray-600">187/500 contacts reached</p>
                </div>
                <Badge variant="outline" className="bg-green-500 text-white border-0">
                  37% completion
                </Badge>
              </div>
              <Progress value={37} className="h-3" />
              <div className="grid grid-cols-3 gap-4 text-sm">
                <div>
                  <span className="text-gray-600">Connected:</span>
                  <span className="font-medium ml-2">23</span>
                </div>
                <div>
                  <span className="text-gray-600">Voicemails:</span>
                  <span className="font-medium ml-2">89</span>
                </div>
                <div>
                  <span className="text-gray-600">Rate:</span>
                  <span className="font-medium ml-2">12.3%</span>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-medium">Product Demo Follow-up</h4>
                  <p className="text-sm text-gray-600">89/250 contacts reached</p>
                </div>
                <Badge variant="outline" className="bg-yellow-500 text-white border-0">
                  Paused
                </Badge>
              </div>
              <Progress value={36} className="h-3" />
              <div className="grid grid-cols-3 gap-4 text-sm">
                <div>
                  <span className="text-gray-600">Connected:</span>
                  <span className="font-medium ml-2">12</span>
                </div>
                <div>
                  <span className="text-gray-600">Voicemails:</span>
                  <span className="font-medium ml-2">45</span>
                </div>
                <div>
                  <span className="text-gray-600">Rate:</span>
                  <span className="font-medium ml-2">13.5%</span>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Campaign Details Modal */}
      <Dialog open={isDetailsOpen} onOpenChange={setIsDetailsOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center space-x-2">
              <span>{selectedCampaign?.name}</span>
              <Badge variant="outline" className={`${getStatusColor(selectedCampaign?.status || '')} text-white border-0`}>
                {getStatusIcon(selectedCampaign?.status || '')}
                <span className="ml-1 capitalize">{selectedCampaign?.status}</span>
              </Badge>
            </DialogTitle>
            <DialogDescription>
              {selectedCampaign?.description}
            </DialogDescription>
          </DialogHeader>
          
          {selectedCampaign && (
            <div className="space-y-6">
              {/* Key Metrics */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="text-center p-4 bg-blue-50 rounded-lg">
                  <div className="text-2xl font-bold text-blue-600">{selectedCampaign.contacts}</div>
                  <div className="text-sm text-gray-600">Total Contacts</div>
                </div>
                <div className="text-center p-4 bg-green-50 rounded-lg">
                  <div className="text-2xl font-bold text-green-600">{selectedCampaign.completed}</div>
                  <div className="text-sm text-gray-600">Completed</div>
                </div>
                <div className="text-center p-4 bg-purple-50 rounded-lg">
                  <div className="text-2xl font-bold text-purple-600">{selectedCampaign.connected}</div>
                  <div className="text-sm text-gray-600">Connected</div>
                </div>
                <div className="text-center p-4 bg-orange-50 rounded-lg">
                  <div className="text-2xl font-bold text-orange-600">
                    {Math.round((selectedCampaign.connected / selectedCampaign.completed) * 100) || 0}%
                  </div>
                  <div className="text-sm text-gray-600">Success Rate</div>
                </div>
              </div>

              {/* Campaign Settings */}
              <div className="space-y-4">
                <h4 className="font-medium">Campaign Settings</h4>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-gray-600">Dialing Mode:</span>
                    <span className="ml-2 font-medium capitalize">{selectedCampaign.dialingMode}</span>
                  </div>
                  <div>
                    <span className="text-gray-600">Target Calls/Day:</span>
                    <span className="ml-2 font-medium">{selectedCampaign.targetCallsPerDay}</span>
                  </div>
                  <div>
                    <span className="text-gray-600">Start Date:</span>
                    <span className="ml-2 font-medium">{selectedCampaign.startDate.toLocaleDateString()}</span>
                  </div>
                  <div>
                    <span className="text-gray-600">Avg Call Duration:</span>
                    <span className="ml-2 font-medium">{formatDuration(selectedCampaign.averageCallDuration)}</span>
                  </div>
                  {selectedCampaign.endDate && (
                    <div>
                      <span className="text-gray-600">End Date:</span>
                      <span className="ml-2 font-medium">{selectedCampaign.endDate.toLocaleDateString()}</span>
                    </div>
                  )}
                  <div>
                    <span className="text-gray-600">Days Running:</span>
                    <span className="ml-2 font-medium">
                      {calculateDaysRunning(selectedCampaign.startDate, selectedCampaign.endDate)}
                    </span>
                  </div>
                </div>
              </div>

              {/* Progress Bar */}
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Campaign Progress</span>
                  <span>{Math.round((selectedCampaign.completed / selectedCampaign.contacts) * 100)}%</span>
                </div>
                <Progress value={(selectedCampaign.completed / selectedCampaign.contacts) * 100} className="h-3" />
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};