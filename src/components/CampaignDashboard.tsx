
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Play, Pause, Square, Users, Phone, Clock, TrendingUp } from "lucide-react";

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
      name: "Q4 Sales Outreach",
      status: "active",
      contacts: 500,
      completed: 187,
      connected: 23,
      dialingMode: "predictive"
    },
    {
      id: "2", 
      name: "Product Demo Follow-up",
      status: "paused",
      contacts: 250,
      completed: 89,
      connected: 12,
      dialingMode: "adaptive"
    },
    {
      id: "3",
      name: "Customer Survey",
      status: "completed",
      contacts: 100,
      completed: 100,
      connected: 34,
      dialingMode: "preview"
    }
  ]);

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
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Campaigns</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{campaigns.length}</div>
            <p className="text-xs text-muted-foreground">Active campaigns running</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Contacts</CardTitle>
            <Phone className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {campaigns.reduce((sum, c) => sum + c.contacts, 0)}
            </div>
            <p className="text-xs text-muted-foreground">Contacts in all campaigns</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Calls Completed</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {campaigns.reduce((sum, c) => sum + c.completed, 0)}
            </div>
            <p className="text-xs text-muted-foreground">Total calls made today</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Connection Rate</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {Math.round((campaigns.reduce((sum, c) => sum + c.connected, 0) / campaigns.reduce((sum, c) => sum + c.completed, 0)) * 100) || 0}%
            </div>
            <p className="text-xs text-muted-foreground">Average across all campaigns</p>
          </CardContent>
        </Card>
      </div>

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
