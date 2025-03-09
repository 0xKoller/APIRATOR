"use client"

import { motion } from "framer-motion"

export default function StepFour() {
  // Animation variants for staggered children
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.1,
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

  return (
    <motion.div className="space-y-6" initial="hidden" animate="visible" variants={containerVariants}>
      <motion.div variants={itemVariants}>
        <h2 className="text-2xl font-bold mb-6">Review Your Information</h2>
        <p className="text-gray-500 mb-6">Please review the information you've provided before submitting.</p>
      </motion.div>

      <motion.div variants={itemVariants} className="space-y-4">
        <div className="bg-gray-50 p-4 rounded-lg">
          <h3 className="font-medium text-gray-700 mb-2">Personal Details</h3>
          <div className="grid grid-cols-2 gap-2 text-sm">
            <div className="text-gray-500">Name:</div>
            <div>John Doe</div>
            <div className="text-gray-500">Email:</div>
            <div>john.doe@example.com</div>
          </div>
        </div>
      </motion.div>

      <motion.div variants={itemVariants} className="space-y-4">
        <div className="bg-gray-50 p-4 rounded-lg">
          <h3 className="font-medium text-gray-700 mb-2">Preferences</h3>
          <div className="grid grid-cols-2 gap-2 text-sm">
            <div className="text-gray-500">Theme:</div>
            <div>Light Mode</div>
            <div className="text-gray-500">Notifications:</div>
            <div>Email, Push</div>
          </div>
        </div>
      </motion.div>

      <motion.div variants={itemVariants} className="space-y-4">
        <div className="bg-gray-50 p-4 rounded-lg">
          <h3 className="font-medium text-gray-700 mb-2">Additional Information</h3>
          <div className="grid grid-cols-2 gap-2 text-sm">
            <div className="text-gray-500">Country:</div>
            <div>United States</div>
            <div className="text-gray-500">About:</div>
            <div className="line-clamp-3">
              I'm a software developer with 5 years of experience in web development. I enjoy building user-friendly
              interfaces and solving complex problems.
            </div>
          </div>
        </div>
      </motion.div>
    </motion.div>
  )
}

