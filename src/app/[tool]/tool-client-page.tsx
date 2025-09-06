"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import {
    Text,
    PanelLeft,
    MessageSquareQuote,
} from "lucide-react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import {
  SidebarProvider,
  Sidebar,
  SidebarHeader,
  SidebarContent,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarFooter,
  SidebarSeparator,
} from "@/components/ui/sidebar";
import { useIsMobile } from "@/hooks/use-mobile";
import { type ToolId, tools as toolList } from "@/lib/tools";
import Link from "next/link";
import { ToolLoader } from "@/components/tool-loader";
import { trackEvent } from "@/lib/analytics";
import { StarSticker } from "@/components/ui/star-sticker";

interface ToolClientPageProps {
  toolId: ToolId;
}

export function ToolClientPage({ toolId: initialToolId }: ToolClientPageProps) {
  const router = useRouter();
  const [activeToolId, setActiveToolId] = React.useState<ToolId>(initialToolId);
  const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false);
  const isMobile = useIsMobile();

  React.useEffect(() => {
    // Sync active tool with URL changes (e.g., browser back/forward)
    setActiveToolId(initialToolId);
    trackEvent('page_view', { page_path: `/${initialToolId}` });
  }, [initialToolId]);

  const handleToolSelect = (toolId: ToolId) => {
    setActiveToolId(toolId);
    router.push(`/${toolId}`, { scroll: false });
    if(isMobile) {
        setMobileMenuOpen(false);
    }
  };

  const sidebarContent = (
    <>
      <SidebarHeader className="p-4 border-b">
        <Link href="/" className="flex items-center gap-2">
            <Text className="h-8 w-8 text-primary" />
            <h1 className="text-2xl font-display tracking-wider">sILLYtEXT</h1>
        </Link>
      </SidebarHeader>
      <SidebarContent>
        <SidebarMenu>
          {toolList.map((tool) => (
            <SidebarMenuItem key={tool.id}>
              <SidebarMenuButton
                onClick={() => handleToolSelect(tool.id)}
                isActive={activeToolId === tool.id}
                tooltip={tool.name}
                className="text-xl"
              >
                <tool.icon />
                <span>{tool.name}</span>
              </SidebarMenuButton>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarContent>
       <SidebarFooter>
        <SidebarSeparator />
        <SidebarMenu>
          <SidebarMenuItem>
             <a href="https://docs.google.com/forms/d/e/1FAIpQLSc09925uphnKIVZLt5ru9TX76aeGjtj8vkYuwWEuXrpgfE3yA/viewform?usp=sharing&ouid=112809381718291182395" target="_blank" rel="noopener noreferrer" className="w-full">
                <SidebarMenuButton tooltip="Help us improve!" className="text-xl">
                    <MessageSquareQuote />
                    <span>Give Feedback</span>
                </SidebarMenuButton>
            </a>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </>
  );

  return (
    <SidebarProvider defaultOpen>
      <div className="flex min-h-screen bg-background">
        {isMobile ? (
             <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
                <SheetTrigger asChild>
                    <Button size="icon" variant="outline" className="fixed top-2.5 left-4 z-20 md:hidden" onClick={() => setMobileMenuOpen(true)}>
                        <PanelLeft className="h-5 w-5" />
                        <span className="sr-only">Toggle Menu</span>
                    </Button>
                </SheetTrigger>
                <SheetContent side="left" className="p-0 w-3/4 flex flex-col">
                   <div className="sr-only">
                      <SheetHeader>
                          <SheetTitle>Menu</SheetTitle>
                      </SheetHeader>
                    </div>
                    {sidebarContent}
                </SheetContent>
            </Sheet>
        ) : (
            <Sidebar>
                {sidebarContent}
            </Sidebar>
        )}
        <div className="flex flex-col flex-1 relative">
           <StarSticker className="top-4 right-4 rotate-[15deg] w-12 h-12 hidden md:block" />
           <StarSticker className="bottom-4 left-4 rotate-[-15deg] w-12 h-12 hidden md:block" />
          <header className="sticky top-0 z-10 flex h-14 items-center gap-4 border-b bg-background px-4 sm:static sm:h-auto sm:border-0 sm:bg-transparent sm:px-6 md:hidden">
             <div className="flex items-center gap-2">
                <Text className="h-6 w-6 text-primary" />
                <h1 className="text-xl font-display tracking-wider">sILLYtEXT</h1>
            </div>
          </header>
          <main className="p-4 sm:p-6 h-full flex-1">
            <ToolLoader toolId={activeToolId} />
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
}
