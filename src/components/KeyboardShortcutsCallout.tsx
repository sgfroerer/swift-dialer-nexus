import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Info, X } from "lucide-react";

export const KeyboardShortcutsCallout = () => {
  const [isOpen, setIsOpen] = useState(false);

  const shortcuts = {
    webex: [
      { action: "End Call", keys: ["Ctrl", "E"] }
    ],
    phoneLink: [
      { action: "End Call", keys: ["Ctrl", "Shift", "H"] },
      { action: "Open Messages", keys: ["Ctrl", "1"] },
      { action: "Open Calls", keys: ["Ctrl", "2"] },
      { action: "New Message", keys: ["Ctrl", "N"] }
    ]
  };

  const renderKeyCombo = (keys: string[]) => (
    <div className="flex items-center space-x-1">
      {keys.map((key, index) => (
        <span key={index} className="flex items-center">
          <kbd className="px-2 py-1 text-xs font-semibold text-gray-800 bg-gray-100 border border-gray-300 rounded-md shadow-sm">
            {key}
          </kbd>
          {index < keys.length - 1 && (
            <span className="mx-1 text-gray-500 text-sm">+</span>
          )}
        </span>
      ))}
    </div>
  );

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="ghost"
          size="sm"
          className="h-8 w-8 p-0 text-gray-500 hover:text-gray-700 hover:bg-gray-100 transition-colors"
          aria-label="Show keyboard shortcuts"
        >
          <Info className="h-4 w-4" />
        </Button>
      </PopoverTrigger>
      <PopoverContent 
        className="w-80 p-0 border border-gray-200 shadow-lg" 
        align="end"
        side="bottom"
        sideOffset={8}
      >
        <Card className="border-0 shadow-none">
          <CardHeader className="pb-3 px-4 pt-4">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm font-medium text-gray-900 flex items-center space-x-2">
                <Info className="h-4 w-4 text-blue-600" />
                <span>Keyboard Shortcuts</span>
              </CardTitle>
              <Button
                variant="ghost"
                size="sm"
                className="h-6 w-6 p-0 text-gray-400 hover:text-gray-600"
                onClick={() => setIsOpen(false)}
                aria-label="Close shortcuts"
              >
                <X className="h-3 w-3" />
              </Button>
            </div>
          </CardHeader>
          <CardContent className="px-4 pb-4 space-y-4">
            {/* Webex Shortcuts */}
            <div className="space-y-2">
              <h4 className="text-sm font-medium text-gray-700 border-b border-gray-100 pb-1">
                Webex
              </h4>
              <div className="space-y-2">
                {shortcuts.webex.map((shortcut, index) => (
                  <div key={index} className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">{shortcut.action}:</span>
                    {renderKeyCombo(shortcut.keys)}
                  </div>
                ))}
              </div>
            </div>

            {/* Phone Link Shortcuts */}
            <div className="space-y-2">
              <h4 className="text-sm font-medium text-gray-700 border-b border-gray-100 pb-1">
                Phone Link
              </h4>
              <div className="space-y-2">
                {shortcuts.phoneLink.map((shortcut, index) => (
                  <div key={index} className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">{shortcut.action}:</span>
                    {renderKeyCombo(shortcut.keys)}
                  </div>
                ))}
              </div>
            </div>

            {/* Footer Note */}
            <div className="pt-2 border-t border-gray-100">
              <p className="text-xs text-gray-500 text-center">
                These shortcuts work when the respective applications are active
              </p>
            </div>
          </CardContent>
        </Card>
      </PopoverContent>
    </Popover>
  );
};