"use client";

import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Menu, Plus, Search } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { useIsMobile } from "@/hooks/use-mobile";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { HistoryList } from "./history-list";
import { useNetworkFinderStore } from "@/store/network-finder-store";
import { useHistoryStore } from "@/store/history";
import { useTabStore } from "@/store/tab-store";
import { cn } from "@/lib/utils";

export function MainSidebar() {
  const isMobile = useIsMobile();
  const { step, setStep, resetStore } = useNetworkFinderStore();
  const { selectedSearch, clearSelectedSearch } = useHistoryStore();
  const { selectedTab, setSelectedTab } = useTabStore();

  const handleNewSearch = () => {
    clearSelectedSearch();
    resetStore();
    setStep("input");
  };

  const SidebarContent = () => (
    <div className='h-full py-6'>
      <div className='flex flex-col h-full space-y-4'>
        <div className='px-3'>
          <h2 className='mb-4 px-4 text-lg font-semibold'>APIRATOR</h2>
          <Tabs
            value={selectedTab}
            onValueChange={(value) => setSelectedTab(value as "person" | "icp")}
            className='w-full'
          >
            <TabsList className='grid w-full grid-cols-2 mb-4'>
              <TabsTrigger value='person'>Person</TabsTrigger>
              <TabsTrigger value='icp'>ICP</TabsTrigger>
            </TabsList>
            <TabsContent value='person'>
              <div className='space-y-4'>
                <div className='space-y-1'>
                  <Button
                    variant='ghost'
                    className={cn(
                      "w-full justify-start",
                      step === "input" && !selectedSearch && "bg-accent"
                    )}
                    onClick={handleNewSearch}
                  >
                    <Plus className='mr-2 h-4 w-4' />
                    New Search
                  </Button>
                </div>
                <Separator />
                <div className='px-1'>
                  <h3 className='mb-2 text-sm font-medium'>Recent Searches</h3>
                  <HistoryList type='person' />
                </div>
              </div>
            </TabsContent>
            <TabsContent value='icp'>
              <div className='space-y-4'>
                <div className='space-y-1'>
                  <Button variant='ghost' className='w-full justify-start'>
                    <Plus className='mr-2 h-4 w-4' />
                    New Search
                  </Button>
                </div>
                <Separator />
                <div className='px-1'>
                  <h3 className='mb-2 text-sm font-medium'>Recent Searches</h3>
                  <HistoryList type='icp' />
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );

  if (!isMobile) {
    return (
      <div className='hidden lg:block w-[250px] border-r bg-background h-screen'>
        <SidebarContent />
      </div>
    );
  }

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant='ghost' size='icon' className='lg:hidden'>
          <Menu className='h-6 w-6' />
        </Button>
      </SheetTrigger>
      <SheetContent side='left' className='w-[350px] p-0'>
        <SidebarContent />
      </SheetContent>
    </Sheet>
  );
}
