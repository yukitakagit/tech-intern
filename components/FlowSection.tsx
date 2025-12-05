
import React from 'react';
import { Search, UserCheck, MessageSquare, Rocket } from 'lucide-react';

interface FlowSectionProps {
    onNavigateRegister: () => void;
    isLoggedIn: boolean;
}

const STEPS = [
  {
    id: 1,
    title: '検索・応募',
    desc: '気になる企業を探してエントリー',
    icon: <Search size={24} />,
  },
  {
    id: 2,
    title: 'プロフィール連携',
    desc: 'GitHubやスキルシートを自動連携',
    icon: <UserCheck size={24} />,
  },
  {
    id: 3,
    title: '面談・選考',
    desc: '企業とチャットやオンライン面談',
    icon: <MessageSquare size={24} />,
  },
  {
    id: 4,
    title: 'インターン開始',
    desc: 'プロジェクトに参加して開発開始！',
    icon: <Rocket size={24} />,
  },
];

export const FlowSection: React.FC<FlowSectionProps> = ({ onNavigateRegister, isLoggedIn }) => {
  return (
    <section className="py-20 border-t border-gray-200 bg-white relative">
      {/* Background Decor */}
      <div className="absolute top-0 right-0 w-1/3 h-full bg-gray-50/50 -skew-x-12 transform translate-x-20"></div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-black text-gray-900 tracking-tight uppercase">How to Start</h2>
          <p className="text-xs font-bold text-gray-500 mt-2 tracking-widest">
            長期インターンの始め方・選考フロー
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 relative">
          {/* Connector Line (Desktop) */}
          <div className="hidden md:block absolute top-12 left-0 w-full h-0.5 bg-gray-200 -z-10"></div>

          {STEPS.map((step, index) => (
            <div key={step.id} className="flex flex-col items-center text-center group">
              <div className="w-24 h-24 bg-white border-2 border-gray-900 rounded-sm flex items-center justify-center mb-6 relative transition-transform duration-300 group-hover:-translate-y-2 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
                <span className="absolute -top-3 -left-3 bg-black text-white text-xs font-black w-6 h-6 flex items-center justify-center rounded-sm">
                  {step.id}
                </span>
                <div className="text-gray-900">
                  {step.icon}
                </div>
              </div>
              <h3 className="text-lg font-black text-gray-900 mb-2">{step.title}</h3>
              <p className="text-xs font-medium text-gray-500 leading-relaxed max-w-[140px]">
                {step.desc}
              </p>
            </div>
          ))}
        </div>

        {!isLoggedIn && (
          <div className="mt-16 text-center">
            <button 
              onClick={onNavigateRegister}
              className="bg-black text-white text-sm font-bold px-8 py-4 rounded-sm hover:bg-gray-800 transition-colors shadow-lg"
            >
               会員登録してスタートする
            </button>
          </div>
        )}
      </div>
    </section>
  );
};
