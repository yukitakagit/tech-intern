import React, { useState } from 'react';
import { Company, JobListing } from '../../types';
import { JOB_LISTINGS } from '../../constants';
import { 
    Save, LogOut, Building2, Globe, MapPin, Users, FileText, 
    Briefcase, LayoutDashboard, MessageSquare, Plus, Edit2, Search, Send, Trash2, ChevronDown
} from 'lucide-react';

interface CompanyDashboardProps {
  companyName: string;
  onLogout: () => void;
}

type DashboardTab = 'info' | 'recruitment' | 'candidates';

export const CompanyDashboard: React.FC<CompanyDashboardProps> = ({ companyName, onLogout }) => {
  const [activeTab, setActiveTab] = useState<DashboardTab>('info');
  
  // State for Company Info
  const [profile, setProfile] = useState<Partial<Company>>({
    name: companyName,
    industry: 'システム開発',
    location: '東京都渋谷区...',
    url: 'https://kaxin.jp',
    description: '私たちは...', // 企業紹介
    businessContent: '受託開発事業...', // 事業内容
    representative: '',
    employees: '10-50名',
    established: '2024年'
  });

  // State for Recruitment
  const [jobs, setJobs] = useState<JobListing[]>(JOB_LISTINGS.slice(0, 3)); // Mock existing jobs
  const [editingJob, setEditingJob] = useState<Partial<JobListing> | null>(null);

  // State for Candidates Chat
  const [candidates, setCandidates] = useState([
      { id: 'u1', name: '田中 太郎', university: '東京工科大学', status: '書類選考通過', lastMsg: 'ありがとうございます。日程調整の件...' },
      { id: 'u2', name: '鈴木 一郎', university: '早稲田大学', status: 'カジュアル面談', lastMsg: 'ポートフォリオをお送りします。' },
      { id: 'u3', name: '佐藤 花子', university: '慶應義塾大学', status: '新規応募', lastMsg: 'はじめまして。貴社のビジョンに共感し...' },
  ]);
  const [selectedCandidateId, setSelectedCandidateId] = useState<string | null>(null);
  const [chatInput, setChatInput] = useState('');

  // --- Handlers ---

  const handleProfileChange = (field: keyof Company, value: string) => {
      setProfile(prev => ({ ...prev, [field]: value }));
  };

  const handleProfileSave = () => {
      alert('企業情報を保存しました。\n※実際のアプリではこの内容がJob Detailの企業情報カードと企業紹介・事業内容に反映されます。');
  };

  const handleAddNewJob = () => {
      setEditingJob({
          title: '',
          salary: '時給 1,200円〜',
          workStyle: 'Hybrid',
          coverImageUrl: 'https://picsum.photos/id/1/800/450',
          tags: [],
          description: profile.description || '', // Default to company description
          businessContent: profile.businessContent || '', // Default to company business content
          jobDetail: '',
          skillsGained: [],
          selectionFlow: [
              { step: 1, title: '書類選考', description: 'プロフィールをもとに選考します' },
              { step: 2, title: 'カジュアル面談', description: 'オンラインで実施' },
              { step: 3, title: '内定', description: '' }
          ]
      });
  };

  const handleJobSave = () => {
      // Mock save
      alert('求人情報を保存しました。');
      setEditingJob(null);
  };

  const handleStatusChange = (id: string, newStatus: string) => {
      setCandidates(prev => prev.map(c => c.id === id ? { ...c, status: newStatus } : c));
  };

  const handleFlowChange = (index: number, field: 'title' | 'description', value: string) => {
      if (!editingJob || !editingJob.selectionFlow) return;
      const newFlow = [...editingJob.selectionFlow];
      newFlow[index] = { ...newFlow[index], [field]: value };
      setEditingJob({ ...editingJob, selectionFlow: newFlow });
  };

  const addFlowStep = () => {
       if (!editingJob) return;
       const currentFlow = editingJob.selectionFlow || [];
       setEditingJob({ 
           ...editingJob, 
           selectionFlow: [...currentFlow, { step: currentFlow.length + 1, title: '', description: '' }] 
       });
  };

  const removeFlowStep = (index: number) => {
      if (!editingJob || !editingJob.selectionFlow) return;
      const newFlow = editingJob.selectionFlow.filter((_, i) => i !== index).map((step, i) => ({ ...step, step: i + 1 }));
      setEditingJob({ ...editingJob, selectionFlow: newFlow });
  };

  // --- Render Functions ---

  const renderInfo = () => (
     <div className="bg-white rounded-sm shadow-sm border border-gray-200 overflow-hidden animate-fade-in">
        <div className="p-6 border-b border-gray-100 flex justify-between items-center">
            <h2 className="text-xl font-black">会社情報編集</h2>
            <button 
                onClick={handleProfileSave}
                className="bg-black text-white text-sm font-bold px-5 py-2 rounded-sm flex items-center gap-2 hover:bg-gray-800 transition-colors"
            >
                <Save size={16}/> 保存する
            </button>
        </div>
        
        <div className="p-8 space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                        <label className="block text-xs font-bold text-gray-500 uppercase mb-2">会社名</label>
                        <input 
                        type="text" 
                        value={profile.name}
                        onChange={(e) => handleProfileChange('name', e.target.value)}
                        className="w-full p-3 bg-gray-50 border border-gray-200 rounded-sm text-sm focus:border-black outline-none"
                        />
                </div>
                <div>
                        <label className="block text-xs font-bold text-gray-500 uppercase mb-2">業界</label>
                        <input 
                        type="text" 
                        value={profile.industry}
                        onChange={(e) => handleProfileChange('industry', e.target.value)}
                        className="w-full p-3 bg-gray-50 border border-gray-200 rounded-sm text-sm focus:border-black outline-none"
                        />
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                        <label className="block text-xs font-bold text-gray-500 uppercase mb-2 flex items-center gap-2">
                        <Users size={14}/> 従業員数
                        </label>
                        <input 
                        type="text" 
                        value={profile.employees}
                        onChange={(e) => handleProfileChange('employees', e.target.value)}
                        className="w-full p-3 bg-gray-50 border border-gray-200 rounded-sm text-sm focus:border-black outline-none"
                        />
                </div>
                <div>
                        <label className="block text-xs font-bold text-gray-500 uppercase mb-2">設立年月</label>
                        <input 
                        type="text" 
                        value={profile.established}
                        onChange={(e) => handleProfileChange('established', e.target.value)}
                        className="w-full p-3 bg-gray-50 border border-gray-200 rounded-sm text-sm focus:border-black outline-none"
                        />
                </div>
            </div>

            <div>
                <label className="block text-xs font-bold text-gray-500 uppercase mb-2 flex items-center gap-2">
                    <Globe size={14}/> 公式サイト URL
                </label>
                <input 
                    type="text" 
                    value={profile.url}
                    onChange={(e) => handleProfileChange('url', e.target.value)}
                    className="w-full p-3 bg-gray-50 border border-gray-200 rounded-sm text-sm focus:border-black outline-none"
                    placeholder="https://..."
                />
            </div>

            <div>
                <label className="block text-xs font-bold text-gray-500 uppercase mb-2 flex items-center gap-2">
                    <MapPin size={14}/> 所在地
                </label>
                <input 
                    type="text" 
                    value={profile.location}
                    onChange={(e) => handleProfileChange('location', e.target.value)}
                    className="w-full p-3 bg-gray-50 border border-gray-200 rounded-sm text-sm focus:border-black outline-none"
                />
            </div>

            <div>
                <label className="block text-xs font-bold text-gray-500 uppercase mb-2 flex items-center gap-2">
                    <FileText size={14}/> 企業紹介 (Job Detail: 企業紹介)
                </label>
                <textarea 
                    rows={4}
                    value={profile.description}
                    onChange={(e) => handleProfileChange('description', e.target.value)}
                    className="w-full p-3 bg-gray-50 border border-gray-200 rounded-sm text-sm focus:border-black outline-none leading-relaxed"
                    placeholder="企業のミッションや紹介文..."
                />
            </div>

            <div>
                <label className="block text-xs font-bold text-gray-500 uppercase mb-2 flex items-center gap-2">
                    <Building2 size={14}/> 事業内容 (Job Detail: 事業内容)
                </label>
                <textarea 
                    rows={4}
                    value={profile.businessContent}
                    onChange={(e) => handleProfileChange('businessContent', e.target.value)}
                    className="w-full p-3 bg-gray-50 border border-gray-200 rounded-sm text-sm focus:border-black outline-none leading-relaxed"
                    placeholder="具体的な事業内容..."
                />
            </div>
        </div>
   </div>
  );

  const renderRecruitment = () => {
      if (editingJob) {
          // Edit/Add Mode
          return (
            <div className="bg-white rounded-sm shadow-sm border border-gray-200 overflow-hidden animate-fade-in">
                <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-gray-50">
                    <h2 className="text-xl font-black">求人編集</h2>
                    <div className="flex gap-2">
                        <button 
                            onClick={() => setEditingJob(null)}
                            className="bg-white border border-gray-300 text-gray-700 text-sm font-bold px-4 py-2 rounded-sm hover:bg-gray-50 transition-colors"
                        >
                            キャンセル
                        </button>
                        <button 
                            onClick={handleJobSave}
                            className="bg-black text-white text-sm font-bold px-5 py-2 rounded-sm flex items-center gap-2 hover:bg-gray-800 transition-colors"
                        >
                            <Save size={16}/> 公開/保存
                        </button>
                    </div>
                </div>
                <div className="p-8 space-y-8">
                     {/* Basic Info */}
                     <div className="space-y-6 border-b border-gray-100 pb-8">
                        <h3 className="font-bold text-lg">基本情報</h3>
                        <div>
                            <label className="block text-xs font-bold text-gray-500 uppercase mb-2">求人タイトル</label>
                            <input 
                                type="text" 
                                value={editingJob.title}
                                onChange={(e) => setEditingJob({...editingJob, title: e.target.value})}
                                className="w-full p-3 bg-gray-50 border border-gray-200 rounded-sm text-sm focus:border-black outline-none"
                                placeholder="例）Go言語を用いたバックエンド開発インターン"
                            />
                        </div>
                        <div className="grid grid-cols-2 gap-6">
                            <div>
                                <label className="block text-xs font-bold text-gray-500 uppercase mb-2">給与</label>
                                <input 
                                    type="text" 
                                    value={editingJob.salary}
                                    onChange={(e) => setEditingJob({...editingJob, salary: e.target.value})}
                                    className="w-full p-3 bg-gray-50 border border-gray-200 rounded-sm text-sm focus:border-black outline-none"
                                />
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-gray-500 uppercase mb-2">勤務形態</label>
                                <select 
                                    value={editingJob.workStyle}
                                    onChange={(e) => setEditingJob({...editingJob, workStyle: e.target.value as any})}
                                    className="w-full p-3 bg-gray-50 border border-gray-200 rounded-sm text-sm focus:border-black outline-none"
                                >
                                    <option value="Remote">Remote</option>
                                    <option value="Hybrid">Hybrid</option>
                                    <option value="On-site">On-site</option>
                                </select>
                            </div>
                        </div>
                        <div>
                            <label className="block text-xs font-bold text-gray-500 uppercase mb-2">カバー画像 URL</label>
                            <input 
                                type="text" 
                                value={editingJob.coverImageUrl}
                                onChange={(e) => setEditingJob({...editingJob, coverImageUrl: e.target.value})}
                                className="w-full p-3 bg-gray-50 border border-gray-200 rounded-sm text-sm focus:border-black outline-none"
                            />
                        </div>
                        <div>
                            <label className="block text-xs font-bold text-gray-500 uppercase mb-2">タグ (カンマ区切り)</label>
                            <input 
                                type="text" 
                                value={editingJob.tags?.join(', ')}
                                onChange={(e) => setEditingJob({...editingJob, tags: e.target.value.split(',').map(s => s.trim())})}
                                className="w-full p-3 bg-gray-50 border border-gray-200 rounded-sm text-sm focus:border-black outline-none"
                                placeholder="例）Go, AWS, バックエンド"
                            />
                        </div>
                     </div>
                    
                    {/* Job Details */}
                    <div className="space-y-6 border-b border-gray-100 pb-8">
                         <h3 className="font-bold text-lg">募集詳細</h3>
                         <div className="p-4 bg-blue-50 text-blue-800 text-xs font-bold rounded-sm mb-4">
                             ※ 「企業紹介」と「事業内容」は、会社情報タブで設定した内容が自動的に使用されます。個別に変更したい場合はここで上書き可能です。
                         </div>
                         <div>
                             <label className="block text-xs font-bold text-gray-500 uppercase mb-2">こんなことやります (Job Detail)</label>
                             <textarea 
                                rows={6}
                                value={editingJob.jobDetail}
                                onChange={(e) => setEditingJob({...editingJob, jobDetail: e.target.value})}
                                className="w-full p-3 bg-gray-50 border border-gray-200 rounded-sm text-sm focus:border-black outline-none"
                                placeholder="具体的な業務内容を記述"
                            />
                        </div>
                         <div>
                            <label className="block text-xs font-bold text-gray-500 uppercase mb-2">身につくスキル (カンマ区切り)</label>
                            <input 
                                type="text" 
                                value={editingJob.skillsGained?.join(', ')}
                                onChange={(e) => setEditingJob({...editingJob, skillsGained: e.target.value.split(',').map(s => s.trim())})}
                                className="w-full p-3 bg-gray-50 border border-gray-200 rounded-sm text-sm focus:border-black outline-none"
                                placeholder="例）チーム開発経験, AWS構築スキル"
                            />
                        </div>
                    </div>

                    {/* Selection Flow */}
                    <div className="space-y-6">
                        <div className="flex justify-between items-center">
                            <h3 className="font-bold text-lg">選考フロー</h3>
                            <button 
                                onClick={addFlowStep}
                                className="text-sm font-bold text-blue-600 hover:text-blue-800 flex items-center gap-1"
                            >
                                <Plus size={16}/> ステップ追加
                            </button>
                        </div>
                        <div className="space-y-4">
                            {editingJob.selectionFlow?.map((step, index) => (
                                <div key={index} className="flex gap-4 items-start bg-gray-50 p-4 rounded-sm border border-gray-100">
                                    <div className="w-8 h-8 bg-black text-white rounded-full flex items-center justify-center font-bold text-sm flex-shrink-0">
                                        {index + 1}
                                    </div>
                                    <div className="flex-1 space-y-3">
                                        <input 
                                            type="text" 
                                            value={step.title}
                                            onChange={(e) => handleFlowChange(index, 'title', e.target.value)}
                                            className="w-full p-2 border border-gray-300 rounded-sm text-sm focus:border-black outline-none"
                                            placeholder="ステップ名（例：書類選考）"
                                        />
                                        <textarea 
                                            rows={2}
                                            value={step.description}
                                            onChange={(e) => handleFlowChange(index, 'description', e.target.value)}
                                            className="w-full p-2 border border-gray-300 rounded-sm text-sm focus:border-black outline-none"
                                            placeholder="詳細説明"
                                        />
                                    </div>
                                    <button 
                                        onClick={() => removeFlowStep(index)}
                                        className="text-gray-400 hover:text-red-600 p-2"
                                    >
                                        <Trash2 size={18}/>
                                    </button>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
          );
      }

      // List Mode
      return (
        <div className="animate-fade-in">
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-black">採用情報管理</h2>
                <button 
                    onClick={handleAddNewJob}
                    className="bg-black text-white text-sm font-bold px-5 py-2 rounded-sm flex items-center gap-2 hover:bg-gray-800 transition-colors"
                >
                    <Plus size={16}/> 新規求人作成
                </button>
            </div>
            
            <div className="space-y-4">
                {jobs.map(job => (
                    <div key={job.id} className="bg-white border border-gray-200 p-6 rounded-sm flex justify-between items-center shadow-sm hover:shadow-md transition-shadow">
                        <div className="flex gap-4 items-center">
                            <img src={job.coverImageUrl} className="w-16 h-12 object-cover rounded-sm bg-gray-200" alt=""/>
                            <div>
                                <h3 className="font-bold text-gray-900">{job.title}</h3>
                                <div className="flex gap-2 text-xs text-gray-500 mt-1">
                                    <span className="bg-gray-100 px-2 py-0.5 rounded-sm">公開中</span>
                                    <span>•</span>
                                    <span>応募数: 12件</span>
                                </div>
                            </div>
                        </div>
                        <button 
                            onClick={() => setEditingJob(job)}
                            className="text-gray-400 hover:text-black transition-colors p-2"
                        >
                            <Edit2 size={18}/>
                        </button>
                    </div>
                ))}
            </div>
        </div>
      );
  };

  const renderCandidates = () => {
    return (
        <div className="bg-white rounded-sm shadow-sm border border-gray-200 flex h-[600px] overflow-hidden animate-fade-in">
            {/* Candidate List (Left) */}
            <div className="w-1/3 border-r border-gray-100 flex flex-col">
                <div className="p-4 border-b border-gray-100">
                     <div className="relative">
                        <input type="text" placeholder="候補者を検索" className="w-full bg-gray-50 pl-8 pr-4 py-2 text-xs rounded-sm focus:outline-none"/>
                        <Search size={14} className="absolute left-2.5 top-2.5 text-gray-400"/>
                     </div>
                </div>
                <div className="flex-1 overflow-y-auto">
                    {candidates.map(candidate => (
                        <div 
                            key={candidate.id} 
                            onClick={() => setSelectedCandidateId(candidate.id)}
                            className={`p-4 border-b border-gray-50 cursor-pointer hover:bg-gray-50 transition-colors ${selectedCandidateId === candidate.id ? 'bg-blue-50 border-l-4 border-l-blue-600' : ''}`}
                        >
                            <div className="flex justify-between items-start mb-1">
                                <h4 className="font-bold text-sm text-gray-900">{candidate.name}</h4>
                                <span className={`text-[10px] px-1.5 py-0.5 rounded font-bold ${candidate.status === '内定' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-600'}`}>
                                    {candidate.status}
                                </span>
                            </div>
                            <p className="text-xs text-gray-500 mb-1">{candidate.university}</p>
                            <p className="text-xs text-gray-400 truncate">{candidate.lastMsg}</p>
                        </div>
                    ))}
                </div>
            </div>

            {/* Chat Area (Right) */}
            <div className="flex-1 flex flex-col bg-gray-50">
                {selectedCandidateId ? (
                    <>
                        <div className="p-4 bg-white border-b border-gray-200 flex justify-between items-center shadow-sm z-10">
                            <div>
                                <h3 className="font-bold text-gray-900">
                                    {candidates.find(c => c.id === selectedCandidateId)?.name}
                                </h3>
                                <p className="text-xs text-gray-500">
                                    {candidates.find(c => c.id === selectedCandidateId)?.university}
                                </p>
                            </div>
                            
                            {/* Status Changer */}
                            <div className="relative group">
                                <div className="flex items-center gap-2 cursor-pointer bg-gray-100 px-3 py-1.5 rounded-sm hover:bg-gray-200 transition-colors">
                                    <span className="text-xs font-bold text-gray-600">ステータス:</span>
                                    <span className="text-xs font-bold text-blue-600">
                                        {candidates.find(c => c.id === selectedCandidateId)?.status}
                                    </span>
                                    <ChevronDown size={14} className="text-gray-500"/>
                                </div>
                                <div className="absolute right-0 mt-1 w-40 bg-white border border-gray-200 shadow-lg rounded-sm py-1 hidden group-hover:block z-20">
                                    {['書類選考通過', 'カジュアル面談', '一次面接', '最終面接', '内定', 'お見送り'].map(status => (
                                        <button 
                                            key={status}
                                            onClick={() => handleStatusChange(selectedCandidateId, status)}
                                            className="w-full text-left px-4 py-2 text-xs font-bold text-gray-700 hover:bg-gray-50 hover:text-black"
                                        >
                                            {status}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        </div>
                        <div className="flex-1 p-6 overflow-y-auto space-y-4">
                             {/* Mock Conversation */}
                             <div className="flex justify-start">
                                 <div className="bg-white border border-gray-200 text-gray-800 p-3 rounded-lg rounded-bl-none max-w-[70%] text-sm shadow-sm">
                                     はじめまして。貴社のビジョンに共感し、応募させていただきました。
                                 </div>
                             </div>
                             <div className="flex justify-end">
                                 <div className="bg-blue-600 text-white p-3 rounded-lg rounded-br-none max-w-[70%] text-sm shadow-md">
                                     ご応募ありがとうございます！プロフィールを拝見し、ぜひお話ししたいと思いました。
                                 </div>
                             </div>
                        </div>
                        <div className="p-4 bg-white border-t border-gray-200 flex gap-2">
                             <input 
                                type="text" 
                                value={chatInput}
                                onChange={(e) => setChatInput(e.target.value)}
                                className="flex-1 bg-gray-100 border-none px-4 py-2 rounded-full text-sm focus:ring-2 focus:ring-blue-100 outline-none"
                                placeholder="メッセージを入力..."
                             />
                             <button className="bg-black text-white p-2 rounded-full hover:bg-gray-800 transition-colors">
                                 <Send size={16}/>
                             </button>
                        </div>
                    </>
                ) : (
                    <div className="flex-1 flex items-center justify-center text-gray-400 font-bold flex-col gap-2">
                        <MessageSquare size={40} className="opacity-20"/>
                        <p>候補者を選択してチャットを開始</p>
                    </div>
                )}
            </div>
        </div>
    );
  };

  return (
    <div className="flex h-screen bg-[#F3F4F6] font-sans text-gray-900 overflow-hidden" style={{ backgroundImage: 'radial-gradient(#D1D5DB 1px, transparent 1px)', backgroundSize: '24px 24px' }}>
      
      {/* Sidebar */}
      <aside className="w-64 bg-gray-900 text-white flex-shrink-0 flex flex-col">
           <div className="h-16 flex items-center px-6 border-b border-gray-800">
                <Building2 className="text-blue-500 mr-2" size={20}/>
                <span className="font-bold tracking-tight">Enterprise</span>
           </div>

           <nav className="flex-1 py-6 space-y-1">
                <button 
                    onClick={() => setActiveTab('info')}
                    className={`w-full flex items-center gap-3 px-6 py-3 text-sm font-bold transition-colors border-l-4 ${activeTab === 'info' ? 'bg-gray-800 border-blue-500 text-white' : 'border-transparent text-gray-400 hover:bg-gray-800 hover:text-white'}`}
                >
                    <LayoutDashboard size={18}/> 会社情報
                </button>
                <button 
                    onClick={() => setActiveTab('recruitment')}
                    className={`w-full flex items-center gap-3 px-6 py-3 text-sm font-bold transition-colors border-l-4 ${activeTab === 'recruitment' ? 'bg-gray-800 border-blue-500 text-white' : 'border-transparent text-gray-400 hover:bg-gray-800 hover:text-white'}`}
                >
                    <Briefcase size={18}/> 採用情報
                </button>
                <button 
                    onClick={() => setActiveTab('candidates')}
                    className={`w-full flex items-center gap-3 px-6 py-3 text-sm font-bold transition-colors border-l-4 ${activeTab === 'candidates' ? 'bg-gray-800 border-blue-500 text-white' : 'border-transparent text-gray-400 hover:bg-gray-800 hover:text-white'}`}
                >
                    <Users size={18}/> 候補者管理
                </button>
           </nav>

           <div className="p-4 border-t border-gray-800">
               <button onClick={onLogout} className="w-full flex items-center gap-2 text-gray-500 hover:text-white text-xs font-bold transition-colors">
                   <LogOut size={14}/> ログアウト
               </button>
           </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col h-screen overflow-hidden">
          {/* Header */}
          <header className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-8 shadow-sm z-10">
               <h1 className="font-bold text-gray-900">
                   {activeTab === 'info' && 'ダッシュボード / 会社情報'}
                   {activeTab === 'recruitment' && 'ダッシュボード / 採用情報'}
                   {activeTab === 'candidates' && 'ダッシュボード / 候補者管理'}
               </h1>
               <div className="flex items-center gap-4">
                   <span className="text-sm font-bold text-gray-600">{companyName} 様</span>
                   <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center text-white font-bold text-xs">
                       {companyName.charAt(0)}
                   </div>
               </div>
          </header>

          {/* Scrollable Content Area */}
          <main className="flex-1 overflow-y-auto p-8">
               <div className="max-w-5xl mx-auto">
                   {activeTab === 'info' && renderInfo()}
                   {activeTab === 'recruitment' && renderRecruitment()}
                   {activeTab === 'candidates' && renderCandidates()}
               </div>
          </main>
      </div>
    </div>
  );
};