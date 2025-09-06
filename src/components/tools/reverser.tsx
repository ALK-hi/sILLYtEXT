"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { ToolContainer } from "@/components/tool-container";
import { ArrowLeftRight, Clipboard } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Label } from "@/components/ui/label";
import { trackEvent } from "@/lib/analytics";

type ReverseType = "text" | "words" | "letters";

export function Reverser() {
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");
  const { toast } = useToast();

  const handleReverse = (type: ReverseType) => {
    let result = "";
    switch (type) {
      case "text":
        result = input.split("").reverse().join("");
        break;
      case "words":
        result = input.split(/\s+/).reverse().join(" ");
        break;
      case "letters":
        result = input.split(/\s+/).map(word => word.split('').reverse().join('')).join(' ');
        break;
    }
    setOutput(result);
    trackEvent('tool_used', { tool: 'reverser', params: { type } });
  };
  
  const copyToClipboard = () => {
    if (!output) return;
    navigator.clipboard.writeText(output);
    toast({
      title: "Copied to clipboard!",
      description: "The reversed text has been copied.",
    });
    trackEvent('share_clicked', { tool: 'reverser', method: 'copy_button' });
  };

  return (
    <ToolContainer
      title="Text Reverser"
      description="Reverse text, word order, or individual words."
      icon={ArrowLeftRight}
    >
      <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="input-text">Input</Label>
            <Textarea
              id="input-text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Text to reverse..."
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
                placeholder="Reversed text..."
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
          <Button onClick={() => handleReverse("text")}>Reverse Text</Button>
          <Button onClick={() => handleReverse("words")}>Reverse Word Order</Button>
          <Button onClick={() => handleReverse("letters")}>Reverse Each Word</Button>
        </div>
      </div>
    </ToolContainer>
  );
}
