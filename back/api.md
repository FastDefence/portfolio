# DB Schemes
## articles
| id | published | title | text |
| ---- | ---- | ---- | ---- |
| 1 | 2026-05-18 | 山岡家背油トッピング | ## 山岡家は食べ過ぎると腹壊します。\n\n| tokuseimiso |\n| --- |\n| 特製味噌 |\n\n![山岡家のラーメン](https://images.unsplash.com/photo-1569718212165-3a8278d5f624)\n\n背脂トッピングは満足度が高いですが、食べすぎ注意です。\n |

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
GET    /articles　article全件取得
GET    /articles/:id　article id指定取得
POST   /articles　article新規追加
PATCH  /articles/:id　article編集
DELETE /articles/:id　article削除

### tags
GET    /tags　tag全権取得
POST   /tags　tag新規追加
PATCH  /tags/:id　tag編集
DELETE /tags/:id　tag削除

### article_tags
GET    /articles/:id/tags　articleに紐づいたtagの取得
PUT    /articles/:id/tags　articleに紐づくtag一覧の更新
DELETE　/articles/:article_id/tags/:tag_id　articleに紐づくtagの中から、idを指定して削除

### references
GET    /articles/:id/references　articleに紐づくreferenceの取得
POST   /articles/:id/references　articleに紐づくreferenceの新規追加
PATCH  /references/:id　referenceの編集
DELETE /references/:id　referenceの削除

# DTO
    {
        id: 1,
        tags: ["Ramen", "Yamaokaya"],
        published: "2026-05-18",
        references : [
            {
                title: "山岡家",
                url: "https://www.yamaokaya.com/"
            },
        ],
        title: "山岡家背油トッピング",
        text: "## 山岡家は食べ過ぎると腹壊します。\n\n| tokuseimiso |\n| --- |\n| 特製味噌 |\n\n![山岡家のラーメン](https://images.unsplash.com/photo-1569718212165-3a8278d5f624)\n\n背脂トッピングは満足度が高いですが、食べすぎ注意です。\n",
    },
