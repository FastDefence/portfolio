package domain

type Post struct {
	ID        int    `json:"id"`
	Title     string `json:"title"`
	Text      string `json:"text"`
	CreatedAt string `json:"created_at"`
	UpdatedAt string `json:"updated_at"`
}

type CreatePostRequest struct {
	Title string `json:"title"`
	Text  string `json:"text"`
}

type UpdatePostRequest struct {
	Title string `json:"title"`
	Text  string `json:"text"`
}

type DeletePostResponse struct {
	ID      int    `json:"id"`
	Message string `json:"message"`
}
