"use client"

import * as React from "react"
import { useLocale } from "next-intl"
import { TrendingUp, TrendingDown, Minus } from "lucide-react"

import { cn } from "@/lib/utils"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

interface ChartDataPoint {
  label: string
  value: number
  color?: string
}

interface ChartProps {
  data: ChartDataPoint[]
  title?: string
  description?: string
  type?: 'bar' | 'line' | 'pie' | 'area'
  height?: number
  showGrid?: boolean
  showLegend?: boolean
  className?: string
  formatValue?: (value: number) => string
}

interface StatCardProps {
  title: string
  value: string | number
  change?: number
  changeLabel?: string
  icon?: React.ReactNode
  className?: string
  formatValue?: (value: number) => string
}

export function Chart({
  data,
  title,
  description,
  type = 'bar',
  height = 300,
  showGrid = true,
  showLegend = true,
  className,
  formatValue,
}: ChartProps) {
  const locale = useLocale()
  
  const formatNumber = React.useCallback((value: number) => {
    if (formatValue) return formatValue(value)
    
    return new Intl.NumberFormat(locale, {
      notation: value >= 1000000 ? 'compact' : 'standard',
      maximumFractionDigits: 1,
    }).format(value)
  }, [locale, formatValue])

  const maxValue = Math.max(...data.map(d => d.value))
  const minValue = Math.min(...data.map(d => d.value))

  const renderBarChart = () => (
    <div className="space-y-3">
      {data.map((item, index) => {
        const percentage = (item.value / maxValue) * 100
        const color = item.color || `hsl(${(index * 137.5) % 360}, 70%, 50%)`
        
        return (
          <div key={item.label} className="space-y-1">
            <div className="flex justify-between text-sm">
              <span className="font-medium">{item.label}</span>
              <span className="text-muted-foreground">{formatNumber(item.value)}</span>
            </div>
            <div className="w-full bg-muted rounded-full h-2">
              <div
                className="h-2 rounded-full transition-all duration-500 ease-out"
                style={{
                  width: `${percentage}%`,
                  backgroundColor: color,
                }}
              />
            </div>
          </div>
        )
      })}
    </div>
  )

  const renderLineChart = () => {
    const points = data.map((item, index) => {
      const x = (index / (data.length - 1)) * 100
      const y = 100 - ((item.value - minValue) / (maxValue - minValue)) * 100
      return `${x},${y}`
    }).join(' ')

    return (
      <div className="relative">
        <svg
          width="100%"
          height={height}
          viewBox="0 0 100 100"
          preserveAspectRatio="none"
          className="border rounded"
        >
          {showGrid && (
            <defs>
              <pattern id="grid" width="10" height="10" patternUnits="userSpaceOnUse">
                <path d="M 10 0 L 0 0 0 10" fill="none" stroke="currentColor" strokeWidth="0.5" opacity="0.1"/>
              </pattern>
            </defs>
          )}
          {showGrid && <rect width="100" height="100" fill="url(#grid)" />}
          <polyline
            fill="none"
            stroke="hsl(var(--primary))"
            strokeWidth="2"
            points={points}
            vectorEffect="non-scaling-stroke"
          />
          {data.map((item, index) => {
            const x = (index / (data.length - 1)) * 100
            const y = 100 - ((item.value - minValue) / (maxValue - minValue)) * 100
            return (
              <circle
                key={index}
                cx={x}
                cy={y}
                r="2"
                fill="hsl(var(--primary))"
                vectorEffect="non-scaling-stroke"
              />
            )
          })}
        </svg>
        
        {/* X-axis labels */}
        <div className="flex justify-between mt-2 text-xs text-muted-foreground">
          {data.map((item, index) => (
            <span key={index} className="text-center">
              {item.label}
            </span>
          ))}
        </div>
      </div>
    )
  }

  const renderPieChart = () => {
    const total = data.reduce((sum, item) => sum + item.value, 0)
    let cumulativePercentage = 0

    return (
      <div className="flex items-center justify-center space-x-8">
        <div className="relative">
          <svg width="200" height="200" viewBox="0 0 42 42" className="transform -rotate-90">
            <circle
              cx="21"
              cy="21"
              r="15.915"
              fill="transparent"
              stroke="hsl(var(--muted))"
              strokeWidth="3"
            />
            {data.map((item, index) => {
              const percentage = (item.value / total) * 100
              const strokeDasharray = `${percentage} ${100 - percentage}`
              const strokeDashoffset = -cumulativePercentage
              const color = item.color || `hsl(${(index * 137.5) % 360}, 70%, 50%)`
              
              cumulativePercentage += percentage
              
              return (
                <circle
                  key={index}
                  cx="21"
                  cy="21"
                  r="15.915"
                  fill="transparent"
                  stroke={color}
                  strokeWidth="3"
                  strokeDasharray={strokeDasharray}
                  strokeDashoffset={strokeDashoffset}
                  className="transition-all duration-500"
                />
              )
            })}
          </svg>
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-center">
              <div className="text-2xl font-bold">{formatNumber(total)}</div>
              <div className="text-xs text-muted-foreground">Total</div>
            </div>
          </div>
        </div>
        
        {showLegend && (
          <div className="space-y-2">
            {data.map((item, index) => {
              const percentage = ((item.value / total) * 100).toFixed(1)
              const color = item.color || `hsl(${(index * 137.5) % 360}, 70%, 50%)`
              
              return (
                <div key={index} className="flex items-center space-x-2 text-sm">
                  <div
                    className="w-3 h-3 rounded-full"
                    style={{ backgroundColor: color }}
                  />
                  <span className="font-medium">{item.label}</span>
                  <span className="text-muted-foreground">
                    {formatNumber(item.value)} ({percentage}%)
                  </span>
                </div>
              )
            })}
          </div>
        )}
      </div>
    )
  }

  const renderChart = () => {
    switch (type) {
      case 'line':
        return renderLineChart()
      case 'pie':
        return renderPieChart()
      case 'area':
        return renderLineChart() // Simplified area chart
      default:
        return renderBarChart()
    }
  }

  return (
    <Card className={className}>
      {(title || description) && (
        <CardHeader>
          {title && <CardTitle>{title}</CardTitle>}
          {description && <CardDescription>{description}</CardDescription>}
        </CardHeader>
      )}
      <CardContent>
        {renderChart()}
      </CardContent>
    </Card>
  )
}

