export interface SalesScriptTemplate {
  id: string;
  name: string;
  content: string;
  isDefault: boolean;
}

export interface TextMessageTemplate {
  id: string;
  name: string;
  content: string;
  isDefault: boolean;
}

// Default Sales Script Templates
export const defaultSalesScripts: SalesScriptTemplate[] = [
  {
    id: 'default-retail',
    name: 'Retail Property Focus',
    content: `Hi {name}, this is Sam Gfroerer from M&M Real Estate Investment Services.

I'm calling because I specialize in helping property owners like yourself maximize returns on retail investment properties, particularly {propertyType} investments.

I noticed you own property with {company}, and I'd love to discuss some strategies that have helped my other clients increase their property values by 15-30%.

Do you have 3 minutes to discuss how this could benefit your portfolio?`,
    isDefault: true
  },
  {
    id: 'commercial-general',
    name: 'General Commercial',
    content: `Hello {name}, this is Sam from M&M Real Estate Investment Services.

I'm reaching out because we specialize in commercial real estate investments and I believe we could help optimize your {propertyType} investment.

We've been working with property owners in your area and have some unique strategies that could significantly increase your property's value and cash flow.

Would you be interested in a brief conversation about how we might be able to help with your commercial real estate portfolio?`,
    isDefault: true
  },
  {
    id: 'value-proposition',
    name: 'Value-First Approach',
    content: `Hi {name}, Sam Gfroerer calling from M&M Real Estate Investment Services.

I'm calling because I have some market insights specific to {propertyType} properties that I think you'd find valuable.

We've recently helped several property owners in your market increase their NOI by 20-25% through strategic improvements and tenant optimization.

I'd love to share some of these insights with you - do you have a few minutes to discuss your property at {company}?`,
    isDefault: true
  }
];

// Default Text Message Templates
export const defaultTextTemplates: TextMessageTemplate[] = [
  {
    id: 'standard-intro',
    name: 'Standard Introduction',
    content: `Hi {name}, this is Sam Gfroerer with M&M. I just tried giving you a quick call — I specialize in retail investment properties and wanted to connect regarding your {propertyType}. Let me know if there's a good time to chat, or feel free to text back. Looking forward to connecting!`,
    isDefault: true
  },
  {
    id: 'brief-followup',
    name: 'Brief Follow-up',
    content: `Hi {name}, Sam from M&M here. Just called about your {propertyType}. I help investors with retail properties - would love to connect when you have a moment. Text or call back when convenient!`,
    isDefault: true
  },
  {
    id: 'value-proposition-text',
    name: 'Value Proposition',
    content: `Hi {name}, this is Sam with M&M. I specialize in maximizing returns on retail investment properties like your {propertyType}. Just tried calling - would appreciate a few minutes to discuss how I can help. Feel free to text back!`,
    isDefault: true
  },
  {
    id: 'email-followup',
    name: 'Email Follow-up',
    content: `Hi {name}, Sam from M&M Real Estate. I tried calling about your {propertyType} investment. I'll send you an email with some market insights that might interest you. Feel free to call or text back if you'd like to discuss further.`,
    isDefault: true
  }
];

// localStorage keys
const TEMPLATE_STORAGE_KEYS = {
  SALES_SCRIPTS: 'opendialer_sales_scripts',
  TEXT_TEMPLATES: 'opendialer_text_templates',
  ACTIVE_SALES_SCRIPT: 'opendialer_active_sales_script',
  CUSTOM_SALES_SCRIPT: 'opendialer_custom_sales_script',
  CUSTOM_TEXT_TEMPLATES: 'opendialer_custom_text_templates'
} as const;

// Utility functions for localStorage
const saveToStorage = (key: string, data: any): void => {
  try {
    localStorage.setItem(key, JSON.stringify(data));
  } catch (error) {
    console.error(`Failed to save templates to localStorage (${key}):`, error);
  }
};

const loadFromStorage = <T>(key: string, defaultValue: T): T => {
  try {
    const item = localStorage.getItem(key);
    if (!item) return defaultValue;
    return JSON.parse(item);
  } catch (error) {
    console.error(`Failed to load templates from localStorage (${key}):`, error);
    return defaultValue;
  }
};

export class TemplateService {
  private salesScripts: SalesScriptTemplate[] = [];
  private textTemplates: TextMessageTemplate[] = [];
  private activeSalesScriptId: string = '';
  private customSalesScript: string = '';
  private customTextTemplates: { [key: string]: string } = {};

  constructor() {
    this.initializeTemplates();
  }

