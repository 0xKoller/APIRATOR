import { MainSidebar } from "@/components/main-sidebar";
import NetworkFinder from "@/components/network-finder";

export default function Home() {
  return (
    <div className='flex min-h-screen'>
      <MainSidebar />
      <main className='flex-1 bg-gray-50 text-gray-800 p-4 md:p-8 overflow-hidden'>
        <NetworkFinder />
      </main>
    </div>
  );
}
