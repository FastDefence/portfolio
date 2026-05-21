package domain

import "errors"

var ErrTagNotFound = errors.New("tag not found")

type Tag struct {
	ID        int    `json:"id"`
	Name      string `json:"name"`
	CreatedAt string `json:"created_at"`
	UpdatedAt string `json:"updated_at"`
}

type CreateTagRequest struct {
	Name string `json:"name"`
}

type UpdateTagRequest struct {
	Name string `json:"name"`
}

type DeleteTagResponse struct {
	ID      int    `json:"id"`
	Message string `json:"message"`
}
