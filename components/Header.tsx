import React from 'react';
import { UserPlus, User } from 'lucide-react';

interface HeaderProps {
  user: string | null;
  onNavigateHome: () => void;
  onNavigateLogin: () => void;
  onNavigateRegister: () => void;
  onNavigateMyPage: () => void;
}

export const Header: React.FC<HeaderProps> = ({ user, onNavigateHome, onNavigateLogin, onNavigateRegister, onNavigateMyPage }) => {
  return (
    <header className="sticky top-0 z-50 w-full bg-white/80 backdrop-blur-md border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Logo */}
        <div className="flex flex-col cursor-pointer group" onClick={onNavigateHome}>
            <div className="flex items-center gap-1">
                <span className="text-2xl font-black tracking-tighter text-gray-900 group-hover:text-black transition-colors">
                    Tech intern
                </span>
            </div>
            <span className="text-[10px] font-bold text-gray-500 tracking-widest uppercase -mt-1 ml-0.5">
                テックインターン
            </span>
        </div>

        {/* Right Actions */}
        <div className="flex items-center gap-4">
          <a 
            href="#" 
            className="hidden md:flex items-center gap-2 text-sm font-bold text-gray-600 hover:text-black transition-colors"
          >
            採用担当者様
          </a>
          
          <div className="h-4 w-px bg-gray-300 mx-1 hidden md:block"></div>

          {user ? (
            <div 
                onClick={onNavigateMyPage}
                className="flex items-center gap-2 cursor-pointer hover:bg-gray-100 px-3 py-1.5 rounded-sm transition-colors"
            >
                <div className="w-6 h-6 bg-black text-white rounded-full flex items-center justify-center">
                    <User size={14}/>
                </div>
                <span className="text-sm font-bold text-gray-900">{user}</span>
            </div>
          ) : (
            <>
                <button 
                    onClick={onNavigateLogin}
                    className="hidden md:flex items-center gap-2 text-sm font-bold text-gray-800 hover:text-black transition-colors"
                >
                    ログイン
                </button>

                <button 
                    onClick={onNavigateRegister}
                    className="flex items-center gap-2 px-5 py-2 text-sm font-bold text-white bg-black hover:bg-gray-800 rounded-sm shadow-sm transition-all duration-200"
                >
                    <UserPlus size={16} />
                    会員登録
                </button>
            </>
          )}
        </div>
      </div>
    </header>
  );
};
