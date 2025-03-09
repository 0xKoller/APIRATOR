"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { ChevronLeft, ChevronRight, Check } from "lucide-react"
import { Button } from "@/components/ui/button"
import StepOne from "@/components/steps/step-one"
import StepTwo from "@/components/steps/step-two"
import StepThree from "@/components/steps/step-three"
import StepFour from "@/components/steps/step-four"
import Completion from "@/components/steps/completion"

const steps = [
  { id: 1, title: "Personal Details" },
  { id: 2, title: "Preferences" },
  { id: 3, title: "Additional Info" },
  { id: 4, title: "Review" },
]

export default function MultiStepProcess() {
  const [currentStep, setCurrentStep] = useState(1)
  const [direction, setDirection] = useState(0)
  const [isComplete, setIsComplete] = useState(false)

  const goToNextStep = () => {
    if (currentStep < steps.length) {
      setDirection(1)
      setCurrentStep((prev) => prev + 1)
    } else {
      setIsComplete(true)
    }
  }

  const goToPreviousStep = () => {
    if (currentStep > 1) {
      setDirection(-1)
      setCurrentStep((prev) => prev - 1)
    }
  }

  const goToStep = (step: number) => {
    if (step !== currentStep) {
      setDirection(step > currentStep ? 1 : -1)
      setCurrentStep(step)
    }
  }

  const resetProcess = () => {
    setDirection(-1)
    setIsComplete(false)
    setCurrentStep(1)
  }

  // Variants for page transitions
  const pageVariants = {
    initial: (direction: number) => ({
      x: direction > 0 ? "100%" : direction < 0 ? "-100%" : 0,
      opacity: 0,
    }),
    animate: {
      x: 0,
      opacity: 1,
      transition: {
        x: { type: "spring", stiffness: 300, damping: 30 },
        opacity: { duration: 0.2 },
      },
    },
    exit: (direction: number) => ({
      x: direction < 0 ? "100%" : direction > 0 ? "-100%" : 0,
      opacity: 0,
      transition: {
        x: { type: "spring", stiffness: 300, damping: 30 },
        opacity: { duration: 0.2 },
      },
    }),
  }

  return (
    <div className="bg-white rounded-xl shadow-lg overflow-hidden">
      {/* Progress Bar */}
      <div className="p-6 pb-0">
        {!isComplete && (
          <div className="flex items-center justify-between mb-2">
            {steps.map((step) => (
              <button
                key={step.id}
                onClick={() => goToStep(step.id)}
                className="flex flex-col items-center relative group"
                disabled={step.id > currentStep}
              >
                <div className="flex items-center justify-center">
                  <div
                    className={`
                      w-10 h-10 rounded-full flex items-center justify-center z-10
                      transition-colors duration-300
                      ${
                        step.id < currentStep
                          ? "bg-blue-600 text-white"
                          : step.id === currentStep
                            ? "bg-blue-600 text-white"
                            : "bg-gray-200 text-gray-500"
                      }
                      ${step.id <= currentStep ? "cursor-pointer" : "cursor-not-allowed"}
                    `}
                  >
                    {step.id < currentStep ? <Check className="w-5 h-5" /> : <span>{step.id}</span>}
                  </div>
                </div>
                <div
                  className={`
                    mt-2 text-sm font-medium transition-colors duration-300
                    ${step.id <= currentStep ? "text-blue-600" : "text-gray-500"}
                  `}
                >
                  {step.title}
                </div>
                {step.id < steps.length && (
                  <div
                    className={`
                      absolute top-5 left-10 w-full h-0.5 transition-colors duration-300
                      ${step.id < currentStep ? "bg-blue-600" : "bg-gray-200"}
                    `}
                  />
                )}
              </button>
            ))}
          </div>
        )}

        {/* Progress Indicator */}
        {!isComplete && (
          <div className="w-full bg-gray-200 h-1 rounded-full overflow-hidden mt-4">
            <motion.div
              className="h-full bg-blue-600"
              initial={{ width: `${((currentStep - 1) / steps.length) * 100}%` }}
              animate={{ width: `${(currentStep / steps.length) * 100}%` }}
              transition={{ duration: 0.3, ease: "easeInOut" }}
            />
          </div>
        )}
      </div>

      {/* Step Content */}
      <div className="relative overflow-hidden p-6">
        <AnimatePresence initial={false} custom={direction} mode="wait">
          {isComplete ? (
            <motion.div
              key="completion"
              custom={direction}
              variants={pageVariants}
              initial="initial"
              animate="animate"
              exit="exit"
              className="min-h-[400px] flex flex-col"
            >
              <Completion onReset={resetProcess} />
            </motion.div>
          ) : (
            <motion.div
              key={currentStep}
              custom={direction}
              variants={pageVariants}
              initial="initial"
              animate="animate"
              exit="exit"
              className="min-h-[400px] flex flex-col"
            >
              {currentStep === 1 && <StepOne />}
              {currentStep === 2 && <StepTwo />}
              {currentStep === 3 && <StepThree />}
              {currentStep === 4 && <StepFour />}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Navigation Buttons */}
        {!isComplete && (
          <div className="flex justify-between mt-8 pt-4 border-t">
            <Button
              variant="outline"
              onClick={goToPreviousStep}
              disabled={currentStep === 1}
              className={`${currentStep === 1 ? "invisible" : "visible"}`}
            >
              <ChevronLeft className="w-4 h-4 mr-2" />
              Back
            </Button>
            <Button onClick={goToNextStep}>
              {currentStep === steps.length ? "Complete" : "Continue"}
              {currentStep !== steps.length && <ChevronRight className="w-4 h-4 ml-2" />}
            </Button>
          </div>
        )}
      </div>
    </div>
  )
}

