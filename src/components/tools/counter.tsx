"use client";

import { useState, useMemo } from "react";
import { Textarea } from "@/components/ui/textarea";
import { ToolContainer } from "@/components/tool-container";
import { Sigma } from "lucide-react";
import { Label } from "../ui/label";
import { Card } from "../ui/card";

export function Counter() {
  const [input, setInput] = useState("");

  const stats = useMemo(() => {
    const words = input.match(/\b\w+\b/g)?.length || 0;
    const charactersWithSpaces = input.length;
    const charactersWithoutSpaces = input.replace(/\s/g, "").length;
    const lines = input.split("\n").filter(line => line.trim() !== '' || input.endsWith('\n')).length;
    return { words, charactersWithSpaces, charactersWithoutSpaces, lines };
  }, [input]);

  return (
    <ToolContainer
      title="Word, Character & Line Counter"
      description="Get instant statistics on your text."
      icon={Sigma}
    >
      <div className="space-y-4">
        <div className="space-y-2">
            <Label htmlFor="counter-input">Your Text</Label>
            <Textarea
              id="counter-input"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Type or paste your text here to see the stats..."
              className="min-h-[300px] text-base"
            />
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
            <Card className="p-4">
                <p className="text-2xl font-bold">{stats.words}</p>
                <p className="text-sm text-muted-foreground">Words</p>
            </Card>
            <Card className="p-4">
                <p className="text-2xl font-bold">{stats.charactersWithSpaces}</p>
                <p className="text-sm text-muted-foreground">Characters</p>
            </Card>
            <Card className="p-4">
                <p className="text-2xl font-bold">{stats.charactersWithoutSpaces}</p>
                <p className="text-sm text-muted-foreground">Characters (no spaces)</p>
            </Card>
            <Card className="p-4">
                <p className="text-2xl font-bold">{stats.lines}</p>
                <p className="text-sm text-muted-foreground">Lines</p>
            </Card>
        </div>
      </div>
    </ToolContainer>
  );
}
