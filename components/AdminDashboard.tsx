
import React, { useState, useRef, useEffect } from 'react';
import { Users, Building2, LogOut, Search, LogIn, FileText, HelpCircle, Settings, Plus, Edit2, Trash2, Lock, Mail, ArrowLeft, Send, Save, Eye, X, Upload, Bold, Italic, List, Image as ImageIcon, Briefcase, Zap, CheckSquare, Square } from 'lucide-react';
import { JOB_LISTINGS } from '../constants';
import { Article, FAQ, JobListing } from '../types';

interface AdminDashboardProps {
  onLogout: () => void;
  onLoginAsCompany: (companyName: string) => void;
  onLoginAsStudent: (studentName: string) => void;
  
  // Dynamic Data Props
  articles: Article[];
  setArticles: React.Dispatch<React.SetStateAction<Article[]>>;
  faqs: FAQ[];
  setFaqs: React.Dispatch<React.SetStateAction<FAQ[]>>;
  jobs: JobListing[]; // Added
  setJobs: React.Dispatch<React.SetStateAction<JobListing[]>>; // Added
}

// --- Rich Text Editor (Fixed Image Insertion) ---
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
            saveSelection();
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
                    <button onMouseDown={(e) => e.preventDefault()} onClick={() => execCmd('bold')} className="p-2 hover:bg-gray-200 rounded text-gray-700" title="太字"><Bold size={16}/></button>
                    <button onMouseDown={(e) => e.preventDefault()} onClick={() => execCmd('italic')} className="p-2 hover:bg-gray-200 rounded text-gray-700" title="斜体"><Italic size={16}/></button>
                    <button onMouseDown={(e) => e.preventDefault()} onClick={() => execCmd('formatBlock', 'H3')} className="p-2 hover:bg-gray-200 rounded text-gray-700 font-bold text-xs" title="見出し">H3</button>
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
                    className="p-4 min-h-[400px] outline-none prose prose-sm max-w-none font-medium text-gray-800 focus:bg-gray-50/30 transition-colors"
                    contentEditable
                    suppressContentEditableWarning
                    onInput={handleInput}
                    onFocus={() => isFocused.current = true}
                    onBlur={() => { 
                        isFocused.current = false; 
                        saveSelection(); 
                        handleInput();
                    }}
                    onKeyUp={saveSelection}
                    onMouseUp={saveSelection}
                />
            </div>
            <p className="text-[10px] text-gray-400 mt-1 text-right">※ 画像を選択してBackspaceキーで削除できます</p>
        </div>
    );
};

