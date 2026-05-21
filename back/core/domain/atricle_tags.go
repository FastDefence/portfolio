package domain

import "errors"

var ErrArticleTagNotFound = errors.New("article's tag not found")

type UpdateArticleTagsRequest struct {
	TagIDs []int `json:"tag_ids"`
}
