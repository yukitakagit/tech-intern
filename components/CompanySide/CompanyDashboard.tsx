
import React, { useState, useRef, useEffect } from 'react';
import { Company, JobListing } from '../../types';
import { JOB_LISTINGS } from '../../constants';
import { 
    Save, LogOut, Building2, Users, FileText, 
    Briefcase, LayoutDashboard, MessageSquare, Plus, Edit2, Search, Send, Trash2, CheckCircle,
    Home, BarChart2, X, AlertCircle, Upload, Clock, ArrowLeft, ArrowRight, Info, UserCheck, MapPin,
    Bold, Italic, List, Image as ImageIcon
} from 'lucide-react';

interface CompanyDashboardProps {
  companyName: string;
  onLogout: () => void;
  onNavigateHome: () => void;
}

type DashboardTab = 'info' | 'recruitment' | 'candidates' | 'analytics';
type CandidateStatus = '書類選考' | '面談' | '終了';
type CandidateResult = 'adopted' | 'rejected' | null; // For '終了' status

// --- Rich Text Editor Component (Fixed Image Insertion) ---
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
    const savedRange = useRef<Range | null>(null); // Store cursor position
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

    const saveSelection = () => {
        const sel = window.getSelection();
        if (sel && sel.rangeCount > 0) {
            const range = sel.getRangeAt(0);
            // Ensure the selection is actually inside the editor
            if (editorRef.current && editorRef.current.contains(range.commonAncestorContainer)) {
                savedRange.current = range;
            }
        }
    };

    const execCmd = (command: string, value?: string) => {
        // Restore selection if saved
        if (savedRange.current && editorRef.current) {
            const sel = window.getSelection();
            sel?.removeAllRanges();
            sel?.addRange(savedRange.current);
        }
        
        document.execCommand(command, false, value);
        
        if (editorRef.current) {
            editorRef.current.focus();
            saveSelection(); // Save new position
        }
        handleInput();
    };

    const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                const imgTag = `<img src="${reader.result}" alt="inserted" style="max-width:100%; border-radius: 4px; margin: 10px 0;" /><br/>`;
                
                if (editorRef.current) {
                    editorRef.current.focus();
                    
                    // Restore range if it exists inside the editor
                    if (savedRange.current) {
                        const sel = window.getSelection();
                        sel?.removeAllRanges();
                        sel?.addRange(savedRange.current);
                    }
                    
                    document.execCommand('insertHTML', false, imgTag);
                    handleInput();
                }
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
                    {/* Use onMouseDown preventDefault to keep focus in editor when clicking toolbar */}
                    <button onMouseDown={(e) => e.preventDefault()} onClick={() => execCmd('bold')} className="p-2 hover:bg-gray-200 rounded text-gray-700" title="太字"><Bold size={16}/></button>
                    <button onMouseDown={(e) => e.preventDefault()} onClick={() => execCmd('italic')} className="p-2 hover:bg-gray-200 rounded text-gray-700" title="斜体"><Italic size={16}/></button>
                    <button onMouseDown={(e) => e.preventDefault()} onClick={() => execCmd('insertUnorderedList')} className="p-2 hover:bg-gray-200 rounded text-gray-700" title="リスト"><List size={16}/></button>
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
                    onFocus={() => isFocused.current = true}
                    onBlur={() => { 
                        isFocused.current = false; 
                        saveSelection(); // Save selection on blur (e.g. clicking file input)
                        handleInput(); 
                    }}
                    onKeyUp={saveSelection} // Save selection as we type
                    onMouseUp={saveSelection} // Save selection as we click/select
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
  const [jobs, setJobs] = useState<JobListing[]>(JOB_LISTINGS.slice(0, 3).map(j => ({...j, status: 'published' as const})));
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

  const handleProfileChange = (field: Exclude<keyof Company, 'members'>, value: string) => {
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
