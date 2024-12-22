'use client';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from '@/app/components/ui/card';
import { Patient } from '../utils/types';

interface TreatmentAnalyticsProps {
  patients: Patient[];
}

export function TreatmentAnalytics({ patients }: TreatmentAnalyticsProps) {
  // Calculate treatment counts
  const treatmentCounts = patients.reduce((acc, patient) => {
    acc[patient.treatmentPlan] = (acc[patient.treatmentPlan] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const treatmentData = Object.entries(treatmentCounts).map(([name, count]) => ({
    name,
    count,
  }));

  return (
    <Card className="col-span-4">
      <CardHeader>
        <CardTitle>Treatment Analytics</CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={350}>
          <BarChart data={treatmentData}>
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Bar dataKey="count" fill="#8884d8" />
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}