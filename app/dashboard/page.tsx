'use client';
import Link from 'next/link';
import { useState, useEffect } from 'react';
import { getPatients } from '../utils/db';
import { BarChart, Bar, LineChart, Line, PieChart, Pie, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Cell } from 'recharts';
import { Users, DollarSign, UserPlus, Calendar } from 'lucide-react';
import Navbar from '../components/navbar';

export default function Dashboard() {
  const [stats, setStats] = useState({
    totalPatients: 0,
    newPatients: 0,
    totalRevenue: 0,
    averagePayment: 0
  });
  const [monthlyData, setMonthlyData] = useState([]);
  const [ageDistribution, setAgeDistribution] = useState([]);
  const [paymentDistribution, setPaymentDistribution] = useState([]);

  useEffect(() => {
    const patients = getPatients();
    
    // Calculate basic stats
    const newPatientsCount = patients.filter(p => p.isNewPatient).length;
    const totalRevenue = patients.reduce((sum, p) => sum + p.payment, 0);
    
    setStats({
      totalPatients: patients.length,
      newPatients: newPatientsCount,
      totalRevenue: totalRevenue,
      averagePayment: patients.length ? totalRevenue / patients.length : 0
    });

    // Process monthly data
    const monthly = {};
    patients.forEach(patient => {
      const date = new Date(patient.createdAt);
      const monthYear = `${date.getMonth() + 1}/${date.getFullYear()}`;
      if (!monthly[monthYear]) {
        monthly[monthYear] = { patients: 0, revenue: 0 };
      }
      monthly[monthYear].patients++;
      monthly[monthYear].revenue += patient.payment;
    });
    
    setMonthlyData(Object.entries(monthly).map(([month, data]) => ({
      month,
      patients: data.patients,
      revenue: data.revenue
    })));

    // Process age distribution
    const ageGroups = {
      '0-20': 0,
      '21-40': 0,
      '41-60': 0,
      '60+': 0
    };
    
    patients.forEach(patient => {
      if (patient.age <= 20) ageGroups['0-20']++;
      else if (patient.age <= 40) ageGroups['21-40']++;
      else if (patient.age <= 60) ageGroups['41-60']++;
      else ageGroups['60+']++;
    });
    
    setAgeDistribution(Object.entries(ageGroups).map(([range, count]) => ({
      range,
      count
    })));

    // Process payment distribution
    const payments = patients.map(p => p.payment).sort((a, b) => a - b);
    const ranges = ['$0-100', '$101-300', '$301-500', '$500+'];
    const paymentRanges = {
      '$0-100': 0,
      '$101-300': 0,
      '$301-500': 0,
      '$500+': 0
    };

    payments.forEach(payment => {
      if (payment <= 100) paymentRanges['$0-100']++;
      else if (payment <= 300) paymentRanges['$101-300']++;
      else if (payment <= 500) paymentRanges['$301-500']++;
      else paymentRanges['$500+']++;
    });

    setPaymentDistribution(Object.entries(paymentRanges).map(([range, count]) => ({
      range,
      count
    })));
  }, []);

  const COLORS = ['#6366f1', '#8b5cf6', '#d946ef', '#f43f5e'];

  return (
    <div>
        <Navbar onNavigate={() => {}} currentPage="dashboard" />
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-purple-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-8">
        <div className="flex justify-between items-center">
          <h1 className="text-4xl font-bold text-indigo-900">Dental Practice Dashboard</h1>
          <div className="space-x-4">
            <Link 
              href="/form" 
              className="inline-flex items-center px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
            >
              <UserPlus className="w-5 h-5 mr-2" />
              New Patient
            </Link>
            <Link 
              href="/list"
              className="inline-flex items-center px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
            >
              <Users className="w-5 h-5 mr-2" />
              Patient List
            </Link>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-white rounded-xl shadow-md p-6 space-y-2">
            <div className="flex items-center justify-between">
              <h3 className="text-gray-500 text-sm font-medium">Total Patients</h3>
              <Users className="w-6 h-6 text-indigo-600" />
            </div>
            <p className="text-3xl font-bold text-gray-900">{stats.totalPatients}</p>
          </div>
          
          <div className="bg-white rounded-xl shadow-md p-6 space-y-2">
            <div className="flex items-center justify-between">
              <h3 className="text-gray-500 text-sm font-medium">New Patients</h3>
              <UserPlus className="w-6 h-6 text-purple-600" />
            </div>
            <p className="text-3xl font-bold text-gray-900">{stats.newPatients}</p>
          </div>
          
          <div className="bg-white rounded-xl shadow-md p-6 space-y-2">
            <div className="flex items-center justify-between">
              <h3 className="text-gray-500 text-sm font-medium">Total Revenue</h3>
              <DollarSign className="w-6 h-6 text-green-600" />
            </div>
            <p className="text-3xl font-bold text-gray-900">
              ${stats.totalRevenue.toLocaleString(undefined, {minimumFractionDigits: 2})}
            </p>
          </div>
          
          <div className="bg-white rounded-xl shadow-md p-6 space-y-2">
            <div className="flex items-center justify-between">
              <h3 className="text-gray-500 text-sm font-medium">Avg. Payment</h3>
              <Calendar className="w-6 h-6 text-rose-600" />
            </div>
            <p className="text-3xl font-bold text-gray-900">
              ${stats.averagePayment.toLocaleString(undefined, {minimumFractionDigits: 2})}
            </p>
          </div>
        </div>

        {/* Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Monthly Trends */}
          <div className="bg-white rounded-xl shadow-md p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Monthly Patient Trends</h3>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={monthlyData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Line type="monotone" dataKey="patients" stroke="#6366f1" />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Revenue Trends */}
          <div className="bg-white rounded-xl shadow-md p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Monthly Revenue</h3>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={monthlyData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="revenue" fill="#8b5cf6" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Age Distribution */}
          <div className="bg-white rounded-xl shadow-md p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Age Distribution</h3>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={ageDistribution}
                    dataKey="count"
                    nameKey="range"
                    cx="50%"
                    cy="50%"
                    outerRadius={100}
                    label
                  >
                    {ageDistribution.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Payment Distribution */}
          <div className="bg-white rounded-xl shxow-md p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Payment Distribution</h3>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={paymentDistribution}
                    dataKey="count"
                    nameKey="range"
                    cx="50%"
                    cy="50%"
                    outerRadius={100}
                    label
                  >
                    {paymentDistribution.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
        </div>
      </div>
    </div>
  );
}