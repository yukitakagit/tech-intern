
import React, { useState, useEffect, useMemo } from 'react';
import { Header } from './components/Header';
import { HeroCarousel } from './components/HeroCarousel';
import { Sidebar } from './components/Sidebar';
import { JobCard } from './components/JobCard';
import { ColumnSection } from './components/ColumnSection';
import { CompanySection } from './components/CompanySection';
import { FlowSection } from './components/FlowSection';
import { FaqSection } from './components/FaqSection';
import { JobDetailPage } from './components/JobDetailPage';
import { CompanyPage } from './components/CompanyPage';
import { CompanyListPage } from './components/CompanyListPage'; 
import { ArticlePage } from './components/ArticlePage';
import { ArticleListPage } from './components/ArticleListPage';
import { AllJobsPage } from './components/AllJobsPage';
import { LoginPage, RegisterPage } from './components/AuthPages';
import { MyPage } from './components/MyPage';
import { ApplicationPage } from './components/ApplicationPage';
import { SEO } from './components/SEO';
import { Footer } from './components/Footer';
import { CompanyProfilePage, TermsPage, PrivacyPage, TokushoPage } from './components/StaticPages';
import { CompanyLP } from './components/CompanySide/CompanyLP';
import { CompanyLogin, CompanyRegister } from './components/CompanySide/CompanyAuth';
import { CompanyDashboard } from './components/CompanySide/CompanyDashboard';
import { AdminDashboard } from './components/AdminDashboard'; 
import { JOB_LISTINGS, ARTICLES, INITIAL_USER_PROFILE } from './constants';
import { JobListing, FilterState, AppRoute, Article, FAQ, UserProfile } from './types';
import { Search, LogOut, ArrowRight, Instagram, ChevronRight } from 'lucide-react';

