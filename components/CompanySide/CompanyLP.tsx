
import React, { useState, useEffect } from 'react';
import { ArrowRight, Code, Cpu, Layers, Zap, Play, CheckCircle } from 'lucide-react';

interface CompanyLPProps {
  onNavigateLogin: () => void;
  onNavigateRegister: () => void;
}

export const CompanyLP: React.FC<CompanyLPProps> = ({ onNavigateLogin, onNavigateRegister }) => {
  const [scrolled, setScrolled] = useState(false);
  const [isVisible, setIsVisible] = useState<Record<string, boolean>>({});

  // Scroll listener for Navbar and Reveal animations
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);

      const sections = ['hero', 'features', 'stats', 'testimonials', 'cta'];
      sections.forEach(id => {
        const el = document.getElementById(id);
        if (el) {
          const rect = el.getBoundingClientRect();
          if (rect.top < window.innerHeight * 0.8) {
            setIsVisible(prev => ({ ...prev, [id]: true }));
          }
        }
      });
    };

    window.addEventListener('scroll', handleScroll);
    handleScroll(); // Check on load
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className="min-h-screen bg-[#e8e8e8] text-gray-900 font-sans selection:bg-orange-500 selection:text-white overflow-x-hidden">
      
      {/* Background Noise & Grid (Adapted for Light Theme) */}
      <div className="fixed inset-0 z-0 pointer-events-none opacity-40 mix-blend-multiply" style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)' opacity='0.5'/%3E%3C/svg%3E")` }}></div>
      <div className="fixed inset-0 z-0 pointer-events-none opacity-[0.05]" style={{ backgroundSize: '40px 40px', backgroundImage: 'linear-gradient(to right, #000000 1px, transparent 1px), linear-gradient(to bottom, #000000 1px, transparent 1px)' }}></div>

      {/* Navbar */}
      <nav className={`fixed top-0 w-full z-50 transition-all duration-300 ${scrolled ? 'bg-[#e8e8e8]/90 backdrop-blur-md border-b border-black/5' : 'bg-transparent border-b border-transparent'}`}>
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <div className="flex items-center gap-3">
             <div className="relative w-8 h-8 flex items-center justify-center bg-black text-white font-black text-xs overflow-hidden rounded-sm">
                <span className="relative z-10">Ti</span>
             </div>
             <span className="text-lg font-bold tracking-tighter text-gray-900 uppercase hidden md:block">
                Tech intern <span className="text-orange-600 text-xs ml-1 font-black">/ PRO</span>
             </span>
          </div>
          <div className="flex items-center gap-8">
            <button onClick={onNavigateLogin} className="text-sm font-bold text-gray-500 hover:text-black transition-colors">
              ログイン
            </button>
            <button 
                onClick={onNavigateRegister}
                className="group relative px-6 py-2 bg-orange-600 text-white text-xs font-bold tracking-widest uppercase overflow-hidden hover:bg-orange-500 transition-colors rounded-sm shadow-md"
            >
              <span className="relative z-10 flex items-center gap-2">
                無料で始める
              </span>
            </button>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section id="hero" className="relative min-h-screen flex items-center pt-20 overflow-hidden">
        {/* Subtle Cool Glow */}
        <div className="absolute top-[-20%] right-[-10%] w-[800px] h-[800px] bg-gray-300/30 rounded-full blur-[120px]"></div>

        <div className="relative z-10 max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            <div className={`lg:col-span-7 transition-all duration-1000 transform ${isVisible.hero ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
                <div className="inline-flex items-center gap-2 px-3 py-1 border border-orange-600/20 bg-orange-50 text-orange-600 text-xs font-bold mb-8 rounded-full">
                    <span className="w-2 h-2 bg-orange-600 rounded-full animate-pulse"></span>
                    エンジニア採用の新しいスタンダード
                </div>
                
                <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold leading-tight tracking-tight text-gray-900 mb-8">
                    <span className="block">経験とポテンシャルを</span>
                    <span className="block text-transparent bg-clip-text bg-gradient-to-r from-orange-600 to-orange-400">
                        科学的に可視化する。
                    </span>
                </h1>
                
                <p className="text-base md:text-lg text-gray-600 leading-relaxed max-w-2xl mb-10 font-medium">
                    GitHub解析による「技術力のスコアリング」と、AIによる「カルチャーマッチング」。
                    感覚に頼った採用を終わらせ、貴社の開発チームに最適なエンジニアを最短で見つけ出します。
                </p>

                <div className="flex flex-col sm:flex-row gap-4">
                    <button 
                        onClick={onNavigateRegister}
                        className="group relative px-8 py-4 bg-black text-white text-sm font-bold tracking-widest rounded-sm hover:bg-gray-800 transition-all shadow-lg"
                    >
                        <span className="flex items-center gap-3">
                            今すぐ始める <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform"/>
                        </span>
                    </button>
                    
                    <button className="px-8 py-4 border border-black/10 bg-white/50 backdrop-blur-sm text-gray-900 text-sm font-bold tracking-widest rounded-sm hover:bg-white hover:border-black transition-colors flex items-center gap-3">
                        <Play size={16} fill="currentColor" /> 資料をダウンロード
                    </button>
                </div>
                
                <div className="mt-12 flex items-center gap-6 text-xs text-gray-500 font-bold">
                    <div className="flex items-center gap-2">
                        <CheckCircle size={14} className="text-orange-600"/> 初期費用0円
                    </div>
                    <div className="flex items-center gap-2">
                        <CheckCircle size={14} className="text-orange-600"/> 最短3日で内定
                    </div>
                    <div className="flex items-center gap-2">
                        <CheckCircle size={14} className="text-orange-600"/> 導入企業500社突破
                    </div>
                </div>
            </div>
            
            {/* Hero Visual - Dashboard Mockup (Light Theme) */}
            <div className={`lg:col-span-5 hidden lg:block relative transition-all duration-1000 delay-300 ${isVisible.hero ? 'translate-x-0 opacity-100' : 'translate-x-10 opacity-0'}`}>
                <div className="relative w-full aspect-[4/3] bg-gradient-to-br from-gray-100 to-gray-200 border border-white rounded-lg p-1 shadow-2xl overflow-hidden group">
                     <div className="absolute inset-0 bg-orange-500/0 group-hover:bg-orange-500/5 transition-colors duration-500"></div>
                     <div className="w-full h-full bg-white rounded overflow-hidden relative border border-gray-200">
                        {/* Mock UI */}
                        <div className="h-8 border-b border-gray-100 bg-gray-50 flex items-center px-4 gap-2">
                            <div className="w-2 h-2 rounded-full bg-gray-300"></div>
                            <div className="w-2 h-2 rounded-full bg-gray-300"></div>
                        </div>
                        <div className="p-6 space-y-6">
                            <div className="flex justify-between items-end">
                                <div>
                                    <div className="text-[10px] text-gray-400 uppercase tracking-widest mb-1 font-bold">Total Candidates</div>
                                    <div className="text-4xl font-black text-gray-900">12,400<span className="text-orange-600 text-lg">+</span></div>
                                </div>
                                <div className="text-right">
                                    <div className="text-[10px] text-gray-400 uppercase tracking-widest mb-1 font-bold">Match Rate</div>
                                    <div className="text-2xl font-black text-gray-900">94.2%</div>
                                </div>
                            </div>
                            {/* Bars */}
                            <div className="space-y-3 mt-4">
                                <div className="h-3 bg-gray-100 rounded-sm overflow-hidden">
                                    <div className="h-full bg-gray-900 w-[75%]"></div>
                                </div>
                                <div className="h-3 bg-gray-100 rounded-sm overflow-hidden">
                                    <div className="h-full bg-orange-500 w-[60%]"></div>
                                </div>
                                <div className="h-3 bg-gray-100 rounded-sm overflow-hidden">
                                    <div className="h-full bg-gray-400 w-[85%]"></div>
                                </div>
                            </div>
                            {/* Code snippet */}
                            <div className="mt-6 p-4 bg-gray-50 rounded border border-gray-200 font-mono text-[10px] text-gray-500 shadow-inner">
                                <span className="text-orange-600">const</span> candidate = {'{'} <br/>
                                &nbsp;&nbsp;skills: [<span className="text-blue-600">'React'</span>, <span className="text-blue-600">'Go'</span>], <br/>
                                &nbsp;&nbsp;score: <span className="text-black font-bold">98.5</span>, <br/>
                                &nbsp;&nbsp;status: <span className="text-green-600">'Available'</span> <br/>
                                {'}'}
                            </div>
                        </div>
                     </div>
                </div>
            </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-24 border-t border-black/5 relative bg-[#f5f5f5]">
        <div className="max-w-7xl mx-auto px-6">
            <div className={`mb-16 text-center transition-all duration-700 ${isVisible.features ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
                <h2 className="text-xs font-black tracking-[0.2em] text-orange-600 mb-4 uppercase">
                    Our Features
                </h2>
                <h3 className="text-3xl md:text-4xl font-bold text-gray-900 leading-tight">
                    採用の「不確実性」を取り除く<br/>
                    3つのコアテクノロジー
                </h3>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {/* Feature 1 */}
                <div className={`group p-8 border border-gray-200 hover:border-orange-500/50 bg-white transition-all duration-500 rounded-sm relative overflow-hidden shadow-sm hover:shadow-xl ${isVisible.features ? 'translate-y-0 opacity-100 delay-100' : 'translate-y-10 opacity-0'}`}>
                    <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mb-6 group-hover:bg-orange-600 group-hover:text-white transition-colors">
                        <Code size={24} />
                    </div>
                    <h4 className="text-xl font-bold text-gray-900 mb-4">Deep Code Analysis</h4>
                    <p className="text-gray-600 text-sm leading-7 font-medium">
                        GitHubリポジトリを自動解析。コミット頻度、コードの複雑性、モダンな設計思想の有無などを定量スコア化し、履歴書だけでは見えない「実装力」を可視化します。
                    </p>
                    <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
                        <Code size={80} />
                    </div>
                </div>

                {/* Feature 2 */}
                <div className={`group p-8 border border-gray-200 hover:border-orange-500/50 bg-white transition-all duration-500 rounded-sm relative overflow-hidden shadow-sm hover:shadow-xl ${isVisible.features ? 'translate-y-0 opacity-100 delay-200' : 'translate-y-10 opacity-0'}`}>
                    <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mb-6 group-hover:bg-orange-600 group-hover:text-white transition-colors">
                        <Cpu size={24} />
                    </div>
                    <h4 className="text-xl font-bold text-gray-900 mb-4">Context AI Matching</h4>
                    <p className="text-gray-600 text-sm leading-7 font-medium">
                        単なるキーワード検索ではありません。貴社の開発体制や使用技術の文脈（コンテキスト）をAIが理解し、相性の良い学生をレコメンドします。
                    </p>
                    <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
                        <Cpu size={80} />
                    </div>
                </div>

                {/* Feature 3 */}
                <div className={`group p-8 border border-gray-200 hover:border-orange-500/50 bg-white transition-all duration-500 rounded-sm relative overflow-hidden shadow-sm hover:shadow-xl ${isVisible.features ? 'translate-y-0 opacity-100 delay-300' : 'translate-y-10 opacity-0'}`}>
                    <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mb-6 group-hover:bg-orange-600 group-hover:text-white transition-colors">
                        <Layers size={24} />
                    </div>
                    <h4 className="text-xl font-bold text-gray-900 mb-4">Direct Scouting</h4>
                    <p className="text-gray-600 text-sm leading-7 font-medium">
                        気になる学生へダイレクトにアプローチ。テンプレートではない、技術的な話題でのスカウト送信が可能です。エンジニア同士の会話から採用を始めましょう。
                    </p>
                    <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
                        <Layers size={80} />
                    </div>
                </div>
            </div>
        </div>
      </section>

      {/* Stats Section */}
      <section id="stats" className="py-24 bg-white border-t border-gray-200 relative overflow-hidden">
         {/* Decorative Grid */}
        <div className="absolute inset-0 opacity-[0.05]" style={{ backgroundImage: 'radial-gradient(#000000 1px, transparent 1px)', backgroundSize: '24px 24px' }}></div>

        <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-2 gap-16 items-center relative z-10">
             <div className={`transition-all duration-700 ${isVisible.stats ? 'translate-x-0 opacity-100' : '-translate-x-10 opacity-0'}`}>
                <h2 className="text-3xl md:text-5xl font-bold text-gray-900 mb-8 leading-tight">
                    数字が証明する、<br/>
                    圧倒的な採用効率。
                </h2>
                <p className="text-gray-600 text-base mb-10 leading-relaxed font-medium">
                    Tech internの導入により、多くのテック企業が採用プロセスを劇的に改善しています。
                    スキルのミスマッチを減らし、本当に必要な人材との対話に時間を使いましょう。
                </p>
                
                <div className="grid grid-cols-2 gap-6">
                    <div className="p-6 bg-gray-50 border border-gray-200 rounded-sm hover:border-orange-500/50 transition-colors">
                        <div className="text-4xl font-black text-gray-900 mb-2">70<span className="text-xl text-orange-600">%</span></div>
                        <div className="text-xs font-bold text-gray-400 uppercase tracking-wider">スクリーニング時間削減</div>
                    </div>
                    <div className="p-6 bg-gray-50 border border-gray-200 rounded-sm hover:border-orange-500/50 transition-colors">
                        <div className="text-4xl font-black text-gray-900 mb-2">3.5<span className="text-xl text-orange-600">x</span></div>
                        <div className="text-xs font-bold text-gray-400 uppercase tracking-wider">内定承諾率の向上</div>
                    </div>
                </div>
             </div>

             {/* Graphic/Image Placeholder */}
             <div className={`relative h-[400px] bg-gray-100 rounded-lg border border-gray-200 overflow-hidden flex items-center justify-center transition-all duration-700 delay-200 ${isVisible.stats ? 'translate-x-0 opacity-100' : 'translate-x-10 opacity-0'}`}>
                <div className="absolute inset-0 flex items-center justify-center gap-4 opacity-10">
                     {/* Bars Animation */}
                     {[40, 70, 50, 90, 60].map((h, i) => (
                         <div key={i} className="w-8 bg-black" style={{ height: `${h}%` }}></div>
                     ))}
                </div>
                <div className="z-10 bg-white/90 backdrop-blur border border-gray-200 p-6 rounded text-center shadow-xl">
                    <div className="text-xs text-gray-400 mb-1 font-bold uppercase">Average Matching Score</div>
                    <div className="text-5xl font-black text-gray-900">92.8<span className="text-orange-600 text-2xl">%</span></div>
                </div>
             </div>
        </div>
      </section>

      {/* Testimonials */}
      <section id="testimonials" className="py-24 border-t border-gray-200 bg-[#f9f9f9]">
        <div className="max-w-7xl mx-auto px-6">
            <h2 className="text-center text-xs font-black tracking-[0.2em] text-orange-600 mb-12 uppercase">
                導入企業の声
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {[
                    { company: "株式会社Mercari", role: "CTO", text: "学生の実務スキルがここまで正確に可視化されるとは驚きです。即戦力級のエンジニア採用に成功しました。" },
                    { company: "CyberAgent", role: "VPoE", text: "AIによるマッチング精度が非常に高い。カルチャーフィットする学生と出会える確率が格段に上がりました。" },
                    { company: "SmartHR", role: "Engineering Manager", text: "GitHubベースのスカウトはエンジニアからの返信率が高い。開発チームも納得の採用ができています。" }
                ].map((item, i) => (
                    <div key={i} className={`bg-white border border-gray-200 p-8 relative hover:border-orange-500/50 hover:shadow-lg transition-all duration-500 group ${isVisible.testimonials ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`} style={{ transitionDelay: `${i * 100}ms` }}>
                        <div className="text-orange-600 mb-6 opacity-80 group-hover:opacity-100 transition-opacity"><Zap size={24} fill="currentColor"/></div>
                        <p className="text-gray-600 text-sm leading-7 mb-8 font-medium">
                            "{item.text}"
                        </p>
                        <div className="flex items-center gap-3 pt-6 border-t border-gray-100">
                            <div className="w-8 h-8 bg-gray-200 rounded-full"></div>
                            <div>
                                <div className="text-xs font-bold text-gray-900">{item.company}</div>
                                <div className="text-[10px] font-bold text-gray-400 uppercase">{item.role}</div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
      </section>

      {/* CTA Section */}
      <section id="cta" className="relative py-32 border-t border-gray-200 overflow-hidden bg-white">
        <div className="absolute inset-0 bg-orange-500/5"></div>
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(0,0,0,0.05)_0%,transparent_70%)]"></div>

        <div className={`relative z-10 max-w-4xl mx-auto px-6 text-center transition-all duration-1000 ${isVisible.cta ? 'scale-100 opacity-100' : 'scale-95 opacity-0'}`}>
            <h2 className="text-4xl md:text-5xl font-black text-gray-900 mb-8">
                エンジニア採用を、<br/>
                <span className="text-orange-600">ここから変える。</span>
            </h2>
            <p className="text-gray-600 text-base mb-10 max-w-xl mx-auto font-medium">
                優秀な学生エンジニアとの出会いを、Tech internがサポートします。<br/>
                初期費用無料、完全成功報酬型でスタート。
            </p>
            
            <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
                <button 
                    onClick={onNavigateRegister}
                    className="w-full sm:w-auto px-10 py-4 bg-black text-white text-sm font-bold tracking-widest hover:bg-orange-600 transition-all shadow-xl rounded-sm"
                >
                    無料でアカウント作成
                </button>
                <button className="w-full sm:w-auto px-10 py-4 border border-gray-300 bg-white text-gray-900 text-sm font-bold tracking-widest hover:border-black transition-colors rounded-sm">
                    お問い合わせ
                </button>
            </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-10 border-t border-gray-200 bg-gray-50 text-center">
         <div className="flex items-center justify-center gap-2 mb-6">
             <div className="w-2 h-2 bg-orange-600 rounded-sm"></div>
             <span className="text-xs font-bold tracking-widest text-gray-900 uppercase">Tech intern <span className="text-gray-500">/ Enterprise</span></span>
         </div>
         <p className="text-[10px] text-gray-500 font-mono">
            © 2024 KAXIN Inc. All rights reserved.
         </p>
      </footer>

    </div>
  );
};
