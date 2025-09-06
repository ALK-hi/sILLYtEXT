"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { ToolContainer } from "@/components/tool-container";
import { Diff } from "lucide-react";
import { cn } from "@/lib/utils";
import { Label } from "../ui/label";
import { trackEvent } from "@/lib/analytics";

interface DiffLine {
    text: string;
    diff: boolean;
}

export function DiffTool() {
  const [text1, setText1] = useState("");
  const [text2, setText2] = useState("");
  const [leftDiff, setLeftDiff] = useState<DiffLine[]>([]);
  const [rightDiff, setRightDiff] = useState<DiffLine[]>([]);

  const handleCompare = () => {
    const lines1 = text1.split('\n');
    const lines2 = text2.split('\n');
    const numLines = Math.max(lines1.length, lines2.length);
    const leftResult: DiffLine[] = [];
    const rightResult: DiffLine[] = [];

    for (let i = 0; i < numLines; i++) {
        const line1 = lines1[i] || '';
        const line2 = lines2[i] || '';
        const diff = line1 !== line2;
        leftResult.push({ text: line1, diff });
        rightResult.push({ text: line2, diff });
    }
    setLeftDiff(leftResult);
    setRightDiff(rightResult);
    trackEvent('tool_used', { tool: 'diff-tool', params: {} });
  };
  
  return (
    <ToolContainer
      title="Basic Text Diff Tool"
      description="Compare two text inputs and highlight the differences."
      icon={Diff}
    >
      <div className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="text1">Original Text</Label>
            <Textarea
              id="text1"
              value={text1}
              onChange={(e) => setText1(e.target.value)}
              placeholder="Paste the first text here."
              className="min-h-[200px] text-base font-mono"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="text2">Changed Text</Label>
            <Textarea
              id="text2"
              value={text2}
              onChange={(e) => setText2(e.target.value)}
              placeholder="Paste the second text here."
              className="min-h-[200px] text-base font-mono"
            />
          </div>
        </div>
        <Button onClick={handleCompare}>Compare</Button>

        {leftDiff.length > 0 && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                <div className="border rounded-md p-2 bg-muted min-h-[200px] overflow-auto">
                    <pre className="text-sm font-mono">
                        {leftDiff.map((line, index) => (
                            <div key={index} className={cn("px-2", line.diff && "bg-destructive/20")}>
                                <span className="text-muted-foreground select-none w-8 inline-block mr-2">{index + 1}</span>
                                <span>{line.text}</span>
                            </div>
                        ))}
                    </pre>
                </div>
                <div className="border rounded-md p-2 bg-muted min-h-[200px] overflow-auto">
                    <pre className="text-sm font-mono">
                        {rightDiff.map((line, index) => (
                           <div key={index} className={cn("px-2", line.diff && "bg-primary/20")}>
                               <span className="text-muted-foreground select-none w-8 inline-block mr-2">{index + 1}</span>
                               <span>{line.text}</span>
                           </div>
                        ))}
                    </pre>
                </div>
            </div>
        )}
      </div>
    </ToolContainer>
  );
}
