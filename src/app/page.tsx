"use client";

import * as React from "react";
import Link from "next/link";
import {
    Text,
} from "lucide-react";
import { Card, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { tools, getToolComponent } from "@/lib/tools";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import { StarSticker } from "@/components/ui/star-sticker";


export default function HomePage() {
    const [searchTerm, setSearchTerm] = React.useState("");
    const router = useRouter();

    const filteredTools = React.useMemo(() => {
        if (!searchTerm) return tools;
        return tools.filter(
            (tool) =>
                tool.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                tool.description.toLowerCase().includes(searchTerm.toLowerCase())
        );
    }, [searchTerm]);

    const handlePreload = (toolId: string) => {
        // This will start preloading the component's code
        getToolComponent(toolId); 
    };

    return (
        <div className="flex flex-col min-h-screen bg-background">
            <header className="sticky top-0 z-40 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
                <div className="container flex h-24 items-center justify-center">
                    <div className="flex items-center gap-4">
                        <Text className="h-10 w-10 text-primary" />
                        <h1 className="text-5xl font-display tracking-wider">sILLYtEXT</h1>
                    </div>
                </div>
            </header>
            <main className="container py-8 flex-1">
                <div className="text-center space-y-4 mb-12 relative">
                     <StarSticker className="top-[-2rem] left-[15%] rotate-[-15deg] w-12 h-12" />
                    <h1 className="text-5xl font-bold tracking-tight lg:text-6xl">
                        Universal Text Utility Suite
                    </h1>
                    <p className="text-2xl text-muted-foreground max-w-2xl mx-auto">
                        Your one-stop shop for text manipulation. From case conversion to data formatting, we have the right tool for the job. Fast, secure, and all within your browser.
                    </p>
                    <StarSticker className="bottom-[-1rem] right-[15%] rotate-[20deg]" />
                </div>
                <div className="mb-8 max-w-lg mx-auto">
                    <Input
                        type="text"
                        placeholder="Search for a tool (e.g., 'JSON', 'password', 'diff')..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="h-12 text-2xl"
                    />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
                    {filteredTools.map((tool) => {
                        return (
                            <Link href={`/${tool.id}`} key={tool.id} className="group" onMouseEnter={() => handlePreload(tool.id)}>
                                <Card 
                                    className="h-full transition-transform duration-200 transform hover:-translate-y-1"
                                    style={{ 
                                        backgroundColor: 'hsl(var(--card))',
                                        border: '2px solid hsl(var(--card-sticker))',
                                        boxShadow: '4px 4px 0px hsl(var(--card-sticker))'
                                    }}
                                >
                                    <CardHeader>
                                        <CardTitle className="flex items-center gap-3 text-3xl">
                                            <tool.icon className="h-8 w-8 text-primary" />
                                            <span>{tool.name}</span>
                                        </CardTitle>
                                        <CardDescription className="text-xl text-card-foreground/80">{tool.description}</CardDescription>
                                    </CardHeader>
                                </Card>
                            </Link>
                        )
                    })}
                    {filteredTools.length === 0 && (
                        <div className="text-center col-span-full py-12">
                             <p className="text-muted-foreground text-2xl">No tools found for "{searchTerm}"</p>
                        </div>
                    )}
                </div>
            </main>
            <footer className="py-6 md:px-8 md:py-0 border-t">
                <div className="container flex flex-col items-center justify-between gap-4 md:h-24 md:flex-row">
                    <p className="text-balance text-center text-lg leading-loose text-muted-foreground md:text-left">
                        Built to make your text tasks easier. All tools run in your browser for privacy and speed.
                    </p>
                </div>
            </footer>
        </div>
    );
}
