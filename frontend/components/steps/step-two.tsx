"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Checkbox } from "@/components/ui/checkbox"

export default function StepTwo() {
  const [theme, setTheme] = useState("light")
  const [notifications, setNotifications] = useState<string[]>([])

  const handleNotificationChange = (value: string) => {
    setNotifications((prev) => (prev.includes(value) ? prev.filter((item) => item !== value) : [...prev, value]))
  }

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
        <h2 className="text-2xl font-bold mb-6">Preferences</h2>
        <p className="text-gray-500 mb-6">Customize your experience by setting your preferences.</p>
      </motion.div>

      <motion.div className="space-y-4" variants={itemVariants}>
        <div className="space-y-2">
          <Label>Theme Preference</Label>
          <RadioGroup value={theme} onValueChange={setTheme} className="flex flex-col space-y-2">
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="light" id="light" />
              <Label htmlFor="light" className="cursor-pointer">
                Light Mode
              </Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="dark" id="dark" />
              <Label htmlFor="dark" className="cursor-pointer">
                Dark Mode
              </Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="system" id="system" />
              <Label htmlFor="system" className="cursor-pointer">
                System Default
              </Label>
            </div>
          </RadioGroup>
        </div>
      </motion.div>

      <motion.div className="space-y-2" variants={itemVariants}>
        <Label>Notification Preferences</Label>
        <div className="space-y-2">
          <div className="flex items-center space-x-2">
            <Checkbox
              id="email-notifications"
              checked={notifications.includes("email")}
              onCheckedChange={() => handleNotificationChange("email")}
            />
            <Label htmlFor="email-notifications" className="cursor-pointer">
              Email Notifications
            </Label>
          </div>
          <div className="flex items-center space-x-2">
            <Checkbox
              id="push-notifications"
              checked={notifications.includes("push")}
              onCheckedChange={() => handleNotificationChange("push")}
            />
            <Label htmlFor="push-notifications" className="cursor-pointer">
              Push Notifications
            </Label>
          </div>
          <div className="flex items-center space-x-2">
            <Checkbox
              id="sms-notifications"
              checked={notifications.includes("sms")}
              onCheckedChange={() => handleNotificationChange("sms")}
            />
            <Label htmlFor="sms-notifications" className="cursor-pointer">
              SMS Notifications
            </Label>
          </div>
        </div>
      </motion.div>
    </motion.div>
  )
}

