package repository

import (
	"database/sql"

	"portfolio-back/core/domain"
)

type postKind string

const (
	postKindArticle postKind = "article"
	postKindDaily   postKind = "daily"
)

type postRepository struct {
	db *sql.DB
}

func newPostRepository(db *sql.DB) *postRepository {
	return &postRepository{db: db}
}

func (repository *postRepository) findAll(kind postKind, keyword string) ([]domain.Post, error) {
	query := `
		SELECT id, title, text,
			DATE_FORMAT(created_at, '%Y-%m-%d') AS created_at,
			DATE_FORMAT(updated_at, '%Y-%m-%d') AS updated_at
		FROM posts
		WHERE kind = ?
	`
	args := []any{kind}
	if keyword != "" {
		query += ` AND (title LIKE ? OR text LIKE ?)`
		likeKeyword := "%" + keyword + "%"
		args = append(args, likeKeyword, likeKeyword)
	}
	query += ` ORDER BY created_at DESC, id DESC`

	rows, err := repository.db.Query(query, args...)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	posts := make([]domain.Post, 0)
	for rows.Next() {
		var post domain.Post
		if err := rows.Scan(&post.ID, &post.Title, &post.Text, &post.CreatedAt, &post.UpdatedAt); err != nil {
			return nil, err
		}
		posts = append(posts, post)
	}
	return posts, rows.Err()
}

func (repository *postRepository) findByID(kind postKind, postID int) (*domain.Post, error) {
	var post domain.Post
	err := repository.db.QueryRow(`
		SELECT id, title, text,
			DATE_FORMAT(created_at, '%Y-%m-%d') AS created_at,
			DATE_FORMAT(updated_at, '%Y-%m-%d') AS updated_at
		FROM posts
		WHERE id = ? AND kind = ?
	`, postID, kind).Scan(&post.ID, &post.Title, &post.Text, &post.CreatedAt, &post.UpdatedAt)
	if err != nil {
		return nil, err
	}
	return &post, nil
}

func (repository *postRepository) create(kind postKind, request domain.CreatePostRequest) (*domain.Post, error) {
	result, err := repository.db.Exec(`INSERT INTO posts (kind, title, text) VALUES (?, ?, ?)`, kind, request.Title, request.Text)
	if err != nil {
		return nil, err
	}
	postID, err := result.LastInsertId()
	if err != nil {
		return nil, err
	}
	return repository.findByID(kind, int(postID))
}

func (repository *postRepository) update(kind postKind, postID int, request domain.UpdatePostRequest) (*domain.Post, error) {
	result, err := repository.db.Exec(`
		UPDATE posts SET title = ?, text = ?, updated_at = CURRENT_TIMESTAMP
		WHERE id = ? AND kind = ?
	`, request.Title, request.Text, postID, kind)
	if err != nil {
		return nil, err
	}
	affectedRows, err := result.RowsAffected()
	if err != nil {
		return nil, err
	}
	if affectedRows == 0 {
		return nil, sql.ErrNoRows
	}
	return repository.findByID(kind, postID)
}

func (repository *postRepository) delete(kind postKind, postID int) error {
	result, err := repository.db.Exec(`DELETE FROM posts WHERE id = ? AND kind = ?`, postID, kind)
	if err != nil {
		return err
	}
	affectedRows, err := result.RowsAffected()
	if err != nil {
		return err
	}
	if affectedRows == 0 {
		return sql.ErrNoRows
	}
	return nil
}
