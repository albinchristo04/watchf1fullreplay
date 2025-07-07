import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import Footer from './components/Footer';
import HomePage from './pages/HomePage';
import PlayerPage from './pages/PlayerPage';
import AboutPage from './pages/AboutPage';
import ArticlesPage from './pages/ArticlesPage';
import ArticlePage from './pages/ArticlePage';
import LoginPage from './pages/LoginPage';
import { AuthProvider } from './contexts/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';


// Admin Pages
import AdminLayout from './pages/admin/AdminLayout';
import DashboardPage from './pages/admin/DashboardPage';
import ManageReplaysPage from './pages/admin/ManageReplaysPage';
import ManageArticlesPage from './pages/admin/ManageArticlesPage';
import SettingsPage from './pages/admin/SettingsPage';


const App: React.FC = () => {
  return (
    <AuthProvider>
      <div className="min-h-screen font-sans flex flex-col">
        <Header />
        <main className="flex-grow">
          <Routes>
            {/* Public Routes */}
            <Route path="/" element={<HomePage />} />
            <Route path="/player/:id" element={<PlayerPage />} />
            <Route path="/articles" element={<ArticlesPage />} />
            <Route path="/articles/:slug" element={<ArticlePage />} />
            <Route path="/about" element={<AboutPage />} />
            <Route path="/login" element={<LoginPage />} />
            
            {/* Admin Routes */}
            <Route path="/admin" element={<ProtectedRoute><AdminLayout /></ProtectedRoute>}>
              <Route path="dashboard" element={<DashboardPage />} />
              <Route path="replays" element={<ManageReplaysPage />} />
              <Route path="articles" element={<ManageArticlesPage />} />
              <Route path="settings" element={<SettingsPage />} />
            </Route>
          </Routes>
        </main>
        <Footer />
      </div>
    </AuthProvider>
  );
};

export default App;