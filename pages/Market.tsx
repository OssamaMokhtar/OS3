import React, { useEffect, useState } from 'react';
import { MarketTrend, Recommendation } from '../types';
import { getMarketInsights } from '../services/gemini';
import { Button } from '../components/ui/Button';
import { TrendingUp, BookOpen, ArrowUp } from 'lucide-react';

interface MarketProps {
  role: string;
}

export const Market: React.FC<MarketProps> = ({ role }) => {
  const [trends, setTrends] = useState<MarketTrend[]>([]);
  const [recs, setRecs] = useState<Recommendation[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      const data = await getMarketInsights(role);
      setTrends(data.trends || []);
      setRecs(data.recommendations || []);
      setLoading(false);
    };
    
    if (role) fetchData();
  }, [role]);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-96 space-y-4">
        <div className="w-12 h-12 border-4 border-primary-500 border-t-transparent rounded-full animate-spin"></div>
        <p className="text-slate-400">Scanning global market signals for {role}...</p>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-fade-in">
      <div className="flex justify-between items-end border-b border-slate-800 pb-6">
        <div>
          <h2 className="text-2xl font-bold text-white mb-2">Market Intelligence: {role}</h2>
          <p className="text-slate-400">Real-time demand signals and skill gap analysis.</p>
        </div>
        <Button variant="outline" size="sm">Refresh Data</Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Trends */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-green-500" />
            High Demand Skills
          </h3>
          <div className="space-y-3">
            {trends.map((t, i) => (
              <div key={i} className="bg-slate-900 border border-slate-800 p-4 rounded-lg flex justify-between items-center group hover:border-slate-700 transition-all">
                <div>
                  <h4 className="font-medium text-white">{t.skill}</h4>
                  <div className="flex items-center gap-2 mt-1">
                    <span className={`text-xs px-2 py-0.5 rounded ${
                      t.demand === 'High' ? 'bg-red-500/20 text-red-300' : 'bg-yellow-500/20 text-yellow-300'
                    }`}>
                      {t.demand} Demand
                    </span>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-green-400 font-bold flex items-center justify-end gap-1">
                    <ArrowUp className="w-3 h-3" />
                    {t.growth}%
                  </div>
                  <span className="text-xs text-slate-500">YoY Growth</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Recommendations */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold flex items-center gap-2">
            <BookOpen className="w-5 h-5 text-blue-500" />
            Recommended Actions
          </h3>
          <div className="space-y-3">
             {recs.map((r, i) => (
               <div key={i} className="bg-slate-900 border border-slate-800 p-4 rounded-lg hover:bg-slate-800 transition-colors cursor-pointer">
                 <div className="flex justify-between items-start mb-2">
                   <span className="text-xs text-primary-400 border border-primary-900 bg-primary-900/20 px-2 py-0.5 rounded">{r.type}</span>
                   <span className="text-xs text-slate-500">{r.duration}</span>
                 </div>
                 <h4 className="font-medium text-white mb-1">{r.title}</h4>
                 <p className="text-sm text-slate-400 mb-3">via {r.provider}</p>
                 <Button variant="secondary" className="w-full text-xs h-8">Enroll / Start</Button>
               </div>
             ))}
          </div>
        </div>
      </div>
    </div>
  );
};