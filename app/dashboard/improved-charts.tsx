"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ChartContainer, ChartLegend, ChartTooltip } from "@/components/ui/chart"
import { PieChart, Pie, Cell, ResponsiveContainer } from "recharts"

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8', '#82CA9D']

interface PaymentData {
  range: string
  count: number
}

const CustomLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent, index, range }: any) => {
  const RADIAN = Math.PI / 180
  const radius = innerRadius + (outerRadius - innerRadius) * 0.5
  const x = cx + radius * Math.cos(-midAngle * RADIAN)
  const y = cy + radius * Math.sin(-midAngle * RADIAN)

  if (percent < 0.05) return null // Don't render very small slices

  return (
    <text
      x={x}
      y={y}
      fill="white"
      textAnchor={x > cx ? 'start' : 'end'}
      dominantBaseline="central"
      fontSize="12"
    >
      {`${range}: ${(percent * 100).toFixed(0)}%`}
    </text>
  )
}

export function PaymentDistributionChart({ paymentDistribution }: { paymentDistribution: PaymentData[] }) {
  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Payment Analysis</CardTitle>
      </CardHeader>
      <CardContent>
        <ChartContainer className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={paymentDistribution}
                dataKey="count"
                nameKey="range"
                cx="50%"
                cy="50%"
                outerRadius={100}
                labelLine={false}
                label={CustomLabel}
              >
                {paymentDistribution.map((entry, index) => (
                  <Cell 
                    key={`cell-${index}`} 
                    fill={COLORS[index % COLORS.length]}
                  />
                ))}
              </Pie>
              <ChartTooltip />
              <ChartLegend />
            </PieChart>
          </ResponsiveContainer>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}