export const AdminDashboard: React.FC<AdminDashboardProps> = ({ 
    onLogout, 
    onLoginAsCompany, 
    onLoginAsStudent,
    articles,
    setArticles,
    faqs,
    setFaqs,
    jobs,
    setJobs
}) => {
  const [activeTab, setActiveTab] = useState<'companies' | 'students' | 'articles' | 'faqs' | 'settings' | 'jobs'>('companies');
  
  // Settings State
  const [adminEmail, setAdminEmail] = useState('contact.kaxin@gmail.com');
  
  // Article Management State
  const [viewingArticle, setViewingArticle] = useState<Article | null>(null);
  const [isEditingArticle, setIsEditingArticle] = useState(false);
  const [editingArticleData, setEditingArticleData] = useState<Partial<Article> | null>(null);

  // FAQ Management State
  const [isEditingFaq, setIsEditingFaq] = useState(false);
  const [editingFaqData, setEditingFaqData] = useState<Partial<FAQ> | null>(null);

  // Mock Data for Lists
  const companies = Array.from(new Set(jobs.map(j => j.company.id)))
    .map(id => jobs.find(j => j.company.id === id)?.company)
    .filter((c): c is NonNullable<typeof c> => !!c);

  const students = [
      { id: '1', name: '田中 太郎', email: 'tanaka@example.com', university: '東京工科大学' },
      { id: '2', name: '鈴木 一郎', email: 'suzuki@example.com', university: '早稲田大学' },
      { id: '3', name: '佐藤 花子', email: 'sato@example.com', university: '慶應義塾大学' }
  ];

  // --- Article Handlers ---
  const handleCreateArticle = () => {
      const newArticle: Partial<Article> = {
          title: '',
          category: 'NEWS',
          date: new Date().toLocaleDateString('ja-JP', { year: 'numeric', month: '2-digit', day: '2-digit' }).replace(/\//g, '.'),
          image: '', // Start empty
          content: '<p>ここに本文を入力してください...</p>',
          status: 'draft'
      };
      setEditingArticleData(newArticle);
      setIsEditingArticle(true);
      setViewingArticle(null);
  };

  const handleEditArticle = (article: Article) => {
      setEditingArticleData({ ...article });
      setIsEditingArticle(true);
  };

  const handleArticleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (file) {
          const reader = new FileReader();
          reader.onloadend = () => {
              if (editingArticleData) {
                  setEditingArticleData({ ...editingArticleData, image: reader.result as string });
              }
          };
          reader.readAsDataURL(file);
      }
  };

  const handleSaveArticle = (status: 'published' | 'draft') => {
      if (!editingArticleData) return;
      
      const newArticle = { 
          ...editingArticleData, 
          status,
          id: editingArticleData.id || Date.now(),
          image: editingArticleData.image || 'https://picsum.photos/id/1/600/400' // Fallback if no image
      } as Article;

      setArticles(prev => {
          const exists = prev.find(a => a.id === newArticle.id);
          if (exists) {
              return prev.map(a => a.id === newArticle.id ? newArticle : a);
          } else {
              return [newArticle, ...prev];
          }
      });

      alert(status === 'published' ? '記事を公開しました。' : '記事を下書き保存しました。');
      setIsEditingArticle(false);
      setViewingArticle(newArticle);
      setEditingArticleData(null);
  };

  const handleDeleteArticle = (id: number) => {
      if (confirm('この記事を削除してもよろしいですか？')) {
          setArticles(prev => prev.filter(a => a.id !== id));
          if (viewingArticle?.id === id) setViewingArticle(null);
      }
  };

  // --- FAQ Handlers ---
  const handleCreateFaq = () => {
      setEditingFaqData({ q: '', a: '', status: 'published' }); // Default to published for simplicity
      setIsEditingFaq(true);
  };

  const handleEditFaq = (faq: FAQ) => {
      setEditingFaqData({ ...faq });
      setIsEditingFaq(true);
  };

  const handleSaveFaq = () => {
      if (!editingFaqData) return;
      const newFaq = {
          ...editingFaqData,
          id: editingFaqData.id || Date.now(),
          status: 'published' // Always publish for now as per simple req
      } as FAQ;

      setFaqs(prev => {
          const exists = prev.find(f => f.id === newFaq.id);
          if (exists) {
              return prev.map(f => f.id === newFaq.id ? newFaq : f);
          } else {
              return [...prev, newFaq];
          }
      });
      setIsEditingFaq(false);
      setEditingFaqData(null);
  };

  const handleDeleteFaq = (id: number) => {
      if (confirm('このFAQを削除してもよろしいですか？')) {
          setFaqs(prev => prev.filter(f => f.id !== id));
      }
  };

  // --- Job Handlers ---
  const toggleActiveHiring = (jobId: string) => {
      setJobs(prevJobs => 
          prevJobs.map(job => 
              job.id === jobId 
                  ? { ...job, isActivelyHiring: !job.isActivelyHiring }
                  : job
          )
      );
  };


  // --- Render Functions ---
  const renderCompanies = () => (
      <div className="bg-white rounded-sm shadow-sm border border-gray-200 overflow-hidden animate-fade-in">
          <table className="w-full text-left">
              <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                      <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase">会社名</th>
                      <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase">業界</th>
                      <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase">所在地</th>
                      <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase text-right">アクション</th>
                  </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                  {companies.map(company => (
                      <tr key={company.id} className="hover:bg-gray-50 transition-colors">
                          <td className="px-6 py-4 font-bold">{company.name}</td>
                          <td className="px-6 py-4 text-sm">{company.industry}</td>
                          <td className="px-6 py-4 text-sm">{company.location}</td>
                          <td className="px-6 py-4 text-right">
                              <button 
                                onClick={() => onLoginAsCompany(company.name)}
                                className="text-xs font-bold bg-black text-white px-3 py-1.5 rounded-sm hover:bg-gray-800 flex items-center gap-1 ml-auto"
                              >
                                  <LogIn size={12}/> Login as
                              </button>
                          </td>
                      </tr>
                  ))}
              </tbody>
          </table>
      </div>
  );

  const renderJobs = () => (
      <div className="bg-white rounded-sm shadow-sm border border-gray-200 overflow-hidden animate-fade-in">
          <div className="p-4 bg-gray-50 border-b border-gray-200 text-sm text-gray-600">
              ホーム画面の「PICK UP / 積極採用中」セクションに表示する求人を選択できます。
          </div>
          <table className="w-full text-left">
              <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                      <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase">積極採用中</th>
                      <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase">求人タイトル</th>
                      <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase">会社名</th>
                      <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase">ステータス</th>
                  </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                  {jobs.map(job => (
                      <tr key={job.id} className="hover:bg-gray-50 transition-colors">
                          <td className="px-6 py-4 text-center w-24">
                              <button 
                                  onClick={() => toggleActiveHiring(job.id)}
                                  className={`flex items-center gap-2 px-3 py-1.5 rounded-sm text-xs font-bold transition-colors ${job.isActivelyHiring ? 'bg-black text-white' : 'bg-gray-100 text-gray-400 hover:bg-gray-200'}`}
                              >
                                  {job.isActivelyHiring ? <CheckSquare size={16} /> : <Square size={16} />}
                                  {job.isActivelyHiring ? 'ON' : 'OFF'}
                              </button>
                          </td>
                          <td className="px-6 py-4 font-bold text-sm line-clamp-1 max-w-md">{job.title}</td>
                          <td className="px-6 py-4 text-sm">{job.company.name}</td>
                          <td className="px-6 py-4 text-sm">
                              <span className={`px-2 py-1 rounded-sm text-xs font-bold ${job.status === 'draft' ? 'bg-gray-200 text-gray-600' : 'bg-green-100 text-green-700'}`}>
                                  {job.status || 'published'}
                              </span>
                          </td>
                      </tr>
                  ))}
              </tbody>
          </table>
      </div>
  );

  const renderStudents = () => (
      <div className="bg-white rounded-sm shadow-sm border border-gray-200 overflow-hidden animate-fade-in">
          <table className="w-full text-left">
              <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                      <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase">氏名</th>
                      <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase">大学</th>
                      <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase">Email</th>
                      <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase text-right">アクション</th>
                  </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                  {students.map(student => (
                      <tr key={student.id} className="hover:bg-gray-50 transition-colors">
                          <td className="px-6 py-4 font-bold">{student.name}</td>
                          <td className="px-6 py-4 text-sm">{student.university}</td>
                          <td className="px-6 py-4 text-sm">{student.email}</td>
                          <td className="px-6 py-4 text-right">
                               <button 
                                onClick={() => onLoginAsStudent(student.name)}
                                className="text-xs font-bold bg-black text-white px-3 py-1.5 rounded-sm hover:bg-gray-800 flex items-center gap-1 ml-auto"
                              >
                                  <LogIn size={12}/> Login as
                              </button>
                          </td>
                      </tr>
                  ))}
              </tbody>
          </table>
      </div>
  );

  const renderArticles = () => {
      // Edit Form
      if (isEditingArticle && editingArticleData) {
          return (
              <div className="bg-white p-8 rounded-sm shadow-sm border border-gray-200 animate-fade-in">
                  <div className="flex justify-between items-center mb-8 border-b border-gray-100 pb-4">
                      <h2 className="text-xl font-black text-gray-900">コラム記事編集</h2>
                      <div className="flex gap-2">
                          <button onClick={() => { setIsEditingArticle(false); setEditingArticleData(null); }} className="px-4 py-2 text-sm font-bold text-gray-500 hover:text-black">キャンセル</button>
                          <button onClick={() => handleSaveArticle('draft')} className="px-4 py-2 border border-gray-300 text-gray-600 text-sm font-bold rounded-sm hover:bg-gray-50 flex items-center gap-2"><FileText size={16}/> 下書き保存</button>
                          <button onClick={() => handleSaveArticle('published')} className="px-6 py-2 bg-black text-white text-sm font-bold rounded-sm hover:bg-gray-800 flex items-center gap-2"><Send size={16}/> 公開</button>
                      </div>
                  </div>
                  <div className="space-y-6 max-w-3xl">
                      <div>
                          <label className="block text-xs font-bold text-gray-500 uppercase mb-2">タイトル</label>
                          <input type="text" value={editingArticleData.title} onChange={(e) => setEditingArticleData({...editingArticleData, title: e.target.value})} className="w-full p-3 border border-gray-300 rounded-sm text-lg font-bold focus:outline-none focus:border-black"/>
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                          <div>
                              <label className="block text-xs font-bold text-gray-500 uppercase mb-2">カテゴリ</label>
                              <select value={editingArticleData.category} onChange={(e) => setEditingArticleData({...editingArticleData, category: e.target.value})} className="w-full p-3 border border-gray-300 rounded-sm text-sm focus:outline-none focus:border-black">
                                  <option value="NEWS">NEWS</option>
                                  <option value="INTERVIEW">INTERVIEW</option>
                                  <option value="COLUMN">COLUMN</option>
                                  <option value="CAREER">CAREER</option>
                                  <option value="SKILL">SKILL</option>
                                  <option value="WORK STYLE">WORK STYLE</option>
                                  <option value="TREND">TREND</option>
                              </select>
                          </div>
                          <div>
                              <label className="block text-xs font-bold text-gray-500 uppercase mb-2">日付</label>
                              <input type="text" value={editingArticleData.date} onChange={(e) => setEditingArticleData({...editingArticleData, date: e.target.value})} className="w-full p-3 border border-gray-300 rounded-sm text-sm focus:outline-none focus:border-black"/>
                          </div>
                      </div>
                      
                      {/* Image Upload */}
                      <div>
                          <label className="block text-xs font-bold text-gray-500 uppercase mb-2">記事サムネイル画像</label>
                          <div className="relative w-full h-64 bg-gray-100 rounded-sm overflow-hidden border-2 border-dashed border-gray-300 hover:border-black transition-colors group">
                               {editingArticleData.image ? (
                                   <img src={editingArticleData.image} className="w-full h-full object-cover opacity-90 group-hover:opacity-100 transition-opacity" alt="preview"/>
                               ) : (
                                   <div className="flex flex-col items-center justify-center h-full text-gray-400">
                                       <ImageIcon size={32} className="mb-2"/>
                                       <span className="text-sm font-bold">画像をアップロード</span>
                                   </div>
                               )}
                               <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-black/30">
                                   <label className="cursor-pointer bg-white text-black px-4 py-2 rounded-sm text-xs font-bold flex items-center gap-2 shadow-lg">
                                       <Upload size={14}/> ファイルを選択
                                       <input type="file" className="hidden" accept="image/png, image/jpeg" onChange={handleArticleImageUpload}/>
                                   </label>
                               </div>
                          </div>
                          <p className="text-[10px] text-gray-400 mt-2 text-right">推奨: 1200x800px (JPG, PNG)</p>
                      </div>

                      {/* Rich Text Editor */}
                      <RichTextEditor 
                        label="本文 (画像挿入可)" 
                        value={editingArticleData.content || ''} 
                        onChange={(html) => setEditingArticleData({...editingArticleData!, content: html})} 
                      />
                  </div>
              </div>
          );
      }

      // Detail View
      if (viewingArticle) {
          return (
              <div className="bg-white p-8 rounded-sm shadow-sm border border-gray-200 animate-fade-in">
                  <div className="flex justify-between items-start mb-8 border-b border-gray-100 pb-4">
                      <button onClick={() => setViewingArticle(null)} className="text-gray-500 hover:text-black font-bold text-sm flex items-center gap-1">
                          <ArrowLeft size={16}/> 一覧に戻る
                      </button>
                      <div className="flex gap-2">
                          <button onClick={() => handleDeleteArticle(viewingArticle.id)} className="p-2 text-red-500 hover:bg-red-50 rounded-sm"><Trash2 size={18}/></button>
                          <button onClick={() => handleEditArticle(viewingArticle)} className="px-6 py-2 bg-black text-white text-sm font-bold rounded-sm hover:bg-gray-800 flex items-center gap-2"><Edit2 size={16}/> 編集</button>
                      </div>
                  </div>
                  
                  <div className="max-w-4xl mx-auto">
                      <div className="mb-4">
                          <span className={`inline-block px-2 py-1 text-xs font-bold rounded-sm uppercase ${viewingArticle.status === 'published' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'}`}>
                              {viewingArticle.status === 'published' ? '公開中' : '下書き'}
                          </span>
                      </div>
                      <span className="inline-block bg-black text-white text-xs font-bold px-3 py-1 mb-4">{viewingArticle.category}</span>
                      <h1 className="text-3xl font-black text-gray-900 mb-4">{viewingArticle.title}</h1>
                      <p className="text-sm text-gray-500 font-bold mb-8">{viewingArticle.date}</p>
                      <img src={viewingArticle.image} alt="" className="w-full h-64 object-cover rounded-sm mb-8"/>
                      <div className="prose prose-sm max-w-none text-gray-700" dangerouslySetInnerHTML={{ __html: viewingArticle.content }} />
                  </div>
              </div>
          );
      }

      // List View
      return (
        <div className="space-y-6 animate-fade-in">
            <div className="flex justify-between items-center">
                <div className="relative">
                    <input type="text" placeholder="記事を検索..." className="pl-9 pr-4 py-2 border border-gray-300 rounded-sm text-sm focus:outline-none focus:border-black bg-white"/>
                    <Search size={16} className="absolute left-3 top-2.5 text-gray-400"/>
                </div>
                <button onClick={handleCreateArticle} className="bg-black text-white px-4 py-2 rounded-sm font-bold text-sm flex items-center gap-2 hover:bg-gray-800 shadow-md">
                    <Plus size={16}/> 記事を作成
                </button>
            </div>
            <div className="grid grid-cols-1 gap-4">
                {articles.map(article => (
                    <div 
                        key={article.id} 
                        onClick={() => setViewingArticle(article)}
                        className="bg-white p-4 rounded-sm border border-gray-200 flex gap-4 items-center group cursor-pointer hover:shadow-md transition-all"
                    >
                        <div className="w-24 h-16 bg-gray-100 rounded-sm overflow-hidden flex-shrink-0">
                            <img src={article.image} className="w-full h-full object-cover" alt=""/>
                        </div>
                        <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1">
                                <span className={`w-2 h-2 rounded-full ${article.status === 'published' ? 'bg-green-500' : 'bg-gray-400'}`}></span>
                                <span className="text-[10px] font-bold bg-gray-100 px-2 py-0.5 rounded text-gray-600">{article.category}</span>
                                <span className="text-[10px] text-gray-400">{article.date}</span>
                            </div>
                            <h4 className="font-bold text-sm text-gray-900 line-clamp-1 group-hover:text-blue-600 transition-colors">{article.title}</h4>
                        </div>
                        <div className="p-2 text-gray-300 group-hover:text-black">
                            <Eye size={20}/>
                        </div>
                    </div>
                ))}
            </div>
        </div>
      );
  };

  const renderFAQs = () => (
      <div className="space-y-6 animate-fade-in">
          <div className="flex justify-end">
              <button onClick={handleCreateFaq} className="bg-black text-white px-4 py-2 rounded-sm font-bold text-sm flex items-center gap-2 hover:bg-gray-800 shadow-md">
                  <Plus size={16}/> FAQを追加
              </button>
          </div>

          {isEditingFaq && editingFaqData && (
              <div className="bg-white p-6 rounded-sm border border-gray-200 shadow-lg mb-6 relative animate-fade-in-up">
                  <h4 className="font-bold text-sm mb-4">FAQの編集・追加</h4>
                  <div className="space-y-4">
                      <div>
                          <label className="block text-xs font-bold text-gray-500 uppercase mb-1">質問 (Q)</label>
                          <input type="text" value={editingFaqData.q} onChange={e => setEditingFaqData({...editingFaqData, q: e.target.value})} className="w-full p-2 border border-gray-300 rounded-sm text-sm focus:outline-none focus:border-black"/>
                      </div>
                      <div>
                          <label className="block text-xs font-bold text-gray-500 uppercase mb-1">回答 (A)</label>
                          <textarea rows={3} value={editingFaqData.a} onChange={e => setEditingFaqData({...editingFaqData, a: e.target.value})} className="w-full p-2 border border-gray-300 rounded-sm text-sm focus:outline-none focus:border-black"/>
                      </div>
                      <div className="flex justify-end gap-2">
                          <button onClick={() => { setIsEditingFaq(false); setEditingFaqData(null); }} className="px-4 py-2 text-xs font-bold text-gray-500 hover:text-black">キャンセル</button>
                          <button onClick={handleSaveFaq} className="px-4 py-2 bg-blue-600 text-white text-xs font-bold rounded-sm hover:bg-blue-700">保存して公開</button>
                      </div>
                  </div>
              </div>
          )}

          <div className="space-y-4">
              {faqs.map(faq => (
                  <div key={faq.id} className="bg-white p-6 rounded-sm border border-gray-200 group hover:shadow-sm transition-shadow">
                      <div className="flex justify-between items-start mb-2">
                          <h4 className="font-bold text-sm text-gray-900 flex items-center gap-2 flex-1">
                              <span className="text-blue-600 font-black">Q.</span> {faq.q}
                          </h4>
                          <div className="flex gap-2">
                              <button onClick={() => handleEditFaq(faq)} className="text-gray-400 hover:text-blue-600 p-1"><Edit2 size={16}/></button>
                              <button onClick={() => handleDeleteFaq(faq.id)} className="text-gray-400 hover:text-red-600 p-1"><Trash2 size={16}/></button>
                          </div>
                      </div>
                      <p className="text-sm text-gray-600 ml-6 leading-relaxed"><span className="font-bold text-gray-900 mr-2">A.</span> {faq.a}</p>
                  </div>
              ))}
          </div>
      </div>
  );

  const renderSettings = () => (
      <div className="max-w-2xl bg-white p-8 rounded-sm border border-gray-200 animate-fade-in">
          <h3 className="font-bold text-lg mb-8 border-b border-gray-100 pb-4">管理者アカウント設定</h3>
          
          <div className="space-y-8">
              <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase mb-2">メールアドレス変更</label>
                  <div className="flex gap-2">
                      <div className="relative flex-1">
                          <Mail size={16} className="absolute left-3 top-3 text-gray-400"/>
                          <input type="email" value={adminEmail} onChange={(e) => setAdminEmail(e.target.value)} className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-sm text-sm focus:outline-none focus:border-black"/>
                      </div>
                      <button className="px-4 py-2 bg-gray-900 text-white text-xs font-bold rounded-sm hover:bg-black">更新</button>
                  </div>
              </div>

              <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase mb-2">パスワード変更</label>
                  <div className="space-y-3">
                      <div className="relative">
                          <Lock size={16} className="absolute left-3 top-3 text-gray-400"/>
                          <input type="password" placeholder="現在のパスワード" className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-sm text-sm focus:outline-none focus:border-black"/>
                      </div>
                      <div className="relative">
                          <Lock size={16} className="absolute left-3 top-3 text-gray-400"/>
                          <input type="password" placeholder="新しいパスワード" className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-sm text-sm focus:outline-none focus:border-black"/>
                      </div>
                      <div className="relative">
                          <Lock size={16} className="absolute left-3 top-3 text-gray-400"/>
                          <input type="password" placeholder="新しいパスワード（確認）" className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-sm text-sm focus:outline-none focus:border-black"/>
                      </div>
                      <div className="flex justify-end">
                          <button className="px-6 py-2.5 bg-gray-900 text-white text-xs font-bold rounded-sm hover:bg-black">パスワードを変更</button>
                      </div>
                  </div>
              </div>
          </div>
      </div>
  );

  return (
    <div className="flex h-screen bg-gray-100 font-sans text-gray-900">
      {/* Sidebar */}
      <aside className="w-64 bg-black text-white flex-shrink-0 flex flex-col">
        <div className="h-20 flex items-center justify-center border-b border-gray-800">
            <h1 className="font-black text-lg tracking-widest">KAXIN.inc</h1>
        </div>
        <nav className="flex-1 py-6 space-y-2">
            <button 
                onClick={() => setActiveTab('companies')}
                className={`w-full flex items-center gap-4 px-6 py-3 text-sm font-bold transition-colors ${activeTab === 'companies' ? 'bg-gray-800 text-white' : 'text-gray-400 hover:text-white'}`}
            >
                <Building2 size={18} /> 企業管理
            </button>
            <button 
                onClick={() => setActiveTab('jobs')}
                className={`w-full flex items-center gap-4 px-6 py-3 text-sm font-bold transition-colors ${activeTab === 'jobs' ? 'bg-gray-800 text-white' : 'text-gray-400 hover:text-white'}`}
            >
                <Briefcase size={18} /> 求人管理
            </button>
            <button 
                onClick={() => setActiveTab('students')}
                className={`w-full flex items-center gap-4 px-6 py-3 text-sm font-bold transition-colors ${activeTab === 'students' ? 'bg-gray-800 text-white' : 'text-gray-400 hover:text-white'}`}
            >
                <Users size={18} /> 学生管理
            </button>
            <button 
                onClick={() => setActiveTab('articles')}
                className={`w-full flex items-center gap-4 px-6 py-3 text-sm font-bold transition-colors ${activeTab === 'articles' ? 'bg-gray-800 text-white' : 'text-gray-400 hover:text-white'}`}
            >
                <FileText size={18} /> コラム管理
            </button>
            <button 
                onClick={() => setActiveTab('faqs')}
                className={`w-full flex items-center gap-4 px-6 py-3 text-sm font-bold transition-colors ${activeTab === 'faqs' ? 'bg-gray-800 text-white' : 'text-gray-400 hover:text-white'}`}
            >
                <HelpCircle size={18} /> FAQ管理
            </button>
            <button 
                onClick={() => setActiveTab('settings')}
                className={`w-full flex items-center gap-4 px-6 py-3 text-sm font-bold transition-colors ${activeTab === 'settings' ? 'bg-gray-800 text-white' : 'text-gray-400 hover:text-white'}`}
            >
                <Settings size={18} /> 設定
            </button>
        </nav>
        <div className="p-4 border-t border-gray-800">
            <button onClick={onLogout} className="w-full flex items-center gap-2 text-red-400 hover:text-red-300 text-xs font-bold py-2">
                <LogOut size={16}/> ログアウト
            </button>
        </div>
      </aside>

      {/* Content */}
      <main className="flex-1 overflow-y-auto p-10">
          <header className="flex justify-between items-center mb-10">
              <h2 className="text-2xl font-black">
                  {activeTab === 'companies' && '企業一覧・管理'}
                  {activeTab === 'jobs' && '求人管理 (PICK UP)'}
                  {activeTab === 'students' && '学生一覧・管理'}
                  {activeTab === 'articles' && 'コラム記事管理'}
                  {activeTab === 'faqs' && 'FAQ管理'}
                  {activeTab === 'settings' && '管理者設定'}
              </h2>
              {['companies', 'students', 'articles'].includes(activeTab) && !viewingArticle && (
                  <div className="relative">
                      <input type="text" placeholder="検索..." className="pl-9 pr-4 py-2 border border-gray-300 rounded-sm text-sm focus:outline-none focus:border-black bg-white"/>
                      <Search size={16} className="absolute left-3 top-2.5 text-gray-400"/>
                  </div>
              )}
          </header>

          {activeTab === 'companies' && renderCompanies()}
          {activeTab === 'jobs' && renderJobs()}
          {activeTab === 'students' && renderStudents()}
          {activeTab === 'articles' && renderArticles()}
          {activeTab === 'faqs' && renderFAQs()}
          {activeTab === 'settings' && renderSettings()}
      </main>
    </div>
  );
};
