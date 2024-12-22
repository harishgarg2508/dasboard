import { Pie, PieChart, ResponsiveContainer, Cell, Legend } from "recharts"

export function PaymentChart({ patients }) {
  const data = [
    { name: 'Paid', value: patients.filter(p => p.paymentStatus === 'PAID').length },
    { name: 'Unpaid', value: patients.filter(p => p.paymentStatus === 'UNPAID').length },
  ]

  const COLORS = ['#0088FE', '#FF8042']

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

