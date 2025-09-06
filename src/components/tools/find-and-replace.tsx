"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { ToolContainer } from "@/components/tool-container";
import { Search, Clipboard, Save, Trash2, BookMarked, MessageSquare } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "../ui/separator";
import { trackEvent } from "@/lib/analytics";

interface SavedPattern {
  name: string;
  pattern: string;
}

const exampleText = `
// Example: Standardizing API keys in a config file
const config = {
  "apiKey": "old_api_key_123",
  "apiSecret": "secret_abc",
  "third_party_key": "old_api_key_456"
}
`.trim();

export function FindAndReplace() {
  const [input, setInput] = useState(exampleText);
  const [find, setFind] = useState("old_api_key_\\w+");
  const [replace, setReplace] = useState("NEW_KEY_XYZ");
  const [output, setOutput] = useState("");
  const [isCaseSensitive, setIsCaseSensitive] = useState(false);
  const [isWholeWord, setIsWholeWord] = useState(false);
  const [isRegex, setIsRegex] = useState(true);
  const [savedPatterns, setSavedPatterns] = useState<SavedPattern[]>([]);
  const [newPatternName, setNewPatternName] = useState("");
  const { toast } = useToast();

  useEffect(() => {
    try {
      const storedPatterns = localStorage.getItem("findReplacePatterns");
      if (storedPatterns) {
        setSavedPatterns(JSON.parse(storedPatterns));
      }
    } catch (error) {
      console.error("Failed to parse saved patterns from localStorage", error);
    }
  }, []);

  useEffect(() => {
    try {
      localStorage.setItem("findReplacePatterns", JSON.stringify(savedPatterns));
    } catch (error) {
      console.error("Failed to save patterns to localStorage", error);
    }
  }, [savedPatterns]);

  const handleReplace = () => {
    if (!find) {
      setOutput(input);
      return;
    }

    try {
      let flags = "g";
      if (!isCaseSensitive) {
        flags += "i";
      }
      
      let findPattern = find;
      if (!isRegex) {
        findPattern = find.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&');
      }
      if (isWholeWord) {
        findPattern = `\\b${findPattern}\\b`;
      }

      const regex = new RegExp(findPattern, flags);
      const result = input.replace(regex, replace);
      setOutput(result);
       trackEvent('tool_used', { 
        tool: 'find-and-replace', 
        params: { 
          caseSensitive: isCaseSensitive, 
          wholeWord: isWholeWord,
          regex: isRegex,
          pattern_saved: false 
        } 
      });
    } catch (error: any) {
       toast({
        variant: "destructive",
        title: "Invalid Regular Expression",
        description: error.message,
      });
      setOutput(input);
    }
  };

  const copyToClipboard = () => {
    if (!output) return;
    navigator.clipboard.writeText(output);
    toast({
      title: "Copied to clipboard!",
      description: "The result has been copied.",
    });
    trackEvent('share_clicked', { tool: 'find-and-replace', method: 'copy_button' });
  };

  const handleSavePattern = () => {
    if (!newPatternName.trim() || !find.trim()) {
      toast({
        variant: "destructive",
        title: "Cannot save pattern",
        description: "Please provide a name and a pattern to save.",
      });
      return;
    }
    if (!isRegex) {
      toast({
        variant: "destructive",
        title: "Cannot save pattern",
        description: "Only regular expression patterns can be saved.",
      });
      return;
    }
    setSavedPatterns([...savedPatterns, { name: newPatternName, pattern: find }]);
    setNewPatternName("");
     toast({
      title: "Pattern saved!",
      description: `The pattern "${newPatternName}" has been saved.`,
    });
  };

  const loadPattern = (pattern: string) => {
    setFind(pattern);
    setIsRegex(true);
    toast({
      title: "Pattern loaded!",
      description: "The selected pattern has been loaded into the 'Find' field.",
    });
  };

  const deletePattern = (name: string) => {
    setSavedPatterns(savedPatterns.filter(p => p.name !== name));
    toast({
      title: "Pattern deleted!",
      description: `The pattern "${name}" has been deleted.`,
    });
  };


  return (
    <ToolContainer
      title="Find and Replace"
      description="Powerfully search for words or patterns and replace them in bulk."
      icon={Search}
    >
      <div className="flex flex-col lg:flex-row gap-8">
        <div className="flex-1 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Find</Label>
              <Input 
                value={find}
                onChange={(e) => setFind(e.target.value)}
                placeholder="Text to find..."
              />
            </div>
            <div className="space-y-2">
              <Label>Replace with</Label>
              <Input 
                value={replace}
                onChange={(e) => setReplace(e.target.value)}
                placeholder="Text to replace with..."
              />
            </div>
          </div>

          <div className="flex flex-wrap gap-4 items-center">
              <div className="flex items-center space-x-2">
                  <Checkbox id="case-sensitive" checked={isCaseSensitive} onCheckedChange={(checked) => setIsCaseSensitive(Boolean(checked))} />
                  <Label htmlFor="case-sensitive">Case Sensitive</Label>
              </div>
               <div className="flex items-center space-x-2">
                  <Checkbox id="whole-word" checked={isWholeWord} onCheckedChange={(checked) => setIsWholeWord(Boolean(checked))} />
                  <Label htmlFor="whole-word">Whole Word</Label>
              </div>
               <div className="flex items-center space-x-2">
                  <Checkbox id="regex" checked={isRegex} onCheckedChange={(checked) => setIsRegex(Boolean(checked))} />
                  <Label htmlFor="regex">Regular Expression</Label>
              </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="input-text">Input Text</Label>
              <Textarea
                id="input-text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Paste your text here..."
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
                  placeholder="Result will appear here..."
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
          <Button onClick={handleReplace}>Find and Replace</Button>
        </div>

        <div className="lg:w-80 space-y-4">
             <Card className="bg-muted/50">
                <CardContent className="p-4">
                     <div className="flex items-start gap-3">
                        <MessageSquare className="h-5 w-5 text-muted-foreground mt-1 flex-shrink-0" />
                        <blockquote className="text-sm text-muted-foreground italic">
                            "The regex find-and-replace saved me hours of manual work refactoring our codebase. A total lifesaver!"
                            <cite className="block text-right not-italic font-semibold mt-2">— A Happy Developer</cite>
                        </blockquote>
                    </div>
                </CardContent>
            </Card>
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-xl">
                        <Save className="h-5 w-5"/>
                        Save Current Pattern
                    </CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                     <p className="text-sm text-muted-foreground">
                        Save the current "Find" value as a named regex pattern for later use.
                    </p>
                    <Label htmlFor="new-pattern-name">Pattern Name</Label>
                    <Input 
                        id="new-pattern-name"
                        value={newPatternName}
                        onChange={(e) => setNewPatternName(e.target.value)}
                        placeholder="e.g., Email addresses"
                        disabled={!isRegex}
                    />
                    <Button onClick={handleSavePattern} className="w-full" disabled={!isRegex}>Save Pattern</Button>
                </CardContent>
            </Card>
            <Separator />
            <Card>
                 <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-xl">
                        <BookMarked className="h-5 w-5"/>
                        Saved Patterns
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    {savedPatterns.length > 0 ? (
                        <div className="space-y-2">
                            {savedPatterns.map((p) => (
                                <div key={p.name} className="flex items-center justify-between gap-2 rounded-md border p-2">
                                    <div className="flex-1 cursor-pointer" onClick={() => loadPattern(p.pattern)}>
                                        <p className="font-semibold text-sm">{p.name}</p>
                                        <p className="text-xs text-muted-foreground font-mono truncate">{p.pattern}</p>
                                    </div>
                                    <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive" onClick={() => deletePattern(p.name)}>
                                        <Trash2 className="h-4 w-4" />
                                    </Button>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <p className="text-sm text-muted-foreground text-center py-4">
                            You have no saved patterns. Enable "Regular Expression" and save one above!
                        </p>
                    )}
                </CardContent>
            </Card>
        </div>
      </div>
    </ToolContainer>
  );
}
