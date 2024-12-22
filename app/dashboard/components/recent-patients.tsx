import { Avatar, AvatarFallback } from "@/app/components/ui/avatar"

export function RecentPatients({ patients }) {
  const recentPatients = patients.slice(-5).reverse()

  return (
    <div className="space-y-8">
      {recentPatients.map((patient, index) => (
        <div key={index} className="flex items-center">
          <Avatar className="h-9 w-9">
            <AvatarFallback>{patient.name.charAt(0)}</AvatarFallback>
          </Avatar>
          <div className="ml-4 space-y-1">
            <p className="text-sm font-medium leading-none">{patient.name}</p>
            <p className="text-sm text-muted-foreground">
              {patient.diagnosis}
            </p>
          </div>
          <div className="ml-auto font-medium">
            ${patient.payment.toFixed(2)}
          </div>
        </div>
      ))}
    </div>
  )
}

