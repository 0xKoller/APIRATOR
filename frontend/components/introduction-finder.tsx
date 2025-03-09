"use client"

import type React from "react"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Search, Users, ArrowRight, Info } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"

// Custom yellow color for important elements
const accentColor = "#FFC107"

// Mock data for contacts
const mockContacts = [
  {
    id: 1,
    name: "Alex Johnson",
    avatar: "/placeholder.svg?height=40&width=40",
    role: "Product Manager at TechCorp",
    interactionCount: 27,
    lastInteraction: "2 days ago",
    connectionStrength: 92,
    reason:
      "Alex has exchanged 27 emails with Sam in the last month and they've attended 3 meetings together. They also share 5 mutual connections.",
  },
  {
    id: 2,
    name: "Jamie Smith",
    avatar: "/placeholder.svg?height=40&width=40",
    role: "Engineering Lead at InnovateCo",
    interactionCount: 18,
    lastInteraction: "1 week ago",
    connectionStrength: 78,
    reason:
      "Jamie and Sam worked on a project together last year and have maintained regular contact. They've exchanged 18 messages and are both members of the same industry group.",
  },
  {
    id: 3,
    name: "Taylor Wilson",
    avatar: "/placeholder.svg?height=40&width=40",
    role: "VP of Marketing at GrowthInc",
    interactionCount: 12,
    lastInteraction: "3 weeks ago",
    connectionStrength: 65,
    reason:
      "Taylor and Sam have been connected for over 2 years. They've met at 3 industry conferences and have 7 mutual connections in common.",
  },
  {
    id: 4,
    name: "Morgan Lee",
    avatar: "/placeholder.svg?height=40&width=40",
    role: "CTO at StartupXYZ",
    interactionCount: 8,
    lastInteraction: "1 month ago",
    connectionStrength: 45,
    reason:
      "Morgan and Sam are both members of the same professional organization and have exchanged messages occasionally over the past year.",
  },
]

type Step = "input" | "searching" | "results"

