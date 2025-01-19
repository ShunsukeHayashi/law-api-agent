# e-Gov法令検索APIクライアント

e-Gov法令検索APIのNode.js用クライアントライブラリです。

## インストール

```bash
npm install law-api-client
```

## 環境変数の設定

1. プロジェクトのルートディレクトリに `.env` ファイルを作成します。
2. 以下の環境変数を設定します：

```bash
OPENAI_API_KEY=your_api_key_here
```

注意: `.env` ファイルはGitにコミットされません。セキュリティのため、APIキーは必ず環境変数として管理してください。

## 使用方法

```javascript
import LawAPIClient from 'law-api-client';

const client = new LawAPIClient();

// 法令名一覧の取得
const laws = await client.getLawList();

// 特定の種別の法令一覧を取得
const constitutionLaws = await client.getLawList('2'); // 憲法・法律

// 法令の取得（法令IDまたは法令番号で指定）
const law = await client.getLaw('123');
const lawByNumber = await client.getLaw('平成十五年法律第五十七号');

// 条文の取得
const article = await client.getArticles({
  lawId: '123',
  article: '第一条',
  paragraph: '1'
});

// 更新された法令一覧の取得
const updatedLaws = await client.getUpdateLawList('2024-01-19');
```

## APIの種類

### 1. 法令名一覧取得API
- 公布済み現行法令の法令ID、名称、法令番号及び公布年月日を取得
- 法令種別で絞り込み可能（全法令、憲法・法律、政令・勅令、府省令）

### 2. 法令取得API
- 施行中の現行法令の全文を取得
- 本文中の図も取得可能

### 3. 条文内容取得API
- 指定した条件（法令番号/法令ID、条、項、別表）に合致する法令の内容を取得
- 本文中の図も取得可能

### 4. 更新法令一覧取得API
- 指定した日付に更新された法令の一覧を取得
- 2020年11月24日以降の更新のみ取得可能

## エラーハンドリング

```javascript
try {
  const laws = await client.getLawList();
} catch (error) {
  if (error.message === ERROR_MESSAGES.NOT_FOUND) {
    console.error('該当データが存在しません');
  } else if (error.message === ERROR_MESSAGES.SERVER_ERROR) {
    console.error('サーバーエラーが発生しました');
  }
}
```

## 注意事項

1. 法令番号が重複している法令は、条文内容取得APIで法令番号をパラメータに指定して取得することができません。代わりに法令IDを使用してください。

2. 条文内容取得APIで別表を取得する際、URI パラメータに指定する別表名が長すぎる場合は「Request Rejected」エラーが返される場合があります。その場合は別表名を短縮して再試行してください。

3. 更新法令一覧取得APIは2020年11月24日以降の更新のみ取得可能です。また、未来の日付は指定できません。

## 開発

```bash
# 環境変数の設定
cp .env.example .env
# .envファイルを編集してAPIキーを設定

# テストの実行
npm test

# 継続的なテスト実行
npm run test:watch

# リントの実行
npm run lint

# コードのフォーマット
npm run format
```

## ライセンス

MIT
# law-api-agent
