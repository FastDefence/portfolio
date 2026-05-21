# DB literals
mysql> show tables;
+------------------------+
| Tables_in_portfolio_db |
+------------------------+
| article_references     |
| article_tags           |
| articles               |
| tags                   |
+------------------------+
4 rows in set (0.05 sec)

mysql> select * from articles;
+----+-------+------+---------------------+---------------------+
| id | title | text | created_at          | updated_at          |
+----+-------+------+---------------------+---------------------+
|  1 | title | text | 2026-05-21 04:18:55 | 2026-05-21 04:18:55 |
|  2 | title | text | 2026-05-21 09:51:36 | 2026-05-21 09:51:36 |
+----+-------+------+---------------------+---------------------+
2 rows in set (0.00 sec)

mysql> select * from tags;
+----+-----------+---------------------+---------------------+
| id | name      | created_at          | updated_at          |
+----+-----------+---------------------+---------------------+
|  2 | Yamaokaya | 2026-05-21 03:44:35 | 2026-05-21 03:44:35 |
|  3 | Ramenu    | 2026-05-21 04:18:06 | 2026-05-21 04:43:59 |
|  5 | Ramene    | 2026-05-21 04:57:55 | 2026-05-21 04:57:55 |
+----+-----------+---------------------+---------------------+
3 rows in set (0.00 sec)

mysql> select * from article_tags;
+------------+--------+
| article_id | tag_id |
+------------+--------+
|          1 |      2 |
|          1 |      3 |
|          2 |      3 |
+------------+--------+
3 rows in set (0.00 sec)

mysql> select * from article_references;
+----+------------+-------+--------------------------------------+---------------------+---------------------+
| id | article_id | title | url                                  | created_at          | updated_at          |
+----+------------+-------+--------------------------------------+---------------------+---------------------+
|  2 |          1 | ???   | https://www.instagram.com/takeokaya/ | 2026-05-21 10:26:06 | 2026-05-21 10:26:06 |
|  3 |          1 | ???   | https://www.yamaokaya.com/           | 2026-05-21 10:26:39 | 2026-05-21 10:26:39 |
+----+------------+-------+--------------------------------------+---------------------+---------------------+
2 rows in set (0.00 sec)

# DB Schemes
## articles
| id | title | text | created_at | updated_at |
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
クエリパラメーターがついていれば、記事をタイトル、本文ベースで検索する。
**`Invoke-RestMethod -Method Get -Uri "http://localhost:8080/articles[?keyword=text]"`**

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
クエリパラメーターがついていてば、タグを検索する。
**動作確認:`Invoke-RestMethod -Method Get -Uri "http://localhost:8080/tags[?name=text]"`**

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
- `GET /articles/:id/tags`　**articleに紐づいたtagの取得**  
Paramでarticle idを送り、articleに紐づいているTag[]型のJSONを返す。  
**動作確認:** `Invoke-RestMethod -Method Get -Uri "http://localhost:8080/articles/1/tags"`

- `PUT /articles/:id/tags`　**articleに紐づくtag一覧の更新**  
UpdateArticleTagsRequest型JSONでタグid配列を送り、更新後にarticleに紐づいているTag[]型のJSONを返す。  
bodyなしの場合は400 Bad Requestを返す。  
`tag_ids: []` の場合は、articleに紐づくtagをすべて解除する。  
**動作確認:** `Invoke-RestMethod -Method Put -Uri "http://localhost:8080/articles/1/tags" -ContentType "application/json" -Body (@{ tag_ids = @(1) } | ConvertTo-Json)`

メモ
記事編集画面を開く
↓
GET /articles/:id/tags
現在その記事に紐づいているタグ一覧を取得
↓
GET /tags?name=xxx
タグ候補を検索
↓
画面上で tags 配列を編集
↓
PUT /articles/:id/tags
変更後の tag_ids をまとめて送る

### references
- `GET /articles/:id/references`　**articleに紐づくreference取得**  
Paramでarticle idを送り、articleに紐づくReference[]型のJSONを返す。  
**動作確認:** `Invoke-RestMethod -Method Get -Uri "http://localhost:8080/articles/1/references"`

- `POST /articles/:id/references`　**articleに紐づくreference新規追加**  
CreateReferenceRequest型JSONでtitleとurlを送り、Reference型のJSONを返す。  
**動作確認:** `Invoke-RestMethod -Method Post -Uri "http://localhost:8080/articles/1/references" -ContentType "application/json" -Body (@{ title = "山岡家"; url = "https://www.yamaokaya.com/" } | ConvertTo-Json)`

- `PATCH /references/:id`　**reference編集**  
UpdateReferenceRequest型JSONでtitleとurlを送り、Reference型のJSONを返す。  
**動作確認:** `Invoke-RestMethod -Method Patch -Uri "http://localhost:8080/references/1" -ContentType "application/json" -Body (@{ title = "山岡家 公式"; url = "https://www.yamaokaya.com/" } | ConvertTo-Json)`

- `DELETE /references/:id`　**reference削除**  
Paramでreference idを送り、削除結果を表すDeleteReferenceResponse型のJSONを返す。  
**動作確認:** `Invoke-RestMethod -Method Delete -Uri "http://localhost:8080/references/1"`

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
