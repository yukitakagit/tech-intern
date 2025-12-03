import React from 'react';
import { ArrowRight, CheckCircle, Code, Users, Zap } from 'lucide-react';

interface CompanyLPProps {
  onNavigateLogin: () => void;
  onNavigateRegister: () => void;
}

export const CompanyLP: React.FC<CompanyLPProps> = ({ onNavigateLogin, onNavigateRegister }) => {
  return (
    <div className="min-h-screen bg-gray-900 text-white font-sans selection:bg-blue-500 selection:text-white">
      {/* Navbar for LP */}
      <nav className="absolute top-0 w-full z-50 border-b border-gray-800">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <div className="flex flex-col">
            <span className="text-2xl font-black tracking-tighter text-white">Tech intern</span>
            <span className="text-[10px] font-bold text-gray-400 tracking-widest uppercase -mt-1">
                Business
            </span>
          </div>
          <div className="flex gap-4">
            <button onClick={onNavigateLogin} className="text-sm font-bold text-gray-300 hover:text-white transition-colors">
              ログイン
            </button>
            <button 
                onClick={onNavigateRegister}
                className="bg-white text-black px-5 py-2 text-sm font-bold rounded-sm hover:bg-gray-200 transition-colors"
            >
              企業登録 (無料)
            </button>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative pt-32 pb-20 overflow-hidden">
        {/* Abstract Background */}
        <div className="absolute inset-0 bg-[radial-gradient(#4b5563_1px,transparent_1px)] [background-size:20px_20px] opacity-20"></div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-blue-500/10 rounded-full blur-3xl"></div>

        <div className="relative max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
                <h1 className="text-4xl md:text-6xl font-black leading-tight mb-6">
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-white">次世代のエンジニア</span>と<br/>
                    出会うための<br/>
                    新しいプラットフォーム
                </h1>
                <p className="text-gray-400 text-lg mb-8 leading-relaxed font-medium">
                    Tech internは、即戦力となる学生エンジニアと企業をマッチングします。
                    GitHub連携によるスキル可視化で、ミスマッチのない採用を実現。
                </p>
                <div className="flex flex-col sm:flex-row gap-4">
                    <button 
                        onClick={onNavigateRegister}
                        className="bg-blue-600 hover:bg-blue-500 text-white px-8 py-4 rounded-sm font-bold flex items-center justify-center gap-2 transition-all shadow-lg shadow-blue-900/20"
                    >
                        無料で募集を開始する <ArrowRight size={18} />
                    </button>
                    <button className="border border-gray-700 hover:border-white text-white px-8 py-4 rounded-sm font-bold transition-all">
                        資料をダウンロード
                    </button>
                </div>
            </div>
            
            {/* Visual */}
            <div className="relative">
                <div className="relative z-10 bg-gray-800/50 backdrop-blur-xl border border-gray-700 p-6 rounded-lg shadow-2xl">
                    <div className="flex items-center gap-4 mb-6 border-b border-gray-700 pb-4">
                        <div className="w-3 h-3 rounded-full bg-red-500"></div>
                        <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                        <div className="w-3 h-3 rounded-full bg-green-500"></div>
                        <div className="ml-auto text-xs font-mono text-gray-500">profile_analysis.py</div>
                    </div>
                    <div className="space-y-3 font-mono text-sm">
                        <div className="flex gap-4">
                            <span className="text-blue-400">def</span>
                            <span className="text-yellow-200">analyze_match</span>(student, job):
                        </div>
                        <div className="pl-8 text-gray-300">
                            skill_score = <span className="text-green-400">calculate_github_score</span>(student.repo)
                        </div>
                        <div className="pl-8 text-gray-300">
                             if skill_score &gt; 85:
                        </div>
                        <div className="pl-12">
                             <span className="text-purple-400">return</span> <span className="text-orange-300">"Highly Recommended"</span>
                        </div>
                    </div>
                </div>
                {/* Decorative Elements */}
                <div className="absolute -top-10 -right-10 w-32 h-32 border-2 border-gray-800 rounded-full animate-spin-slow"></div>
            </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-24 bg-gray-950 border-t border-gray-800">
        <div className="max-w-7xl mx-auto px-6">
            <div className="text-center mb-16">
                <h2 className="text-3xl font-black mb-4">Tech internが選ばれる理由</h2>
                <p className="text-gray-400 text-sm font-bold uppercase tracking-widest">WHY US</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <div className="bg-gray-900 p-8 rounded-sm border border-gray-800 hover:border-blue-500 transition-colors group">
                    <div className="w-12 h-12 bg-gray-800 rounded-sm flex items-center justify-center mb-6 group-hover:bg-blue-600 transition-colors">
                        <Code className="text-white" size={24} />
                    </div>
                    <h3 className="text-xl font-bold mb-3">GitHub連携によるスキル証明</h3>
                    <p className="text-gray-400 text-sm leading-relaxed">
                        学生のGitHubリポジトリを自動解析。言語使用比率やコミット頻度から、実際のコーディング能力を可視化します。
                    </p>
                </div>
                <div className="bg-gray-900 p-8 rounded-sm border border-gray-800 hover:border-blue-500 transition-colors group">
                    <div className="w-12 h-12 bg-gray-800 rounded-sm flex items-center justify-center mb-6 group-hover:bg-blue-600 transition-colors">
                        <Zap className="text-white" size={24} />
                    </div>
                    <h3 className="text-xl font-bold mb-3">AIマッチング</h3>
                    <p className="text-gray-400 text-sm leading-relaxed">
                        御社の募集要項と学生のプロフィールをAIが分析。相性の良い候補者をレコメンドし、スカウト工数を削減します。
                    </p>
                </div>
                <div className="bg-gray-900 p-8 rounded-sm border border-gray-800 hover:border-blue-500 transition-colors group">
                    <div className="w-12 h-12 bg-gray-800 rounded-sm flex items-center justify-center mb-6 group-hover:bg-blue-600 transition-colors">
                        <Users className="text-white" size={24} />
                    </div>
                    <h3 className="text-xl font-bold mb-3">ダイレクトスカウト</h3>
                    <p className="text-gray-400 text-sm leading-relaxed">
                        気になった学生には直接メッセージを送信可能。カジュアル面談への誘導もスムーズに行えます。
                    </p>
                </div>
            </div>
        </div>
      </section>

      {/* Pricing / CTA */}
      <section className="py-24 bg-gray-900">
        <div className="max-w-4xl mx-auto px-6 text-center">
            <h2 className="text-3xl font-black mb-8">まずは無料ではじめませんか？</h2>
            <p className="text-gray-400 mb-10">
                求人掲載は完全無料。採用が決定するまで費用は一切かかりません。<br/>
                優秀な学生エンジニアとの出会いを、ここから。
            </p>
            <button 
                onClick={onNavigateRegister}
                className="bg-white text-black px-12 py-5 rounded-sm font-black text-lg hover:bg-gray-200 transition-colors"
            >
                今すぐアカウントを作成する
            </button>
        </div>
      </section>

      {/* Simple Footer */}
      <footer className="py-8 bg-gray-950 text-center border-t border-gray-900">
        <p className="text-xs text-gray-600 font-bold">© 2024 Tech intern for Business.</p>
      </footer>
    </div>
  );
};
