
import React, { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { HeroCarousel } from './components/HeroCarousel';
import { Sidebar } from './components/Sidebar';
import { JobCard } from './components/JobCard';
import { ColumnSection } from './components/ColumnSection';
import { FlowSection } from './components/FlowSection';
import { FaqSection } from './components/FaqSection';
import { JobDetailPage } from './components/JobDetailPage';
import { CompanyPage } from './components/CompanyPage';
import { ArticlePage } from './components/ArticlePage';
import { LoginPage, RegisterPage } from './components/AuthPages';
import { MyPage } from './components/MyPage';
import { JOB_LISTINGS, ARTICLES } from './constants';
import { JobListing } from './types';
import { Search } from 'lucide-react';

// Simple Router Types
type Route = 
  | { name: 'HOME' }
  | { name: 'JOB_DETAIL'; id: string }
  | { name: 'COMPANY_DETAIL'; id: string }
  | { name: 'ARTICLE_DETAIL'; id: number }
  | { name: 'LOGIN' }
  | { name: 'REGISTER' }
  | { name: 'MYPAGE' };

const App: React.FC = () => {
  const [route, setRoute] = useState<Route>({ name: 'HOME' });
  const [user, setUser] = useState<string | null>(null);
  const [favorites, setFavorites] = useState<Set<string>>(new Set());

  // Scroll to top on route change
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [route.name, (route as any).id]);

  // Navigation Handlers
  const navigateHome = () => setRoute({ name: 'HOME' });
  const navigateJobDetail = (id: string) => setRoute({ name: 'JOB_DETAIL', id });
  const navigateCompany = (id: string) => setRoute({ name: 'COMPANY_DETAIL', id });
  const navigateArticle = (id: number) => setRoute({ name: 'ARTICLE_DETAIL', id });
  const navigateLogin = () => setRoute({ name: 'LOGIN' });
  const navigateRegister = () => setRoute({ name: 'REGISTER' });
  const navigateMyPage = () => setRoute({ name: 'MYPAGE' });

  const handleLoginSuccess = (userName: string) => {
      setUser(userName);
      navigateMyPage();
  };

  const toggleFavorite = (jobId: string) => {
    setFavorites(prev => {
        const newFavs = new Set(prev);
        if (newFavs.has(jobId)) {
            newFavs.delete(jobId);
        } else {
            newFavs.add(jobId);
        }
        return newFavs;
    });
  };

  // Job Detail Page Logic
  const renderJobDetail = () => {
      if (route.name !== 'JOB_DETAIL') return null;
      const job = JOB_LISTINGS.find(j => j.id === route.id);
      if (!job) return <div>Not Found</div>;
      return (
        <JobDetailPage 
            job={job} 
            isFavorite={favorites.has(job.id)}
            onToggleFavorite={() => toggleFavorite(job.id)}
            onNavigateCompany={navigateCompany} 
            onBack={navigateHome} 
        />
      );
  };

  // Company Page Logic
  const renderCompanyDetail = () => {
      if (route.name !== 'COMPANY_DETAIL') return null;
      const company = JOB_LISTINGS.find(j => j.company.id === route.id)?.company;
      if (!company) return <div>Not Found</div>;
      return (
          <CompanyPage 
            company={company} 
            onBack={navigateHome} 
            onNavigateJobDetail={navigateJobDetail}
          />
      );
  }

  // Article Page Logic
  const renderArticleDetail = () => {
      if (route.name !== 'ARTICLE_DETAIL') return null;
      const article = ARTICLES.find(a => a.id === route.id);
      if (!article) return <div>Not Found</div>;
      return <ArticlePage article={article} onBack={navigateHome} />;
  }

  return (
    <div className="min-h-screen flex flex-col font-sans text-gray-900 overflow-x-hidden">
      <Header 
        user={user}
        onNavigateHome={navigateHome}
        onNavigateLogin={navigateLogin}
        onNavigateRegister={navigateRegister}
        onNavigateMyPage={navigateMyPage}
      />
      
      <main className="flex-grow">
        {route.name === 'HOME' && (
            <>
                {/* Hero Section */}
                <HeroCarousel />
                
                <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 py-12">
                <div className="flex flex-col lg:flex-row gap-12">
                    
                    {/* Sidebar Filters */}
                    <Sidebar />

                    {/* Main Content Area */}
                    <div className="flex-1">
                    {/* Mobile Search & Filter */}
                    <div className="lg:hidden mb-8 flex gap-3">
                        <div className="relative flex-1">
                            <input 
                            type="text" 
                            placeholder="キーワード検索" 
                            className="w-full pl-10 pr-4 py-3 bg-white border border-gray-300 rounded-sm text-sm shadow-sm focus:border-black focus:ring-0 outline-none"
                            />
                            <Search className="absolute left-3 top-3.5 text-gray-400" size={18} />
                        </div>
                    </div>

                    {/* Catchphrase */}
                    <div className="mb-10 text-center md:text-left">
                        <h2 className="text-2xl md:text-4xl font-black bg-clip-text text-transparent bg-gradient-to-r from-gray-900 via-gray-700 to-gray-500 leading-tight">
                            エンジニアとして経験を積みたいなら<br className="md:hidden"/> Tech intern
                        </h2>
                    </div>

                    <div className="flex items-end justify-between mb-8 pb-4 border-b border-gray-200/50">
                        <div>
                        <h2 className="text-3xl font-black text-gray-900 tracking-tight">NEW ARRIVALS</h2>
                        <p className="text-xs font-bold text-gray-500 mt-2 uppercase tracking-widest">
                            新着のインターンシップ
                        </p>
                        </div>
                        <span className="text-sm font-medium text-gray-500">
                            <span className="text-black font-black text-xl">{JOB_LISTINGS.length}</span> results
                        </span>
                    </div>

                    {/* Job Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
                        {JOB_LISTINGS.map((job) => (
                        <div key={job.id} onClick={() => navigateJobDetail(job.id)} className="cursor-pointer">
                            <JobCard job={job} />
                        </div>
                        ))}
                    </div>
                    
                    {/* Pagination */}
                    <div className="mt-16 flex justify-center mb-20">
                        <div className="flex gap-2">
                            {[1, 2, 3].map((page) => (
                                <button 
                                    key={page}
                                    className={`w-10 h-10 rounded-sm flex items-center justify-center text-sm font-bold transition-all ${
                                        page === 1 
                                        ? 'bg-black text-white' 
                                        : 'bg-transparent text-gray-500 hover:text-black border border-gray-300 hover:border-black'
                                    }`}
                                >
                                    {page}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* New Content Sections */}
                    <ColumnSection onNavigateArticle={navigateArticle} />
                    
                    </div>
                </div>
                </div>

                {/* Full width sections below main container */}
                <FlowSection onNavigateRegister={navigateRegister} />
                <FaqSection />
            </>
        )}

        {route.name === 'JOB_DETAIL' && renderJobDetail()}
        {route.name === 'COMPANY_DETAIL' && renderCompanyDetail()}
        {route.name === 'ARTICLE_DETAIL' && renderArticleDetail()}
        {route.name === 'LOGIN' && <LoginPage onLoginSuccess={handleLoginSuccess} onNavigateRegister={navigateRegister} />}
        {route.name === 'REGISTER' && <RegisterPage onLoginSuccess={handleLoginSuccess} onNavigateLogin={navigateLogin} />}
        {route.name === 'MYPAGE' && user && <MyPage userName={user} favorites={favorites} onNavigateJobDetail={navigateJobDetail} />}

      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-200 pt-20 pb-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-10 mb-16">
                <div>
                    <h5 className="font-bold text-sm text-gray-900 mb-6 uppercase tracking-wider">Tech intern</h5>
                    <ul className="space-y-3 text-xs font-medium text-gray-500">
                        <li><a href="#" className="hover:text-black transition-colors">運営会社</a></li>
                        <li><a href="#" className="hover:text-black transition-colors">利用規約</a></li>
                        <li><a href="#" className="hover:text-black transition-colors">プライバシーポリシー</a></li>
                    </ul>
                </div>
                <div>
                    <h5 className="font-bold text-sm text-gray-900 mb-6 uppercase tracking-wider">Student</h5>
                    <ul className="space-y-3 text-xs font-medium text-gray-500">
                        <li><a href="#" className="hover:text-black transition-colors">インターンを探す</a></li>
                        <li><a href="#" className="hover:text-black transition-colors">初めての方へ</a></li>
                        <li><a href="#" className="hover:text-black transition-colors">ヘルプ</a></li>
                    </ul>
                </div>
                <div>
                    <h5 className="font-bold text-sm text-gray-900 mb-6 uppercase tracking-wider">Company</h5>
                    <ul className="space-y-3 text-xs font-medium text-gray-500">
                        <li><a href="#" className="hover:text-black transition-colors">採用担当者様へ</a></li>
                        <li><a href="#" className="hover:text-black transition-colors">料金プラン</a></li>
                        <li><a href="#" className="hover:text-black transition-colors">お問い合わせ</a></li>
                    </ul>
                </div>
                <div>
                    <h5 className="font-bold text-sm text-gray-900 mb-6 uppercase tracking-wider">Social</h5>
                    <div className="flex gap-4">
                        <div className="w-8 h-8 bg-gray-100 flex items-center justify-center text-gray-600 hover:bg-black hover:text-white transition-all cursor-pointer rounded-sm">X</div>
                        <div className="w-8 h-8 bg-gray-100 flex items-center justify-center text-gray-600 hover:bg-black hover:text-white transition-all cursor-pointer rounded-sm">in</div>
                    </div>
                </div>
            </div>
            <div className="border-t border-gray-100 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
                <div className="flex flex-col">
                    <span className="font-black text-xl text-gray-900 tracking-tighter">Tech intern</span>
                    <span className="text-[10px] text-gray-400">ENGINEER INTERNSHIP PLATFORM</span>
                </div>
                <p className="text-xs text-gray-400 font-medium">© 2024 Tech intern Inc. All rights reserved.</p>
            </div>
        </div>
      </footer>
    </div>
  );
};

export default App;
