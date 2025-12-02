
import { JobListing, Article } from './types';

export const JOB_LISTINGS: JobListing[] = [
  {
    id: '1',
    title: '文章で人を感動させるライター・コピーライターになろう！第二新卒歓迎',
    company: {
      id: 'c1',
      name: '株式会社NextGen Creative', // Fictional Name
      logoUrl: 'https://picsum.photos/id/64/100/100',
      location: '東京都 港区',
      mission: 'クリエイティブの力で、企業のポテンシャルを解放する',
      description: '日本を代表する大手企業500社以上をクライアントに持ち、ブランディング・マーケティング・広報などの幅広い領域で、企業価値を高める支援を行っています。',
      url: 'https://example.com',
      address: '東京都港区浜松町2-4-1 世界貿易センタービル',
      established: '2020年4月',
      representative: '山田 太郎',
      industry: 'コンサルティング / クリエイティブ',
      coverImage: 'https://picsum.photos/id/1/800/450',
      employees: '120名'
    },
    coverImageUrl: 'https://picsum.photos/id/1/800/450',
    tags: ['ライター', '編集', 'マーケティング', '未経験歓迎'],
    salary: '時給 1,200円〜',
    type: 'Long-term',
    workStyle: 'Hybrid',
    description: `何故、NextGen Creativeに入社したのか？
たまたま前職のコンサルタント時代に知り合ったのが現在のうちの会社でした。その時クライアントであったうちの社長の話を聞いた時の衝撃は今でも忘れられません。行動指針通り仕事をやれば、人生大成功すると確信したからです。
当社は、広告代理店とコンサルティングファームのハイブリッドのような事業展開をしています。
最近は、さらに進化し、その2社を凌駕するようなエキサイティングな仕事もたくさん舞い込んで来て、ワクワクドキドキが止まりません！興味を持たれた方一度遊びに来ませんか？

【なぜやるのか：目先の利益は追わない。お客さまとの長期的な関係性を築くビジネスモデル】

私たちは営業活動をしていません。
目先の利益ではなく、長期的な関係性を築くため、相手の立場に立ち、
感情移入する“親身さ”が私たちの仕事の基本姿勢です。

短期視点ではなく、長期視点で、
「どうすればその企業の課題が解決されるのか」
「価値が伝わるのか」
などを考え、必要なことであれば、すべてを提案します。

一見非合理かもしれませんが、
感謝感動をしていただければ、利益は後からついてきます。
事実、日々新たな相談が色々なテーマでいただきますが、”全てが紹介”によるものになっています。`,
    requiredSkills: ['ライティング', 'コミュニケーション能力'],
    businessContent: `【大手企業に特化した『コンサルティング×クリエイティブ』集団】

500社以上の日本を代表する大手企業だけが、私たちのお客さまです。

ブランディング・マーケティング・広報などの幅広い領域で、
その企業が持つ真の価値や商品サービスを、顧客や社会など企業活動に関わるすべての人たちへ伝え、企業価値をあげることが私たちの仕事です。

企画立案や実行支援を担うコンサルタントだけでなく、
デザイン（Web、動画、グラフィック）・ライティング・テクノロジー（AI、システム）などを扱うクリエイターやエンジニアも在籍しており、
“コンサルティング”だけでなく、“クリエイティブ”までを融合した支援をすることで、
このような拡大を可能にしてきました。

企業の目的はお客さま、従業員、株主、地域社会など、
企業を取り巻く全ての人々を幸せにすることです。

その中でも、最も企業にとって重要な従業員に、
企業の成り立ち、独自の強み、DNAの浸透、ビジョン・方針の浸透、ナレッジの共有などを伝える領域には強みを持っており、支援の実績数は日本トップクラスです。

この領域の質を高めれば高めるほど、企業の全ての組織課題に精通し、
企業活動のリアルな情報が蓄積されていきます。`,
    jobDetail: `就活では、出版業界は狭き門。
新卒では諦めたライターという道を、今一度志してみませんか？
NextGen Creativeのお客様は、日本を代表する大手上場企業500社以上。
ライターは、大手企業の様々なメディアを執筆します。
会社案内、広報誌、商品パンフレット、CSR・IRレポート、 Webサイト、PR映像のナレーションなど、幅広く執筆を手掛けることができます。執筆の種類も、インタビュー記事やコラム、ルポルタージュ調、座談会、社長インタビューなどさまざまです。
育成カリキュラムが整っているので、未経験からでも、プロのライターとして成長することができます。実際に、未経験の第二新卒で入社したライターも活躍しています！
また希望に応じて、編集や企画の仕事にも携わることができます。
自由度高く、最高のクリエイティブを徹底追求していただける環境で、「ライターとして指名され続けるキャリア」を築きませんか？
まずは、オフィスに遊びに来ませんか？
ざっくらばんにお話しましょう！`,
    skillsGained: ['プロフェッショナルなライティングスキル', '大手企業の経営課題への理解', '編集・ディレクション能力'],
    selectionFlow: [
      { step: 1, title: '書類選考', description: 'プロフィールをもとに選考します' },
      { step: 2, title: 'カジュアル面談', description: 'オフィスでざっくばらんにお話しましょう' },
      { step: 3, title: 'インターン開始', description: 'OJT形式でスタート' }
    ]
  },
  {
    id: '2',
    title: 'Go言語を用いた高負荷分散システムのバックエンド開発インターン',
    company: {
      id: 'c2',
      name: 'CyberScale Inc.',
      logoUrl: 'https://picsum.photos/id/60/100/100',
      location: '東京都 港区',
      mission: '世界を繋ぐインフラを創る',
      description: '秒間数百万リクエストを処理するアドテクプラットフォームを運営。パフォーマンスチューニングに強みを持つ技術者集団です。',
      address: '東京都港区六本木6-10-1',
      established: '2018年9月',
      industry: 'アドテクノロジー',
      coverImage: 'https://picsum.photos/id/20/800/450',
      employees: '80名'
    },
    coverImageUrl: 'https://picsum.photos/id/20/800/450',
    tags: ['Go', 'gRPC', 'Kubernetes', 'Microservices'],
    salary: '時給 1,800円〜',
    type: 'Long-term',
    workStyle: 'Hybrid',
    description: '月間1億リクエストを捌く大規模広告配信システムのバックエンド刷新プロジェクト。パフォーマンスチューニングの極意を学べます。',
    requiredSkills: ['Go', 'Docker'],
    businessContent: 'デジタル広告配信プラットフォーム（DSP/SSP）の開発・運営。',
    jobDetail: '・Go言語を用いたAPIサーバーの設計・開発\n・gRPCによるマイクロサービス間通信の実装\n・負荷試験とボトルネックの特定・解消',
    skillsGained: ['高負荷対策のノウハウ', 'マイクロサービスアーキテクチャの設計思想', 'Go言語の深い知識'],
    selectionFlow: [
        { step: 1, title: 'コーディングテスト', description: 'オンラインでアルゴリズムの問題を解いていただきます' },
        { step: 2, title: 'カジュアル面談', description: 'エンジニアとの技術対話' },
        { step: 3, title: '採用', description: '' }
      ]
  },
  {
    id: '3',
    title: 'React/Next.jsを用いたモダンなSaaSプロダクトのフロントエンド開発',
    company: {
      id: 'c3',
      name: 'DesignShift',
      logoUrl: 'https://picsum.photos/id/96/100/100',
      location: '大阪府 大阪市',
      mission: 'デザインの力でビジネスを変える',
      description: 'UI/UXに徹底的にこだわったBtoB SaaSを提供。グッドデザイン賞受賞歴あり。',
      address: '大阪府大阪市北区大深町',
      established: '2021年2月',
      industry: 'SaaS / HR Tech',
      coverImage: 'https://picsum.photos/id/48/800/450',
      employees: '30名'
    },
    coverImageUrl: 'https://picsum.photos/id/48/800/450',
    tags: ['TypeScript', 'React', 'Next.js', 'Tailwind'],
    salary: '時給 1,400円〜',
    type: 'Long-term',
    workStyle: 'Remote',
    description: 'UI/UXに拘った人事労務SaaSの開発。Figmaのデザインを忠実に、かつアクセシブルに実装するスキルが求められます。',
    requiredSkills: ['React', 'TypeScript'],
    businessContent: '人事労務管理SaaS「ShiftHR」の企画・開発。',
    jobDetail: '・Next.js (App Router) を用いたフロントエンド実装\n・Storybookによるコンポーネントカタログの整備\n・アクセシビリティ改善',
    skillsGained: ['モダンフロントエンドのエコシステム', 'ピクセルパーフェクトな実装力', 'アクセシビリティ（WCAG）の知識'],
    selectionFlow: [
        { step: 1, title: 'ポートフォリオ審査', description: '' },
        { step: 2, title: 'カジュアル面談', description: '' }
    ]
  },
  {
    id: '4',
    title: '未経験可！Rustを使ったブロックチェーンコア開発のアシスタント',
    company: {
      id: 'c4',
      name: 'ChainWorks',
      logoUrl: 'https://picsum.photos/id/180/100/100',
      location: '福岡県 福岡市',
      industry: 'Web3 / Blockchain',
      coverImage: 'https://picsum.photos/id/60/800/450',
      employees: '15名'
    },
    coverImageUrl: 'https://picsum.photos/id/60/800/450',
    tags: ['Rust', 'Blockchain', 'Web3'],
    salary: '時給 1,200円〜',
    type: 'Short-term',
    workStyle: 'On-site',
    description: '次世代L1ブロックチェーンのコアロジック実装サポート。低レイヤー技術への深い理解を目指す学生に最適です。',
    requiredSkills: ['C++', 'Rust'],
    businessContent: 'パブリックブロックチェーンの研究開発。',
    jobDetail: '・Rustによるスマートコントラクト実行基盤の実装補助\n・P2Pネットワーク層のテストコード作成',
    skillsGained: ['Rust言語', '分散システムの理論', '暗号技術の基礎'],
    selectionFlow: [
        { step: 1, title: '書類選考', description: '' },
        { step: 2, title: 'カジュアル面談', description: '' }
    ]
  },
  {
    id: '5',
    title: 'Flutterでのヘルスケアアプリ新規立ち上げメンバー募集',
    company: {
      id: 'c5',
      name: 'HealthTech Lab',
      logoUrl: 'https://picsum.photos/id/119/100/100',
      location: '東京都 新宿区',
      industry: 'HealthTech',
      coverImage: 'https://picsum.photos/id/96/800/450',
      employees: '50名'
    },
    coverImageUrl: 'https://picsum.photos/id/96/800/450',
    tags: ['Flutter', 'Dart', 'Firebase', 'Mobile'],
    salary: '時給 1,600円〜',
    type: 'Long-term',
    workStyle: 'Remote',
    description: '人々の健康を支える新規アプリの立ち上げ。企画段階から実装、リリースまでを一貫して経験できます。',
    requiredSkills: ['Flutter', 'Mobile Dev'],
    businessContent: '予防医療領域のモバイルアプリ開発。',
    jobDetail: '・Flutterを用いたiOS/Androidアプリのクロスプラットフォーム開発\n・Firebaseを用いたバックエンドレスなアーキテクチャ構築',
    skillsGained: ['モバイルアプリのリリース経験', 'UI設計スキル', 'Firebase活用術'],
    selectionFlow: [
        { step: 1, title: 'カジュアル面談', description: '' },
        { step: 2, title: 'ハッカソン選考', description: '1day' }
    ]
  },
  {
    id: '6',
    title: '【急募】Unityエンジニア！メタバース空間の演出・ギミック実装',
    company: {
      id: 'c6',
      name: 'VirtualX',
      logoUrl: 'https://picsum.photos/id/160/100/100',
      location: '東京都 渋谷区',
      industry: 'Metaverse / VR',
      coverImage: 'https://picsum.photos/id/180/800/450',
      employees: '20名'
    },
    coverImageUrl: 'https://picsum.photos/id/180/800/450',
    tags: ['Unity', 'C#', 'VR/AR', '3D'],
    salary: '時給 1,500円〜',
    type: 'Short-term',
    workStyle: 'Hybrid',
    description: '大規模メタバースイベントの空間設計とインタラクション実装。ゲーム開発経験を活かして新しい領域に挑戦しませんか？',
    requiredSkills: ['Unity', 'C#'],
    businessContent: 'VRイベントプラットフォームの企画・運営。',
    jobDetail: '・Unityを用いた3D空間の構築\n・アバターのインタラクション実装\n・シェーダー開発',
    skillsGained: ['3D数学', 'オンラインゲームの同期技術', 'C#上級スキル'],
    selectionFlow: [
        { step: 1, title: 'ポートフォリオ選考', description: '作品提出必須' },
        { step: 2, title: 'カジュアル面談', description: '' }
    ]
  },
];

