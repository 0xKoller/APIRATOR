import NetworkFinder from "@/components/network-finder"

export default function Home() {
  return (
    <main className="min-h-screen bg-gray-50 text-gray-800 p-4 md:p-8 overflow-hidden">
      <div className="max-w-6xl mx-auto">
        <NetworkFinder />
      </div>
    </main>
  )
}

