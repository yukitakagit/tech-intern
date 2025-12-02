import React, { useState } from 'react';
import { Plus, Minus } from 'lucide-react';

const FAQS = [
  {
    q: 'プログラミング未経験でも応募できますか？',
    a: 'はい、一部の企業では未経験者向けの研修プログラムを用意したインターン募集を行っています。ただし、Tech internでは事前にProgateやドットインストール、または独学での基礎学習を済ませておくことを推奨しています。',
  },
  {
    q: '大学の授業と両立は可能ですか？',
    a: '多くの企業が学生のスケジュールに配慮しています。「週2日〜」「土日OK」「夕方から」など、柔軟なシフトの企業も多数あります。検索フィルターで「土日勤務OK」などを選択して探してみてください。',
  },
  {
    q: '給与は支払われますか？',
    a: 'Tech internに掲載されている全ての長期インターンシップは有給です。時給制が一般的ですが、成果報酬型の案件もあります。詳細は各求人票をご確認ください。',
  },
  {
    q: 'リモートワークは可能ですか？',
    a: 'はい、フルリモート可能な求人も多数掲載しています。特にWeb系・IT系の企業では、SlackやZoomを用いたリモート開発体制が整っていることが多いです。',
  },
  {
    q: '選考にはどれくらいの期間がかかりますか？',
    a: '平均して2週間〜1ヶ月程度です。GitHub連携をしておくと、技術スキルの証明がスムーズになり、書類選考の通過率が上がったり、選考期間が短縮される傾向にあります。',
  },
];

export const FaqSection: React.FC = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const toggle = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section className="py-20 bg-gray-50 border-t border-gray-200">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-black text-gray-900 tracking-tight uppercase">FAQ</h2>
          <p className="text-xs font-bold text-gray-500 mt-2 tracking-widest">
            よくある質問
          </p>
        </div>

        <div className="space-y-4">
          {FAQS.map((faq, index) => (
            <div key={index} className="bg-white border border-gray-200 rounded-sm overflow-hidden">
              <button
                onClick={() => toggle(index)}
                className="w-full flex items-center justify-between p-5 text-left bg-white hover:bg-gray-50 transition-colors"
              >
                <span className="font-bold text-sm md:text-base text-gray-900 pr-8">
                  <span className="text-blue-600 mr-3 font-black">Q.</span>
                  {faq.q}
                </span>
                <span className="flex-shrink-0 text-gray-400">
                  {openIndex === index ? <Minus size={20} /> : <Plus size={20} />}
                </span>
              </button>
              
              <div 
                className={`transition-all duration-300 ease-in-out overflow-hidden ${
                  openIndex === index ? 'max-h-40 opacity-100' : 'max-h-0 opacity-0'
                }`}
              >
                <div className="p-5 pt-0 text-sm text-gray-600 font-medium leading-relaxed bg-white">
                  <span className="text-gray-900 mr-3 font-black">A.</span>
                  {faq.a}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};