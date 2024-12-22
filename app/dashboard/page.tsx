"use client"

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/app/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/app/components/ui/tabs"
import { Overview } from './components/overview'
import { RecentPatients } from './components/recent-patients'
import { PatientStats } from './components/patient-stats'
import { PaymentChart } from './components/payment-chart'
import { AgeDistribution } from './components/age-distribution'
import { GenderDistribution } from './components/gender-distribution'
import { TreatmentDistribution } from './components/treatment-distribution'
import { getPatients } from '../utils/db'
import Navbar from '../components/navbar'

export default function DashboardPage() {
  const [patients, setPatients] = useState([])

  useEffect(() => {
    const fetchPatients = async () => {
      const fetchedPatients = await getPatients()
      setPatients(fetchedPatients)
    }
    fetchPatients()
  }, [])

  return (
    <div>
      <Navbar />
      <div className="flex-1 space-y-4 p-8 pt-6 bg-black text-white">
      <div className="flex items-center justify-between space-y-2">
        <h2 className="text-3xl font-bold tracking-tight">Dashboard</h2>
      </div>
      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
          <TabsTrigger value="reports">Reports</TabsTrigger>
        </TabsList>
        <TabsContent value="overview" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <PatientStats patients={patients} />
          </div>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
            <Card className="col-span-4">
              <CardHeader>
                <CardTitle>Overview</CardTitle>
              </CardHeader>
              <CardContent className="pl-2">
                <Overview patients={patients} />
              </CardContent>
            </Card>
            <Card className="col-span-3">
              <CardHeader>
                <CardTitle>Recent Patients</CardTitle>
                <CardDescription>
                  You have {patients.length} total patients.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <RecentPatients patients={patients} />
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        <TabsContent value="analytics" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
            <Card className="col-span-4">
              <CardHeader>
                <CardTitle>Payment Distribution</CardTitle>
              </CardHeader>
              <CardContent className="pl-2">
                <PaymentChart patients={patients} />
              </CardContent>
            </Card>
            <Card className="col-span-3">
              <CardHeader>
                <CardTitle>Age Distribution</CardTitle>
              </CardHeader>
              <CardContent>
                <AgeDistribution patients={patients} />
              </CardContent>
            </Card>
          </div>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
            <Card className="col-span-4">
              <CardHeader>
                <CardTitle>Gender Distribution</CardTitle>
              </CardHeader>
              <CardContent>
                <GenderDistribution patients={patients} />
              </CardContent>
            </Card>
            <Card className="col-span-3">
              <CardHeader>
                <CardTitle>Treatment Distribution</CardTitle>
              </CardHeader>
              <CardContent>
                <TreatmentDistribution patients={patients} />
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        <TabsContent value="reports" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Monthly Report</CardTitle>
              <CardDescription>Overview of patient activities for the current month</CardDescription>
            </CardHeader>
            <CardContent>
              <p>Total Patients: {patients.length}</p>
              <p>New Patients: {patients.filter(p => new Date(p.entryDate).getMonth() === new Date().getMonth()).length}</p>
              <p>Total Revenue: ${patients.reduce((sum, p) => sum + p.payment, 0).toFixed(2)}</p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  </div>
  )
}

