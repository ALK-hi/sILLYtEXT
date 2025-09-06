"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { ToolContainer } from "@/components/tool-container";
import { CaseSensitive, Clipboard } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Label } from "@/components/ui/label";
import { trackEvent } from "@/lib/analytics";

export function CaseConverter() {
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");
  const { toast } = useToast();

  const handleConversion = (type: string) => {
    let result = "";
    switch (type) {
      case "uppercase":
        result = input.toUpperCase();
        break;
      case "lowercase":
        result = input.toLowerCase();
        break;
      case "titlecase":
        result = input.replace(
          /\w\S*/g,
          (txt) => txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase()
        );
        break;
      case "sentencecase":
        result = input.toLowerCase().replace(/(^\s*\w|[.!?]\s*\w)/g, c => c.toUpperCase());
        break;
      case "camelcase":
        result = input.replace(/(?:^\w|[A-Z]|\b\w)/g, (word, index) => 
            index === 0 ? word.toLowerCase() : word.toUpperCase()
        ).replace(/\s+/g, '');
        break;
      case "kebabcase":
        result = input.replace(/([a-z0-9]|(?=[A-Z]))([A-Z])/g, '$1-$2').toLowerCase().replace(/\s+/g, '-');
        break;
      case "snakecase":
        result = input.replace(/([a-z0-9]|(?=[A-Z]))([A-Z])/g, '$1_$2').toLowerCase().replace(/\s+/g, '_');
        break;
    }
    setOutput(result);
    trackEvent('tool_used', { tool: 'case-converter', params: { type } });
  };
  
  const copyToClipboard = () => {
    if (!output) return;
    navigator.clipboard.writeText(output);
    toast({
      title: "Copied to clipboard!",
      description: "The converted text has been copied.",
    });
    trackEvent('share_clicked', { tool: 'case-converter', method: 'copy_button' });
  };

  return (
    <ToolContainer
      title="Case Converter"
      description="Convert text to Uppercase, Lowercase, Title Case, and more."
      icon={CaseSensitive}
    >
      <div className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="input-text">Input</Label>
            <Textarea
              id="input-text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Type or paste your text here..."
              className="min-h-[200px] text-base"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="output-text">Output</Label>
            <div className="relative">
              <Textarea
                id="output-text"
                value={output}
                onChange={(e) => setOutput(e.target.value)}
                placeholder="Result will appear here..."
                className="min-h-[200px] text-base"
              />
              <Button
                variant="ghost"
                size="icon"
                className="absolute top-2 right-2"
                onClick={copyToClipboard}
                disabled={!output}
              >
                <Clipboard className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
        <div className="flex flex-wrap gap-2">
          <Button onClick={() => handleConversion("uppercase")}>Uppercase</Button>
          <Button onClick={() => handleConversion("lowercase")}>Lowercase</Button>
          <Button onClick={() => handleConversion("titlecase")}>Title Case</Button>
          <Button onClick={() => handleConversion("sentencecase")}>Sentence Case</Button>
          <Button onClick={() => handleConversion("camelcase")}>Camel Case</Button>
          <Button onClick={() => handleConversion("kebabcase")}>Kebab Case</Button>
          <Button onClick={() => handleConversion("snakecase")}>Snake Case</Button>
        </div>
      </div>
    </ToolContainer>
  );
}
