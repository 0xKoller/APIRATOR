import type React from "react"
import { Card } from "@/components/ui/card"
import { ArrowRight } from "lucide-react"

interface ProcessingStep {
  id: string
  action: string
  target: string
  description: string
  icon: React.ReactNode
  parameters?: {
    name: string
    description: string
  }[]
}

interface ProcessingStepsStaticProps {
  steps: ProcessingStep[]
  websiteUrl: string
}

export function ProcessingStepsStatic({ steps, websiteUrl }: ProcessingStepsStaticProps) {
  return (
    <div className="space-y-4">
      {steps.map((step, index) => (
        <Card key={step.id} className="border p-4">
          <div className="flex items-start gap-3">
            {/* Step Number */}
            <div className="flex-shrink-0 w-8 h-8 rounded-full bg-muted flex items-center justify-center text-sm font-medium">
              {index + 1}
            </div>

            <div className="flex-grow space-y-2">
              <div className="flex items-center gap-2">
                {/* Icon */}
                <div className="text-primary">{step.icon}</div>

                {/* Action */}
                <span className="font-semibold text-lg">{step.action}</span>
              </div>

              {/* Target with special formatting */}
              <div className="font-mono text-sm bg-muted rounded-md p-2">
                {step.target.includes(websiteUrl) ? step.target : step.target.replace("[website]", websiteUrl)}
              </div>

              {/* Description */}
              <p className="text-sm text-muted-foreground">{step.description}</p>

              {/* Optional Parameters */}
              {step.parameters && step.parameters.length > 0 && (
                <div className="mt-2 space-y-2">
                  <div className="text-sm font-medium">Parameters:</div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                    {step.parameters.map((param, i) => (
                      <div key={i} className="flex flex-col bg-slate-50 p-2 rounded-md border">
                        <span className="font-mono text-xs">{param.name}</span>
                        <span className="text-xs text-muted-foreground">{param.description}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Connector Line */}
          {index < steps.length - 1 && (
            <div className="flex justify-center mt-2">
              <ArrowRight className="h-4 w-4 text-muted-foreground" />
            </div>
          )}
        </Card>
      ))}
    </div>
  )
}

