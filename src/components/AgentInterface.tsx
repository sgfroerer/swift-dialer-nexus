
import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Phone, PhoneCall, PhoneOff, User, Clock, Play, Pause } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface Contact {
  id: string;
  name: string;
  phone: string;
  email: string;
  company: string;
  notes?: string;
}

export const AgentInterface = () => {
  const [isDialing, setIsDialing] = useState(false);
  const [callActive, setCallActive] = useState(false);
  const [cooldownTimer, setCooldownTimer] = useState(0);
  const [callNotes, setCallNotes] = useState("");
  const [callDisposition, setCallDisposition] = useState("");
  const [sessionActive, setSessionActive] = useState(false);
  const { toast } = useToast();

  const [currentContact] = useState<Contact>({
    id: "1",
    name: "John Smith",
    phone: "+1 (555) 123-4567",
    email: "john.smith@techcorp.com",
    company: "TechCorp Solutions",
    notes: "Interested in enterprise solutions, prefers morning calls"
  });

  const salesScript = `
    Hi [Name], this is [Your Name] from OpenDialer Pro. 
    
    I'm calling because we help companies like [Company] streamline their sales outreach process with our automated dialing solutions.
    
    Do you have 2 minutes to discuss how this could benefit your team?
  `;

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

    setIsDialing(true);
    // Simulate dialing delay
    setTimeout(() => {
      setIsDialing(false);
      setCallActive(true);
      toast({
        title: "Call connected",
        description: `Connected to ${currentContact.name}`,
      });
    }, 3000);
  };

  const endCall = () => {
    setCallActive(false);
    setCooldownTimer(30); // 30 second cooldown
    toast({
      title: "Call ended",
      description: "Please log your call disposition",
    });
  };

  const submitDisposition = () => {
    if (!callDisposition) {
      toast({
        title: "Missing disposition",
        description: "Please select a call disposition",
        variant: "destructive"
      });
      return;
    }

    // Reset form
    setCallNotes("");
    setCallDisposition("");
    
    toast({
      title: "Call logged successfully",
      description: "Moving to next contact...",
    });
  };

  const toggleSession = () => {
    setSessionActive(!sessionActive);
    toast({
      title: sessionActive ? "Session paused" : "Session started",
      description: sessionActive ? "Dialing session has been paused" : "Ready to start making calls",
    });
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Contact Information */}
      <div className="lg:col-span-1 space-y-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <User className="h-5 w-5" />
              <span>Current Contact</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <h3 className="font-semibold text-lg">{currentContact.name}</h3>
                <p className="text-gray-600">{currentContact.company}</p>
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
                      Dialing...
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
                {salesScript.replace('[Name]', currentContact.name).replace('[Company]', currentContact.company)}
              </pre>
            </div>
          </CardContent>
        </Card>

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
                <Select value={callDisposition} onValueChange={setCallDisposition}>
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

              <Button onClick={submitDisposition} className="w-full">
                Submit & Next Contact
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
