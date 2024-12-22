import { Pie, PieChart, ResponsiveContainer, Cell, Legend } from "recharts"

export function GenderDistribution({ patients }) {
  const genderCounts = patients.reduce((acc, patient) => {
    acc[patient.gender] = (acc[patient.gender] || 0) + 1
    return acc
  }, {})

  const data = Object.entries(genderCounts).map(([name, value]) => ({ name, value }))

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28']

  return (
    <ResponsiveContainer width="100%" height={350}>
      <PieChart>
        <Pie
          data={data}
          cx="50%"
          cy="50%"
          labelLine={false}
          outerRadius={80}
          fill="#8884d8"
          dataKey="value"
        >
          {data.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
          ))}
        </Pie>
        <Legend />
      </PieChart>
    </ResponsiveContainer>
  )
}

