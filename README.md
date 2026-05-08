front:
- 公式Doc：https://nextjs.org/docs/app/getting-started/installation
- チートシート？:https://qiita.com/Sicut_study/items/2c9df846e96a47900e6d
- Next on Docker:https://qiita.com/Yasushi-Mo/items/011e021b528b073d7099

- Q. なぜDockerfileでCOPYだけでなく、compose.ymlでbindするのか
  - Dockerfile:Imageにコードを焼く、本番用
  - compose.yml:常に参照できる、ホットリロード可能、検証用