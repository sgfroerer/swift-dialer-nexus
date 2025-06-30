import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CallListManager } from "@/components/CallListManager";
import { CampaignDashboard } from "@/components/CampaignDashboard";
import { AgentInterface } from "@/components/AgentInterface";
import { GlobalSidebar } from "@/components/GlobalSidebar";
import { KeyboardShortcutsCallout } from "@/components/KeyboardShortcutsCallout";
import { Phone, Users, BarChart3 } from "lucide-react";

const futureImages = [
  "https://officialpsds.com/imageview/rn/2v/rn2v52_large.png?1521316541",
  "https://officialpsds.com/imageview/7j/nj/7jnjq5_large.png?1521316540",
  "https://officialpsds.com/imageview/79/nm/79nmpz_large.png?1521316511",
  "https://www.pngkit.com/png/full/171-1712685_future-png-rapper-future-the-rapper-outfits-2015.png",
  "https://us-tuna-sounds-images.voicemod.net/9e6290d9-a7ca-4b29-b706-21ae49a0e7fc-1730828762819.png"
];

const futureLines = [
  "Mask off, deals on.",
  "I ghosted sleep to call up rent.",
  "Pray for love. Call for money.",
  "Pipeline heavy, feelings light.",
  "She left me on read, my clients can’t.",
  "Woke up toxic, phone never silent.",
  "Phone ringin’ like my ex at 2AM — can’t block money.",
  "I don’t miss calls or blessings.",
  "Mask off, deal on. Pipe up, phone on.",
  "Left my feelings on read, but my pipeline on delivered.",
  "I don’t chase love. I chase owners who own more.",
  "They sleep, I cold call.",
  "I don’t text back, I call forward.",
  "Your girl wants brunch, I want her dad’s retail portfolio.",
  "My last heartbreak built this dialer.",
  "I’m poly — loyal to calls, married to grind.",
  "She left me on read, my clients can’t.",
  "If you hear me breathing, I’m closing.",
  
  // 🔥 Bonus new savage lines:
  "Broke up with sleep. Back with deals.",
  "She wants a soft life. I want a signed LOI.",
  "Cold calls warmer than my last relationship.",
  "Feelings on DND. Pipeline on 100.",
  "No cuffing season, just closing season.",
  "If I’m up, my phone’s up.",
  "Miss me? Call me — I’m busy calling your landlord."
];

const Index = () => {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [sessionStats] = useState({ callsMade: 0, connected: 0, startTime: new Date() });
  
  // Future image and line state
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [currentLineIndex, setCurrentLineIndex] = useState(0);
  const [showLine, setShowLine] = useState(false);
  const [isImageTransitioning, setIsImageTransitioning] = useState(false);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const getRandomIndex = (currentIndex: number, arrayLength: number) => {
    let newIndex;
    do {
      newIndex = Math.floor(Math.random() * arrayLength);
    } while (newIndex === currentIndex && arrayLength > 1);
    return newIndex;
  };

  const handleFutureClick = () => {
    // Start image transition
    setIsImageTransitioning(true);
    
    // Hide current line with fade out
    setShowLine(false);
    
    setTimeout(() => {
      // Get new random indices
      const newImageIndex = getRandomIndex(currentImageIndex, futureImages.length);
      const newLineIndex = getRandomIndex(currentLineIndex, futureLines.length);
      
      // Update indices
      setCurrentImageIndex(newImageIndex);
      setCurrentLineIndex(newLineIndex);
      
      // End image transition
      setIsImageTransitioning(false);
      
      // Show new line with fade in
      setTimeout(() => {
        setShowLine(true);
      }, 100);
    }, 200);
  };

  const handleQuoteClick = () => {
    setShowLine(false);
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
              {/* Left Side - OpenDialer Pro */}
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

              {/* Center - Future Line (when shown) */}
              <div className="flex-1 flex justify-center mx-8">
                <div 
                  className={`transition-all duration-300 ease-in-out ${
                    showLine 
                      ? 'opacity-100 transform translate-y-0' 
                      : 'opacity-0 transform translate-y-2'
                  }`}
                >
                  {showLine && (
                    <button
                      onClick={handleQuoteClick}
                      className="text-sm font-bold italic text-purple-600 text-center hover:text-purple-800 transition-colors cursor-pointer"
                      title="Click to hide"
                    >
                      "{futureLines[currentLineIndex]}"
                    </button>
                  )}
                </div>
              </div>

              {/* Right Side - Future Image + Platform Text */}
              <div className="flex items-center space-x-4">
                {/* Future Image - Bigger, No Border/Circle */}
                <button
                  onClick={handleFutureClick}
                  className={`transition-all duration-200 hover:scale-110 ${
                    isImageTransitioning ? 'opacity-0' : 'opacity-100'
                  }`}
                  title="Click for Future wisdom"
                >
                  <img
                    src={futureImages[currentImageIndex]}
                    alt="Future"
                    className="w-12 h-12 object-contain hover:opacity-80 transition-opacity"
                    style={{ filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.1))' }}
                    onError={(e) => {
                      // Fallback to a simple colored circle if image fails to load
                      e.currentTarget.style.display = 'none';
                      const fallback = document.createElement('div');
                      fallback.className = 'w-12 h-12 rounded-full bg-purple-500 flex items-center justify-center hover:opacity-80 transition-opacity';
                      fallback.innerHTML = '<span class="text-white text-lg font-bold">F</span>';
                      fallback.style.filter = 'drop-shadow(0 2px 4px rgba(0,0,0,0.1))';
                      e.currentTarget.parentNode?.insertBefore(fallback, e.currentTarget);
                    }}
                  />
                </button>

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