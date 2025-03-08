"use client"

import { useState } from "react"
import Link from "next/link"
import { Search, ChevronDown, ChevronRight, ExternalLink, Copy, Check, Play } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"

interface EndpointDocumentationProps {
  endpointData: any
  onReset: () => void
}

export function EndpointDocumentation({ endpointData, onReset }: EndpointDocumentationProps) {
  const [activeTab, setActiveTab] = useState("201")
  const [isTestingRequest, setIsTestingRequest] = useState(false)
  const [copied, setCopied] = useState(false)
  const [isEndpointExpanded, setIsEndpointExpanded] = useState(true)

  const handleTestRequest = async () => {
    setIsTestingRequest(true)
    // Simulate API request
    setTimeout(() => {
      setIsTestingRequest(false)
    }, 1500)
  }

  const handleCopyCode = () => {
    const code = `curl -X GET \\
  "https://api.example.com/${endpointData?.name || "search-apartments"}" \\
  --header "Content-Type: application/json"`

    navigator.clipboard.writeText(code)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="flex h-screen bg-background">
      {/* Left Sidebar */}
      <div className="w-72 border-r flex flex-col bg-slate-50">
        {/* Logo */}
        <Link href="#" onClick={onReset} className="block p-4 border-b">
          <div className="flex items-center gap-2">
            <div className="bg-primary rounded-md p-1.5 text-white font-bold">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M12 4L4 8L12 12L20 8L12 4Z" fill="currentColor" />
                <path d="M4 12L12 16L20 12" fill="currentColor" />
                <path d="M4 16L12 20L20 16" fill="currentColor" />
              </svg>
            </div>
            <span className="text-xl font-bold bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
              Apirator
            </span>
          </div>
        </Link>

        <div className="p-4 border-b">
          <div className="relative">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input placeholder="Search endpoints" className="pl-9 bg-white" />
          </div>
        </div>

        <ScrollArea className="flex-1">
          <div className="p-4 space-y-5">
            <div>
              <div className="text-sm font-medium text-muted-foreground mb-2 px-2">DOCUMENTATION</div>
              <div className="space-y-1">
                <Button variant="ghost" className="w-full justify-start font-normal text-sm">
                  <ChevronRight className="h-4 w-4 mr-2 text-muted-foreground" />
                  Getting Started
                </Button>

                <Button variant="ghost" className="w-full justify-start font-normal text-sm">
                  <ChevronRight className="h-4 w-4 mr-2 text-muted-foreground" />
                  Authentication
                </Button>
              </div>
            </div>

            <div>
              <div className="text-sm font-medium text-muted-foreground mb-2 px-2">ENDPOINTS</div>
              <div className="space-y-1">
                <Button
                  variant="ghost"
                  className="w-full justify-start font-normal text-sm bg-primary/10 text-primary"
                  onClick={(e) => {
                    e.stopPropagation()
                    setIsEndpointExpanded(!isEndpointExpanded)
                  }}
                >
                  <ChevronDown
                    className={`h-4 w-4 mr-2 text-primary transition-transform ${isEndpointExpanded ? "" : "transform -rotate-90"}`}
                  />
                  {endpointData?.name || "search-apartments"}
                </Button>
                {isEndpointExpanded && (
                  <div className="ml-6 space-y-1 border-l border-muted pl-2">
                    <Button variant="ghost" className="w-full justify-start text-sm font-normal h-8">
                      Parameters
                    </Button>
                    <Button variant="ghost" className="w-full justify-start text-sm font-normal h-8">
                      Response
                    </Button>
                    <Button variant="ghost" className="w-full justify-start text-sm font-normal h-8">
                      Examples
                    </Button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </ScrollArea>

        <div className="p-4 border-t">
          <Button variant="outline" className="w-full bg-white">
            <ExternalLink className="h-4 w-4 mr-2" />
            View in Scalar
          </Button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 min-w-0 flex">
        <div className="w-1/2 p-8 border-r overflow-auto">
          <div className="max-w-2xl">
            <div className="flex items-center gap-2 mb-2">
              <Badge className="uppercase">GET</Badge>
              <div className="text-sm text-muted-foreground font-mono">
                /api/{endpointData?.name || "search-apartments"}
              </div>
            </div>

            <h1 className="text-3xl font-bold mb-4">
              {endpointData?.name
                ?.split("-")
                .map((word: string) => word.charAt(0).toUpperCase() + word.slice(1))
                .join(" ") || "Search Apartments"}
            </h1>

            <p className="text-muted-foreground mb-8 text-lg">
              {endpointData?.prompt || "Search for apartments based on specified criteria"}
            </p>

            <div className="space-y-10">
              <div>
                <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                  Query Parameters
                  <Badge variant="outline" className="ml-2 font-normal">
                    {endpointData?.parameters?.filter((p: any) => p.required).length || 0} required
                  </Badge>
                </h2>
                <div className="space-y-4">
                  {endpointData?.parameters?.map((param: any) => (
                    <div key={param.id} className="border rounded-lg p-4 bg-white shadow-sm">
                      <div className="flex items-center gap-2 mb-2">
                        <span className="font-mono font-medium">{param.name}</span>
                        <Badge variant={param.required ? "default" : "outline"} className="ml-auto">
                          {param.required ? "Required" : "Optional"}
                        </Badge>
                        <Badge variant="secondary">{param.type}</Badge>
                      </div>
                      <p className="text-sm text-muted-foreground">{param.description}</p>
                      {param.possibleValues && (
                        <div className="mt-2 text-sm bg-slate-50 p-2 rounded-md">
                          <span className="font-medium">Possible values: </span>
                          {param.possibleValues}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <h2 className="text-xl font-semibold mb-4">Response</h2>
                <Tabs defaultValue="schema">
                  <TabsList className="mb-4">
                    <TabsTrigger value="schema">Schema</TabsTrigger>
                    <TabsTrigger value="example">Example</TabsTrigger>
                  </TabsList>

                  <TabsContent value="schema">
                    <div className="bg-white border rounded-lg p-4 shadow-sm">
                      <pre className="font-mono text-sm overflow-x-auto">
                        {JSON.stringify(endpointData?.responseSchema || {}, null, 2)}
                      </pre>
                    </div>
                  </TabsContent>

                  <TabsContent value="example">
                    <div className="bg-white border rounded-lg p-4 shadow-sm">
                      <pre className="font-mono text-sm overflow-x-auto">
                        {JSON.stringify(endpointData?.testResult || {}, null, 2)}
                      </pre>
                    </div>
                  </TabsContent>
                </Tabs>
              </div>
            </div>
          </div>
        </div>

        {/* Code Preview */}
        <div className="w-1/2 bg-zinc-900 text-white">
          <div className="p-8">
            <div className="bg-zinc-800 rounded-lg overflow-hidden border border-zinc-700 shadow-xl">
              <div className="p-4 border-b border-zinc-700 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Badge variant="secondary" className="uppercase bg-zinc-700 text-zinc-100">
                    GET
                  </Badge>
                  <span className="font-mono text-sm text-zinc-300">
                    /api/{endpointData?.name || "search-apartments"}
                  </span>
                </div>
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={handleCopyCode}
                        className="text-zinc-400 hover:text-zinc-100 hover:bg-zinc-700"
                      >
                        {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>{copied ? "Copied!" : "Copy code"}</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </div>

              <div className="p-6 font-mono text-sm bg-zinc-950 border-b border-zinc-800">
                <div className="space-y-1">
                  <div>
                    <span className="text-blue-400">curl</span> <span className="text-green-400">-X GET</span> \
                  </div>
                  <div className="pl-4 text-amber-300">
                    {`"https://api.example.com/${endpointData?.name || "search-apartments"}"`} \
                  </div>
                  <div className="pl-4">
                    <span className="text-green-400">--header</span>{" "}
                    <span className="text-amber-300">"Content-Type: application/json"</span>
                  </div>
                </div>
              </div>

              <div className="p-4 flex justify-end bg-zinc-800">
                <Button
                  onClick={handleTestRequest}
                  disabled={isTestingRequest}
                  className="bg-primary hover:bg-primary/90 flex items-center gap-2"
                >
                  {isTestingRequest ? (
                    <>
                      <div className="h-4 w-4 border-2 border-t-transparent border-white rounded-full animate-spin"></div>
                      Testing...
                    </>
                  ) : (
                    <>
                      <Play className="h-4 w-4" />
                      Test Request
                    </>
                  )}
                </Button>
              </div>
            </div>

            {/* Response Preview */}
            <div className="mt-6">
              <div className="flex items-center justify-between mb-3">
                <div className="text-sm text-zinc-400 font-medium">RESPONSE</div>
                <div className="flex gap-2">
                  <Badge
                    variant="outline"
                    className={`cursor-pointer ${activeTab === "201" ? "bg-green-500/20 text-green-400 border-green-500/50" : "text-zinc-400 border-zinc-700"}`}
                    onClick={() => setActiveTab("201")}
                  >
                    201
                  </Badge>
                  <Badge
                    variant="outline"
                    className={`cursor-pointer ${activeTab === "400" ? "bg-red-500/20 text-red-400 border-red-500/50" : "text-zinc-400 border-zinc-700"}`}
                    onClick={() => setActiveTab("400")}
                  >
                    400
                  </Badge>
                </div>
              </div>

              <div className="bg-zinc-800 rounded-lg border border-zinc-700 overflow-hidden shadow-xl">
                <div className="p-3 border-b border-zinc-700 bg-zinc-900 flex items-center">
                  <Badge
                    variant="outline"
                    className={
                      activeTab === "201"
                        ? "bg-green-500/20 text-green-400 border-green-500/50"
                        : "bg-red-500/20 text-red-400 border-red-500/50"
                    }
                  >
                    {activeTab === "201" ? "201 Created" : "400 Bad Request"}
                  </Badge>
                  <div className="ml-auto text-xs text-zinc-500">{activeTab === "201" ? "247ms" : "118ms"}</div>
                </div>

                <div className="bg-zinc-950 p-4 font-mono text-sm overflow-auto max-h-[400px]">
                  {activeTab === "201" ? (
                    <pre className="text-green-300">{JSON.stringify(endpointData?.testResult || {}, null, 2)}</pre>
                  ) : (
                    <pre className="text-red-300">
                      {JSON.stringify(
                        {
                          error: "Bad Request",
                          message: "Invalid parameters provided",
                          details: {
                            location: "Parameter is required",
                            minPrice: "Must be a positive integer",
                          },
                        },
                        null,
                        2,
                      )}
                    </pre>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

