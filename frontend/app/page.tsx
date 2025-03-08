"use client";

import { CreateApiForm } from "@/components/create-api-form";
import { EndpointCreationProcess } from "@/components/endpoint-creation-process";
import { EndpointDocumentation } from "@/components/endpoint-documentation";
import { useApiStore } from "@/lib/store";

export default function Home() {
  const {
    step,
    formData,
    endpointData,
    setStep,
    setFormData,
    setEndpointData,
    reset,
  } = useApiStore();

  const handleFormSubmit = async (url: string, prompt: string) => {
    setFormData({ url, prompt });

    try {
      const response = await fetch("/backend", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ url, prompt }),
      });

      if (!response.ok) {
        throw new Error("Failed to fetch stagehand steps");
      }

      const stagehandSteps = await response.json();
      // Store the stagehand steps in the form data
      setFormData({ url, prompt, stagehandSteps });
      setStep(2);
    } catch (error) {
      console.error("Error fetching stagehand steps:", error);
      // Handle error appropriately
    }
  };

  const handleBack = () => {
    setStep(step - 1);
  };

  const handleComplete = (data: any) => {
    setEndpointData(data);
    setStep(3);
  };

  return (
    <main className='min-h-screen bg-slate-50 py-8'>
      {step === 1 && (
        <div className='flex flex-col items-center justify-center p-4'>
          <CreateApiForm onSubmit={handleFormSubmit} />
        </div>
      )}

      {step === 2 && (
        <div className='p-4'>
          <EndpointCreationProcess
            url={formData.url}
            prompt={formData.prompt}
            stagehandSteps={formData.stagehandSteps}
            onComplete={handleComplete}
            onBack={handleBack}
          />
        </div>
      )}

      {step === 3 && (
        <EndpointDocumentation endpointData={endpointData} onReset={reset} />
      )}
    </main>
  );
}
