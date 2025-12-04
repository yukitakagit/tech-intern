
import React, { useState } from 'react';
import { UserPlus, User, LogOut, Settings } from 'lucide-react';

interface HeaderProps {
  user: string | null;
  onNavigateHome: () => void;
  onNavigateLogin: () => void;
  onNavigateRegister: () => void;
  onNavigateMyPage: () => void;
  onNavigateRecruiter: () => void;
  onLogout: () => void;
}

export const Header: React.FC<HeaderProps> = ({ 
    user, 
    onNavigateHome, 
    onNavigateLogin, 
    onNavigateRegister, 
    onNavigateMyPage, 
    onNavigateRecruiter,
    onLogout 
}) => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

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
        <div className="flex flex-col items-end justify-center">
          <div className="flex items-center gap-4">
            {user ? (
              <div className="relative">
                  <button 
                      onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                      onBlur={() => setTimeout(() => setIsDropdownOpen(false), 200)}
                      className="flex items-center gap-2 cursor-pointer hover:bg-gray-100 px-3 py-1.5 rounded-sm transition-colors focus:outline-none"
                  >
                      <div className="w-6 h-6 bg-black text-white rounded-full flex items-center justify-center">
                          <User size={14}/>
                      </div>
                      <span className="text-sm font-bold text-gray-900">{user}</span>
                  </button>

                  {/* Dropdown Menu */}
                  {isDropdownOpen && (
                      <div className="absolute right-0 mt-2 w-48 bg-white rounded-sm shadow-xl border border-gray-100 py-1 animate-fade-in-up">
                          <button 
                              onClick={() => {
                                  onNavigateMyPage();
                                  setIsDropdownOpen(false);
                              }}
                              className="w-full text-left px-4 py-3 text-sm font-bold text-gray-700 hover:bg-gray-50 hover:text-black flex items-center gap-2"
                          >
                              <Settings size={16} /> マイページ
                          </button>
                          <div className="h-px bg-gray-100 my-1"></div>
                          <button 
                              onClick={() => {
                                  onLogout();
                                  setIsDropdownOpen(false);
                              }}
                              className="w-full text-left px-4 py-3 text-sm font-bold text-red-600 hover:bg-red-50 flex items-center gap-2"
                          >
                              <LogOut size={16} /> ログアウト
                          </button>
                      </div>
                  )}
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
      </div>
    </header>
  );
};
