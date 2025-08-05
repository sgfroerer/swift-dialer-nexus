import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Copy, Save, RotateCcw, Edit3, Eye, MessageSquare } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { templateService, TextMessageTemplate } from "@/services/templateService";

interface TextTemplateSelectorProps {
  contact: any;
  onTemplateCopy?: (content: string, templateName: string) => void;
  className?: string;
}

export const TextTemplateSelector = ({ 
  contact, 
  onTemplateCopy,
  className = "" 
}: TextTemplateSelectorProps) => {
  const [templates, setTemplates] = useState<TextMessageTemplate[]>([]);
  const [selectedTemplateId, setSelectedTemplateId] = useState<string>('');
  const [isEditing, setIsEditing] = useState(false);
  const [editContent, setEditContent] = useState('');
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    const textTemplates = templateService.getTextTemplates();
    setTemplates(textTemplates);
    if (textTemplates.length > 0 && !selectedTemplateId) {
      setSelectedTemplateId(textTemplates[0].id);
    }
  }, []);

  useEffect(() => {
    if (selectedTemplateId) {
      const currentContent = templateService.getCurrentTextTemplate(selectedTemplateId);
      const template = templates.find(t => t.id === selectedTemplateId);
      setEditContent(currentContent || template?.content || '');
      setHasUnsavedChanges(false);
    }
  }, [selectedTemplateId, templates]);

  const getCurrentTemplate = () => {
    return templates.find(t => t.id === selectedTemplateId);
  };

  const getProcessedContent = () => {
    const content = editContent || getCurrentTemplate()?.content || '';
    return templateService.processTemplate(content, contact);
  };

  const handleTemplateSelect = (templateId: string) => {
    if (hasUnsavedChanges) {
      const confirmChange = window.confirm('You have unsaved changes. Are you sure you want to switch templates?');
      if (!confirmChange) return;
    }
    
    setSelectedTemplateId(templateId);
    setIsEditing(false);
    setHasUnsavedChanges(false);
  };

  const handleContentChange = (value: string) => {
    setEditContent(value);
    const originalContent = templateService.getCurrentTextTemplate(selectedTemplateId) || 
                           getCurrentTemplate()?.content || '';
    setHasUnsavedChanges(value !== originalContent);
  };

  const handleSave = () => {
    if (selectedTemplateId) {
      templateService.saveCustomTextTemplate(selectedTemplateId, editContent);
      setHasUnsavedChanges(false);
      setIsEditing(false);
      toast({
        title: "Template saved",
        description: "Text message template has been saved successfully",
      });
    }
  };

  const handleReset = () => {
    const template = getCurrentTemplate();
    const originalContent = template?.content || '';
    setEditContent(originalContent);
    setHasUnsavedChanges(false);
    toast({
      title: "Template reset",
      description: "Changes have been discarded",
    });
  };

  const handleCopy = () => {
    const processedContent = getProcessedContent();
    const template = getCurrentTemplate();
    
    if (onTemplateCopy) {
      onTemplateCopy(processedContent, template?.name || 'Template');
    } else {
      // Fallback to direct clipboard copy
      navigator.clipboard.writeText(processedContent).then(() => {
        toast({
          title: "Copied to clipboard",
          description: `${template?.name} template copied successfully`,
        });
      }).catch(() => {
        toast({
          title: "Copy failed",
          description: "Please copy the text manually",
          variant: "destructive"
        });
      });
    }
  };

  const toggleEditMode = () => {
    if (isEditing && hasUnsavedChanges) {
      const confirmDiscard = window.confirm('You have unsaved changes. Are you sure you want to discard them?');
      if (!confirmDiscard) return;
      handleReset();
    }
    setIsEditing(!isEditing);
  };

  const currentTemplate = getCurrentTemplate();

  if (!currentTemplate) {
    return null;
  }

  return (
    <Card className={`hover:shadow-lg transition-shadow duration-200 animate-in slide-in-from-top-2 ${className}`}>
      <CardHeader className="pb-4">
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <MessageSquare className="h-5 w-5" />
            <span>Text Message Templates</span>
            {currentTemplate.isDefault && (
              <Badge variant="outline" className="text-xs">Default</Badge>
            )}
            {hasUnsavedChanges && (
              <Badge variant="destructive" className="text-xs">Unsaved</Badge>
            )}
          </div>
          <div className="flex items-center space-x-2">
            <Button
              variant="outline"
              size="sm"
              onClick={toggleEditMode}
              className="hover:scale-105 transition-transform"
            >
              {isEditing ? <Eye className="h-4 w-4" /> : <Edit3 className="h-4 w-4" />}
            </Button>
            <Button
              size="sm"
              onClick={handleCopy}
              className="text-green-700 bg-green-50 border-green-300 hover:bg-green-100 hover:scale-105 transition-transform"
            >
              <Copy className="h-4 w-4 mr-1" />
              Copy
            </Button>
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Template Selector Dropdown */}
        <div className="space-y-2">
          <label className="text-sm font-medium">Select Template:</label>
          <Select value={selectedTemplateId} onValueChange={handleTemplateSelect}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {templates.map((template) => (
                <SelectItem key={template.id} value={template.id}>
                  <div className="flex items-center space-x-2">
                    <span>{template.name}</span>
                    {template.isDefault && (
                      <Badge variant="outline" className="text-xs ml-2">Default</Badge>
                    )}
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Content Display/Editor */}
        {isEditing ? (
          <div className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Edit Template:</label>
              <Textarea
                value={editContent}
                onChange={(e) => handleContentChange(e.target.value)}
                placeholder="Enter your text message template..."
                rows={6}
                className="font-mono text-sm leading-relaxed resize-none"
              />
              <div className="text-xs text-gray-500">
                Use {"{name}"}, {"{company}"}, and {"{propertyType}"} for dynamic content
              </div>
            </div>
            
            <div className="flex items-center space-x-2">
              <Button
                onClick={handleSave}
                disabled={!hasUnsavedChanges}
                className="hover:scale-105 transition-transform"
              >
                <Save className="h-4 w-4 mr-2" />
                Save Changes
              </Button>
              <Button
                variant="outline"
                onClick={handleReset}
                disabled={!hasUnsavedChanges}
                className="hover:scale-105 transition-transform"
              >
                <RotateCcw className="h-4 w-4 mr-2" />
                Reset
              </Button>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Preview:</label>
              <div className="border rounded-lg p-4 bg-green-50 hover:bg-green-100 transition-colors min-h-[120px]">
                <div className="prose prose-sm max-w-none">
                  <p className="text-gray-700 leading-relaxed font-sans text-sm whitespace-pre-wrap break-words m-0">
                    {getProcessedContent()}
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Usage Tip */}
        <div className="p-4 bg-blue-50 rounded-lg border border-blue-100">
          <p className="text-sm text-blue-700 leading-relaxed break-words">
            💡 <strong>Tip:</strong> Copy the template, then paste it into Microsoft Phone Link to send as a text message to {contact?.name} at {contact?.phone}
          </p>
        </div>
      </CardContent>
    </Card>
  );
};