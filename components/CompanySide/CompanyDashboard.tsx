
import React, { useState, useRef, useEffect } from 'react';
import { Company, JobListing } from '../../types';
import { JOB_LISTINGS } from '../../constants';
import { 
    Save, LogOut, Building2, Globe, Users, FileText, 
    Briefcase, LayoutDashboard, MessageSquare, Plus, Edit2, Search, Send, Trash2, CheckCircle,
    Home, BarChart2, X, AlertCircle, Upload, Clock, DollarSign, Eye, ArrowLeft, ArrowRight, Info, UserCheck, MapPin,
    Bold, Italic, List, Image as ImageIcon
} from 'lucide-react';
import { CompanyPage } from '../CompanyPage';
import { JobDetailPage } from '../JobDetailPage';

interface CompanyDashboardProps {
  companyName: string;
  onLogout: () => void;
  onNavigateHome: () => void;
}

type DashboardTab = 'info' | 'recruitment' | 'candidates' | 'analytics';
type CandidateStatus = '書類選考' | '面談' | '終了';
type CandidateResult = 'adopted' | 'rejected' | null; // For '終了' status

// --- Rich Text Editor Component (Fixed Cursor Issue) ---
const RichTextEditor = ({ 
    label, 
    value, 
    onChange 
}: { 
    label: string, 
    value: string, 
    onChange: (html: string) => void 
}) => {
    const editorRef = useRef<HTMLDivElement>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);
    const isFocused = useRef(false);

    // Initial load and sync only when NOT focused to prevent cursor jumping
    useEffect(() => {
        if (editorRef.current && !isFocused.current) {
            if (editorRef.current.innerHTML !== value) {
                editorRef.current.innerHTML = value;
            }
        }
    }, [value]);

    const handleInput = () => {
        if (editorRef.current) {
            onChange(editorRef.current.innerHTML);
        }
    };

    const handleFocus = () => {
        isFocused.current = true;
    };

    const handleBlur = () => {
        isFocused.current = false;
        handleInput(); // Ensure final state is saved
    };

    const execCmd = (command: string, value?: string) => {
        document.execCommand(command, false, value);
        if (editorRef.current) {
            editorRef.current.focus();
        }
    };

    const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                const imgTag = `<img src="${reader.result}" alt="inserted" style="max-width:100%; border-radius: 4px; margin: 10px 0;" /><br/>`;
                
                if (document.activeElement === editorRef.current) {
                    document.execCommand('insertHTML', false, imgTag);
                } else {
                    if (editorRef.current) {
                        editorRef.current.innerHTML += imgTag;
                    }
                }
                handleInput();
            };
            reader.readAsDataURL(file);
        }
        if (fileInputRef.current) fileInputRef.current.value = '';
    };

    return (
        <div>
            <label className="block text-xs font-bold text-gray-500 uppercase mb-2">{label}</label>
            <div className="border border-gray-300 rounded-sm overflow-hidden bg-white">
                <div className="flex gap-1 p-2 border-b border-gray-200 bg-gray-50 items-center select-none">
                    <button onClick={(e) => {e.preventDefault(); execCmd('bold');}} className="p-2 hover:bg-gray-200 rounded text-gray-700" title="太字"><Bold size={16}/></button>
                    <button onClick={(e) => {e.preventDefault(); execCmd('italic');}} className="p-2 hover:bg-gray-200 rounded text-gray-700" title="斜体"><Italic size={16}/></button>
                    <button onClick={(e) => {e.preventDefault(); execCmd('insertUnorderedList');}} className="p-2 hover:bg-gray-200 rounded text-gray-700" title="リスト"><List size={16}/></button>
                    <div className="w-px h-6 bg-gray-300 mx-1"></div>
                    <label className="p-2 hover:bg-gray-200 rounded text-gray-700 cursor-pointer flex items-center gap-1" title="画像挿入">
                        <ImageIcon size={16}/>
                        <input 
                            ref={fileInputRef}
                            type="file" 
                            accept="image/*" 
                            className="hidden" 
                            onChange={handleImageUpload}
                        />
                    </label>
                </div>
                <div 
                    ref={editorRef}
                    className="p-4 min-h-[200px] outline-none prose prose-sm max-w-none font-medium text-gray-800 focus:bg-gray-50/30 transition-colors"
                    contentEditable
                    suppressContentEditableWarning
                    onInput={handleInput}
                    onFocus={handleFocus}
                    onBlur={handleBlur}
                />
            </div>
            <p className="text-[10px] text-gray-400 mt-1 text-right">※ 画像を選択してBackspaceキーで削除できます</p>
        </div>
    );
};


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
    logoUrl: 'https://picsum.photos/id/64/100/100', // Default logo
    url: 'https://kaxin.jp',
    description: '私たちは、最先端の技術を活用してクライアントの課題を解決するプロフェッショナル集団です。\nエンジニアインターンの皆様には、実際のプロジェクトチームに参加していただき、要件定義から設計、実装、テストまでの一連の開発プロセスを経験していただきます。',
    businessContent: '・Webアプリケーション受託開発\n・モバイルアプリ開発\n・AIソリューション導入支援\n・自社SaaSプロダクトの企画・運営',
    representative: '藤巻 雄飛',
    employees: '10-50名',
    established: '2020年', // Updated year
    coverImage: 'https://picsum.photos/id/1/800/450' 
  });

  // State for Recruitment
  const [jobs, setJobs] = useState<JobListing[]>(JOB_LISTINGS.slice(0, 3).map(j => ({...j, status: 'published'})));
  const [viewingJob, setViewingJob] = useState<JobListing | null>(null); 
  const [isEditingJob, setIsEditingJob] = useState(false); 
  const [editingJobData, setEditingJobData] = useState<Partial<JobListing> | null>(null);

  // State for Candidates Chat
  const [candidates, setCandidates] = useState<{
      id: string;
      name: string;
      university: string;
      status: CandidateStatus;
      result: CandidateResult;
      appliedJob: string;
      appliedDate: string;
      lastMsg: string;
  }[]>([
      { id: 'u1', name: '田中 太郎', university: '東京工科大学', status: '書類選考', result: null, appliedJob: 'Go言語バックエンド', appliedDate: '2025-05-01', lastMsg: 'ありがとうございます。日程調整の件...' },
      { id: 'u2', name: '鈴木 一郎', university: '早稲田大学', status: '面談', result: null, appliedJob: 'フロントエンド', appliedDate: '2025-05-03', lastMsg: 'ポートフォリオをお送りします。' },
      { id: 'u3', name: '佐藤 花子', university: '書類選考', status: '書類選考', result: null, appliedJob: 'Go言語バックエンド', appliedDate: '2025-05-05', lastMsg: 'はじめまして。貴社のビジョンに共感し...' },
      { id: 'u4', name: '山田 次郎', university: '筑波大学', status: '終了', result: 'rejected', appliedJob: 'モバイルアプリ', appliedDate: '2025-04-20', lastMsg: 'またご縁がありましたら...' },
      { id: 'u5', name: '高橋 健太', university: '東京大学', status: '終了', result: 'adopted', appliedJob: 'Go言語バックエンド', appliedDate: '2025-04-10', lastMsg: '内定ありがとうございます！' },
  ]);
  const [selectedCandidateId, setSelectedCandidateId] = useState<string | null>(null);
  const [chatInput, setChatInput] = useState('');
  
  // Dummy Chat messages state
  const [chatMessages, setChatMessages] = useState([
      { id: 1, sender: 'student', text: 'はじめまして。貴社のビジョンに共感し、応募させていただきました。ポートフォリオをお送りしますのでご確認いただけますと幸いです。' },
      { id: 2, sender: 'company', text: 'ご応募ありがとうございます！プロフィールを拝見し、ぜひお話ししたいと思いました。' }
  ]);

  // --- Handlers ---

  const handleProfileChange = (field: keyof Company, value: string) => {
      setProfile(prev => ({ ...prev, [field]: value }));
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>, field: 'profile' | 'job' | 'logo') => {
      const file = e.target.files?.[0];
      if (file) {
          const reader = new FileReader();
          reader.onloadend = () => {
              const result = reader.result as string;
              if (field === 'profile') {
                  setProfile(prev => ({ ...prev, coverImage: result }));
              } else if (field === 'logo') {
                  setProfile(prev => ({ ...prev, logoUrl: result }));
              } else if (field === 'job' && editingJobData) {
                  setEditingJobData({ ...editingJobData, coverImageUrl: result });
              }
          };
          reader.readAsDataURL(file);
      }
  };

  const handleRemoveImage = (field: 'profile' | 'job' | 'logo') => {
      if (field === 'profile') {
          setProfile(prev => ({ ...prev, coverImage: '' }));
      } else if (field === 'logo') {
          setProfile(prev => ({ ...prev, logoUrl: '' }));
      } else if (field === 'job' && editingJobData) {
          setEditingJobData({ ...editingJobData, coverImageUrl: '' });
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
          corporateCulture: '',
          skillsGainedDescription: '',
          onboardingProcess: '',
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
          
          // Force reset view states
          setViewingJob(null);
          setIsEditingJob(false);
          setEditingJobData(null);
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

  const updateStatus = (id: string, newStatus: CandidateStatus, result: CandidateResult = null) => {
      setCandidates(prev => prev.map(c => c.id === id ? { ...c, status: newStatus, result: result } : c));
  };

  const handleMoveToInterview = (candidateId: string) => {
      updateStatus(candidateId, '面談');
      alert('ステータスを「面談」に変更しました。日程調整のメッセージを送りましょう。');
  };

  const handleHire = (candidateId: string) => {
     // 1. Prepare Data
     const candidate = candidates.find(c => c.id === candidateId);
     if (!candidate) return;

     // 2. Set Form Data (Auto-fill)
     setContactForm(prev => ({
         ...prev,
         subject: `【採用報告】${candidate.name} 様`,
         companyName: companyName, // Ensure company name is set
         jobTitle: candidate.appliedJob,
         candidateName: candidate.name,
         remarks: '採用（内定）としましたのでご報告いたします。今後の手続きについてご教示ください。'
     }));
     
     // 3. Show Modal
     setShowContactModal(true);
  };

  const handleReject = (candidateId: string) => {
     if (confirm('この候補者を不採用（お見送り）として処理しますか？\nステータスは「終了」となり、チャットは無効化されます。')) {
         updateStatus(candidateId, '終了', 'rejected');
         // Add system message to chat
         setChatMessages(prev => [...prev, {
             id: Date.now(),
             sender: 'company',
             text: '【システム】不採用通知を行いました。ステータスが終了に変更されました。'
         }]);
     }
  };

  const handleSendContact = () => {
      // Upon sending the contact form, we assume the hire is finalized
      const candidateName = contactForm.candidateName;
      const candidate = candidates.find(c => c.name === candidateName);
      if (candidate) {
          updateStatus(candidate.id, '終了', 'adopted');
          // Add system message to chat
          setChatMessages(prev => [...prev, {
             id: Date.now(),
             sender: 'company',
             text: '【システム】内定通知を行いました。運営事務局へ報告済みです。'
         }]);
      }

      alert('運営事務局へ報告を送信しました。\nステータスを「採用（終了）」に変更しました。');
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

  const renderInfo = () => {
    // ... same as before
    if (isEditingProfile) {
      return (
        <div className="p-8 md:p-10 max-w-4xl mx-auto animate-fade-in">
          <div className="flex justify-between items-center mb-8 border-b border-gray-200 pb-4">
            <h2 className="text-2xl font-black text-gray-900">企業情報編集</h2>
            <div className="flex gap-3">
               <button onClick={() => setIsEditingProfile(false)} className="px-6 py-2 text-sm font-bold text-gray-500 hover:text-black transition-colors">キャンセル</button>
               <button onClick={handleProfileSave} className="px-6 py-2 bg-black text-white text-sm font-bold rounded-sm hover:bg-gray-800 transition-colors flex items-center gap-2"><Save size={16}/> 保存</button>
            </div>
          </div>
          
          <div className="space-y-8 bg-white p-8 rounded-sm shadow-sm border border-gray-200">
             {/* Logo Upload */}
             <div>
                <label className="block text-xs font-bold text-gray-500 uppercase mb-2">企業ロゴ</label>
                <div className="flex items-center gap-6">
                    <div className="w-24 h-24 bg-gray-100 rounded-sm overflow-hidden border border-gray-300 flex-shrink-0 relative group">
                        {profile.logoUrl ? (
                            <>
                                <img src={profile.logoUrl} className="w-full h-full object-contain p-2" alt="logo"/>
                                <button onClick={() => handleRemoveImage('logo')} className="absolute top-1 right-1 bg-white rounded-full p-1 shadow-md hover:bg-red-50 text-gray-500 hover:text-red-500"><X size={12}/></button>
                            </>
                        ) : (
                            <div className="w-full h-full flex items-center justify-center text-gray-400 font-bold text-xs">No Logo</div>
                        )}
                    </div>
                    <label className="cursor-pointer bg-white border border-gray-300 text-black px-4 py-2 rounded-sm text-xs font-bold flex items-center gap-2 hover:bg-gray-50 transition-colors">
                        <Upload size={14}/> ロゴ画像を変更 (JPEG/PNG)
                        <input type="file" className="hidden" accept="image/png, image/jpeg" onChange={(e) => handleImageUpload(e, 'logo')}/>
                    </label>
                </div>
             </div>

             {/* Cover Image */}
             <div>
                <label className="block text-xs font-bold text-gray-500 uppercase mb-2">カバー画像</label>
                <div className="relative h-64 w-full bg-gray-100 rounded-sm overflow-hidden group border-2 border-dashed border-gray-300 hover:border-black transition-colors">
                     {profile.coverImage ? (
                         <>
                            <img src={profile.coverImage} className="w-full h-full object-cover opacity-90 group-hover:opacity-100 transition-opacity" alt="cover"/>
                            <button 
                                onClick={(e) => { e.preventDefault(); handleRemoveImage('profile'); }}
                                className="absolute top-2 right-2 bg-white/80 p-2 rounded-full text-gray-600 hover:text-red-600 hover:bg-white z-20"
                                title="画像を削除"
                            >
                                <Trash2 size={16} />
                            </button>
                         </>
                     ) : (
                         <div className="flex flex-col items-center justify-center h-full text-gray-400">
                             <Upload size={32} className="mb-2"/>
                             <span className="text-sm font-bold">画像をアップロード</span>
                         </div>
                     )}
                     <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-black/30 pointer-events-none">
                        <label className="cursor-pointer bg-white text-black px-4 py-2 rounded-sm text-xs font-bold flex items-center gap-2 shadow-lg pointer-events-auto">
                            <Upload size={14}/> ファイルを選択
                            <input type="file" className="hidden" accept="image/*" onChange={(e) => handleImageUpload(e, 'profile')}/>
                        </label>
                    </div>
                </div>
             </div>

             <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                 <div>
                    <label className="block text-xs font-bold text-gray-500 uppercase mb-2">会社名</label>
                    <input type="text" value={profile.name} onChange={(e) => handleProfileChange('name', e.target.value)} className="w-full p-3 border border-gray-300 rounded-sm text-sm focus:outline-none focus:border-black font-medium"/>
                 </div>
                 <div>
                    <label className="block text-xs font-bold text-gray-500 uppercase mb-2">代表者</label>
                    <input type="text" value={profile.representative} onChange={(e) => handleProfileChange('representative', e.target.value)} className="w-full p-3 border border-gray-300 rounded-sm text-sm focus:outline-none focus:border-black font-medium"/>
                 </div>
                 <div>
                    <label className="block text-xs font-bold text-gray-500 uppercase mb-2">所在地</label>
                    <input type="text" value={profile.location} onChange={(e) => handleProfileChange('location', e.target.value)} className="w-full p-3 border border-gray-300 rounded-sm text-sm focus:outline-none focus:border-black font-medium"/>
                 </div>
                 <div>
                    <label className="block text-xs font-bold text-gray-500 uppercase mb-2">従業員数</label>
                    <input type="text" value={profile.employees} onChange={(e) => handleProfileChange('employees', e.target.value)} className="w-full p-3 border border-gray-300 rounded-sm text-sm focus:outline-none focus:border-black font-medium"/>
                 </div>
                 <div>
                    <label className="block text-xs font-bold text-gray-500 uppercase mb-2">設立</label>
                    <input type="text" value={profile.established} onChange={(e) => handleProfileChange('established', e.target.value)} className="w-full p-3 border border-gray-300 rounded-sm text-sm focus:outline-none focus:border-black font-medium"/>
                 </div>
                 <div>
                    <label className="block text-xs font-bold text-gray-500 uppercase mb-2">業界</label>
                    <input type="text" value={profile.industry} onChange={(e) => handleProfileChange('industry', e.target.value)} className="w-full p-3 border border-gray-300 rounded-sm text-sm focus:outline-none focus:border-black font-medium"/>
                 </div>
                 <div className="md:col-span-2">
                    <label className="block text-xs font-bold text-gray-500 uppercase mb-2">URL</label>
                    <input type="text" value={profile.url} onChange={(e) => handleProfileChange('url', e.target.value)} className="w-full p-3 border border-gray-300 rounded-sm text-sm focus:outline-none focus:border-black font-medium"/>
                 </div>
             </div>

             <div>
                <label className="block text-xs font-bold text-gray-500 uppercase mb-2">ミッション</label>
                <textarea rows={2} value={profile.mission || ''} onChange={(e) => handleProfileChange('mission', e.target.value)} className="w-full p-3 border border-gray-300 rounded-sm text-sm focus:outline-none focus:border-black font-medium"/>
             </div>

             <div>
                <label className="block text-xs font-bold text-gray-500 uppercase mb-2">会社概要・紹介文</label>
                <textarea rows={6} value={profile.description} onChange={(e) => handleProfileChange('description', e.target.value)} className="w-full p-3 border border-gray-300 rounded-sm text-sm focus:outline-none focus:border-black font-medium leading-relaxed"/>
             </div>
          </div>
        </div>
      );
    }

    return (
        <div className="p-8 md:p-10 max-w-5xl mx-auto animate-fade-in-up">
             <div className="flex justify-between items-center mb-8">
                <h2 className="text-2xl font-black text-gray-900 tracking-tight">会社情報</h2>
                <button onClick={() => setIsEditingProfile(true)} className="px-6 py-2 bg-black text-white text-sm font-bold rounded-sm hover:bg-gray-800 transition-colors flex items-center gap-2 shadow-lg"><Edit2 size={16}/> 編集する</button>
             </div>

             <div className="bg-white rounded-sm shadow-sm border border-gray-200 overflow-hidden">
                 <div className="h-64 bg-gray-200 relative">
                     {profile.coverImage && <img src={profile.coverImage} className="w-full h-full object-cover" alt="cover"/>}
                     <div className="absolute bottom-0 left-0 w-full p-6 bg-gradient-to-t from-black/80 to-transparent flex items-end justify-between">
                         <div>
                            <h1 className="text-3xl font-black text-white mb-1">{profile.name}</h1>
                            <p className="text-white/80 font-bold flex items-center gap-2 text-sm"><MapPin size={14}/> {profile.location}</p>
                         </div>
                         {profile.logoUrl && (
                             <img src={profile.logoUrl} className="w-20 h-20 rounded-sm border-2 border-white bg-white p-1 object-contain shadow-md" alt="logo"/>
                         )}
                     </div>
                 </div>
                 
                 <div className="p-8">
                     <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8 border-b border-gray-100 pb-8">
                         <div>
                             <h4 className="font-bold text-gray-400 text-xs uppercase mb-3">基本情報</h4>
                             <ul className="space-y-4 text-sm font-medium">
                                 <li className="flex justify-between"><span className="text-gray-500">代表者</span> <span>{profile.representative}</span></li>
                                 <li className="flex justify-between"><span className="text-gray-500">設立</span> <span>{profile.established}</span></li>
                                 <li className="flex justify-between"><span className="text-gray-500">従業員数</span> <span>{profile.employees}</span></li>
                                 <li className="flex justify-between"><span className="text-gray-500">業界</span> <span>{profile.industry}</span></li>
                                 <li className="flex justify-between"><span className="text-gray-500">URL</span> <a href={profile.url} target="_blank" rel="noreferrer" className="text-blue-600 hover:underline">{profile.url}</a></li>
                             </ul>
                         </div>
                         <div>
                             <h4 className="font-bold text-gray-400 text-xs uppercase mb-3">ミッション</h4>
                             <p className="text-lg font-bold text-gray-900 leading-relaxed mb-6">{profile.mission || '未設定'}</p>
                             <h4 className="font-bold text-gray-400 text-xs uppercase mb-3">会社紹介</h4>
                             <p className="text-gray-600 leading-relaxed text-sm whitespace-pre-wrap">{profile.description}</p>
                         </div>
                     </div>
                 </div>
             </div>
        </div>
    );
  };

  const renderRecruitment = () => {
    // Edit Form
    if (isEditingJob && editingJobData) {
        return (
            <div className="p-8 md:p-10 max-w-4xl mx-auto animate-fade-in">
                <div className="flex justify-between items-center mb-8 border-b border-gray-200 pb-4 sticky top-0 bg-[#F3F4F6] z-10 pt-4">
                    <h2 className="text-2xl font-black text-gray-900">求人情報編集</h2>
                    <div className="flex gap-3">
                        <button onClick={() => { setIsEditingJob(false); setEditingJobData(null); }} className="px-6 py-2 text-sm font-bold text-gray-500 hover:text-black transition-colors">キャンセル</button>
                        <button onClick={() => handleJobSave('draft')} className="px-6 py-2 border border-gray-300 bg-white text-gray-700 text-sm font-bold rounded-sm hover:bg-gray-50 transition-colors flex items-center gap-2"><FileText size={16}/> 下書き</button>
                        <button onClick={() => handleJobSave('published')} className="px-6 py-2 bg-black text-white text-sm font-bold rounded-sm hover:bg-gray-800 transition-colors flex items-center gap-2"><Send size={16}/> 公開</button>
                    </div>
                </div>

                <div className="bg-white p-8 rounded-sm shadow-sm border border-gray-200 space-y-8">
                     {/* 1. Basic Info */}
                     <div>
                        <label className="block text-xs font-bold text-gray-500 uppercase mb-2">求人タイトル <span className="text-red-500">*</span></label>
                        <input type="text" value={editingJobData.title} onChange={(e) => setEditingJobData({...editingJobData, title: e.target.value})} className="w-full p-3 border border-gray-300 rounded-sm text-lg font-bold focus:outline-none focus:border-black" placeholder="例）Go言語を用いたバックエンド開発インターン"/>
                     </div>

                     <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                         <div>
                            <label className="block text-xs font-bold text-gray-500 uppercase mb-2">給与</label>
                            <input type="text" value={editingJobData.salary} onChange={(e) => setEditingJobData({...editingJobData, salary: e.target.value})} className="w-full p-3 border border-gray-300 rounded-sm text-sm focus:outline-none focus:border-black font-medium"/>
                         </div>
                         <div>
                            <label className="block text-xs font-bold text-gray-500 uppercase mb-2">勤務形態</label>
                            <select value={editingJobData.workStyle} onChange={(e) => setEditingJobData({...editingJobData, workStyle: e.target.value as any})} className="w-full p-3 border border-gray-300 rounded-sm text-sm focus:outline-none focus:border-black font-medium">
                                <option value="Remote">Remote</option>
                                <option value="Hybrid">Hybrid</option>
                                <option value="On-site">On-site</option>
                            </select>
                         </div>
                     </div>

                     <div>
                        <label className="block text-xs font-bold text-gray-500 uppercase mb-2">タグ (カンマ区切り)</label>
                        <input type="text" value={editingJobData.tags?.join(', ')} onChange={(e) => setEditingJobData({...editingJobData, tags: e.target.value.split(',').map(t => t.trim())})} className="w-full p-3 border border-gray-300 rounded-sm text-sm focus:outline-none focus:border-black font-medium" placeholder="Go, AWS, Docker"/>
                     </div>
                     
                     <div>
                        <label className="block text-xs font-bold text-gray-500 uppercase mb-2">必須スキル (カンマ区切り)</label>
                        <input type="text" value={editingJobData.requiredSkills?.join(', ')} onChange={(e) => setEditingJobData({...editingJobData, requiredSkills: e.target.value.split(',').map(t => t.trim())})} className="w-full p-3 border border-gray-300 rounded-sm text-sm focus:outline-none focus:border-black font-medium" placeholder="Go, Git"/>
                     </div>

                     {/* 2. Cover Image */}
                     <div>
                        <label className="block text-xs font-bold text-gray-500 uppercase mb-2">カバー画像</label>
                        <div className="relative h-48 w-full bg-gray-100 rounded-sm overflow-hidden group border-2 border-dashed border-gray-300 hover:border-black transition-colors">
                            {editingJobData.coverImageUrl ? (
                                <>
                                    <img src={editingJobData.coverImageUrl} className="w-full h-full object-cover opacity-90 group-hover:opacity-100 transition-opacity" alt="cover"/>
                                    <button 
                                        onClick={(e) => { e.preventDefault(); handleRemoveImage('job'); }}
                                        className="absolute top-2 right-2 bg-white/80 p-2 rounded-full text-gray-600 hover:text-red-600 hover:bg-white z-20"
                                        title="画像を削除"
                                    >
                                        <Trash2 size={16} />
                                    </button>
                                </>
                            ) : (
                                <div className="flex flex-col items-center justify-center h-full text-gray-400">
                                    <Upload size={24} className="mb-2"/>
                                    <span className="text-sm font-bold">画像をアップロード</span>
                                </div>
                            )}
                            <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-black/30 pointer-events-none">
                                <label className="cursor-pointer bg-white text-black px-4 py-2 rounded-sm text-xs font-bold flex items-center gap-2 shadow-lg pointer-events-auto">
                                    <Upload size={14}/> ファイルを選択
                                    <input type="file" className="hidden" accept="image/*" onChange={(e) => handleImageUpload(e, 'job')}/>
                                </label>
                            </div>
                        </div>
                     </div>

                     {/* 3. Description (Job Overview) */}
                     <RichTextEditor 
                        label="仕事概要 (画像挿入可)" 
                        value={editingJobData.description || ''} 
                        onChange={(html) => setEditingJobData({...editingJobData!, description: html})} 
                     />

                     {/* 4. Job Detail */}
                     <RichTextEditor 
                        label="業務内容詳細 (画像挿入可)" 
                        value={editingJobData.jobDetail || ''} 
                        onChange={(html) => setEditingJobData({...editingJobData!, jobDetail: html})} 
                     />

                     {/* 5. Corporate Culture */}
                     <div>
                        <label className="block text-xs font-bold text-gray-500 uppercase mb-2">社風やカルチャー</label>
                        <textarea rows={4} value={editingJobData.corporateCulture || ''} onChange={(e) => setEditingJobData({...editingJobData, corporateCulture: e.target.value})} className="w-full p-3 border border-gray-300 rounded-sm text-sm focus:outline-none focus:border-black font-medium leading-relaxed"/>
                     </div>

                     {/* 6. Skills Gained */}
                     <div>
                        <label className="block text-xs font-bold text-gray-500 uppercase mb-2">得られるスキル (タグ)</label>
                        <input type="text" value={editingJobData.skillsGained?.join(', ')} onChange={(e) => setEditingJobData({...editingJobData, skillsGained: e.target.value.split(',').map(t => t.trim())})} className="w-full p-3 border border-gray-300 rounded-sm text-sm focus:outline-none focus:border-black font-medium" placeholder="チーム開発経験, AWS運用知識"/>
                     </div>

                     <div>
                        <label className="block text-xs font-bold text-gray-500 uppercase mb-2">得られるスキル (詳細)</label>
                        <textarea rows={4} value={editingJobData.skillsGainedDescription || ''} onChange={(e) => setEditingJobData({...editingJobData, skillsGainedDescription: e.target.value})} className="w-full p-3 border border-gray-300 rounded-sm text-sm focus:outline-none focus:border-black font-medium leading-relaxed"/>
                     </div>

                     {/* 7. Onboarding */}
                     <div>
                        <label className="block text-xs font-bold text-gray-500 uppercase mb-2">入社後の流れ</label>
                        <textarea rows={4} value={editingJobData.onboardingProcess || ''} onChange={(e) => setEditingJobData({...editingJobData, onboardingProcess: e.target.value})} className="w-full p-3 border border-gray-300 rounded-sm text-sm focus:outline-none focus:border-black font-medium leading-relaxed"/>
                     </div>

                     {/* 8. Flow */}
                     <div>
                         <label className="block text-xs font-bold text-gray-500 uppercase mb-4">選考フロー</label>
                         <div className="space-y-4">
                             {editingJobData.selectionFlow?.map((step, idx) => (
                                 <div key={idx} className="flex gap-4 items-start bg-gray-50 p-4 rounded-sm border border-gray-100">
                                     <div className="w-8 h-8 bg-black text-white rounded-full flex items-center justify-center font-bold text-sm flex-shrink-0">
                                         {idx + 1}
                                     </div>
                                     <div className="flex-1 space-y-2">
                                         <input 
                                            type="text" 
                                            value={step.title} 
                                            onChange={(e) => handleFlowChange(idx, 'title', e.target.value)} 
                                            placeholder="ステップ名 (例: 書類選考)"
                                            className="w-full p-2 border border-gray-300 rounded-sm text-sm font-bold focus:outline-none focus:border-black"
                                         />
                                         <input 
                                            type="text" 
                                            value={step.description} 
                                            onChange={(e) => handleFlowChange(idx, 'description', e.target.value)} 
                                            placeholder="詳細説明"
                                            className="w-full p-2 border border-gray-300 rounded-sm text-xs focus:outline-none focus:border-black"
                                         />
                                     </div>
                                     <button onClick={() => removeFlowStep(idx)} className="text-gray-400 hover:text-red-500 p-1"><X size={16}/></button>
                                 </div>
                             ))}
                             <button onClick={addFlowStep} className="w-full py-3 border-2 border-dashed border-gray-300 rounded-sm text-sm font-bold text-gray-500 hover:border-black hover:text-black transition-colors flex items-center justify-center gap-2">
                                 <Plus size={16}/> ステップを追加
                             </button>
                         </div>
                     </div>
                </div>
            </div>
        );
    }

    // Detail View
    if (viewingJob) {
        return (
            <div className="p-8 md:p-10 max-w-5xl mx-auto animate-fade-in">
                 <div className="flex justify-between items-start mb-8">
                     <button onClick={() => setViewingJob(null)} className="text-gray-500 hover:text-black font-bold text-sm flex items-center gap-1">
                        <ArrowLeft size={16}/> 一覧に戻る
                     </button>
                     <div className="flex gap-3">
                         <button onClick={() => handleDeleteJob(viewingJob.id)} className="px-4 py-2 border border-red-200 bg-red-50 text-red-600 text-sm font-bold rounded-sm hover:bg-red-100 transition-colors flex items-center gap-2"><Trash2 size={16}/> 削除</button>
                         <button onClick={() => handleEditExistingJob(viewingJob)} className="px-6 py-2 bg-black text-white text-sm font-bold rounded-sm hover:bg-gray-800 transition-colors flex items-center gap-2"><Edit2 size={16}/> 編集</button>
                     </div>
                 </div>

                 <div className="bg-white rounded-sm shadow-sm border border-gray-200 overflow-hidden">
                     <div className="h-64 relative">
                         <img src={viewingJob.coverImageUrl} className="w-full h-full object-cover" alt="cover"/>
                         <div className="absolute top-4 right-4">
                             <span className={`px-3 py-1 text-xs font-bold rounded-sm uppercase ${viewingJob.status === 'published' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-600'}`}>
                                 {viewingJob.status === 'published' ? '公開中' : '下書き'}
                             </span>
                         </div>
                     </div>
                     <div className="p-8">
                         <h1 className="text-3xl font-black text-gray-900 mb-6">{viewingJob.title}</h1>
                         
                         <div className="grid grid-cols-2 gap-4 mb-8">
                            <div className="bg-gray-50 p-4 rounded-sm border border-gray-100">
                                <div className="text-xs font-bold text-gray-400 uppercase mb-1">給与</div>
                                <div className="text-lg font-bold text-gray-900">{viewingJob.salary}</div>
                            </div>
                            <div className="bg-gray-50 p-4 rounded-sm border border-gray-100">
                                <div className="text-xs font-bold text-gray-400 uppercase mb-1">勤務形態</div>
                                <div className="text-lg font-bold text-gray-900">{viewingJob.workStyle}</div>
                            </div>
                         </div>

                         <div className="space-y-8">
                             <div>
                                 <h3 className="text-lg font-black border-b border-gray-100 pb-2 mb-4">仕事概要</h3>
                                 <div className="text-gray-700 leading-relaxed" dangerouslySetInnerHTML={{ __html: viewingJob.description }} />
                             </div>
                             <div>
                                 <h3 className="text-lg font-black border-b border-gray-100 pb-2 mb-4">業務内容</h3>
                                 <div className="text-gray-700 leading-relaxed" dangerouslySetInnerHTML={{ __html: viewingJob.jobDetail || '' }} />
                             </div>
                             {viewingJob.corporateCulture && (
                                <div>
                                    <h3 className="text-lg font-black border-b border-gray-100 pb-2 mb-4">社風・カルチャー</h3>
                                    <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">{viewingJob.corporateCulture}</p>
                                </div>
                             )}
                             {viewingJob.skillsGainedDescription && (
                                <div>
                                    <h3 className="text-lg font-black border-b border-gray-100 pb-2 mb-4">得られるスキル</h3>
                                    <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">{viewingJob.skillsGainedDescription}</p>
                                </div>
                             )}
                             {viewingJob.onboardingProcess && (
                                <div>
                                    <h3 className="text-lg font-black border-b border-gray-100 pb-2 mb-4">入社後の流れ</h3>
                                    <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">{viewingJob.onboardingProcess}</p>
                                </div>
                             )}
                             <div>
                                 <h3 className="text-lg font-black border-b border-gray-100 pb-2 mb-4">選考フロー</h3>
                                 <div className="space-y-4">
                                     {viewingJob.selectionFlow?.map(step => (
                                         <div key={step.step} className="flex gap-4">
                                             <div className="w-8 h-8 rounded-full bg-black text-white flex items-center justify-center font-bold text-sm flex-shrink-0">{step.step}</div>
                                             <div>
                                                 <div className="font-bold text-gray-900">{step.title}</div>
                                                 <div className="text-sm text-gray-600">{step.description}</div>
                                             </div>
                                         </div>
                                     ))}
                                 </div>
                             </div>
                         </div>
                     </div>
                 </div>
            </div>
        );
    }

    // List View
    return (
        <div className="p-8 md:p-10 max-w-7xl mx-auto animate-fade-in-up">
            <div className="flex justify-between items-center mb-8">
                <div>
                    <h2 className="text-2xl font-black text-gray-900 tracking-tight">求人情報管理</h2>
                    <p className="text-sm text-gray-500 font-medium">作成済みの求人一覧</p>
                </div>
                <button onClick={handleAddNewJob} className="px-6 py-3 bg-black text-white text-sm font-bold rounded-sm hover:bg-gray-800 transition-colors flex items-center gap-2 shadow-lg hover:scale-105 transform duration-200">
                    <Plus size={18}/> 新規求人作成
                </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {jobs.map(job => (
                    <div 
                        key={job.id} 
                        onClick={() => setViewingJob(job)}
                        className="bg-white border border-gray-200 rounded-sm overflow-hidden group cursor-pointer hover:shadow-xl transition-all duration-300 relative"
                    >
                        <div className="h-48 relative overflow-hidden">
                            <img src={job.coverImageUrl} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" alt="cover"/>
                            <div className="absolute top-3 right-3">
                                <span className={`px-2 py-1 text-[10px] font-bold rounded-sm uppercase shadow-sm ${job.status === 'published' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-600'}`}>
                                    {job.status === 'published' ? 'Public' : 'Draft'}
                                </span>
                            </div>
                        </div>
                        <div className="p-5">
                            <h3 className="font-bold text-gray-900 leading-snug mb-3 line-clamp-2 h-12 group-hover:text-blue-600 transition-colors">{job.title}</h3>
                            <div className="flex flex-wrap gap-2 mb-4">
                                {job.tags.slice(0, 3).map(tag => (
                                    <span key={tag} className="text-[10px] bg-gray-100 text-gray-600 px-2 py-1 rounded-sm font-bold">#{tag}</span>
                                ))}
                            </div>
                            <div className="flex justify-between items-center pt-4 border-t border-gray-100 text-xs font-bold text-gray-400">
                                <span className="flex items-center gap-1"><Clock size={12}/> {new Date().toLocaleDateString()}</span>
                                <span className="flex items-center gap-1 text-black group-hover:translate-x-1 transition-transform">詳細 <ArrowRight size={12}/></span>
                            </div>
                        </div>
                    </div>
                ))}
                
                {/* Empty State / Add New Card */}
                <button 
                    onClick={handleAddNewJob}
                    className="border-2 border-dashed border-gray-300 rounded-sm flex flex-col items-center justify-center h-full min-h-[300px] text-gray-400 hover:text-black hover:border-black hover:bg-gray-50 transition-all group"
                >
                    <div className="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center mb-4 group-hover:bg-white group-hover:shadow-md transition-all">
                        <Plus size={32} />
                    </div>
                    <span className="font-bold text-sm">新しい求人を作成</span>
                </button>
            </div>
        </div>
    );
  };

  const renderAnalytics = () => {
      const totalApplicants = candidates.length;
      const screeningCount = candidates.filter(c => c.status === '書類選考').length;
      const interviewCount = candidates.filter(c => c.status === '面談').length;
      const finishedCount = candidates.filter(c => c.status === '終了').length;

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
                      <div className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">書類選考</div>
                      <div className="text-4xl font-black text-blue-600">{screeningCount}</div>
                  </div>
                  <div className="bg-white p-6 rounded-sm shadow-sm border border-gray-100 border-l-4 border-l-orange-500">
                      <div className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">面談</div>
                      <div className="text-4xl font-black text-orange-600">{interviewCount}</div>
                  </div>
                  <div className="bg-white p-6 rounded-sm shadow-sm border border-gray-100 border-l-4 border-l-gray-500">
                      <div className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">終了</div>
                      <div className="text-4xl font-black text-gray-600">{finishedCount}</div>
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
                                              ${candidate.status === '書類選考' ? 'bg-blue-100 text-blue-700' : 
                                                candidate.status === '面談' ? 'bg-orange-100 text-orange-700' :
                                                'bg-gray-100 text-gray-500' // 終了
                                              }`}>
                                              {candidate.status}
                                              {candidate.status === '終了' && candidate.result === 'adopted' && ' (採用)'}
                                              {candidate.status === '終了' && candidate.result === 'rejected' && ' (不採用)'}
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
    const isFinished = selectedCandidate?.status === '終了';
    const isAdopted = selectedCandidate?.result === 'adopted';
    const isRejected = selectedCandidate?.result === 'rejected';

    return (
        <div className="p-8 md:p-10 max-w-7xl mx-auto h-full">
            <div className="bg-white rounded-sm shadow-sm border border-gray-200 flex h-[800px] overflow-hidden animate-fade-in-up">
                {/* Candidate List (Left) */}
                <div className="w-96 border-r border-gray-100 flex flex-col bg-gray-50/50">
                    <div className="p-6 border-b border-gray-100 bg-white">
                        <div className="relative">
                            <input type="text" placeholder="候補者を検索" className="w-full bg-gray-50 pl-10 pr-4 py-3 text-sm rounded-sm focus:outline-none focus:bg-white focus:ring-1 focus:ring-gray-300 transition-all font-medium"/>
                            <Search size={16} className="absolute left-3 top-3.5 text-gray-400"/>
                        </div>
                    </div>
                    <div className="flex-1 overflow-y-auto">
                        {candidates.map(candidate => (
                            <div 
                                key={candidate.id} 
                                onClick={() => setSelectedCandidateId(candidate.id)}
                                className={`p-6 border-b border-gray-100 cursor-pointer hover:bg-white transition-all ${selectedCandidateId === candidate.id ? 'bg-white border-l-4 border-l-black shadow-sm' : 'border-l-4 border-l-transparent'}`}
                            >
                                <div className="flex justify-between items-start mb-2">
                                    <h4 className="font-bold text-base text-gray-900">{candidate.name}</h4>
                                    <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded-sm uppercase tracking-wide
                                        ${candidate.status === '書類選考' ? 'bg-blue-100 text-blue-700' : 
                                          candidate.status === '面談' ? 'bg-orange-100 text-orange-700' :
                                          'bg-gray-100 text-gray-500'
                                        }`}>
                                        {candidate.status}
                                    </span>
                                </div>
                                <p className="text-sm text-gray-500 mb-2 font-bold">{candidate.university}</p>
                                <p className="text-xs text-gray-400 truncate">{candidate.lastMsg}</p>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Chat Area (Right) */}
                <div className="flex-1 flex flex-col bg-white relative">
                    {selectedCandidateId ? (
                        <>
                            <div className="px-8 py-6 border-b border-gray-100 flex justify-between items-center shadow-sm z-10 bg-white">
                                <div>
                                    <h3 className="font-black text-2xl text-gray-900 flex items-center gap-2">
                                        {selectedCandidate?.name}
                                        <button 
                                            onClick={() => setShowStudentModal(true)}
                                            className="ml-2 text-gray-400 hover:text-black"
                                            title="学生詳細を見る"
                                        >
                                            <Info size={20} />
                                        </button>
                                    </h3>
                                    <p className="text-sm text-gray-500 font-bold mt-1">
                                        {selectedCandidate?.university} | {selectedCandidate?.appliedJob}
                                    </p>
                                </div>
                                {/* Status Badge */}
                                <div className="flex flex-col items-end">
                                    <span className={`text-xs font-black uppercase tracking-widest px-3 py-1 rounded-full border 
                                        ${selectedCandidate?.status === '書類選考' ? 'text-blue-600 border-blue-200 bg-blue-50' : 
                                          selectedCandidate?.status === '面談' ? 'text-orange-600 border-orange-200 bg-orange-50' : 
                                          'text-gray-500 border-gray-200 bg-gray-50'}`}>
                                        {selectedCandidate?.status}
                                    </span>
                                    {selectedCandidate?.status === '終了' && (
                                        <span className="text-[10px] font-bold text-gray-400 mt-1">
                                            結果: {selectedCandidate.result === 'adopted' ? '採用' : '不採用'}
                                        </span>
                                    )}
                                </div>
                            </div>
                            
                            <div className="flex-1 p-8 overflow-y-auto space-y-6 bg-gray-50/30">
                                <div className="text-center text-xs text-gray-400 font-bold uppercase tracking-widest my-4">Today</div>
                                
                                {chatMessages.map(msg => (
                                    <div key={msg.id} className={`flex ${msg.sender === 'company' ? 'justify-end' : 'justify-start'}`}>
                                        {msg.sender === 'student' && <div className="w-10 h-10 rounded-full bg-gray-300 mr-4 flex-shrink-0"></div>}
                                        <div className={`p-5 rounded-2xl max-w-[70%] text-base shadow-sm leading-relaxed ${
                                            msg.sender === 'company' 
                                            ? 'bg-blue-600 text-white rounded-tr-none' // Company = Blue (Not Black)
                                            : 'bg-white text-gray-800 rounded-tl-none border border-gray-200' 
                                        }`}>
                                            {msg.text}
                                        </div>
                                        {msg.sender === 'company' && <div className="w-10 h-10 rounded-full bg-gray-800 ml-4 flex-shrink-0"></div>}
                                    </div>
                                ))}
                                
                                {isAdopted && (
                                    <div className="flex justify-center mt-8 animate-fade-in-up">
                                        <div className="bg-green-50 border border-green-200 text-green-800 text-sm font-bold px-8 py-4 rounded-md flex items-center gap-2 shadow-sm">
                                            <CheckCircle size={20}/> 内定通知を送信しました（選考終了）
                                        </div>
                                    </div>
                                )}
                                {isRejected && (
                                    <div className="flex justify-center mt-8 animate-fade-in-up">
                                        <div className="bg-gray-100 border border-gray-200 text-gray-500 text-sm font-bold px-8 py-4 rounded-md flex items-center gap-2 shadow-sm">
                                            <AlertCircle size={20}/> 不採用通知済み（選考終了）
                                        </div>
                                    </div>
                                )}
                            </div>
                            
                            {/* Action Area */}
                            <div className="bg-white border-t border-gray-100 relative z-20">
                                {/* Action Buttons Based on Status - Updated Styling */}
                                {!isFinished && (
                                    <div className="absolute bottom-full left-0 right-0 flex flex-col items-center justify-center gap-3 pb-6 pointer-events-none bg-gradient-to-t from-white/80 via-white/50 to-transparent pt-10">
                                        {selectedCandidate?.status === '書類選考' && (
                                            <button 
                                                onClick={() => handleMoveToInterview(selectedCandidateId)}
                                                className="pointer-events-auto w-[70%] bg-black text-white border border-black px-6 py-2.5 rounded-full shadow-lg transition-all flex items-center justify-center gap-3 font-bold text-sm hover:scale-105"
                                            >
                                                <UserCheck size={16}/> 面談へ進む
                                            </button>
                                        )}
                                        
                                        {selectedCandidate?.status === '面談' && (
                                            <button 
                                                onClick={() => handleHire(selectedCandidateId)}
                                                className="pointer-events-auto w-[70%] bg-black text-white border border-black px-6 py-2.5 rounded-full shadow-lg transition-all flex items-center justify-center gap-3 font-bold text-sm hover:scale-105"
                                            >
                                                <CheckCircle size={16}/> 採用する
                                            </button>
                                        )}

                                        <button 
                                            onClick={() => handleReject(selectedCandidateId)}
                                            className="pointer-events-auto w-[70%] bg-white text-gray-500 border border-gray-300 px-6 py-2.5 rounded-full shadow-lg transition-all font-bold text-sm hover:bg-gray-50 hover:text-black flex items-center justify-center gap-3"
                                        >
                                            <X size={16}/> 不採用
                                        </button>
                                    </div>
                                )}

                                <div className="p-6 flex gap-4 items-center">
                                    <button className="p-2 text-gray-400 hover:text-black transition-colors rounded-full hover:bg-gray-100">
                                        <Plus size={24}/>
                                    </button>
                                    <div className="flex-1 relative">
                                        <input 
                                            type="text" 
                                            value={chatInput}
                                            onChange={(e) => setChatInput(e.target.value)}
                                            onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
                                            disabled={isFinished}
                                            className={`w-full bg-gray-50 border border-transparent px-6 py-4 rounded-xl text-base focus:bg-white focus:border-gray-200 focus:ring-0 outline-none transition-all placeholder-gray-400 font-medium ${isFinished ? 'opacity-50 cursor-not-allowed' : ''}`}
                                            placeholder={isFinished ? "メッセージ送信は無効です" : "メッセージを入力..."}
                                        />
                                    </div>
                                    <button 
                                        onClick={handleSendMessage}
                                        disabled={isFinished || !chatInput} 
                                        className={`p-4 rounded-full transition-all shadow-md ${isFinished || !chatInput ? 'bg-gray-100 text-gray-300' : 'bg-blue-600 text-white hover:bg-blue-700 hover:scale-105'}`}
                                    >
                                        <Send size={20}/>
                                    </button>
                                </div>
                            </div>
                        </>
                    ) : (
                        <div className="flex-1 flex items-center justify-center text-gray-300 font-bold flex-col gap-4 bg-gray-50/30">
                            <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center">
                                <MessageSquare size={40} className="opacity-50"/>
                            </div>
                            <p className="text-lg">左側のリストから候補者を選択してください</p>
                        </div>
                    )}
                </div>
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
                            <label className="block text-xs font-bold text-gray-500 uppercase mb-2">求人名 (自動入力)</label>
                            <input 
                                type="text" 
                                value={contactForm.jobTitle}
                                readOnly
                                className="w-full p-3 border border-gray-200 rounded-sm text-sm bg-gray-100 text-gray-600 font-bold"
                            />
                          </div>
                          <div>
                            <label className="block text-xs font-bold text-gray-500 uppercase mb-2">候補者名 (自動入力)</label>
                            <input 
                                type="text" 
                                value={contactForm.candidateName}
                                readOnly
                                className="w-full p-3 border border-gray-200 rounded-sm text-sm bg-gray-100 text-gray-600 font-bold"
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
      <aside className="w-72 bg-black border-r border-gray-800 flex-shrink-0 flex flex-col z-20 shadow-xl">
           <div className="h-24 flex items-center px-8 border-b border-gray-800">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-white text-black flex items-center justify-center font-black text-base rounded-sm">Ti</div>
                    <span className="font-black text-xl tracking-tight text-white">Tech intern</span>
                </div>
           </div>

           <nav className="flex-1 py-8 px-6 space-y-2">
                <button 
                    onClick={() => setActiveTab('analytics')}
                    className={`w-full flex items-center gap-4 px-4 py-5 text-lg font-bold rounded-md transition-all ${activeTab === 'analytics' ? 'bg-gray-800 text-white shadow-md' : 'text-gray-400 hover:text-white hover:bg-gray-900'}`}
                >
                    <BarChart2 size={22}/> 情報管理
                </button>
                <button 
                    onClick={() => setActiveTab('info')}
                    className={`w-full flex items-center gap-4 px-4 py-5 text-lg font-bold rounded-md transition-all ${activeTab === 'info' ? 'bg-gray-800 text-white shadow-md' : 'text-gray-400 hover:text-white hover:bg-gray-900'}`}
                >
                    <LayoutDashboard size={22}/> 会社情報
                </button>
                <button 
                    onClick={() => setActiveTab('recruitment')}
                    className={`w-full flex items-center gap-4 px-4 py-5 text-lg font-bold rounded-md transition-all ${activeTab === 'recruitment' ? 'bg-gray-800 text-white shadow-md' : 'text-gray-400 hover:text-white hover:bg-gray-900'}`}
                >
                    <Briefcase size={22}/> 採用情報
                </button>
                <button 
                    onClick={() => setActiveTab('candidates')}
                    className={`w-full flex items-center gap-4 px-4 py-5 text-lg font-bold rounded-md transition-all ${activeTab === 'candidates' ? 'bg-gray-800 text-white shadow-md' : 'text-gray-400 hover:text-white hover:bg-gray-900'}`}
                >
                    <Users size={22}/> 候補者管理
                </button>
           </nav>

           <div className="p-6 border-t border-gray-800 space-y-4">
               <button onClick={onNavigateHome} className="w-full flex items-center gap-3 text-gray-400 hover:text-white px-4 py-3 text-sm font-bold rounded-sm transition-colors">
                   <Home size={18}/> サイトTOPへ
               </button>
               <button onClick={onLogout} className="w-full flex items-center gap-3 text-gray-500 hover:text-red-400 px-4 py-3 text-sm font-bold rounded-sm transition-colors">
                   <LogOut size={18}/> ログアウト
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