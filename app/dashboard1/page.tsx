'use client';
import { useState, useEffect } from 'react';
import { BarChart, Bar, LineChart, Line, PieChart, Pie, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Cell } from 'recharts';
import { Users, DollarSign, UserPlus, Calendar, TrendingUp } from 'lucide-react';
import Navbar from '../components/navbar';
import patientsData from '../../data/patients.json';

const Dashboard = () => {
  const [stats, setStats] = useState({
    totalPatients: 0,
    newPatients: 0,
    totalRevenue: 0,
    averagePayment: 0,
    growthRate: 0
  });
  const [monthlyData, setMonthlyData] = useState([]);
  const [ageDistribution, setAgeDistribution] = useState([]);
  const [paymentDistribution, setPaymentDistribution] = useState([]);

  useEffect(() => {
    const processData = () => {
      try {
        const patients = patientsData;
        
        // Calculate basic stats
        const newPatientsCount = patients.filter(p => p.isNewPatient).length;
        const totalRevenue = patients.reduce((sum, p) => sum + (p.payment || 0), 0);
        const lastMonthPatients = patients.filter(p => {
          const date = new Date(p.createdAt);
          const lastMonth = new Date();
          lastMonth.setMonth(lastMonth.getMonth() - 1);
          return date >= lastMonth;
        }).length;
        
        setStats({
          totalPatients: patients.length,
          newPatients: newPatientsCount,
          totalRevenue,
          averagePayment: patients.length ? totalRevenue / patients.length : 0,
          growthRate: ((lastMonthPatients / patients.length) * 100).toFixed(1)
        });

        // Process monthly data with better date handling
        const monthly = {};
        const sortedPatients = [...patients].sort((a, b) => 
          new Date(a.createdAt) - new Date(b.createdAt)
        );

        sortedPatients.forEach(patient => {
          const date = new Date(patient.createdAt);
          const monthYear = date.toLocaleString('default', { month: 'short', year: '2-digit' });
          
          if (!monthly[monthYear]) {
            monthly[monthYear] = { 
              patients: 0, 
              revenue: 0,
              newPatients: 0 
            };
          }
          monthly[monthYear].patients++;
          monthly[monthYear].revenue += patient.payment || 0;
          if (patient.isNewPatient) {
            monthly[monthYear].newPatients++;
          }
        });

        const monthlyDataArray = Object.entries(monthly).map(([month, data]) => ({
          month,
          patients: data.patients,
          revenue: data.revenue,
          newPatients: data.newPatients
        }));

        setMonthlyData(monthlyDataArray.slice(-6)); // Show last 6 months

        // Enhanced age distribution
        const ageGroups = {
          '0-18': { count: 0, label: 'Youth' },
          '19-35': { count: 0, label: 'Young Adult' },
          '36-50': { count: 0, label: 'Adult' },
          '51+': { count: 0, label: 'Senior' }
        };

        patients.forEach(patient => {
          if (patient.age <= 18) ageGroups['0-18'].count++;
          else if (patient.age <= 35) ageGroups['19-35'].count++;
          else if (patient.age <= 50) ageGroups['36-50'].count++;
          else ageGroups['51+'].count++;
        });

        setAgeDistribution(Object.entries(ageGroups).map(([range, data]) => ({
          range: `${data.label} (${range})`,
          count: data.count,
          percentage: ((data.count / patients.length) * 100).toFixed(1)
        })));

        // Enhanced payment distribution
        const paymentRanges = {
          '0-200': { count: 0, label: 'Basic' },
          '201-500': { count: 0, label: 'Standard' },
          '501-1000': { count: 0, label: 'Premium' },
          '1000+': { count: 0, label: 'Executive' }
        };

        patients.forEach(patient => {
          const payment = patient.payment || 0;
          if (payment <= 200) paymentRanges['0-200'].count++;
          else if (payment <= 500) paymentRanges['201-500'].count++;
          else if (payment <= 1000) paymentRanges['501-1000'].count++;
          else paymentRanges['1000+'].count++;
        });

        setPaymentDistribution(Object.entries(paymentRanges).map(([range, data]) => ({
          range: `${data.label} ($${range})`,
          count: data.count,
          percentage: ((data.count / patients.length) * 100).toFixed(1)
        })));
      } catch (error) {
        console.error('Error processing dashboard data:', error);
      }
    };

    processData();
  }, []);

  const COLORS = ['#6366f1', '#8b5cf6', '#d946ef', '#f43f5e'];
  const HOVER_COLORS = ['#4f46e5', '#7c3aed', '#c026d3', '#e11d48'];

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-4 rounded-lg shadow-lg border border-gray-200">
          <p className="font-medium text-gray-900">{label}</p>
          {payload.map((entry, index) => (
            <p key={index} className="text-sm" style={{ color: entry.color }}>
              {entry.name}: {typeof entry.value === 'number' ? entry.value.toLocaleString() : entry.value}
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  return (
    <div>
      <Navbar />
      <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto space-y-8">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div>
              <h1 className="text-4xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                Practice Analytics
              </h1>
              <p className="text-gray-600 mt-2">Real-time insights into your dental practice</p>
            </div>
            <div className="flex items-center gap-2 bg-white p-2 rounded-lg shadow-sm">
              <TrendingUp className="w-5 h-5 text-green-500" />
              <span className="text-sm font-medium text-gray-700">Growth Rate:</span>
              <span className="text-sm font-bold text-green-500">{stats.growthRate}%</span>
            </div>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              {
                title: "Total Patients",
                value: stats.totalPatients,
                icon: Users,
                color: "indigo",
                trend: "+12%"
              },
              {
                title: "New Patients",
                value: stats.newPatients,
                icon: UserPlus,
                color: "purple",
                trend: "+8%"
              },
              {
                title: "Total Revenue",
                value: `$${stats.totalRevenue.toLocaleString()}`,
                icon: DollarSign,
                color: "green",
                trend: "+15%"
              },
              {
                title: "Avg. Payment",
                value: `$${stats.averagePayment.toLocaleString(undefined, {minimumFractionDigits: 2})}`,
                icon: Calendar,
                color: "rose",
                trend: "+5%"
              }
            ].map((stat, index) => (
              <div key={index} className="bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow duration-300 p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-500">{stat.title}</p>
                    <p className="text-2xl font-bold text-gray-900 mt-1">{stat.value}</p>
                  </div>
                  <div className="p-3 bg-gray-50 rounded-lg">
                    <stat.icon className="w-6 h-6 text-gray-500" />
                  </div>
                </div>
                <div className="mt-4 flex items-center">
                  <span className="text-sm font-medium text-green-500">{stat.trend}</span>
                  <span className="text-sm text-gray-500 ml-2">vs last month</span>
                </div>
              </div>
            ))}
          </div>

          {/* Charts */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Monthly Trends */}
            <div className="bg-white rounded-xl shadow-sm p-6 hover:shadow-md transition-shadow duration-300">
              <h3 className="text-lg font-semibold text-gray-900 mb-6">Patient Trends</h3>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={monthlyData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                    <XAxis dataKey="month" stroke="#6b7280" />
                    <YAxis stroke="#6b7280" />
                    <Tooltip content={<CustomTooltip />} />
                    <Legend />
                    <Line 
                      type="monotone" 
                      dataKey="patients" 
                      stroke="#6366f1" 
                      strokeWidth={2}
                      dot={{ r: 4, strokeWidth: 2 }}
                      activeDot={{ r: 6, strokeWidth: 2 }}
                    />
                    <Line 
                      type="monotone" 
                      dataKey="newPatients" 
                      stroke="#8b5cf6" 
                      strokeWidth={2}
                      dot={{ r: 4, strokeWidth: 2 }}
                      activeDot={{ r: 6, strokeWidth: 2 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Revenue Chart */}
            <div className="bg-white rounded-xl shadow-sm p-6 hover:shadow-md transition-shadow duration-300">
              <h3 className="text-lg font-semibold text-gray-900 mb-6">Revenue Analysis</h3>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={monthlyData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                    <XAxis dataKey="month" stroke="#6b7280" />
                    <YAxis stroke="#6b7280" />
                    <Tooltip content={<CustomTooltip />} />
                    <Legend />
                    <Bar 
                      dataKey="revenue" 
                      fill="#8b5cf6"
                      radius={[4, 4, 0, 0]}
                    />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Age Distribution */}
            <div className="bg-white rounded-xl shadow-sm p-6 hover:shadow-md transition-shadow duration-300">
              <h3 className="text-lg font-semibold text-gray-900 mb-6">Age Demographics</h3>
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
                    >
                      {ageDistribution.map((entry, index) => (
                        <Cell 
                          key={`cell-${index}`} 
                          fill={COLORS[index % COLORS.length]}
                        />
                      ))}
                    </Pie>
                    <Tooltip />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Payment Distribution */}
            <div className="bg-white rounded-xl shadow-sm p-6 hover:shadow-md transition-shadow duration-300">
              <h3 className="text-lg font-semibold text-gray-900 mb-6">Payment Analysis</h3>
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
                    >
                      {paymentDistribution.map((entry, index) => (
                        <Cell 
                          key={`cell-${index}`} 
                          fill={COLORS[index % COLORS.length]}
                        />
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
};

export default Dashboard;

