# front:
- 公式Doc：https://nextjs.org/docs/app/getting-started/installation
- チートシート？:https://qiita.com/Sicut_study/items/2c9df846e96a47900e6d
- Next on Docker:https://qiita.com/Yasushi-Mo/items/011e021b528b073d7099
1. プロジェクト作成
2. app/page.tsx を作る
3. app/users/page.tsx を作る
4. app/users/[id]/page.tsx を作る
5. layout.tsx で共通レイアウトを作る
6. "use client" のボタンを1個だけ作る
7. app/api/users/route.ts を作る
8. Server ComponentからそのAPIを叩く
9. middleware.ts で /users を保護する
10. 最後にDockerでself-hosted起動する


## Docker環境構築

### Q. なぜ Dockerfile で COPY だけでなく、compose.yml で bind するのか
- **Dockerfile** → Image にコードを焼く（本番用）
- **compose.yml** → 常にホストの最新ファイルを参照（ホットリロード可能、開発用）

### Q. 両方欠けても動くってこと？
- はい、ただし用途が限定される
  - **Dockerfile だけ** → ビルド可能だが、開発中のホットリロードなし
  - **compose.yml だけ** → 開発環境として動作。本番イメージとしては使えない
  - **推奨** → 開発時は compose.yml、本番は Dockerfile から直接ビルド

### Q. --no-cache はいつ使う？
- `docker build --no-cache` を使う場面
  - 本番リリース前の「完全にリセットして再構築」したいとき
  - Dockerfile 変更後、キャッシュの影響が疑わしいとき
  - CI で再現性のあるクリーンビルドを行いたいとき
- **通常の開発** → キャッシュありの方が高速

### Q. stg は開発、prod は本番、で切り分けして OK？
- はい、構成として正しい
  - `compose.yml` → 開発環境（bind mount、`npm run dev`）
  - `compose.prod.yml` → 本番環境（マルチステージビルド、`npm start`）

### Q. bind と volume の違い
| 項目 | bind | volume |
|------|------|--------|
| **ソース** | ホストパス必須 | Docker 管理またはなし |
| **用途** | 開発環境（ホストファイル直接編集） | コンテナ内部データ保持 |
| **ホスト依存** | 高い | 低い |
| **例** | `source: ./front` | `target: /app/node_modules` のみ |

### Q. CMD は Dockerfile で定義か compose.yml で上書きか
- **ルール** → Dockerfile に `CMD` を書き、compose.yml では必要な時だけ上書き
  - Dockerfile が唯一のソース・オブ・トゥルース
  - 開発環境では compose.yml で `command` 上書き（ホットリロード対応）
  - 本番環境では Dockerfile の CMD に従う

### Q. Dockerfile と compose.yml でポートが食い違ったら
- **両方で宣言すべき**
  - Dockerfile の `EXPOSE` → イメージの意図を明確にする
  - compose.yml の `ports` → 実際のポートマッピング
  - 両方揃っていると整合性が取れて保守性向上

# front-Docker環境構築: