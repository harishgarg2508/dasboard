import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis } from "recharts"

export function AgeDistribution({ patients }) {
  const ageGroups = {
    '0-18': 0,
    '19-30': 0,
    '31-45': 0,
    '46-60': 0,
    '60+': 0
  }

  patients.forEach(patient => {
    const age = patient.age
    if (age <= 18) ageGroups['0-18']++
    else if (age <= 30) ageGroups['19-30']++
    else if (age <= 45) ageGroups['31-45']++
    else if (age <= 60) ageGroups['46-60']++
    else ageGroups['60+']++
  })

  const data = Object.entries(ageGroups).map(([name, value]) => ({ name, value }))

  return (
    <ResponsiveContainer width="100%" height={350}>
      <BarChart data={data}>
        <XAxis dataKey="name" />
        <YAxis />
        <Bar dataKey="value" fill="#8884d8" />
      </BarChart>
    </ResponsiveContainer>
  )
}

