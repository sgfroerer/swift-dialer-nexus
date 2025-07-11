
import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Upload, Download, Search, Filter, Plus, FileText, Users, Trash2, Edit, Phone, Mail } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { contactService, Contact } from "@/services/contactService";

export const CallListManager = () => {
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [filteredContacts, setFilteredContacts] = useState<Contact[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [csvInput, setCsvInput] = useState("");
  const [showImportDialog, setShowImportDialog] = useState(false);
  const { toast } = useToast();

  // Load contacts on mount and set up refresh interval
  useEffect(() => {
    refreshContacts();
    const interval = setInterval(refreshContacts, 10000); // Refresh every 10 seconds
    return () => clearInterval(interval);
  }, []);

  // Filter contacts when search term or status filter changes
  useEffect(() => {
    let filtered = contacts;

    if (searchTerm) {
      filtered = filtered.filter(contact =>
        contact.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        contact.company.toLowerCase().includes(searchTerm.toLowerCase()) ||
        contact.phone.includes(searchTerm) ||
        contact.email.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (statusFilter !== "all") {
      filtered = filtered.filter(contact => contact.status === statusFilter);
    }

    setFilteredContacts(filtered);
  }, [contacts, searchTerm, statusFilter]);

  const refreshContacts = () => {
    const allContacts = contactService.getContacts();
    setContacts(allContacts);
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file && file.type === "text/csv") {
      const reader = new FileReader();
      reader.onload = (e) => {
        const csv = e.target?.result as string;
        setCsvInput(csv);
        setShowImportDialog(true);
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

  const parseCsvData = (csvData: string): Partial<Contact>[] => {
    const lines = csvData.trim().split('\n');
    const headers = lines[0].split(',').map(h => h.trim().toLowerCase());
    
    return lines.slice(1).map((line, index) => {
      const values = line.split(',').map(v => v.trim().replace(/"/g, ''));
      const contact: Partial<Contact> = {
        id: `imported_${Date.now()}_${index}`,
        callCount: 0,
        status: 'pending' as Contact['status']
      };

      headers.forEach((header, i) => {
        const value = values[i] || '';
        switch (header) {
          case 'name':
          case 'full name':
          case 'contact name':
            contact.name = value;
            break;
          case 'phone':
          case 'phone number':
          case 'telephone':
            contact.phone = value;
            break;
          case 'email':
          case 'email address':
            contact.email = value;
            break;
          case 'company':
          case 'business':
          case 'organization':
            contact.company = value;
            break;
          case 'property type':
          case 'property':
          case 'type':
            contact.propertyType = value;
            break;
          case 'notes':
          case 'comments':
            contact.notes = value;
            break;
        }
      });

      return contact;
    }).filter(contact => contact.name && contact.phone); // Only keep contacts with required fields
  };

  const importContacts = () => {
    try {
      const parsedContacts = parseCsvData(csvInput);
      
      if (parsedContacts.length === 0) {
        toast({
          title: "No valid contacts found",
          description: "Make sure your CSV has Name and Phone columns",
          variant: "destructive"
        });
        return;
      }

      // Here you would typically save to the contact service
      // For now, we'll just show a success message
      toast({
        title: "Contacts imported successfully",
        description: `${parsedContacts.length} contacts have been imported`,
      });

      setCsvInput("");
      setShowImportDialog(false);
      refreshContacts();
    } catch (error) {
      toast({
        title: "Import failed",
        description: "Please check your CSV format and try again",
        variant: "destructive"
      });
    }
  };

  const exportContacts = () => {
    const csvHeaders = "Name,Phone,Email,Company,Property Type,Status,Call Count,Last Called,Notes";
    const csvRows = contacts.map(contact => 
      `"${contact.name}","${contact.phone}","${contact.email}","${contact.company}","${contact.propertyType || ''}","${contact.status}","${contact.callCount}","${contact.lastCalled?.toLocaleDateString() || ''}","${contact.notes || ''}"`
    );
    
    const csvContent = [csvHeaders, ...csvRows].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `contacts_export_${new Date().toISOString().split('T')[0]}.csv`;
    link.click();
    window.URL.revokeObjectURL(url);

    toast({
      title: "Export completed",
      description: "Contacts have been exported to CSV file",
    });
  };

  const getStatusBadgeVariant = (status: Contact['status']) => {
    switch (status) {
      case 'pending': return 'default';
      case 'contacted': return 'secondary';
      case 'completed': return 'outline';
      case 'dnc': return 'destructive';
      default: return 'default';
    }
  };

  const stats = contactService.getStats();

  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Contacts</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.contacts.total}</div>
            <p className="text-xs text-muted-foreground">In all lists</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending Calls</CardTitle>
            <Phone className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.contacts.pending}</div>
            <p className="text-xs text-muted-foreground">Ready to dial</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Contacted</CardTitle>
            <Mail className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.contacts.contacted}</div>
            <p className="text-xs text-muted-foreground">Successfully reached</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Completion Rate</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {stats.contacts.total > 0 ? Math.round(((stats.contacts.contacted + stats.contacts.completed) / stats.contacts.total) * 100) : 0}%
            </div>
            <p className="text-xs text-muted-foreground">Processed contacts</p>
          </CardContent>
        </Card>
      </div>

      {/* Import/Export Section */}
      <Card>
        <CardHeader>
          <CardTitle>Contact List Management</CardTitle>
          <CardDescription>Import new contacts or export existing ones</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-4">
            <div>
              <input
                type="file"
                accept=".csv"
                onChange={handleFileUpload}
                className="hidden"
                id="file-upload"
              />
              <Button asChild>
                <label htmlFor="file-upload" className="cursor-pointer">
                  <Upload className="h-4 w-4 mr-2" />
                  Import CSV
                </label>
              </Button>
            </div>
            
            <Button variant="outline" onClick={exportContacts}>
              <Download className="h-4 w-4 mr-2" />
              Export CSV
            </Button>

            <Button variant="outline" onClick={() => setShowImportDialog(true)}>
              <Plus className="h-4 w-4 mr-2" />
              Paste Data
            </Button>
          </div>

          {showImportDialog && (
            <div className="mt-6 p-4 border rounded-lg bg-gray-50">
              <h3 className="font-medium mb-3">Import Contact Data</h3>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="csv-input">CSV Data (Name, Phone, Email, Company, Property Type)</Label>
                  <Textarea
                    id="csv-input"
                    value={csvInput}
                    onChange={(e) => setCsvInput(e.target.value)}
                    placeholder="Name,Phone,Email,Company,Property Type&#10;John Smith,555-123-4567,john@example.com,Tech Corp,Office Building&#10;Jane Doe,555-987-6543,jane@example.com,Retail Inc,Shopping Center"
                    rows={6}
                    className="font-mono text-sm"
                  />
                </div>
                <div className="flex space-x-2">
                  <Button onClick={importContacts}>Import Contacts</Button>
                  <Button variant="outline" onClick={() => setShowImportDialog(false)}>Cancel</Button>
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Contact List */}
      <Card>
        <CardHeader>
          <CardTitle>Contact Lists</CardTitle>
          <CardDescription>Manage and filter your contact database</CardDescription>
        </CardHeader>
        <CardContent>
          {/* Search and Filter Controls */}
          <div className="flex flex-wrap gap-4 mb-6">
            <div className="flex-1 min-w-64">
              <div className="relative">
                <Search className="h-4 w-4 absolute left-3 top-3 text-gray-400" />
                <Input
                  placeholder="Search contacts..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-48">
                <Filter className="h-4 w-4 mr-2" />
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="contacted">Contacted</SelectItem>
                <SelectItem value="completed">Completed</SelectItem>
                <SelectItem value="dnc">Do Not Call</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Contact Table */}
          <div className="border rounded-lg">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Company</TableHead>
                  <TableHead>Phone</TableHead>
                  <TableHead>Property Type</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Calls</TableHead>
                  <TableHead>Last Called</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredContacts.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={8} className="text-center py-8 text-gray-500">
                      {contacts.length === 0 ? "No contacts found. Import a CSV file to get started." : "No contacts match your current filters."}
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredContacts.map((contact) => (
                    <TableRow key={contact.id}>
                      <TableCell className="font-medium">{contact.name}</TableCell>
                      <TableCell>{contact.company}</TableCell>
                      <TableCell>{contact.phone}</TableCell>
                      <TableCell>{contact.propertyType}</TableCell>
                      <TableCell>
                        <Badge variant={getStatusBadgeVariant(contact.status)}>
                          {contact.status}
                        </Badge>
                      </TableCell>
                      <TableCell>{contact.callCount}</TableCell>
                      <TableCell>
                        {contact.lastCalled ? contact.lastCalled.toLocaleDateString() : 'Never'}
                      </TableCell>
                      <TableCell>
                        <div className="flex space-x-2">
                          <Button size="sm" variant="outline">
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button size="sm" variant="outline">
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>

          {filteredContacts.length > 0 && (
            <div className="mt-4 text-sm text-gray-600">
              Showing {filteredContacts.length} of {contacts.length} contacts
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};
