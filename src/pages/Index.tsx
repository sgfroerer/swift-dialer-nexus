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

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      {/* Global Sidebar */}
      <GlobalSidebar 
        collapsed={sidebarCollapsed}
        onToggle={() => setSidebarCollapsed(!sidebarCollapsed)}
        sessionStats={sessionStats}
      />

      {/* Main Content with Sidebar Offset and Symmetrical Padding */}
      <div className={`transition-all duration-300 ${sidebarCollapsed ? 'ml-20' : 'ml-80'}`}>
        {/* Sticky Header */}
        <header className="sticky top-0 z-40 bg-white shadow-sm border-b">
          <div className={`w-full transition-all duration-300 ${
            sidebarCollapsed 
              ? 'px-12 lg:px-16' // More padding when collapsed to match right side
              : 'px-8 lg:px-12'   // Standard padding when expanded
          }`}>
            <div className="flex items-center justify-between h-16">
              <button 
                onClick={scrollToTop}
                className="flex items-center space-x-3 hover:opacity-80 transition-opacity cursor-pointer group"
              >
                <div className="bg-blue-600 p-2 rounded-lg group-hover:bg-blue-700 transition-colors">
                  <Phone className="h-6 w-6 text-white" />
                </div>
                <h1 className="text-xl font-bold text-gray-900 group-hover:text-blue-600 transition-colors">
                  OpenDialer Pro
                </h1>
              </button>
              <div className="flex items-center space-x-4">
                <div className="text-sm text-gray-500">
                  Open Source Auto-Dialer Platform
                </div>
                <KeyboardShortcutsCallout />
              </div>
            </div>
          </div>
        </header>

        {/* Main Content with Symmetrical Padding */}
        <main className={`w-full py-8 transition-all duration-300 ${
          sidebarCollapsed 
            ? 'px-12 lg:px-16' // Matches header padding when collapsed
            : 'px-8 lg:px-12'   // Matches header padding when expanded
        }`}>
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