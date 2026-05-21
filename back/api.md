# DB Schemes
## articles
| id | title | text | created | updated |
| ---- | ---- | ---- | ---- | ---- |
| 1 | 山岡家背油トッピング | Markdown | 2026-05-18 | 2026-05-20 |

## tags
| id | name |
| ---- | ---- |
| 1 | Ramen | 
| 2 | Yamaokaya |

## article_tags
| article_id | tag_id |
| ---- | ---- |
| 1 | 1 |
| 1 | 2 |

## references
| id | article_id | title | url |
| ---- | ---- | ---- | ---- |
| 1 | 1 | 山岡家 | https://www.yamaokaya.com/ |

# APIs
### articles
- `GET /articles`　**article全件取得**
Article[]型のJSONを返す。
**`Invoke-RestMethod -Method Get -Uri "http://localhost:8080/articles"`**

- `GET /articles/:id`　**article id指定取得**
Paramでidを送り、Article型のJSONを返す。
**動作確認:`Invoke-RestMethod -Method Get -Uri "http://localhost:8080/articles/1"`**

- `POST /articles`　**article新規追加**
CreateArticleRequest型のJSONでタイトルと本文を送り、Article型のJSONを返す。
**動作確認:`Invoke-RestMethod -Method Post -Uri "http://localhost:8080/articles" -ContentType "application/json" -Body (@{ title = "title"; text = "text" } | ConvertTo-Json)`**

- `PATCH /articles/:id`　**article編集**
UpdateArticleRequest型JSONでタイトルと本文を送り、Article型のJSONを返す。
**動作確認:`Invoke-RestMethod -Method Patch -Uri "http://localhost:8080/articles/1" -ContentType "application/json" -Body (@{ title = "updated title"; text = "updated text" } | ConvertTo-Json)`**

- `DELETE /articles/:id`　**article削除**
Paramでidを送り、削除結果を表すDeleteArticleResponse型のJSONを返す。
**動作確認:`Invoke-RestMethod -Method Delete -Uri "http://localhost:8080/articles/1"`**

### tags
- `GET /tags`　**tag全件取得**
Tag[]型のJSONを返す。
**動作確認:`Invoke-RestMethod -Method Get -Uri "http://localhost:8080/tags"`**

- `GET /tags/:id`　**tag id指定取得**
Paramでidを送り、Tag型のJSONを返す。
**動作確認:`Invoke-RestMethod -Method Get -Uri "http://localhost:8080/tags/1"`**

- `POST /tags`　**tag新規追加**
CreateTagRequest型JSONでタグの名前を送り、Tag型のJSONを返す。
**動作確認:`Invoke-RestMethod -Method Post -Uri "http://localhost:8080/tags" -ContentType "application/json" -Body (@{ name = "name" } | ConvertTo-Json)`**

- `PATCH /tags/:id`　**tag編集**
UpdateTagRequest型JSONでタグの名前を送り、Tag型のJSONを返す。
**動作確認:`Invoke-RestMethod -Method Patch -Uri "http://localhost:8080/tags/1" -ContentType "application/json" -Body (@{ name = "updated name" } | ConvertTo-Json)`**

- `DELETE /tags/:id`　**tag削除**
Paramでidを送り、削除結果を表すDeleteTagResponse型のJSONを返す。
**動作確認:`Invoke-RestMethod -Method Delete -Uri "http://localhost:8080/tags/1"`**

### article_tags
`GET /articles/:id/tags`　**articleに紐づいたtagの取得**
`PUT /articles/:id/tags`　**articleに紐づくtag一覧の更新**
`DELETE /articles/:article_id/tags/:tag_id`　**articleに紐づくtagの中から、idを指定して削除**

### references
`GET /articles/:id/references`　**articleに紐づくreferenceの取得**
`POST /articles/:id/references`　**articleに紐づくreferenceの新規追加**
`PATCH /references/:id`　**referenceの編集**
`DELETE /references/:id`　**referenceの削除**

# DTO
    {
        id: 1,
        tags: ["Ramen", "Yamaokaya"],
        references : [
            {
                title: "山岡家",
                url: "https://www.yamaokaya.com/"
            },
        ],
        title: "山岡家背油トッピング",
        text: "## 山岡家は食べ過ぎると腹壊します。\n\n| tokuseimiso |\n| --- |\n| 特製味噌 |\n\n![山岡家のラーメン](https://images.unsplash.com/photo-1569718212165-3a8278d5f624)\n\n背脂トッピングは満足度が高いですが、食べすぎ注意です。\n",
        created: "2025-05-19",
        updated: "2025-05-20",
    },
