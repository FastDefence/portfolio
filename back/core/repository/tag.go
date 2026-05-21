package repository

import (
	"database/sql"
	"portfolio-back/core/domain"
)

type TagRepository interface {
	FindAllTags() ([]domain.Tag, error)
	FindTagByID(tagID int) (*domain.Tag, error)
	CreateTag(request domain.CreateTagRequest) (*domain.Tag, error)
	UpdateTag(tagID int, request domain.UpdateTagRequest) (*domain.Tag, error)
	DeleteTag(tagID int) error
}

type tagRepository struct {
	db *sql.DB
}

func NewTagRepository(db *sql.DB) TagRepository {
	return &tagRepository{
		db: db,
	}
}

func (repository *tagRepository) FindAllTags() ([]domain.Tag, error) {
	rows, err := repository.db.Query(`
		SELECT
			id,
			name,
			DATE_FORMAT(created_at, '%Y%m%d') AS created_at,
			DATE_FORMAT(updated_at, '%Y%m%d') AS updated_at
		FROM tags
		ORDER BY id ASC
	`)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	tags := make([]domain.Tag, 0)

	for rows.Next() {
		var tag domain.Tag

		err := rows.Scan(
			&tag.ID,
			&tag.Name,
			&tag.CreatedAt,
			&tag.UpdatedAt,
		)
		if err != nil {
			return nil, err
		}

		tags = append(tags, tag)
	}

	if err := rows.Err(); err != nil {
		return nil, err
	}

	return tags, nil
}

func (repository *tagRepository) FindTagByID(tagID int) (*domain.Tag, error) {
	var tag domain.Tag

	err := repository.db.QueryRow(`
		SELECT
			id,
			name,
			DATE_FORMAT(created_at, '%Y%m%d') AS created_at,
			DATE_FORMAT(updated_at, '%Y%m%d') AS updated_at
		FROM tags
		WHERE id = ?
	`, tagID).Scan(
		&tag.ID,
		&tag.Name,
		&tag.CreatedAt,
		&tag.UpdatedAt,
	)
	if err != nil {
		return nil, err
	}

	return &tag, nil
}

func (repository *tagRepository) CreateTag(request domain.CreateTagRequest) (*domain.Tag, error) {
	result, err := repository.db.Exec(`
		INSERT INTO tags (name)
		VALUES (?)
	`, request.Name)
	if err != nil {
		return nil, err
	}

	tagID, err := result.LastInsertId()
	if err != nil {
		return nil, err
	}

	return repository.FindTagByID(int(tagID))
}

func (repository *tagRepository) UpdateTag(tagID int, request domain.UpdateTagRequest) (*domain.Tag, error) {
	result, err := repository.db.Exec(`
		UPDATE tags
		SET name = ?
		WHERE id = ?
	`, request.Name, tagID)
	if err != nil {
		return nil, err
	}

	affectedRows, err := result.RowsAffected()
	if err != nil {
		return nil, err
	}

	if affectedRows == 0 {
		return nil, domain.ErrTagNotFound
	}

	return repository.FindTagByID(tagID)
}

func (repository *tagRepository) DeleteTag(tagID int) error {
	result, err := repository.db.Exec(`
		DELETE FROM tags
		WHERE id = ?
	`, tagID)
	if err != nil {
		return err
	}

	affectedRows, err := result.RowsAffected()
	if err != nil {
		return err
	}

	if affectedRows == 0 {
		return domain.ErrTagNotFound
	}

	return nil
}
