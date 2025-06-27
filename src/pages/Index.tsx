
import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CallListManager } from "@/components/CallListManager";
import { CampaignDashboard } from "@/components/CampaignDashboard";
import { AgentInterface } from "@/components/AgentInterface";
import { AnalyticsDashboard } from "@/components/AnalyticsDashboard";
import { Phone, Users, BarChart3, Settings } from "lucide-react";

const Index = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-3">
              <div className="bg-blue-600 p-2 rounded-lg">
                <Phone className="h-6 w-6 text-white" />
              </div>
              <h1 className="text-xl font-bold text-gray-900">OpenDialer Pro</h1>
            </div>
            <div className="text-sm text-gray-500">
              Open Source Auto-Dialer Platform
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Tabs defaultValue="dashboard" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4 lg:w-96">
            <TabsTrigger value="dashboard" className="flex items-center space-x-2">
              <BarChart3 className="h-4 w-4" />
              <span>Dashboard</span>
            </TabsTrigger>
            <TabsTrigger value="lists" className="flex items-center space-x-2">
              <Users className="h-4 w-4" />
              <span>Call Lists</span>
            </TabsTrigger>
            <TabsTrigger value="agent" className="flex items-center space-x-2">
              <Phone className="h-4 w-4" />
              <span>Agent</span>
            </TabsTrigger>
            <TabsTrigger value="analytics" className="flex items-center space-x-2">
              <Settings className="h-4 w-4" />
              <span>Analytics</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="dashboard">
            <CampaignDashboard />
          </TabsContent>

          <TabsContent value="lists">
            <CallListManager />
          </TabsContent>

          <TabsContent value="agent">
            <AgentInterface />
          </TabsContent>

          <TabsContent value="analytics">
            <AnalyticsDashboard />
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
};

export default Index;
