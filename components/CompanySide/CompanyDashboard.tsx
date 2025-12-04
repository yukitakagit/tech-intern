
import React, { useState } from 'react';
import { Company, JobListing } from '../../types';
import { JOB_LISTINGS } from '../../constants';
import { 
    Save, LogOut, Building2, Globe, Users, FileText, 
    Briefcase, LayoutDashboard, MessageSquare, Plus, Edit2, Search, Send, Trash2, ChevronDown, CheckCircle,
    Home, BarChart2, X, AlertCircle, Upload, Clock, DollarSign, Eye, ArrowLeft, ArrowRight, Info
} from 'lucide-react';
import { CompanyPage } from '../CompanyPage';
import { JobDetailPage } from '../JobDetailPage';

interface CompanyDashboardProps {
  companyName: string;
  onLogout: () => void;
  onNavigateHome: () => void;
}

type DashboardTab = 'info' | 'recruitment' | 'candidates' | 'analytics';

export const CompanyDashboard: React.FC<CompanyDashboardProps> = ({ companyName, onLogout, onNavigateHome }) => {
  const [activeTab, setActiveTab] = useState<DashboardTab>('analytics');
  
  // State for Contact Admin Modal
  const [showContactModal, setShowContactModal] = useState(false);
  const [contactForm, setContactForm] = useState({
      subject: '',
      companyName: companyName,
      email: '',
      jobTitle: '',
      candidateName: '',
      remarks: ''
  });

  // State for Student Profile Modal
  const [showStudentModal, setShowStudentModal] = useState(false);

  // State for Company Info
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [profile, setProfile] = useState<Partial<Company>>({
    id: 'c1', // Mock ID for preview
    name: companyName,
    industry: 'システム開発',
    location: '東京都渋谷区...',
    url: 'https://kaxin.jp',
    description: '私たちは、最先端の技術を活用してクライアントの課題を解決するプロフェッショナル集団です。\nエンジニアインターンの皆様には、実際のプロジェクトチームに参加していただき、要件定義から設計、実装、テストまでの一連の開発プロセスを経験していただきます。',
    businessContent: '・Webアプリケーション受託開発\n・モバイルアプリ開発\n・AIソリューション導入支援\n・自社SaaSプロダクトの企画・運営',
    representative: '藤巻 雄飛',
    employees: '10-50名',
    established: '2024年',
    coverImage: 'https://picsum.photos/id/1/800/450' 
  });

  // State for Recruitment
  const [jobs, setJobs] = useState<JobListing[]>(JOB_LISTINGS.slice(0, 3).map(j => ({...j, status: 'published'})));
  const [viewingJob, setViewingJob] = useState<JobListing | null>(null); 
  const [isEditingJob, setIsEditingJob] = useState(false); 
  const [editingJobData, setEditingJobData] = useState<Partial<JobListing> | null>(null);

  // State for Candidates Chat
  const [candidates, setCandidates] = useState([
      { id: 'u1', name: '田中 太郎', university: '東京工科大学', status: '書類選考通過', appliedJob: 'Go言語バックエンド', appliedDate: '2024-05-01', lastMsg: 'ありがとうございます。日程調整の件...' },
      { id: 'u2', name: '鈴木 一郎', university: '早稲田大学', status: 'カジュアル面談', appliedJob: 'フロントエンド', appliedDate: '2024-05-03', lastMsg: 'ポートフォリオをお送りします。' },
      { id: 'u3', name: '佐藤 花子', university: '慶應義塾大学', status: '新規応募', appliedJob: 'Go言語バックエンド', appliedDate: '2024-05-05', lastMsg: 'はじめまして。貴社のビジョンに共感し...' },
      { id: 'u4', name: '山田 次郎', university: '筑波大学', status: 'お見送り', appliedJob: 'モバイルアプリ', appliedDate: '2024-04-20', lastMsg: 'またご縁がありましたら...' },
      { id: 'u5', name: '高橋 健太', university: '東京大学', status: '内定', appliedJob: 'Go言語バックエンド', appliedDate: '2024-04-10', lastMsg: '内定ありがとうございます！' },
  ]);
  const [selectedCandidateId, setSelectedCandidateId] = useState<string | null>(null);
  const [chatInput, setChatInput] = useState('');
  
  // Dummy Chat messages state
  const [chatMessages, setChatMessages] = useState([
      { id: 1, sender: 'student', text: 'はじめまして。貴社のビジョンに共感し、応募させていただきました。ポートフォリオをお送りしますのでご確認いただけますと幸いです。' },
      { id: 2, sender: 'company', text: 'ご応募ありがとうございます！プロフィールを拝見し、ぜひお話ししたいと思いました。日程調整フォームをお送りします。' }
  ]);

  // --- Handlers ---

  const handleProfileChange = (field: keyof Company, value: string) => {
      setProfile(prev => ({ ...prev, [field]: value }));
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>, field: 'profile' | 'job') => {
      const file = e.target.files?.[0];
      if (file) {
          const reader = new FileReader();
          reader.onloadend = () => {
              const result = reader.result as string;
              if (field === 'profile') {
                  setProfile(prev => ({ ...prev, coverImage: result }));
              } else if (field === 'job' && editingJobData) {
                  setEditingJobData({ ...editingJobData, coverImageUrl: result });
              }
          };
          reader.readAsDataURL(file);
      }
  };

  const handleProfileSave = () => {
      setIsEditingProfile(false);
      alert('企業情報を保存・公開しました。');
  };

  const handleAddNewJob = () => {
      const newJob: Partial<JobListing> = {
          title: '',
          salary: '時給 1,200円〜',
          workStyle: 'Hybrid',
          coverImageUrl: 'https://picsum.photos/id/1/800/450',
          tags: [],
          description: profile.description || '',
          businessContent: profile.businessContent || '',
          jobDetail: '',
          skillsGained: [],
          selectionFlow: [
              { step: 1, title: '書類選考', description: 'プロフィールをもとに選考します' },
              { step: 2, title: 'カジュアル面談', description: 'オンラインで実施' },
              { step: 3, title: '内定', description: '' }
          ],
          status: 'draft',
          company: profile as Company
      };
      setEditingJobData(newJob);
      setIsEditingJob(true);
      setViewingJob(null); 
  };

  const handleEditExistingJob = (job: JobListing) => {
      setEditingJobData({ ...job });
      setIsEditingJob(true);
  };

  const handleDeleteJob = (jobId: string) => {
      if (confirm('この求人を削除してもよろしいですか？\nこの操作は取り消せません。')) {
          setJobs(prev => prev.filter(j => j.id !== jobId));
          if (viewingJob?.id === jobId) setViewingJob(null);
      }
  };

  const handleJobSave = (status: 'published' | 'draft') => {
      if (!editingJobData) return;
      
      const newJob = { ...editingJobData, status } as JobListing;
      if (!newJob.id) newJob.id = `new-${Date.now()}`;
      if (!newJob.company) newJob.company = profile as Company;
      
      const existingIndex = jobs.findIndex(j => j.id === newJob.id);
      if (existingIndex >= 0) {
          const updated = [...jobs];
          updated[existingIndex] = newJob;
          setJobs(updated);
      } else {
          setJobs([newJob, ...jobs]);
      }

      alert(status === 'published' ? '求人情報を公開しました。' : '求人情報を下書き保存しました。');
      setIsEditingJob(false);
      setViewingJob(newJob); 
      setEditingJobData(null);
  };

  const handleStatusChange = (id: string, newStatus: string) => {
      setCandidates(prev => prev.map(c => c.id === id ? { ...c, status: newStatus } : c));
  };

  const handleHire = (candidateId: string) => {
     handleStatusChange(candidateId, '内定'); 
     const candidate = candidates.find(c => c.id === candidateId);
     setContactForm({
         ...contactForm,
         subject: `採用報告: ${candidate?.name} 様`,
         candidateName: candidate?.name || '',
         jobTitle: candidate?.appliedJob || '',
         remarks: '採用としましたのでご報告いたします。'
     });
     setShowContactModal(true);
  };

  const handleReject = (candidateId: string) => {
     if (confirm('本当に不採用にしますか？')) {
         handleStatusChange(candidateId, 'お見送り');
     }
  };

  const handleSendContact = () => {
      alert('運営事務局へメッセージを送信しました。');
      setShowContactModal(false);
      setContactForm({ subject: '', companyName: companyName, email: '', jobTitle: '', candidateName: '', remarks: '' });
  };

  const handleSendMessage = () => {
      if (!chatInput.trim()) return;
      setChatMessages([...chatMessages, { id: Date.now(), sender: 'company', text: chatInput }]);
      setChatInput('');
  };

  const handleFlowChange = (index: number, field: 'title' | 'description', value: string) => {
      if (!editingJobData || !editingJobData.selectionFlow) return;
      const newFlow = [...editingJobData.selectionFlow];
      newFlow[index] = { ...newFlow[index], [field]: value };
      setEditingJobData({ ...editingJobData, selectionFlow: newFlow });
  };

  const addFlowStep = () => {
       if (!editingJobData) return;
       const currentFlow = editingJobData.selectionFlow || [];
       setEditingJobData({ 
           ...editingJobData, 
           selectionFlow: [...currentFlow, { step: currentFlow.length + 1, title: '', description: '' }] 
       });
  };

  const removeFlowStep = (index: number) => {
      if (!editingJobData || !editingJobData.selectionFlow) return;
      const newFlow = editingJobData.selectionFlow.filter((_, i) => i !== index).map((step, i) => ({ ...step, step: i + 1 }));
      setEditingJobData({ ...editingJobData, selectionFlow: newFlow });
  };

  // --- Render Functions ---

  const renderAnalytics = () => {
      const totalApplicants = candidates.length;
      const newApplicants = candidates.filter(c => c.status === '新規応募').length;
      const hired = candidates.filter(c => c.status === '内定').length;
      const processing = totalApplicants - newApplicants - hired - candidates.filter(c => c.status === 'お見送り').length;

      return (
          <div className="p-8 md:p-10 max-w-7xl mx-auto space-y-8 animate-fade-in-up">
              <div className="flex justify-between items-center">
                  <div>
                      <h2 className="text-2xl font-black text-gray-900 tracking-tight">情報管理ダッシュボード</h2>
                      <p className="text-sm text-gray-500 font-medium">採用状況の一元管理</p>
                  </div>
                  <p className="text-sm text-gray-400 font-mono bg-white px-3 py-1 rounded-sm border border-gray-200">{new Date().toLocaleDateString()}</p>
              </div>

              {/* Stats Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-4 gap-6">
                  <div className="bg-white p-6 rounded-sm shadow-sm border border-gray-100">
                      <div className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">総応募者数</div>
                      <div className="text-4xl font-black text-gray-900">{totalApplicants}</div>
                  </div>
                  <div className="bg-white p-6 rounded-sm shadow-sm border border-gray-100 border-l-4 border-l-blue-500">
                      <div className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">新規応募</div>
                      <div className="text-4xl font-black text-blue-600">{newApplicants}</div>
                  </div>
                  <div className="bg-white p-6 rounded-sm shadow-sm border border-gray-100 border-l-4 border-l-orange-500">
                      <div className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">選考中</div>
                      <div className="text-4xl font-black text-orange-600">{processing}</div>
                  </div>
                  <div className="bg-white p-6 rounded-sm shadow-sm border border-gray-100 border-l-4 border-l-green-500">
                      <div className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">採用</div>
                      <div className="text-4xl font-black text-green-600">{hired}</div>
                  </div>
              </div>

              {/* Candidates List Table */}
              <div className="bg-white rounded-sm shadow-sm border border-gray-200 overflow-hidden">
                  <div className="p-6 border-b border-gray-100 flex justify-between items-center">
                      <h3 className="font-bold text-lg text-gray-900">応募者ステータス一覧</h3>
                      <button onClick={() => setActiveTab('candidates')} className="text-sm font-bold text-blue-600 hover:underline flex items-center gap-1">
                          詳細管理へ <ArrowRight size={14} />
                      </button>
                  </div>
                  <div className="overflow-x-auto">
                      <table className="w-full text-left">
                          <thead className="bg-gray-50 border-b border-gray-100">
                              <tr>
                                  <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase">氏名</th>
                                  <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase">大学</th>
                                  <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase">応募求人</th>
                                  <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase">ステータス</th>
                                  <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase">応募日</th>
                                  <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase text-right">アクション</th>
                              </tr>
                          </thead>
                          <tbody className="divide-y divide-gray-50">
                              {candidates.map(candidate => (
                                  <tr key={candidate.id} className="hover:bg-gray-50/50 transition-colors">
                                      <td className="px-6 py-4 font-bold text-gray-900">{candidate.name}</td>
                                      <td className="px-6 py-4 text-sm text-gray-600">{candidate.university}</td>
                                      <td className="px-6 py-4 text-sm text-gray-600">{candidate.appliedJob}</td>
                                      <td className="px-6 py-4">
                                          <span className={`text-xs font-bold px-2 py-1 rounded-sm uppercase tracking-wide
                                              ${candidate.status === '新規応募' ? 'bg-blue-100 text-blue-700' : 
                                                candidate.status === '内定' ? 'bg-green-100 text-green-700' :
                                                candidate.status === 'お見送り' ? 'bg-gray-100 text-gray-500' :
                                                'bg-orange-100 text-orange-700'
                                              }`}>
                                              {candidate.status}
                                          </span>
                                      </td>
                                      <td className="px-6 py-4 text-sm text-gray-500">{candidate.appliedDate}</td>
                                      <td className="px-6 py-4 text-right">
                                          <button 
                                            onClick={() => { setSelectedCandidateId(candidate.id); setActiveTab('candidates'); }}
                                            className="text-xs font-bold bg-white border border-gray-200 px-3 py-1.5 rounded-sm hover:bg-black hover:text-white hover:border-black transition-colors"
                                          >
                                              詳細・チャット
                                          </button>
                                      </td>
                                  </tr>
                              ))}
                          </tbody>
                      </table>
                  </div>
              </div>
          </div>
      );
  };

  const renderCandidates = () => {
    const selectedCandidate = candidates.find(c => c.id === selectedCandidateId);
    const isRejected = selectedCandidate?.status === 'お見送り';
    const isHired = selectedCandidate?.status === '内定';

    return (
        <div className="p-8 md:p-10 max-w-7xl mx-auto h-full">
            <div className="bg-white rounded-sm shadow-sm border border-gray-200 flex h-[700px] overflow-hidden animate-fade-in-up">
                {/* Candidate List (Left) */}
                <div className="w-80 border-r border-gray-100 flex flex-col bg-gray-50/50">
                    <div className="p-4 border-b border-gray-100 bg-white">
                        <div className="relative">
                            <input type="text" placeholder="候補者を検索" className="w-full bg-gray-50 pl-9 pr-4 py-2 text-xs rounded-sm focus:outline-none focus:bg-white focus:ring-1 focus:ring-gray-200 transition-all font-medium"/>
                            <Search size={14} className="absolute left-3 top-2.5 text-gray-400"/>
                        </div>
                    </div>
                    <div className="flex-1 overflow-y-auto">
                        {candidates.map(candidate => (
                            <div 
                                key={candidate.id} 
                                onClick={() => setSelectedCandidateId(candidate.id)}
                                className={`p-4 border-b border-gray-100 cursor-pointer hover:bg-white transition-all ${selectedCandidateId === candidate.id ? 'bg-white border-l-4 border-l-black shadow-sm' : 'border-l-4 border-l-transparent'}`}
                            >
                                <div className="flex justify-between items-start mb-1">
                                    <h4 className="font-bold text-sm text-gray-900">{candidate.name}</h4>
                                    <span className={`text-[10px] px-1.5 py-0.5 rounded font-bold uppercase tracking-wider ${candidate.status === '内定' ? 'text-green-600' : candidate.status === 'お見送り' ? 'text-gray-400' : 'text-blue-600'}`}>
                                        {candidate.status === '内定' ? 'HIRED' : candidate.status === 'お見送り' ? 'REJECTED' : candidate.status}
                                    </span>
                                </div>
                                <p className="text-xs text-gray-500 mb-1 font-medium">{candidate.university}</p>
                                <p className="text-[10px] text-gray-400 truncate">{candidate.lastMsg}</p>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Chat Area (Right) */}
                <div className="flex-1 flex flex-col bg-white relative">
                    {selectedCandidateId ? (
                        <>
                            <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center shadow-sm z-10 bg-white">
                                <div>
                                    <h3 className="font-black text-lg text-gray-900 flex items-center gap-2">
                                        {selectedCandidate?.name}
                                        <button 
                                            onClick={() => setShowStudentModal(true)}
                                            className="ml-2 text-gray-400 hover:text-black"
                                            title="学生詳細を見る"
                                        >
                                            <Info size={16} />
                                        </button>
                                    </h3>
                                    <p className="text-xs text-gray-500 font-medium mt-1">
                                        {selectedCandidate?.university} | {selectedCandidate?.appliedJob}
                                    </p>
                                </div>
                                
                                {/* Status Changer */}
                                <div className="relative group">
                                    <div className="flex items-center gap-2 cursor-pointer bg-gray-50 px-4 py-2 rounded-full hover:bg-gray-100 transition-colors border border-gray-100">
                                        <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Status</span>
                                        <span className="text-xs font-bold text-gray-900">
                                            {selectedCandidate?.status === '内定' ? '採用 (HIRED)' : selectedCandidate?.status}
                                        </span>
                                        <ChevronDown size={14} className="text-gray-400"/>
                                    </div>
                                    <div className="absolute right-0 mt-2 w-48 bg-white border border-gray-100 shadow-xl rounded-sm py-1 hidden group-hover:block z-20 animate-fade-in">
                                        {['書類選考通過', 'カジュアル面談', '一次面接', '最終面接', '内定', 'お見送り'].map(status => (
                                            <button 
                                                key={status}
                                                onClick={() => handleStatusChange(selectedCandidateId, status)}
                                                className="w-full text-left px-4 py-3 text-xs font-bold text-gray-700 hover:bg-gray-50 hover:text-black border-b border-gray-50 last:border-0"
                                            >
                                                {status === '内定' ? '採用 (HIRED)' : status}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            </div>
                            
                            <div className="flex-1 p-8 overflow-y-auto space-y-6 bg-gray-50/30">
                                <div className="text-center text-xs text-gray-400 font-bold uppercase tracking-widest my-4">Today</div>
                                
                                {chatMessages.map(msg => (
                                    <div key={msg.id} className={`flex ${msg.sender === 'company' ? 'justify-end' : 'justify-start'}`}>
                                        {msg.sender === 'student' && <div className="w-8 h-8 rounded-full bg-gray-300 mr-3 flex-shrink-0"></div>}
                                        <div className={`p-4 rounded-2xl max-w-[70%] text-sm shadow-sm leading-relaxed ${
                                            msg.sender === 'company' 
                                            ? 'bg-blue-600 text-white rounded-tr-none' // Company = Blue (Not Black)
                                            : 'bg-white text-gray-800 rounded-tl-none border border-gray-200' 
                                        }`}>
                                            {msg.text}
                                        </div>
                                        {msg.sender === 'company' && <div className="w-8 h-8 rounded-full bg-gray-800 ml-3 flex-shrink-0"></div>}
                                    </div>
                                ))}
                                
                                {isHired && (
                                    <div className="flex justify-center mt-8 animate-fade-in-up">
                                        <div className="bg-green-50 border border-green-200 text-green-800 text-xs font-bold px-6 py-3 rounded-full flex items-center gap-2 shadow-sm">
                                            <CheckCircle size={16}/> 内定通知を送信しました
                                        </div>
                                    </div>
                                )}
                                {isRejected && (
                                    <div className="flex justify-center mt-8 animate-fade-in-up">
                                        <div className="bg-gray-100 border border-gray-200 text-gray-500 text-xs font-bold px-6 py-3 rounded-full flex items-center gap-2 shadow-sm">
                                            <AlertCircle size={16}/> 不採用通知済み・チャット終了
                                        </div>
                                    </div>
                                )}
                            </div>
                            
                            {/* Action Area */}
                            <div className="bg-white border-t border-gray-100 relative z-20">
                                {/* Stylish Hire/Reject Actions */}
                                {!isRejected && !isHired && (
                                    <div className="absolute -top-12 left-0 right-0 flex justify-center gap-4 px-4 pointer-events-none">
                                        <button 
                                            onClick={() => handleHire(selectedCandidateId)}
                                            className="pointer-events-auto bg-white border border-gray-200 text-black px-4 py-2 rounded-full shadow-lg hover:bg-gray-50 transition-all flex items-center gap-2 font-bold text-xs"
                                        >
                                            <CheckCircle size={14} className="text-green-500"/> 採用する
                                        </button>
                                        <button 
                                            onClick={() => handleReject(selectedCandidateId)}
                                            className="pointer-events-auto text-gray-400 px-4 py-2 hover:text-red-500 transition-all font-bold text-xs"
                                        >
                                            不採用にする
                                        </button>
                                    </div>
                                )}

                                <div className="p-4 flex gap-3 items-center">
                                    <button className="p-2 text-gray-400 hover:text-black transition-colors rounded-full hover:bg-gray-100">
                                        <Plus size={20}/>
                                    </button>
                                    <div className="flex-1 relative">
                                        <input 
                                            type="text" 
                                            value={chatInput}
                                            onChange={(e) => setChatInput(e.target.value)}
                                            onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
                                            disabled={isRejected}
                                            className={`w-full bg-gray-50 border border-transparent px-4 py-3 rounded-xl text-sm focus:bg-white focus:border-gray-200 focus:ring-0 outline-none transition-all placeholder-gray-400 font-medium ${isRejected ? 'opacity-50 cursor-not-allowed' : ''}`}
                                            placeholder={isRejected ? "メッセージ送信は無効です" : "メッセージを入力..."}
                                        />
                                    </div>
                                    <button 
                                        onClick={handleSendMessage}
                                        disabled={isRejected || !chatInput} 
                                        className={`p-3 rounded-full transition-all shadow-md ${isRejected || !chatInput ? 'bg-gray-100 text-gray-300' : 'bg-blue-600 text-white hover:bg-blue-700 hover:scale-105'}`}
                                    >
                                        <Send size={18}/>
                                    </button>
                                </div>
                            </div>
                        </>
                    ) : (
                        <div className="flex-1 flex items-center justify-center text-gray-300 font-bold flex-col gap-4 bg-gray-50/30">
                            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center">
                                <MessageSquare size={32} className="opacity-50"/>
                            </div>
                            <p>左側のリストから候補者を選択してください</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
  };

  const renderInfo = () => {
      // Edit Form
      if (isEditingProfile) {
          return (
              <div className="p-8 md:p-10 max-w-7xl mx-auto bg-white rounded-sm shadow-sm border border-gray-100 animate-fade-in">
                  <div className="flex justify-between items-center mb-8 border-b border-gray-100 pb-4">
                      <h2 className="text-xl font-black text-gray-900">会社情報編集</h2>
                      <div className="flex gap-2">
                          <button onClick={() => setIsEditingProfile(false)} className="px-4 py-2 text-sm font-bold text-gray-500 hover:text-black">キャンセル</button>
                          <button onClick={handleProfileSave} className="px-6 py-2 bg-black text-white text-sm font-bold rounded-sm hover:bg-gray-800 flex items-center gap-2"><Save size={16}/> 保存</button>
                      </div>
                  </div>
                  
                  <div className="space-y-6 max-w-3xl">
                      {/* Cover Image Upload */}
                      <div>
                          <label className="block text-xs font-bold text-gray-400 uppercase mb-2">カバー画像</label>
                          <div className="relative w-full h-48 bg-gray-100 rounded-sm overflow-hidden border-2 border-dashed border-gray-300 hover:border-blue-500 transition-colors group">
                               {profile.coverImage ? (
                                   <img src={profile.coverImage} className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity" alt="cover"/>
                               ) : (
                                   <div className="flex items-center justify-center h-full text-gray-400 font-bold">No Image</div>
                               )}
                               <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-black/30">
                                   <label className="cursor-pointer bg-white text-black px-4 py-2 rounded-sm text-xs font-bold flex items-center gap-2">
                                       <Upload size={14}/> 画像を変更
                                       <input type="file" className="hidden" accept="image/*" onChange={(e) => handleImageUpload(e, 'profile')}/>
                                   </label>
                               </div>
                          </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          <div>
                              <label className="block text-xs font-bold text-gray-400 uppercase mb-2">会社名</label>
                              <input type="text" value={profile.name} onChange={(e) => handleProfileChange('name', e.target.value)} className="w-full p-3 bg-gray-50 border border-gray-200 rounded-sm text-sm focus:border-black outline-none font-medium"/>
                          </div>
                          <div>
                              <label className="block text-xs font-bold text-gray-400 uppercase mb-2">代表者名</label>
                              <input type="text" value={profile.representative} onChange={(e) => handleProfileChange('representative', e.target.value)} className="w-full p-3 bg-gray-50 border border-gray-200 rounded-sm text-sm focus:border-black outline-none font-medium"/>
                          </div>
                          <div>
                              <label className="block text-xs font-bold text-gray-400 uppercase mb-2">業界</label>
                              <input type="text" value={profile.industry} onChange={(e) => handleProfileChange('industry', e.target.value)} className="w-full p-3 bg-gray-50 border border-gray-200 rounded-sm text-sm focus:border-black outline-none font-medium"/>
                          </div>
                          <div>
                              <label className="block text-xs font-bold text-gray-400 uppercase mb-2">従業員数</label>
                              <input type="text" value={profile.employees} onChange={(e) => handleProfileChange('employees', e.target.value)} className="w-full p-3 bg-gray-50 border border-gray-200 rounded-sm text-sm focus:border-black outline-none font-medium"/>
                          </div>
                          <div>
                              <label className="block text-xs font-bold text-gray-400 uppercase mb-2">設立</label>
                              <input type="text" value={profile.established} onChange={(e) => handleProfileChange('established', e.target.value)} className="w-full p-3 bg-gray-50 border border-gray-200 rounded-sm text-sm focus:border-black outline-none font-medium"/>
                          </div>
                          <div>
                              <label className="block text-xs font-bold text-gray-400 uppercase mb-2">URL</label>
                              <input type="text" value={profile.url} onChange={(e) => handleProfileChange('url', e.target.value)} className="w-full p-3 bg-gray-50 border border-gray-200 rounded-sm text-sm focus:border-black outline-none font-medium"/>
                          </div>
                      </div>
                      
                      <div>
                          <label className="block text-xs font-bold text-gray-400 uppercase mb-2">所在地</label>
                          <input type="text" value={profile.location} onChange={(e) => handleProfileChange('location', e.target.value)} className="w-full p-3 bg-gray-50 border border-gray-200 rounded-sm text-sm focus:border-black outline-none font-medium"/>
                      </div>

                      <div>
                          <label className="block text-xs font-bold text-gray-400 uppercase mb-2">企業概要・ミッション</label>
                          <textarea rows={5} value={profile.description} onChange={(e) => handleProfileChange('description', e.target.value)} className="w-full p-3 bg-gray-50 border border-gray-200 rounded-sm text-sm focus:border-black outline-none font-medium leading-relaxed"/>
                      </div>

                      <div>
                          <label className="block text-xs font-bold text-gray-400 uppercase mb-2">事業内容詳細</label>
                          <textarea rows={5} value={profile.businessContent} onChange={(e) => handleProfileChange('businessContent', e.target.value)} className="w-full p-3 bg-gray-50 border border-gray-200 rounded-sm text-sm focus:border-black outline-none font-medium leading-relaxed"/>
                      </div>
                  </div>
              </div>
          );
      }

      // Preview Mode (Default)
      return (
          <div className="relative animate-fade-in">
              {/* Edit Button Overlay */}
              <div className="fixed bottom-10 right-10 z-50">
                  <button 
                      onClick={() => setIsEditingProfile(true)}
                      className="bg-black text-white px-6 py-4 rounded-full shadow-2xl font-bold flex items-center gap-2 hover:bg-gray-800 transition-transform hover:scale-105 border-2 border-white"
                  >
                      <Edit2 size={20}/> 情報を編集する
                  </button>
              </div>
              <CompanyPage 
                  company={profile as Company} 
                  onBack={() => {}} 
                  onNavigateJobDetail={(id) => {
                       // If clicking job in profile preview, go to recruitment tab preview
                       const job = jobs.find(j => j.id === id);
                       if(job) {
                          setViewingJob(job);
                          setActiveTab('recruitment');
                       }
                  }} 
              />
          </div>
      );
  };

  const renderRecruitment = () => {
      if (isEditingJob && editingJobData) {
          return (
              <div className="p-8 md:p-10 max-w-7xl mx-auto bg-white rounded-sm shadow-sm border border-gray-100 animate-fade-in">
                  <div className="flex justify-between items-center mb-8 border-b border-gray-100 pb-4">
                      <h2 className="text-xl font-black text-gray-900">求人編集</h2>
                      <div className="flex gap-2">
                          <button onClick={() => { setIsEditingJob(false); setEditingJobData(null); }} className="px-4 py-2 text-sm font-bold text-gray-500 hover:text-black">キャンセル</button>
                          <button onClick={() => handleJobSave('draft')} className="px-4 py-2 border border-gray-300 text-gray-600 text-sm font-bold rounded-sm hover:bg-gray-50 flex items-center gap-2"><FileText size={16}/> 下書き保存</button>
                          <button onClick={() => handleJobSave('published')} className="px-6 py-2 bg-black text-white text-sm font-bold rounded-sm hover:bg-gray-800 flex items-center gap-2"><Send size={16}/> 公開</button>
                      </div>
                  </div>

                  <div className="space-y-8 max-w-4xl">
                      {/* Job Cover Image */}
                      <div>
                          <label className="block text-xs font-bold text-gray-400 uppercase mb-2">求人カバー画像</label>
                          <div className="relative w-full h-48 bg-gray-100 rounded-sm overflow-hidden border-2 border-dashed border-gray-300 hover:border-blue-500 transition-colors group">
                               {editingJobData.coverImageUrl ? (
                                   <img src={editingJobData.coverImageUrl} className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity" alt="cover"/>
                               ) : (
                                   <div className="flex items-center justify-center h-full text-gray-400 font-bold">No Image</div>
                               )}
                               <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-black/30">
                                   <label className="cursor-pointer bg-white text-black px-4 py-2 rounded-sm text-xs font-bold flex items-center gap-2">
                                       <Upload size={14}/> 画像を変更
                                       <input type="file" className="hidden" accept="image/*" onChange={(e) => handleImageUpload(e, 'job')}/>
                                   </label>
                               </div>
                          </div>
                      </div>

                      <div>
                          <label className="block text-xs font-bold text-gray-400 uppercase mb-2">求人タイトル <span className="text-red-500">*</span></label>
                          <input type="text" value={editingJobData.title} onChange={(e) => setEditingJobData({...editingJobData, title: e.target.value})} className="w-full p-4 bg-gray-50 border border-gray-200 rounded-sm text-lg font-bold focus:border-black outline-none" placeholder="例：Go言語を用いた大規模分散システムのバックエンド開発"/>
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                           <div>
                              <label className="block text-xs font-bold text-gray-400 uppercase mb-2">給与 <span className="text-red-500">*</span></label>
                              <input type="text" value={editingJobData.salary} onChange={(e) => setEditingJobData({...editingJobData, salary: e.target.value})} className="w-full p-3 bg-gray-50 border border-gray-200 rounded-sm text-sm focus:border-black outline-none font-medium"/>
                           </div>
                           <div>
                              <label className="block text-xs font-bold text-gray-400 uppercase mb-2">勤務形態 <span className="text-red-500">*</span></label>
                              <select 
                                value={editingJobData.workStyle} 
                                onChange={(e) => setEditingJobData({...editingJobData, workStyle: e.target.value as any})}
                                className="w-full p-3 bg-gray-50 border border-gray-200 rounded-sm text-sm focus:border-black outline-none font-medium"
                              >
                                  <option value="Remote">Remote (フルリモート)</option>
                                  <option value="Hybrid">Hybrid (リモート可)</option>
                                  <option value="On-site">On-site (出社)</option>
                              </select>
                           </div>
                           <div>
                              <label className="block text-xs font-bold text-gray-400 uppercase mb-2">タイプ</label>
                              <select 
                                value={editingJobData.type} 
                                onChange={(e) => setEditingJobData({...editingJobData, type: e.target.value as any})}
                                className="w-full p-3 bg-gray-50 border border-gray-200 rounded-sm text-sm focus:border-black outline-none font-medium"
                              >
                                  <option value="Long-term">長期インターン</option>
                                  <option value="Short-term">短期インターン</option>
                              </select>
                           </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                          <div>
                              <label className="block text-xs font-bold text-gray-400 uppercase mb-2">こんなことやります (業務詳細)</label>
                              <textarea rows={6} value={editingJobData.jobDetail} onChange={(e) => setEditingJobData({...editingJobData, jobDetail: e.target.value})} className="w-full p-3 bg-gray-50 border border-gray-200 rounded-sm text-sm focus:border-black outline-none font-medium leading-relaxed" placeholder="具体的な業務内容を入力してください"/>
                          </div>
                          <div>
                              <label className="block text-xs font-bold text-gray-400 uppercase mb-2">必須スキル・要件</label>
                              <textarea 
                                rows={6} 
                                value={editingJobData.requiredSkills?.join('\n')} 
                                onChange={(e) => setEditingJobData({...editingJobData, requiredSkills: e.target.value.split('\n')})}
                                className="w-full p-3 bg-gray-50 border border-gray-200 rounded-sm text-sm focus:border-black outline-none font-medium leading-relaxed"
                                placeholder="1行に1つスキルを入力してください"
                              />
                          </div>
                      </div>

                      <div>
                           <label className="block text-xs font-bold text-gray-400 uppercase mb-2">タグ (検索用キーワード)</label>
                           <input 
                            type="text" 
                            value={editingJobData.tags?.join(', ')} 
                            onChange={(e) => setEditingJobData({...editingJobData, tags: e.target.value.split(',').map(t => t.trim())})}
                            className="w-full p-3 bg-gray-50 border border-gray-200 rounded-sm text-sm focus:border-black outline-none font-medium"
                            placeholder="カンマ区切りで入力 (例: Go, バックエンド, 初心者歓迎)"
                           />
                      </div>

                      {/* Selection Flow Editor */}
                      <div>
                           <div className="flex justify-between items-center mb-4">
                               <label className="block text-xs font-bold text-gray-400 uppercase">選考フロー</label>
                               <button onClick={addFlowStep} className="text-xs font-bold text-blue-600 hover:underline flex items-center gap-1"><Plus size={12}/> ステップを追加</button>
                           </div>
                           <div className="space-y-4">
                               {editingJobData.selectionFlow?.map((step, index) => (
                                   <div key={index} className="flex gap-4 items-start">
                                       <div className="w-8 h-8 rounded-full bg-black text-white flex items-center justify-center font-bold text-sm flex-shrink-0 mt-1">
                                           {index + 1}
                                       </div>
                                       <div className="flex-1 space-y-2">
                                           <input 
                                                type="text" 
                                                value={step.title} 
                                                onChange={(e) => handleFlowChange(index, 'title', e.target.value)} 
                                                className="w-full p-2 border border-gray-200 rounded-sm text-sm font-bold" 
                                                placeholder="ステップ名 (例: 書類選考)"
                                            />
                                           <input 
                                                type="text" 
                                                value={step.description} 
                                                onChange={(e) => handleFlowChange(index, 'description', e.target.value)} 
                                                className="w-full p-2 border border-gray-200 rounded-sm text-sm" 
                                                placeholder="詳細説明"
                                            />
                                       </div>
                                       <button onClick={() => removeFlowStep(index)} className="text-gray-400 hover:text-red-500 mt-2">
                                           <Trash2 size={16}/>
                                       </button>
                                   </div>
                               ))}
                           </div>
                      </div>
                  </div>
              </div>
          );
      }

      // If Viewing a specific job details (Preview Mode)
      if (viewingJob) {
          return (
              <div className="relative animate-fade-in">
                  <div className="fixed bottom-10 right-10 z-50 flex gap-4">
                      <button
                          onClick={() => setViewingJob(null)}
                          className="bg-white text-gray-900 px-6 py-4 rounded-full shadow-xl font-bold flex items-center gap-2 hover:bg-gray-50 border border-gray-200"
                      >
                          <ArrowLeft size={20}/> 一覧に戻る
                      </button>
                      <button
                          onClick={() => handleEditExistingJob(viewingJob)}
                          className="bg-black text-white px-6 py-4 rounded-full shadow-xl font-bold flex items-center gap-2 hover:bg-gray-800 border-2 border-white"
                      >
                          <Edit2 size={20}/> 情報を編集する
                      </button>
                  </div>
                  
                  <JobDetailPage 
                      job={viewingJob}
                      isFavorite={false}
                      onToggleFavorite={() => {}}
                      onNavigateCompany={() => setActiveTab('info')}
                      onNavigateApply={() => {}}
                      onBack={() => setViewingJob(null)}
                  />
              </div>
          );
      }

      // Job List View
      return (
          <div className="p-8 md:p-10 max-w-7xl mx-auto space-y-6 animate-fade-in-up">
              <div className="flex justify-between items-center">
                  <div>
                      <h2 className="text-2xl font-black text-gray-900 tracking-tight">Recruitment</h2>
                      <p className="text-sm text-gray-500 font-medium">求人情報の管理・作成</p>
                  </div>
                  <button onClick={handleAddNewJob} className="bg-black text-white px-6 py-3 rounded-sm font-bold text-sm hover:bg-gray-800 shadow-md flex items-center gap-2 transition-transform hover:scale-105">
                      <Plus size={18}/> 新規求人作成
                  </button>
              </div>

              <div className="grid grid-cols-1 gap-4">
                  {jobs.length > 0 ? jobs.map(job => (
                      <div key={job.id} onClick={() => setViewingJob(job)} className="bg-white p-6 rounded-sm shadow-sm border border-gray-100 hover:shadow-md hover:border-blue-200 transition-all cursor-pointer group flex items-center gap-6">
                          <div className="w-32 h-20 bg-gray-100 rounded-sm overflow-hidden flex-shrink-0">
                              <img src={job.coverImageUrl} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" alt="cover"/>
                          </div>
                          <div className="flex-1">
                              <div className="flex items-center gap-2 mb-1">
                                  <span className={`w-2 h-2 rounded-full ${job.status === 'published' ? 'bg-green-500' : 'bg-gray-400'}`}></span>
                                  <span className="text-[10px] font-bold uppercase text-gray-400 tracking-wider">{job.status === 'published' ? 'PUBLISHED' : 'DRAFT'}</span>
                              </div>
                              <h3 className="font-bold text-lg text-gray-900 mb-1 group-hover:text-blue-600 transition-colors">{job.title}</h3>
                              <div className="flex items-center gap-4 text-xs text-gray-500 font-medium">
                                  <span className="flex items-center gap-1"><DollarSign size={12}/> {job.salary}</span>
                                  <span className="flex items-center gap-1"><Clock size={12}/> {job.workStyle}</span>
                              </div>
                          </div>
                          <div className="text-gray-300 group-hover:text-black transition-colors">
                              <Eye size={20}/>
                          </div>
                      </div>
                  )) : (
                      <div className="text-center py-20 bg-white border border-gray-200 border-dashed rounded-sm">
                          <p className="text-gray-400 font-bold mb-4">求人情報がまだありません</p>
                          <button onClick={handleAddNewJob} className="text-blue-600 font-bold hover:underline">新規作成する</button>
                      </div>
                  )}
              </div>
          </div>
      );
  };

  return (
    <div className="flex h-screen bg-[#F3F4F6] font-sans text-gray-900 overflow-hidden">
      
      {/* Student Profile Modal */}
      {showStudentModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-fade-in">
              <div className="bg-white w-full max-w-lg rounded-sm shadow-2xl p-8 relative">
                  <button onClick={() => setShowStudentModal(false)} className="absolute top-4 right-4 text-gray-400 hover:text-black">
                      <X size={24}/>
                  </button>
                  <h3 className="text-xl font-black mb-6">学生プロフィール詳細</h3>
                  <div className="space-y-4 text-sm">
                      <div className="border-b border-gray-100 pb-2">
                          <span className="block text-gray-400 text-xs font-bold uppercase">氏名</span>
                          <span className="font-bold text-lg">田中 太郎</span>
                      </div>
                      <div className="border-b border-gray-100 pb-2">
                          <span className="block text-gray-400 text-xs font-bold uppercase">大学</span>
                          <span className="font-bold">東京工科大学 工学部 情報工学科</span>
                      </div>
                      <div className="border-b border-gray-100 pb-2">
                          <span className="block text-gray-400 text-xs font-bold uppercase">スキル</span>
                          <span className="font-bold">Go, React, AWS</span>
                      </div>
                      <div>
                          <span className="block text-gray-400 text-xs font-bold uppercase">GitHub</span>
                          <a href="#" className="text-blue-600 font-bold underline">https://github.com/tanakataro</a>
                      </div>
                  </div>
              </div>
          </div>
      )}

      {/* Contact Admin Modal */}
      {showContactModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-fade-in">
              <div className="bg-white w-full max-w-lg rounded-sm shadow-2xl p-8 transform transition-all scale-100 h-[90vh] overflow-y-auto">
                  <div className="flex justify-between items-center mb-8 border-b border-gray-100 pb-4">
                      <h3 className="text-xl font-black text-gray-900 flex items-center gap-3">
                          <div className="p-2 bg-black text-white rounded-sm"><Building2 size={18}/></div>
                          運営事務局へ連絡
                      </h3>
                      <button onClick={() => setShowContactModal(false)} className="text-gray-400 hover:text-black transition-colors">
                          <X size={24}/>
                      </button>
                  </div>
                  <div className="space-y-6 mb-8">
                      <div>
                          <label className="block text-xs font-bold text-gray-500 uppercase mb-2">件名</label>
                          <input 
                            type="text" 
                            value={contactForm.subject}
                            onChange={(e) => setContactForm({...contactForm, subject: e.target.value})}
                            className="w-full p-3 border border-gray-200 rounded-sm text-sm focus:border-black outline-none bg-gray-50 focus:bg-white transition-colors font-medium"
                          />
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                          <div>
                            <label className="block text-xs font-bold text-gray-500 uppercase mb-2">企業名</label>
                            <input 
                                type="text" 
                                value={contactForm.companyName}
                                disabled
                                className="w-full p-3 border border-gray-200 rounded-sm text-sm bg-gray-100 text-gray-600 font-medium"
                            />
                          </div>
                          <div>
                            <label className="block text-xs font-bold text-gray-500 uppercase mb-2">担当者メールアドレス</label>
                            <input 
                                type="email" 
                                value={contactForm.email}
                                onChange={(e) => setContactForm({...contactForm, email: e.target.value})}
                                className="w-full p-3 border border-gray-200 rounded-sm text-sm focus:border-black outline-none bg-gray-50 focus:bg-white transition-colors font-medium"
                            />
                          </div>
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                          <div>
                            <label className="block text-xs font-bold text-gray-500 uppercase mb-2">求人名</label>
                            <input 
                                type="text" 
                                value={contactForm.jobTitle}
                                onChange={(e) => setContactForm({...contactForm, jobTitle: e.target.value})}
                                className="w-full p-3 border border-gray-200 rounded-sm text-sm focus:border-black outline-none bg-gray-50 focus:bg-white transition-colors font-medium"
                            />
                          </div>
                          <div>
                            <label className="block text-xs font-bold text-gray-500 uppercase mb-2">候補者名</label>
                            <input 
                                type="text" 
                                value={contactForm.candidateName}
                                onChange={(e) => setContactForm({...contactForm, candidateName: e.target.value})}
                                className="w-full p-3 border border-gray-200 rounded-sm text-sm focus:border-black outline-none bg-gray-50 focus:bg-white transition-colors font-medium"
                            />
                          </div>
                      </div>
                      <div>
                          <label className="block text-xs font-bold text-gray-500 uppercase mb-2">備考・メッセージ</label>
                          <textarea 
                            rows={4}
                            value={contactForm.remarks}
                            onChange={(e) => setContactForm({...contactForm, remarks: e.target.value})}
                            className="w-full p-3 border border-gray-200 rounded-sm text-sm focus:border-black outline-none bg-gray-50 focus:bg-white transition-colors font-medium leading-relaxed"
                          />
                      </div>
                  </div>
                  <div className="flex justify-end gap-3">
                      <button onClick={() => setShowContactModal(false)} className="px-6 py-3 text-sm font-bold text-gray-500 hover:text-black transition-colors">
                          キャンセル
                      </button>
                      <button onClick={handleSendContact} className="px-8 py-3 bg-black text-white text-sm font-bold rounded-sm hover:bg-gray-800 flex items-center gap-2 shadow-lg transition-transform hover:scale-105">
                          <Send size={14}/> 送信
                      </button>
                  </div>
              </div>
          </div>
      )}

      {/* Sidebar - Changed background to match Home */}
      <aside className="w-64 bg-[#F3F4F6] border-r border-gray-200 flex-shrink-0 flex flex-col z-20">
           <div className="h-20 flex items-center px-8 border-b border-gray-200">
                <div className="flex items-center gap-2">
                    <div className="w-8 h-8 bg-black text-white flex items-center justify-center font-black text-xs rounded-sm">Ti</div>
                    <span className="font-bold text-lg tracking-tight text-gray-900">Tech intern</span>
                </div>
           </div>

           <nav className="flex-1 py-8 px-4 space-y-1">
                <button 
                    onClick={() => setActiveTab('analytics')}
                    className={`w-full flex items-center gap-3 px-4 py-4 text-base font-bold rounded-sm transition-all ${activeTab === 'analytics' ? 'bg-white text-black shadow-sm' : 'text-gray-500 hover:bg-white hover:text-black'}`}
                >
                    <BarChart2 size={20}/> 情報管理
                </button>
                <button 
                    onClick={() => setActiveTab('info')}
                    className={`w-full flex items-center gap-3 px-4 py-4 text-base font-bold rounded-sm transition-all ${activeTab === 'info' ? 'bg-white text-black shadow-sm' : 'text-gray-500 hover:bg-white hover:text-black'}`}
                >
                    <LayoutDashboard size={20}/> 会社情報
                </button>
                <button 
                    onClick={() => setActiveTab('recruitment')}
                    className={`w-full flex items-center gap-3 px-4 py-4 text-base font-bold rounded-sm transition-all ${activeTab === 'recruitment' ? 'bg-white text-black shadow-sm' : 'text-gray-500 hover:bg-white hover:text-black'}`}
                >
                    <Briefcase size={20}/> 採用情報
                </button>
                <button 
                    onClick={() => setActiveTab('candidates')}
                    className={`w-full flex items-center gap-3 px-4 py-4 text-base font-bold rounded-sm transition-all ${activeTab === 'candidates' ? 'bg-white text-black shadow-sm' : 'text-gray-500 hover:bg-white hover:text-black'}`}
                >
                    <Users size={20}/> 候補者管理
                </button>
           </nav>

           <div className="p-4 border-t border-gray-200 space-y-2">
               <button onClick={onNavigateHome} className="w-full flex items-center gap-3 text-gray-500 hover:bg-white hover:text-black px-4 py-3 text-sm font-bold rounded-sm transition-colors">
                   <Home size={16}/> サイトTOPへ
               </button>
               <button onClick={onLogout} className="w-full flex items-center gap-3 text-gray-400 hover:bg-red-50 hover:text-red-500 px-4 py-3 text-sm font-bold rounded-sm transition-colors">
                   <LogOut size={16}/> ログアウト
               </button>
           </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col h-screen overflow-hidden bg-[#F3F4F6]">
          {/* Header */}
          <header className="h-20 bg-white/80 backdrop-blur-sm border-b border-gray-100 flex items-center justify-between px-8 z-10 sticky top-0">
               <h1 className="font-bold text-gray-900 animate-fade-in text-lg">
                   {activeTab === 'analytics' && 'Dashboard Overview'}
                   {activeTab === 'info' && 'Company Profile'}
                   {activeTab === 'recruitment' && 'Job Listings'}
                   {activeTab === 'candidates' && 'Candidate Management'}
               </h1>
               <div className="flex items-center gap-4">
                   <span className="text-sm font-bold text-gray-600">{companyName}</span>
                   <div className="w-10 h-10 bg-gradient-to-br from-gray-800 to-black rounded-full flex items-center justify-center text-white font-bold text-sm shadow-md ring-2 ring-white">
                       {companyName.charAt(0)}
                   </div>
               </div>
          </header>

          {/* Scrollable Content Area */}
          <main className="flex-1 overflow-y-auto">
               <div className="">
                   {activeTab === 'analytics' && renderAnalytics()}
                   {activeTab === 'info' && renderInfo()}
                   {activeTab === 'recruitment' && renderRecruitment()}
                   {activeTab === 'candidates' && renderCandidates()}
               </div>
          </main>
      </div>
    </div>
  );
};
