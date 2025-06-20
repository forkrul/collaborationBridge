import * as React from 'react'
import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '@company/core'
import type { 
  BaseComponentProps, 
  ComponentWithChildren,
  ComponentSize 
} from '@company/core'

const chartVariants = cva(
  'w-full',
  {
    variants: {
      variant: {
        default: '',
        card: 'p-4 border rounded-lg bg-card',
        minimal: 'p-2',
      },
      size: {
        sm: 'h-48',
        md: 'h-64',
        lg: 'h-96',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'md',
    },
  }
)

export interface ChartDataPoint {
  /** Label for the data point */
  label: string
  /** Value of the data point */
  value: number
  /** Optional color for the data point */
  color?: string
}

export interface ChartProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof chartVariants>,
    BaseComponentProps,
    ComponentWithChildren {
  /** Chart data */
  data?: ChartDataPoint[]
  /** Chart title */
  title?: string
  /** Chart description */
  description?: string
  /** Visual variant */
  variant?: 'default' | 'card' | 'minimal'
  /** Size variant */
  size?: ComponentSize
  /** Chart type */
  type?: 'bar' | 'line' | 'pie' | 'area'
  /** Whether to show legend */
  showLegend?: boolean
  /** Whether to show grid */
  showGrid?: boolean
  /** Custom colors for chart */
  colors?: string[]
  /** Loading state */
  loading?: boolean
  /** Error state */
  error?: string
  /** Empty state message */
  emptyMessage?: string
}

// Simple bar chart implementation
const BarChart: React.FC<{ data: ChartDataPoint[]; colors: string[]; showGrid: boolean }> = ({ 
  data, 
  colors, 
  showGrid 
}) => {
  const maxValue = Math.max(...data.map(d => d.value))
  
  return (
    <div className="relative h-full flex items-end space-x-2 p-4">
      {showGrid && (
        <div className="absolute inset-0 flex flex-col justify-between opacity-20">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="border-t border-muted-foreground" />
          ))}
        </div>
      )}
      
      {data.map((item, index) => {
        const height = (item.value / maxValue) * 100
        const color = item.color || colors[index % colors.length]
        
        return (
          <div key={item.label} className="flex-1 flex flex-col items-center space-y-2">
            <div
              className="w-full rounded-t transition-all duration-300 hover:opacity-80"
              style={{
                height: `${height}%`,
                backgroundColor: color,
                minHeight: '4px'
              }}
              title={`${item.label}: ${item.value}`}
            />
            <span className="text-xs text-muted-foreground text-center truncate w-full">
              {item.label}
            </span>
          </div>
        )
      })}
    </div>
  )
}

// Simple pie chart implementation
const PieChart: React.FC<{ data: ChartDataPoint[]; colors: string[] }> = ({ data, colors }) => {
  const total = data.reduce((sum, item) => sum + item.value, 0)
  let currentAngle = 0
  
  const radius = 80
  const centerX = 100
  const centerY = 100
  
  return (
    <div className="flex items-center justify-center h-full">
      <svg width="200" height="200" viewBox="0 0 200 200" className="max-w-full max-h-full">
        {data.map((item, index) => {
          const percentage = item.value / total
          const angle = percentage * 360
          const startAngle = currentAngle
          const endAngle = currentAngle + angle
          
          currentAngle += angle
          
          const startAngleRad = (startAngle * Math.PI) / 180
          const endAngleRad = (endAngle * Math.PI) / 180
          
          const x1 = centerX + radius * Math.cos(startAngleRad)
          const y1 = centerY + radius * Math.sin(startAngleRad)
          const x2 = centerX + radius * Math.cos(endAngleRad)
          const y2 = centerY + radius * Math.sin(endAngleRad)
          
          const largeArcFlag = angle > 180 ? 1 : 0
          
          const pathData = [
            `M ${centerX} ${centerY}`,
            `L ${x1} ${y1}`,
            `A ${radius} ${radius} 0 ${largeArcFlag} 1 ${x2} ${y2}`,
            'Z'
          ].join(' ')
          
          const color = item.color || colors[index % colors.length]
          
          return (
            <path
              key={item.label}
              d={pathData}
              fill={color}
              className="hover:opacity-80 transition-opacity"
              title={`${item.label}: ${item.value} (${(percentage * 100).toFixed(1)}%)`}
            />
          )
        })}
      </svg>
    </div>
  )
}

const Chart = React.forwardRef<HTMLDivElement, ChartProps>(
  ({
    className,
    data = [],
    title,
    description,
    variant = 'default',
    size = 'md',
    type = 'bar',
    showLegend = true,
    showGrid = true,
    colors = [
      '#3b82f6', // blue
      '#ef4444', // red
      '#10b981', // green
      '#f59e0b', // yellow
      '#8b5cf6', // purple
      '#06b6d4', // cyan
      '#f97316', // orange
      '#84cc16', // lime
    ],
    loading = false,
    error,
    emptyMessage = 'No data available',
    children,
    'data-testid': testId,
    ...props
  }, ref) => {
    const renderChart = () => {
      if (loading) {
        return (
          <div className="flex items-center justify-center h-full">
            <div className="text-muted-foreground">Loading chart...</div>
          </div>
        )
      }
      
      if (error) {
        return (
          <div className="flex items-center justify-center h-full">
            <div className="text-destructive text-center">
              <div className="font-medium">Error loading chart</div>
              <div className="text-sm mt-1">{error}</div>
            </div>
          </div>
        )
      }
      
      if (data.length === 0) {
        return (
          <div className="flex items-center justify-center h-full">
            <div className="text-muted-foreground text-center">
              {emptyMessage}
            </div>
          </div>
        )
      }
      
      // If children are provided, render them instead of built-in charts
      if (children) {
        return <div className="h-full">{children}</div>
      }
      
      switch (type) {
        case 'pie':
          return <PieChart data={data} colors={colors} />
        case 'bar':
        default:
          return <BarChart data={data} colors={colors} showGrid={showGrid} />
      }
    }

    const renderLegend = () => {
      if (!showLegend || data.length === 0) return null
      
      return (
        <div className="flex flex-wrap gap-4 mt-4">
          {data.map((item, index) => {
            const color = item.color || colors[index % colors.length]
            return (
              <div key={item.label} className="flex items-center space-x-2">
                <div
                  className="w-3 h-3 rounded-sm"
                  style={{ backgroundColor: color }}
                />
                <span className="text-sm text-muted-foreground">
                  {item.label}: {item.value}
                </span>
              </div>
            )
          })}
        </div>
      )
    }

    return (
      <div
        ref={ref}
        className={cn(chartVariants({ variant, size }), className)}
        data-testid={testId}
        {...props}
      >
        {(title || description) && (
          <div className="mb-4">
            {title && (
              <h3 className="text-lg font-semibold">{title}</h3>
            )}
            {description && (
              <p className="text-sm text-muted-foreground mt-1">{description}</p>
            )}
          </div>
        )}
        
        <div className="flex-1">
          {renderChart()}
        </div>
        
        {renderLegend()}
      </div>
    )
  }
)

Chart.displayName = 'Chart'

export { Chart, chartVariants }