export default function IntroductionFinder() {
  const [step, setStep] = useState<Step>("input")
  const [url, setUrl] = useState("")
  const [targetPerson, setTargetPerson] = useState({
    name: "",
    company: "",
    avatar: "",
  })
  const [results, setResults] = useState<typeof mockContacts>([])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!url) return

    // Move to searching step
    setStep("searching")

    // Simulate API call
    setTimeout(() => {
      // Extract name from URL for demo purposes
      const urlParts = url.split("/")
      const name = urlParts[urlParts.length - 1] || "Sam Taylor"
      setTargetPerson({
        name: name.includes("linkedin.com") ? "Sam Taylor" : name,
        company: "Acme Corporation",
        avatar: "/placeholder.svg?height=60&width=60",
      })

      // Simulate search completion after 3 seconds
      setTimeout(() => {
        setResults(mockContacts)
        setStep("results")
      }, 3000)
    }, 1000)
  }

  const resetSearch = () => {
    setStep("input")
    setUrl("")
    setResults([])
  }

  return (
    <div className="space-y-6">
      <AnimatePresence mode="wait">
        {step === "input" && (
          <motion.div
            key="input"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.3 }}
            className="bg-white p-6 rounded-lg"
          >
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <h2 className="text-xl font-semibold flex items-center">
                  <Search className="mr-2 h-5 w-5" />
                  Who do you want to meet?
                </h2>
                <p className="text-gray-500 text-sm">
                  Enter the LinkedIn profile URL of the person you want to connect with.
                </p>
              </div>

              <div className="flex gap-2">
                <Input
                  value={url}
                  onChange={(e) => setUrl(e.target.value)}
                  placeholder="https://linkedin.com/in/sam-taylor"
                  className="flex-1"
                />
                <Button
                  type="submit"
                  disabled={!url}
                  style={{ backgroundColor: accentColor, borderColor: accentColor }}
                  className="text-black hover:bg-amber-400 hover:text-black"
                >
                  Find
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </div>
            </form>
          </motion.div>
        )}

        {step === "searching" && (
          <motion.div
            key="searching"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.3 }}
            className="bg-white p-6 rounded-lg"
          >
            <div className="space-y-6">
              <div className="space-y-2">
                <h2 className="text-xl font-semibold text-center">Analyzing your network</h2>
                <p className="text-gray-500 text-sm text-center">Finding the best people to introduce you</p>
              </div>

              <div className="flex items-center justify-center py-12">
                <motion.div
                  animate={{
                    scale: [1, 1.05, 1],
                  }}
                  transition={{
                    duration: 2,
                    repeat: Number.POSITIVE_INFINITY,
                    ease: "easeInOut",
                  }}
                  className="relative"
                >
                  {targetPerson.name ? (
                    <Avatar className="h-24 w-24">
                      <AvatarImage src={targetPerson.avatar} alt={targetPerson.name} />
                      <AvatarFallback>{targetPerson.name.charAt(0)}</AvatarFallback>
                    </Avatar>
                  ) : (
                    <div className="h-24 w-24 rounded-full bg-gray-200 flex items-center justify-center">
                      <Users className="h-12 w-12 text-gray-400" />
                    </div>
                  )}

                  <motion.div
                    className="absolute -inset-3 rounded-full border-2 border-gray-300"
                    animate={{
                      scale: [1, 1.1, 1],
                      opacity: [0.7, 0.2, 0.7],
                    }}
                    transition={{
                      duration: 2,
                      repeat: Number.POSITIVE_INFINITY,
                      ease: "easeInOut",
                    }}
                  />

                  <motion.div
                    className="absolute -inset-6 rounded-full border-2 border-gray-200"
                    animate={{
                      scale: [1, 1.15, 1],
                      opacity: [0.5, 0.1, 0.5],
                    }}
                    transition={{
                      duration: 2.5,
                      repeat: Number.POSITIVE_INFINITY,
                      ease: "easeInOut",
                      delay: 0.2,
                    }}
                  />
                </motion.div>
              </div>
            </div>
          </motion.div>
        )}

        {step === "results" && (
          <motion.div
            key="results"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.3 }}
            className="bg-white p-6 rounded-lg"
          >
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <h2 className="text-xl font-semibold">Best contacts for introduction</h2>
                  <p className="text-gray-500 text-sm">
                    These people in your network have the strongest connections to {targetPerson.name}.
                  </p>
                </div>
                <Button variant="outline" size="sm" onClick={resetSearch}>
                  New Search
                </Button>
              </div>

              <div className="space-y-4">
                {results.slice(0, 3).map((contact, index) => (
                  <motion.div
                    key={contact.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.4, delay: index * 0.15 }}
                  >
                    <ContactCard contact={contact} rank={index + 1} isTop={index === 0} />
                  </motion.div>
                ))}

                {results.length > 3 && (
                  <div className="pt-2 border-t">
                    <h3 className="text-sm font-medium text-gray-500 mb-3">Other potential contacts</h3>
                    {results.slice(3).map((contact, index) => (
                      <motion.div
                        key={contact.id}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.3, delay: 0.5 + index * 0.1 }}
                      >
                        <ContactCard contact={contact} rank={index + 4} isTop={false} compact />
                      </motion.div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

interface ContactCardProps {
  contact: (typeof mockContacts)[0]
  rank: number
  isTop: boolean
  compact?: boolean
}

function ContactCard({ contact, rank, isTop, compact = false }: ContactCardProps) {
  return (
    <TooltipProvider>
      <div
        className={`
        flex items-center gap-4 p-4 border rounded-lg transition-colors
        ${isTop ? "bg-amber-50 border-amber-200" : "hover:bg-gray-50"}
        ${compact ? "py-3" : ""}
      `}
      >
        <div className="flex-shrink-0 w-8 text-center">
          <span className={`text-lg font-bold ${isTop ? "text-amber-500" : "text-gray-400"}`}>#{rank}</span>
        </div>

        <Avatar className={compact ? "h-8 w-8" : "h-10 w-10"}>
          <AvatarImage src={contact.avatar} alt={contact.name} />
          <AvatarFallback>{contact.name.charAt(0)}</AvatarFallback>
        </Avatar>

        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <h3 className={`font-medium truncate ${compact ? "text-sm" : ""}`}>{contact.name}</h3>

            <Tooltip>
              <TooltipTrigger asChild>
                <div
                  className={`
                  ml-auto px-2 py-0.5 rounded-full text-xs font-medium cursor-pointer
                  ${isTop ? "bg-amber-100 text-amber-800" : "bg-gray-100 text-gray-700"}
                `}
                >
                  {contact.connectionStrength}% match
                </div>
              </TooltipTrigger>
              <TooltipContent className="max-w-xs">
                <p>{contact.reason}</p>
              </TooltipContent>
            </Tooltip>
          </div>

          {!compact && (
            <>
              <p className="text-sm text-gray-500 truncate">{contact.role}</p>
              <div className="flex items-center gap-4 mt-1">
                <Tooltip>
                  <TooltipTrigger asChild>
                    <span className="text-xs text-gray-500 flex items-center cursor-pointer">
                      {contact.interactionCount} interactions
                      <Info className="h-3 w-3 ml-1 text-gray-400" />
                    </span>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Based on emails, meetings, and shared activities</p>
                  </TooltipContent>
                </Tooltip>
                <span className="text-xs text-gray-500">Last: {contact.lastInteraction}</span>
              </div>
            </>
          )}
        </div>

        {!compact && (
          <Button
            size="sm"
            className={`flex-shrink-0 ${isTop ? "text-black hover:bg-amber-400 hover:text-black" : ""}`}
            style={{ backgroundColor: isTop ? accentColor : undefined, borderColor: isTop ? accentColor : undefined }}
          >
            Ask for intro
          </Button>
        )}
      </div>
    </TooltipProvider>
  )
}

