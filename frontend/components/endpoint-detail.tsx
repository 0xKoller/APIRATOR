"use client"

import { useState } from "react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Copy, Check, Code, FileJson } from "lucide-react"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"

interface EndpointDetailProps {
  endpoint: {
    name: string
    method: "GET" | "POST" | "PUT" | "DELETE" | "PATCH"
    path: string
    description: string
    requestBody?: {
      type: string
      properties: {
        name: string
        type: string
        required?: boolean
        description?: string
        format?: string
        minLength?: number
      }[]
    }
    responses: {
      status: number
      description: string
      content?: any
    }[]
  }
}

const methodColors = {
  GET: "bg-blue-500",
  POST: "bg-green-500",
  PUT: "bg-yellow-500",
  DELETE: "bg-red-500",
  PATCH: "bg-purple-500",
}

export function EndpointDetail({ endpoint }: EndpointDetailProps) {
  const [copied, setCopied] = useState(false)

  const handleCopyCode = (code: string) => {
    navigator.clipboard.writeText(code)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const requestExample = endpoint.requestBody
    ? {
        ...Object.fromEntries(
          endpoint.requestBody.properties.map((prop) => [prop.name, prop.type === "string" ? "example_value" : 0]),
        ),
      }
    : null

  const responseExample = endpoint.responses.find((r) => r.status === 201)?.content || {
    id: "123",
    ...requestExample,
    created_at: "2024-03-08T18:09:08Z",
  }

  return (
    <div className="space-y-6">
      {/* Header Section */}
      <div className="space-y-2">
        <div className="flex items-center gap-2">
          <Badge className={`${methodColors[endpoint.method]} text-white font-mono text-xs px-2 py-0.5`}>
            {endpoint.method}
          </Badge>
          <code className="text-sm text-muted-foreground font-mono">{endpoint.path}</code>
        </div>
        <h1 className="text-2xl font-bold">{endpoint.name}</h1>
        <p className="text-muted-foreground">{endpoint.description}</p>
      </div>

      {/* Request/Response Tabs */}
      <Tabs defaultValue="request" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="request" className="flex items-center gap-2">
            <Code className="h-4 w-4" />
            Request
          </TabsTrigger>
          <TabsTrigger value="response" className="flex items-center gap-2">
            <FileJson className="h-4 w-4" />
            Response
          </TabsTrigger>
        </TabsList>

        {/* Request Content */}
        <TabsContent value="request">
          <Card>
            <CardHeader>
              <CardTitle>Request Body</CardTitle>
              <CardDescription>Content Type: {endpoint.requestBody?.type || "application/json"}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Required Fields */}
              <div className="space-y-4">
                {endpoint.requestBody?.properties.map((prop) => (
                  <div key={prop.name} className="border rounded-lg p-4 bg-slate-50">
                    <div className="flex items-center gap-2 mb-1">
                      <code className="text-sm font-semibold font-mono">{prop.name}</code>
                      {prop.required && (
                        <Badge variant="destructive" className="text-[10px]">
                          Required
                        </Badge>
                      )}
                      <Badge variant="secondary" className="font-mono text-[10px]">
                        {prop.type}
                      </Badge>
                    </div>
                    {prop.description && <p className="text-sm text-muted-foreground mt-1">{prop.description}</p>}
                    {(prop.minLength || prop.format) && (
                      <div className="text-xs text-muted-foreground mt-2 space-y-1">
                        {prop.minLength && <p>Minimum length: {prop.minLength}</p>}
                        {prop.format && <p>Format: {prop.format}</p>}
                      </div>
                    )}
                  </div>
                ))}
              </div>

              {/* Example Request */}
              {requestExample && (
                <div className="relative">
                  <div className="absolute right-3 top-3">
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleCopyCode(JSON.stringify(requestExample, null, 2))}
                            className="h-8 w-8 p-0"
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
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-sm">Example Request</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <ScrollArea className="h-[200px] w-full rounded-md border bg-slate-50 p-4">
                        <pre className="font-mono text-sm">{JSON.stringify(requestExample, null, 2)}</pre>
                      </ScrollArea>
                    </CardContent>
                  </Card>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Response Content */}
        <TabsContent value="response">
          <Card>
            <CardHeader>
              <CardTitle>Response</CardTitle>
              <CardDescription>Possible response status codes and their meanings</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Status Codes */}
              <div className="space-y-4">
                {endpoint.responses.map((response) => (
                  <div key={response.status} className="border rounded-lg p-4 bg-slate-50">
                    <div className="flex items-center gap-2 mb-1">
                      <Badge variant={response.status < 300 ? "default" : "destructive"} className="font-mono">
                        {response.status}
                      </Badge>
                      <span className="text-sm font-medium">{response.description}</span>
                    </div>
                  </div>
                ))}
              </div>

              {/* Example Response */}
              <div className="relative">
                <div className="absolute right-3 top-3">
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleCopyCode(JSON.stringify(responseExample, null, 2))}
                          className="h-8 w-8 p-0"
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
                <Card>
                  <CardHeader>
                    <CardTitle className="text-sm">Example Response</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ScrollArea className="h-[200px] w-full rounded-md border bg-slate-50 p-4">
                      <pre className="font-mono text-sm">{JSON.stringify(responseExample, null, 2)}</pre>
                    </ScrollArea>
                  </CardContent>
                </Card>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}

