
import React from 'react';

interface FooterProps {
  onNavigateHome: () => void;
  onNavigateTerms: () => void;
  onNavigatePrivacy: () => void;
  onNavigateTokusho: () => void; // Added
  onNavigateCompanyProfile: () => void;
  onNavigateCompanyLP: () => void;
  onNavigateCompanyLogin: () => void;
  onNavigateCompanyList: () => void;
}

export const Footer: React.FC<FooterProps> = ({ 
  onNavigateHome, 
  onNavigateTerms, 
  onNavigatePrivacy,
  onNavigateTokusho, 
  onNavigateCompanyProfile,
  onNavigateCompanyLP,
  onNavigateCompanyLogin,
  onNavigateCompanyList
}) => {
  return (
    <footer className="bg-white border-t border-gray-200 pt-20 pb-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-10 mb-16">
              
              {/* 運営会社 */}
              <div>
                  <h5 className="font-bold text-sm text-gray-900 mb-6 uppercase tracking-wider">運営会社</h5>
                  <ul className="space-y-3 text-xs font-medium text-gray-500">
                      <li>
                        <button onClick={onNavigateCompanyProfile} className="hover:text-black transition-colors text-left">
                            会社概要
                        </button>
                      </li>
                  </ul>
              </div>

              {/* Techinternについて */}
              <div>
                  <h5 className="font-bold text-sm text-gray-900 mb-6 uppercase tracking-wider">Tech internについて</h5>
                  <ul className="space-y-3 text-xs font-medium text-gray-500">
                      <li>
                          <button onClick={onNavigateHome} className="hover:text-black transition-colors text-left">
                             長期インターンを探す大学生はこちら
                          </button>
                      </li>
                      <li>
                          <button onClick={onNavigateCompanyLP} className="hover:text-black transition-colors text-left">
                             長期インターン採用を検討中の企業様
                          </button>
                      </li>
                      <li>
                          <button onClick={onNavigateCompanyLogin} className="hover:text-black transition-colors text-left">
                             企業担当者様ログイン
                          </button>
                      </li>
                  </ul>
              </div>

              {/* Legal */}
              <div>
                  <h5 className="font-bold text-sm text-gray-900 mb-6 uppercase tracking-wider">Legal</h5>
                  <ul className="space-y-3 text-xs font-medium text-gray-500">
                      <li>
                        <button onClick={onNavigateTerms} className="hover:text-black transition-colors text-left">
                            利用規約
                        </button>
                      </li>
                      <li>
                        <button onClick={onNavigatePrivacy} className="hover:text-black transition-colors text-left">
                            プライバシーポリシー
                        </button>
                      </li>
                      <li>
                        <button onClick={onNavigateTokusho} className="hover:text-black transition-colors text-left">
                            特定商取引法に基づく表記
                        </button>
                      </li>
                  </ul>
              </div>

              {/* Navigation */}
              <div>
                  <h5 className="font-bold text-sm text-gray-900 mb-6 uppercase tracking-wider">Navigation</h5>
                  <ul className="space-y-3 text-xs font-medium text-gray-500">
                      <li>
                        <button onClick={onNavigateHome} className="hover:text-black transition-colors text-left">
                            インターンを探す
                        </button>
                      </li>
                      <li>
                        <button onClick={onNavigateCompanyList} className="hover:text-black transition-colors text-left">
                            掲載企業一覧
                        </button>
                      </li>
                  </ul>
              </div>
          </div>

          <div className="border-t border-gray-100 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
              <div className="flex flex-col">
                  <span className="font-black text-xl text-gray-900 tracking-tighter">Tech intern</span>
                  <span className="text-[10px] text-gray-400">ENGINEER INTERNSHIP PLATFORM</span>
              </div>
              <p className="text-xs text-gray-400 font-medium">© KAXIN Inc. All rights reserved.</p>
          </div>
      </div>
    </footer>
  );
};
