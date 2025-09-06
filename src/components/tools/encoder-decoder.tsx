"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { ToolContainer } from "@/components/tool-container";
import { Code, Clipboard } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Label } from "@/components/ui/label";
import { trackEvent } from "@/lib/analytics";

type TransformType = "b64-encode" | "b64-decode" | "url-encode" | "url-decode";

export function EncoderDecoder() {
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");
  const { toast } = useToast();

  const handleTransform = (type: TransformType) => {
    try {
        let result = "";
        switch (type) {
          case "b64-encode":
            result = btoa(input);
            break;
          case "b64-decode":
            result = atob(input);
            break;
          case "url-encode":
            result = encodeURIComponent(input);
            break;
          case "url-decode":
            result = decodeURIComponent(input);
            break;
        }
        setOutput(result);
        trackEvent('tool_used', { tool: 'encoder-decoder', params: { type } });
    } catch (error) {
        let message = "An unknown error occurred.";
        if (error instanceof Error) {
            message = error.message;
        }
        toast({
            variant: "destructive",
            title: "Transformation Failed",
            description: `Could not perform operation. ${message}`,
        });
        setOutput("");
    }
  };

  const copyToClipboard = () => {
    if (!output) return;
    navigator.clipboard.writeText(output);
    toast({
      title: "Copied to clipboard!",
      description: "The result has been copied.",
    });
    trackEvent('share_clicked', { tool: 'encoder-decoder', method: 'copy_button' });
  };

  return (
    <ToolContainer
      title="Encoder / Decoder"
      description="Encode and decode text with Base64 or URL encoding."
      icon={Code}
    >
      <div className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
                <Label htmlFor="input-text">Input</Label>
                <Textarea
                    id="input-text"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    placeholder="Text to encode or decode..."
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
                    placeholder="Result..."
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
          <Button onClick={() => handleTransform("b64-encode")}>Base64 Encode</Button>
          <Button onClick={() => handleTransform("b64-decode")}>Base64 Decode</Button>
          <Button onClick={() => handleTransform("url-encode")}>URL Encode</Button>
          <Button onClick={() => handleTransform("url-decode")}>URL Decode</Button>
        </div>
      </div>
    </ToolContainer>
  );
}
