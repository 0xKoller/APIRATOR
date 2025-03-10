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
  const { linkedinId, isAuthenticated, linkedinUrl } =
    useLinkedinProfileStore();

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
        <div className="relative bg-white rounded-xl overflow-hidden border border-gray-200 p-4 flex flex-col items-center text-center">
          <div className="absolute top-4 right-4 flex items-center">
            <span className="relative flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-green-500"></span>
            </span>
          </div>

          <div className="w-12 h-12 bg-blue-50 rounded-full flex items-center justify-center mb-3">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="h-6 w-6 text-blue-600"
            >
              <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"></path>
              <rect x="2" y="9" width="4" height="12"></rect>
              <circle cx="4" cy="4" r="2"></circle>
            </svg>
          </div>

          <h3 className="text-sm font-medium text-gray-900">
            LinkedIn Connected
          </h3>
          <p className="text-xs text-gray-500 mt-1">You are connected as</p>
          <p className="text-sm font-semibold text-blue-600 mt-1">
            {linkedinUrl?.split("/in/")[1].split("/")?.[0] ||
              linkedinId ||
              "User"}
          </p>

          <div className="w-full mt-3 pt-3 border-t border-gray-100">
            <p className="text-xs text-green-600 font-medium">
              Ready to send messages
            </p>
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
