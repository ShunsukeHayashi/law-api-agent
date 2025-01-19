# 法令API プロジェクト

このプロジェクトは、e-Gov法令検索APIを利用して法令情報にアクセスし、AIを活用して法的アドバイスを提供するシステムです。

## プロジェクト構成

```
.
├── src/
│   ├── api/           # APIクライアント実装
│   ├── config/        # 設定ファイル
│   └── services/      # サービス実装
│       ├── agent/     # AIエージェント
│       └── administrativeSupport/  # 行政手続きサポート
├── docs/              # ドキュメント
├── examples/          # 使用例
└── tests/             # テストファイル
```

## 主要コンポーネント

### 1. 法令APIクライアント

e-Gov法令検索APIへのアクセスを提供する基本クライアントライブラリです。

- [クライアントライブラリのドキュメント](./client.md)
- [APIの仕様](../openapi.yaml)

### 2. 法令サポートエージェント

自然言語での質問に対して、法令情報とAIを活用して回答を提供します。

- [エージェントのドキュメント](./agent.md)
- [使用例](../examples/lawAgent.js)

### 3. 行政手続きサポート

会社設立などの具体的な行政手続きをサポートします。

- [行政手続きサポートのドキュメント](./administrativeSupport.md)
- [使用例](../examples/companyEstablishment.js)

## セットアップ

1. 環境変数の設定:
```bash
cp .env.example .env
```

2. 必要な環境変数:
```
OPENAI_API_KEY=your_api_key_here
```

3. 依存関係のインストール:
```bash
npm install
```

## 使用例

### 基本的な法令検索

```javascript
import LawAPIClient from './src/api/client.js';

const client = new LawAPIClient();

// 法令一覧の取得
const laws = await client.getLawList();

// 特定の法令の取得
const law = await client.getLaw('平成十五年法律第五十七号');
```

### AIエージェントを使用した法的アドバイス

```javascript
import LawSupportAgent from './src/services/agent/agent.js';

const agent = new LawSupportAgent();

// 会社設立に関する質問
const result = await agent.run('株式会社設立に必要な手続きを教えてください', {
  companyType: '株式会社',
  capital: 10000000,
  purpose: 'IT事業'
});

console.log('アドバイス:', result.data.advice);
console.log('リスクレベル:', result.data.riskLevel);
console.log('参照法令:', result.data.references);
```

## 開発

### テスト

```bash
# 全てのテストを実行
npm test

# 特定のテストを実行
npm test tests/agent.test.js
```

### リント

```bash
npm run lint
```

### フォーマット

```bash
npm run format
```

## API仕様

このプロジェクトは以下のe-Gov法令検索APIエンドポイントを使用しています：

1. 法令名一覧取得API (`/lawlists/{lawType}`)
2. 法令取得API (`/lawdata/{lawIdOrNum}`)
3. 条文内容取得API (`/articles`)
4. 更新法令一覧取得API (`/updatelawlists/{date}`)

詳細な仕様は[OpenAPI仕様書](../openapi.yaml)を参照してください。

## 注意事項

1. このシステムが提供する情報は参考情報であり、法的な判断や意思決定の代わりとはなりません。

2. 重要な法的判断には、必ず専門家（弁護士、税理士、行政書士など）に相談してください。

3. APIの利用には制限があります：
   - 更新法令一覧は2020年11月24日以降のみ取得可能
   - 未来の日付での検索は不可
   - 法令番号が重複している場合は法令IDを使用する必要あり

## ライセンス

MIT

## コントリビューション

1. Issueを作成して変更内容を説明
2. フォークしてブランチを作成
3. 変更を加えてテストを実行
4. プルリクエストを作成

## サポート

問題や質問がある場合は、GitHubのIssueを作成してください。