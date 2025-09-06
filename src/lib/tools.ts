import {
  CaseSensitive,
  Sigma,
  ArrowLeftRight,
  Eraser,
  CopyX,
  Diff,
  Code,
  type LucideIcon,
  Braces,
  KeyRound,
  Shield,
  Search,
  Quote,
  Table,
} from "lucide-react";
import type { ComponentType } from "react";
import dynamic from 'next/dynamic';

export type ToolId =
  | "case-converter"
  | "counter"
  | "reverser"
  | "whitespace-remover"
  | "duplicate-remover"
  | "diff-tool"
  | "encoder-decoder"
  | "json-xml-formatter"
  | "uuid-generator"
  | "password-generator"
  | "find-and-replace"
  | "typography-standardizer"
  | "csv-tool";

export interface Tool {
  id: ToolId;
  name: string;
  description: string;
  icon: LucideIcon;
  meta: {
    title: string;
    description: string;
  };
}

export const tools: Omit<Tool, 'component'>[] = [
    {
    id: "case-converter",
    name: "Case Converter",
    description: "Instantly convert text to any case.",
    icon: CaseSensitive,
    meta: {
      title: "Online Case Converter Tool",
      description: "Easily convert text between uppercase, lowercase, title case, sentence case, camel case, and more with our free case converter tool. Perfect for developers, writers, and editors.",
    }
  },
  {
    id: "counter",
    name: "Word Counter",
    description: "Get lightning-fast word & character counts.",
    icon: Sigma,
    meta: {
      title: "Word and Character Counter",
      description: "Free online tool to count words, characters, sentences, and lines in your text. Instant statistics for writers, students, and professionals.",
    }
  },
  {
    id: "reverser",
    name: "Text Reverser",
    description: "Flip text, words, or letters in a click.",
    icon: ArrowLeftRight,
    meta: {
      title: "Text Reverser Tool",
      description: "Reverse text, flip words, and mirror letters with our simple online text reverser. Useful for data processing, creating fun text, and more.",
    }
  },
  {
    id: "whitespace-remover",
    name: "Whitespace Cleaner",
    description: "Erase extra spaces, tabs & line breaks.",
    icon: Eraser,
    meta: {
      title: "Whitespace and Line Break Remover",
      description: "Clean up your text by removing extra spaces, tabs, and line breaks. A handy tool for formatting text for web pages, documents, or code.",
    }
  },
  {
    id: "duplicate-remover",
    name: "Duplicate Line Remover",
    description: "Find and delete duplicate lines instantly.",
    icon: CopyX,
    meta: {
      title: "Duplicate Line Remover Online",
      description: "Quickly remove duplicate lines from any text or list. Just paste your text and get a clean, unique list in seconds. Free and easy to use.",
    }
  },
  {
      id: "find-and-replace",
      name: "Find and Replace",
      description: "Perform powerful text replacements.",
      icon: Search,
      meta: {
          title: "Online Find and Replace Tool",
          description: "Quickly find and replace words or patterns in your text. Supports case-sensitive, whole word, and regular expression searches.",
      },
  },
  {
    id: "diff-tool",
    name: "Text Diff Checker",
    description: "Compare two texts & see the difference.",
    icon: Diff,
    meta: {
      title: "Text Difference Checker (Diff Tool)",
      description: "Compare two text files or snippets to find the differences. Our free online diff tool highlights changes between two versions of your text.",
    }
  },
  {
    id: "csv-tool",
    name: "CSV Tools",
    description: "Transpose, delimit, and manage CSVs.",
    icon: Table,
    meta: {
      title: "Online CSV Editor & Tools",
      description: "A free suite of online tools for CSV data: change delimiters, transpose rows and columns, manage quotes, and more. Perfect for data cleaning and preparation.",
    }
  },
  {
    id: "encoder-decoder",
    name: "Encoder/Decoder",
    description: "Encode/Decode Base64 and URLs.",
    icon: Code,
    meta: {
      title: "Base64 & URL Encoder/Decoder",
      description: "Free online tool to encode and decode text using Base64 or URL encoding (percent-encoding). Simple and fast for web developers and programmers.",
    }
  },
  {
    id: "json-xml-formatter",
    name: "JSON/XML Formatter",
    description: "Beautify or minify structured data.",
    icon: Braces,
    meta: {
      title: "JSON & XML Formatter/Minifier",
      description: "Beautify, format, or minify JSON and XML data with our easy-to-use online tool. Essential for developers and data analysts working with structured data.",
    }
  },
  {
      id: "typography-standardizer",
      name: "Typography Fixer",
      description: "Convert to smart quotes & fix dashes.",
      icon: Quote,
      meta: {
          title: "Typography Standardizer Tool",
          description: "Automatically convert plain quotes to smart (curly) quotes and standardize hyphens and dashes for professional-looking text.",
      },
  },
  {
    id: "uuid-generator",
    name: "UUID Generator",
    description: "Generate unique identifiers (UUIDs).",
    icon: KeyRound,
    meta: {
      title: "UUID/GUID Generator",
      description: "Generate universally unique identifiers (UUIDs/GUIDs) for your software development needs. Quick, simple, and reliable.",
    }
  },
  {
    id: "password-generator",
    name: "Password Generator",
    description: "Create strong, secure passwords.",
    icon: Shield,
    meta: {
      title: "Strong Password Generator",
      description: "Generate secure, random passwords to protect your online accounts. Customize length and character types for maximum security.",
    }
  },
];

export const toolMap: Map<ToolId, Omit<Tool, 'component'>> = new Map(tools.map(t => [t.id, t]));

export const isValidToolId = (id: any): id is ToolId => {
  return toolMap.has(id);
};

// We use a simple factory function to avoid creating a large object
// of all dynamic components at once, which can hinder code splitting.
export const getToolComponent = (toolId: string): React.ComponentType | null => {
    if (!isValidToolId(toolId)) return null;

    switch (toolId) {
        case 'case-converter':
            return dynamic(() => import('@/components/tools/case-converter').then(m => m.CaseConverter));
        case 'counter':
            return dynamic(() => import('@/components/tools/counter').then(m => m.Counter));
        case 'reverser':
            return dynamic(() => import('@/components/tools/reverser').then(m => m.Reverser));
        case 'whitespace-remover':
            return dynamic(() => import('@/components/tools/whitespace-remover').then(m => m.WhitespaceRemover));
        case 'duplicate-remover':
            return dynamic(() => import('@/components/tools/duplicate-remover').then(m => m.DuplicateRemover));
        case 'find-and-replace':
            return dynamic(() => import('@/components/tools/find-and-replace').then(m => m.FindAndReplace));
        case 'diff-tool':
            return dynamic(() => import('@/components/tools/diff-tool').then(m => m.DiffTool));
        case 'csv-tool':
            return dynamic(() => import('@/components/tools/csv-tool').then(m => m.CsvTool));
        case 'encoder-decoder':
            return dynamic(() => import('@/components/tools/encoder-decoder').then(m => m.EncoderDecoder));
        case 'json-xml-formatter':
            return dynamic(() => import('@/components/tools/json-xml-formatter').then(m => m.JsonXmlFormatter));
        case 'typography-standardizer':
            return dynamic(() => import('@/components/tools/typography-standardizer').then(m => m.TypographyStandardizer));
        case 'uuid-generator':
            return dynamic(() => import('@/components/tools/uuid-generator').then(m => m.UuidGenerator));
        case 'password-generator':
            return dynamic(() => import('@/components/tools/password-generator').then(m => m.PasswordGenerator));
        default:
            return null;
    }
}
