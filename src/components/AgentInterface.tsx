import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Phone, PhoneCall, PhoneOff, User, Clock, Play, Pause, SkipForward, RefreshCw } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { contactService, Contact } from "@/services/contactService";
import { templateService } from "@/services/templateService";
import { CallingWidget } from "@/components/CallingWidget";
import { AgentGamification } from "@/components/AgentGamification";
import { EditableTemplate } from "@/components/EditableTemplate";
import { TextTemplateSelector } from "@/components/TextTemplateSelector";

export const AgentInterface = () => {
  const [isDialing, setIsDialing] = useState(false);
  const [callActive, setCallActive] = useState(false);
  const [cooldownTimer, setCooldownTimer] = useState(0);
  const [callNotes, setCallNotes] = useState("");
  const [callDisposition, setCallDisposition] = useState("");
  const [sessionActive, setSessionActive] = useState(false);
  const [showTextTemplates, setShowTextTemplates] = useState(false);
  const [currentContact, setCurrentContact] = useState<Contact | null>(null);
  const [callStartTime, setCallStartTime] = useState<Date | null>(null);
  const [sessionStats, setSessionStats] = useState({ callsMade: 0, connected: 0, startTime: new Date() });
  
  // Template states
  const [salesScripts, setSalesScripts] = useState(templateService.getSalesScripts());
  const [activeSalesScriptId, setActiveSalesScriptId] = useState(templateService.getActiveSalesScript()?.id || 'default-retail');
  const [customSalesScript, setCustomSalesScript] = useState(templateService.getCustomSalesScript());
  
  const { toast } = useToast();

  // Load initial contact on mount
  useEffect(() => {
    loadNextContact();
  }, []);

  const loadNextContact = () => {
    const nextContact = contactService.getNextContact();
    if (nextContact) {
      setCurrentContact(nextContact);
      setCallNotes("");
      setCallDisposition("");
      setShowTextTemplates(false);
    } else {
      toast({
        title: "No more contacts",
        description: "All contacts have been processed",
      });
    }
  };

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (cooldownTimer > 0) {
      interval = setInterval(() => {
        setCooldownTimer(prev => prev - 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [cooldownTimer]);

  const startDialing = () => {
    if (!sessionActive) {
      toast({
        title: "Session not active",
        description: "Please start your dialing session first",
        variant: "destructive"
      });
      return;
    }

    if (!currentContact) {
      toast({
        title: "No contact available",
        description: "Please load a contact list first",
        variant: "destructive"
      });
      return;
    }

    setIsDialing(true);
    setShowTextTemplates(false);
    setCallStartTime(new Date());
    
    // Simulate realistic dialing delay (2-5 seconds)
    const dialingTime = Math.random() * 3000 + 2000;
    
    setTimeout(() => {
      setIsDialing(false);
      
      // Simulate call connection probability (70% chance)
      const connected = Math.random() > 0.3;
      
      if (connected) {
        setCallActive(true);
        toast({
          title: "Call connected",
          description: `Connected to ${currentContact.name}`,
        });
      } else {
        // Auto-end call if no connection
        handleCallEnd('no-vm');
        toast({
          title: "No answer",
          description: "Call went to voicemail or no answer",
        });
      }
    }, dialingTime);
  };

  const endCall = () => {
    if (callActive) {
      setCallActive(false);
      const duration = callStartTime ? Math.floor((Date.now() - callStartTime.getTime()) / 1000) : 0;
      setCooldownTimer(30);
      setCallStartTime(null);
      
      toast({
        title: "Call ended",
        description: `Call duration: ${duration} seconds. Please log your call disposition.`,
      });
    }
  };

  const handleCallEnd = (autoDisposition?: string) => {
    setCallActive(false);
    setIsDialing(false);
    const duration = callStartTime ? Math.floor((Date.now() - callStartTime.getTime()) / 1000) : 0;
    setCooldownTimer(30);
    setCallStartTime(null);
    
    if (autoDisposition) {
      setCallDisposition(autoDisposition);
      // Show text templates for specific dispositions
      setShowTextTemplates(['vm', 'no-vm', 'cold-text', 'email'].includes(autoDisposition));
    }
  };

  const handleDispositionChange = (value: string) => {
    setCallDisposition(value);
    // Show text templates only for specific call results
    setShowTextTemplates(['vm', 'no-vm', 'cold-text', 'email'].includes(value));
  };

  const handleTemplateCopy = (content: string, templateName: string) => {
    navigator.clipboard.writeText(content).then(() => {
      toast({
        title: "Copied to clipboard",
        description: `${templateName} template copied successfully`,
      });
    }).catch(() => {
      toast({
        title: "Copy failed",
        description: "Please copy the text manually",
        variant: "destructive"
      });
    });
  };

  const submitDisposition = () => {
    if (!callDisposition || !currentContact) {
      toast({
        title: "Missing disposition",
        description: "Please select a call disposition",
        variant: "destructive"
      });
      return;
    }

    // Log the call
    const outcome = callDisposition === 'contact' ? 'connected' : 
                   callDisposition === 'vm' ? 'voicemail' :
                   callDisposition === 'no-vm' ? 'no-answer' :
                   callDisposition === 'cold-text' ? 'no-answer' :
                   callDisposition === 'not-interested' ? 'connected' :
                   callDisposition === 'dnc' ? 'failed' :
                   callDisposition === 'email' ? 'no-answer' : 'failed';
    
    const duration = callStartTime ? Math.floor((Date.now() - callStartTime.getTime()) / 1000) : 0;
    
    contactService.logCall(currentContact.id, callDisposition, callNotes, outcome, duration);
    
    // Update session stats
    setSessionStats(prev => ({
      ...prev,
      callsMade: prev.callsMade + 1,
      connected: prev.connected + (outcome === 'connected' ? 1 : 0)
    }));

    // Reset form and load next contact
    setCallNotes("");
    setCallDisposition("");
    setShowTextTemplates(false);
    
    toast({
      title: "Call logged successfully",
      description: "Loading next contact...",
    });

    // Load next contact after short delay
    setTimeout(loadNextContact, 1000);
  };

  const skipContact = () => {
    if (!currentContact) return;
    
    toast({
      title: "Contact skipped",
      description: "Loading next contact...",
    });
    
    loadNextContact();
  };

  const toggleSession = () => {
    if (!sessionActive) {
      setSessionStats({ callsMade: 0, connected: 0, startTime: new Date() });
    }
    
    setSessionActive(!sessionActive);
    toast({
      title: sessionActive ? "Session paused" : "Session started",
      description: sessionActive ? "Dialing session has been paused" : "Ready to start making calls",
    });
  };

  // Template handlers
  const handleSalesScriptTemplateChange = (templateId: string) => {
    setActiveSalesScriptId(templateId);
    templateService.setActiveSalesScript(templateId);
  };

  const handleSalesScriptContentChange = (content: string) => {
    setCustomSalesScript(content);
  };

  const handleSalesScriptSave = () => {
    templateService.saveCustomSalesScript(customSalesScript);
  };

  if (!currentContact) {
    return (
      <div className="flex items-center justify-center h-96">
        <Card className="w-96">
          <CardHeader>
            <CardTitle>No Contacts Available</CardTitle>
            <CardDescription>Please import a contact list to begin dialing</CardDescription>
          </CardHeader>
          <CardContent>
            <Button onClick={loadNextContact} className="w-full">
              <RefreshCw className="h-4 w-4 mr-2" />
              Refresh Contacts
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="max-w-[1600px] mx-auto px-4">
      <div 
        className="grid gap-6"
        style={{
          gridTemplateColumns: '380px 1fr 480px',
          gridTemplateAreas: '"sidebar main disposition"',
          minHeight: 'calc(100vh - 200px)'
        }}
      >
        {/* Left Sidebar - Gamification & Contact Info */}
        <div style={{ gridArea: 'sidebar' }} className="space-y-6">
          {/* Contact Information */}
          <Card className="hover:shadow-lg transition-shadow duration-200">
            <CardHeader className="pb-4">
              <CardTitle className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <User className="h-5 w-5" />
                  <span>Current Contact</span>
                </div>
                <Button variant="outline" size="sm" onClick={skipContact} className="hover:scale-105 transition-transform">
                  <SkipForward className="h-4 w-4" />
                </Button>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h3 className="font-semibold text-lg leading-tight break-words">{currentContact.name}</h3>
                <p className="text-gray-600 mt-1 leading-relaxed break-words">{currentContact.company}</p>
                {currentContact.propertyType && (
                  <p className="text-sm text-blue-600 mt-2 break-words">Property: {currentContact.propertyType}</p>
                )}
                <div className="flex items-center space-x-2 mt-3 flex-wrap gap-2">
                  <Badge variant={currentContact.status === 'pending' ? 'default' : 'secondary'}>
                    {currentContact.status}
                  </Badge>
                  {currentContact.callCount > 0 && (
                    <Badge variant="outline">
                      {currentContact.callCount} calls
                    </Badge>
                  )}
                </div>
              </div>
              
              <div className="space-y-3">
                <div className="flex items-center space-x-2">
                  <Phone className="h-4 w-4 text-gray-500 flex-shrink-0" />
                  <span className="text-sm break-all">{currentContact.phone}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="text-sm flex-shrink-0">📧</span>
                  <span className="text-sm break-all">{currentContact.email}</span>
                </div>
                {currentContact.lastCalled && (
                  <div className="flex items-center space-x-2">
                    <Clock className="h-4 w-4 text-gray-500 flex-shrink-0" />
                    <span className="text-sm">Last called: {currentContact.lastCalled.toLocaleDateString()}</span>
                  </div>
                )}
              </div>

              {currentContact.notes && (
                <div className="pt-2 border-t">
                  <Label className="text-sm font-medium">Notes:</Label>
                  <p className="text-sm text-gray-600 mt-2 leading-relaxed break-words">{currentContact.notes}</p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Calling Widget */}
          <CallingWidget phoneNumber={currentContact.phone.replace(/\D/g, '')} />

          {/* Call Controls */}
          <Card className="hover:shadow-lg transition-shadow duration-200">
            <CardHeader className="pb-4">
              <CardTitle>Call Controls</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <Button
                  onClick={toggleSession}
                  variant={sessionActive ? "destructive" : "default"}
                  className="w-full hover:scale-105 transition-transform"
                >
                  {sessionActive ? <Pause className="h-4 w-4 mr-2" /> : <Play className="h-4 w-4 mr-2" />}
                  {sessionActive ? "Pause Session" : "Start Session"}
                </Button>

                {sessionActive && (
                  <>
                    {!callActive && !isDialing && cooldownTimer === 0 && (
                      <Button onClick={startDialing} className="w-full hover:scale-105 transition-transform">
                        <PhoneCall className="h-4 w-4 mr-2" />
                        Start Call
                      </Button>
                    )}

                    {isDialing && (
                      <Button disabled className="w-full">
                        <Phone className="h-4 w-4 mr-2 animate-pulse" />
                        Dialing {currentContact.name}...
                      </Button>
                    )}

                    {callActive && (
                      <Button onClick={endCall} variant="destructive" className="w-full hover:scale-105 transition-transform">
                        <PhoneOff className="h-4 w-4 mr-2" />
                        End Call
                      </Button>
                    )}

                    {cooldownTimer > 0 && (
                      <div className="text-center">
                        <Badge variant="outline" className="bg-yellow-50 animate-pulse">
                          <Clock className="h-4 w-4 mr-1" />
                          Cooldown: {cooldownTimer}s
                        </Badge>
                      </div>
                    )}
                  </>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Session Stats */}
          {sessionActive && (
            <Card className="hover:shadow-lg transition-shadow duration-200">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm">Session Stats</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3 text-sm">
                  <div className="flex justify-between">
                    <span>Calls Made:</span>
                    <span className="font-medium">{sessionStats.callsMade}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Connected:</span>
                    <span className="font-medium">{sessionStats.connected}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Connection Rate:</span>
                    <span className="font-medium">
                      {sessionStats.callsMade > 0 ? Math.round((sessionStats.connected / sessionStats.callsMade) * 100) : 0}%
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>Session Time:</span>
                    <span className="font-medium">
                      {Math.floor((Date.now() - sessionStats.startTime.getTime()) / 60000)}m
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Gamification - Moved to bottom */}
          <AgentGamification sessionStats={sessionStats} />
        </div>

        {/* Main Content - Sales Script & Text Templates */}
        <div style={{ gridArea: 'main' }} className="space-y-6">
          {/* Editable Sales Script */}
          <EditableTemplate
            title="Sales Script"
            templates={salesScripts}
            activeTemplateId={activeSalesScriptId}
            customContent={customSalesScript}
            onTemplateChange={handleSalesScriptTemplateChange}
            onCustomContentChange={handleSalesScriptContentChange}
            onSave={handleSalesScriptSave}
            placeholder="Enter your custom sales script here..."
            contact={currentContact}
            processTemplate={templateService.processTemplate.bind(templateService)}
          />

          {/* Text Message Templates - Only show for specific call results */}
          {showTextTemplates && (
            <TextTemplateSelector
              contact={currentContact}
              onTemplateCopy={handleTemplateCopy}
            />
          )}
        </div>

        {/* Right Column - Call Disposition */}
        <div style={{ gridArea: 'disposition' }} className="space-y-6">
          <Card className="hover:shadow-lg transition-shadow duration-200">
            <CardHeader className="pb-4">
              <CardTitle>Call Disposition</CardTitle>
              <CardDescription>Log the outcome of your call</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div className="space-y-3">
                  <Label htmlFor="disposition" className="text-sm font-medium">Call Result</Label>
                  <Select value={callDisposition} onValueChange={handleDispositionChange}>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Select call outcome" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="vm">📠 VM 📠</SelectItem>
                      <SelectItem value="contact">🗣️ Contact 🗣️</SelectItem>
                      <SelectItem value="no-vm">✖️ No VM ✖️</SelectItem>
                      <SelectItem value="cold-text">📱 Cold-Text 📱</SelectItem>
                      <SelectItem value="not-interested">Not Interested</SelectItem>
                      <SelectItem value="dnc">❌ DNC ❌</SelectItem>
                      <SelectItem value="email">📧 Email 📧</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-3">
                  <Label htmlFor="notes" className="text-sm font-medium">Call Notes</Label>
                  <Textarea
                    id="notes"
                    value={callNotes}
                    onChange={(e) => setCallNotes(e.target.value)}
                    placeholder="Add any relevant notes about the call..."
                    rows={6}
                    className="resize-none leading-relaxed"
                  />
                </div>

                <Button 
                  onClick={submitDisposition} 
                  className="w-full hover:scale-105 transition-transform" 
                  disabled={!callDisposition}
                >
                  Submit & Next Contact
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};