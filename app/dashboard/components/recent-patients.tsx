import { Avatar, AvatarFallback } from "@/app/components/ui/avatar"

export function RecentPatients({ patients }) {
  const recentPatients = patients.slice(-5).reverse()

  // Function to generate a random pastel color
  const getRandomPastelColor = () => {
    const hue = Math.floor(Math.random() * 360)
    return `hsl(${hue}, 70%, 80%)`
  }

  return (
    <div className="space-y-8">
      {recentPatients.map((patient, index) => (
        <div key={index} className="flex items-center">
          <Avatar className="h-9 w-9">
            <AvatarFallback 
              className="flex items-center justify-center text-white font-semibold"
              style={{ backgroundColor: getRandomPastelColor() }}
            >
              {patient.name.charAt(0)}
            </AvatarFallback>
          </Avatar>
          <div className="ml-4 space-y-1">
            <p className="text-sm font-medium leading-none">{patient.name}</p>
            <p className="text-sm text-muted-foreground">
              {patient.diagnosis}
            </p>
          </div>
          <div className="ml-auto font-medium">
            ₹{patient.payment.toFixed(2)}
          </div>
        </div>
      ))}
    </div>
  )
}

