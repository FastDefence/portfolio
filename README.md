ポートフォリオサイトです。

front: Next.js
admin: Next.js
back: Go
DB: Mysql

front: 公開用ポートフォリオサイト。
admin: 記事の追加や削除など。
api: api/api.mdに仕様が記載。

## 環境変数

環境変数はプロジェクトルートの `.env` で一元管理します。
初回は `.env.example` を `.env` にコピーし、必要な値を変更してください。
`user`、`admin`、`api`、MySQL には各 Compose ファイルからルートの
`.env` が渡されます。

```powershell
Copy-Item .env.example .env
docker compose -f compose.yml up --build
```

バックエンドを単体で起動する場合も、ルートの `.env` が読み込まれます。

```powershell
Set-Location api
go run .
```
