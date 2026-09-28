package domain

import "errors"

var ErrReferenceNotFound = errors.New("reference not found")

type Reference struct {
	ID        int    `json:"id"`
	ArticleID int    `json:"article_id"`
	Title     string `json:"title"`
	URL       string `json:"url"`
	CreatedAt string `json:"created_at"`
	UpdatedAt string `json:"updated_at"`
}

type CreateReferenceRequest struct {
	Title string `json:"title"`
	URL   string `json:"url"`
}

type UpdateReferenceRequest struct {
	Title string `json:"title"`
	URL   string `json:"url"`
}

type DeleteReferenceResponse struct {
	ID      int    `json:"id"`
	Message string `json:"message"`
}
