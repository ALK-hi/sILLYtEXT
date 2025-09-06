"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { ToolContainer } from "@/components/tool-container";
import { Quote, Clipboard } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Label } from "@/components/ui/label";
import { trackEvent } from "@/lib/analytics";

const exampleText = `"It's a beautiful day," she said -- a truly wonderful day.
He wrote 'Hello, World!' in his notebook.
The API returned: {"status": "ok", "data": "some value"}`;

export function TypographyStandardizer() {
  const [input, setInput] = useState(exampleText);
  const [output, setOutput] = useState("");
  const { toast } = useToast();

  const toSmartQuotes = () => {
    let result = input;
    result = result
      .replace(/(^|[-\u2014\s(\["])'/g, "$1\u2018") // opening singles
      .replace(/'/g, "\u2019") // closing singles & apostrophes
      .replace(/(^|[-\u2014\s(\["])_"/g, "$1\u201c") // opening doubles
      .replace(/"/g, "\u201d"); // closing doubles
    setOutput(result);
    trackEvent('tool_used', { tool: 'typography-standardizer', params: { action: 'to-smart-quotes' } });
  };

  const toStraightQuotes = () => {
    let result = input;
    result = result
      .replace(/[\u2018\u2019]/g, "'") // single quotes and apostrophes
      .replace(/[\u201c\u201d]/g, '"'); // double quotes
    setOutput(result);
     trackEvent('tool_used', { tool: 'typography-standardizer', params: { action: 'to-straight-quotes' } });
  };
  
  const standardizeDashes = () => {
      let result = input;
      result = result
        .replace(/--/g, "\u2014") // em dash
        .replace(/-/g, "\u2013"); // en dash (could be configured for different behavior)
      setOutput(result);
      trackEvent('tool_used', { tool: 'typography-standardizer', params: { action: 'standardize-dashes' } });
  }

  const copyToClipboard = () => {
    if (!output) return;
    navigator.clipboard.writeText(output);
    toast({
      title: "Copied to clipboard!",
      description: "The standardized text has been copied.",
    });
    trackEvent('share_clicked', { tool: 'typography-standardizer', method: 'copy_button' });
  };

  return (
    <ToolContainer
      title="Typography Standardizer"
      description="Convert between smart (curly) and straight quotes, and standardize dashes."
      icon={Quote}
    >
      <div className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="input-text">Input</Label>
            <Textarea
              id="input-text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder={`"It's a beautiful day," she said -- a truly wonderful day.`}
              className="min-h-[250px] text-base"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="output-text">Output</Label>
            <div className="relative">
              <Textarea
                id="output-text"
                value={output}
                onChange={(e) => setOutput(e.target.value)}
                placeholder="Professionally formatted text will appear here."
                className="min-h-[250px] text-base"
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
          <Button onClick={toSmartQuotes}>Convert to Smart Quotes</Button>
          <Button onClick={toStraightQuotes}>Convert to Straight Quotes</Button>
          <Button onClick={standardizeDashes}>Standardize Dashes</Button>
        </div>
      </div>
    </ToolContainer>
  );
}
