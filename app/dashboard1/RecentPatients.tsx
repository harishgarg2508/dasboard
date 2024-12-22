'use client';
import { Patient } from '../utils/types';
import { Card, CardContent, CardHeader, CardTitle } from '@/app/components/ui/card';
import { Avatar } from '@radix-ui/react-avatar';

interface RecentPatientsProps {
  patients: Patient[];
}

export function RecentPatients({ patients }: RecentPatientsProps) {
  return (
    <Card className="col-span-3">
      <CardHeader>
        <CardTitle>Recent Patients</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-8">
          {patients.slice(0, 5).map((patient) => (
            <div key={patient.id} className="flex items-center">
              <Avatar className="h-9 w-9">
                <span className="font-semibold text-xs">
                  {patient.name.split(' ').map(n => n[0]).join('')}
                </span>
              </Avatar>
              <div className="ml-4 space-y-1">
                <p className="text-sm font-medium leading-none">{patient.name}</p>
                <p className="text-sm text-muted-foreground">
                  {patient.diagnosis}
                </p>
              </div>
              <div className="ml-auto font-medium">
                ${patient.remainingBalance.toFixed(2)}
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}