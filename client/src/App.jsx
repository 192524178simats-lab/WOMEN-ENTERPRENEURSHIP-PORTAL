import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { ToastProvider } from './context/ToastContext';
import { NotificationProvider } from './context/NotificationContext';

import { Navbar } from './components/Navbar';
import { Sidebar } from './components/Sidebar';
import { Footer } from './components/Footer';
import { ProtectedRoute } from './components/ProtectedRoute';

// Public Pages
import { LandingPage } from './pages/LandingPage';
import { AboutPage } from './pages/AboutPage';
import { PublicSchemes } from './pages/PublicSchemes';
import { PublicFunding } from './pages/PublicFunding';
import { PublicTraining } from './pages/PublicTraining';
import { PublicEvents } from './pages/PublicEvents';
import { LoginPage } from './pages/LoginPage';
import { RegisterPage } from './pages/RegisterPage';
import { UnauthorizedPage } from './pages/UnauthorizedPage';
import { NotFoundPage } from './pages/NotFoundPage';

// Entrepreneur Pages
import { EntrepreneurDashboard } from './pages/entrepreneur/EntrepreneurDashboard';
import { ProfilePage } from './pages/entrepreneur/ProfilePage';
import { BusinessProfilePage } from './pages/entrepreneur/BusinessProfilePage';
import { EntrepreneurSchemes } from './pages/entrepreneur/EntrepreneurSchemes';
import { EntrepreneurFunding } from './pages/entrepreneur/EntrepreneurFunding';
import { MyApplicationsPage } from './pages/entrepreneur/MyApplicationsPage';
import { TrainingProgramsPage } from './pages/entrepreneur/TrainingProgramsPage';
import { MyTrainingPage } from './pages/entrepreneur/MyTrainingPage';
import { MentorDirectoryPage } from './pages/entrepreneur/MentorDirectoryPage';
import { MyMentorshipRequestsPage } from './pages/entrepreneur/MyMentorshipRequestsPage';
import { NetworkingEventsPage } from './pages/entrepreneur/NetworkingEventsPage';
import { MyEventsPage } from './pages/entrepreneur/MyEventsPage';
import { AnnouncementsPage } from './pages/entrepreneur/AnnouncementsPage';

// Government Officer Pages
import { OfficerDashboard } from './pages/officer/OfficerDashboard';
import { EntrepreneurManagementPage } from './pages/officer/EntrepreneurManagementPage';
import { SchemeManagementPage } from './pages/officer/SchemeManagementPage';
import { FundingManagementPage } from './pages/officer/FundingManagementPage';
import { ApplicationManagementPage } from './pages/officer/ApplicationManagementPage';
import { TrainingManagementPage } from './pages/officer/TrainingManagementPage';
import { MentorManagementPage } from './pages/officer/MentorManagementPage';
import { NetworkingManagementPage } from './pages/officer/NetworkingManagementPage';
import { AnnouncementManagementPage } from './pages/officer/AnnouncementManagementPage';
import { ReportsPage } from './pages/officer/ReportsPage';
import { UserManagementPage } from './pages/officer/UserManagementPage';

// Mentor Pages
import { MentorDashboard } from './pages/mentor/MentorDashboard';
import { MentorProfilePage } from './pages/mentor/MentorProfilePage';
import { MentorshipRequestsPage } from './pages/mentor/MentorshipRequestsPage';
import { MentoredEntrepreneursPage } from './pages/mentor/MentoredEntrepreneursPage';
import { MentoringSessionsPage } from './pages/mentor/MentoringSessionsPage';

export function App() {
  return (
    <AuthProvider>
      <ToastProvider>
        <NotificationProvider>
          <BrowserRouter>
            <div className="app-container">
              <Navbar />
              <div className="main-layout">
                <Sidebar />
                <main className="main-content">
                  <Routes>
                    {/* Public Routes */}
                    <Route path="/" element={<LandingPage />} />
                    <Route path="/about" element={<AboutPage />} />
                    <Route path="/public-schemes" element={<PublicSchemes />} />
                    <Route path="/public-funding" element={<PublicFunding />} />
                    <Route path="/public-training" element={<PublicTraining />} />
                    <Route path="/public-events" element={<PublicEvents />} />
                    <Route path="/login" element={<LoginPage />} />
                    <Route path="/register" element={<RegisterPage />} />
                    <Route path="/unauthorized" element={<UnauthorizedPage />} />

                    {/* Entrepreneur Protected Routes */}
                    <Route element={<ProtectedRoute allowedRoles={['entrepreneur']} />}>
                      <Route path="/entrepreneur/dashboard" element={<EntrepreneurDashboard />} />
                      <Route path="/entrepreneur/profile" element={<ProfilePage />} />
                      <Route path="/entrepreneur/business" element={<BusinessProfilePage />} />
                      <Route path="/entrepreneur/schemes" element={<EntrepreneurSchemes />} />
                      <Route path="/entrepreneur/funding" element={<EntrepreneurFunding />} />
                      <Route path="/entrepreneur/applications" element={<MyApplicationsPage />} />
                      <Route path="/entrepreneur/training" element={<TrainingProgramsPage />} />
                      <Route path="/entrepreneur/my-training" element={<MyTrainingPage />} />
                      <Route path="/entrepreneur/mentors" element={<MentorDirectoryPage />} />
                      <Route path="/entrepreneur/mentorship-requests" element={<MyMentorshipRequestsPage />} />
                      <Route path="/entrepreneur/networking" element={<NetworkingEventsPage />} />
                      <Route path="/entrepreneur/my-events" element={<MyEventsPage />} />
                      <Route path="/entrepreneur/announcements" element={<AnnouncementsPage />} />
                    </Route>

                    {/* Officer Protected Routes */}
                    <Route element={<ProtectedRoute allowedRoles={['officer']} />}>
                      <Route path="/officer/dashboard" element={<OfficerDashboard />} />
                      <Route path="/officer/entrepreneurs" element={<EntrepreneurManagementPage />} />
                      <Route path="/officer/schemes" element={<SchemeManagementPage />} />
                      <Route path="/officer/funding" element={<FundingManagementPage />} />
                      <Route path="/officer/applications" element={<ApplicationManagementPage />} />
                      <Route path="/officer/training" element={<TrainingManagementPage />} />
                      <Route path="/officer/mentors" element={<MentorManagementPage />} />
                      <Route path="/officer/networking" element={<NetworkingManagementPage />} />
                      <Route path="/officer/announcements" element={<AnnouncementManagementPage />} />
                      <Route path="/officer/reports" element={<ReportsPage />} />
                      <Route path="/officer/users" element={<UserManagementPage />} />
                    </Route>

                    {/* Mentor Protected Routes */}
                    <Route element={<ProtectedRoute allowedRoles={['mentor']} />}>
                      <Route path="/mentor/dashboard" element={<MentorDashboard />} />
                      <Route path="/mentor/profile" element={<MentorProfilePage />} />
                      <Route path="/mentor/requests" element={<MentorshipRequestsPage />} />
                      <Route path="/mentor/entrepreneurs" element={<MentoredEntrepreneursPage />} />
                      <Route path="/mentor/sessions" element={<MentoringSessionsPage />} />
                    </Route>

                    {/* Fallback 404 Route */}
                    <Route path="*" element={<NotFoundPage />} />
                  </Routes>
                </main>
              </div>
              <Footer />
            </div>
          </BrowserRouter>
        </NotificationProvider>
      </ToastProvider>
    </AuthProvider>
  );
}

export default App;
