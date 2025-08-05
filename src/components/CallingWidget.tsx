import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Copy, Cast as Paste, Phone, Video } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface CallingWidgetProps {
  phoneNumber?: string;
  onNumberChange?: (number: string) => void;
}

export const CallingWidget = ({ phoneNumber = "", onNumberChange }: CallingWidgetProps) => {
  const [inputValue, setInputValue] = useState("");
  const [isValid, setIsValid] = useState(false);
  const { toast } = useToast();

  // Update input when phoneNumber prop changes
  useEffect(() => {
    if (phoneNumber) {
      const formatted = formatPhoneNumber(phoneNumber);
      setInputValue(formatted);
      validateAndUpdate(formatted);
    }
  }, [phoneNumber]);

  const formatPhoneNumber = (val: string): string => {
    if (!val) return '';
    const nums = val.replace(/\D/g, '');
    const m = nums.match(/^(\d{0,3})(\d{0,3})(\d{0,4})$/);
    if (!m) return '';
    return !m[2] ? m[1] : `(${m[1]}) ${m[2]}${m[3] ? `-${m[3]}` : ''}`;
  };

  const validatePhone = (n: string): boolean => {
    return n.replace(/\D/g, '').length === 10;
  };

  const validateAndUpdate = (formatted: string) => {
    const raw = formatted.replace(/\D/g, '');
    const valid = validatePhone(raw);
    setIsValid(valid);
    
    if (onNumberChange) {
      onNumberChange(raw);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatPhoneNumber(e.target.value);
    setInputValue(formatted);
    validateAndUpdate(formatted);
  };

  const handlePaste = async () => {
    try {
      const text = await navigator.clipboard.readText();
      const formatted = formatPhoneNumber(text);
      setInputValue(formatted);
      validateAndUpdate(formatted);
      toast({
        title: "Number pasted",
        description: "Phone number pasted from clipboard",
      });
    } catch (error) {
      toast({
        title: "Paste failed",
        description: "Could not access clipboard",
        variant: "destructive"
      });
    }
  };

  const handleCopy = async () => {
    const raw = inputValue.replace(/\D/g, '');
    if (raw.length === 10) {
      try {
        await navigator.clipboard.writeText(raw);
        toast({
          title: "Copied!",
          description: "Phone number copied to clipboard",
        });
      } catch (error) {
        toast({
          title: "Copy failed",
          description: "Could not copy to clipboard",
          variant: "destructive"
        });
      }
    }
  };

  const getRawNumber = (): string => {
    return inputValue.replace(/\D/g, '');
  };

  const getWebexUrl = (): string => {
    return `sip:${getRawNumber()}`;
  };

  const getPhoneLinkUrl = (): string => {
    return `tel:${getRawNumber()}`;
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <Phone className="h-5 w-5" />
          <span>Quick Call</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Phone Input */}
        <div className="flex space-x-2">
          <Input
            type="tel"
            value={inputValue}
            onChange={handleInputChange}
            placeholder="(123) 456-7890"
            className="flex-1"
          />
          <Button
            variant="outline"
            size="icon"
            onClick={handlePaste}
            title="Paste from clipboard"
          >
            <Paste className="h-4 w-4" />
          </Button>
        </div>

        {/* Call Actions */}
        <div className="flex space-x-2">
          <Button
            asChild
            disabled={!isValid}
            className="flex-1 bg-green-600 hover:bg-green-700"
            title="Call using Webex"
          >
            {isValid ? (
              <a href={getWebexUrl()} className="flex items-center justify-center space-x-2">
                <img 
                  src="https://www.secureitstore.com/images/webex/Webex-icon.png" 
                  alt="Webex" 
                  className="h-4 w-4"
                  onError={(e) => {
                    e.currentTarget.style.display = 'none';
                    e.currentTarget.nextElementSibling!.style.display = 'inline';
                  }}
                />
                <Video className="h-4 w-4" style={{ display: 'none' }} />
                <span>Webex</span>
              </a>
            ) : (
              <span className="flex items-center justify-center space-x-2">
                <Video className="h-4 w-4" />
                <span>Webex</span>
              </span>
            )}
          </Button>

          <Button
            asChild
            disabled={!isValid}
            variant="outline"
            className="flex-1"
            title="Call using Phone Link"
          >
            {isValid ? (
              <a href={getPhoneLinkUrl()} className="flex items-center justify-center space-x-2">
                <img 
                  src="https://cdn.mos.cms.futurecdn.net/idt7kBRyDnJwzKSFtV8LtU-200-100.png" 
                  alt="Phone Link" 
                  className="h-4 w-4"
                  onError={(e) => {
                    e.currentTarget.style.display = 'none';
                    e.currentTarget.nextElementSibling!.style.display = 'inline';
                  }}
                />
                <Phone className="h-4 w-4" style={{ display: 'none' }} />
                <span>Phone</span>
              </a>
            ) : (
              <span className="flex items-center justify-center space-x-2">
                <Phone className="h-4 w-4" />
                <span>Phone</span>
              </span>
            )}
          </Button>

          <Button
            variant="outline"
            size="icon"
            onClick={handleCopy}
            disabled={!isValid}
            title="Copy number"
          >
            <Copy className="h-4 w-4" />
          </Button>
        </div>

        <div className="text-sm text-gray-500 text-center">
          Paste or enter a US number to call or copy
        </div>
      </CardContent>
    </Card>
  );
};