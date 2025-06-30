import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CallListManager } from "@/components/CallListManager";
import { CampaignDashboard } from "@/components/CampaignDashboard";
import { AgentInterface } from "@/components/AgentInterface";
import { GlobalSidebar } from "@/components/GlobalSidebar";
import { KeyboardShortcutsCallout } from "@/components/KeyboardShortcutsCallout";
import { Phone, Users, BarChart3 } from "lucide-react";

const Index = () => {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [sessionStats] = useState({ callsMade: 0, connected: 0, startTime: new Date() });

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      {/* Global Sidebar */}
      <GlobalSidebar 
        collapsed={sidebarCollapsed}
        onToggle={() => setSidebarCollapsed(!sidebarCollapsed)}
        sessionStats={sessionStats}
      />

      {/* Main Content with Sidebar Offset and Consistent Padding */}
      <div className={`transition-all duration-300 ${sidebarCollapsed ? 'ml-40' : 'ml-80'}`}>
        {/* Header */}
        <header className="bg-white shadow-sm border-b">
          <div className="w-full px-8 lg:px-12">
            <div className="flex items-center justify-between h-16">
              <div className="flex items-center space-x-3">
                <div className="bg-blue-600 p-2 rounded-lg">
                  <Phone className="h-6 w-6 text-white" />
                </div>
                <h1 className="text-xl font-bold text-gray-900">OpenDialer Pro</h1>
              </div>
              <div className="flex items-center space-x-4">
                <div className="text-sm text-gray-500">
                  Open Source Auto-Dialer Platform
                </div>
                <KeyboardShortcutsCallout />
              </div>
            </div>
          </div>
        </header>

        {/* Main Content with Consistent Padding */}
        <main className="w-full px-8 lg:px-12 py-8">
          <Tabs defaultValue="dashboard" className="space-y-6">
            <TabsList className="grid w-full grid-cols-3 lg:w-96">
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
            </TabsList>

            <TabsContent value="dashboard" className="space-y-8">
              <CampaignDashboard />
            </TabsContent>

            <TabsContent value="lists" className="space-y-8">
              <CallListManager />
            </TabsContent>

            <TabsContent value="agent" className="space-y-8">
              <AgentInterface />
            </TabsContent>
          </Tabs>
        </main>
      </div>
    </div>
  );
};

export default Index;