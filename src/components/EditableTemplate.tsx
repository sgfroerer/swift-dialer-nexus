import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Save, RotateCcw, Edit3, Eye } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface EditableTemplateProps {
  title: string;
  templates: Array<{ id: string; name: string; content: string; isDefault: boolean }>;
  activeTemplateId: string;
  customContent: string;
  onTemplateChange: (templateId: string) => void;
  onCustomContentChange: (content: string) => void;
  onSave: () => void;
  placeholder?: string;
  contact?: any;
  processTemplate?: (template: string, contact: any) => string;
  className?: string;
}

export const EditableTemplate = ({
  title,
  templates,
  activeTemplateId,
  customContent,
  onTemplateChange,
  onCustomContentChange,
  onSave,
  placeholder = "Enter your template content...",
  contact,
  processTemplate,
  className = ""
}: EditableTemplateProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const [localContent, setLocalContent] = useState(customContent);
  const { toast } = useToast();

  useEffect(() => {
    setLocalContent(customContent);
    setHasUnsavedChanges(false);
  }, [customContent, activeTemplateId]);

  const getCurrentTemplate = () => {
    if (activeTemplateId === 'custom') {
      return { id: 'custom', name: 'Custom', content: customContent, isDefault: false };
    }
    return templates.find(t => t.id === activeTemplateId) || templates[0];
  };

  const getDisplayContent = () => {
    const template = getCurrentTemplate();
    const content = activeTemplateId === 'custom' ? localContent : template.content;
    
    if (processTemplate && contact) {
      return processTemplate(content, contact);
    }
    return content;
  };

  const handleTemplateSelect = (templateId: string) => {
    if (hasUnsavedChanges) {
      const confirmChange = window.confirm('You have unsaved changes. Are you sure you want to switch templates?');
      if (!confirmChange) return;
    }
    
    onTemplateChange(templateId);
    setIsEditing(false);
    setHasUnsavedChanges(false);
    
    if (templateId === 'custom') {
      setLocalContent(customContent);
    } else {
      const template = templates.find(t => t.id === templateId);
      if (template) {
        setLocalContent(template.content);
      }
    }
  };

  const handleContentChange = (value: string) => {
    setLocalContent(value);
    setHasUnsavedChanges(value !== customContent);
    onCustomContentChange(value);
  };

  const handleSave = () => {
    onSave();
    setHasUnsavedChanges(false);
    setIsEditing(false);
    toast({
      title: "Template saved",
      description: `${title} has been saved successfully`,
    });
  };

  const handleReset = () => {
    const template = getCurrentTemplate();
    setLocalContent(template.content);
    onCustomContentChange(template.content);
    setHasUnsavedChanges(false);
    toast({
      title: "Template reset",
      description: "Changes have been discarded",
    });
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

  return (
    <Card className={`hover:shadow-lg transition-shadow duration-200 ${className}`}>
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center space-x-2">
            <span>{title}</span>
            {currentTemplate.isDefault && (
              <Badge variant="outline" className="text-xs">Default</Badge>
            )}
            {hasUnsavedChanges && (
              <Badge variant="destructive" className="text-xs">Unsaved</Badge>
            )}
          </CardTitle>
          <div className="flex items-center space-x-2">
            <Button
              variant="outline"
              size="sm"
              onClick={toggleEditMode}
              className="hover:scale-105 transition-transform"
            >
              {isEditing ? <Eye className="h-4 w-4" /> : <Edit3 className="h-4 w-4" />}
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Template Selector */}
        <div className="space-y-2">
          <label className="text-sm font-medium">Template:</label>
          <Select value={activeTemplateId} onValueChange={handleTemplateSelect}>
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
              <SelectItem value="custom">
                <div className="flex items-center space-x-2">
                  <span>Custom</span>
                  <Badge variant="secondary" className="text-xs ml-2">Editable</Badge>
                </div>
              </SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Content Display/Editor */}
        {isEditing ? (
          <div className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Content:</label>
              <Textarea
                value={localContent}
                onChange={(e) => handleContentChange(e.target.value)}
                placeholder={placeholder}
                rows={8}
                className="font-mono text-sm leading-relaxed resize-none"
              />
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
          <div className="space-y-2">
            <label className="text-sm font-medium">Preview:</label>
            <div className="bg-blue-50 p-4 rounded-lg border border-blue-100 min-h-[200px]">
              <div className="prose prose-sm max-w-none">
                <div className="text-blue-900 leading-relaxed font-sans text-sm whitespace-pre-wrap break-words">
                  {getDisplayContent()}
                </div>
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};