export const ARTICLES: Article[] = [
  {
    id: 1,
    title: '未経験からAIエンジニアへ。長期インターンで学ぶべきこととは？',
    date: '2024.04.12',
    category: 'CAREER',
    image: 'https://picsum.photos/id/101/600/400',
    content: `
      <h2>AIエンジニアへの第一歩</h2>
      <p>AI（人工知能）技術の急速な発展に伴い、AIエンジニアの需要はかつてないほど高まっています。しかし、未経験からこの分野に飛び込むのはハードルが高いと感じる方も多いのではないでしょうか。実は、長期インターンシップこそが、その第一歩を踏み出す最適な環境なのです。</p>
      
      <h3>なぜインターンが有効なのか</h3>
      <p>大学の講義や独学では、理論的な知識は身についても、実際のビジネス課題を解決する「実践的なスキル」は身につきにくいものです。インターンシップでは、実際のデータセットを扱い、先輩エンジニアのコードレビューを受けながら、モデルの構築からデプロイまでの一連のプロセスを経験できます。</p>

      <h3>学ぶべき3つのこと</h3>
      <ul>
        <li><strong>Pythonとライブラリの習熟：</strong> PyTorchやTensorFlow、Pandasなどの必須ツールを使いこなす力。</li>
        <li><strong>データ前処理の泥臭さ：</strong> 綺麗なデータばかりではありません。欠損値の処理やアノテーションなど、地味だが重要な作業を知ること。</li>
        <li><strong>ビジネス視点：</strong> 精度が高いモデルを作ることだけが正解ではありません。「そのモデルでどれだけコスト削減できたか」「UXがどう向上したか」という視点を持つことが重要です。</li>
      </ul>

      <p>Tech internでは、メンターがつくAI企業のインターンシップを多数掲載しています。まずは「未経験歓迎」のタグから探してみてください。</p>
    `
  },
  {
    id: 2,
    title: '【25卒・26卒】メガベンチャー内定者が語る、Githubプロフィールの作り方',
    date: '2024.04.10',
    category: 'SKILL',
    image: 'https://picsum.photos/id/180/600/400',
    content: `
      <h2>Githubはあなたの履歴書です</h2>
      <p>エンジニア就活において、履歴書以上に重要視されるのがGithubのプロフィールです。採用担当者は、あなたが「どんなコードを書くか」「どれくらいコミットしているか（草が生えているか）」を見ています。</p>

      <h3>プロフィールを魅力的にするポイント</h3>
      <p>ただリポジトリを公開するだけでは不十分です。README.mdをしっかり書き込みましょう。</p>
      <ul>
        <li><strong>デモGifを載せる：</strong> 動いている様子が一目でわかるようにしましょう。</li>
        <li><strong>技術選定の理由を書く：</strong> なぜReactを選んだのか？なぜGoなのか？その思考プロセスが評価されます。</li>
        <li><strong>苦労した点と解決策：</strong> 開発中に直面したバグや課題をどう乗り越えたか、ストーリーとして記述します。</li>
      </ul>

      <p>日々の積み重ねが、あなたの技術力を証明する最強の武器になります。今日から少しずつプロフィールを充実させていきましょう。</p>
    `
  },
  {
    id: 3,
    title: 'リモートインターンのリアル。コミュニケーションの課題と解決策',
    date: '2024.04.05',
    category: 'WORK STYLE',
    image: 'https://picsum.photos/id/1/600/400',
    content: `
      <h2>リモートワークの光と影</h2>
      <p>通勤時間がなく、学業との両立がしやすいリモートインターン。非常に人気がありますが、一方で「質問しづらい」「孤独を感じる」という課題もあります。</p>
      
      <h3>テキストコミュニケーションの極意</h3>
      <p>顔が見えない分、テキストでのコミュニケーション能力が問われます。「質問力」を磨きましょう。</p>
      <p>悪い例：「エラーが出ました。どうすればいいですか？」</p>
      <p>良い例：「〇〇の実装中に××というエラーが出ました。△△までは確認しましたが、□□の原因が特定できません。見解をいただけますか？」</p>

      <p>状況、試したこと、仮説をセットで伝えることで、メンターも答えやすくなります。また、Slackでのスタンプ反応や、適度な雑談チャンネルへの参加も、チームに馴染むための重要な要素です。</p>
    `
  },
  {
    id: 4,
    title: 'Go言語の需要が急上昇中？バックエンドエンジニアのキャリア戦略',
    date: '2024.04.01',
    category: 'TREND',
    image: 'https://picsum.photos/id/20/600/400',
    content: `
      <h2>なぜ今、Go言語なのか</h2>
      <p>マイクロサービス化が進むWeb業界において、パフォーマンスと開発効率を両立するGo言語（Golang）の採用事例が急増しています。特にメルカリなどのメガベンチャーが採用したことで、国内での人気が不動のものとなりました。</p>

      <h3>バックエンドエンジニアとしての市場価値</h3>
      <p>PHPやRubyからの移行プロジェクトや、新規のコンテナベースの開発において、Goエンジニアは引く手あまたです。静的型付けによる堅牢性と、並行処理の容易さが、大規模システムに適しているからです。</p>
      
      <p>学生のうちにGo言語を習得し、並行処理やAPI設計の基礎を身につけておけば、就活において強力な差別化要因となります。Tech internでも、Go言語を使用するインターン求人が増えています。ぜひ挑戦してみてください。</p>
    `
  },
];
