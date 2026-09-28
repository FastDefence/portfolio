package repository

import (
	"database/sql"
	"portfolio-back/core/domain"
)

type ArticleTagRepository interface {
	FindTagsByArticleID(articleID int) ([]domain.Tag, error)
	UpdateArticleTags(articleID int, tagIDs []int) ([]domain.Tag, error)
}

type articleTagRepository struct {
	db *sql.DB
}

func NewArticleTagRepository(db *sql.DB) ArticleTagRepository {
	return &articleTagRepository{
		db: db,
	}
}

func (repository *articleTagRepository) FindTagsByArticleID(articleID int) ([]domain.Tag, error) {
	rows, err := repository.db.Query(`
		SELECT
			tags.id,
			tags.name,
			DATE_FORMAT(tags.created_at, '%Y-%m-%d') AS created_at,
			DATE_FORMAT(tags.updated_at, '%Y-%m-%d') AS updated_at
		FROM article_tags
		INNER JOIN tags
			ON article_tags.tag_id = tags.id
		WHERE article_tags.article_id = ?
		ORDER BY tags.id ASC
	`, articleID)
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

func (repository *articleTagRepository) UpdateArticleTags(articleID int, tagIDs []int) ([]domain.Tag, error) {
	tx, err := repository.db.Begin()
	if err != nil {
		return nil, err
	}

	articleExists, err := repository.existsArticle(tx, articleID)
	if err != nil {
		tx.Rollback()
		return nil, err
	}

	if !articleExists {
		tx.Rollback()
		return nil, domain.ErrArticleNotFound
	}

	uniqueTagIDs := make([]int, 0)
	seenTagIDs := make(map[int]bool)

	for _, tagID := range tagIDs {
		if seenTagIDs[tagID] {
			continue
		}

		tagExists, err := repository.existsTag(tx, tagID)
		if err != nil {
			tx.Rollback()
			return nil, err
		}

		if !tagExists {
			tx.Rollback()
			return nil, domain.ErrTagNotFound
		}

		seenTagIDs[tagID] = true
		uniqueTagIDs = append(uniqueTagIDs, tagID)
	}

	_, err = tx.Exec(`
		DELETE FROM article_tags
		WHERE article_id = ?
	`, articleID)
	if err != nil {
		tx.Rollback()
		return nil, err
	}

	for _, tagID := range uniqueTagIDs {
		_, err := tx.Exec(`
			INSERT INTO article_tags (article_id, tag_id)
			VALUES (?, ?)
		`, articleID, tagID)
		if err != nil {
			tx.Rollback()
			return nil, err
		}
	}

	if err := tx.Commit(); err != nil {
		return nil, err
	}

	return repository.FindTagsByArticleID(articleID)
}

func (repository *articleTagRepository) existsArticle(tx *sql.Tx, articleID int) (bool, error) {
	var exists bool

	err := tx.QueryRow(`
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

func (repository *articleTagRepository) existsTag(tx *sql.Tx, tagID int) (bool, error) {
	var exists bool

	err := tx.QueryRow(`
		SELECT EXISTS(
			SELECT 1
			FROM tags
			WHERE id = ?
		)
	`, tagID).Scan(&exists)
	if err != nil {
		return false, err
	}

	return exists, nil
}
