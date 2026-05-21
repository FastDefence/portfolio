package repository

import (
	"database/sql"

	"portfolio-back/core/domain"
)

// ArticleRepositoryは、Usecaseから呼び出せるメソッド群を定義する
type ArticleRepository interface {
	FindAllArticles() ([]domain.Article, error)
	FindArticleByID(articleID int) (*domain.Article, error)
	CreateArticle(request domain.CreateArticleRequest) (*domain.Article, error)
	UpdateArticle(articleID int, request domain.UpdateArticleRequest) (*domain.Article, error)
	DeleteArticle(articleID int) error
}

// articleRepository型は、*sql.DB型のフィールドを1つ持つ
// 小文字始まりなので、repositoryパッケージ外からは直接参照できない
type articleRepository struct {
	db *sql.DB
}

// NewArticleRepositoryは、*sql.DB型の値を受け取り、ArticleRepository型として返す
func NewArticleRepository(db *sql.DB) ArticleRepository {
	return &articleRepository{
		db: db,
	}
}

func (repository *articleRepository) FindAllArticles() ([]domain.Article, error) {
	rows, err := repository.db.Query(`
		SELECT
			id,
			title,
			text,
			DATE_FORMAT(created_at, '%Y%m%d') AS created_at,
			DATE_FORMAT(updated_at, '%Y%m%d') AS updated_at
		FROM articles
		ORDER BY created_at DESC, id DESC
	`)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	articles := make([]domain.Article, 0)

	for rows.Next() {
		var article domain.Article

		err := rows.Scan(
			&article.ID,
			&article.Title,
			&article.Text,
			&article.CreatedAt,
			&article.UpdatedAt,
		)
		if err != nil {
			return nil, err
		}

		articles = append(articles, article)
	}

	if err := rows.Err(); err != nil {
		return nil, err
	}

	return articles, nil
}

func (repository *articleRepository) FindArticleByID(articleID int) (*domain.Article, error) {
	var article domain.Article

	err := repository.db.QueryRow(`
		SELECT
			id,
			title,
			text,
			DATE_FORMAT(created_at, '%Y%m%d') AS created_at,
			DATE_FORMAT(updated_at, '%Y%m%d') AS updated_at
		FROM articles
		WHERE id = ?
	`, articleID).Scan(
		&article.ID,
		&article.Title,
		&article.Text,
		&article.CreatedAt,
		&article.UpdatedAt,
	)
	if err != nil {
		return nil, err
	}

	return &article, nil
}

func (repository *articleRepository) CreateArticle(request domain.CreateArticleRequest) (*domain.Article, error) {
	result, err := repository.db.Exec(`
		INSERT INTO articles (title, text)
		VALUES (?, ?)
	`, request.Title, request.Text)
	if err != nil {
		return nil, err
	}

	articleID, err := result.LastInsertId()
	if err != nil {
		return nil, err
	}

	return repository.FindArticleByID(int(articleID))
}

func (repository *articleRepository) UpdateArticle(articleID int, request domain.UpdateArticleRequest) (*domain.Article, error) {
	result, err := repository.db.Exec(`
		UPDATE articles
		SET title = ?, text = ?
		WHERE id = ?
	`, request.Title, request.Text, articleID)
	if err != nil {
		return nil, err
	}

	affectedRows, err := result.RowsAffected()
	if err != nil {
		return nil, err
	}

	if affectedRows == 0 {
		return nil, domain.ErrArticleNotFound
	}

	return repository.FindArticleByID(articleID)
}

func (repository *articleRepository) DeleteArticle(articleID int) error {
	result, err := repository.db.Exec(`
		DELETE FROM articles
		WHERE id = ?
	`, articleID)
	if err != nil {
		return err
	}

	affectedRows, err := result.RowsAffected()
	if err != nil {
		return err
	}

	if affectedRows == 0 {
		return domain.ErrArticleNotFound
	}

	return nil
}
