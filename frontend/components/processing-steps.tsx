"use client"

import type React from "react"

import { useState } from "react"
import { motion } from "framer-motion"
import { Badge } from "@/components/ui/badge"
import { Card } from "@/components/ui/card"

interface ProcessingStep {
  id: string
  action: string
  target: string
  details?: {
    text: string
    color: string
  }[]
  icon: React.ReactNode
}

interface ProcessingStepsProps {
  steps: ProcessingStep[]
}

export function ProcessingSteps({ steps }: ProcessingStepsProps) {
  const [hoveredStep, setHoveredStep] = useState<string | null>(null)

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
      },
    },
  }

  const item = {
    hidden: { opacity: 0, x: -20 },
    show: { opacity: 1, x: 0 },
  }

  return (
    <motion.div variants={container} initial="hidden" animate="show" className="space-y-4">
      {steps.map((step, index) => (
        <motion.div
          key={step.id}
          variants={item}
          onHoverStart={() => setHoveredStep(step.id)}
          onHoverEnd={() => setHoveredStep(null)}
          className="relative"
        >
          <Card
            className={`
            p-4 border-2 transition-all duration-300
            ${hoveredStep === step.id ? "border-primary shadow-lg" : "border-border"}
          `}
          >
            <div className="flex items-start gap-4">
              {/* Step Number */}
              <motion.div
                initial={false}
                animate={{
                  scale: hoveredStep === step.id ? 1.1 : 1,
                  backgroundColor: hoveredStep === step.id ? "var(--primary)" : "var(--muted)",
                }}
                className="flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium text-white"
              >
                {index + 1}
              </motion.div>

              <div className="flex-grow space-y-2">
                <div className="flex items-center gap-2">
                  {/* Action */}
                  <span className="font-semibold text-lg">{step.action}</span>

                  {/* Icon */}
                  <motion.div
                    animate={{
                      rotate: hoveredStep === step.id ? 360 : 0,
                    }}
                    transition={{ duration: 0.5 }}
                    className="text-primary"
                  >
                    {step.icon}
                  </motion.div>
                </div>

                {/* Target with special formatting */}
                <div className="font-mono text-sm bg-muted rounded-md p-2">{step.target}</div>

                {/* Optional Details */}
                {step.details && (
                  <motion.div
                    initial={false}
                    animate={{
                      height: hoveredStep === step.id ? "auto" : "2.5rem",
                      opacity: 1,
                    }}
                    className="flex flex-wrap gap-2 overflow-hidden"
                  >
                    {step.details.map((detail, i) => (
                      <Badge
                        key={i}
                        variant="outline"
                        className="transition-colors"
                        style={{
                          backgroundColor: `${detail.color}10`,
                          color: detail.color,
                          borderColor: `${detail.color}40`,
                        }}
                      >
                        {detail.text}
                      </Badge>
                    ))}
                  </motion.div>
                )}
              </div>
            </div>

            {/* Connector Line */}
            {index < steps.length - 1 && (
              <motion.div
                initial={false}
                animate={{
                  height: hoveredStep === step.id ? "2.5rem" : "2rem",
                  backgroundColor: hoveredStep === step.id ? "var(--primary)" : "var(--border)",
                }}
                className="absolute left-6 -bottom-4 w-0.5 -mb-2 z-0"
              />
            )}
          </Card>
        </motion.div>
      ))}
    </motion.div>
  )
}

