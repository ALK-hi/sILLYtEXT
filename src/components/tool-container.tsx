"use client";

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import type { LucideIcon } from "lucide-react";

interface ToolContainerProps {
    title: string;
    description: string;
    icon: LucideIcon;
    children: React.ReactNode;
}

export function ToolContainer({ title, description, icon: Icon, children }: ToolContainerProps) {
    return (
        <Card className="w-full h-full border-0 shadow-none rounded-none md:border md:rounded-xl md:shadow-sm">
            <CardHeader>
                <CardTitle className="flex items-center gap-3 text-4xl font-bold">
                    <Icon className="h-8 w-8 text-primary" />
                    <span>{title}</span>
                </CardTitle>
                <CardDescription className="text-2xl">{description}</CardDescription>
            </CardHeader>
            <CardContent>
                {children}
            </CardContent>
        </Card>
    );
}
