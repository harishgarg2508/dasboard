"use client"

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/app/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/app/components/ui/tabs"
import { Button } from "@/app/components/ui/button"
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

  const currentMonth = new Date().toLocaleString('default', { month: 'long' })
  const currentYear = new Date().getFullYear()

  const isCurrentMonth = (date) => {
    const patientDate = new Date(date)
    return patientDate.getMonth() === new Date().getMonth() && patientDate.getFullYear() === new Date().getFullYear()
  }

  const monthlyPatients = patients.filter(p => isCurrentMonth(p.entryDate))
  const newPatients = monthlyPatients.filter(p => p.isNewPatient)
  const oldPatients = monthlyPatients.filter(p => !p.isNewPatient)
  const totalRevenue = monthlyPatients.reduce((sum, p) => sum + p.payment, 0)
  const averageRevenue = totalRevenue / monthlyPatients.length || 0
  const malePatients = monthlyPatients.filter(p => p.gender === 'Male').length
  const femalePatients = monthlyPatients.filter(p => p.gender === 'Female').length
  const averageAge = monthlyPatients.reduce((sum, p) => sum + p.age, 0) / monthlyPatients.length || 0

  const generateCSV = () => {
    const headers = [
      "Total Patients",
      "New Patients",
      "Old Patients",
      "Total Revenue",
      "Average Revenue per Patient",
      "Male Patients",
      "Female Patients",
      "Average Age"
    ]
    const data = [
      monthlyPatients.length,
      newPatients.length,
      oldPatients.length,
      totalRevenue.toFixed(2),
      averageRevenue.toFixed(2),
      malePatients,
      femalePatients,
      averageAge.toFixed(1)
    ]
    const csvContent = [
      headers.join(','),
      data.join(',')
    ].join('\n')
    
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
    const link = document.createElement("a")
    if (link.download !== undefined) {
      const url = URL.createObjectURL(blob)
      link.setAttribute("href", url)
      link.setAttribute("download", `monthly_report_${currentMonth}_${currentYear}.csv`)
      link.style.visibility = 'hidden'
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
    }
  }

  return (
    <div>
      <Navbar />
      <div className="flex-1 space-y-4 p-8 pt-6 bg-cyan-50 text-black">
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
                <CardTitle>Monthly Report - {currentMonth} {currentYear}</CardTitle>
                <CardDescription>Comprehensive overview of patient activities for the current month</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <h3 className="text-lg font-semibold">Patient Statistics</h3>
                    <p>Total Patients: {monthlyPatients.length}</p>
                    <p>New Patients: {newPatients.length}</p>
                    <p>Old Patients: {oldPatients.length}</p>
                    <p>Male Patients: {malePatients}</p>
                    <p>Female Patients: {femalePatients}</p>
                    <p>Average Age: {averageAge.toFixed(1)}</p>
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold">Financial Overview</h3>
                    <p>Total Revenue: ₹{totalRevenue.toFixed(2)}</p>
                    <p>Average Revenue per Patient: ₹{averageRevenue.toFixed(2)}</p>
                  </div>
                </div>
                <Button onClick={generateCSV}>Download Report</Button>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}


