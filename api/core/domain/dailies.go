package domain

import "errors"

var ErrDailyNotFound = errors.New("daily not found")

type Daily = Post
type CreateDailyRequest = CreatePostRequest
type UpdateDailyRequest = UpdatePostRequest
type DeleteDailyResponse = DeletePostResponse
