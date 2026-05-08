#!/bin/bash

# Next.js プロジェクトの環境構築スクリプト

echo "Next.js 環境構築を開始します..."

# package.json が存在するか確認
if [ ! -f "front/package.json" ]; then
  echo "front/package.json が存在しません。Next.js プロジェクトを作成します..."

  # Next.js プロジェクト作成
  npx create-next-app@latest front --typescript --tailwind --eslint --app --src-dir --import-alias "@/*" --yes

  # 不要なファイルを削除
  rm -rf front/.git front/README.md

  echo "Next.js プロジェクト作成完了"
else
  echo "front/package.json が既に存在します。設定ファイルを更新します..."
fi

# next.config.js をカスタマイズ
cat > front/next.config.js << 'EOF'
/** @type {import('next').NextConfig} */
const nextConfig = {
  /* config options here */
  reactCompiler: true,
};

module.exports = nextConfig;
EOF

echo "環境構築完了！"
echo "Docker コンテナを起動してください："
echo "docker-compose up --build"