// Home.tsx
'use client';
import { Suspense, useState } from 'react';
// import Navbar from './components/navbar';
import Dashboard from './dashboard/page';
import AddPatient from './form/page';
import PatientsPage from './list/page';

export default function Home() {
  const [currentPage, setCurrentPage] = useState('dashboard');

  const handleNavigate = (page) => {
    setCurrentPage(page);
  };

  const renderPage = () => {
    switch (currentPage) {
      case 'dashboard':
        return <Dashboard />;
      case 'add-patient':
        return <AddPatient />;
      case 'patient-list':
        return <PatientsPage />;
      default:
        return <Dashboard />;
    }
  };

  return (
    <div>
      {/* <Navbar onNavigate={handleNavigate} currentPage={currentPage} /> */}
      
      <div className="min-h-screen bg-gray-100">
        <main className="container mx-auto px-4 py-8">
          <Suspense fallback={<div>Loading...</div>}>
            {renderPage()}
          </Suspense>
        </main>
      </div>
    </div>
  );
}