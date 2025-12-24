"use client"

import { motion } from "motion/react"
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  ResponsiveContainer,
  Cell,
  PieChart,
  Pie,
  LineChart,
  Line,
  AreaChart,
  Area,
} from "recharts"
import type { BaseSlideProps, ChartSlideData } from "../../model/types"

export function ChartSlide({ data, isActive, theme = "dark" }: BaseSlideProps<ChartSlideData>) {
  const { title, subtitle, chartType, data: chartData } = data
  const isDark = theme === "dark"

  const tickColor = isDark ? "rgba(255,255,255,0.5)" : "rgba(0,0,0,0.5)"
  const axisColor = isDark ? "rgba(255,255,255,0.1)" : "rgba(0,0,0,0.1)"

  const renderChart = () => {
    switch (chartType) {
      case "bar":
        return (
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={chartData} margin={{ top: 20, right: 20, bottom: 20, left: 20 }}>
              <XAxis
                dataKey="name"
                tick={{ fill: tickColor, fontSize: 12 }}
                axisLine={{ stroke: axisColor }}
                tickLine={false}
              />
              <YAxis
                tick={{ fill: tickColor, fontSize: 12 }}
                axisLine={{ stroke: axisColor }}
                tickLine={false}
              />
              <Bar
                dataKey="value"
                radius={[4, 4, 0, 0]}
                animationDuration={1500}
                animationEasing="ease-out"
              >
                {chartData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color ?? "#3b82f6"} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        )

      case "pie":
        return (
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={chartData}
                dataKey="value"
                nameKey="name"
                cx="50%"
                cy="50%"
                outerRadius={120}
                animationDuration={1500}
                animationEasing="ease-out"
              >
                {chartData.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={entry.color ?? `hsl(${index * 45}, 70%, 50%)`}
                  />
                ))}
              </Pie>
            </PieChart>
          </ResponsiveContainer>
        )

      case "line":
        return (
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={chartData} margin={{ top: 20, right: 20, bottom: 20, left: 20 }}>
              <XAxis
                dataKey="name"
                tick={{ fill: tickColor, fontSize: 12 }}
                axisLine={{ stroke: axisColor }}
                tickLine={false}
              />
              <YAxis
                tick={{ fill: tickColor, fontSize: 12 }}
                axisLine={{ stroke: axisColor }}
                tickLine={false}
              />
              <Line
                type="monotone"
                dataKey="value"
                stroke="#3b82f6"
                strokeWidth={2}
                dot={{ fill: "#3b82f6", strokeWidth: 0 }}
                animationDuration={1500}
                animationEasing="ease-out"
              />
            </LineChart>
          </ResponsiveContainer>
        )

      case "area":
        return (
          <ResponsiveContainer width="100%" height={300}>
            <AreaChart data={chartData} margin={{ top: 20, right: 20, bottom: 20, left: 20 }}>
              <defs>
                <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                </linearGradient>
              </defs>
              <XAxis
                dataKey="name"
                tick={{ fill: tickColor, fontSize: 12 }}
                axisLine={{ stroke: axisColor }}
                tickLine={false}
              />
              <YAxis
                tick={{ fill: tickColor, fontSize: 12 }}
                axisLine={{ stroke: axisColor }}
                tickLine={false}
              />
              <Area
                type="monotone"
                dataKey="value"
                stroke="#3b82f6"
                fillOpacity={1}
                fill="url(#colorValue)"
                animationDuration={1500}
                animationEasing="ease-out"
              />
            </AreaChart>
          </ResponsiveContainer>
        )
    }
  }

  return (
    <div className="flex flex-col items-center justify-center text-center px-8 max-w-4xl mx-auto w-full">
      <motion.h2
        className={`text-3xl md:text-4xl lg:text-5xl font-bold mb-4 ${
          isDark ? "text-white" : "text-neutral-900"
        }`}
        initial={{ opacity: 0, y: 20 }}
        animate={isActive ? { opacity: 1, y: 0 } : {}}
        transition={{ delay: 0.2, duration: 0.6 }}
      >
        {title}
      </motion.h2>

      {subtitle && (
        <motion.p
          className={`text-lg md:text-xl mb-12 ${isDark ? "text-white/50" : "text-neutral-500"}`}
          initial={{ opacity: 0, y: 20 }}
          animate={isActive ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.3, duration: 0.6 }}
        >
          {subtitle}
        </motion.p>
      )}

      <motion.div
        className="w-full"
        initial={{ opacity: 0, y: 30 }}
        animate={isActive ? { opacity: 1, y: 0 } : {}}
        transition={{ delay: 0.4, duration: 0.6 }}
      >
        {renderChart()}
      </motion.div>

      {/* 범례 */}
      <motion.div
        className="flex flex-wrap justify-center gap-4 mt-8"
        initial={{ opacity: 0 }}
        animate={isActive ? { opacity: 1 } : {}}
        transition={{ delay: 0.8, duration: 0.6 }}
      >
        {chartData.slice(0, 6).map((item, index) => (
          <div key={index} className="flex items-center gap-2">
            <div
              className="w-3 h-3 rounded-full"
              style={{ backgroundColor: item.color ?? "#3b82f6" }}
            />
            <span className={`text-sm ${isDark ? "text-white/60" : "text-neutral-600"}`}>
              {item.name}
            </span>
          </div>
        ))}
      </motion.div>
    </div>
  )
}
