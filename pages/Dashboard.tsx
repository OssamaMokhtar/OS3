import React from 'react';
import { 
  Radar, 
  RadarChart, 
  PolarGrid, 
  PolarAngleAxis, 
  PolarRadiusAxis, 
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Cell
} from 'recharts';
import { UserProfile, AssessmentResult } from '../types';
import { ArrowUpRight, Award, Target, Brain } from 'lucide-react';
import { Button } from '../components/ui/Button';

interface DashboardProps {
  user: UserProfile;
  assessment?: AssessmentResult;
  onNavigate: (route: any) => void;
}

export const Dashboard: React.FC<DashboardProps> = ({ user, assessment, onNavigate }) => {
  
  // Transform skills for Radar Chart
  const skillData = user.skills.slice(0, 6).map(s => ({
    subject: s.name,
    A: s.level,
    fullMark: 100
  }));

  const StatsCard = ({ title, value, subtitle, icon: Icon, color }: any) => (
    <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 relative overflow-hidden group hover:border-slate-700 transition-all">
      <div className={`absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity ${color}`}>
        <Icon className="w-16 h-16" />
      </div>
      <div className="relative z-10">
        <p className="text-slate-400 text-sm font-medium mb-1">{title}</p>
        <h3 className="text-3xl font-bold text-white mb-2">{value}</h3>
        <p className="text-xs text-slate-500 flex items-center">
          {subtitle}
        </p>
      </div>
    </div>
  );

  return (
    <div className="space-y-8 animate-fade-in">
      <div>
        <h2 className="text-2xl font-bold text-white">Welcome back, {user.name}</h2>
        <p className="text-slate-400">Here is your daily career intelligence briefing.</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatsCard 
          title="Career Score" 
          value={assessment ? Math.round((assessment.totalScore + (user.experienceYears * 5)) / 2) : "N/A"} 
          subtitle="Based on IQ & Experience"
          icon={Target}
          color="text-emerald-500"
        />
        <StatsCard 
          title="IQ Percentile" 
          value={assessment ? `${Math.min(99, Math.round(assessment.totalScore / 1.5))}%` : "Pending"} 
          subtitle={assessment ? "Top 10% of cohort" : "Take test to see"}
          icon={Brain}
          color="text-purple-500"
        />
        <StatsCard 
          title="Skills Verified" 
          value={user.skills.length} 
          subtitle="From latest CV scan"
          icon={Award}
          color="text-blue-500"
        />
        <StatsCard 
          title="Market Readiness" 
          value="High" 
          subtitle="+12% vs last month"
          icon={TrendingUp}
          color="text-orange-500"
        />
      </div>

      {/* Main Charts Area */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Radar Chart: Skill Balance */}
        <div className="lg:col-span-2 bg-slate-900 border border-slate-800 rounded-xl p-6">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-lg font-semibold">Skill & Cognitive Profile</h3>
            <Button variant="outline" size="sm" onClick={() => onNavigate('resume')}>Update CV</Button>
          </div>
          <div className="h-80 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <RadarChart cx="50%" cy="50%" outerRadius="80%" data={skillData}>
                <PolarGrid stroke="#334155" />
                <PolarAngleAxis dataKey="subject" tick={{ fill: '#94a3b8', fontSize: 12 }} />
                <PolarRadiusAxis angle={30} domain={[0, 100]} stroke="#475569" />
                <Radar
                  name={user.name}
                  dataKey="A"
                  stroke="#0ea5e9"
                  strokeWidth={2}
                  fill="#0ea5e9"
                  fillOpacity={0.3}
                />
                <Tooltip 
                   contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', color: '#f8fafc' }}
                />
              </RadarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Action Items */}
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 flex flex-col">
          <h3 className="text-lg font-semibold mb-6">Priority Actions</h3>
          
          <div className="flex-1 space-y-4">
            {!assessment && (
              <div className="p-4 rounded-lg bg-purple-900/20 border border-purple-500/30">
                <div className="flex justify-between items-start mb-2">
                  <h4 className="font-medium text-purple-200">Take Cognitive Assessment</h4>
                  <span className="bg-purple-500/20 text-purple-300 text-[10px] px-2 py-0.5 rounded uppercase">Urgent</span>
                </div>
                <p className="text-xs text-purple-300/70 mb-3">
                  Establish your baseline logical and verbal reasoning score to unlock job matching.
                </p>
                <Button variant="primary" className="w-full text-sm py-1.5" onClick={() => onNavigate('assessment')}>
                  Start Test (15m)
                </Button>
              </div>
            )}

            <div className="p-4 rounded-lg bg-slate-800/50 border border-slate-700">
               <div className="flex justify-between items-start mb-2">
                  <h4 className="font-medium text-slate-200">Review Market Trends</h4>
                  <span className="bg-slate-700 text-slate-400 text-[10px] px-2 py-0.5 rounded uppercase">Weekly</span>
                </div>
                <p className="text-xs text-slate-500 mb-3">
                  New demand data available for "{user.role}".
                </p>
                <Button variant="outline" className="w-full text-sm py-1.5" onClick={() => onNavigate('market')}>
                  View Insights
                </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Icon import helper
import { TrendingUp } from 'lucide-react';