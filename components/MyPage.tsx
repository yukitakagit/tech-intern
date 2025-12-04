
import React, { useState } from 'react';
import { MessageSquare, Briefcase, User, Star, Search, Clock, ListChecks, Lock, Send, ChevronLeft, Mail, Edit2, MapPin, Github, Calendar, CheckCircle } from 'lucide-react';
import { JOB_LISTINGS } from '../constants';
import { JobListing, UserProfile } from '../types';

interface MyPageProps {
  userName: string;
  favorites: Set<string>;
  browsingHistory: string[];
  onNavigateJobDetail?: (id: string) => void;
  onNavigateHome: () => void;
  initialTab?: 'chat' | 'history' | 'status' | 'profile' | 'password';
}

// Mock User Profile Data
const initialProfile: UserProfile = {
  name: '田中 太郎',
  gender: 'male',
  phone: '090-1234-5678',
  university: '東京工科大学',
  faculty: '工学部',
  department: '情報工学科',
  graduationYear: '2026',
  email: 'tanaka@example.com',
  address: '東京都八王子市...',
  githubUrl: 'https://github.com/tanakataro',
  skills: 'React, TypeScript, Go',
};

// Mock Chat Data
const CHAT_CONTACTS = [
    { id: '1', name: '株式会社NextGen Creative', lastMessage: '面談の日程についてですが...', time: '10分前' },
    { id: '2', name: 'CyberScale Inc.', lastMessage: 'ご応募ありがとうございます。', time: '昨日' },
    { id: '3', name: 'DesignShift', lastMessage: 'ポートフォリオを拝見しました。', time: '2日前' },
];

const MOCK_MESSAGES = [
    { id: 1, sender: 'company', text: 'ご応募ありがとうございます。書類選考を通過されましたので、ぜひ一度カジュアル面談をお願いできればと思います。', time: '10:00' },
    { id: 2, sender: 'me', text: 'ありがとうございます！ぜひよろしくお願いいたします。来週の水曜日以降であればいつでも調整可能です。', time: '10:05' },
    { id: 3, sender: 'company', text: '承知いたしました。では来週水曜日の14時からはいかがでしょうか？', time: '10:10' },
];

// Mock Applications for Status Board (Status removed from display as requested)
const MOCK_APPLICATIONS = [
    {
        id: 'app1',
        job: JOB_LISTINGS[0],
        date: '2024-05-15'
    },
    {
        id: 'app2',
        job: JOB_LISTINGS[1],
        date: '2024-05-10'
    },
    {
        id: 'app3',
        job: JOB_LISTINGS[4],
        date: '2024-04-28'
    }
];

