"use client"

import { motion } from "framer-motion"

interface ConnectionStrengthChartProps {
  strength: number
}

export default function ConnectionStrengthChart({ strength }: ConnectionStrengthChartProps) {
  // Calculate segments for the chart
  const segments = [
    { name: "Communication", value: Math.min(100, strength + Math.random() * 10 - 5) },
    { name: "Engagement", value: Math.min(100, strength + Math.random() * 15 - 7.5) },
    { name: "Recency", value: Math.min(100, strength + Math.random() * 20 - 10) },
    { name: "Mutual", value: Math.min(100, strength + Math.random() * 12 - 6) },
  ]

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <div className="text-2xl font-bold text-gray-900">{strength}%</div>
        <div className="text-xs text-gray-500">Overall strength</div>
      </div>

      <div className="h-3 w-full bg-gray-100 rounded-full overflow-hidden">
        <motion.div
          className="h-full bg-indigo-500"
          initial={{ width: 0 }}
          animate={{ width: `${strength}%` }}
          transition={{ duration: 1, delay: 0.2 }}
        />
      </div>

      <div className="space-y-2 pt-2">
        {segments.map((segment, i) => (
          <div key={segment.name} className="space-y-1">
            <div className="flex justify-between text-xs">
              <span className="text-gray-600">{segment.name}</span>
              <span className="text-gray-800">{Math.round(segment.value)}%</span>
            </div>
            <div className="h-1.5 w-full bg-gray-100 rounded-full overflow-hidden">
              <motion.div
                className="h-full bg-indigo-500"
                initial={{ width: 0 }}
                animate={{ width: `${segment.value}%` }}
                transition={{ duration: 0.8, delay: 0.3 + i * 0.1 }}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

