
import * as React from "react";
import { toolMap, isValidToolId, ToolId } from "@/lib/tools";
import { notFound } from "next/navigation";
import { ToolClientPage } from "./tool-client-page";

interface ToolPageProps {
  params: Promise<{
    tool: ToolId;
  }>;
}

export default async function ToolPage({ params }: ToolPageProps) {
  const { tool: toolId } = await params;

  if (!isValidToolId(toolId)) {
    notFound();
  }

  const activeTool = toolMap.get(toolId);
  if (!activeTool) {
    notFound();
  }
  
  return <ToolClientPage toolId={toolId} />;
}

export async function generateStaticParams() {
  const { tools: toolList } = await import('@/lib/tools');
  return toolList.map((tool) => ({
    tool: tool.id,
  }));
}

export async function generateMetadata({ params }: ToolPageProps) {
  const { tool: toolId } = await params;
  const tool = toolMap.get(toolId);
  if (!tool) {
    return {
      title: "Tool not found",
    };
  }
  return {
    title: tool.meta.title,
    description: tool.meta.description,
  };
}
