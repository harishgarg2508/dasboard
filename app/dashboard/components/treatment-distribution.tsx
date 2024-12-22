import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis, Cell, Label } from "recharts"

export function TreatmentDistribution({ patients }) {
  const treatmentCounts = patients.reduce((acc, patient) => {
    acc[patient.treatmentPlan] = (acc[patient.treatmentPlan] || 0) + 1
    return acc
  }, {})

  const data = Object.entries(treatmentCounts)
    .map(([name, value]) => ({ name, value }))
    .sort((a, b) => b.value - a.value)
    .slice(0, 5)  // Top 5 treatments

  return (
    <ResponsiveContainer width="100%" height={350}>
      <BarChart data={data} layout="vertical">
        <XAxis type="number" />
        <YAxis dataKey="name" type="category" width={150} />
        <Bar dataKey="value" fill="#82ca9d">
          {data.map((entry, index) => (
            <Cell key={`cell-${index}`}>
              <Label
                position="right"
                content={({ value }) => value}
              />
            </Cell>
          ))}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  )
}

