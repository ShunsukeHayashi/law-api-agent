# 法令APIクライアント

e-Gov法令検索APIへのアクセスを提供するクライアントライブラリです。

## インストール

```bash
npm install law-api-client
```

## 基本的な使用方法

```javascript
import LawAPIClient from './src/api/client.js';

const client = new LawAPIClient();
```

## APIメソッド

### 1. 法令名一覧の取得

```javascript
// 全法令の一覧を取得
const allLaws = await client.getLawList('1');

// 憲法・法律のみ取得
const constitutionLaws = await client.getLawList('2');

// 政令・勅令のみ取得
const cabinetOrders = await client.getLawList('3');

// 府省令・規則のみ取得
const ministerialOrdinances = await client.getLawList('4');
```

### 2. 法令の取得

```javascript
// 法令IDで取得
const lawById = await client.getLaw('123');

// 法令番号で取得
const lawByNumber = await client.getLaw('平成十五年法律第五十七号');
```

### 3. 条文の取得

```javascript
// 条文を取得
const article = await client.getArticles({
  lawId: '123',          // 法令ID
  article: '第一条',     // 条
  paragraph: '1'         // 項
});

// 別表を取得
const appendix = await client.getArticles({
  lawId: '123',
  appdxTable: '別表第一'
});
```

### 4. 更新法令一覧の取得

```javascript
// 指定日の更新法令を取得
const updatedLaws = await client.getUpdateLawList('20240119');
```

## レスポンス形式

### 法令一覧のレスポンス

```javascript
{
  laws: [
    {
      id: "123",
      name: "法令名",
      number: "平成十五年法律第五十七号",
      promulgationDate: "20030619"
    },
    // ...
  ]
}
```

### 法令取得のレスポンス

```javascript
{
  id: "123",
  number: "平成十五年法律第五十七号",
  fullText: "法令の全文...",
  images: [
    {
      data: "Base64エンコードされた画像データ",
      type: "image/png"
    }
  ]
}
```

### 条文取得のレスポンス

```javascript
{
  id: "123",
  number: "平成十五年法律第五十七号",
  article: "第一条",
  paragraph: "1",
  content: "条文の内容...",
  images: [
    {
      data: "Base64エンコードされた画像データ",
      type: "image/png"
    }
  ]
}
```

## エラーハンドリング

```javascript
try {
  const laws = await client.getLawList('1');
} catch (error) {
  if (error.code === 'NOT_FOUND') {
    console.error('該当データが存在しません');
  } else if (error.code === 'SERVER_ERROR') {
    console.error('サーバーエラーが発生しました');
  } else if (error.code === 'MULTIPLE_RESULTS') {
    console.error('複数の候補が存在します');
  }
}
```

## 注意事項

1. 法令番号による取得
   - 法令番号が重複している場合は、法令IDを使用してください
   - 法令番号は正確に指定する必要があります（例：「平成十五年法律第五十七号」）

2. 別表の取得
   - 別表名が長い場合はエラーが発生する可能性があります
   - その場合は別表名を短縮して再試行してください

3. 更新法令一覧
   - 2020年11月24日以降の更新のみ取得可能です
   - 未来の日付は指定できません

4. レスポンスサイズ
   - 大きな法令や多数の図を含む場合、APIの容量制限に達する可能性があります
   - その場合は、より小さな単位（条文単位など）で取得を試みてください

## 開発者向け情報

### デバッグモード

```javascript
const client = new LawAPIClient({
  debug: true  // デバッグログを有効化
});
```

### カスタムエラーハンドリング

```javascript
const client = new LawAPIClient({
  onError: (error) => {
    // カスタムエラーハンドリング
    console.error('APIエラー:', error);
  }
});
```

### リクエストのカスタマイズ

```javascript
const client = new LawAPIClient({
  timeout: 5000,  // タイムアウト設定（ミリ秒）
  retries: 3      // リトライ回数
});
```

## 貢献

1. バグを発見した場合はIssueを作成してください
2. 機能追加や改善の提案も歓迎します
3. プルリクエストを送る前に、テストを追加・実行してください

## ライセンス

MIT