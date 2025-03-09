"use client"

import { motion } from "framer-motion"
import { CheckCircle } from "lucide-react"
import { Button } from "@/components/ui/button"

interface CompletionProps {
  onReset: () => void
}

export default function Completion({ onReset }: CompletionProps) {
  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        delayChildren: 0.3,
      },
    },
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { type: "spring", stiffness: 300, damping: 24 },
    },
  }

  const iconVariants = {
    hidden: { scale: 0.8, opacity: 0 },
    visible: {
      scale: 1,
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 300,
        damping: 24,
        delay: 0.2,
      },
    },
  }

  return (
    <motion.div
      className="flex flex-col items-center justify-center h-full text-center py-10"
      initial="hidden"
      animate="visible"
      variants={containerVariants}
    >
      <motion.div variants={iconVariants} className="mb-6">
        <div className="rounded-full bg-green-100 p-3 inline-block">
          <CheckCircle className="w-16 h-16 text-green-600" />
        </div>
      </motion.div>

      <motion.h2 variants={itemVariants} className="text-2xl font-bold mb-2">
        Process Complete!
      </motion.h2>

      <motion.p variants={itemVariants} className="text-gray-500 mb-8 max-w-md">
        Thank you for completing all the steps. Your information has been successfully submitted and processed.
      </motion.p>

      <motion.div variants={itemVariants}>
        <Button onClick={onReset}>Start Over</Button>
      </motion.div>
    </motion.div>
  )
}

