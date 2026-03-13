import React, { useState } from 'react';
import { UserProfile, Skill } from '../types';
import { Button } from '../components/ui/Button';
import { Plus, X, Save, User, Target, Zap, Trash2, Award } from 'lucide-react';

interface SettingsProps {
  user: UserProfile;
  onSave: (user: UserProfile) => void;
}

export const Settings: React.FC<SettingsProps> = ({ user, onSave }) => {
  const [formData, setFormData] = useState<UserProfile>(user);
  const [newGoal, setNewGoal] = useState('');
  const [newSkill, setNewSkill] = useState<Skill>({
    name: '',
    level: 50,
    type: 'hard'
  });
  const [saved, setSaved] = useState(false);

  const handleChange = (field: keyof UserProfile, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    setSaved(false);
  };

  const handleAddGoal = () => {
    if (newGoal.trim()) {
      setFormData(prev => ({ ...prev, goals: [...prev.goals, newGoal.trim()] }));
      setNewGoal('');
      setSaved(false);
    }
  };

  const handleRemoveGoal = (index: number) => {
    setFormData(prev => ({ ...prev, goals: prev.goals.filter((_, i) => i !== index) }));
    setSaved(false);
  };

  const handleAddSkill = () => {
    if (newSkill.name.trim()) {
      setFormData(prev => ({ ...prev, skills: [...prev.skills, { ...newSkill }] }));
      setNewSkill({ name: '', level: 50, type: 'hard' }); // Reset to default
      setSaved(false);
    }
  };

  const handleRemoveSkill = (index: number) => {
    setFormData(prev => ({ ...prev, skills: prev.skills.filter((_, i) => i !== index) }));
    setSaved(false);
  };

  const handleSkillLevelChange = (index: number, newLevel: number) => {
    const updatedSkills = [...formData.skills];
    updatedSkills[index] = { ...updatedSkills[index], level: newLevel };
    setFormData(prev => ({ ...prev, skills: updatedSkills }));
    setSaved(false);
  };

  const handleSave = () => {
    onSave(formData);
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  const getProficiencyLabel = (val: number) => {
    if (val < 25) return 'Beginner';
    if (val < 50) return 'Junior';
    if (val < 75) return 'Intermediate';
    if (val < 90) return 'Advanced';
    return 'Expert';
  };

  const getProficiencyColor = (val: number) => {
    if (val < 40) return 'text-slate-400';
    if (val < 70) return 'text-blue-400';
    return 'text-purple-400';
  };

  const getProficiencyBadgeColor = (val: number) => {
    if (val < 40) return 'bg-slate-500/20 text-slate-300';
    if (val < 70) return 'bg-blue-500/20 text-blue-300';
    return 'bg-purple-500/20 text-purple-300';
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 pb-12 animate-fade-in">
      <div className="flex justify-between items-end">
        <div>
          <h2 className="text-2xl font-bold text-white mb-2">Profile & Settings</h2>
          <p className="text-slate-400">Customize your career profile and fine-tune your skill inventory.</p>
        </div>
        {saved && (
           <div className="bg-green-500/10 border border-green-500/20 text-green-400 px-4 py-2 rounded-lg text-sm font-medium animate-in fade-in slide-in-from-bottom-2">
             Profile Saved Successfully
           </div>
        )}
      </div>

      <div className="space-y-6">
        {/* Basic Info */}
        <section className="bg-slate-900 border border-slate-800 rounded-xl p-6 shadow-sm">
          <h3 className="text-lg font-semibold text-white mb-6 flex items-center gap-2 border-b border-slate-800 pb-4">
            <User className="w-5 h-5 text-primary-500" />
            Personal Details
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-400">Full Name</label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => handleChange('name', e.target.value)}
                className="w-full bg-slate-950 border border-slate-700 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-primary-500 focus:ring-1 focus:ring-primary-500 transition-all"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-400">Current Role</label>
              <input
                type="text"
                value={formData.role}
                onChange={(e) => handleChange('role', e.target.value)}
                className="w-full bg-slate-950 border border-slate-700 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-primary-500 focus:ring-1 focus:ring-primary-500 transition-all"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-400">Years of Experience</label>
              <input
                type="number"
                min="0"
                value={formData.experienceYears}
                onChange={(e) => handleChange('experienceYears', parseInt(e.target.value) || 0)}
                className="w-full bg-slate-950 border border-slate-700 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-primary-500 focus:ring-1 focus:ring-primary-500 transition-all"
              />
            </div>
          </div>
        </section>

        {/* Goals */}
        <section className="bg-slate-900 border border-slate-800 rounded-xl p-6 shadow-sm">
          <h3 className="text-lg font-semibold text-white mb-6 flex items-center gap-2 border-b border-slate-800 pb-4">
            <Target className="w-5 h-5 text-red-500" />
            Career Goals
          </h3>
          <div className="space-y-3">
            {formData.goals.map((goal, idx) => (
              <div key={idx} className="flex items-center justify-between bg-slate-950 p-3 rounded-lg border border-slate-800 group hover:border-slate-700 transition-colors">
                <div className="flex items-center gap-3">
                   <div className="w-1.5 h-1.5 rounded-full bg-red-500"></div>
                   <span className="text-slate-200">{goal}</span>
                </div>
                <button 
                  onClick={() => handleRemoveGoal(idx)} 
                  className="text-slate-500 hover:text-red-400 opacity-0 group-hover:opacity-100 transition-opacity p-1"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            ))}
            <div className="flex gap-2 mt-4 pt-2">
              <input
                type="text"
                placeholder="E.g., Become a Senior Solution Architect..."
                value={newGoal}
                onChange={(e) => setNewGoal(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleAddGoal()}
                className="flex-1 bg-slate-950 border border-slate-700 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-primary-500 placeholder:text-slate-600"
              />
              <Button onClick={handleAddGoal} variant="secondary">
                <Plus className="w-4 h-4 mr-1" /> Add
              </Button>
            </div>
          </div>
        </section>

        {/* Skills */}
        <section className="bg-slate-900 border border-slate-800 rounded-xl p-6 shadow-sm">
          <h3 className="text-lg font-semibold text-white mb-6 flex items-center gap-2 border-b border-slate-800 pb-4">
            <Zap className="w-5 h-5 text-yellow-500" />
            Skills & Proficiency
          </h3>
          
          <div className="space-y-3 mb-8">
            {formData.skills.map((skill, idx) => (
              <div key={idx} className="flex items-center gap-4 bg-slate-950 p-4 rounded-lg border border-slate-800 group hover:border-slate-700 transition-all">
                <div className="p-2 bg-slate-900 rounded-md border border-slate-800">
                  <Award className={`w-5 h-5 ${skill.type === 'hard' ? 'text-blue-400' : 'text-purple-400'}`} />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex justify-between mb-2">
                    <span className="font-medium text-white truncate">{skill.name}</span>
                    <span className={`text-xs font-mono px-2 py-0.5 rounded ${getProficiencyBadgeColor(skill.level)}`}>
                      {getProficiencyLabel(skill.level)}: {skill.level}%
                    </span>
                  </div>
                  <div className="relative h-4 flex items-center">
                    <input
                      type="range"
                      min="0"
                      max="100"
                      step="5"
                      value={skill.level}
                      onChange={(e) => handleSkillLevelChange(idx, parseInt(e.target.value))}
                      className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-primary-500 hover:accent-primary-400 focus:outline-none focus:ring-2 focus:ring-primary-500/50"
                    />
                  </div>
                </div>
                <button 
                  onClick={() => handleRemoveSkill(idx)} 
                  className="text-slate-500 hover:text-red-400 p-2 opacity-0 group-hover:opacity-100 transition-opacity"
                  title="Remove Skill"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}
            
            {formData.skills.length === 0 && (
              <div className="text-center py-8 text-slate-500 bg-slate-950/50 rounded-lg border border-dashed border-slate-800">
                <p>No skills added yet. Add your core competencies below.</p>
              </div>
            )}
          </div>

          <div className="bg-slate-950 p-5 rounded-xl border border-slate-800 shadow-inner">
            <h4 className="text-sm font-bold text-slate-300 mb-4 uppercase tracking-wider text-[10px]">Add New Skill</h4>
            <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-end">
              <div className="md:col-span-4 space-y-1.5">
                <label className="text-xs text-slate-500">Skill Name</label>
                <input
                  type="text"
                  placeholder="e.g. React Native"
                  value={newSkill.name}
                  onChange={(e) => setNewSkill({...newSkill, name: e.target.value})}
                  className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-primary-500"
                />
              </div>
              <div className="md:col-span-3 space-y-1.5">
                 <label className="text-xs text-slate-500">Category</label>
                 <select
                   value={newSkill.type}
                   onChange={(e) => setNewSkill({...newSkill, type: e.target.value as 'hard' | 'soft'})}
                   className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-primary-500"
                 >
                   <option value="hard">Hard Skill</option>
                   <option value="soft">Soft Skill</option>
                 </select>
              </div>
              <div className="md:col-span-4 space-y-1.5">
                <div className="flex justify-between">
                   <label className="text-xs text-slate-500">Proficiency: <span className="text-primary-400">{getProficiencyLabel(newSkill.level)}</span></label>
                   <span className="text-xs text-slate-400">{newSkill.level}%</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="100"
                  step="5"
                  value={newSkill.level}
                  onChange={(e) => setNewSkill({...newSkill, level: parseInt(e.target.value)})}
                  className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-primary-500"
                />
              </div>
              <div className="md:col-span-1">
                <Button 
                  onClick={handleAddSkill} 
                  variant="secondary" 
                  disabled={!newSkill.name.trim()}
                  className="w-full h-[38px]"
                >
                  <Plus className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </div>
        </section>

        <div className="flex justify-end pt-6">
          <Button onClick={handleSave} size="lg" className="px-8 shadow-xl shadow-primary-900/20">
            <Save className="w-4 h-4 mr-2" />
            Save Profile
          </Button>
        </div>
      </div>
    </div>
  );
};