export function StatCard({
  title,
  value,
  change,
  changeLabel,
  icon,
  className,
  formatValue,
}: StatCardProps) {
  const locale = useLocale()
  
  const formatNumber = React.useCallback((val: number) => {
    if (formatValue) return formatValue(val)
    
    return new Intl.NumberFormat(locale, {
      notation: val >= 1000000 ? 'compact' : 'standard',
      maximumFractionDigits: 1,
    }).format(val)
  }, [locale, formatValue])

  const getTrendIcon = () => {
    if (change === undefined) return <Minus className="h-4 w-4" />
    if (change > 0) return <TrendingUp className="h-4 w-4 text-green-600" />
    if (change < 0) return <TrendingDown className="h-4 w-4 text-red-600" />
    return <Minus className="h-4 w-4" />
  }

  const getTrendColor = () => {
    if (change === undefined) return 'text-muted-foreground'
    if (change > 0) return 'text-green-600'
    if (change < 0) return 'text-red-600'
    return 'text-muted-foreground'
  }

  return (
    <Card className={className}>
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <p className="text-sm font-medium text-muted-foreground">{title}</p>
            <p className="text-2xl font-bold">
              {typeof value === 'number' ? formatNumber(value) : value}
            </p>
            {change !== undefined && (
              <div className={cn("flex items-center space-x-1 text-xs", getTrendColor())}>
                {getTrendIcon()}
                <span>
                  {Math.abs(change)}% {changeLabel || 'from last period'}
                </span>
              </div>
            )}
          </div>
          {icon && (
            <div className="p-2 bg-primary/10 rounded-lg">
              {icon}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
