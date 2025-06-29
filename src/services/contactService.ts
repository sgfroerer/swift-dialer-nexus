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

// Test contact data with invalid phone numbers for testing
export const sampleContacts: Contact[] = [
  {
    id: "1",
    name: "Michael Thompson",
    phone: "(206) 783-2704",
    email: "m.thompson@seattleretail.com",
    company: "Seattle Retail Properties",
    propertyType: "shopping center",
    notes: "Owns 3 retail locations in Seattle area, prefers morning calls",
    callCount: 0,
    status: 'pending'
  },
  {
    id: "2",
    name: "Sarah Martinez",
    phone: "(541) 343-7672",
    email: "sarah.martinez@oregoncommercial.com",
    company: "Oregon Commercial Group",
    propertyType: "office building",
    notes: "Decision maker for commercial investments, interested in tax benefits",
    callCount: 0,
    status: 'pending'
  },
  {
    id: "3",
    name: "David Chen",
    phone: "(503) 378-0883",
    email: "dchen@portlandproperties.com",
    company: "Portland Properties LLC",
    propertyType: "mixed-use development",
    notes: "Looking to expand portfolio, has budget of $2M+",
    callCount: 1,
    status: 'pending',
    lastCalled: new Date(Date.now() - 86400000)
  },
  {
    id: "4",
    name: "Jennifer Wilson",
    phone: "(503) 589-0640",
    email: "j.wilson@westcoastinvest.com",
    company: "West Coast Investments",
    propertyType: "retail strip center",
    notes: "Prefers email first, then follow-up call. Very detail-oriented",
    callCount: 0,
    status: 'pending'
  },
  {
    id: "5",
    name: "Robert Johnson",
    phone: "(650) 574-4405",
    email: "rjohnson@bayareacommercial.com",
    company: "Bay Area Commercial",
    propertyType: "warehouse complex",
    notes: "High-value client, owns multiple properties in Silicon Valley",
    callCount: 2,
    status: 'contacted',
    lastCalled: new Date(Date.now() - 172800000)
  },
  {
    id: "6",
    name: "Lisa Rodriguez",
    phone: "(541) 479-7797",
    email: "lisa.r@southernoregonrealty.com",
    company: "Southern Oregon Realty",
    propertyType: "office building",
    notes: "Interested in 1031 exchanges, has several properties to sell",
    callCount: 0,
    status: 'pending'
  },
  {
    id: "7",
    name: "Mark Anderson",
    phone: "(541) 512-9426",
    email: "manderson@bendcommercial.com",
    company: "Bend Commercial Properties",
    propertyType: "retail space",
    notes: "Expanding into Central Oregon market, looking for retail opportunities",
    callCount: 0,
    status: 'pending'
  },
  {
    id: "8",
    name: "Amanda Foster",
    phone: "(541) 857-0370",
    email: "afoster@eastoregondev.com",
    company: "Eastern Oregon Development",
    propertyType: "industrial complex",
    notes: "Specializes in industrial properties, very responsive to calls",
    callCount: 1,
    status: 'pending',
    lastCalled: new Date(Date.now() - 259200000)
  },
  {
    id: "9",
    name: "James Parker",
    phone: "(541) 826-7357",
    email: "jparker@medfordproperties.com",
    company: "Medford Properties Inc",
    propertyType: "shopping mall",
    notes: "Owns regional shopping centers, interested in expansion",
    callCount: 0,
    status: 'pending'
  },
  {
    id: "10",
    name: "Michelle Davis",
    phone: "(503) 203-8285",
    email: "mdavis@portlandretail.com",
    company: "Portland Retail Ventures",
    propertyType: "retail strip center",
    notes: "Focus on neighborhood retail centers, prefers afternoon calls",
    callCount: 0,
    status: 'pending'
  },
  {
    id: "11",
    name: "Christopher Lee",
    phone: "(425) 392-1381",
    email: "clee@seattlecommercial.com",
    company: "Seattle Commercial Group",
    propertyType: "office building",
    notes: "Tech industry focus, looking for office spaces near transit",
    callCount: 0,
    status: 'pending'
  },
  {
    id: "12",
    name: "Nicole Brown",
    phone: "(425) 961-0173",
    email: "nbrown@bellevueinvest.com",
    company: "Bellevue Investment Partners",
    propertyType: "mixed-use development",
    notes: "Luxury market specialist, high-end commercial properties only",
    callCount: 1,
    status: 'pending',
    lastCalled: new Date(Date.now() - 345600000)
  },
  {
    id: "13",
    name: "Kevin Miller",
    phone: "(541) 849-2719",
    email: "kmiller@coastalcommercial.com",
    company: "Coastal Commercial Properties",
    propertyType: "retail space",
    notes: "Coastal Oregon properties, seasonal business considerations",
    callCount: 0,
    status: 'pending'
  },
  {
    id: "14",
    name: "Rachel Green",
    phone: "(503) 393-6632",
    email: "rgreen@salemproperties.com",
    company: "Salem Properties LLC",
    propertyType: "office building",
    notes: "Government contractor focus, stable long-term tenants preferred",
    callCount: 0,
    status: 'pending'
  },
  {
    id: "15",
    name: "Daniel White",
    phone: "(541) 686-6286",
    email: "dwhite@eugenecommercial.com",
    company: "Eugene Commercial Real Estate",
    propertyType: "industrial complex",
    notes: "University area properties, student housing and commercial mix",
    callCount: 2,
    status: 'contacted',
    lastCalled: new Date(Date.now() - 432000000)
  },
  {
    id: "16",
    name: "Stephanie Taylor",
    phone: "(541) 484-4466",
    email: "staylor@lanecountydev.com",
    company: "Lane County Development",
    propertyType: "warehouse complex",
    notes: "Large-scale development projects, minimum $5M investments",
    callCount: 0,
    status: 'pending'
  },
  {
    id: "17",
    name: "Brian Clark",
    phone: "(503) 393-8027",
    email: "bclark@willamettevalley.com",
    company: "Willamette Valley Properties",
    propertyType: "retail space",
    notes: "Agricultural area retail, seasonal fluctuations in business",
    callCount: 0,
    status: 'pending'
  },
  {
    id: "18",
    name: "Angela Martinez",
    phone: "(541) 512-0294",
    email: "amartinez@centraloregon.com",
    company: "Central Oregon Investments",
    propertyType: "mixed-use development",
    notes: "Tourism-focused properties, vacation rental considerations",
    callCount: 1,
    status: 'pending',
    lastCalled: new Date(Date.now() - 518400000)
  },
  {
    id: "19",
    name: "Thomas Wilson",
    phone: "(708) 639-4050",
    email: "twilson@chicagocommercial.com",
    company: "Chicago Commercial Group",
    propertyType: "office building",
    notes: "Midwest expansion, looking for Pacific Northwest opportunities",
    callCount: 0,
    status: 'pending'
  },
  {
    id: "20",
    name: "Laura Johnson",
    phone: "(541) 686-6255",
    email: "ljohnson@springfielddev.com",
    company: "Springfield Development Co",
    propertyType: "shopping center",
    notes: "Family business, multi-generational property ownership",
    callCount: 0,
    status: 'pending'
  },
  {
    id: "21",
    name: "Matthew Garcia",
    phone: "(503) 540-4130",
    email: "mgarcia@tigardproperties.com",
    company: "Tigard Properties Inc",
    propertyType: "retail strip center",
    notes: "Suburban retail focus, family-oriented shopping centers",
    callCount: 0,
    status: 'pending'
  },
  {
    id: "22",
    name: "Jessica Adams",
    phone: "(541) 758-4611",
    email: "jadams@corvalliscommercial.com",
    company: "Corvallis Commercial Real Estate",
    propertyType: "office building",
    notes: "University town properties, stable academic market",
    callCount: 1,
    status: 'pending',
    lastCalled: new Date(Date.now() - 604800000)
  },
  {
    id: "23",
    name: "Ryan Thompson",
    phone: "(541) 928-2838",
    email: "rthompson@klamathfalls.com",
    company: "Klamath Falls Development",
    propertyType: "industrial complex",
    notes: "Rural industrial properties, agriculture-related businesses",
    callCount: 0,
    status: 'pending'
  },
  {
    id: "24",
    name: "Melissa Rodriguez",
    phone: "(503) 257-7071",
    email: "mrodriguez@greshamproperties.com",
    company: "Gresham Properties LLC",
    propertyType: "warehouse complex",
    notes: "Distribution center focus, proximity to transportation hubs",
    callCount: 0,
    status: 'pending'
  },
  {
    id: "25",
    name: "Andrew Davis",
    phone: "(503) 246-4923",
    email: "adavis@lakeoswegocommercial.com",
    company: "Lake Oswego Commercial",
    propertyType: "retail space",
    notes: "Upscale retail properties, high-end clientele focus",
    callCount: 2,
    status: 'contacted',
    lastCalled: new Date(Date.now() - 691200000)
  },
  {
    id: "26",
    name: "Kimberly Lee",
    phone: "(503) 697-4910",
    email: "klee@beavertondev.com",
    company: "Beaverton Development Group",
    propertyType: "mixed-use development",
    notes: "Transit-oriented development, mixed residential/commercial",
    callCount: 0,
    status: 'pending'
  },
  {
    id: "27",
    name: "Joseph Brown",
    phone: "(503) 635-9555",
    email: "jbrown@milwaukieproperties.com",
    company: "Milwaukie Properties Inc",
    propertyType: "office building",
    notes: "Historic district properties, renovation and preservation focus",
    callCount: 0,
    status: 'pending'
  },
  {
    id: "28",
    name: "Samantha Wilson",
    phone: "(541) 741-8852",
    email: "swilson@albanycommercial.com",
    company: "Albany Commercial Real Estate",
    propertyType: "industrial complex",
    notes: "Manufacturing properties, heavy industrial zoning preferred",
    callCount: 1,
    status: 'pending',
    lastCalled: new Date(Date.now() - 777600000)
  },
  {
    id: "29",
    name: "Charles Martinez",
    phone: "(503) 364-7980",
    email: "cmartinez@salemdev.com",
    company: "Salem Development Partners",
    propertyType: "shopping center",
    notes: "State capital area properties, government employee market",
    callCount: 0,
    status: 'pending'
  },
  {
    id: "30",
    name: "Rebecca Taylor",
    phone: "(814) 459-7704",
    email: "rtaylor@pennsylvaniaproperties.com",
    company: "Pennsylvania Properties Group",
    propertyType: "office building",
    notes: "East Coast investor looking for West Coast opportunities",
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