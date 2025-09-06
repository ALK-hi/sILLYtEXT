"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { ToolContainer } from "@/components/tool-container";
import { Shield, Clipboard, RefreshCw } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { trackEvent } from "@/lib/analytics";

export function PasswordGenerator() {
  const [password, setPassword] = useState("");
  const [length, setLength] = useState(16);
  const [includeUppercase, setIncludeUppercase] = useState(true);
  const [includeLowercase, setIncludeLowercase] = useState(true);
  const [includeNumbers, setIncludeNumbers] = useState(true);
  const [includeSymbols, setIncludeSymbols] = useState(true);
  const { toast } = useToast();

  const generatePassword = () => {
    const upper = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    const lower = "abcdefghijklmnopqrstuvwxyz";
    const numbers = "0123456789";
    const symbols = "!@#$%^&*()_+~`|}{[]:;?><,./-=";

    let charset = "";
    if (includeUppercase) charset += upper;
    if (includeLowercase) charset += lower;
    if (includeNumbers) charset += numbers;
    if (includeSymbols) charset += symbols;

    if (charset === "") {
        toast({
            variant: "destructive",
            title: "Cannot generate password",
            description: "Please select at least one character type.",
        });
        setPassword("");
        return;
    }

    let newPassword = "";
    for (let i = 0; i < length; i++) {
      newPassword += charset.charAt(Math.floor(Math.random() * charset.length));
    }
    setPassword(newPassword);
    trackEvent('tool_used', { 
        tool: 'password-generator', 
        params: { 
            length,
            includeUppercase,
            includeLowercase,
            includeNumbers,
            includeSymbols
        } 
    });
  };
  
  useEffect(() => {
      generatePassword();
      // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const copyToClipboard = () => {
    if (!password) return;
    navigator.clipboard.writeText(password);
    toast({
      title: "Copied to clipboard!",
      description: "The generated password has been copied.",
    });
    trackEvent('share_clicked', { tool: 'password-generator', method: 'copy_button' });
  };

  return (
    <ToolContainer
      title="Strong Password Generator"
      description="Create secure, random passwords for your accounts."
      icon={Shield}
    >
      <div className="space-y-6">
        <div className="relative">
          <Input
            readOnly
            value={password}
            className="text-xl font-mono pr-20 h-12 text-center"
            placeholder="Click 'Generate' to create a password"
          />
          <div className="absolute top-1/2 right-2 -translate-y-1/2 flex gap-1">
            <Button variant="ghost" size="icon" onClick={copyToClipboard} disabled={!password}>
                <Clipboard className="h-5 w-5" />
            </Button>
          </div>
        </div>
        
        <div className="space-y-4">
            <div className="flex justify-between items-center">
                <Label htmlFor="length-slider">Password Length</Label>
                <span className="font-mono text-lg">{length}</span>
            </div>
            <Slider
                id="length-slider"
                min={8}
                max={64}
                step={1}
                value={[length]}
                onValueChange={(value) => setLength(value[0])}
            />
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="flex items-center space-x-2">
                <Checkbox id="uppercase" checked={includeUppercase} onCheckedChange={(checked) => setIncludeUppercase(Boolean(checked))} />
                <Label htmlFor="uppercase">Uppercase (A-Z)</Label>
            </div>
             <div className="flex items-center space-x-2">
                <Checkbox id="lowercase" checked={includeLowercase} onCheckedChange={(checked) => setIncludeLowercase(Boolean(checked))} />
                <Label htmlFor="lowercase">Lowercase (a-z)</Label>
            </div>
             <div className="flex items-center space-x-2">
                <Checkbox id="numbers" checked={includeNumbers} onCheckedChange={(checked) => setIncludeNumbers(Boolean(checked))} />
                <Label htmlFor="numbers">Numbers (0-9)</Label>
            </div>
             <div className="flex items-center space-x-2">
                <Checkbox id="symbols" checked={includeSymbols} onCheckedChange={(checked) => setIncludeSymbols(Boolean(checked))} />
                <Label htmlFor="symbols">Symbols (!@#$..)</Label>
            </div>
        </div>

        <Button onClick={generatePassword} size="lg" className="w-full">
            <RefreshCw className="mr-2 h-5 w-5" />
            Generate New Password
        </Button>
      </div>
    </ToolContainer>
  );
}
