"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { ArrowRight } from "lucide-react"

interface CreateApiFormProps {
  onSubmit?: (url: string, prompt: string) => void
}

export function CreateApiForm({ onSubmit }: CreateApiFormProps) {
  const [url, setUrl] = useState("")
  const [prompt, setPrompt] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!url || !prompt) {
      setError("Please fill in both fields")
      return
    }

    // Basic validation to ensure there's at least a domain-like structure
    if (!url.includes(".")) {
      setError("Please enter a valid website address")
      return
    }

    if (onSubmit) {
      setLoading(true)
      // Normalize URL by adding https:// if not present
      const normalizedUrl = url.startsWith("http") ? url : `https://${url}`
      // Simulate a brief loading state for better UX
      setTimeout(() => {
        onSubmit(normalizedUrl, prompt)
        setLoading(false)
      }, 500)
    }
  }

  return (
    <div className="w-full max-w-md mx-auto">
      <div className="flex items-center justify-center mb-8">
        <div className="flex items-center gap-2">
          <div className="bg-primary rounded-md p-1.5 text-white font-bold">
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M12 4L4 8L12 12L20 8L12 4Z" fill="currentColor" />
              <path d="M4 12L12 16L20 12" fill="currentColor" />
              <path d="M4 16L12 20L20 16" fill="currentColor" />
            </svg>
          </div>
          <span className="text-2xl font-bold bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
            Apirator
          </span>
        </div>
      </div>

      <div className="text-center mb-8">
        <h1 className="text-2xl font-bold mb-2">Create API Endpoint</h1>
        <p className="text-muted-foreground">Turn any website into an API with just a few clicks</p>
      </div>

      <div className="bg-white rounded-xl border shadow-sm p-6">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="url" className="text-sm font-medium">
              Website URL
            </Label>
            <Input
              id="url"
              type="text"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              placeholder="e.g. zonaprop.com.ar"
              className="h-12 px-4 text-base bg-slate-50 focus:bg-white transition-colors"
              required
            />
            <p className="text-xs text-muted-foreground">
              Enter the website URL you want to create an API for (with or without https://)
            </p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="prompt" className="text-sm font-medium">
              What should this API do?
            </Label>
            <Input
              id="prompt"
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="e.g. busque deparamentos"
              className="h-12 px-4 text-base bg-slate-50 focus:bg-white transition-colors"
              required
            />
            <p className="text-xs text-muted-foreground">Describe what you want the API to do"</p>
          </div>

          <Button
            type="submit"
            disabled={loading}
            className="w-full h-12 text-base font-medium flex items-center justify-center gap-2"
          >
            {loading ? (
              <>
                <div className="h-4 w-4 border-2 border-t-transparent border-current rounded-full animate-spin"></div>
                Creating API...
              </>
            ) : (
              <>
                Create API
                <ArrowRight className="h-4 w-4 ml-1" />
              </>
            )}
          </Button>

          {error && <div className="p-3 bg-red-50 text-red-700 rounded-md text-sm">{error}</div>}
        </form>
      </div>

      <div className="mt-6 text-center text-sm text-muted-foreground">
        <p>Apirator helps you create API endpoints for any website without coding</p>
      </div>
    </div>
  )
}

