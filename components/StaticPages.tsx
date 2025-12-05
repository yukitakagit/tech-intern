
import React from 'react';
import { ArrowLeft, ExternalLink } from 'lucide-react';

interface StaticPageProps {
  onBack: () => void;
}

interface CompanyProfileProps extends StaticPageProps {
    onNavigateTokusho: () => void;
}

export const CompanyProfilePage: React.FC<CompanyProfileProps> = ({ onBack, onNavigateTokusho }) => {
  return (
    <div className="min-h-screen bg-white pt-24 pb-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <button onClick={onBack} className="flex items-center text-gray-500 hover:text-black mb-8 font-bold text-sm">
            <ArrowLeft size={16} className="mr-1"/> HOMEに戻る
        </button>

        <h1 className="text-3xl font-black text-gray-900 mb-12 uppercase tracking-tight border-b border-black pb-4">
          会社概要
        </h1>

        <div className="space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 py-4 border-b border-gray-100">
            <h3 className="font-bold text-gray-900 text-sm">会社名</h3>
            <div className="md:col-span-2 text-gray-600">KAXIN株式会社</div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 py-4 border-b border-gray-100">
            <h3 className="font-bold text-gray-900 text-sm">所在地</h3>
            <div className="md:col-span-2 text-gray-600">
              千葉県流山市東深井451-54-107
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 py-4 border-b border-gray-100">
            <h3 className="font-bold text-gray-900 text-sm">代表者</h3>
            <div className="md:col-span-2 text-gray-600">代表取締役兼CEO 藤巻雄飛</div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 py-4 border-b border-gray-100">
            <h3 className="font-bold text-gray-900 text-sm">事業内容</h3>
            <div className="md:col-span-2 text-gray-600 leading-relaxed">
              <ul className="list-none space-y-1">
                <li>システム開発事業</li>
                <li>Web制作関連事業</li>
              </ul>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 py-4 border-b border-gray-100">
            <h3 className="font-bold text-gray-900 text-sm">会社HP</h3>
            <div className="md:col-span-2">
              <a href="https://www.kaxin.jp/" target="_blank" rel="noopener noreferrer" className="text-gray-600 hover:text-black hover:underline flex items-center gap-1">
                https://www.kaxin.jp/
              </a>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 py-4 border-b border-gray-100">
            <h3 className="font-bold text-gray-900 text-sm">法務情報</h3>
            <div className="md:col-span-2">
                <button onClick={onNavigateTokusho} className="text-blue-600 font-bold hover:underline flex items-center gap-1">
                    特定商取引法に基づく表記 <ExternalLink size={14}/>
                </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export const TokushoPage: React.FC<StaticPageProps> = ({ onBack }) => {
    return (
      <div className="min-h-screen bg-gray-50 pt-24 pb-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto bg-white p-8 md:p-12 rounded-sm shadow-sm border border-gray-200">
          <button onClick={onBack} className="flex items-center text-gray-500 hover:text-black mb-8 font-bold text-sm">
              <ArrowLeft size={16} className="mr-1"/> HOMEに戻る
          </button>
          
          <h1 className="text-2xl font-black text-gray-900 mb-8 border-b border-gray-200 pb-4">特定商取引法に基づく表記</h1>
          
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left text-gray-600 border-collapse border border-gray-200">
              <tbody>
                <tr className="border-b border-gray-200">
                  <th className="py-4 px-6 font-bold text-gray-900 bg-gray-50 w-1/3 border-r border-gray-200">販売事業者</th>
                  <td className="py-4 px-6">KAXIN株式会社</td>
                </tr>
                <tr className="border-b border-gray-200">
                  <th className="py-4 px-6 font-bold text-gray-900 bg-gray-50 border-r border-gray-200">代表責任者</th>
                  <td className="py-4 px-6">藤巻雄飛</td>
                </tr>
                <tr className="border-b border-gray-200">
                  <th className="py-4 px-6 font-bold text-gray-900 bg-gray-50 border-r border-gray-200">所在地</th>
                  <td className="py-4 px-6">千葉県流山市東深井451-54-107</td>
                </tr>
                <tr className="border-b border-gray-200">
                  <th className="py-4 px-6 font-bold text-gray-900 bg-gray-50 border-r border-gray-200">電話番号</th>
                  <td className="py-4 px-6">080-1164-2914</td>
                </tr>
                <tr className="border-b border-gray-200">
                  <th className="py-4 px-6 font-bold text-gray-900 bg-gray-50 border-r border-gray-200">メールアドレス</th>
                  <td className="py-4 px-6">contact.kaxin@gmail.com</td>
                </tr>
                <tr className="border-b border-gray-200">
                  <th className="py-4 px-6 font-bold text-gray-900 bg-gray-50 border-r border-gray-200">サービス名</th>
                  <td className="py-4 px-6">エンジニア向けインターンプラットフォーム「Tech intern」</td>
                </tr>
                <tr className="border-b border-gray-200">
                  <th className="py-4 px-6 font-bold text-gray-900 bg-gray-50 border-r border-gray-200">販売価格</th>
                  <td className="py-4 px-6">掲載プラン・オプション等に応じて異なります。<br/>料金は各申し込みページに記載します。</td>
                </tr>
                <tr className="border-b border-gray-200">
                  <th className="py-4 px-6 font-bold text-gray-900 bg-gray-50 border-r border-gray-200">商品代金以外の必要料金</th>
                  <td className="py-4 px-6">インターネット接続に伴う通信費（ユーザー負担）</td>
                </tr>
                <tr className="border-b border-gray-200">
                  <th className="py-4 px-6 font-bold text-gray-900 bg-gray-50 border-r border-gray-200">支払方法</th>
                  <td className="py-4 px-6">クレジットカード決済<br/>銀行振込</td>
                </tr>
                <tr className="border-b border-gray-200">
                  <th className="py-4 px-6 font-bold text-gray-900 bg-gray-50 border-r border-gray-200">支払時期</th>
                  <td className="py-4 px-6">申し込み時に表示される支払い条件に従います。</td>
                </tr>
                <tr className="border-b border-gray-200">
                  <th className="py-4 px-6 font-bold text-gray-900 bg-gray-50 border-r border-gray-200">役務の提供時期</th>
                  <td className="py-4 px-6">申込完了後、即時または当社が指定する日時から利用可能になります。</td>
                </tr>
                <tr className="border-b border-gray-200">
                  <th className="py-4 px-6 font-bold text-gray-900 bg-gray-50 border-r border-gray-200">キャンセル・返金について</th>
                  <td className="py-4 px-6">サービスの性質上、掲載後の返金はお受けしておりません。<br/>ただし、システム障害等によりサービス提供が困難な場合は別途協議の上対応します。</td>
                </tr>
                <tr>
                  <th className="py-4 px-6 font-bold text-gray-900 bg-gray-50 border-r border-gray-200">免責事項</th>
                  <td className="py-4 px-6">当社は掲載情報の正確性・信頼性について保証いたしません。<br/>本サービスの利用により発生した損害について、当社は一切責任を負いません。</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    );
};

export const TermsPage: React.FC<StaticPageProps> = ({ onBack }) => {
  return (
    <div className="min-h-screen bg-gray-50 pt-24 pb-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto bg-white p-8 md:p-12 rounded-sm shadow-sm border border-gray-200">
        <button onClick={onBack} className="flex items-center text-gray-500 hover:text-black mb-8 font-bold text-sm">
            <ArrowLeft size={16} className="mr-1"/> HOMEに戻る
        </button>
        
        <h1 className="text-2xl font-black text-gray-900 mb-8">利用規約</h1>
        <div className="prose prose-sm max-w-none text-gray-700">
          <p>この利用規約（以下，「本規約」といいます。）は，KAXIN株式会社（以下，「当社」といいます。）がこのウェブサイト上で提供するサービス（以下，「本サービス」といいます。）の利用条件を定めるものです。登録ユーザーの皆さま（以下，「ユーザー」といいます。）には，本規約に従って，本サービスをご利用いただきます。</p>
          
          <h3>第1条（適用）</h3>
          <p>本規約は，ユーザーと当社との間の本サービスの利用に関わる一切の関係に適用されるものとします。</p>
          
          <h3>第2条（利用登録）</h3>
          <p>登録希望者が当社の定める方法によって利用登録を申請し，当社がこれを承認することによって，利用登録が完了するものとします。</p>

          <h3>第3条（禁止事項）</h3>
          <p>ユーザーは，本サービスの利用にあたり，以下の行為をしてはなりません。</p>
          <ul>
            <li>法令または公序良俗に違反する行為</li>
            <li>犯罪行為に関連する行為</li>
            <li>本サービスの内容等，本サービスに含まれる著作権，商標権ほか知的財産権を侵害する行為</li>
            <li>他人の個人情報，登録情報，利用履歴情報などを，不正に収集，開示または提供する行為</li>
          </ul>

          <p className="text-gray-400 mt-8 text-xs">※ これはサンプルの利用規約です。実際の運用時には法的な確認を行ってください。</p>
        </div>
      </div>
    </div>
  );
};

export const PrivacyPage: React.FC<StaticPageProps> = ({ onBack }) => {
  return (
    <div className="min-h-screen bg-gray-50 pt-24 pb-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto bg-white p-8 md:p-12 rounded-sm shadow-sm border border-gray-200">
        <button onClick={onBack} className="flex items-center text-gray-500 hover:text-black mb-8 font-bold text-sm">
            <ArrowLeft size={16} className="mr-1"/> HOMEに戻る
        </button>

        <h1 className="text-2xl font-black text-gray-900 mb-8">プライバシーポリシー</h1>
        <div className="prose prose-sm max-w-none text-gray-700">
          <p>KAXIN株式会社（以下，「当社」といいます。）は，本ウェブサイト上で提供するサービス（以下，「本サービス」といいます。）における，ユーザーの個人情報の取扱いについて，以下のとおりプライバシーポリシー（以下，「本ポリシー」といいます。）を定めます。</p>
          
          <h3>第1条（個人情報）</h3>
          <p>「個人情報」とは，個人情報保護法にいう「個人情報」を指すものとし，生存する個人に関する情報であって，当該情報に含まれる氏名，生年月日，住所，電話番号，連絡先その他の記述等により特定の個人を識別できる情報を指します。</p>
          
          <h3>第2条（個人情報の収集方法）</h3>
          <p>当社は，ユーザーが利用登録をする際に氏名，生年月日，住所，電話番号，メールアドレス，銀行口座番号，クレジットカード番号，運転免許証番号などの個人情報をお尋ねすることがあります。</p>

          <h3>第3条（個人情報の第三者提供）</h3>
          <p>当社は，次に掲げる場合を除いて，あらかじめユーザーの同意を得ることなく，第三者に個人情報を提供することはありません。</p>

          <h3>第4条（お問い合わせ窓口）</h3>
          <p>本ポリシーに関するお問い合わせは，下記の窓口までお願いいたします。</p>
          <p>
            住所：千葉県流山市東深井451-54-107<br />
            社名：KAXIN株式会社
          </p>
          
          <p className="text-gray-400 mt-8 text-xs">※ これはサンプルのプライバシーポリシーです。実際の運用時には法的な確認を行ってください。</p>
        </div>
      </div>
    </div>
  );
};
