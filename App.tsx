import React, { useState, useEffect } from 'react';
import { Layout } from './components/Layout';
import { Dashboard } from './pages/Dashboard';
import { Assessment } from './pages/Assessment';
import { CareerParser } from './pages/CareerParser';
import { Market } from './pages/Market';
import { Settings as SettingsPage } from './pages/Settings';
import { AppRoute, UserProfile, AssessmentResult, Skill } from './types';

// Initial Mock State
const INITIAL_USER: UserProfile = {
  name: "Alex Dev",
  role: "Software Engineer",
  experienceYears: 5,
  goals: ["Become Tech Lead", "Master AI Engineering"],
  skills: [
    { name: "React", level: 90, type: "hard" },
    { name: "TypeScript", level: 85, type: "hard" },
    { name: "Node.js", level: 75, type: "hard" },
    { name: "Communication", level: 60, type: "soft" }
  ]
};

const App: React.FC = () => {
  const [route, setRoute] = useState<AppRoute>(AppRoute.DASHBOARD);
  const [user, setUser] = useState<UserProfile>(INITIAL_USER);
  const [assessment, setAssessment] = useState<AssessmentResult | undefined>();
  
  // Simple "Auth" check (skip login screen for demo efficiency, simulate logged in)
  useEffect(() => {
    // In a real app, verify token here
  }, []);

  const handleNavigate = (newRoute: AppRoute) => {
    setRoute(newRoute);
  };

  const handleAssessmentComplete = (result: AssessmentResult) => {
    setAssessment(result);
    // Update user profile with score (mock persistence)
    setUser(prev => ({ ...prev, iqScore: result.totalScore }));
    setRoute(AppRoute.DASHBOARD);
  };

  const handleResumeData = (data: { skills: Skill[], role: string, exp: number }) => {
    setUser(prev => ({
      ...prev,
      role: data.role,
      experienceYears: data.exp,
      skills: [...prev.skills, ...data.skills] // simplistic merge
    }));
    setRoute(AppRoute.DASHBOARD);
  };

  const handleProfileUpdate = (updatedUser: UserProfile) => {
    setUser(updatedUser);
  };

  const renderContent = () => {
    switch (route) {
      case AppRoute.DASHBOARD:
        return <Dashboard user={user} assessment={assessment} onNavigate={handleNavigate} />;
      case AppRoute.ASSESSMENT:
        return <Assessment onComplete={handleAssessmentComplete} />;
      case AppRoute.RESUME:
        return <CareerParser onDataParsed={handleResumeData} />;
      case AppRoute.MARKET:
        return <Market role={user.role} />;
      case AppRoute.SETTINGS:
        return <SettingsPage user={user} onSave={handleProfileUpdate} />;
      default:
        return <Dashboard user={user} assessment={assessment} onNavigate={handleNavigate} />;
    }
  };

  return (
    <Layout 
      currentRoute={route} 
      onNavigate={handleNavigate}
      userName={user.name}
      userRole={user.role}
    >
      {renderContent()}
    </Layout>
  );
};

export default App;