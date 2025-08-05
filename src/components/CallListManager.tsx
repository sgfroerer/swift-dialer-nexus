import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { Upload, Download, Search, Filter, Plus, FileText, Users, Trash2, Edit, Phone, Mail, Loader2, Save, X } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { contactService, Contact, CallList } from "@/services/contactService";

export const CallListManager = () => {
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [filteredContacts, setFilteredContacts] = useState<Contact[]>([]);
  const [callLists, setCallLists] = useState<CallList[]>([]);
  const [selectedCallList, setSelectedCallList] = useState<number | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [editingContact, setEditingContact] = useState<Contact | null>(null);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [contactToDelete, setContactToDelete] = useState<Contact | null>(null);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isCreateListDialogOpen, setIsCreateListDialogOpen] = useState(false);
  const [newCallListName, setNewCallListName] = useState("");

  const { toast } = useToast();

  useEffect(() => {
    fetchCallLists();
  }, []);

  useEffect(() => {
    if (selectedCallList) {
      fetchContacts(selectedCallList);
    } else {
      setContacts([]);
    }
  }, [selectedCallList]);

  useEffect(() => {
    let filtered = contacts;

    if (searchTerm) {
      filtered = filtered.filter(contact =>
        contact.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (contact.company && contact.company.toLowerCase().includes(searchTerm.toLowerCase())) ||
        contact.phone.includes(searchTerm) ||
        (contact.email && contact.email.toLowerCase().includes(searchTerm.toLowerCase()))
      );
    }

    if (statusFilter !== "all") {
      filtered = filtered.filter(contact => contact.status === statusFilter);
    }

    setFilteredContacts(filtered);
  }, [contacts, searchTerm, statusFilter]);

  const fetchCallLists = async () => {
    try {
      const lists = await contactService.getCallLists();
      setCallLists(lists);
      if (lists.length > 0 && !selectedCallList) {
        setSelectedCallList(lists[0].id);
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Could not fetch call lists",
        variant: "destructive",
      });
    }
  };

  const fetchContacts = async (callListId: number) => {
    setIsLoading(true);
    try {
      const contacts = await contactService.getContacts(callListId);
      setContacts(contacts);
    } catch (error) {
      toast({
        title: "Error",
        description: "Could not fetch contacts",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreateCallList = async () => {
    if (!newCallListName) return;
    try {
      await contactService.createCallList(newCallListName);
      setNewCallListName("");
      setIsCreateListDialogOpen(false);
      fetchCallLists();
      toast({
        title: "Success",
        description: "Call list created successfully",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Could not create call list",
        variant: "destructive",
      });
    }
  };

  const handleEditContact = (contact: Contact) => {
    setEditingContact({ ...contact });
    setIsEditDialogOpen(true);
  };

  const handleSaveContact = async () => {
    if (!editingContact) return;
    
    setIsLoading(true);
    
    try {
      await contactService.updateContact(editingContact.id, editingContact);
      if (selectedCallList) {
        fetchContacts(selectedCallList);
      }
      setIsEditDialogOpen(false);
      setEditingContact(null);
      
      toast({
        title: "Contact updated",
        description: "Contact information has been saved successfully",
      });
    } catch (error) {
      toast({
        title: "Update failed",
        description: "Could not save contact changes",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteContact = (contact: Contact) => {
    setContactToDelete(contact);
    setIsDeleteDialogOpen(true);
  };

  const confirmDeleteContact = async () => {
    if (!contactToDelete) return;
    
    setIsLoading(true);
    
    try {
      await contactService.deleteContact(contactToDelete.id);
      if (selectedCallList) {
        fetchContacts(selectedCallList);
      }
      
      toast({
        title: "Contact deleted",
        description: `${contactToDelete.name} has been removed from your contacts`,
      });
      
      setIsDeleteDialogOpen(false);
      setContactToDelete(null);
    } catch (error) {
      toast({
        title: "Delete failed",
        description: "Could not delete contact",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
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

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Contact List Management</CardTitle>
          <CardDescription>Select a call list to manage or create a new one.</CardDescription>
        </CardHeader>
        <CardContent className="flex gap-4">
          <Select onValueChange={(value) => setSelectedCallList(Number(value))} value={selectedCallList?.toString()}>
            <SelectTrigger className="w-72">
              <SelectValue placeholder="Select a call list" />
            </SelectTrigger>
            <SelectContent>
              {callLists.map((list) => (
                <SelectItem key={list.id} value={list.id.toString()}>
                  {list.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Button onClick={() => setIsCreateListDialogOpen(true)}>
            <Plus className="h-4 w-4 mr-2" />
            Create New List
          </Button>
        </CardContent>
      </Card>

      {/* Contact List */}
      <Card>
        <CardHeader>
          <CardTitle>Contacts</CardTitle>
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
                {isLoading ? (
                  <TableRow>
                    <TableCell colSpan={8} className="text-center py-8 text-gray-500">
                      <Loader2 className="h-8 w-8 animate-spin mx-auto" />
                    </TableCell>
                  </TableRow>
                ) : filteredContacts.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={8} className="text-center py-8 text-gray-500">
                      {contacts.length === 0 ? "No contacts found in this list." : "No contacts match your current filters."}
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredContacts.map((contact) => (
                    <TableRow key={contact.id} className="hover:bg-gray-50 transition-colors">
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
                        {contact.lastCalled ? new Date(contact.lastCalled).toLocaleDateString() : 'Never'}
                      </TableCell>
                      <TableCell>
                        <div className="flex space-x-2">
                          <Button 
                            size="sm" 
                            variant="outline"
                            onClick={() => handleEditContact(contact)}
                            className="hover:scale-110 transition-transform"
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button 
                            size="sm" 
                            variant="outline"
                            onClick={() => handleDeleteContact(contact)}
                            className="hover:scale-110 transition-transform hover:bg-red-50 hover:border-red-200"
                          >
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

      {/* Edit Contact Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Edit Contact</DialogTitle>
            <DialogDescription>
              Update contact information and save changes.
            </DialogDescription>
          </DialogHeader>
          
          {editingContact && (
            <div className="space-y-4">
              <div>
                <Label htmlFor="edit-name">Name</Label>
                <Input
                  id="edit-name"
                  value={editingContact.name}
                  onChange={(e) => setEditingContact({...editingContact, name: e.target.value})}
                />
              </div>
              
              <div>
                <Label htmlFor="edit-phone">Phone</Label>
                <Input
                  id="edit-phone"
                  value={editingContact.phone}
                  onChange={(e) => setEditingContact({...editingContact, phone: e.target.value})}
                />
              </div>
              
              <div>
                <Label htmlFor="edit-email">Email</Label>
                <Input
                  id="edit-email"
                  value={editingContact.email}
                  onChange={(e) => setEditingContact({...editingContact, email: e.target.value})}
                />
              </div>
              
              <div>
                <Label htmlFor="edit-company">Company</Label>
                <Input
                  id="edit-company"
                  value={editingContact.company}
                  onChange={(e) => setEditingContact({...editingContact, company: e.target.value})}
                />
              </div>
              
              <div>
                <Label htmlFor="edit-property-type">Property Type</Label>
                <Input
                  id="edit-property-type"
                  value={editingContact.propertyType || ''}
                  onChange={(e) => setEditingContact({...editingContact, propertyType: e.target.value})}
                />
              </div>
              
              <div>
                <Label htmlFor="edit-notes">Notes</Label>
                <Textarea
                  id="edit-notes"
                  value={editingContact.notes || ''}
                  onChange={(e) => setEditingContact({...editingContact, notes: e.target.value})}
                  rows={3}
                />
              </div>
            </div>
          )}
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>
              <X className="h-4 w-4 mr-2" />
              Cancel
            </Button>
            <Button onClick={handleSaveContact} disabled={isLoading}>
              {isLoading ? (
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              ) : (
                <Save className="h-4 w-4 mr-2" />
              )}
              Save Changes
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Contact</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete <strong>{contactToDelete?.name}</strong>? 
              This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction 
              onClick={confirmDeleteContact}
              className="bg-red-600 hover:bg-red-700"
              disabled={isLoading}
            >
              {isLoading ? (
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              ) : (
                <Trash2 className="h-4 w-4 mr-2" />
              )}
              Delete Contact
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Create Call List Dialog */}
      <Dialog open={isCreateListDialogOpen} onOpenChange={setIsCreateListDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Create New Call List</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="new-call-list-name">List Name</Label>
              <Input
                id="new-call-list-name"
                value={newCallListName}
                onChange={(e) => setNewCallListName(e.target.value)}
                placeholder="e.g. High Priority Leads"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsCreateListDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleCreateCallList}>
              Create List
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};