import React, { useState } from 'react';
import { ArrowLeft, Building2 } from 'lucide-react';

interface CompanyAuthProps {
  onLoginSuccess: (name: string) => void;
  onNavigateAlternate: () => void;
  onBack: () => void;
}

export const CompanyLogin: React.FC<CompanyAuthProps> = ({ onLoginSuccess, onNavigateAlternate, onBack }) => {
    const [email, setEmail] = useState('');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onLoginSuccess('株式会社NextGen Creative');
    };

    return (
        <div className="min-h-screen bg-gray-900 flex items-center justify-center p-4">
             <div className="w-full max-w-md">
                 <button onClick={onBack} className="flex items-center text-gray-400 hover:text-white mb-8 text-sm font-bold transition-colors">
                     <ArrowLeft size={16} className="mr-2"/> TOPに戻る
                 </button>
                 
                 <div className="bg-gray-800 p-8 rounded-sm shadow-2xl border border-gray-700">
                    <div className="text-center mb-8">
                         <div className="w-12 h-12 bg-blue-600 rounded-sm mx-auto flex items-center justify-center mb-4">
                             <Building2 className="text-white" size={24}/>
                         </div>
                         <h1 className="text-2xl font-black text-white mb-2">COMPANY LOGIN</h1>
                         <p className="text-xs text-gray-400 font-bold uppercase tracking-widest">企業様向け管理画面</p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div>
                            <label className="block text-xs font-bold text-gray-400 uppercase mb-2">Email Address</label>
                            <input 
                                type="email" 
                                required
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="w-full p-3 bg-gray-900 border border-gray-700 rounded-sm text-white focus:border-blue-500 outline-none transition-colors"
                                placeholder="hr@company.com"
                            />
                        </div>
                        <div>
                            <label className="block text-xs font-bold text-gray-400 uppercase mb-2">Password</label>
                            <input 
                                type="password" 
                                required
                                className="w-full p-3 bg-gray-900 border border-gray-700 rounded-sm text-white focus:border-blue-500 outline-none transition-colors"
                                placeholder="••••••••"
                            />
                        </div>
                        <button type="submit" className="w-full bg-blue-600 text-white font-bold py-3 rounded-sm hover:bg-blue-500 transition-colors shadow-lg">
                            ログイン
                        </button>
                    </form>

                    <div className="mt-8 text-center pt-6 border-t border-gray-700">
                         <p className="text-sm text-gray-400">
                             アカウントをお持ちでない企業様は
                             <button onClick={onNavigateAlternate} className="text-white font-bold ml-1 hover:underline">新規登録</button>
                         </p>
                    </div>
                 </div>
             </div>
        </div>
    );
};

export const CompanyRegister: React.FC<CompanyAuthProps> = ({ onLoginSuccess, onNavigateAlternate, onBack }) => {
    const [companyName, setCompanyName] = useState('');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onLoginSuccess(companyName);
    };

    return (
        <div className="min-h-screen bg-gray-900 flex items-center justify-center p-4">
             <div className="w-full max-w-md">
                 <button onClick={onBack} className="flex items-center text-gray-400 hover:text-white mb-8 text-sm font-bold transition-colors">
                     <ArrowLeft size={16} className="mr-2"/> TOPに戻る
                 </button>
                 
                 <div className="bg-gray-800 p-8 rounded-sm shadow-2xl border border-gray-700">
                    <div className="text-center mb-8">
                         <h1 className="text-2xl font-black text-white mb-2">REGISTER</h1>
                         <p className="text-xs text-gray-400 font-bold uppercase tracking-widest">企業アカウント作成</p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div>
                            <label className="block text-xs font-bold text-gray-400 uppercase mb-2">会社名</label>
                            <input 
                                type="text" 
                                required
                                value={companyName}
                                onChange={(e) => setCompanyName(e.target.value)}
                                className="w-full p-3 bg-gray-900 border border-gray-700 rounded-sm text-white focus:border-blue-500 outline-none transition-colors"
                                placeholder="例）KAXIN株式会社"
                            />
                        </div>
                        <div>
                            <label className="block text-xs font-bold text-gray-400 uppercase mb-2">Email Address</label>
                            <input 
                                type="email" 
                                required
                                className="w-full p-3 bg-gray-900 border border-gray-700 rounded-sm text-white focus:border-blue-500 outline-none transition-colors"
                                placeholder="hr@company.com"
                            />
                        </div>
                        <div>
                            <label className="block text-xs font-bold text-gray-400 uppercase mb-2">Password</label>
                            <input 
                                type="password" 
                                required
                                className="w-full p-3 bg-gray-900 border border-gray-700 rounded-sm text-white focus:border-blue-500 outline-none transition-colors"
                                placeholder="••••••••"
                            />
                        </div>
                        <button type="submit" className="w-full bg-blue-600 text-white font-bold py-3 rounded-sm hover:bg-blue-500 transition-colors shadow-lg mt-4">
                            アカウント作成
                        </button>
                    </form>

                    <div className="mt-8 text-center pt-6 border-t border-gray-700">
                         <p className="text-sm text-gray-400">
                             既にアカウントをお持ちの企業様は
                             <button onClick={onNavigateAlternate} className="text-white font-bold ml-1 hover:underline">ログイン</button>
                         </p>
                    </div>
                 </div>
             </div>
        </div>
    );
};
