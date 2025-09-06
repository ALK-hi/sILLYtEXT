"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { ToolContainer } from "@/components/tool-container";
import { Eraser, Clipboard } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Label } from "@/components/ui/label";
import { Input } from "../ui/input";
import { trackEvent } from "@/lib/analytics";

type WhitespaceTransformType = 
  | "trim-lines"
  | "remove-extra-spaces"
  | "remove-all-whitespace"
  | "remove-all-line-breaks"
  | "tabs-to-spaces"
  | "spaces-to-tabs"
  | "normalize-newlines-lf"
  | "normalize-newlines-crlf";

export function WhitespaceRemover() {
  const [input, setInput] = useState("  Some example text \n\n with   extra spaces and\t tabs.  \n\n");
  const [output, setOutput] = useState("");
  const [tabToSpaces, setTabToSpaces] = useState("2");
  const [status, setStatus] = useState("");
  const { toast } = useToast();

  const handleTransform = (type: WhitespaceTransformType) => {
    let result = input;
    let initialLength = input.length;
    switch (type) {
      // Standardization
      case "trim-lines":
        result = input.split('\n').map(line => line.trim()).join('\n');
        break;
      case "remove-extra-spaces":
        result = input.replace(/ +/g, ' ');
        break;
      case "remove-all-whitespace":
        result = input.replace(/\s/g, '');
        break;
      case "remove-all-line-breaks":
        result = input.replace(/(\r\n|\n|\r)/gm, " ");
        break;
      // Conversion
      case "tabs-to-spaces":
        const spacesString = ' '.repeat(parseInt(tabToSpaces, 10) || 2);
        result = input.replace(/\t/g, spacesString);
        break;
      case "spaces-to-tabs":
        const spaceCount = parseInt(tabToSpaces, 10) || 2;
        const spacesRegex = new RegExp(' '.repeat(spaceCount), 'g');
        result = input.replace(spacesRegex, '\t');
        break;
      // Normalization
      case "normalize-newlines-lf":
        result = input.replace(/\r\n/g, '\n').replace(/\r/g, '\n');
        break;
      case "normalize-newlines-crlf":
        result = input.replace(/\r\n/g, '\n').replace(/\r/g, '\n').replace(/\n/g, '\r\n');
        break;
    }
    setOutput(result);
    const charsRemoved = initialLength - result.length;
    if (charsRemoved > 0) {
      setStatus(`${charsRemoved} character(s) removed.`);
    } else {
      setStatus("No changes made.");
    }
    trackEvent('tool_used', { tool: 'whitespace-remover', params: { type, chars_removed: charsRemoved } });
  };

  const copyToClipboard = () => {
    if (!output) return;
    navigator.clipboard.writeText(output);
    toast({
      title: "Copied to clipboard!",
      description: "The cleaned text has been copied.",
    });
    trackEvent('share_clicked', { tool: 'whitespace-remover', method: 'copy_button' });
  };

  return (
    <ToolContainer
      title="Whitespace Cleaner"
      description="Clean up messy text by removing unwanted spaces, tabs, and line breaks."
      icon={Eraser}
    >
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="input-text">Input</Label>
            <Textarea
              id="input-text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Paste text with extra whitespace..."
              className="min-h-[250px] text-base font-mono"
            />
          </div>
          <div className="space-y-2">
             <div className="flex justify-between items-center">
                <Label htmlFor="output-text">Output</Label>
                {status && <span className="text-xs text-muted-foreground">{status}</span>}
            </div>
            <div className="relative">
              <Textarea
                id="output-text"
                value={output}
                readOnly
                placeholder="Your perfectly clean text will appear here..."
                className="min-h-[250px] text-base font-mono"
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

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="space-y-2">
                <h3 className="font-semibold">Standardization</h3>
                <div className="flex flex-col gap-2">
                   <Button onClick={() => handleTransform("trim-lines")}>Trim Lines</Button>
                   <Button onClick={() => handleTransform("remove-extra-spaces")}>Reduce Multiple Spaces</Button>
                   <Button onClick={() => handleTransform("remove-all-line-breaks")}>Remove All Line Breaks</Button>
                   <Button onClick={() => handleTransform("remove-all-whitespace")}>Remove All Whitespace</Button>
                </div>
            </div>
            <div className="space-y-2">
                <h3 className="font-semibold">Conversion</h3>
                <div className="flex flex-col gap-2">
                    <div className="flex items-center gap-2">
                        <Input 
                            type="number"
                            className="w-20"
                            value={tabToSpaces}
                            onChange={(e) => setTabToSpaces(e.target.value)}
                        />
                        <Label>spaces per tab</Label>
                    </div>
                   <Button onClick={() => handleTransform("tabs-to-spaces")}>Tabs to Spaces</Button>
                   <Button onClick={() => handleTransform("spaces-to-tabs")}>Spaces to Tabs</Button>
                </div>
            </div>
            <div className="space-y-2">
                <h3 className="font-semibold">Line Ending Normalization</h3>
                 <div className="flex flex-col gap-2">
                   <Button onClick={() => handleTransform("normalize-newlines-lf")}>Normalize to LF (\n)</Button>
                   <Button onClick={() => handleTransform("normalize-newlines-crlf")}>Normalize to CRLF (\r\n)</Button>
                </div>
            </div>
        </div>
      </div>
    </ToolContainer>
  );
}
