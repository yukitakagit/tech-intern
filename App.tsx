import React, { useState, useEffect, useMemo } from 'react';
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
import { ApplicationPage } from './components/ApplicationPage';
import { SEO } from './components/SEO';
import { Footer } from './components/Footer';
import { CompanyProfilePage, TermsPage, PrivacyPage } from './components/StaticPages';
import { CompanyLP } from './components/CompanySide/CompanyLP';
import { CompanyLogin, CompanyRegister } from './components/CompanySide/CompanyAuth';
import { CompanyDashboard } from './components/CompanySide/CompanyDashboard';
import { JOB_LISTINGS, ARTICLES } from './constants';
import { JobListing, FilterState, AppRoute } from './types';
import { Search } from 'lucide-react';

const App: React.FC = () => {
  const [route, setRoute] = useState<AppRoute>({ name: 'HOME' });
  const [user, setUser] = useState<string | null>(null);
  const [companyUser, setCompanyUser] = useState<string | null>(null); // State for company user
  const [favorites, setFavorites] = useState<Set<string>>(new Set());
  const [browsingHistory, setBrowsingHistory] = useState<string[]>([]);

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
        // 1. Search Query
        if (searchQuery) {
            const lowerQ = searchQuery.toLowerCase();
            const textMatch = 
                job.title.toLowerCase().includes(lowerQ) ||
                job.company.name.toLowerCase().includes(lowerQ) ||
                job.description.toLowerCase().includes(lowerQ) ||
                job.tags.some(tag => tag.toLowerCase().includes(lowerQ));
            if (!textMatch) return false;
        }

        // 2. Occupations (Match Tags or Title)
        if (filters.occupations.length > 0) {
            const occupationMatch = filters.occupations.some(filterItem => 
                job.title.includes(filterItem) || 
                job.tags.some(tag => tag.includes(filterItem))
            );
            if (!occupationMatch) return false;
        }

        // 3. Languages (Match Tags)
        if (filters.languages.length > 0) {
            const langMatch = filters.languages.some(filterItem => 
                job.tags.some(tag => tag.toLowerCase() === filterItem.toLowerCase() || tag.includes(filterItem)) ||
                job.requiredSkills.some(skill => skill.toLowerCase() === filterItem.toLowerCase())
            );
            if (!langMatch) return false;
        }

        // 4. Industries
        if (filters.industries.length > 0) {
            const industryMatch = filters.industries.some(filterItem => 
                job.company.industry?.includes(filterItem) || 
                job.company.description?.includes(filterItem)
            );
            if (!industryMatch) return false;
        }

        // 5. Areas
        if (filters.areas.length > 0) {
            const areaMatch = filters.areas.some(filterItem => {
                if (filterItem === 'フルリモート') return job.workStyle === 'Remote';
                return job.company.location.includes(filterItem) || job.company.address?.includes(filterItem);
            });
            if (!areaMatch) return false;
        }

        // 6. Characteristics
        if (filters.characteristics.length > 0) {
             const charMatch = filters.characteristics.every(filterItem => {
                 if (filterItem === '時給1500円以上') {
                     // Very basic parsing for demo
                     const salaryNum = parseInt(job.salary.replace(/[^0-9]/g, ''));
                     return salaryNum >= 1500;
                 }
                 if (filterItem === '未経験歓迎') return job.tags.includes('未経験歓迎');
                 if (filterItem === '土日勤務OK') return job.workStyle === 'Hybrid' || job.workStyle === 'Remote'; // Loose match for demo
                 // Default loose match on tags
                 return job.tags.includes(filterItem);
             });
             if (!charMatch) return false;
        }

        return true;
    });
  }, [searchQuery, filters]);

  // Scroll to top on route change
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [route.name, (route as any).id, (route as any).jobId]);

  // Navigation Handlers
  const navigateHome = () => setRoute({ name: 'HOME' });
  
  const navigateJobDetail = (id: string) => {
      // Add to history
      setBrowsingHistory(prev => {
          // Remove if exists to move to top, then add to front
          const newHistory = prev.filter(hid => hid !== id);
          return [id, ...newHistory].slice(0, 10); // Keep last 10
      });
      setRoute({ name: 'JOB_DETAIL', id });
  };

  const navigateCompany = (id: string, fromJobId?: string) => setRoute({ name: 'COMPANY_DETAIL', id, fromJobId });
  const navigateArticle = (id: number) => setRoute({ name: 'ARTICLE_DETAIL', id });
  const navigateLogin = () => setRoute({ name: 'LOGIN' });
  const navigateRegister = () => setRoute({ name: 'REGISTER' });
  const navigateMyPage = (tab?: 'profile' | 'chat' | 'history' | 'status' | 'password') => setRoute({ name: 'MYPAGE', tab });
  const navigateApply = (jobId: string) => setRoute({ name: 'APPLICATION', jobId });
  
  const navigateCompanyProfile = () => setRoute({ name: 'COMPANY_PROFILE' });
  const navigateTerms = () => setRoute({ name: 'TERMS' });
  const navigatePrivacy = () => setRoute({ name: 'PRIVACY' });

  // Company Side Navigation
  const navigateCompanyLP = () => setRoute({ name: 'COMPANY_LP' });
  const navigateCompanyLogin = () => setRoute({ name: 'COMPANY_LOGIN' });
  const navigateCompanyRegister = () => setRoute({ name: 'COMPANY_REGISTER' });
  const navigateCompanyDashboard = () => setRoute({ name: 'COMPANY_DASHBOARD' });
  
  const handleLogout = () => {
      setUser(null);
      navigateHome();
  };

  const handleLoginSuccess = (userName: string) => {
      setUser(userName);
      navigateMyPage();
  };

  const handleCompanyLoginSuccess = (companyName: string) => {
      setCompanyUser(companyName);
      navigateCompanyDashboard();
  };
  
  const handleCompanyLogout = () => {
      setCompanyUser(null);
      navigateCompanyLP();
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

  // ----- RENDER HELPERS WITH SEO -----

  const renderHome = () => (
    <>
      <SEO 
        title="Tech intern" 
        jsonLd={{
          "@context": "https://schema.org",
          "@type": "Organization",
          "name": "Tech intern",
          "url": window.location.href,
          "logo": "https://picsum.photos/id/1/100/100", // Placeholder
          "sameAs": ["https://twitter.com/techintern"]
        }}
      />
      <div className="animate-fade-in-up">
        <HeroCarousel />
        
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="flex flex-col lg:flex-row gap-12">
            
            {/* Sidebar Filters */}
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
            />

            {/* Main Content Area */}
            <div className="flex-1">
              {/* Mobile Search & Filter */}
              <div className="lg:hidden mb-8 flex gap-3">
                  <div className="relative flex-1">
                      <input 
                      type="text" 
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
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
                      {filters.occupations.length > 0 || filters.languages.length > 0 ? '検索結果' : '新着のインターンシップ'}
                  </p>
                  </div>
                  <span className="text-sm font-medium text-gray-500">
                      <span className="text-black font-black text-xl">{filteredJobs.length}</span> results
                  </span>
              </div>

              {/* Job Grid */}
              {filteredJobs.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
                    {filteredJobs.map((job) => (
                    <div key={job.id} onClick={() => navigateJobDetail(job.id)} className="cursor-pointer">
                        <JobCard job={job} />
                    </div>
                    ))}
                </div>
              ) : (
                <div className="text-center py-20 bg-white rounded-sm border border-gray-200">
                    <p className="text-gray-500 font-bold">条件に一致する求人は見つかりませんでした。</p>
                    <button 
                        onClick={() => {
                            setSearchQuery('');
                            setFilters({
                                occupations: [],
                                languages: [],
                                industries: [],
                                areas: [],
                                characteristics: []
                            });
                        }}
                        className="mt-4 text-blue-600 font-bold hover:underline"
                    >
                        検索条件をクリアする
                    </button>
                </div>
              )}
              
              {/* Pagination (Visual Only for now) */}
              {filteredJobs.length > 0 && (
                <div className="mt-16 flex justify-center mb-20">
                    <div className="flex gap-2">
                        {[1].map((page) => (
                            <button 
                                key={page}
                                className={`w-10 h-10 rounded-sm flex items-center justify-center text-sm font-bold transition-all bg-black text-white`}
                            >
                                {page}
                            </button>
                        ))}
                    </div>
                </div>
              )}

              {/* New Content Sections */}
              <ColumnSection onNavigateArticle={navigateArticle} />
              
            </div>
          </div>
        </div>

        {/* Full width sections below main container */}
        <FlowSection onNavigateRegister={navigateRegister} />
        <FaqSection />
      </div>
    </>
  );

  const renderJobDetail = () => {
      const job = JOB_LISTINGS.find(j => j.id === (route as any).id);
      if (!job) return <div>Not Found</div>;

      const jobPostingSchema = {
        "@context": "https://schema.org",
        "@type": "JobPosting",
        "title": job.title,
        "description": job.description,
        "datePosted": "2024-05-01", // Mock date
        "validThrough": "2024-12-31",
        "employmentType": job.type === 'Long-term' ? "PART_TIME" : "INTERN",
        "hiringOrganization": {
          "@type": "Organization",
          "name": job.company.name,
          "logo": job.company.logoUrl
        },
        "jobLocation": {
          "@type": "Place",
          "address": {
            "@type": "PostalAddress",
            "addressLocality": job.company.location
          }
        },
        "baseSalary": {
            "@type": "MonetaryAmount",
            "currency": "JPY",
            "value": {
                "@type": "QuantitativeValue",
                "value": 1200, // Extracted from string mock
                "unitText": "HOUR"
            }
        }
      };

      return (
        <>
            <SEO 
                title={`${job.title} - ${job.company.name}`} 
                description={`${job.title}。${job.description.substring(0, 100)}...`}
                ogType="article"
                ogImage={job.coverImageUrl}
                jsonLd={jobPostingSchema}
            />
            <div className="animate-fade-in-up">
                <JobDetailPage 
                    job={job} 
                    isFavorite={favorites.has(job.id)}
                    onToggleFavorite={() => toggleFavorite(job.id)}
                    onNavigateCompany={(companyId) => navigateCompany(companyId, job.id)} 
                    onNavigateApply={navigateApply}
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
            <SEO title={`${company.name} 採用情報`} description={company.description} />
            <div className="animate-fade-in-up">
                <CompanyPage 
                    company={company} 
                    onBack={navigateHome} 
                    onNavigateJobDetail={navigateJobDetail}
                    fromJobId={(route as any).fromJobId}
                />
            </div>
          </>
      );
  };

  const renderArticleDetail = () => {
      const article = ARTICLES.find(a => a.id === (route as any).id);
      if (!article) return <div>Not Found</div>;
      return (
        <>
            <SEO title={article.title} description={`${article.title} - Tech intern コラム`} ogType="article" ogImage={article.image} />
            <div className="animate-fade-in-up">
                <ArticlePage article={article} onBack={navigateHome} />
            </div>
        </>
      );
  };

  const renderApplication = () => {
      const job = JOB_LISTINGS.find(j => j.id === (route as any).jobId);
      if (!job) return <div>Job Not Found</div>;
      return (
        <>
            <SEO title={`応募フォーム: ${job.title}`} />
            <div className="animate-fade-in-up">
                <ApplicationPage job={job} onBack={() => navigateJobDetail(job.id)} onSubmit={() => {
                    alert('応募が完了しました！');
                    navigateMyPage('status');
                }} />
            </div>
        </>
      );
  };

  const renderLogin = () => (
      <>
        <SEO title="ログイン" />
        <div className="animate-fade-in-up">
             <LoginPage onLoginSuccess={handleLoginSuccess} onNavigateRegister={navigateRegister} />
        </div>
      </>
  );

  const renderRegister = () => (
      <>
        <SEO title="会員登録" />
        <div className="animate-fade-in-up">
            <RegisterPage onLoginSuccess={handleLoginSuccess} onNavigateLogin={navigateLogin} />
        </div>
      </>
  );

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

  // Check if we are in Company Mode routes
  const isCompanyMode = [
      'COMPANY_LP', 
      'COMPANY_LOGIN', 
      'COMPANY_REGISTER', 
      'COMPANY_DASHBOARD'
  ].includes(route.name);

  if (isCompanyMode) {
      return (
          <main key={route.name} className="animate-fade-in">
              {route.name === 'COMPANY_LP' && (
                  <>
                    <SEO title="企業様向け - Tech intern" description="エンジニアインターン採用ならTech intern。"/>
                    <CompanyLP 
                        onNavigateLogin={navigateCompanyLogin} 
                        onNavigateRegister={navigateCompanyRegister} 
                    />
                  </>
              )}
              {route.name === 'COMPANY_LOGIN' && (
                  <>
                    <SEO title="企業ログイン" />
                    <CompanyLogin 
                        onLoginSuccess={handleCompanyLoginSuccess} 
                        onNavigateAlternate={navigateCompanyRegister}
                        onBack={navigateHome}
                    />
                  </>
              )}
              {route.name === 'COMPANY_REGISTER' && (
                   <>
                    <SEO title="企業登録" />
                    <CompanyRegister 
                        onLoginSuccess={handleCompanyLoginSuccess} 
                        onNavigateAlternate={navigateCompanyLogin}
                        onBack={navigateHome}
                    />
                   </>
              )}
              {route.name === 'COMPANY_DASHBOARD' && companyUser && (
                   <>
                    <SEO title="企業管理画面" />
                    <CompanyDashboard 
                        companyName={companyUser} 
                        onLogout={handleCompanyLogout} 
                    />
                   </>
              )}
          </main>
      );
  }

  // Student/Public Mode
  return (
    <div className="min-h-screen flex flex-col font-sans text-gray-900 overflow-x-hidden">
      <Header 
        user={user}
        onNavigateHome={navigateHome}
        onNavigateLogin={navigateLogin}
        onNavigateRegister={navigateRegister}
        onNavigateMyPage={() => navigateMyPage()}
        onNavigateRecruiter={navigateCompanyLP}
        onLogout={handleLogout}
      />
      
      {/* 
        Key prop on main ensures animations trigger on route change 
        by treating it as a new component mount
      */}
      <main className="flex-grow w-full" key={route.name + ((route as any).id || '')}>
        {route.name === 'HOME' && renderHome()}
        {route.name === 'JOB_DETAIL' && renderJobDetail()}
        {route.name === 'COMPANY_DETAIL' && renderCompanyDetail()}
        {route.name === 'ARTICLE_DETAIL' && renderArticleDetail()}
        {route.name === 'APPLICATION' && renderApplication()}
        {route.name === 'LOGIN' && renderLogin()}
        {route.name === 'REGISTER' && renderRegister()}
        {route.name === 'MYPAGE' && renderMyPage()}
        
        {route.name === 'COMPANY_PROFILE' && (
            <>
                <SEO title="会社概要" />
                <div className="animate-fade-in-up">
                    <CompanyProfilePage onBack={navigateHome} />
                </div>
            </>
        )}
        {route.name === 'TERMS' && (
             <>
                <SEO title="利用規約" />
                <div className="animate-fade-in-up">
                    <TermsPage onBack={navigateHome} />
                </div>
            </>
        )}
        {route.name === 'PRIVACY' && (
             <>
                <SEO title="プライバシーポリシー" />
                <div className="animate-fade-in-up">
                    <PrivacyPage onBack={navigateHome} />
                </div>
            </>
        )}
      </main>

      <Footer 
        onNavigateHome={navigateHome}
        onNavigateTerms={navigateTerms}
        onNavigatePrivacy={navigatePrivacy}
        onNavigateCompanyProfile={navigateCompanyProfile}
      />
    </div>
  );
};

export default App;