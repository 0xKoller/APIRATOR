"use client"

import { motion } from "framer-motion"
import { Activity, MessageSquare, Share2, ThumbsUp, Calendar, Users } from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

interface RecentActivitiesProps {
  targetPerson: {
    name: string
    company: string
    avatar: string
  }
  contacts: Array<{
    id: number
    name: string
    avatar: string
    recentActivity: string
  }>
}

// Activity types with icons
const activityTypes = [
  { type: "message", icon: MessageSquare, color: "text-indigo-500" },
  { type: "share", icon: Share2, color: "text-sky-500" },
  { type: "like", icon: ThumbsUp, color: "text-blue-500" },
  { type: "event", icon: Calendar, color: "text-green-500" },
  { type: "connection", icon: Users, color: "text-amber-500" },
]

// Generate mock activities
const generateActivities = (
  targetPerson: RecentActivitiesProps["targetPerson"],
  contacts: RecentActivitiesProps["contacts"],
) => {
  const activities = []

  // Current date for relative time
  const now = new Date()

  // Generate activities for each contact
  for (let i = 0; i < 15; i++) {
    const contact = contacts[Math.floor(Math.random() * contacts.length)]
    const activityType = activityTypes[Math.floor(Math.random() * activityTypes.length)]
    const daysAgo = Math.floor(Math.random() * 14)
    const hoursAgo = Math.floor(Math.random() * 24)
    const minutesAgo = Math.floor(Math.random() * 60)

    const date = new Date(now)
    date.setDate(date.getDate() - daysAgo)
    date.setHours(date.getHours() - hoursAgo)
    date.setMinutes(date.getMinutes() - minutesAgo)

    let description = ""

    switch (activityType.type) {
      case "message":
        description = `sent a message to ${targetPerson.name}`
        break
      case "share":
        description = `shared ${Math.random() > 0.5 ? "an article" : "a post"} with ${targetPerson.name}`
        break
      case "like":
        description = `liked ${targetPerson.name}'s post about ${Math.random() > 0.5 ? "industry trends" : "professional development"}`
        break
      case "event":
        description = `attended the same ${Math.random() > 0.5 ? "webinar" : "conference"} as ${targetPerson.name}`
        break
      case "connection":
        description = `connected with a mutual contact of ${targetPerson.name}`
        break
    }

    activities.push({
      id: i,
      contact,
      type: activityType,
      description,
      date,
    })
  }

  // Sort by date (most recent first)
  return activities.sort((a, b) => b.date.getTime() - a.date.getTime())
}

export default function RecentActivities({ targetPerson, contacts }: RecentActivitiesProps) {
  const activities = generateActivities(targetPerson, contacts)

  // Format relative time
  const formatRelativeTime = (date: Date) => {
    const now = new Date()
    const diffMs = now.getTime() - date.getTime()
    const diffSecs = Math.floor(diffMs / 1000)
    const diffMins = Math.floor(diffSecs / 60)
    const diffHours = Math.floor(diffMins / 60)
    const diffDays = Math.floor(diffHours / 24)

    if (diffDays > 0) {
      return `${diffDays}d ago`
    } else if (diffHours > 0) {
      return `${diffHours}h ago`
    } else if (diffMins > 0) {
      return `${diffMins}m ago`
    } else {
      return "Just now"
    }
  }

  return (
    <div className="space-y-4 max-h-[600px] overflow-y-auto">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-medium text-gray-900 flex items-center">
          <Activity className="w-5 h-5 mr-2 text-sky-500" />
          Recent Network Activity
        </h3>
        <div className="text-xs text-gray-500">Showing activity with {targetPerson.name}</div>
      </div>

      <div className="space-y-4">
        {activities.map((activity, i) => (
          <motion.div
            key={activity.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: i * 0.05 }}
            className="flex gap-3 p-3 border border-gray-200 rounded-lg bg-gray-50"
          >
            <div className="flex-shrink-0">
              <Avatar className="h-10 w-10 border border-gray-200">
                <AvatarImage src={activity.contact.avatar} alt={activity.contact.name} />
                <AvatarFallback className="bg-gray-100">{activity.contact.name.charAt(0)}</AvatarFallback>
              </Avatar>
            </div>

            <div className="flex-1 min-w-0">
              <div className="flex items-start justify-between">
                <div>
                  <span className="font-medium text-gray-900">{activity.contact.name}</span>
                  <span className="text-gray-700"> {activity.description}</span>
                </div>
                <div className="text-xs text-gray-500 whitespace-nowrap ml-2">{formatRelativeTime(activity.date)}</div>
              </div>

              <div className="mt-1 flex items-center">
                <activity.type.icon className={`h-3.5 w-3.5 mr-1.5 ${activity.type.color}`} />
                <span className="text-xs text-gray-600">
                  {activity.type.type === "message"
                    ? "Direct message"
                    : activity.type.type === "share"
                      ? "Content sharing"
                      : activity.type.type === "like"
                        ? "Engagement"
                        : activity.type.type === "event"
                          ? "Event participation"
                          : "Network growth"}
                </span>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  )
}

