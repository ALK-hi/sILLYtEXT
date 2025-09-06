"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { ToolContainer } from "@/components/tool-container";
import { Table, Clipboard } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { trackEvent } from "@/lib/analytics";

const exampleCSV = `id,name,email
1,John Doe,john.doe@example.com
2,Jane Smith,jane.smith@example.com`;

export function CsvTool() {
  const [input, setInput] = useState(exampleCSV);
  const [output, setOutput] = useState("");
  const [fromDelimiter, setFromDelimiter] = useState(",");
  const [toDelimiter, setToDelimiter] = useState("|");
  const { toast } = useToast();

  const parseCSV = (str: string, delimiter: string) => {
    const rows = str.split('\n');
    return rows.map(row => row.split(delimiter));
  };

  const stringifyCSV = (data: string[][], delimiter: string) => {
    return data.map(row => row.join(delimiter)).join('\n');
  };

  const handleTranspose = () => {
    const data = parseCSV(input, fromDelimiter);
    if (data.length === 0) return;

    const transposedData = data[0].map((_, colIndex) => data.map(row => row[colIndex]));
    setOutput(stringifyCSV(transposedData, toDelimiter));
    trackEvent('tool_used', { tool: 'csv-tool', params: { action: 'transpose' } });
  };
  
  const handleChangeDelimiter = () => {
    const data = parseCSV(input, fromDelimiter);
    setOutput(stringifyCSV(data, toDelimiter));
    trackEvent('tool_used', { tool: 'csv-tool', params: { action: 'change-delimiter' } });
  }

  const handleQuoteAll = () => {
    const data = parseCSV(input, fromDelimiter);
    const quotedData = data.map(row => row.map(cell => `"${cell.replace(/"/g, '""')}"`));
    setOutput(stringifyCSV(quotedData, fromDelimiter));
    trackEvent('tool_used', { tool: 'csv-tool', params: { action: 'quote-all' } });
  };

  const handleUnquoteAll = () => {
    const data = parseCSV(input, fromDelimiter);
    const unquotedData = data.map(row => row.map(cell => {
      let newCell = cell;
      if (newCell.startsWith('"') && newCell.endsWith('"')) {
        newCell = newCell.substring(1, newCell.length - 1);
      }
      return newCell.replace(/""/g, '"');
    }));
    setOutput(stringifyCSV(unquotedData, fromDelimiter));
    trackEvent('tool_used', { tool: 'csv-tool', params: { action: 'unquote-all' } });
  }

  const copyToClipboard = () => {
    if (!output) return;
    navigator.clipboard.writeText(output);
    toast({
      title: "Copied to clipboard!",
      description: "The CSV data has been copied.",
    });
    trackEvent('share_clicked', { tool: 'csv-tool', method: 'copy_button' });
  };

  return (
    <ToolContainer
      title="CSV Tools"
      description="Manipulate CSV data like changing delimiters, transposing, and more."
      icon={Table}
    >
      <div className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="input-text">Input CSV</Label>
            <Textarea
              id="input-text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Paste your CSV data here..."
              className="min-h-[250px] text-base font-mono"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="output-text">Output CSV</Label>
            <div className="relative">
              <Textarea
                id="output-text"
                value={output}
                readOnly
                placeholder="Result will appear here..."
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
                <h3 className="font-semibold">Delimiter</h3>
                <div className="flex items-center gap-2">
                   <Input 
                      value={fromDelimiter}
                      onChange={(e) => setFromDelimiter(e.target.value)}
                      className="w-16 text-center"
                   />
                   <Label>to</Label>
                   <Input 
                      value={toDelimiter}
                      onChange={(e) => setToDelimiter(e.target.value)}
                      className="w-16 text-center"
                   />
                </div>
                <Button onClick={handleChangeDelimiter} className="w-full">Change Delimiter</Button>
            </div>
            <div className="space-y-2">
                <h3 className="font-semibold">Structure</h3>
                <Button onClick={handleTranspose} className="w-full">Transpose Data</Button>
            </div>
             <div className="space-y-2">
                <h3 className="font-semibold">Quoting</h3>
                <div className="flex gap-2">
                    <Button onClick={handleQuoteAll} className="w-full">Quote All</Button>
                    <Button onClick={handleUnquoteAll} className="w-full">Unquote All</Button>
                </div>
            </div>
        </div>

      </div>
    </ToolContainer>
  );
}
