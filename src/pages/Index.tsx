import React from 'react';
import { AppProvider } from '@/context/AppContext';
import { useAppContext } from '@/context/AppContext';
import Header from '@/components/Header';
import HeroSection from '@/components/HeroSection';
import MonasteryShowcase from '@/components/MonasteryShowcase';
import EnhancedCommunityHub from '@/components/EnhancedCommunityHub';
import DigitalArchive from '@/components/DigitalArchive';
import DigitalArchiveHub from '@/components/DigitalArchiveHub';
import BookingHub from '@/components/BookingHub';
import AdminLogin from '@/components/AdminLogin';
import AdminDashboard from '@/components/AdminDashboard';
import EnhancedAdminDashboard from '@/components/EnhancedAdminDashboard';
import ExperiencesHub from '@/components/ExperiencesHub';
import TourismHub from '@/components/TourismHub';
import AboutSikkim from '@/components/AboutSikkim';
import FoodSikkim from '@/components/FoodSikkim';
import DanceSikkim from '@/components/DanceSikkim';
import JewelSikkim from '@/components/JewelSikkim';
import LanguageSikkim from '@/components/LanguageSikkim';
import InstrumentSikkim from '@/components/InstrumentSikkim';
import Footer from '@/components/Footer';

const AppContent: React.FC = () => {
  const { state } = useAppContext();

  const renderCurrentView = () => {
    switch (state.currentView) {
      case 'about-sikkim':
        return <AboutSikkim />;
      case 'foods':
        return <FoodSikkim />;
      case 'dance':
        return <DanceSikkim />;
      case 'jewellery':
        return <JewelSikkim />;
      case 'languages':
        return <LanguageSikkim />;
      case 'instruments':
        return <InstrumentSikkim />;
      case 'experiences':
        return <ExperiencesHub />;
      case 'tourism':
        return <TourismHub />;
      case 'community':
        return <EnhancedCommunityHub />;
      case 'archive':
        return <DigitalArchiveHub />;
      case 'bookings':
        return <BookingHub />;
      case 'admin-login':
        return <AdminLogin />;
      case 'admin-dashboard':
        return <EnhancedAdminDashboard />;
      default:
        return (
          <>
            <HeroSection />
            <MonasteryShowcase />
          </>
        );
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main>
        {renderCurrentView()}
      </main>
      <Footer />
    </div>
  );
};

const Index: React.FC = () => {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
};

export default Index;
