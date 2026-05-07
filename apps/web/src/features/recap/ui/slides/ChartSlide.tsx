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
import { cn } from "@shared/lib"
import type { BaseSlideProps, ChartSlideData } from "../../model/types"

export function ChartSlide({ data, isActive, theme = "dark" }: BaseSlideProps<ChartSlideData>) {
  const { title, subtitle, chartType, data: chartData } = data
  const wrapperTheme = theme === "light" ? "" : "dark"

  // recharts의 SVG fill/stroke는 CSS var를 못 받으므로 hex로 명시.
  // dark/light 분기는 유지하되, Warm Ink 패밀리 색으로 정렬.
  const isDark = theme === "dark"
  const tickColor = isDark ? "oklch(0.96 0.005 60 / 0.5)" : "oklch(0.18 0.01 60 / 0.5)"
  const axisColor = isDark ? "oklch(0.96 0.005 60 / 0.1)" : "oklch(0.18 0.01 60 / 0.1)"

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
                  <Cell key={`cell-${index}`} fill={entry.color ?? "#3563d9"} />
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
                stroke="#3563d9"
                strokeWidth={2}
                dot={{ fill: "#3563d9", strokeWidth: 0 }}
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
                  <stop offset="5%" stopColor="#3563d9" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#3563d9" stopOpacity={0} />
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
                stroke="#3563d9"
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
    <div
      className={cn(
        wrapperTheme,
        "flex flex-col items-center justify-center text-center px-8 max-w-4xl mx-auto w-full text-foreground"
      )}
    >
      <motion.h2
        className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4 text-foreground tracking-tight break-keep"
        style={{ letterSpacing: "-0.02em" }}
        initial={{ opacity: 0, y: 20 }}
        animate={isActive ? { opacity: 1, y: 0 } : {}}
        transition={{ delay: 0.2, duration: 0.6 }}
      >
        {title}
      </motion.h2>

      {subtitle && (
        <motion.p
          className="text-lg md:text-xl mb-12 text-foreground/50 break-keep"
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
              style={{ backgroundColor: item.color ?? "#3563d9" }}
            />
            <span className="text-sm text-foreground/60">{item.name}</span>
          </div>
        ))}
      </motion.div>
    </div>
  )
}
