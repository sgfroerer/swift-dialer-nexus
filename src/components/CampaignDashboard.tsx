
import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Play, Pause, Square, Users, Phone, Clock, TrendingUp, Target, CheckCircle, XCircle } from "lucide-react";
import { contactService } from "@/services/contactService";

interface Campaign {
  id: string;
  name: string;
  status: "active" | "paused" | "completed";
  contacts: number;
  completed: number;
  connected: number;
  dialingMode: "predictive" | "adaptive" | "preview";
}

export const CampaignDashboard = () => {
  const [campaigns] = useState<Campaign[]>([
    {
      id: "1",
      name: "Q4 Retail Property Outreach",
      status: "active",
      contacts: 500,
      completed: 187,
      connected: 23,
      dialingMode: "predictive"
    },
    {
      id: "2", 
      name: "Shopping Center Owners",
      status: "paused",
      contacts: 250,
      completed: 89,
      connected: 12,
      dialingMode: "adaptive"
    },
    {
      id: "3",
      name: "Office Building Survey",
      status: "completed",
      contacts: 100,
      completed: 100,
      connected: 34,
      dialingMode: "preview"
    }
  ]);

  const [liveStats, setLiveStats] = useState(contactService.getStats());

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

  return (
    <div className="space-y-6">
      {/* Live Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
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

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Calls Today</CardTitle>
            <Phone className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{liveStats.calls.total}</div>
            <p className="text-xs text-muted-foreground">
              {liveStats.calls.connected} connected
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Connection Rate</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{liveStats.calls.connectionRate}%</div>
            <p className="text-xs text-muted-foreground">
              {liveStats.calls.connected} of {liveStats.calls.total} calls
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Do Not Call</CardTitle>
            <XCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{liveStats.contacts.dnc}</div>
            <p className="text-xs text-muted-foreground">Excluded contacts</p>
          </CardContent>
        </Card>
      </div>

      {/* Contact Status Breakdown */}
      <Card>
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

      {/* Campaigns List */}
      <Card>
        <CardHeader>
          <CardTitle>Active Campaigns</CardTitle>
          <CardDescription>Manage your calling campaigns and monitor progress</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {campaigns.map((campaign) => (
              <div key={campaign.id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50 transition-colors">
                <div className="flex-1">
                  <div className="flex items-center space-x-3 mb-2">
                    <h3 className="font-medium">{campaign.name}</h3>
                    <Badge variant="outline" className={`${getStatusColor(campaign.status)} text-white border-0`}>
                      {getStatusIcon(campaign.status)}
                      <span className="ml-1 capitalize">{campaign.status}</span>
                    </Badge>
                    <Badge variant="secondary">{campaign.dialingMode}</Badge>
                  </div>
                  
                  <div className="flex items-center space-x-6 text-sm text-gray-600 mb-3">
                    <span>{campaign.contacts} contacts</span>
                    <span>{campaign.completed} completed</span>
                    <span>{campaign.connected} connected</span>
                  </div>

                  <div className="flex items-center space-x-2">
                    <Progress 
                      value={(campaign.completed / campaign.contacts) * 100} 
                      className="flex-1 max-w-xs" 
                    />
                    <span className="text-xs text-gray-500">
                      {Math.round((campaign.completed / campaign.contacts) * 100)}% complete
                    </span>
                  </div>
                </div>

                <div className="flex items-center space-x-2">
                  {campaign.status === "active" ? (
                    <Button variant="outline" size="sm">
                      <Pause className="h-4 w-4 mr-1" />
                      Pause
                    </Button>
                  ) : campaign.status === "paused" ? (
                    <Button variant="default" size="sm">
                      <Play className="h-4 w-4 mr-1" />
                      Resume
                    </Button>
                  ) : null}
                  <Button variant="outline" size="sm">
                    View Details
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
