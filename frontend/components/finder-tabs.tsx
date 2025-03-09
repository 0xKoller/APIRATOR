"use client";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import NetworkFinder from "@/components/network-finder";
import IcpFinder from "@/components/icp-finder";

export function FinderTabs() {
  return (
    <Tabs defaultValue='person' className='w-full'>
      <TabsList className='grid w-full grid-cols-2'>
        <TabsTrigger value='person'>Find Person</TabsTrigger>
        <TabsTrigger value='icp'>Find ICP</TabsTrigger>
      </TabsList>
      <TabsContent value='person' className='mt-6'>
        <NetworkFinder />
      </TabsContent>
      <TabsContent value='icp' className='mt-6'>
        <IcpFinder />
      </TabsContent>
    </Tabs>
  );
}
