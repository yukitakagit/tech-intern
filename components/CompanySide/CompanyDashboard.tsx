
import React, { useState, useRef, useEffect } from 'react';
import { Company, JobListing, UserProfile } from '../../types'; // Imported UserProfile
import { JOB_LISTINGS, INITIAL_USER_PROFILE } from '../../constants'; // Imported INITIAL_USER_PROFILE
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
  const [viewingStudent, setViewingStudent] = useState<UserProfile | null>(null);

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
          skillsGainedDescription: '',
          onboardingProcess: '',
          skillsGained: [],
          selectionFlow: [
              { step: 1, title: '書類選考', description: 'プロフィールをもとに選考します' },
              { step: 2, title: 'カジュアル面談', description: 'オンラインで実施' },
              { step: 3, title: '内定', description: '' }
          ],
          status: 'draft',
          company: profile as Company,
          // Initialize new fields
          alumniDestinations: '',
          salaryDetail: '',
          probationPeriod: '',
          probationSalary: '',
          transportationAllowance: '',
          requirements: '',
          workDays: '',
          workFrequency: '',
          workHours: '',
          otherConditions: '', // Added
          targetGrade: '',
          numberOfHires: '',
          workLocation: '',
          nearestStation: '',
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
     // Explicit confirmation as requested
     if (confirm('本当に不採用でよろしいですか')) {
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

  const handleShowStudentDetail = (name: string) => {
      // Mock fetching student detail by name/id
      // In a real app, this would fetch from API
      const mockStudent = { ...INITIAL_USER_PROFILE, name };
      setViewingStudent(mockStudent);
      setShowStudentModal(true);
  }

  // --- Render Functions ---

  const renderInfo = () => {
    // ... (unchanged)
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

  const renderAnalytics = () => (
      <div className="p-8 md:p-10 max-w-7xl mx-auto animate-fade-in-up">
          <h2 className="text-2xl font-black text-gray-900 mb-8 tracking-tight">ダッシュボード</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
              <div className="bg-white p-6 rounded-sm border border-gray-200 shadow-sm">
                  <div className="text-xs font-bold text-gray-400 uppercase mb-2">総エントリー数</div>
                  <div className="text-3xl font-black text-gray-900">142<span className="text-sm font-medium text-gray-500 ml-1">件</span></div>
              </div>
              <div className="bg-white p-6 rounded-sm border border-gray-200 shadow-sm">
                  <div className="text-xs font-bold text-gray-400 uppercase mb-2">気になるリスト登録数</div>
                  <div className="text-3xl font-black text-gray-900">1,240<span className="text-sm font-medium text-gray-500 ml-1">件</span></div>
              </div>
              <div className="bg-white p-6 rounded-sm border border-gray-200 shadow-sm">
                  <div className="text-xs font-bold text-gray-400 uppercase mb-2">面談実施数</div>
                  <div className="text-3xl font-black text-gray-900">24<span className="text-sm font-medium text-gray-500 ml-1">件</span></div>
              </div>
              <div className="bg-white p-6 rounded-sm border border-gray-200 shadow-sm">
                  <div className="text-xs font-bold text-gray-400 uppercase mb-2">採用内定数</div>
                  <div className="text-3xl font-black text-gray-900">5<span className="text-sm font-medium text-gray-500 ml-1">名</span></div>
              </div>
          </div>

          <div className="bg-white p-8 rounded-sm border border-gray-200 shadow-sm">
              <h3 className="font-bold text-lg mb-6">直近のアクティビティ</h3>
              <ul className="space-y-4">
                  {[
                      { text: '田中 太郎 さんが「Go言語バックエンド」に応募しました', time: '10分前' },
                      { text: '求人「フロントエンドエンジニア」を公開しました', time: '2時間前' },
                      { text: '鈴木 一郎 さんとの面談が完了しました', time: '昨日' },
                  ].map((item, i) => (
                      <li key={i} className="flex items-center gap-4 text-sm border-b border-gray-50 pb-4 last:border-0 last:pb-0">
                          <div className="w-2 h-2 rounded-full bg-blue-500"></div>
                          <span className="flex-1 font-medium">{item.text}</span>
                          <span className="text-gray-400 text-xs">{item.time}</span>
                      </li>
                  ))}
              </ul>
          </div>
      </div>
  );

  const renderRecruitment = () => {
    // EDIT MODE
    if (isEditingJob && editingJobData) {
        return (
            <div className="p-8 md:p-10 max-w-5xl mx-auto animate-fade-in pb-20">
                <div className="flex justify-between items-center mb-8 border-b border-gray-200 pb-4 sticky top-0 bg-gray-100 z-10 pt-4 -mt-4">
                    <h2 className="text-2xl font-black text-gray-900">求人編集</h2>
                    <div className="flex gap-3">
                        <button onClick={() => { setIsEditingJob(false); setEditingJobData(null); }} className="px-6 py-2 text-sm font-bold text-gray-500 hover:text-black transition-colors">キャンセル</button>
                        <button onClick={() => handleJobSave('draft')} className="px-6 py-2 border border-gray-300 text-gray-600 text-sm font-bold rounded-sm hover:bg-gray-50 flex items-center gap-2"><FileText size={16}/> 下書き保存</button>
                        <button onClick={() => handleJobSave('published')} className="px-6 py-2 bg-black text-white text-sm font-bold rounded-sm hover:bg-gray-800 flex items-center gap-2"><Save size={16}/> 公開</button>
                    </div>
                </div>

                <div className="space-y-8 bg-white p-8 rounded-sm shadow-sm border border-gray-200">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="md:col-span-2">
                            <label className="block text-xs font-bold text-gray-500 uppercase mb-2">求人タイトル</label>
                            <input type="text" value={editingJobData.title} onChange={e => setEditingJobData({...editingJobData, title: e.target.value})} className="w-full p-3 border border-gray-300 rounded-sm font-bold text-lg focus:outline-none focus:border-black" placeholder="例）Go言語を用いたバックエンド開発"/>
                        </div>
                        
                        <div>
                            <label className="block text-xs font-bold text-gray-500 uppercase mb-2">給与</label>
                            <input type="text" value={editingJobData.salary} onChange={e => setEditingJobData({...editingJobData, salary: e.target.value})} className="w-full p-3 border border-gray-300 rounded-sm text-sm focus:outline-none focus:border-black"/>
                        </div>
                        <div>
                            <label className="block text-xs font-bold text-gray-500 uppercase mb-2">勤務体系</label>
                            <select value={editingJobData.workStyle} onChange={e => setEditingJobData({...editingJobData, workStyle: e.target.value as any})} className="w-full p-3 border border-gray-300 rounded-sm text-sm focus:outline-none focus:border-black">
                                <option value="Remote">Remote</option>
                                <option value="Hybrid">Hybrid</option>
                                <option value="On-site">On-site</option>
                            </select>
                        </div>

                         {/* Cover Image */}
                        <div className="md:col-span-2">
                            <label className="block text-xs font-bold text-gray-500 uppercase mb-2">カバー画像</label>
                            <div className="relative h-48 w-full bg-gray-100 rounded-sm overflow-hidden group border-2 border-dashed border-gray-300 hover:border-black transition-colors">
                                {editingJobData.coverImageUrl ? (
                                    <>
                                        <img src={editingJobData.coverImageUrl} className="w-full h-full object-cover" alt="cover"/>
                                        <button 
                                            onClick={(e) => { e.preventDefault(); handleRemoveImage('job'); }}
                                            className="absolute top-2 right-2 bg-white/80 p-2 rounded-full text-gray-600 hover:text-red-600 hover:bg-white z-20"
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
                                        <input type="file" className="hidden" accept="image/*" onChange={(e) => handleImageUpload(e, 'job')}/>
                                    </label>
                                </div>
                            </div>
                        </div>

                        {/* Detailed Text Fields */}
                         <div className="md:col-span-2 space-y-6">
                            <RichTextEditor label="企業紹介" value={editingJobData.description || ''} onChange={val => setEditingJobData({...editingJobData, description: val})} />
                            <RichTextEditor label="事業内容" value={editingJobData.businessContent || ''} onChange={val => setEditingJobData({...editingJobData, businessContent: val})} />
                            <RichTextEditor label="業務詳細 (こんなことやります)" value={editingJobData.jobDetail || ''} onChange={val => setEditingJobData({...editingJobData, jobDetail: val})} />
                        </div>
                    </div>

                    {/* NEW: Recruitment Requirements Fields - Restored */}
                     <div>
                         <h3 className="font-bold text-sm bg-gray-100 p-2 mb-4">募集要項詳細</h3>
                         <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                             <div>
                                 <label className="block text-xs font-bold text-gray-500 uppercase mb-2">インターン卒業生の内定先企業</label>
                                 <input type="text" value={editingJobData.alumniDestinations || ''} onChange={(e) => setEditingJobData({...editingJobData, alumniDestinations: e.target.value})} className="w-full p-3 border border-gray-300 rounded-sm text-sm focus:outline-none focus:border-black font-medium"/>
                             </div>
                             <div>
                                 <label className="block text-xs font-bold text-gray-500 uppercase mb-2">給与詳細</label>
                                 <textarea rows={2} value={editingJobData.salaryDetail || ''} onChange={(e) => setEditingJobData({...editingJobData, salaryDetail: e.target.value})} className="w-full p-3 border border-gray-300 rounded-sm text-sm focus:outline-none focus:border-black font-medium"/>
                             </div>
                             <div>
                                 <label className="block text-xs font-bold text-gray-500 uppercase mb-2">試用期間</label>
                                 <input type="text" value={editingJobData.probationPeriod || ''} onChange={(e) => setEditingJobData({...editingJobData, probationPeriod: e.target.value})} className="w-full p-3 border border-gray-300 rounded-sm text-sm focus:outline-none focus:border-black font-medium"/>
                             </div>
                             <div>
                                 <label className="block text-xs font-bold text-gray-500 uppercase mb-2">使用期間の給与</label>
                                 <input type="text" value={editingJobData.probationSalary || ''} onChange={(e) => setEditingJobData({...editingJobData, probationSalary: e.target.value})} className="w-full p-3 border border-gray-300 rounded-sm text-sm focus:outline-none focus:border-black font-medium"/>
                             </div>
                             <div>
                                 <label className="block text-xs font-bold text-gray-500 uppercase mb-2">交通費の支給</label>
                                 <input type="text" value={editingJobData.transportationAllowance || ''} onChange={(e) => setEditingJobData({...editingJobData, transportationAllowance: e.target.value})} className="w-full p-3 border border-gray-300 rounded-sm text-sm focus:outline-none focus:border-black font-medium"/>
                             </div>
                             {/* UPDATED: Requirements to RichTextEditor */}
                             <div className="md:col-span-2">
                                 <RichTextEditor label="応募資格" value={editingJobData.requirements || ''} onChange={(val) => setEditingJobData({...editingJobData, requirements: val})} />
                             </div>
                             <div>
                                 <label className="block text-xs font-bold text-gray-500 uppercase mb-2">勤務曜日</label>
                                 <input type="text" value={editingJobData.workDays || ''} onChange={(e) => setEditingJobData({...editingJobData, workDays: e.target.value})} className="w-full p-3 border border-gray-300 rounded-sm text-sm focus:outline-none focus:border-black font-medium"/>
                             </div>
                             <div>
                                 <label className="block text-xs font-bold text-gray-500 uppercase mb-2">勤務日数</label>
                                 <input type="text" value={editingJobData.workFrequency || ''} onChange={(e) => setEditingJobData({...editingJobData, workFrequency: e.target.value})} className="w-full p-3 border border-gray-300 rounded-sm text-sm focus:outline-none focus:border-black font-medium"/>
                             </div>
                             <div>
                                 <label className="block text-xs font-bold text-gray-500 uppercase mb-2">勤務時間</label>
                                 <input type="text" value={editingJobData.workHours || ''} onChange={(e) => setEditingJobData({...editingJobData, workHours: e.target.value})} className="w-full p-3 border border-gray-300 rounded-sm text-sm focus:outline-none focus:border-black font-medium"/>
                             </div>
                             {/* ADDED: Other Conditions (below workHours) */}
                             <div>
                                 <label className="block text-xs font-bold text-gray-500 uppercase mb-2">その他勤務条件</label>
                                 <textarea rows={3} value={editingJobData.otherConditions || ''} onChange={(e) => setEditingJobData({...editingJobData, otherConditions: e.target.value})} className="w-full p-3 border border-gray-300 rounded-sm text-sm focus:outline-none focus:border-black font-medium"/>
                             </div>
                             <div>
                                 <label className="block text-xs font-bold text-gray-500 uppercase mb-2">対象学年</label>
                                 <input type="text" value={editingJobData.targetGrade || ''} onChange={(e) => setEditingJobData({...editingJobData, targetGrade: e.target.value})} className="w-full p-3 border border-gray-300 rounded-sm text-sm focus:outline-none focus:border-black font-medium"/>
                             </div>
                             <div>
                                 <label className="block text-xs font-bold text-gray-500 uppercase mb-2">募集人数</label>
                                 <input type="text" value={editingJobData.numberOfHires || ''} onChange={(e) => setEditingJobData({...editingJobData, numberOfHires: e.target.value})} className="w-full p-3 border border-gray-300 rounded-sm text-sm focus:outline-none focus:border-black font-medium"/>
                             </div>
                             <div>
                                 <label className="block text-xs font-bold text-gray-500 uppercase mb-2">勤務地</label>
                                 <input type="text" value={editingJobData.workLocation || ''} onChange={(e) => setEditingJobData({...editingJobData, workLocation: e.target.value})} className="w-full p-3 border border-gray-300 rounded-sm text-sm focus:outline-none focus:border-black font-medium"/>
                             </div>
                             <div>
                                 <label className="block text-xs font-bold text-gray-500 uppercase mb-2">最寄り駅</label>
                                 <input type="text" value={editingJobData.nearestStation || ''} onChange={(e) => setEditingJobData({...editingJobData, nearestStation: e.target.value})} className="w-full p-3 border border-gray-300 rounded-sm text-sm focus:outline-none focus:border-black font-medium"/>
                             </div>
                         </div>
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

                    {/* Selection Flow */}
                    <div className="border-t border-gray-100 pt-8 mt-8">
                        <div className="flex justify-between items-center mb-4">
                            <h3 className="font-bold text-gray-900">選考フロー</h3>
                            <button onClick={addFlowStep} className="text-xs font-bold bg-gray-100 hover:bg-gray-200 px-3 py-1 rounded-sm flex items-center gap-1"><Plus size={12}/> ステップ追加</button>
                        </div>
                        <div className="space-y-4">
                            {editingJobData.selectionFlow?.map((step, index) => (
                                <div key={index} className="flex gap-4 items-start bg-gray-50 p-4 rounded-sm border border-gray-200">
                                    <div className="w-8 h-8 bg-black text-white rounded-full flex items-center justify-center font-bold flex-shrink-0 mt-1">{step.step}</div>
                                    <div className="flex-1 space-y-2">
                                        <input 
                                            type="text" 
                                            placeholder="タイトル (例: 書類選考)" 
                                            value={step.title}
                                            onChange={(e) => handleFlowChange(index, 'title', e.target.value)}
                                            className="w-full p-2 border border-gray-300 rounded-sm text-sm"
                                        />
                                        <textarea 
                                            placeholder="詳細説明" 
                                            rows={2}
                                            value={step.description}
                                            onChange={(e) => handleFlowChange(index, 'description', e.target.value)}
                                            className="w-full p-2 border border-gray-300 rounded-sm text-sm"
                                        />
                                    </div>
                                    <button onClick={() => removeFlowStep(index)} className="text-gray-400 hover:text-red-500 p-1"><X size={16}/></button>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    // VIEW MODE - Updated to match Student View (JobDetailPage.tsx)
    if (viewingJob) {
         return (
             <div className="p-0 animate-fade-in bg-white min-h-screen pb-20">
                 {/* Top Navigation for Preview */}
                 <div className="bg-gray-100 p-4 flex justify-between items-center border-b border-gray-200 sticky top-0 z-20">
                     <button onClick={() => setViewingJob(null)} className="text-gray-600 hover:text-black font-bold text-sm flex items-center gap-1"><ArrowLeft size={16}/> 求人一覧に戻る</button>
                     <div className="flex gap-2">
                         <div className="flex gap-2 mr-4">
                             {viewingJob.status === 'draft' && <span className="bg-gray-500 text-white text-xs font-bold px-2 py-1 rounded-sm uppercase">Draft</span>}
                             {viewingJob.status === 'published' && <span className="bg-green-500 text-white text-xs font-bold px-2 py-1 rounded-sm uppercase">Published</span>}
                         </div>
                         <button onClick={() => handleDeleteJob(viewingJob.id)} className="p-2 text-red-500 hover:bg-red-50 rounded-sm" title="削除"><Trash2 size={18}/></button>
                         <button onClick={() => handleEditExistingJob(viewingJob)} className="px-6 py-2 bg-black text-white text-sm font-bold rounded-sm hover:bg-gray-800 flex items-center gap-2"><Edit2 size={16}/> 編集</button>
                     </div>
                 </div>

                 {/* Hero Header */}
                 <div className="relative h-[300px] md:h-[400px] w-full bg-gray-900">
                    <img 
                      src={viewingJob.coverImageUrl} 
                      alt={viewingJob.title} 
                      className="w-full h-full object-cover opacity-60"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-transparent to-transparent"></div>
                    <div className="absolute bottom-0 left-0 w-full p-6 md:p-12 text-white max-w-7xl mx-auto">
                       <div className="inline-flex items-center gap-3 mb-4 bg-white/10 backdrop-blur-md px-4 py-2 rounded-full">
                          <img src={viewingJob.company.logoUrl} className="w-8 h-8 rounded-full bg-white border border-white" alt=""/>
                          <span className="font-bold tracking-wider">{viewingJob.company.name}</span>
                       </div>
                       <h1 className="text-xl md:text-3xl font-black leading-tight mb-6 max-w-4xl">{viewingJob.title}</h1>
                       <div className="flex flex-wrap gap-2">
                         {viewingJob.tags.map(tag => (
                           <span key={tag} className="px-3 py-1 bg-white text-black rounded-sm text-xs font-bold">
                             #{tag}
                           </span>
                         ))}
                       </div>
                    </div>
                 </div>

                 <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                    <div className="flex flex-col lg:flex-row gap-16">
                      
                      {/* Main Content */}
                      <div className="flex-1 space-y-16">
                        
                        {/* 1. Company Introduction */}
                        <section>
                             <div className="flex items-center gap-3 mb-6">
                                 <div className="w-10 h-1 bg-black"></div>
                                 <h3 className="text-xl font-black text-gray-900 uppercase">企業紹介</h3>
                             </div>
                             <div className="text-gray-800 leading-8 text-base font-medium whitespace-pre-wrap" dangerouslySetInnerHTML={{ __html: viewingJob.description }} />
                        </section>

                        {/* 2. Business Content */}
                        {(viewingJob.businessContent) && (
                            <section>
                                <div className="flex items-center gap-3 mb-6">
                                     <div className="w-10 h-1 bg-black"></div>
                                     <h3 className="text-xl font-black text-gray-900 uppercase">事業内容</h3>
                                </div>
                                <div className="text-gray-800 leading-8 text-base font-medium whitespace-pre-wrap" dangerouslySetInnerHTML={{ __html: viewingJob.businessContent }} />
                            </section>
                        )}

                        {/* 3. Job Detail */}
                        <section>
                            <div className="flex items-center gap-3 mb-6">
                                 <div className="w-10 h-1 bg-black"></div>
                                 <h3 className="text-xl font-black text-gray-900 uppercase">こんなことやります</h3>
                            </div>
                            <div className="text-gray-800 leading-8 text-base font-medium whitespace-pre-wrap" dangerouslySetInnerHTML={{ __html: viewingJob.jobDetail || '' }} />
                        </section>

                        {/* 4. Recruitment Requirements Table (Flat Design) */}
                        <section>
                            <div className="flex items-center gap-3 mb-6">
                                 <div className="w-10 h-1 bg-black"></div>
                                 <h3 className="text-xl font-black text-gray-900 uppercase">募集要項</h3>
                            </div>
                            <div className="overflow-hidden border-t border-gray-200">
                                <table className="w-full text-sm text-left">
                                    <tbody className="divide-y divide-gray-200 border-b border-gray-200">
                                        {[
                                            { label: 'インターン卒業生の内定先企業', value: viewingJob.alumniDestinations },
                                            { label: '給与詳細', value: viewingJob.salaryDetail },
                                            { label: '試用期間', value: viewingJob.probationPeriod },
                                            { label: '使用期間の給与', value: viewingJob.probationSalary },
                                            { label: '交通費の支給', value: viewingJob.transportationAllowance },
                                            { label: '応募資格', value: viewingJob.requirements },
                                            { label: '勤務曜日', value: viewingJob.workDays },
                                            { label: '勤務日数', value: viewingJob.workFrequency },
                                            { label: '勤務時間', value: viewingJob.workHours },
                                            { label: 'その他勤務条件', value: viewingJob.otherConditions }, // Added
                                            { label: '対象学年', value: viewingJob.targetGrade },
                                            { label: '募集人数', value: viewingJob.numberOfHires },
                                            { label: '勤務地', value: viewingJob.workLocation },
                                            { label: '最寄り駅', value: viewingJob.nearestStation },
                                        ].map((row, idx) => (
                                            <tr key={idx} className="bg-white">
                                                <th className="py-4 px-2 md:px-0 font-bold text-gray-500 w-1/3 md:w-1/4 align-top">
                                                    {row.label}
                                                </th>
                                                <td className="py-4 px-2 md:px-6 text-gray-800 font-medium whitespace-pre-wrap align-top">
                                                    {row.label === '応募資格' ? <div dangerouslySetInnerHTML={{ __html: row.value || '-'}}/> : (row.value || '-')}
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </section>

                        {/* 5. Skills */}
                        <section className="border-t border-gray-100 pt-10">
                            <h3 className="text-xl font-black text-gray-900 mb-6">
                                身につくスキル
                            </h3>
                            <div className="flex flex-wrap gap-3">
                                {viewingJob.skillsGained?.map((skill, idx) => (
                                    <div key={idx} className="flex items-center gap-2 px-4 py-2 bg-gray-100 rounded-sm text-sm font-bold text-gray-700">
                                        <CheckCircle size={14} className="text-blue-600"/>
                                        {skill}
                                    </div>
                                ))}
                                {(!viewingJob.skillsGained || viewingJob.skillsGained.length === 0) && <p className="text-gray-500">詳細はお問い合わせください</p>}
                            </div>
                        </section>

                         {/* 6. Flow */}
                         <section className="border-t border-gray-100 pt-10">
                            <h3 className="text-xl font-black text-gray-900 mb-8">
                                選考フロー
                            </h3>
                            <div className="space-y-8">
                                {viewingJob.selectionFlow?.map((flow, idx) => (
                                    <div key={idx} className="flex gap-6 relative group">
                                        {/* Connector Line */}
                                        {idx !== (viewingJob.selectionFlow!.length - 1) && (
                                            <div className="absolute left-5 top-10 bottom-[-32px] w-0.5 bg-gray-200 group-hover:bg-gray-300 transition-colors"></div>
                                        )}
                                        
                                        <div className="w-10 h-10 rounded-full bg-black text-white flex items-center justify-center font-bold text-lg flex-shrink-0 z-10 shadow-lg">
                                            {flow.step}
                                        </div>
                                        <div className="pt-1">
                                            <h4 className="font-bold text-lg text-gray-900 mb-1">{flow.title}</h4>
                                            <p className="text-sm text-gray-600 leading-relaxed">{flow.description}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </section>
                      </div>

                      {/* Sidebar (Mocked for Preview) */}
                      <div className="w-full lg:w-96 space-y-8 pointer-events-none opacity-80 filter grayscale-[0.3]">
                        <div className="bg-white rounded-sm shadow-xl border border-gray-100 sticky top-24 overflow-hidden">
                            <div className="h-32 w-full bg-gray-200 relative overflow-hidden">
                                <img src={viewingJob.company.coverImage} className="w-full h-full object-cover" alt=""/>
                                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                                <div className="absolute bottom-4 left-4 flex items-center gap-3">
                                    <div className="text-white">
                                        <h4 className="font-bold text-sm leading-tight">{viewingJob.company.name}</h4>
                                    </div>
                                </div>
                            </div>

                            <div className="p-6">
                                <div className="space-y-4 mb-8 text-sm">
                                    <div className="flex items-center justify-between border-b border-gray-100 pb-2">
                                         <div className="flex items-center gap-2 text-gray-500 font-bold">
                                            <Briefcase size={16}/> <span>業界</span>
                                         </div>
                                         <span className="font-bold text-gray-900">{viewingJob.company.industry || '-'}</span>
                                    </div>
                                    <div className="flex items-center justify-between border-b border-gray-100 pb-2">
                                         <div className="flex items-center gap-2 text-gray-500 font-bold">
                                            <Users size={16}/> <span>従業員数</span>
                                         </div>
                                         <span className="font-bold text-gray-900">{viewingJob.company.employees || '-'}</span>
                                    </div>
                                     <div className="flex flex-col gap-1 border-b border-gray-100 pb-2">
                                         <div className="flex items-center gap-2 text-gray-500 font-bold mb-1">
                                            <Building2 size={16}/> <span>本社所在地</span>
                                         </div>
                                         <span className="font-bold text-gray-900 leading-snug">{viewingJob.company.address || viewingJob.company.location}</span>
                                    </div>
                                </div>
                                
                                <div className="grid grid-cols-2 gap-4 mb-8">
                                    <div className="bg-gray-50 p-3 rounded-sm">
                                        <span className="block text-xs font-bold text-gray-400 mb-1">給与</span>
                                        <span className="block font-black text-gray-900 text-sm">{viewingJob.salary}</span>
                                    </div>
                                     <div className="bg-gray-50 p-3 rounded-sm">
                                        <span className="block text-xs font-bold text-gray-400 mb-1">勤務形態</span>
                                        <span className="block font-black text-gray-900 text-sm">{viewingJob.workStyle}</span>
                                    </div>
                                </div>

                                <button className="w-full bg-black text-white font-bold py-4 px-6 rounded-sm shadow-md flex items-center justify-center gap-3">
                                    話を聞きに行きたい <ArrowRight size={18}/>
                                </button>
                            </div>
                        </div>
                      </div>

                    </div>
                 </div>
             </div>
         );
    }

    // LIST MODE
    return (
        <div className="p-8 md:p-10 max-w-7xl mx-auto animate-fade-in-up">
            <div className="flex justify-between items-center mb-8">
                <h2 className="text-2xl font-black text-gray-900 tracking-tight">求人管理</h2>
                <button onClick={handleAddNewJob} className="px-6 py-2 bg-black text-white text-sm font-bold rounded-sm hover:bg-gray-800 flex items-center gap-2 shadow-lg"><Plus size={16}/> 新規求人作成</button>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {jobs.map(job => (
                    <div 
                        key={job.id} 
                        onClick={() => setViewingJob(job)}
                        className="bg-white border border-gray-200 rounded-sm overflow-hidden group cursor-pointer hover:shadow-lg transition-all duration-300"
                    >
                        <div className="h-40 bg-gray-200 relative">
                             <img src={job.coverImageUrl} className="w-full h-full object-cover" alt=""/>
                             <div className="absolute top-3 right-3">
                                 {job.status === 'published' ? (
                                     <span className="bg-green-500/90 text-white text-[10px] font-bold px-2 py-1 rounded-sm shadow-sm flex items-center gap-1"><CheckCircle size={10}/> 公開中</span>
                                 ) : (
                                     <span className="bg-gray-500/90 text-white text-[10px] font-bold px-2 py-1 rounded-sm shadow-sm flex items-center gap-1"><FileText size={10}/> 下書き</span>
                                 )}
                             </div>
                        </div>
                        <div className="p-5">
                            <h3 className="font-bold text-gray-900 line-clamp-2 mb-2 group-hover:text-blue-600 transition-colors h-12">{job.title}</h3>
                            <div className="flex justify-between items-center text-xs text-gray-500 mt-4 pt-4 border-t border-gray-50">
                                <span>{job.workStyle}</span>
                                <span>{job.salary}</span>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
  };

  const renderCandidates = () => {
      // If a candidate is selected for chat
      if (selectedCandidateId) {
          const candidate = candidates.find(c => c.id === selectedCandidateId);
          if (!candidate) return null;
          
          return (
              <div className="flex h-full flex-col bg-white animate-fade-in">
                  {/* Chat Header */}
                  <div className="flex items-center justify-between p-4 border-b border-gray-200">
                      <div className="flex items-center gap-4">
                           <button onClick={() => setSelectedCandidateId(null)} className="text-gray-500 hover:text-black"><ArrowLeft size={20}/></button>
                           <div>
                               <h3 className="font-bold text-gray-900">{candidate.name}</h3>
                               <p className="text-xs text-gray-500">{candidate.university} | {candidate.appliedJob}</p>
                           </div>
                           <span className={`px-2 py-1 text-xs font-bold rounded-sm ${candidate.status === '終了' ? (candidate.result === 'adopted' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700') : 'bg-blue-100 text-blue-700'}`}>
                               {candidate.status} {candidate.result === 'adopted' && '(採用)'} {candidate.result === 'rejected' && '(不採用)'}
                           </span>
                      </div>
                      <div className="flex gap-2">
                          {candidate.status !== '終了' && (
                              <>
                                <button onClick={() => handleReject(candidate.id)} className="px-4 py-2 text-xs font-bold text-red-600 border border-red-200 hover:bg-red-50 rounded-sm">お見送り</button>
                                <button onClick={() => handleHire(candidate.id)} className="px-4 py-2 text-xs font-bold bg-black text-white hover:bg-gray-800 rounded-sm">採用（内定）</button>
                              </>
                          )}
                      </div>
                  </div>

                  {/* Messages */}
                  <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50">
                      {chatMessages.map(msg => (
                          <div key={msg.id} className={`flex ${msg.sender === 'company' ? 'justify-end' : 'justify-start'}`}>
                              <div className={`max-w-[70%] p-4 rounded-2xl text-sm font-medium shadow-sm ${msg.sender === 'company' ? 'bg-black text-white rounded-tr-none' : 'bg-white text-gray-800 rounded-tl-none border border-gray-200'}`}>
                                  {msg.text}
                              </div>
                          </div>
                      ))}
                  </div>

                  {/* Input */}
                  <div className="p-4 border-t border-gray-200 bg-white">
                      <div className="flex gap-2">
                          <input 
                              type="text" 
                              value={chatInput} 
                              onChange={(e) => setChatInput(e.target.value)} 
                              placeholder="メッセージを入力..."
                              className="flex-1 border border-gray-300 rounded-full px-4 py-2 focus:outline-none focus:border-black"
                              onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                          />
                          <button onClick={handleSendMessage} className="bg-black text-white p-2 rounded-full hover:bg-gray-800"><Send size={18}/></button>
                      </div>
                  </div>
              </div>
          );
      }

      // List View
      return (
          <div className="p-8 md:p-10 max-w-7xl mx-auto animate-fade-in-up">
              <h2 className="text-2xl font-black text-gray-900 mb-8 tracking-tight">候補者管理</h2>
              <div className="bg-white rounded-sm shadow-sm border border-gray-200 overflow-hidden">
                  <table className="w-full text-left">
                      <thead className="bg-gray-50 border-b border-gray-200">
                          <tr>
                              <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase">氏名</th>
                              <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase">大学</th>
                              <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase">応募職種</th>
                              <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase">ステータス</th>
                              <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase">最終メッセージ</th>
                              <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase text-right">アクション</th>
                          </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-100">
                          {candidates.map(candidate => (
                              <tr key={candidate.id} onClick={() => setSelectedCandidateId(candidate.id)} className="hover:bg-gray-50 transition-colors cursor-pointer group">
                                  <td className="px-6 py-4 font-bold">{candidate.name}</td>
                                  <td className="px-6 py-4 text-sm">{candidate.university}</td>
                                  <td className="px-6 py-4 text-sm">{candidate.appliedJob}</td>
                                  <td className="px-6 py-4 text-sm">
                                      <span className={`px-2 py-1 text-xs font-bold rounded-sm ${candidate.status === '終了' ? (candidate.result === 'adopted' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700') : 'bg-blue-100 text-blue-700'}`}>
                                           {candidate.status} {candidate.result === 'adopted' && '(採用)'} {candidate.result === 'rejected' && '(不採用)'}
                                      </span>
                                  </td>
                                  <td className="px-6 py-4 text-sm text-gray-500 max-w-xs truncate">{candidate.lastMsg}</td>
                                  <td className="px-6 py-4 text-right">
                                      <button className="text-blue-600 hover:text-black font-bold text-xs flex items-center gap-1 ml-auto">
                                          <MessageSquare size={14}/> 詳細・チャット
                                      </button>
                                  </td>
                              </tr>
                          ))}
                      </tbody>
                  </table>
              </div>
          </div>
      );
  };

  return (
    <div className="flex h-screen bg-gray-100 font-sans text-gray-900 overflow-hidden">
      {/* Sidebar */}
      <aside className="w-64 bg-black text-white border-r border-gray-800 flex-shrink-0 flex flex-col z-20 shadow-sm">
        <div className="h-16 flex items-center px-6 border-b border-gray-800">
            <Building2 className="mr-2 text-white" size={20}/>
            <span className="font-black text-sm tracking-tight truncate" title={companyName}>{companyName}</span>
        </div>
        <nav className="flex-1 py-6 space-y-1 px-3">
            <button 
                onClick={() => setActiveTab('analytics')}
                className={`w-full flex items-center gap-3 px-3 py-2.5 text-sm font-bold rounded-sm transition-colors ${activeTab === 'analytics' ? 'bg-gray-800 text-white border-r-4 border-blue-500' : 'text-gray-400 hover:text-white hover:bg-gray-900'}`}
            >
                <BarChart2 size={18} /> ダッシュボード
            </button>
            <button 
                onClick={() => setActiveTab('info')}
                className={`w-full flex items-center gap-3 px-3 py-2.5 text-sm font-bold rounded-sm transition-colors ${activeTab === 'info' ? 'bg-gray-800 text-white border-r-4 border-blue-500' : 'text-gray-400 hover:text-white hover:bg-gray-900'}`}
            >
                <Building2 size={18} /> 会社情報
            </button>
            <button 
                onClick={() => setActiveTab('recruitment')}
                className={`w-full flex items-center gap-3 px-3 py-2.5 text-sm font-bold rounded-sm transition-colors ${activeTab === 'recruitment' ? 'bg-gray-800 text-white border-r-4 border-blue-500' : 'text-gray-400 hover:text-white hover:bg-gray-900'}`}
            >
                <Briefcase size={18} /> 求人管理
            </button>
            <button 
                onClick={() => setActiveTab('candidates')}
                className={`w-full flex items-center gap-3 px-3 py-2.5 text-sm font-bold rounded-sm transition-colors ${activeTab === 'candidates' ? 'bg-gray-800 text-white border-r-4 border-blue-500' : 'text-gray-400 hover:text-white hover:bg-gray-900'}`}
            >
                <Users size={18} /> 候補者管理
            </button>
        </nav>
        <div className="p-4 border-t border-gray-800 space-y-2">
            <button onClick={onNavigateHome} className="w-full flex items-center gap-2 text-gray-400 hover:text-white text-xs font-bold py-2 px-2 rounded-sm hover:bg-gray-900">
                <Home size={16}/> サイトトップへ
            </button>
            <button onClick={onLogout} className="w-full flex items-center gap-2 text-red-400 hover:text-red-300 text-xs font-bold py-2 px-2 rounded-sm hover:bg-gray-900">
                <LogOut size={16}/> ログアウト
            </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto bg-gray-50/50 relative">
          {activeTab === 'analytics' && renderAnalytics()}
          {activeTab === 'info' && renderInfo()}
          {activeTab === 'recruitment' && renderRecruitment()}
          {activeTab === 'candidates' && renderCandidates()}
      </main>

      {/* Contact Modal (Adoption Report) */}
      {showContactModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 animate-fade-in">
              <div className="bg-white w-full max-w-lg rounded-sm shadow-xl overflow-hidden">
                  <div className="bg-black text-white px-6 py-4 flex justify-between items-center">
                      <h3 className="font-bold">採用（内定）報告</h3>
                      <button onClick={() => setShowContactModal(false)}><X size={20}/></button>
                  </div>
                  <div className="p-6 space-y-4">
                      <p className="text-sm text-gray-600 mb-4">
                          内定おめでとうございます！<br/>
                          運営事務局へ採用報告を送信します。以下の内容をご確認ください。
                      </p>
                      <div>
                          <label className="block text-xs font-bold text-gray-500 uppercase mb-1">対象者</label>
                          <input type="text" value={contactForm.candidateName} disabled className="w-full p-2 bg-gray-100 border border-gray-200 rounded-sm text-sm text-gray-600"/>
                      </div>
                      <div>
                          <label className="block text-xs font-bold text-gray-500 uppercase mb-1">件名</label>
                          <input type="text" value={contactForm.subject} disabled className="w-full p-2 bg-gray-100 border border-gray-200 rounded-sm text-sm text-gray-600"/>
                      </div>
                      <div>
                          <label className="block text-xs font-bold text-gray-500 uppercase mb-1">備考 (事務局へのメッセージ)</label>
                          <textarea rows={3} value={contactForm.remarks} onChange={e => setContactForm({...contactForm, remarks: e.target.value})} className="w-full p-2 border border-gray-300 rounded-sm text-sm" placeholder="特記事項があればご記入ください"></textarea>
                      </div>
                  </div>
                  <div className="bg-gray-50 px-6 py-4 flex justify-end gap-3">
                      <button onClick={() => setShowContactModal(false)} className="px-4 py-2 text-sm font-bold text-gray-500 hover:text-black">キャンセル</button>
                      <button onClick={handleSendContact} className="px-6 py-2 bg-black text-white text-sm font-bold rounded-sm hover:bg-gray-800 flex items-center gap-2"><Send size={14}/> 報告を送信</button>
                  </div>
              </div>
          </div>
      )}

      {/* Student Profile Modal */}
      {showStudentModal && viewingStudent && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 animate-fade-in">
             <div className="bg-white w-full max-w-3xl max-h-[90vh] overflow-y-auto rounded-sm shadow-xl relative">
                  <button onClick={() => setShowStudentModal(false)} className="absolute top-4 right-4 text-gray-400 hover:text-black z-10 bg-white rounded-full p-1"><X size={24}/></button>
                  <div className="p-8">
                       <h2 className="text-2xl font-black mb-1">学生プロフィール</h2>
                       <p className="text-sm text-gray-500 font-bold mb-8">Candidate Profile</p>
                       
                       <div className="flex flex-col md:flex-row gap-8 mb-8 border-b border-gray-100 pb-8">
                           <div className="w-24 h-24 bg-gray-200 rounded-full flex-shrink-0"></div>
                           <div>
                               <h3 className="text-xl font-bold text-gray-900 mb-2">{viewingStudent.name}</h3>
                               <p className="text-sm text-gray-600 mb-1">{viewingStudent.university} {viewingStudent.faculty} {viewingStudent.department}</p>
                               <p className="text-sm text-gray-600">{viewingStudent.graduationYear}卒</p>
                           </div>
                       </div>

                       <div className="space-y-6">
                           <div>
                               <h4 className="font-bold text-sm bg-gray-50 p-2 mb-2">GitHub</h4>
                               <a href={viewingStudent.githubUrl} target="_blank" rel="noreferrer" className="text-blue-600 hover:underline">{viewingStudent.githubUrl}</a>
                           </div>
                           <div>
                               <h4 className="font-bold text-sm bg-gray-50 p-2 mb-2">スキル・アピール</h4>
                               <p className="text-sm leading-relaxed whitespace-pre-wrap">{viewingStudent.skills}</p>
                           </div>
                       </div>
                  </div>
             </div>
          </div>
      )}
    </div>
  );
};
