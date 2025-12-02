import React, { useState } from 'react';

interface AuthProps {
  onLoginSuccess: (name: string) => void;
  onNavigateRegister: () => void;
  onNavigateLogin: () => void;
}

export const LoginPage: React.FC<Pick<AuthProps, 'onLoginSuccess' | 'onNavigateRegister'>> = ({ onLoginSuccess, onNavigateRegister }) => {
  const [email, setEmail] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Simulate login
    onLoginSuccess('田中 太郎');
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
       <div className="w-full max-w-md bg-white p-8 rounded-sm shadow-xl border border-gray-100">
          <div className="text-center mb-8">
            <h1 className="text-2xl font-black text-gray-900 mb-2">LOGIN</h1>
            <p className="text-xs text-gray-500 font-bold uppercase tracking-widest">Tech internへようこそ</p>
          </div>
          
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
                 className="w-full p-3 border border-gray-300 rounded-sm focus:border-black focus:ring-0 outline-none transition-colors"
                 placeholder="••••••••"
               />
            </div>
            
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
        onLoginSuccess(name);
    };

    return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
       <div className="w-full max-w-md bg-white p-8 rounded-sm shadow-xl border border-gray-100">
          <div className="text-center mb-8">
            <h1 className="text-2xl font-black text-gray-900 mb-2">REGISTER</h1>
            <p className="text-xs text-gray-500 font-bold uppercase tracking-widest">新規会員登録</p>
          </div>
          
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
             <div>
               <label className="block text-xs font-bold text-gray-700 uppercase mb-2">University / Grade</label>
               <input 
                 type="text" 
                 className="w-full p-3 border border-gray-300 rounded-sm focus:border-black focus:ring-0 outline-none transition-colors"
                 placeholder="〇〇大学 3年生"
               />
            </div>
            
            <button type="submit" className="w-full bg-blue-600 text-white font-bold py-3 rounded-sm hover:bg-blue-700 transition-colors shadow-lg mt-4">
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
