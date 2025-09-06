"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { ToolContainer } from "@/components/tool-container";
import { KeyRound, Clipboard, RefreshCw } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Label } from "@/components/ui/label";
import { trackEvent } from "@/lib/analytics";

export function UuidGenerator() {
  const [uuids, setUuids] = useState<string[]>([]);
  const { toast } = useToast();

  const generateUuids = () => {
    const newUuids = Array.from({ length: 10 }, () => crypto.randomUUID());
    setUuids(newUuids);
    trackEvent('tool_used', { tool: 'uuid-generator', params: { count: 10 } });
  };
  
  useEffect(() => {
    // Start with a clean slate, prompt user to generate
    setUuids([]);
  }, []);

  const copyToClipboard = (uuid: string) => {
    navigator.clipboard.writeText(uuid);
    toast({
      title: "UUID Copied!",
      description: `${uuid} has been copied to your clipboard.`,
    });
    trackEvent('share_clicked', { tool: 'uuid-generator', method: 'copy_button_single' });
  };
  
  const copyAllToClipboard = () => {
    const allUuids = uuids.join('\n');
    navigator.clipboard.writeText(allUuids);
    toast({
      title: "All UUIDs Copied!",
      description: "All generated UUIDs have been copied to your clipboard.",
    });
    trackEvent('share_clicked', { tool: 'uuid-generator', method: 'copy_button_all' });
  };

  return (
    <ToolContainer
      title="UUID/GUID Generator"
      description="Generate universally unique identifiers."
      icon={KeyRound}
    >
      <div className="space-y-4">
        <div className="flex flex-wrap gap-2">
            <Button onClick={generateUuids}>
                <RefreshCw className="mr-2" />
                Generate New UUIDs
            </Button>
            <Button onClick={copyAllToClipboard} variant="secondary" disabled={uuids.length === 0}>
                <Clipboard className="mr-2" />
                Copy All
            </Button>
        </div>
        <div className="space-y-2">
          <Label>Generated UUIDs:</Label>
          <div className="space-y-2 rounded-md border p-2 bg-muted min-h-[300px]">
            {uuids.length > 0 ? (
                uuids.map((uuid) => (
                <div key={uuid} className="flex items-center gap-2 p-2 rounded-md bg-background group">
                    <span className="font-mono text-sm flex-grow">{uuid}</span>
                    <Button variant="ghost" size="icon" className="h-7 w-7 opacity-0 group-hover:opacity-100" onClick={() => copyToClipboard(uuid)}>
                        <Clipboard className="h-4 w-4" />
                    </Button>
                </div>
                ))
            ) : (
                <div className="flex items-center justify-center h-full text-muted-foreground">
                    Click "Generate" to create new UUIDs.
                </div>
            )}
          </div>
        </div>
      </div>
    </ToolContainer>
  );
}
