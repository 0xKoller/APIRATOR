"use client";

import { MainSidebar } from "@/components/main-sidebar";
import NetworkFinder from "@/components/network-finder";
import IcpFinder from "@/components/icp-finder";
import { useTabStore } from "@/store/tab-store";

export default function Home() {
  const { selectedTab } = useTabStore();

  return (
    <div className='flex min-h-screen'>
      <MainSidebar />
      <main className='flex-1 bg-gray-50 text-gray-800 p-4 md:p-8 overflow-hidden'>
        {selectedTab === "person" ? <NetworkFinder /> : <IcpFinder />}
      </main>
    </div>
  );
}