export const MyPage: React.FC<MyPageProps> = ({ userName, favorites, browsingHistory, onNavigateJobDetail, onNavigateHome, initialTab = 'chat' }) => {
  const [activeTab, setActiveTab] = useState<'chat' | 'history' | 'status' | 'profile' | 'password'>(initialTab);
  const [selectedChatId, setSelectedChatId] = useState<string | null>(null);
  const [profile, setProfile] = useState<UserProfile>(initialProfile);
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [chatInput, setChatInput] = useState('');

  const historyJobs = JOB_LISTINGS.filter(job => browsingHistory.includes(job.id));

  // Chat View Render Logic
  const renderChat = () => {
    if (selectedChatId) {
        const contact = CHAT_CONTACTS.find(c => c.id === selectedChatId);
        return (
            <div className="flex flex-col h-[600px] animate-fade-in">
                {/* Chat Header */}
                <div className="flex items-center gap-3 border-b border-gray-100 pb-4 mb-4">
                    <button onClick={() => setSelectedChatId(null)} className="text-gray-500 hover:text-black transition-colors flex items-center gap-1 font-bold text-sm">
                        <ChevronLeft size={20}/>
                        戻る
                    </button>
                    <div className="h-6 w-px bg-gray-200 mx-2"></div>
                    <h3 className="font-bold text-gray-900">{contact?.name}</h3>
                </div>
                
                {/* Messages Area */}
                <div className="flex-1 overflow-y-auto space-y-4 pr-2">
                    {MOCK_MESSAGES.map(msg => (
                        <div key={msg.id} className={`flex ${msg.sender === 'me' ? 'justify-end' : 'justify-start'}`}>
                            <div className={`max-w-[70%] p-3 rounded-lg text-sm font-medium ${
                                msg.sender === 'me' 
                                ? 'bg-blue-600 text-white rounded-br-none' 
                                : 'bg-gray-100 text-gray-800 rounded-bl-none'
                            }`}>
                                {msg.text}
                            </div>
                        </div>
                    ))}
                </div>

                {/* Input Area */}
                <div className="mt-4 pt-4 border-t border-gray-100 flex gap-2">
                    <input 
                        type="text" 
                        value={chatInput}
                        onChange={(e) => setChatInput(e.target.value)}
                        placeholder="メッセージを入力..."
                        className="flex-1 bg-gray-50 border border-gray-200 rounded-full px-4 py-2 text-sm focus:outline-none focus:border-blue-500"
                    />
                    <button className="bg-blue-600 text-white p-2 rounded-full hover:bg-blue-700">
                        <Send size={18} />
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="animate-fade-in">
            <h3 className="font-black text-xl mb-6 flex items-center gap-2">
                <MessageSquare size={24}/> メッセージ
            </h3>
            <div className="space-y-2">
                {CHAT_CONTACTS.map(contact => (
                    <div 
                        key={contact.id} 
                        onClick={() => setSelectedChatId(contact.id)}
                        className="flex items-center gap-4 p-4 hover:bg-gray-50 cursor-pointer border-b border-gray-100 transition-colors rounded-sm"
                    >
                        {/* Removed Logo/Icon */}
                        <div className="flex-1 min-w-0">
                            <div className="flex justify-between items-center mb-1">
                                <h4 className="font-bold text-sm text-gray-900 truncate">{contact.name}</h4>
                                <span className="text-[10px] text-gray-400 font-bold whitespace-nowrap">{contact.time}</span>
                            </div>
                            <p className="text-xs text-gray-500 truncate font-medium">{contact.lastMessage}</p>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
  };

  const renderPasswordReset = () => {
    return (
        <div className="animate-fade-in max-w-2xl">
            <h3 className="font-black text-xl mb-8 flex items-center gap-2"><Lock size={24}/> メールアドレス・パスワード再設定</h3>
            
            {/* Email Reset Section */}
            <div className="mb-12 border-b border-gray-100 pb-10">
                <h4 className="text-lg font-bold mb-6 flex items-center gap-2 text-gray-800">
                    メールアドレス変更
                </h4>
                <form className="space-y-6">
                    <div>
                        <label className="block text-xs font-bold text-gray-700 uppercase mb-2">現在のメールアドレス <span className="text-red-500">*</span></label>
                        <input type="email" required className="w-full p-4 border border-gray-300 rounded-sm text-base focus:border-black focus:ring-0 outline-none" placeholder="current@example.com" />
                    </div>
                    <div>
                        <label className="block text-xs font-bold text-gray-700 uppercase mb-2">新しいメールアドレス <span className="text-red-500">*</span></label>
                        <input type="email" required className="w-full p-4 border border-gray-300 rounded-sm text-base focus:border-black focus:ring-0 outline-none" placeholder="new@example.com" />
                    </div>
                    <button className="bg-black text-white text-sm font-bold px-8 py-4 rounded-sm hover:bg-gray-800 transition-colors">
                        メールアドレスを変更する
                    </button>
                </form>
            </div>

            {/* Password Reset Section */}
            <div>
                <h4 className="text-lg font-bold mb-6 flex items-center gap-2 text-gray-800">
                    パスワード変更
                </h4>
                <form className="space-y-6">
                    <div>
                        <label className="block text-xs font-bold text-gray-700 uppercase mb-2">新しいパスワード <span className="text-red-500">*</span></label>
                        <input type="password" required className="w-full p-4 border border-gray-300 rounded-sm text-base focus:border-black focus:ring-0 outline-none" placeholder="••••••••" />
                    </div>
                    <button className="bg-black text-white text-sm font-bold px-8 py-4 rounded-sm hover:bg-gray-800 transition-colors">
                        パスワードを変更する
                    </button>
                </form>
            </div>
        </div>
    );
  };

  const renderProfile = () => {
      // Edit Mode
      if (isEditingProfile) {
          return (
            <div className="animate-fade-in">
                <div className="flex justify-between items-center mb-8">
                    <h3 className="font-black text-xl flex items-center gap-2"><User size={24}/> プロフィール編集</h3>
                    <button onClick={() => setIsEditingProfile(false)} className="text-gray-500 hover:text-black text-sm font-bold">キャンセル</button>
                </div>
                <form className="space-y-8 max-w-3xl" onSubmit={(e) => { e.preventDefault(); setIsEditingProfile(false); }}>
                    <div className="grid grid-cols-1 gap-8">
                        <div>
                            <label className="block text-xs font-bold text-gray-700 uppercase mb-3">氏名 <span className="text-red-500">*</span></label>
                            <input required type="text" value={profile.name} onChange={e => setProfile({...profile, name: e.target.value})} className="w-full p-4 border border-gray-300 rounded-sm text-base" />
                        </div>
                        <div>
                            <label className="block text-xs font-bold text-gray-700 uppercase mb-3">性別 <span className="text-red-500">*</span></label>
                            <select required value={profile.gender} onChange={e => setProfile({...profile, gender: e.target.value as any})} className="w-full p-4 border border-gray-300 rounded-sm text-base">
                                <option value="male">男性</option>
                                <option value="female">女性</option>
                                <option value="other">その他</option>
                            </select>
                        </div>
                        <div>
                            <label className="block text-xs font-bold text-gray-700 uppercase mb-3">大学名 <span className="text-red-500">*</span></label>
                            <input required type="text" value={profile.university} onChange={e => setProfile({...profile, university: e.target.value})} className="w-full p-4 border border-gray-300 rounded-sm text-base" />
                        </div>
                        <div>
                            <label className="block text-xs font-bold text-gray-700 uppercase mb-3">学部 <span className="text-red-500">*</span></label>
                            <input required type="text" value={profile.faculty} onChange={e => setProfile({...profile, faculty: e.target.value})} className="w-full p-4 border border-gray-300 rounded-sm text-base" />
                        </div>
                        <div>
                            <label className="block text-xs font-bold text-gray-700 uppercase mb-3">学科 <span className="text-red-500">*</span></label>
                            <input required type="text" value={profile.department} onChange={e => setProfile({...profile, department: e.target.value})} className="w-full p-4 border border-gray-300 rounded-sm text-base" />
                        </div>
                        <div>
                            <label className="block text-xs font-bold text-gray-700 uppercase mb-3">卒業予定年度 <span className="text-red-500">*</span></label>
                            <input required type="text" value={profile.graduationYear} onChange={e => setProfile({...profile, graduationYear: e.target.value})} className="w-full p-4 border border-gray-300 rounded-sm text-base" />
                        </div>
                        <div>
                            <label className="block text-xs font-bold text-gray-700 uppercase mb-3">メールアドレス <span className="text-red-500">*</span></label>
                            <input required type="email" value={profile.email} onChange={e => setProfile({...profile, email: e.target.value})} className="w-full p-4 border border-gray-300 rounded-sm text-base" />
                        </div>
                        <div>
                            <label className="block text-xs font-bold text-gray-700 uppercase mb-3">電話番号</label>
                            <input type="tel" value={profile.phone} onChange={e => setProfile({...profile, phone: e.target.value})} className="w-full p-4 border border-gray-300 rounded-sm text-base" placeholder="任意" />
                        </div>
                        <div>
                            <label className="block text-xs font-bold text-gray-700 uppercase mb-3">住所</label>
                            <input type="text" value={profile.address} onChange={e => setProfile({...profile, address: e.target.value})} className="w-full p-4 border border-gray-300 rounded-sm text-base" placeholder="任意" />
                        </div>
                        <div>
                            <label className="block text-xs font-bold text-gray-700 uppercase mb-3">GitHub URL</label>
                            <input type="text" value={profile.githubUrl} onChange={e => setProfile({...profile, githubUrl: e.target.value})} className="w-full p-4 border border-gray-300 rounded-sm text-base" placeholder="任意" />
                        </div>
                        <div>
                            <label className="block text-xs font-bold text-gray-700 uppercase mb-3">スキル・アピールポイント</label>
                            <textarea rows={6} value={profile.skills} onChange={e => setProfile({...profile, skills: e.target.value})} className="w-full p-4 border border-gray-300 rounded-sm text-base" placeholder="任意" />
                        </div>
                    </div>

                    <button type="submit" className="bg-black text-white text-base font-bold px-10 py-4 rounded-sm hover:bg-gray-800 transition-colors">
                        プロフィールを更新する
                    </button>
                </form>
            </div>
          );
      }

      // View Mode (Profile - No Icons, Wide Boxes)
      return (
        <div className="animate-fade-in">
            <div className="flex justify-between items-center mb-8">
                <h3 className="font-black text-xl">プロフィール</h3>
                <button 
                    onClick={() => setIsEditingProfile(true)}
                    className="bg-black text-white px-6 py-3 rounded-sm text-sm font-bold hover:bg-gray-800 transition-colors"
                >
                    編集する
                </button>
            </div>
            
            <div className="space-y-6 max-w-4xl">
                <div className="p-6 bg-gray-50 rounded-sm border border-gray-100">
                    <div className="text-xs font-bold text-gray-400 uppercase mb-2">氏名</div>
                    <div className="text-lg font-bold text-gray-900">{profile.name}</div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="p-6 bg-gray-50 rounded-sm border border-gray-100">
                        <div className="text-xs font-bold text-gray-400 uppercase mb-2">大学名</div>
                        <div className="text-base font-bold text-gray-900">{profile.university}</div>
                    </div>
                    <div className="p-6 bg-gray-50 rounded-sm border border-gray-100">
                        <div className="text-xs font-bold text-gray-400 uppercase mb-2">学部・学科</div>
                        <div className="text-base font-bold text-gray-900">{profile.faculty} {profile.department}</div>
                    </div>
                </div>

                <div className="p-6 bg-gray-50 rounded-sm border border-gray-100">
                    <div className="text-xs font-bold text-gray-400 uppercase mb-2">卒業予定</div>
                    <div className="text-base font-bold text-gray-900">{profile.graduationYear}卒</div>
                </div>

                <div className="p-6 bg-gray-50 rounded-sm border border-gray-100">
                    <div className="text-xs font-bold text-gray-400 uppercase mb-2">Email</div>
                    <div className="text-base font-bold text-gray-900">{profile.email}</div>
                </div>

                <div className="p-6 bg-gray-50 rounded-sm border border-gray-100">
                    <div className="text-xs font-bold text-gray-400 uppercase mb-2">住所</div>
                    <div className="text-base font-bold text-gray-900">{profile.address}</div>
                </div>

                <div className="p-6 bg-gray-50 rounded-sm border border-gray-100">
                    <div className="text-xs font-bold text-gray-400 uppercase mb-2">GitHub</div>
                    <a href={profile.githubUrl} target="_blank" rel="noreferrer" className="text-base font-bold text-blue-600 hover:underline">{profile.githubUrl}</a>
                </div>

                <div className="p-6 bg-gray-50 rounded-sm border border-gray-100">
                    <div className="text-xs font-bold text-gray-400 uppercase mb-2">スキル</div>
                    <div className="text-base font-medium text-gray-900 leading-relaxed whitespace-pre-wrap">{profile.skills}</div>
                </div>
            </div>
        </div>
      );
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 min-h-screen">
      <div className="flex flex-col md:flex-row gap-8">
        
        {/* Sidebar Nav */}
        <div className="w-full md:w-64 flex-shrink-0">
          {/* User Info removed icon */}
          <div className="bg-white p-6 rounded-md shadow-sm border border-gray-200 mb-6">
             <div className="mb-2">
                <h2 className="font-bold text-lg text-gray-900">{profile.name}</h2>
                <p className="text-xs text-gray-500">{profile.university}</p>
             </div>
          </div>

          <nav className="space-y-1">
             <button 
                onClick={onNavigateHome}
                className="w-full flex items-center gap-3 px-4 py-3 text-sm font-bold rounded-sm transition-colors bg-white text-gray-600 hover:bg-gray-100 border border-transparent hover:border-gray-200 mb-6"
             >
                <Search size={16}/> インターンシップを探す
             </button>

             <button 
                onClick={() => { setActiveTab('chat'); setSelectedChatId(null); }}
                className={`w-full flex items-center gap-3 px-4 py-3 text-sm font-bold rounded-sm transition-colors ${activeTab === 'chat' ? 'bg-black text-white' : 'bg-white text-gray-600 hover:bg-gray-100'}`}
             >
                <MessageSquare size={16}/> チャット
             </button>
             <button 
                onClick={() => setActiveTab('status')}
                className={`w-full flex items-center gap-3 px-4 py-3 text-sm font-bold rounded-sm transition-colors ${activeTab === 'status' ? 'bg-black text-white' : 'bg-white text-gray-600 hover:bg-gray-100'}`}
             >
                <ListChecks size={16}/> 採用状況確認
             </button>
             <button 
                onClick={() => setActiveTab('history')}
                className={`w-full flex items-center gap-3 px-4 py-3 text-sm font-bold rounded-sm transition-colors ${activeTab === 'history' ? 'bg-black text-white' : 'bg-white text-gray-600 hover:bg-gray-100'}`}
             >
                <Clock size={16}/> 閲覧履歴
             </button>
             <button 
                onClick={() => setActiveTab('profile')}
                className={`w-full flex items-center gap-3 px-4 py-3 text-sm font-bold rounded-sm transition-colors ${activeTab === 'profile' ? 'bg-black text-white' : 'bg-white text-gray-600 hover:bg-gray-100'}`}
             >
                <User size={16}/> プロフィール
             </button>

             <div className="pt-6 mt-6 border-t border-gray-200">
                <button 
                    onClick={() => setActiveTab('password')}
                    className={`w-full flex items-center gap-3 px-4 py-3 text-sm font-bold rounded-sm transition-colors ${activeTab === 'password' ? 'bg-black text-white' : 'text-gray-400 hover:text-black hover:bg-gray-50'}`}
                >
                    <Lock size={16}/> パスワード再設定
                </button>
             </div>
          </nav>
        </div>

        {/* Content Area */}
        <div className="flex-1 bg-white p-8 rounded-md shadow-sm border border-gray-200 min-h-[600px]">
            
            {activeTab === 'chat' && renderChat()}
            {activeTab === 'password' && renderPasswordReset()}
            {activeTab === 'profile' && renderProfile()}

            {activeTab === 'status' && (
                <div className="animate-fade-in">
                    <h3 className="font-black text-xl mb-6 flex items-center gap-2"><ListChecks size={24}/> 採用状況確認</h3>
                    <div className="space-y-4">
                        {MOCK_APPLICATIONS.map(app => (
                            <div 
                                key={app.id} 
                                onClick={() => onNavigateJobDetail && onNavigateJobDetail(app.job.id)}
                                className="border border-gray-200 p-6 rounded-md flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 hover:shadow-md transition-shadow bg-white cursor-pointer group"
                            >
                                <div className="flex items-center gap-4">
                                    {/* Removed Logo */}
                                    <div>
                                        <h4 className="font-bold text-gray-900 text-lg group-hover:text-blue-600 transition-colors">{app.job.title}</h4>
                                        <p className="text-sm text-gray-500 font-bold flex items-center gap-2 mt-1">
                                            <Briefcase size={14}/> {app.job.company.name}
                                        </p>
                                    </div>
                                </div>
                                <div className="flex flex-col items-end gap-2 w-full sm:w-auto">
                                    <div className="text-xs text-gray-400 flex items-center gap-1">
                                        <Calendar size={12}/> {app.date} 応募
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {activeTab === 'history' && (
                <div className="animate-fade-in">
                     <h3 className="font-black text-xl mb-6 flex items-center gap-2"><Clock size={24}/> 閲覧履歴</h3>
                     <div className="grid grid-cols-1 gap-4">
                        {historyJobs.length > 0 ? (
                            historyJobs.map(job => (
                                <div key={job.id} onClick={() => onNavigateJobDetail && onNavigateJobDetail(job.id)} className="border border-gray-200 p-4 rounded-md flex gap-4 cursor-pointer hover:shadow-md transition-shadow">
                                    {/* Removed Image to match request for no icons/photos generally, though history is useful with image. Kept image here as it's history, but can remove if strict.*/}
                                    <img src={job.coverImageUrl} className="w-32 h-20 object-cover rounded-sm" alt=""/>
                                    <div>
                                        <h4 className="font-bold text-sm mb-1 line-clamp-2">{job.title}</h4>
                                        <p className="text-xs text-gray-500">{job.company.name}</p>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <p className="text-gray-500 text-sm p-4">閲覧履歴はありません。</p>
                        )}
                    </div>
                </div>
            )}
        </div>
      </div>
    </div>
  );
};
