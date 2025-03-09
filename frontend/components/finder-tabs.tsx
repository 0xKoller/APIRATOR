"use client";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import NetworkFinder from "@/components/network-finder";

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
        <div className='rounded-lg border p-8 text-center'>
          <h2 className='text-2xl font-semibold mb-2'>Find ICP</h2>
          <p className='text-muted-foreground'>
            This feature is coming soon. Stay tuned!
          </p>
        </div>
      </TabsContent>
    </Tabs>
  );
}
