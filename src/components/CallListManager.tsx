import { useState, useRef } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { Upload, Clipboard, Users, FileText, Trash2 } from "lucide-react";

interface CallList {
  id: string;
  name: string;
  contacts: number;
  dateImported: string;
  status: "active" | "completed" | "archived";
}

export const CallListManager = () => {
  const [callLists, setCallLists] = useState<CallList[]>([
    {
      id: "1",
      name: "Enterprise Prospects Q4",
      contacts: 500,
      dateImported: "2024-01-15",
      status: "active"
    },
    {
      id: "2",
      name: "SMB Follow-ups",
      contacts: 250,
      dateImported: "2024-01-14",
      status: "active"
    }
  ]);

  const [listName, setListName] = useState("");
  const [pasteData, setPasteData] = useState("");
  const [showImportForm, setShowImportForm] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file && file.type === "text/csv") {
      // Simulate CSV processing
      const reader = new FileReader();
      reader.onload = (e) => {
        const content = e.target?.result as string;
        const lines = content.split('\n').filter(line => line.trim());
        const contactCount = Math.max(0, lines.length - 1); // Assuming first line is header
        
        if (listName.trim()) {
          const newList: CallList = {
            id: Date.now().toString(),
            name: listName,
            contacts: contactCount,
            dateImported: new Date().toISOString().split('T')[0],
            status: "active"
          };
          
          setCallLists(prev => [...prev, newList]);
          setListName("");
          setShowImportForm(false);
          
          toast({
            title: "Call list imported successfully",
            description: `${contactCount} contacts imported from ${file.name}`,
          });
        }
      };
      reader.readAsText(file);
    } else {
      toast({
        title: "Invalid file type",
        description: "Please upload a CSV file",
        variant: "destructive"
      });
    }
  };

  const handlePasteImport = () => {
    if (!pasteData.trim() || !listName.trim()) {
      toast({
        title: "Missing information",
        description: "Please provide both list name and contact data",
        variant: "destructive"
      });
      return;
    }

    const lines = pasteData.trim().split('\n').filter(line => line.trim());
    const contactCount = lines.length;

    const newList: CallList = {
      id: Date.now().toString(),
      name: listName,
      contacts: contactCount,
      dateImported: new Date().toISOString().split('T')[0],
      status: "active"
    };

    setCallLists(prev => [...prev, newList]);
    setListName("");
    setPasteData("");
    setShowImportForm(false);

    toast({
      title: "Call list created successfully",
      description: `${contactCount} contacts imported from clipboard`,
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active": return "bg-green-500";
      case "completed": return "bg-blue-500";
      case "archived": return "bg-gray-500";
      default: return "bg-gray-500";
    }
  };

  const deleteList = (id: string) => {
    setCallLists(prev => prev.filter(list => list.id !== id));
    toast({
      title: "Call list deleted",
      description: "The call list has been removed successfully",
    });
  };

  return (
    <div className="space-y-6">
      {/* Import Section */}
      <Card>
        <CardHeader>
          <CardTitle>Import Call Lists</CardTitle>
          <CardDescription>
            Upload CSV files or paste contact data to create new call lists
          </CardDescription>
        </CardHeader>
        <CardContent>
          {!showImportForm ? (
            <div className="flex flex-col sm:flex-row gap-4">
              <Button 
                onClick={() => setShowImportForm(true)}
                className="flex items-center space-x-2"
              >
                <Upload className="h-4 w-4" />
                <span>Import New List</span>
              </Button>
              <Button 
                variant="outline"
                onClick={() => fileInputRef.current?.click()}
                className="flex items-center space-x-2"
              >
                <FileText className="h-4 w-4" />
                <span>Quick CSV Upload</span>
              </Button>
            </div>
          ) : (
            <div className="space-y-4">
              <div>
                <Label htmlFor="listName">List Name</Label>
                <Input
                  id="listName"
                  value={listName}
                  onChange={(e) => setListName(e.target.value)}
                  placeholder="Enter list name (e.g., Q4 Prospects)"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <Label>CSV File Upload</Label>
                  <div className="mt-2 border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-gray-400 transition-colors">
                    <Upload className="mx-auto h-12 w-12 text-gray-400" />
                    <div className="mt-2">
                      <Button
                        variant="outline"
                        onClick={() => fileInputRef.current?.click()}
                      >
                        Choose CSV File
                      </Button>
                    </div>
                    <p className="mt-1 text-sm text-gray-500">
                      Expected format: Name, Phone, Email, Company
                    </p>
                  </div>
                </div>

                <div>
                  <Label htmlFor="pasteData">Or Paste Data</Label>
                  <Textarea
                    id="pasteData"
                    value={pasteData}
                    onChange={(e) => setPasteData(e.target.value)}
                    placeholder="John Doe,555-1234,john@company.com,Acme Corp&#10;Jane Smith,555-5678,jane@company.com,Tech Inc"
                    rows={6}
                    className="mt-2"
                  />
                  <p className="mt-1 text-sm text-gray-500">
                    One contact per line, comma-separated values
                  </p>
                </div>
              </div>

              <div className="flex justify-end space-x-2">
                <Button 
                  variant="outline"
                  onClick={() => {
                    setShowImportForm(false);
                    setListName("");
                    setPasteData("");
                  }}
                >
                  Cancel
                </Button>
                <Button onClick={handlePasteImport}>
                  <Clipboard className="h-4 w-4 mr-2" />
                  Import List
                </Button>
              </div>
            </div>
          )}

          <input
            ref={fileInputRef}
            type="file"
            accept=".csv"
            onChange={handleFileUpload}
            className="hidden"
          />
        </CardContent>
      </Card>

      {/* Existing Lists */}
      <Card>
        <CardHeader>
          <CardTitle>Call Lists</CardTitle>
          <CardDescription>Manage your imported contact lists</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {callLists.map((list) => (
              <div key={list.id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50 transition-colors">
                <div className="flex items-center space-x-4">
                  <div className="bg-blue-100 p-2 rounded-lg">
                    <Users className="h-5 w-5 text-blue-600" />
                  </div>
                  <div>
                    <h3 className="font-medium">{list.name}</h3>
                    <div className="flex items-center space-x-4 text-sm text-gray-600">
                      <span>{list.contacts} contacts</span>
                      <span>Imported {list.dateImported}</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center space-x-2">
                  <Badge variant="outline" className={`${getStatusColor(list.status)} text-white border-0`}>
                    {list.status}
                  </Badge>
                  <Button variant="outline" size="sm">
                    Edit
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => deleteList(list.id)}
                    className="text-red-600 hover:text-red-700 hover:bg-red-50"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ))}

            {callLists.length === 0 && (
              <div className="text-center py-8 text-gray-500">
                <Users className="mx-auto h-12 w-12 text-gray-300 mb-4" />
                <p>No call lists imported yet</p>
                <p className="text-sm">Upload a CSV file or paste contact data to get started</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