const App: React.FC = () => {
  const [route, setRoute] = useState<AppRoute>({ name: 'HOME' });
  const [user, setUser] = useState<string | null>(null);
  const [userProfile, setUserProfile] = useState<UserProfile>(INITIAL_USER_PROFILE); // Managed User Profile
  const [companyUser, setCompanyUser] = useState<string | null>(null); 
  const [adminUser, setAdminUser] = useState<boolean>(false); // Admin State
  const [favorites, setFavorites] = useState<Set<string>>(new Set());
  const [browsingHistory, setBrowsingHistory] = useState<string[]>([]);

  // Content Data State (Lifted for Admin management)
  const [articles, setArticles] = useState<Article[]>(
      ARTICLES.map(a => ({ ...a, status: 'published' })) // Initialize defaults as published
  );
  const [faqs, setFaqs] = useState<FAQ[]>([
      { id: 1, q: 'プログラミング未経験でも応募できますか？', a: 'はい、一部の企業では未経験者向けの研修プログラムを用意したインターン募集を行っています。ただし、Tech internでは事前にProgateやドットインストール、または独学での基礎学習を済ませておくことを推奨しています。', status: 'published' },
      { id: 2, q: '大学の授業と両立は可能ですか？', a: '多くの企業が学生のスケジュールに配慮しています。「週2日〜」「土日OK」「夕方から」など、柔軟なシフトの企業も多数あります。検索フィルターで「土日勤務OK」などを選択して探してみてください。', status: 'published' },
      { id: 3, q: '給与は支払われますか？', a: 'Tech internに掲載されている全ての長期インターンシップは有給です。時給制が一般的ですが、成果報酬型の案件もあります。詳細は各求人票をご確認ください。', status: 'published' },
      { id: 4, q: 'リモートワークは可能ですか？', a: 'はい、フルリモート可能な求人も多数掲載しています。特にWeb系・IT系の企業では、SlackやZoomを用いたリモート開発体制が整っていることが多いです。', status: 'published' },
      { id: 5, q: '選考にはどれくらいの期間がかかりますか？', a: '平均して2週間〜1ヶ月程度です。GitHub連携をしておくと、技術スキルの証明がスムーズになり、書類選考の通過率が上がったり、選考期間が短縮される傾向にあります。', status: 'published' },
  ]);

  // Search & Filter State
  const [searchQuery, setSearchQuery] = useState('');
  const [filters, setFilters] = useState<FilterState>({
    occupations: [],
    languages: [],
    industries: [],
    areas: [],
    characteristics: []
  });

  // Filter Logic
  const filteredJobs = useMemo(() => {
    return JOB_LISTINGS.filter(job => {
        if (job.status === 'draft') return false;
        if (searchQuery) {
            const lowerQ = searchQuery.toLowerCase();
            const textMatch = 
                job.title.toLowerCase().includes(lowerQ) ||
                job.company.name.toLowerCase().includes(lowerQ) ||
                job.description.toLowerCase().includes(lowerQ) ||
                job.tags.some(tag => tag.toLowerCase().includes(lowerQ));
            if (!textMatch) return false;
        }
        if (filters.occupations.length > 0) {
            const occupationMatch = filters.occupations.some(filterItem => 
                job.title.includes(filterItem) || job.tags.some(tag => tag.includes(filterItem))
            );
            if (!occupationMatch) return false;
        }
        if (filters.languages.length > 0) {
            const langMatch = filters.languages.some(filterItem => 
                job.tags.some(tag => tag.toLowerCase() === filterItem.toLowerCase() || tag.includes(filterItem)) ||
                job.requiredSkills.some(skill => skill.toLowerCase() === filterItem.toLowerCase())
            );
            if (!langMatch) return false;
        }
        if (filters.industries.length > 0) {
            const industryMatch = filters.industries.some(filterItem => 
                job.company.industry?.includes(filterItem) || job.company.description?.includes(filterItem)
            );
            if (!industryMatch) return false;
        }
        if (filters.areas.length > 0) {
            const areaMatch = filters.areas.some(filterItem => {
                if (filterItem === 'フルリモート') return job.workStyle === 'Remote';
                return job.company.location.includes(filterItem) || job.company.address?.includes(filterItem);
            });
            if (!areaMatch) return false;
        }
        if (filters.characteristics.length > 0) {
             const charMatch = filters.characteristics.every(filterItem => {
                 if (filterItem === '時給1500円以上') {
                     const salaryNum = parseInt(job.salary.replace(/[^0-9]/g, ''));
                     return salaryNum >= 1500;
                 }
                 if (filterItem === '未経験歓迎') return job.tags.includes('未経験歓迎');
                 if (filterItem === '土日勤務OK') return job.workStyle === 'Hybrid' || job.workStyle === 'Remote';
                 return job.tags.includes(filterItem);
             });
             if (!charMatch) return false;
        }
        return true;
    });
  }, [searchQuery, filters]);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [route.name, (route as any).id, (route as any).jobId]);

  // Navigation Handlers
  const navigateHome = () => setRoute({ name: 'HOME' });
  const navigateAllJobs = () => setRoute({ name: 'ALL_JOBS' });
  const navigateJobDetail = (id: string) => {
      setBrowsingHistory(prev => {
          const newHistory = prev.filter(hid => hid !== id);
          return [id, ...newHistory].slice(0, 10);
      });
      setRoute({ name: 'JOB_DETAIL', id });
  };
  const navigateCompany = (id: string, fromJobId?: string) => setRoute({ name: 'COMPANY_DETAIL', id, fromJobId });
  const navigateCompanyList = () => setRoute({ name: 'COMPANY_LIST' });
  const navigateArticle = (id: number) => setRoute({ name: 'ARTICLE_DETAIL', id });
  const navigateArticleList = () => setRoute({ name: 'ARTICLE_LIST' });
  const navigateLogin = () => setRoute({ name: 'LOGIN' });
  const navigateRegister = () => setRoute({ name: 'REGISTER' });
  const navigateMyPage = (tab?: 'profile' | 'chat' | 'history' | 'status' | 'password') => setRoute({ name: 'MYPAGE', tab });
  
  const navigateApply = (jobId: string) => {
      if (!user) {
          alert("応募するには会員登録（またはログイン）が必要です。");
          navigateRegister();
          return;
      }
      setRoute({ name: 'APPLICATION', jobId });
  };
  
  const navigateCompanyProfile = () => setRoute({ name: 'COMPANY_PROFILE' });
  const navigateTerms = () => setRoute({ name: 'TERMS' });
  const navigatePrivacy = () => setRoute({ name: 'PRIVACY' });
  const navigateTokusho = () => setRoute({ name: 'TOKUSHO' });

  const navigateCompanyLP = () => setRoute({ name: 'COMPANY_LP' });
  const navigateCompanyLogin = () => setRoute({ name: 'COMPANY_LOGIN' });
  const navigateCompanyRegister = () => setRoute({ name: 'COMPANY_REGISTER' });
  const navigateCompanyDashboard = () => setRoute({ name: 'COMPANY_DASHBOARD' });
  const navigateAdminDashboard = () => setRoute({ name: 'ADMIN_DASHBOARD' } as any); 
  
  const handleLogout = () => {
      setUser(null);
      setAdminUser(false);
      navigateHome();
  };

  const handleLoginSuccess = (userName: string, isAdmin: boolean = false) => {
      if (isAdmin) {
          setAdminUser(true);
          navigateAdminDashboard();
      } else {
          setUser(userName);
          navigateMyPage();
      }
  };

  const handleCompanyLoginSuccess = (companyName: string) => {
      setCompanyUser(companyName);
      navigateCompanyDashboard();
  };
  
  const handleCompanyLogout = () => {
      setCompanyUser(null);
      navigateCompanyLP();
  };

  // Admin Impersonation Handlers
  const handleAdminLoginAsCompany = (companyName: string) => {
      setCompanyUser(companyName);
      navigateCompanyDashboard();
  };

  const handleAdminLoginAsStudent = (studentName: string) => {
      setUser(studentName);
      navigateMyPage();
  };

  const handleReturnToAdmin = () => {
      setUser(null);
      setCompanyUser(null);
      navigateAdminDashboard();
  };

  const toggleFavorite = (jobId: string) => {
    setFavorites(prev => {
        const newFavs = new Set(prev);
        if (newFavs.has(jobId)) { newFavs.delete(jobId); } else { newFavs.add(jobId); }
        return newFavs;
    });
  };

  const isCompanyMode = [
      'COMPANY_LP', 
      'COMPANY_LOGIN', 
      'COMPANY_REGISTER', 
      'COMPANY_DASHBOARD'
  ].includes(route.name);

  // Global Breadcrumb Component
  const Breadcrumbs = () => {
      // Don't show on Home or Company side pages
      if (route.name === 'HOME' || isCompanyMode || adminUser) return null;

      let items: { label: string, onClick?: () => void }[] = [{ label: 'インターンシップ募集情報ならTech intern', onClick: navigateHome }];

      switch (route.name) {
          case 'ALL_JOBS':
              items.push({ label: '募集職種一覧' });
              break;
          case 'COMPANY_LIST':
              items.push({ label: '掲載企業一覧' });
              break;
          case 'COMPANY_DETAIL':
              items.push({ label: '掲載企業一覧', onClick: navigateCompanyList });
              const company = JOB_LISTINGS.find(j => j.company.id === (route as any).id)?.company;
              items.push({ label: company?.name || 'Company' });
              break;
          case 'JOB_DETAIL':
              const job = JOB_LISTINGS.find(j => j.id === (route as any).id);
              if (job) {
                  items.push({ label: job.company.industry || 'IT/Web' }); // Industry
                  items.push({ label: job.company.name, onClick: () => navigateCompany(job.company.id) }); // Company
                  items.push({ label: job.tags[0] || 'エンジニア' }); // Job Category
                  items.push({ label: job.title }); // Title
              }
              break;
          case 'ARTICLE_LIST':
              items.push({ label: 'コラム一覧' });
              break;
          case 'ARTICLE_DETAIL':
              items.push({ label: 'コラム一覧', onClick: navigateArticleList });
              const article = articles.find(a => a.id === (route as any).id);
              items.push({ label: article?.title || 'Article' });
              break;
          case 'LOGIN':
              items.push({ label: 'ログイン' });
              break;
          case 'REGISTER':
              items.push({ label: '会員登録' });
              break;
          case 'MYPAGE':
              items.push({ label: 'マイページ' });
              break;
          case 'APPLICATION':
              items.push({ label: '応募フォーム' });
              break;
          case 'COMPANY_PROFILE':
              items.push({ label: '会社概要' });
              break;
          case 'TERMS':
              items.push({ label: '利用規約' });
              break;
          case 'PRIVACY':
              items.push({ label: 'プライバシーポリシー' });
              break;
          case 'TOKUSHO':
              items.push({ label: '特定商取引法に基づく表記' });
              break;
      }

      return (
          <div className="w-full bg-gray-50 border-b border-gray-200">
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
                  <nav className="flex items-center text-[10px] md:text-xs text-gray-500 font-medium overflow-x-auto whitespace-nowrap no-scrollbar">
                      {items.map((item, index) => (
                          <React.Fragment key={index}>
                              {index > 0 && <ChevronRight size={12} className="flex-shrink-0 mx-1 text-gray-300"/>}
                              {item.onClick ? (
                                  <button onClick={item.onClick} className="hover:text-black hover:underline flex-shrink-0">
                                      {item.label}
                                  </button>
                              ) : (
                                  <span className={`flex-shrink-0 ${index === items.length - 1 ? 'text-gray-800 font-bold truncate max-w-[200px] md:max-w-md' : ''}`}>
                                      {item.label}
                                  </span>
                              )}
                          </React.Fragment>
                      ))}
                  </nav>
              </div>
          </div>
      );
  };

  // ----- RENDER HELPERS -----

  const renderHome = () => (
    <>
      <SEO title="Tech intern" />
      {/* Recruiter Link below Header, above Hero */}
      {!user && (
        <div className="w-full flex justify-end px-4 sm:px-6 lg:px-8 py-2">
            <button
                onClick={navigateCompanyLP}
                className="text-xs font-bold tracking-widest text-gray-500 hover:text-black transition-colors flex items-center gap-2 group"
            >
                インターンシップ採用を検討している企業様はこちら
                <span className="opacity-70 group-hover:translate-x-1 transition-transform">&rarr;</span>
            </button>
        </div>
      )}

      <div className="animate-fade-in-up relative overflow-hidden">
        <div className="absolute top-20 right-10 w-32 h-32 bg-blue-400/10 rounded-full blur-3xl animate-float pointer-events-none"></div>
        <div className="absolute top-60 left-10 w-48 h-48 bg-purple-400/10 rounded-full blur-3xl animate-float-delayed pointer-events-none"></div>

        <HeroCarousel onNavigateJobDetail={navigateJobDetail} />
        
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 py-12 relative z-10">
          <div className="flex flex-col lg:flex-row gap-12">
            
            <Sidebar 
                onNavigateProfile={() => {
                    if (user) {
                        navigateMyPage('profile');
                    } else {
                        navigateLogin();
                    }
                }} 
                searchQuery={searchQuery}
                setSearchQuery={setSearchQuery}
                filters={filters}
                setFilters={setFilters}
                hideSearch={true} // Hide Sidebar Search on Home
            />

            <div className="flex-1">
              {/* Big Search Bar - Moved Here */}
              <div className="mb-10 text-center md:text-left opacity-0 animate-fade-in-up [animation-delay:100ms] forwards">
                  <div className="relative max-w-2xl mx-auto md:mx-0 group mb-8">
                        <div className="absolute -inset-1 bg-gradient-to-r from-gray-200 to-gray-300 rounded-lg blur opacity-25 group-hover:opacity-75 transition duration-1000 group-hover:duration-200"></div>
                        <div className="relative">
                            <input 
                                type="text" 
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                placeholder="興味のあるキーワード、言語を入力..." 
                                className="w-full pl-12 pr-4 py-5 bg-white border border-gray-200 rounded-md text-lg shadow-lg focus:border-black focus:ring-0 outline-none transition-all placeholder-gray-400 font-medium"
                            />
                            <Search className="absolute left-4 top-5 text-gray-400 group-focus-within:text-black transition-colors" size={24} />
                        </div>
                  </div>

                  <h2 className="text-2xl md:text-4xl font-black bg-clip-text text-transparent bg-gradient-to-r from-gray-900 via-gray-700 to-gray-500 leading-tight">
                      エンジニアとして経験を積みたいなら<br className="md:hidden"/> Tech intern
                  </h2>
              </div>

              <div className="flex items-end justify-between mb-8 pb-4 border-b border-gray-200/50 opacity-0 animate-fade-in-up [animation-delay:300ms] forwards">
                  <div>
                  <h2 className="text-3xl font-black text-gray-900 tracking-tight">NEW ARRIVALS</h2>
                  <p className="text-xs font-bold text-gray-500 mt-2 uppercase tracking-widest">
                      {filters.occupations.length > 0 || filters.languages.length > 0 ? '検索結果' : '新着のインターンシップ'}
                  </p>
                  </div>
                  {/* Link to All Jobs */}
                  <button 
                    onClick={navigateAllJobs}
                    className="hidden md:flex items-center gap-1 text-sm font-bold border-b border-black pb-0.5 hover:opacity-70 transition-opacity"
                  >
                    募集職種一覧を見る <ArrowRight size={14} />
                  </button>
              </div>

              {filteredJobs.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
                    {/* Show only first 6 for New Arrivals if no filter active, else show all filtered */}
                    {(searchQuery || filters.occupations.length > 0 || filters.languages.length > 0) 
                        ? filteredJobs.map((job, index) => (
                            <div 
                                key={job.id} 
                                onClick={() => navigateJobDetail(job.id)} 
                                className="cursor-pointer opacity-0 animate-fade-in-up forwards"
                                style={{ animationDelay: `${400 + index * 50}ms` }}
                            >
                                <JobCard job={job} />
                            </div>
                        ))
                        : filteredJobs.slice(0, 6).map((job, index) => (
                            <div 
                                key={job.id} 
                                onClick={() => navigateJobDetail(job.id)} 
                                className="cursor-pointer opacity-0 animate-fade-in-up forwards"
                                style={{ animationDelay: `${400 + index * 50}ms` }}
                            >
                                <JobCard job={job} />
                            </div>
                        ))
                    }
                </div>
              ) : (
                <div className="text-center py-20 bg-white rounded-sm border border-gray-200">
                    <p className="text-gray-500 font-bold">条件に一致する求人は見つかりませんでした。</p>
                    <button onClick={() => { setSearchQuery(''); setFilters({occupations: [], languages: [], industries: [], areas: [], characteristics: []}); }} className="mt-4 text-blue-600 font-bold hover:underline">
                        検索条件をクリアする
                    </button>
                </div>
              )}
              
              <div className="mt-12 text-center md:hidden">
                 <button 
                  onClick={navigateAllJobs} 
                  className="inline-flex items-center gap-2 text-sm font-bold border border-gray-300 px-6 py-3 rounded-sm hover:bg-black hover:text-white transition-colors"
                >
                  募集職種一覧を見る <ArrowRight size={14} />
                </button>
              </div>
              
              {/* Company Section */}
              <div className="mt-20">
                  <CompanySection onNavigateCompanyList={navigateCompanyList} onNavigateCompanyDetail={navigateCompany} />
              </div>

              {/* Column Section */}
              <div className="mt-8">
                  <ColumnSection articles={articles} onNavigateArticle={navigateArticle} onNavigateArticleList={navigateArticleList} />
              </div>
            </div>
          </div>
        </div>

        <div className="opacity-0 animate-fade-in-up [animation-delay:800ms] forwards">
            <FlowSection onNavigateRegister={navigateRegister} isLoggedIn={!!user} />
        </div>
        <div className="opacity-0 animate-fade-in-up [animation-delay:900ms] forwards">
            <FaqSection faqs={faqs} />
        </div>

        {/* Social Media Section - Added */}
        <section className="py-24 bg-white border-t border-gray-200 opacity-0 animate-fade-in-up [animation-delay:1000ms] forwards">
            <div className="max-w-7xl mx-auto px-6 text-center">
                <h2 className="text-3xl font-black text-gray-900 mb-10 tracking-tight uppercase">FOLLOW US</h2>
                <div className="flex justify-center gap-8">
                    <a href="https://twitter.com" target="_blank" rel="noreferrer" className="group flex flex-col items-center">
                        <div className="w-16 h-16 bg-black text-white rounded-full flex items-center justify-center mb-3 group-hover:scale-110 transition-transform shadow-lg">
                            <svg viewBox="0 0 24 24" fill="currentColor" className="w-8 h-8"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"></path></svg>
                        </div>
                        <span className="text-sm font-bold text-gray-900 group-hover:text-blue-600 transition-colors">X (Twitter)</span>
                    </a>
                    <a href="https://instagram.com" target="_blank" rel="noreferrer" className="group flex flex-col items-center">
                        <div className="w-16 h-16 bg-black text-white rounded-full flex items-center justify-center mb-3 group-hover:scale-110 transition-transform shadow-lg">
                            <Instagram size={32} />
                        </div>
                        <span className="text-sm font-bold text-gray-900 group-hover:text-pink-600 transition-colors">Instagram</span>
                    </a>
                </div>
            </div>
        </section>
      </div>
    </>
  );

  const renderJobDetail = () => {
      const job = JOB_LISTINGS.find(j => j.id === (route as any).id);
      if (!job) return <div>Not Found</div>;
      return (
        <>
            <SEO title={`${job.title} - ${job.company.name}`} />
            <div className="animate-fade-in-up">
                <JobDetailPage 
                    job={job} 
                    isFavorite={favorites.has(job.id)}
                    onToggleFavorite={() => toggleFavorite(job.id)}
                    onNavigateCompany={(companyId) => navigateCompany(companyId, job.id)} 
                    onNavigateApply={navigateApply}
                    onNavigateJobDetail={navigateJobDetail} 
                    onBack={navigateHome} 
                />
            </div>
        </>
      );
  };

  const renderCompanyDetail = () => {
      const company = JOB_LISTINGS.find(j => j.company.id === (route as any).id)?.company;
      if (!company) return <div>Not Found</div>;
      return (
          <>
            <SEO title={`${company.name} 採用情報`} />
            <div className="animate-fade-in-up">
                <CompanyPage company={company} onBack={navigateHome} onNavigateJobDetail={navigateJobDetail} fromJobId={(route as any).fromJobId} />
            </div>
          </>
      );
  };

  const renderMyPage = () => {
      if (!user) return null;
      return (
          <>
            <SEO title="マイページ" />
            <div className="animate-fade-in-up">
                <MyPage 
                    userName={user} 
                    favorites={favorites} 
                    browsingHistory={browsingHistory}
                    onNavigateJobDetail={navigateJobDetail} 
                    onNavigateHome={navigateHome}
                    initialTab={(route as any).tab}
                />
            </div>
          </>
      );
  };

  // ----- MAIN RENDER -----

  // Floating button for Admin return
  const adminReturnButton = adminUser && (route as any).name !== 'ADMIN_DASHBOARD' && (
      <div className="fixed bottom-6 right-6 z-50 animate-fade-in-up">
          <button 
            onClick={handleReturnToAdmin}
            className="bg-red-600 text-white px-6 py-4 rounded-full shadow-2xl font-bold flex items-center gap-2 hover:bg-red-700 hover:scale-105 transition-all border-2 border-white"
          >
              <LogOut size={20} /> 運営管理画面に戻る
          </button>
      </div>
  );

  // Admin Dashboard Route
  if ((route as any).name === 'ADMIN_DASHBOARD' && adminUser) {
      return (
          <main key="admin" className="animate-fade-in">
              <SEO title="運営管理画面" />
              <AdminDashboard 
                  onLogout={handleLogout} 
                  onLoginAsCompany={handleAdminLoginAsCompany}
                  onLoginAsStudent={handleAdminLoginAsStudent}
                  articles={articles}
                  setArticles={setArticles}
                  faqs={faqs}
                  setFaqs={setFaqs}
              />
          </main>
      );
  }

  if (isCompanyMode) {
      return (
          <main key={route.name} className="animate-fade-in">
              {adminReturnButton}
              {route.name === 'COMPANY_LP' && (
                  <>
                    <SEO title="企業様向け" />
                    <CompanyLP 
                      onNavigateLogin={navigateCompanyLogin} 
                      onNavigateRegister={navigateCompanyRegister} 
                      onNavigateTerms={navigateTerms}
                      onNavigatePrivacy={navigatePrivacy}
                      onNavigateTokusho={navigateTokusho}
                    />
                  </>
              )}
              {route.name === 'COMPANY_LOGIN' && (
                  <>
                    <SEO title="企業ログイン" />
                    <CompanyLogin onLoginSuccess={handleCompanyLoginSuccess} onNavigateAlternate={navigateCompanyRegister} onBack={navigateHome} />
                  </>
              )}
              {route.name === 'COMPANY_REGISTER' && (
                   <>
                    <SEO title="企業登録" />
                    <CompanyRegister onLoginSuccess={handleCompanyLoginSuccess} onNavigateAlternate={navigateCompanyLogin} onBack={navigateHome} />
                   </>
              )}
              {route.name === 'COMPANY_DASHBOARD' && companyUser && (
                   <>
                    <SEO title="企業管理画面" />
                    <CompanyDashboard companyName={companyUser} onLogout={handleCompanyLogout} onNavigateHome={navigateHome} />
                   </>
              )}
          </main>
      );
  }

  // Student/Public Mode
  return (
    <div className="min-h-screen flex flex-col font-sans text-gray-900 overflow-x-hidden">
      {adminReturnButton}
      <Header 
        user={user}
        onNavigateHome={navigateHome}
        onNavigateLogin={navigateLogin}
        onNavigateRegister={navigateRegister}
        onNavigateMyPage={() => navigateMyPage()}
        onNavigateRecruiter={navigateCompanyLP}
        onLogout={handleLogout}
      />
      
      {/* Global Breadcrumbs (New) */}
      <Breadcrumbs />
      
      <main className="flex-grow w-full" key={route.name + ((route as any).id || '')}>
        {route.name === 'HOME' && renderHome()}
        {route.name === 'JOB_DETAIL' && renderJobDetail()}
        {route.name === 'COMPANY_DETAIL' && renderCompanyDetail()}
        {route.name === 'COMPANY_LIST' && (
            <div className="animate-fade-in-up">
                <CompanyListPage onBack={navigateHome} onNavigateCompanyDetail={navigateCompany} />
            </div>
        )}
        {route.name === 'ALL_JOBS' && (
            <div className="animate-fade-in-up">
                <AllJobsPage 
                    jobs={filteredJobs} 
                    onNavigateJobDetail={navigateJobDetail} 
                    onNavigateHome={navigateHome} 
                    onNavigateProfile={() => user ? navigateMyPage('profile') : navigateLogin()}
                    searchQuery={searchQuery}
                    setSearchQuery={setSearchQuery}
                    filters={filters}
                    setFilters={setFilters}
                />
            </div>
        )}
        {route.name === 'ARTICLE_LIST' && (
            <div className="animate-fade-in-up">
                <ArticleListPage articles={articles} onNavigateArticle={navigateArticle} onBack={navigateHome} />
            </div>
        )}
        {route.name === 'ARTICLE_DETAIL' && (
            <div className="animate-fade-in-up">
                <ArticlePage article={articles.find(a => a.id === (route as any).id)!} onBack={navigateHome} />
            </div>
        )}
        {route.name === 'APPLICATION' && (
            <div className="animate-fade-in-up">
                <ApplicationPage 
                    job={JOB_LISTINGS.find(j => j.id === (route as any).jobId)!} 
                    onBack={() => navigateJobDetail((route as any).jobId)} 
                    onSubmit={() => { alert('応募完了'); navigateMyPage('status'); }} 
                    initialData={user ? userProfile : null}
                />
            </div>
        )}
        {route.name === 'LOGIN' && (
            <div className="animate-fade-in-up">
                <LoginPage onLoginSuccess={handleLoginSuccess} onNavigateRegister={navigateRegister} />
            </div>
        )}
        {route.name === 'REGISTER' && (
            <div className="animate-fade-in-up">
                <RegisterPage onLoginSuccess={(name) => handleLoginSuccess(name)} onNavigateLogin={navigateLogin} />
            </div>
        )}
        {route.name === 'MYPAGE' && renderMyPage()}
        
        {route.name === 'COMPANY_PROFILE' && <CompanyProfilePage onBack={navigateHome} onNavigateTokusho={navigateTokusho} />}
        {route.name === 'TERMS' && <TermsPage onBack={navigateHome} />}
        {route.name === 'PRIVACY' && <PrivacyPage onBack={navigateHome} />}
        {route.name === 'TOKUSHO' && <TokushoPage onBack={navigateHome} />}
      </main>

      <Footer 
        onNavigateHome={navigateHome}
        onNavigateTerms={navigateTerms}
        onNavigatePrivacy={navigatePrivacy}
        onNavigateTokusho={navigateTokusho}
        onNavigateCompanyProfile={navigateCompanyProfile}
        onNavigateCompanyLP={navigateCompanyLP}
        onNavigateCompanyLogin={navigateCompanyLogin}
        onNavigateCompanyList={navigateCompanyList}
      />
    </div>
  );
};

export default App;
