"use client"

import { useState } from "react"
import { CreateApiForm } from "@/components/create-api-form"
import { EndpointCreationProcess } from "@/components/endpoint-creation-process"

export default function CreateEndpointPage() {
  const [step, setStep] = useState(1)
  const [formData, setFormData] = useState({
    url: "",
    prompt: "",
  })
  const [endpointData, setEndpointData] = useState<any>(null)

  const handleFormSubmit = (url: string, prompt: string) => {
    setFormData({ url, prompt })
    setStep(2)
  }

  const handleProcessComplete = (data: any) => {
    setEndpointData(data)
    setStep(3)
  }

  const handleBack = () => {
    setStep(step - 1)
  }

  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-4 bg-white">
      <div className="w-full max-w-4xl">
        <h1 className="text-2xl font-bold mb-6 text-center">API Endpoint Creator</h1>

        {step === 1 && <CreateApiForm onSubmit={handleFormSubmit} />}

        {step === 2 && (
          <EndpointCreationProcess
            url={formData.url}
            prompt={formData.prompt}
            onComplete={handleProcessComplete}
            onBack={() => setStep(1)}
          />
        )}

        {step === 3 && (
          <div className="text-center p-8">
            <h2 className="text-xl font-bold mb-4">Endpoint Created Successfully!</h2>
            <p className="mb-4">
              Your endpoint <code>{endpointData?.name}</code> is now ready to use.
            </p>
            <button onClick={() => setStep(1)} className="px-4 py-2 bg-primary text-white rounded-md">
              Create Another Endpoint
            </button>
          </div>
        )}
      </div>
    </main>
  )
}

