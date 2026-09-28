package domain

import "errors"

var ErrArticleNotFound = errors.New("article not found")

type Article = Post
type CreateArticleRequest = CreatePostRequest
type UpdateArticleRequest = UpdatePostRequest
type DeleteArticleResponse = DeletePostResponse
