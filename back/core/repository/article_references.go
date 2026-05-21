package repository

import (
	"database/sql"
	"errors"

	"portfolio-back/core/domain"
)

type ReferenceRepository interface {
	FindReferencesByArticleID(articleID int) ([]domain.Reference, error)
	CreateReference(articleID int, request domain.CreateReferenceRequest) (*domain.Reference, error)
	UpdateReference(referenceID int, request domain.UpdateReferenceRequest) (*domain.Reference, error)
	DeleteReference(referenceID int) error
}

type referenceRepository struct {
	db *sql.DB
}

func NewReferenceRepository(db *sql.DB) ReferenceRepository {
	return &referenceRepository{
		db: db,
	}
}

func (repository *referenceRepository) FindReferencesByArticleID(articleID int) ([]domain.Reference, error) {
	articleExists, err := repository.existsArticle(articleID)
	if err != nil {
		return nil, err
	}

	if !articleExists {
		return nil, domain.ErrArticleNotFound
	}

	rows, err := repository.db.Query(`
		SELECT
			id,
			article_id,
			title,
			url,
			DATE_FORMAT(created_at, '%Y%m%d') AS created_at,
			DATE_FORMAT(updated_at, '%Y%m%d') AS updated_at
		FROM article_references
		WHERE article_id = ?
		ORDER BY id ASC
	`, articleID)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	references := make([]domain.Reference, 0)

	for rows.Next() {
		var reference domain.Reference

		err := rows.Scan(
			&reference.ID,
			&reference.ArticleID,
			&reference.Title,
			&reference.URL,
			&reference.CreatedAt,
			&reference.UpdatedAt,
		)
		if err != nil {
			return nil, err
		}

		references = append(references, reference)
	}

	if err := rows.Err(); err != nil {
		return nil, err
	}

	return references, nil
}

func (repository *referenceRepository) CreateReference(articleID int, request domain.CreateReferenceRequest) (*domain.Reference, error) {
	articleExists, err := repository.existsArticle(articleID)
	if err != nil {
		return nil, err
	}

	if !articleExists {
		return nil, domain.ErrArticleNotFound
	}

	result, err := repository.db.Exec(`
		INSERT INTO article_references (article_id, title, url)
		VALUES (?, ?, ?)
	`, articleID, request.Title, request.URL)
	if err != nil {
		return nil, err
	}

	referenceID, err := result.LastInsertId()
	if err != nil {
		return nil, err
	}

	return repository.findReferenceByID(int(referenceID))
}

func (repository *referenceRepository) UpdateReference(referenceID int, request domain.UpdateReferenceRequest) (*domain.Reference, error) {
	result, err := repository.db.Exec(`
		UPDATE article_references
		SET title = ?, url = ?
		WHERE id = ?
	`, request.Title, request.URL, referenceID)
	if err != nil {
		return nil, err
	}

	affectedRows, err := result.RowsAffected()
	if err != nil {
		return nil, err
	}

	if affectedRows == 0 {
		return nil, domain.ErrReferenceNotFound
	}

	return repository.findReferenceByID(referenceID)
}

func (repository *referenceRepository) findReferenceByID(referenceID int) (*domain.Reference, error) {
	var reference domain.Reference

	err := repository.db.QueryRow(`
		SELECT
			id,
			article_id,
			title,
			url,
			DATE_FORMAT(created_at, '%Y%m%d') AS created_at,
			DATE_FORMAT(updated_at, '%Y%m%d') AS updated_at
		FROM article_references
		WHERE id = ?
	`, referenceID).Scan(
		&reference.ID,
		&reference.ArticleID,
		&reference.Title,
		&reference.URL,
		&reference.CreatedAt,
		&reference.UpdatedAt,
	)
	if err != nil {
		if errors.Is(err, sql.ErrNoRows) {
			return nil, domain.ErrReferenceNotFound
		}

		return nil, err
	}

	return &reference, nil
}

func (repository *referenceRepository) DeleteReference(referenceID int) error {
	result, err := repository.db.Exec(`
		DELETE FROM article_references
		WHERE id = ?
	`, referenceID)
	if err != nil {
		return err
	}

	affectedRows, err := result.RowsAffected()
	if err != nil {
		return err
	}

	if affectedRows == 0 {
		return domain.ErrReferenceNotFound
	}

	return nil
}

func (repository *referenceRepository) existsArticle(articleID int) (bool, error) {
	var exists bool

	err := repository.db.QueryRow(`
		SELECT EXISTS(
			SELECT 1
			FROM articles
			WHERE id = ?
		)
	`, articleID).Scan(&exists)
	if err != nil {
		return false, err
	}

	return exists, nil
}
