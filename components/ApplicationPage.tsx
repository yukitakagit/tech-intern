
import React, { useState } from 'react';
import { JobListing } from '../types';
import { Send, ArrowLeft, CheckCircle } from 'lucide-react';

interface ApplicationPageProps {
  job: JobListing;
  onBack: () => void;
  onSubmit: () => void;
}

export const ApplicationPage: React.FC<ApplicationPageProps> = ({ job, onBack, onSubmit }) => {
  const [formData, setFormData] = useState({
    university: '',
    faculty: '',
    grade: '',
    name: '',
    email: '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Simulate sending email to company
    setTimeout(() => {
        console.log(`
        [Email Simulation]
        To: info@${job.company.id}.com (Company Admin)
        Subject: 【Tech intern】新しい応募がありました：${job.title}
        Body:
        ${formData.name} 様から応募がありました。
        大学: ${formData.university}
        学部: ${formData.faculty}
        メール: ${formData.email}
        メッセージ: ${formData.message}
        
        管理画面から詳細を確認してください。
        `);
        
        // alert(`企業担当者（${job.company.name}）へ応募通知メールを送信しました。`);
        setIsSubmitting(false);
        onSubmit();
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-2xl mx-auto">
        <button onClick={onBack} className="flex items-center text-gray-500 hover:text-black mb-8 font-bold text-sm transition-colors">
            <ArrowLeft size={16} className="mr-1"/> 募集詳細に戻る
        </button>

        <div className="bg-white rounded-sm shadow-xl overflow-hidden border border-gray-100">
            {/* Header */}
            <div className="bg-black p-10 text-white relative overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-gray-800 rounded-full blur-2xl opacity-50 -mr-10 -mt-10"></div>
                <h1 className="text-3xl font-black mb-2 relative z-10">ENTRY FORM</h1>
                <p className="text-gray-400 text-sm font-bold tracking-widest uppercase relative z-10">応募フォーム</p>
                <div className="mt-8 pt-8 border-t border-gray-800 relative z-10">
                    <p className="text-[10px] text-gray-400 uppercase tracking-widest mb-2 font-bold">APPLYING FOR</p>
                    <h2 className="text-xl font-bold leading-snug">{job.title}</h2>
                    <p className="text-sm text-gray-300 mt-2 flex items-center gap-2">
                        <span className="w-1 h-1 bg-white rounded-full"></span>
                        {job.company.name}
                    </p>
                </div>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="p-8 md:p-10 space-y-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="space-y-2">
                        <label className="block text-xs font-bold text-gray-500 uppercase">大学名 <span className="text-red-500">*</span></label>
                        <input 
                            type="text" 
                            required
                            value={formData.university}
                            onChange={(e) => setFormData({...formData, university: e.target.value})}
                            className="w-full p-3 bg-gray-50 border border-gray-200 rounded-sm focus:bg-white focus:border-black focus:ring-0 outline-none transition-all font-medium"
                            placeholder="例）東京大学"
                        />
                    </div>
                    <div className="space-y-2">
                         <label className="block text-xs font-bold text-gray-500 uppercase">学部・学科 <span className="text-red-500">*</span></label>
                         <input 
                            type="text" 
                            required
                            value={formData.faculty}
                            onChange={(e) => setFormData({...formData, faculty: e.target.value})}
                            className="w-full p-3 bg-gray-50 border border-gray-200 rounded-sm focus:bg-white focus:border-black focus:ring-0 outline-none transition-all font-medium"
                            placeholder="例）工学部 情報工学科"
                        />
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="space-y-2">
                        <label className="block text-xs font-bold text-gray-500 uppercase">学年 <span className="text-red-500">*</span></label>
                         <input 
                            type="text" 
                            required
                            value={formData.grade}
                            onChange={(e) => setFormData({...formData, grade: e.target.value})}
                            className="w-full p-3 bg-gray-50 border border-gray-200 rounded-sm focus:bg-white focus:border-black focus:ring-0 outline-none transition-all font-medium"
                            placeholder="例）学部3年"
                        />
                    </div>
                     <div className="space-y-2">
                        <label className="block text-xs font-bold text-gray-500 uppercase">氏名 <span className="text-red-500">*</span></label>
                         <input 
                            type="text" 
                            required
                            value={formData.name}
                            onChange={(e) => setFormData({...formData, name: e.target.value})}
                            className="w-full p-3 bg-gray-50 border border-gray-200 rounded-sm focus:bg-white focus:border-black focus:ring-0 outline-none transition-all font-medium"
                            placeholder="例）田中 太郎"
                        />
                    </div>
                </div>

                <div className="space-y-2">
                     <label className="block text-xs font-bold text-gray-500 uppercase">メールアドレス <span className="text-red-500">*</span></label>
                     <input 
                        type="email" 
                        required
                        value={formData.email}
                        onChange={(e) => setFormData({...formData, email: e.target.value})}
                        className="w-full p-3 bg-gray-50 border border-gray-200 rounded-sm focus:bg-white focus:border-black focus:ring-0 outline-none transition-all font-medium"
                        placeholder="your-email@example.com"
                    />
                </div>

                <div className="space-y-2">
                     <label className="block text-xs font-bold text-gray-500 uppercase">アピール・メッセージ (任意)</label>
                     <textarea 
                        rows={5}
                        value={formData.message}
                        onChange={(e) => setFormData({...formData, message: e.target.value})}
                        className="w-full p-3 bg-gray-50 border border-gray-200 rounded-sm focus:bg-white focus:border-black focus:ring-0 outline-none transition-all font-medium"
                        placeholder="GitHubのURLや、特に頑張りたいことなどを記載してください"
                    />
                </div>

                <button 
                    type="submit" 
                    disabled={isSubmitting}
                    className="w-full bg-black text-white font-bold py-4 rounded-sm hover:bg-gray-800 transition-all shadow-lg flex items-center justify-center gap-2 mt-4 disabled:opacity-70 disabled:cursor-not-allowed group"
                >
                    {isSubmitting ? (
                        <>送信中...</>
                    ) : (
                        <>
                            <Send size={18} className="group-hover:translate-x-1 transition-transform"/>
                            この内容で応募する
                        </>
                    )}
                </button>
                <p className="text-center text-xs text-gray-400 mt-4">
                    応募完了後、企業担当者へ通知メールが送信されます。
                </p>
            </form>
        </div>
      </div>
    </div>
  );
};
