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
  call_list_id: number;
}

export interface CallList {
  id: number;
  name: string;
}

const API_BASE_URL = "/api";

export const contactService = {
  async getCallLists(): Promise<CallList[]> {
    const response = await fetch(`${API_BASE_URL}/call-lists`);
    if (!response.ok) {
      throw new Error("Failed to fetch call lists");
    }
    return response.json();
  },

  async createCallList(name: string): Promise<CallList> {
    const response = await fetch(`${API_BASE_URL}/call-lists`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ name }),
    });
    if (!response.ok) {
      throw new Error("Failed to create call list");
    }
    return response.json();
  },

  async getContacts(callListId?: number): Promise<Contact[]> {
    let url = `${API_BASE_URL}/contacts`;
    if (callListId) {
      url += `?call_list_id=${callListId}`;
    }
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error("Failed to fetch contacts");
    }
    return response.json();
  },

  async createContact(contact: Omit<Contact, 'id' | 'callCount' | 'status' | 'lastCalled' | 'disposition' | 'tags'>): Promise<Contact> {
    const response = await fetch(`${API_BASE_URL}/contacts`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(contact),
    });
    if (!response.ok) {
      throw new Error("Failed to create contact");
    }
    return response.json();
  },

  async updateContact(id: string, updates: Partial<Contact>): Promise<Contact> {
    const response = await fetch(`${API_BASE_URL}/contacts/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(updates),
    });
    if (!response.ok) {
      throw new Error("Failed to update contact");
    }
    return response.json();
  },

  async deleteContact(id: string): Promise<void> {
    const response = await fetch(`${API_BASE_URL}/contacts/${id}`, {
      method: "DELETE",
    });
    if (!response.ok) {
      throw new Error("Failed to delete contact");
    }
  },
};