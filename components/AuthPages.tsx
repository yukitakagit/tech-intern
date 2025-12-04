
import React, { useState } from 'react';
import { Github, Chrome, Apple } from 'lucide-react'; // Using Chrome as Google proxy

interface AuthProps {
  onLoginSuccess: (name: string, isAdmin?: boolean) => void;
  onNavigateRegister: () => void;
  onNavigateLogin: () => void;
}

const SocialButtons = () => (
    <div className="space-y-3 mb-6">
        <button className="w-full flex items-center justify-center gap-3 bg-white border border-gray-300 text-gray-700 font-bold py-2.5 rounded-sm hover:bg-gray-50 transition-colors text-sm">
            <Chrome size={18} /> Googleで続行
        </button>
        <button className="w-full flex items-center justify-center gap-3 bg-[#24292e] text-white font-bold py-2.5 rounded-sm hover:bg-[#2f363d] transition-colors text-sm">
            <Github size={18} /> GitHubで続行
        </button>
        <button className="w-full flex items-center justify-center gap-3 bg-black text-white font-bold py-2.5 rounded-sm hover:bg-gray-800 transition-colors text-sm">
            <Apple size={18} /> Appleで続行
        </button>
    </div>
);

const Divider = () => (
    <div className="flex items-center gap-4 my-6">
        <div className="h-px bg-gray-200 flex-1"></div>
        <span className="text-xs text-gray-400 font-bold">OR</span>
        <div className="h-px bg-gray-200 flex-1"></div>
    </div>
);

export const LoginPage: React.FC<Pick<AuthProps, 'onLoginSuccess' | 'onNavigateRegister'>> = ({ onLoginSuccess, onNavigateRegister }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Admin Check
    if (email === 'contact.kaxin@gmail.com' && password === 'kaxin.techintern') {
        onLoginSuccess('Admin', true);
        return;
    }

    // Normal Login
    onLoginSuccess('田中 太郎', false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
       <div className="w-full max-w-md bg-white p-8 rounded-sm shadow-xl border border-gray-100">
          <div className="text-center mb-8">
            <h1 className="text-2xl font-black text-gray-900 mb-2">LOGIN</h1>
            <p className="text-xs text-gray-500 font-bold uppercase tracking-widest">Tech internへようこそ</p>
          </div>
          
          <SocialButtons />
          <Divider />

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
               <label className="block text-xs font-bold text-gray-700 uppercase mb-2">Email Address</label>
               <input 
                 type="email" 
                 required
                 value={email}
                 onChange={(e) => setEmail(e.target.value)}
                 className="w-full p-3 border border-gray-300 rounded-sm focus:border-black focus:ring-0 outline-none transition-colors"
                 placeholder="name@example.com"
               />
            </div>
             <div>
               <label className="block text-xs font-bold text-gray-700 uppercase mb-2">Password</label>
               <input 
                 type="password" 
                 required
                 value={password}
                 onChange={(e) => setPassword(e.target.value)}
                 className="w-full p-3 border border-gray-300 rounded-sm focus:border-black focus:ring-0 outline-none transition-colors"
                 placeholder="••••••••"
               />
            </div>
            
            {/* Changed from Blue to Black as requested */}
            <button type="submit" className="w-full bg-black text-white font-bold py-3 rounded-sm hover:bg-gray-800 transition-colors shadow-lg">
                ログイン
            </button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-sm text-gray-500">
                アカウントをお持ちでない方は 
                <button onClick={onNavigateRegister} className="text-black font-bold ml-1 underline">会員登録</button>
            </p>
          </div>
       </div>
    </div>
  );
};

export const RegisterPage: React.FC<Pick<AuthProps, 'onLoginSuccess' | 'onNavigateLogin'>> = ({ onLoginSuccess, onNavigateLogin }) => {
    const [name, setName] = useState('');
    
    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onLoginSuccess(name, false);
    };

    return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
       <div className="w-full max-w-md bg-white p-8 rounded-sm shadow-xl border border-gray-100">
          <div className="text-center mb-8">
            <h1 className="text-2xl font-black text-gray-900 mb-2">REGISTER</h1>
            <p className="text-xs text-gray-500 font-bold uppercase tracking-widest">新規会員登録</p>
          </div>
          
          <SocialButtons />
          <Divider />

          <form onSubmit={handleSubmit} className="space-y-4">
             <div>
               <label className="block text-xs font-bold text-gray-700 uppercase mb-2">Full Name</label>
               <input 
                 type="text" 
                 required
                 value={name}
                 onChange={(e) => setName(e.target.value)}
                 className="w-full p-3 border border-gray-300 rounded-sm focus:border-black focus:ring-0 outline-none transition-colors"
                 placeholder="田中 太郎"
               />
            </div>
            <div>
               <label className="block text-xs font-bold text-gray-700 uppercase mb-2">Email Address</label>
               <input 
                 type="email" 
                 required
                 className="w-full p-3 border border-gray-300 rounded-sm focus:border-black focus:ring-0 outline-none transition-colors"
                 placeholder="name@example.com"
               />
            </div>
             <div>
               <label className="block text-xs font-bold text-gray-700 uppercase mb-2">Password</label>
               <input 
                 type="password" 
                 required
                 className="w-full p-3 border border-gray-300 rounded-sm focus:border-black focus:ring-0 outline-none transition-colors"
                 placeholder="••••••••"
               />
            </div>
            
            <button type="submit" className="w-full bg-black text-white font-bold py-3 rounded-sm hover:bg-gray-800 transition-colors shadow-lg mt-4">
                アカウント作成
            </button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-sm text-gray-500">
                既にアカウントをお持ちの方は 
                <button onClick={onNavigateLogin} className="text-black font-bold ml-1 underline">ログイン</button>
            </p>
          </div>
       </div>
    </div>
  );
};
