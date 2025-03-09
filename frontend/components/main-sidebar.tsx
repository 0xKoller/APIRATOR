"use client";

import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Menu, Plus } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { useIsMobile } from "@/hooks/use-mobile";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { HistoryList } from "./history-list";
import { useNetworkFinderStore } from "@/store/network-finder-store";
import { useHistoryStore } from "@/store/history";
import { useTabStore } from "@/store/tab-store";
import { cn } from "@/lib/utils";
import { memo, useCallback, useMemo, useState } from "react";
import { LinkedInConnectDialog } from "./linkedin-connect-dialog";
import { LinkedInProfileForm } from "./linkedin-profile-form";
import { useLinkedinProfileStore } from "@/store/linkedin-profile-store";
import Image from "next/image";

const LinkedInSection = memo(() => {
  const [isOpen, setIsOpen] = useState(false);
  const { linkedinId, isAuthenticated } = useLinkedinProfileStore();

  const handleOpen = useCallback(() => {
    setIsOpen(true);
  }, []);

  const handleClose = useCallback(() => {
    setIsOpen(false);
  }, []);

  console.log("linkedinId store", linkedinId);

  return (
    <div className="px-3 space-y-4">
      {!linkedinId ? (
        <div className="space-y-2">
          <h3 className="text-sm font-medium">Conecta tu perfil de LinkedIn</h3>
          <LinkedInProfileForm />
        </div>
      ) : !isAuthenticated ? (
        <>
          <div className="text-sm">
            <p>Perfil de LinkedIn verificado</p>
            <p className="text-muted-foreground">
              Conecta tu cuenta para enviar mensajes
            </p>
          </div>
          <Button variant="outline" className="w-full" onClick={handleOpen}>
            Conectar LinkedIn
          </Button>
        </>
      ) : (
        <div className="space-y-2">
          <div className="text-sm">
            <p>LinkedIn conectado</p>
            <p className="text-muted-foreground">Puedes enviar mensajes</p>
          </div>
        </div>
      )}
      <LinkedInConnectDialog isOpen={isOpen} onClose={handleClose} />
    </div>
  );
});
LinkedInSection.displayName = "LinkedInSection";

const SidebarContent = memo(() => (
  <div className="h-full py-6">
    <div className="flex flex-col h-full space-y-4">
      <div className="px-3">
        <Image
          className="mb-2"
          src="/logo.png"
          alt="Introfy"
          width={100}
          height={100}
        />
        <TabsSection />
      </div>
      <Separator />
      <LinkedInSection />
    </div>
  </div>
));
SidebarContent.displayName = "SidebarContent";

const TabsSection = memo(() => {
  const { selectedTab, setSelectedTab } = useTabStore();

  return (
    <Tabs
      value={selectedTab}
      onValueChange={(value) => setSelectedTab(value as "person" | "icp")}
      className="w-full"
    >
      <TabsList className="grid w-full grid-cols-2 mb-4">
        <TabsTrigger value="person">Person</TabsTrigger>
        <TabsTrigger value="icp">ICP</TabsTrigger>
      </TabsList>
      <TabsContent value="person">
        <PersonTabContent />
      </TabsContent>
      <TabsContent value="icp">
        <IcpTabContent />
      </TabsContent>
    </Tabs>
  );
});
TabsSection.displayName = "TabsSection";

const PersonTabContent = memo(() => {
  const { step } = useNetworkFinderStore();
  const { selectedSearch } = useHistoryStore();
  const handleNewSearch = useNewSearchCallback();

  return (
    <div className="space-y-4">
      <div className="space-y-1">
        <Button
          variant="ghost"
          className={cn(
            "w-full justify-start",
            step === "input" && !selectedSearch && "bg-accent"
          )}
          onClick={handleNewSearch}
        >
          <Plus className="mr-2 h-4 w-4" />
          New Search
        </Button>
      </div>
      <Separator />
      <div className="px-1">
        <h3 className="mb-2 text-sm font-medium">Recent Searches</h3>
        <HistoryList type="person" />
      </div>
    </div>
  );
});
PersonTabContent.displayName = "PersonTabContent";

const IcpTabContent = memo(() => (
  <div className="space-y-4">
    <div className="space-y-1">
      <Button variant="ghost" className="w-full justify-start">
        <Plus className="mr-2 h-4 w-4" />
        New Search
      </Button>
    </div>
    <Separator />
    <div className="px-1">
      <h3 className="mb-2 text-sm font-medium">Recent Searches</h3>
      <HistoryList type="icp" />
    </div>
  </div>
));
IcpTabContent.displayName = "IcpTabContent";

const useNewSearchCallback = () => {
  const { setStep, resetStore } = useNetworkFinderStore();
  const { clearSelectedSearch } = useHistoryStore();

  return useMemo(
    () => () => {
      clearSelectedSearch();
      resetStore();
      setStep("input");
    },
    [clearSelectedSearch, resetStore, setStep]
  );
};

export function MainSidebar() {
  const isMobile = useIsMobile();

  if (!isMobile) {
    return (
      <div className="hidden lg:block w-[250px] border-r bg-background h-screen">
        <SidebarContent />
      </div>
    );
  }

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon" className="lg:hidden">
          <Menu className="h-6 w-6" />
        </Button>
      </SheetTrigger>
      <SheetContent side="left" className="w-[350px] p-0">
        <SidebarContent />
      </SheetContent>
    </Sheet>
  );
}
