import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis, Cell, Label } from "recharts"

export function Overview({ patients }) {
  const last30Days = [...Array(30)].map((_, i) => {
    const d = new Date()
    d.setDate(d.getDate() - i)
    return d.toISOString().split('T')[0]
  }).reverse()

  const data = last30Days.map(date => ({
    name: date,
    total: patients.filter(p => p.entryDate === date).length
  }))

  return (
    <ResponsiveContainer width="100%" height={350}>
      <BarChart data={data}>
        <XAxis
          dataKey="name"
          stroke="#888888"
          fontSize={12}
          tickLine={false}
          axisLine={false}
        />
        <YAxis
          stroke="#888888"
          fontSize={12}
          tickLine={false}
          axisLine={false}
          tickFormatter={(value) => `${value}`}
        />
        <Bar dataKey="total" fill="#adfa1d" radius={[4, 4, 0, 0]}>
          {data.map((entry, index) => (
            <Cell key={`cell-${index}`}>
              <Label
                position="top"
                content={({ value }) => value > 0 ? value : null}
              />
            </Cell>
          ))}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  )
}

