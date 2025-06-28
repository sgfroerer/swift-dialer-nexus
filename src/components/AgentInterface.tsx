
import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Phone, PhoneCall, PhoneOff, User, Clock, Play, Pause, Copy, MessageSquare, SkipForward, RefreshCw } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { contactService, Contact } from "@/services/contactService";

interface TextTemplate {
  id: string;
  name: string;
  template: string;
}

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

  const textTemplates: TextTemplate[] = currentContact ? [
    {
      id: "1",
      name: "Standard Introduction",
      template: `Hi ${currentContact.name}, this is Sam Gfroerer with M&M. I just tried giving you a quick call — I specialize in retail investment properties and wanted to connect regarding your ${currentContact.propertyType}. Let me know if there's a good time to chat, or feel free to text back. Looking forward to connecting!`
    },
    {
      id: "2",
      name: "Brief Follow-up",
      template: `Hi ${currentContact.name}, Sam from M&M here. Just called about your ${currentContact.propertyType}. I help investors with retail properties - would love to connect when you have a moment. Text or call back when convenient!`
    },
    {
      id: "3",
      name: "Value Proposition",
      template: `Hi ${currentContact.name}, this is Sam with M&M. I specialize in maximizing returns on retail investment properties like your ${currentContact.propertyType}. Just tried calling - would appreciate a few minutes to discuss how I can help. Feel free to text back!`
    }
  ] : [];

  const salesScript = currentContact ? `
    Hi ${currentContact.name}, this is Sam Gfroerer from M&M Real Estate Investment Services.
    
    I'm calling because I specialize in helping property owners like yourself maximize returns on retail investment properties, particularly ${currentContact.propertyType} investments.
    
    I noticed you own property with ${currentContact.company}, and I'd love to discuss some strategies that have helped my other clients increase their property values by 15-30%.
    
    Do you have 3 minutes to discuss how this could benefit your portfolio?
  ` : "";

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
        handleCallEnd('no-answer');
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
      setShowTextTemplates(autoDisposition === "no-answer" || autoDisposition === "voicemail");
    }
  };

  const handleDispositionChange = (value: string) => {
    setCallDisposition(value);
    setShowTextTemplates(value === "no-answer" || value === "voicemail");
  };

  const copyToClipboard = async (text: string, templateName: string) => {
    try {
      await navigator.clipboard.writeText(text);
      toast({
        title: "Copied to clipboard",
        description: `${templateName} template copied successfully`,
      });
    } catch (error) {
      toast({
        title: "Copy failed",
        description: "Please copy the text manually",
        variant: "destructive"
      });
    }
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
    const outcome = callDisposition.includes('connected') ? 'connected' : 
                   callDisposition === 'voicemail' ? 'voicemail' :
                   callDisposition === 'no-answer' ? 'no-answer' :
                   callDisposition === 'busy' ? 'busy' : 'failed';
    
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
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Contact Information */}
      <div className="lg:col-span-1 space-y-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <User className="h-5 w-5" />
                <span>Current Contact</span>
              </div>
              <Button variant="outline" size="sm" onClick={skipContact}>
                <SkipForward className="h-4 w-4" />
              </Button>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <h3 className="font-semibold text-lg">{currentContact.name}</h3>
                <p className="text-gray-600">{currentContact.company}</p>
                {currentContact.propertyType && (
                  <p className="text-sm text-blue-600">Property: {currentContact.propertyType}</p>
                )}
                <div className="flex items-center space-x-2 mt-2">
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
              
              <div className="space-y-2">
                <div className="flex items-center space-x-2">
                  <Phone className="h-4 w-4 text-gray-500" />
                  <span className="text-sm">{currentContact.phone}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="text-sm">📧</span>
                  <span className="text-sm">{currentContact.email}</span>
                </div>
                {currentContact.lastCalled && (
                  <div className="flex items-center space-x-2">
                    <Clock className="h-4 w-4 text-gray-500" />
                    <span className="text-sm">Last called: {currentContact.lastCalled.toLocaleDateString()}</span>
                  </div>
                )}
              </div>

              {currentContact.notes && (
                <div>
                  <Label className="text-sm font-medium">Notes:</Label>
                  <p className="text-sm text-gray-600 mt-1">{currentContact.notes}</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Session Stats */}
        {sessionActive && (
          <Card>
            <CardHeader>
              <CardTitle className="text-sm">Session Stats</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2 text-sm">
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

        {/* Call Controls */}
        <Card>
          <CardHeader>
            <CardTitle>Call Controls</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <Button
                onClick={toggleSession}
                variant={sessionActive ? "destructive" : "default"}
                className="w-full"
              >
                {sessionActive ? <Pause className="h-4 w-4 mr-2" /> : <Play className="h-4 w-4 mr-2" />}
                {sessionActive ? "Pause Session" : "Start Session"}
              </Button>

              {sessionActive && (
                <>
                  {!callActive && !isDialing && cooldownTimer === 0 && (
                    <Button onClick={startDialing} className="w-full">
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
                    <Button onClick={endCall} variant="destructive" className="w-full">
                      <PhoneOff className="h-4 w-4 mr-2" />
                      End Call
                    </Button>
                  )}

                  {cooldownTimer > 0 && (
                    <div className="text-center">
                      <Badge variant="outline" className="bg-yellow-50">
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
      </div>

      {/* Main Interface */}
      <div className="lg:col-span-2 space-y-6">
        {/* Sales Script */}
        <Card>
          <CardHeader>
            <CardTitle>Sales Script</CardTitle>
            <CardDescription>Use this script as a guide for your call</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="bg-blue-50 p-4 rounded-lg">
              <pre className="whitespace-pre-wrap text-sm font-mono text-blue-900">
                {salesScript}
              </pre>
            </div>
          </CardContent>
        </Card>

        {/* Text Message Templates */}
        {showTextTemplates && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <MessageSquare className="h-5 w-5" />
                <span>Text Message Templates</span>
              </CardTitle>
              <CardDescription>
                Copy templates below to send via Phone Link after missed calls
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {textTemplates.map((template) => (
                  <div key={template.id} className="border rounded-lg p-4 bg-green-50">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-medium text-sm text-green-800">{template.name}</h4>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => copyToClipboard(template.template, template.name)}
                        className="text-green-700 border-green-300 hover:bg-green-100"
                      >
                        <Copy className="h-4 w-4 mr-1" />
                        Copy
                      </Button>
                    </div>
                    <p className="text-sm text-gray-700 leading-relaxed">
                      {template.template}
                    </p>
                  </div>
                ))}
              </div>
              <div className="mt-4 p-3 bg-blue-50 rounded-lg">
                <p className="text-sm text-blue-700">
                  💡 <strong>Tip:</strong> Copy the template, then paste it into Microsoft Phone Link to send as a text message to {currentContact.name} at {currentContact.phone}
                </p>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Call Disposition */}
        <Card>
          <CardHeader>
            <CardTitle>Call Disposition</CardTitle>
            <CardDescription>Log the outcome of your call</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <Label htmlFor="disposition">Call Result</Label>
                <Select value={callDisposition} onValueChange={handleDispositionChange}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select call outcome" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="connected">Connected - Interested</SelectItem>
                    <SelectItem value="connected-not-interested">Connected - Not Interested</SelectItem>
                    <SelectItem value="voicemail">Voicemail Left</SelectItem>
                    <SelectItem value="no-answer">No Answer</SelectItem>
                    <SelectItem value="busy">Busy Signal</SelectItem>
                    <SelectItem value="callback">Callback Requested</SelectItem>
                    <SelectItem value="wrong-number">Wrong Number</SelectItem>
                    <SelectItem value="do-not-call">Do Not Call</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="notes">Call Notes</Label>
                <Textarea
                  id="notes"
                  value={callNotes}
                  onChange={(e) => setCallNotes(e.target.value)}
                  placeholder="Add any relevant notes about the call..."
                  rows={4}
                />
              </div>

              <Button onClick={submitDisposition} className="w-full" disabled={!callDisposition}>
                Submit & Next Contact
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
