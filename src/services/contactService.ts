
export interface Contact {
  id: string;
  name: string;
  phone: string;
  email: string;
  company: string;
  notes?: string;
  propertyType?: string;
  lastCalled?: Date;
  callCount: number;
  disposition?: string;
  status: 'pending' | 'contacted' | 'completed' | 'dnc';
  tags?: string[];
}

export interface CallHistory {
  id: string;
  contactId: string;
  timestamp: Date;
  duration: number;
  disposition: string;
  notes: string;
  outcome: 'connected' | 'voicemail' | 'no-answer' | 'busy' | 'failed';
}

// Sample contact data
export const sampleContacts: Contact[] = [
  {
    id: "1",
    name: "John Smith",
    phone: "+1 (555) 123-4567",
    email: "john.smith@techcorp.com",
    company: "TechCorp Solutions",
    propertyType: "retail strip center",
    notes: "Interested in enterprise solutions, prefers morning calls",
    callCount: 0,
    status: 'pending'
  },
  {
    id: "2",
    name: "Sarah Johnson",
    phone: "+1 (555) 234-5678",
    email: "sarah@retailplus.com",
    company: "Retail Plus",
    propertyType: "shopping mall",
    notes: "Owner of 3 properties, very busy schedule",
    callCount: 1,
    status: 'pending',
    lastCalled: new Date(Date.now() - 86400000) // Yesterday
  },
  {
    id: "3",
    name: "Mike Chen",
    phone: "+1 (555) 345-6789",
    email: "m.chen@propertygroup.com",
    company: "Property Investment Group",
    propertyType: "office building",
    notes: "Looking to expand portfolio, interested in REITs",
    callCount: 0,
    status: 'pending'
  },
  {
    id: "4",
    name: "Lisa Rodriguez",
    phone: "+1 (555) 456-7890",
    email: "lisa.r@commercialwest.com",
    company: "Commercial West",
    propertyType: "warehouse complex",
    notes: "Prefers email first, then phone follow-up",
    callCount: 2,
    status: 'contacted',
    lastCalled: new Date(Date.now() - 172800000) // 2 days ago
  },
  {
    id: "5",
    name: "David Wilson",
    phone: "+1 (555) 567-8901",
    email: "dwilson@investcorp.com",
    company: "Invest Corp",
    propertyType: "mixed-use development",
    notes: "High-value client, decision maker",
    callCount: 0,
    status: 'pending'
  }
];

export class ContactService {
  private contacts: Contact[] = [...sampleContacts];
  private callHistory: CallHistory[] = [];

  getContacts(status?: Contact['status']): Contact[] {
    if (status) {
      return this.contacts.filter(c => c.status === status);
    }
    return [...this.contacts];
  }

  getNextContact(): Contact | null {
    const pendingContacts = this.contacts.filter(c => c.status === 'pending');
    if (pendingContacts.length === 0) return null;
    
    // Sort by call count (ascending) and last called (oldest first)
    return pendingContacts.sort((a, b) => {
      if (a.callCount !== b.callCount) {
        return a.callCount - b.callCount;
      }
      if (a.lastCalled && b.lastCalled) {
        return a.lastCalled.getTime() - b.lastCalled.getTime();
      }
      return a.lastCalled ? 1 : -1;
    })[0];
  }

  updateContact(contactId: string, updates: Partial<Contact>): void {
    const index = this.contacts.findIndex(c => c.id === contactId);
    if (index !== -1) {
      this.contacts[index] = { ...this.contacts[index], ...updates };
    }
  }

  logCall(contactId: string, disposition: string, notes: string, outcome: CallHistory['outcome'], duration: number = 0): void {
    const contact = this.contacts.find(c => c.id === contactId);
    if (contact) {
      // Update contact
      contact.callCount += 1;
      contact.lastCalled = new Date();
      contact.disposition = disposition;
      
      // Update status based on disposition
      if (disposition === 'do-not-call') {
        contact.status = 'dnc';
      } else if (['connected', 'callback'].includes(disposition)) {
        contact.status = 'contacted';
      }

      // Log call history
      this.callHistory.push({
        id: Date.now().toString(),
        contactId,
        timestamp: new Date(),
        duration,
        disposition,
        notes,
        outcome
      });
    }
  }

  getCallHistory(contactId?: string): CallHistory[] {
    if (contactId) {
      return this.callHistory.filter(h => h.contactId === contactId);
    }
    return [...this.callHistory];
  }

  getStats() {
    const total = this.contacts.length;
    const pending = this.contacts.filter(c => c.status === 'pending').length;
    const contacted = this.contacts.filter(c => c.status === 'contacted').length;
    const completed = this.contacts.filter(c => c.status === 'completed').length;
    const dnc = this.contacts.filter(c => c.status === 'dnc').length;
    
    const totalCalls = this.callHistory.length;
    const connected = this.callHistory.filter(h => h.outcome === 'connected').length;
    const connectionRate = totalCalls > 0 ? (connected / totalCalls) * 100 : 0;

    return {
      contacts: { total, pending, contacted, completed, dnc },
      calls: { total: totalCalls, connected, connectionRate: Math.round(connectionRate) }
    };
  }
}

export const contactService = new ContactService();
