# 行政手続きサポート

行政手続きサポートは、会社設立などの具体的な行政手続きをガイドし、必要な書類や手順を提供するサービスです。

## 主な機能

- 会社設立手続きのガイド
- 必要書類の生成
- 手続きの進捗管理
- リスク評価とアドバイス

## 使用方法

```javascript
import { AdministrativeSupport } from '../src/services/administrativeSupport.js';

const support = new AdministrativeSupport();
```

### 1. 会社設立サポート

```javascript
// 会社設立の手続き開始
const establishment = await support.startCompanyEstablishment({
  companyType: '株式会社',
  companyName: 'テック株式会社',
  capital: 10000000,
  purpose: [
    'ソフトウェアの開発及び販売',
    'ITコンサルティング',
    'システム開発'
  ],
  address: {
    prefecture: '東京都',
    city: '千代田区',
    street: '丸の内1-1-1'
  },
  representatives: [
    {
      role: '代表取締役',
      name: '山田太郎',
      address: '東京都港区...'
    }
  ]
});

// 進捗状況の確認
const progress = await establishment.checkProgress();
console.log('現在の進捗:', progress.currentStep);
console.log('次のステップ:', progress.nextStep);

// 必要書類の生成
const documents = await establishment.generateDocuments();
```

### 2. 定款作成

```javascript
// 定款の生成
const articles = await support.generateArticlesOfIncorporation({
  companyName: 'テック株式会社',
  purpose: [
    'ソフトウェアの開発及び販売',
    'ITコンサルティング'
  ],
  capital: 10000000,
  fiscalYearEnd: '3月31日'
});

// 定款の検証
const validation = await support.validateArticles(articles);
if (validation.isValid) {
  console.log('定款は正常です');
} else {
  console.log('修正が必要な項目:', validation.errors);
}
```

### 3. 登記申請サポート

```javascript
// 登記申請書類の準備
const registrationDocs = await support.prepareRegistrationDocuments({
  companyInfo: establishment.companyInfo,
  articles: articles
});

// 必要な添付書類のチェックリスト
const checklist = await support.getRequiredDocumentsChecklist();
```

## レスポンス形式

### 会社設立進捗状況

```javascript
{
  status: 'in_progress',
  currentStep: '定款作成',
  nextStep: '公証人役場での認証',
  completedSteps: [
    '会社情報の登録',
    '事業目的の設定'
  ],
  remainingSteps: [
    '公証人役場での認証',
    '登記申請',
    '各種届出'
  ],
  documents: {
    completed: ['定款', '印鑑証明書'],
    pending: ['登記申請書', '就任承諾書']
  }
}
```

### 必要書類リスト

```javascript
{
  required: [
    {
      name: '定款',
      status: 'completed',
      notes: '原本2通必要'
    },
    {
      name: '印鑑証明書',
      status: 'pending',
      notes: '発行から3ヶ月以内のもの'
    }
  ],
  optional: [
    {
      name: '本店所在地証明書',
      status: 'not_required',
      conditions: '賃貸物件の場合は必要'
    }
  ]
}
```

## エラーハンドリング

```javascript
try {
  const establishment = await support.startCompanyEstablishment(companyInfo);
} catch (error) {
  if (error.code === 'INVALID_COMPANY_NAME') {
    console.error('会社名が無効です:', error.details);
  } else if (error.code === 'INSUFFICIENT_CAPITAL') {
    console.error('資本金が不足しています:', error.details);
  }
}
```

## 注意事項

1. 書類の有効期限
   - 印鑑証明書：発行から3ヶ月以内
   - 住民票：発行から3ヶ月以内
   - 定款認証：認証から3ヶ月以内に登記申請

2. 資本金に関する制限
   - 株式会社：1円以上
   - 合同会社：1円以上
   - 特例有限会社：300万円以上

3. 本店所在地
   - バーチャルオフィスを使用する場合は追加書類が必要
   - 住居を本店所在地とする場合は所有者の承諾書が必要

4. 取締役の要件
   - 株式会社：1名以上
   - 監査役設置会社：3名以上
   - 社外取締役が必要な場合あり

## 開発者向け情報

### カスタマイズ

```javascript
const support = new AdministrativeSupport({
  documentTemplates: customTemplates,
  validationRules: customRules,
  progressTracking: customTracker
});
```

### テスト

```bash
# 特定のテストの実行
npm test tests/administrativeSupport.test.js

# 会社設立関連のテストのみ実行
npm test tests/administrativeSupport.test.js -t "会社設立"
```

## 法的免責事項

このサービスは情報提供を目的としており、法的なアドバイスを構成するものではありません。実際の手続きでは、必ず専門家（弁護士、税理士、行政書士など）に相談することをお勧めします。