"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { ToolContainer } from "@/components/tool-container";
import { CopyX, Clipboard } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Label } from "@/components/ui/label";
import { trackEvent } from "@/lib/analytics";

export function DuplicateRemover() {
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");
  const [linesRemoved, setLinesRemoved] = useState(0);
  const { toast } = useToast();

  const handleRemove = () => {
    const lines = input.split("\n");
    const uniqueLines = [...new Set(lines)];
    const result = uniqueLines.join("\n");
    setOutput(result);
    setLinesRemoved(lines.length - uniqueLines.length);
    trackEvent('tool_used', { tool: 'duplicate-remover', params: { lines_removed: lines.length - uniqueLines.length } });
  };

  const copyToClipboard = () => {
    if (!output) return;
    navigator.clipboard.writeText(output);
    toast({
      title: "Copied to clipboard!",
      description: "The text with unique lines has been copied.",
    });
    trackEvent('share_clicked', { tool: 'duplicate-remover', method: 'copy_button' });
  };

  return (
    <ToolContainer
      title="Duplicate Line Remover"
      description="Efficiently remove identical lines from lists or text blocks."
      icon={CopyX}
    >
      <div className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
                <Label htmlFor="input-text">Input</Label>
                <Textarea
                id="input-text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Paste your list or text here to find and remove duplicates..."
                className="min-h-[200px] text-base"
                />
            </div>
            <div className="space-y-2">
                <div className="flex justify-between items-center">
                    <Label htmlFor="output-text">Output</Label>
                    {output && <span className="text-xs text-muted-foreground">{linesRemoved > 0 ? `${linesRemoved} duplicate line(s) removed.` : 'No duplicates found.'}</span>}
                </div>
                <div className="relative">
                <Textarea
                    id="output-text"
                    value={output}
                    onChange={(e) => setOutput(e.target.value)}
                    placeholder="Unique lines will appear here..."
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
        <Button onClick={handleRemove}>Remove Duplicate Lines</Button>
      </div>
    </ToolContainer>
  );
}