  private initializeTemplates(): void {
    // Load sales scripts
    const savedSalesScripts = loadFromStorage(TEMPLATE_STORAGE_KEYS.SALES_SCRIPTS, []);
    if (savedSalesScripts.length === 0) {
      this.salesScripts = [...defaultSalesScripts];
      this.saveTemplates();
    } else {
      this.salesScripts = savedSalesScripts;
    }

    // Load text templates
    const savedTextTemplates = loadFromStorage(TEMPLATE_STORAGE_KEYS.TEXT_TEMPLATES, []);
    if (savedTextTemplates.length === 0) {
      this.textTemplates = [...defaultTextTemplates];
      this.saveTemplates();
    } else {
      this.textTemplates = savedTextTemplates;
    }

    // Load active sales script
    this.activeSalesScriptId = loadFromStorage(TEMPLATE_STORAGE_KEYS.ACTIVE_SALES_SCRIPT, defaultSalesScripts[0].id);
    
    // Load custom sales script
    this.customSalesScript = loadFromStorage(TEMPLATE_STORAGE_KEYS.CUSTOM_SALES_SCRIPT, '');
    
    // Load custom text templates
    this.customTextTemplates = loadFromStorage(TEMPLATE_STORAGE_KEYS.CUSTOM_TEXT_TEMPLATES, {});

    console.log('✅ TemplateService initialized');
  }

  private saveTemplates(): void {
    saveToStorage(TEMPLATE_STORAGE_KEYS.SALES_SCRIPTS, this.salesScripts);
    saveToStorage(TEMPLATE_STORAGE_KEYS.TEXT_TEMPLATES, this.textTemplates);
  }

  // Sales Script Methods
  getSalesScripts(): SalesScriptTemplate[] {
    return [...this.salesScripts];
  }

  getActiveSalesScript(): SalesScriptTemplate | null {
    return this.salesScripts.find(script => script.id === this.activeSalesScriptId) || null;
  }

  setActiveSalesScript(scriptId: string): void {
    this.activeSalesScriptId = scriptId;
    saveToStorage(TEMPLATE_STORAGE_KEYS.ACTIVE_SALES_SCRIPT, scriptId);
  }

  getCustomSalesScript(): string {
    return this.customSalesScript;
  }

  saveCustomSalesScript(content: string): void {
    this.customSalesScript = content;
    saveToStorage(TEMPLATE_STORAGE_KEYS.CUSTOM_SALES_SCRIPT, content);
  }

  getCurrentSalesScript(): string {
    if (this.activeSalesScriptId === 'custom') {
      return this.customSalesScript;
    }
    const activeScript = this.getActiveSalesScript();
    return activeScript ? activeScript.content : '';
  }

  // Text Template Methods
  getTextTemplates(): TextMessageTemplate[] {
    return [...this.textTemplates];
  }

  getCustomTextTemplate(templateId: string): string {
    return this.customTextTemplates[templateId] || '';
  }

  saveCustomTextTemplate(templateId: string, content: string): void {
    this.customTextTemplates[templateId] = content;
    saveToStorage(TEMPLATE_STORAGE_KEYS.CUSTOM_TEXT_TEMPLATES, this.customTextTemplates);
  }

  getCurrentTextTemplate(templateId: string): string {
    const customContent = this.getCustomTextTemplate(templateId);
    if (customContent) {
      return customContent;
    }
    const template = this.textTemplates.find(t => t.id === templateId);
    return template ? template.content : '';
  }

  // Template Processing
  processTemplate(template: string, contact: any): string {
    return template
      .replace(/\{name\}/g, contact?.name || '[Name]')
      .replace(/\{company\}/g, contact?.company || '[Company]')
      .replace(/\{propertyType\}/g, contact?.propertyType || '[Property Type]')
      .replace(/\{phone\}/g, contact?.phone || '[Phone]')
      .replace(/\{email\}/g, contact?.email || '[Email]');
  }

  // Add custom templates
  addCustomSalesScript(name: string, content: string): SalesScriptTemplate {
    const newScript: SalesScriptTemplate = {
      id: `custom_${Date.now()}`,
      name,
      content,
      isDefault: false
    };
    this.salesScripts.push(newScript);
    this.saveTemplates();
    return newScript;
  }

  addCustomTextTemplate(name: string, content: string): TextMessageTemplate {
    const newTemplate: TextMessageTemplate = {
      id: `custom_${Date.now()}`,
      name,
      content,
      isDefault: false
    };
    this.textTemplates.push(newTemplate);
    this.saveTemplates();
    return newTemplate;
  }

  // Reset to defaults
  resetToDefaults(): void {
    this.salesScripts = [...defaultSalesScripts];
    this.textTemplates = [...defaultTextTemplates];
    this.activeSalesScriptId = defaultSalesScripts[0].id;
    this.customSalesScript = '';
    this.customTextTemplates = {};
    
    this.saveTemplates();
    saveToStorage(TEMPLATE_STORAGE_KEYS.ACTIVE_SALES_SCRIPT, this.activeSalesScriptId);
    saveToStorage(TEMPLATE_STORAGE_KEYS.CUSTOM_SALES_SCRIPT, this.customSalesScript);
    saveToStorage(TEMPLATE_STORAGE_KEYS.CUSTOM_TEXT_TEMPLATES, this.customTextTemplates);
  }
}

export const templateService = new TemplateService();