import React, { useState, useEffect } from 'react';
import { Question, AssessmentResult } from '../types';
import { Button } from '../components/ui/Button';
import { CheckCircle2, Timer, AlertCircle } from 'lucide-react';

const MOCK_QUESTIONS: Question[] = [
  { id: 1, domain: 'Logic', text: 'If All A are B, and some B are C, which of the following MUST be true?', options: ['All A are C', 'Some A are C', 'Some C are B', 'No A are C'], correctIndex: 2 },
  { id: 2, domain: 'Pattern', text: '2, 4, 8, 16, ... What comes next?', options: ['24', '30', '32', '64'], correctIndex: 2 },
  { id: 3, domain: 'Verbal', text: 'Which word is the odd one out?', options: ['Apple', 'Banana', 'Carrot', 'Grape'], correctIndex: 2 },
  { id: 4, domain: 'Math', text: 'If a shirt costs $20 after a 20% discount, what was the original price?', options: ['$22', '$24', '$25', '$30'], correctIndex: 2 },
  { id: 5, domain: 'Logic', text: 'A is taller than B. C is shorter than B. Who is the tallest?', options: ['A', 'B', 'C', 'Impossible to tell'], correctIndex: 0 },
];

interface AssessmentProps {
  onComplete: (result: AssessmentResult) => void;
}

export const Assessment: React.FC<AssessmentProps> = ({ onComplete }) => {
  const [started, setStarted] = useState(false);
  const [currentQIndex, setCurrentQIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<number, number>>({});
  const [timeLeft, setTimeLeft] = useState(300); // 5 minutes
  const [finished, setFinished] = useState(false);

  useEffect(() => {
    if (started && !finished && timeLeft > 0) {
      const timer = setInterval(() => setTimeLeft(prev => prev - 1), 1000);
      return () => clearInterval(timer);
    } else if (timeLeft === 0 && !finished) {
      handleSubmit();
    }
  }, [started, finished, timeLeft]);

  const handleStart = () => setStarted(true);

  const handleSelect = (idx: number) => {
    setAnswers(prev => ({ ...prev, [MOCK_QUESTIONS[currentQIndex].id]: idx }));
  };

  const handleNext = () => {
    if (currentQIndex < MOCK_QUESTIONS.length - 1) {
      setCurrentQIndex(prev => prev + 1);
    } else {
      handleSubmit();
    }
  };

  const handleSubmit = () => {
    setFinished(true);
    let score = 0;
    const breakdown: Record<string, number> = {};

    MOCK_QUESTIONS.forEach(q => {
      const isCorrect = answers[q.id] === q.correctIndex;
      if (isCorrect) score += 20; // 5 questions * 20 = 100
      
      if (!breakdown[q.domain]) breakdown[q.domain] = 0;
      if (isCorrect) breakdown[q.domain] += 1;
    });

    const result: AssessmentResult = {
      totalScore: score,
      breakdown,
      completedAt: new Date().toISOString()
    };

    setTimeout(() => onComplete(result), 2000); // Delay to show completion screen
  };

  const formatTime = (sec: number) => {
    const m = Math.floor(sec / 60);
    const s = sec % 60;
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  };

  if (!started) {
    return (
      <div className="flex flex-col items-center justify-center h-full max-w-2xl mx-auto text-center space-y-6">
        <div className="bg-primary-900/20 p-6 rounded-full text-primary-400">
           <Brain size={64} />
        </div>
        <h2 className="text-3xl font-bold">Cognitive Capabilities Assessment</h2>
        <p className="text-slate-400 text-lg">
          This 5-minute adaptive test evaluates Logic, Verbal reasoning, and Pattern recognition. 
          Results are private and used to match you with suitable career opportunities.
        </p>
        <div className="grid grid-cols-3 gap-4 w-full max-w-md mt-8">
           <div className="bg-slate-900 p-4 rounded-lg border border-slate-800">
              <span className="block text-2xl font-bold text-white">5</span>
              <span className="text-xs text-slate-500 uppercase">Questions</span>
           </div>
           <div className="bg-slate-900 p-4 rounded-lg border border-slate-800">
              <span className="block text-2xl font-bold text-white">5m</span>
              <span className="text-xs text-slate-500 uppercase">Time Limit</span>
           </div>
           <div className="bg-slate-900 p-4 rounded-lg border border-slate-800">
              <span className="block text-2xl font-bold text-white">4</span>
              <span className="text-xs text-slate-500 uppercase">Domains</span>
           </div>
        </div>
        <Button onClick={handleStart} className="w-48 mt-8">Start Assessment</Button>
      </div>
    );
  }

  if (finished) {
    return (
      <div className="flex flex-col items-center justify-center h-full text-center animate-in fade-in zoom-in duration-500">
        <CheckCircle2 className="w-20 h-20 text-green-500 mb-6" />
        <h2 className="text-2xl font-bold">Assessment Complete</h2>
        <p className="text-slate-400 mb-8">Calculating your detailed profile score...</p>
        <div className="w-64 h-2 bg-slate-800 rounded-full overflow-hidden">
          <div className="h-full bg-green-500 animate-pulse w-full"></div>
        </div>
      </div>
    );
  }

  const currentQ = MOCK_QUESTIONS[currentQIndex];

  return (
    <div className="max-w-3xl mx-auto">
      {/* Header */}
      <div className="flex justify-between items-center mb-8 bg-slate-900 p-4 rounded-lg border border-slate-800">
        <div className="flex items-center space-x-2 text-slate-300">
          <span className="font-mono text-xl font-bold">{currentQIndex + 1}</span>
          <span className="text-slate-600">/ {MOCK_QUESTIONS.length}</span>
        </div>
        <div className={`flex items-center space-x-2 font-mono ${timeLeft < 60 ? 'text-red-500' : 'text-primary-400'}`}>
          <Timer className="w-4 h-4" />
          <span>{formatTime(timeLeft)}</span>
        </div>
      </div>

      {/* Question Card */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-8 mb-8">
        <div className="mb-6">
           <span className="text-xs font-bold tracking-wider text-slate-500 uppercase mb-2 block">{currentQ.domain}</span>
           <h3 className="text-xl font-medium text-white">{currentQ.text}</h3>
        </div>

        <div className="space-y-3">
          {currentQ.options.map((opt, idx) => (
            <button
              key={idx}
              onClick={() => handleSelect(idx)}
              className={`w-full text-left p-4 rounded-lg border transition-all ${
                answers[currentQ.id] === idx
                  ? 'bg-primary-600/20 border-primary-500 text-white'
                  : 'bg-slate-950 border-slate-800 text-slate-300 hover:bg-slate-800'
              }`}
            >
              <div className="flex items-center">
                <div className={`w-5 h-5 rounded-full border mr-3 flex items-center justify-center ${
                  answers[currentQ.id] === idx ? 'border-primary-500 bg-primary-500' : 'border-slate-600'
                }`}>
                  {answers[currentQ.id] === idx && <div className="w-2 h-2 bg-white rounded-full" />}
                </div>
                {opt}
              </div>
            </button>
          ))}
        </div>
      </div>

      <div className="flex justify-end">
        <Button 
          onClick={handleNext} 
          disabled={answers[currentQ.id] === undefined}
          className="w-32"
        >
          {currentQIndex === MOCK_QUESTIONS.length - 1 ? 'Submit' : 'Next'}
        </Button>
      </div>
    </div>
  );
};

import { Brain } from 'lucide-react';