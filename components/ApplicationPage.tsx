
import React, { useState } from 'react';
import { JobListing } from '../types';
import { Send, ArrowLeft } from 'lucide-react';

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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Simulate API call
    setTimeout(() => {
        onSubmit();
    }, 1000);
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-2xl mx-auto">
        <button onClick={onBack} className="flex items-center text-gray-500 hover:text-black mb-8 font-bold text-sm">
            <ArrowLeft size={16} className="mr-1"/> 募集詳細に戻る
        </button>

        <div className="bg-white rounded-md shadow-lg overflow-hidden">
            {/* Header */}
            <div className="bg-gray-900 p-8 text-white">
                <h1 className="text-2xl font-black mb-2">ENTRY FORM</h1>
                <p className="text-gray-400 text-sm font-bold">応募フォーム</p>
                <div className="mt-6 pt-6 border-t border-gray-700">
                    <p className="text-xs text-gray-400 uppercase mb-1">APPLYING FOR</p>
                    <h2 className="text-lg font-bold">{job.title}</h2>
                    <p className="text-sm text-gray-300 mt-1">{job.company.name}</p>
                </div>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="p-8 space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <label className="block text-xs font-bold text-gray-700 uppercase mb-2">大学名 <span className="text-red-500">*</span></label>
                        <input 
                            type="text" 
                            required
                            value={formData.university}
                            onChange={(e) => setFormData({...formData, university: e.target.value})}
                            className="w-full p-3 border border-gray-300 rounded-sm focus:border-black focus:ring-0 outline-none transition-colors"
                            placeholder="例）東京大学"
                        />
                    </div>
                    <div>
                         <label className="block text-xs font-bold text-gray-700 uppercase mb-2">学部・学科 <span className="text-red-500">*</span></label>
                         <input 
                            type="text" 
                            required
                            value={formData.faculty}
                            onChange={(e) => setFormData({...formData, faculty: e.target.value})}
                            className="w-full p-3 border border-gray-300 rounded-sm focus:border-black focus:ring-0 outline-none transition-colors"
                            placeholder="例）工学部 情報工学科"
                        />
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <label className="block text-xs font-bold text-gray-700 uppercase mb-2">学年 <span className="text-red-500">*</span></label>
                         <input 
                            type="text" 
                            required
                            value={formData.grade}
                            onChange={(e) => setFormData({...formData, grade: e.target.value})}
                            className="w-full p-3 border border-gray-300 rounded-sm focus:border-black focus:ring-0 outline-none transition-colors"
                            placeholder="例）学部3年"
                        />
                    </div>
                     <div>
                        <label className="block text-xs font-bold text-gray-700 uppercase mb-2">氏名 <span className="text-red-500">*</span></label>
                         <input 
                            type="text" 
                            required
                            value={formData.name}
                            onChange={(e) => setFormData({...formData, name: e.target.value})}
                            className="w-full p-3 border border-gray-300 rounded-sm focus:border-black focus:ring-0 outline-none transition-colors"
                            placeholder="例）田中 太郎"
                        />
                    </div>
                </div>

                <div>
                     <label className="block text-xs font-bold text-gray-700 uppercase mb-2">メールアドレス <span className="text-red-500">*</span></label>
                     <input 
                        type="email" 
                        required
                        value={formData.email}
                        onChange={(e) => setFormData({...formData, email: e.target.value})}
                        className="w-full p-3 border border-gray-300 rounded-sm focus:border-black focus:ring-0 outline-none transition-colors"
                        placeholder="your-email@example.com"
                    />
                </div>

                <div>
                     <label className="block text-xs font-bold text-gray-700 uppercase mb-2">アピール・メッセージ (任意)</label>
                     <textarea 
                        rows={4}
                        value={formData.message}
                        onChange={(e) => setFormData({...formData, message: e.target.value})}
                        className="w-full p-3 border border-gray-300 rounded-sm focus:border-black focus:ring-0 outline-none transition-colors"
                        placeholder="GitHubのURLや、特に頑張りたいことなどを記載してください"
                    />
                </div>

                <button type="submit" className="w-full bg-black text-white font-bold py-4 rounded-sm hover:bg-gray-800 transition-all shadow-lg flex items-center justify-center gap-2 mt-4">
                    <Send size={18}/>
                    この内容で応募する
                </button>
            </form>
        </div>
      </div>
    </div>
  );
};
