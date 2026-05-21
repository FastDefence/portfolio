package domain

import "errors"

var ErrArticleNotFound = errors.New("article not found")

type Article struct {
	ID        int    `json:"id"`
	Title     string `json:"title"`
	Text      string `json:"text"`
	CreatedAt string `json:"created_at"`
	UpdatedAt string `json:"updated_at"`
}

type CreateArticleRequest struct {
	Title string `json:"title"`
	Text  string `json:"text"`
}

type UpdateArticleRequest struct {
	Title string `json:"title"`
	Text  string `json:"text"`
}

type DeleteArticleResponse struct {
	ID      int    `json:"id"`
	Message string `json:"message"`
}
