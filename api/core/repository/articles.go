package repository

import (
	"database/sql"
	"errors"

	"portfolio-back/core/domain"
)

type ArticleRepository interface {
	FindAllArticles(keyword string) ([]domain.Article, error)
	FindArticleByID(articleID int) (*domain.Article, error)
	CreateArticle(request domain.CreateArticleRequest) (*domain.Article, error)
	UpdateArticle(articleID int, request domain.UpdateArticleRequest) (*domain.Article, error)
	DeleteArticle(articleID int) error
}

type articleRepository struct {
	posts *postRepository
}

func NewArticleRepository(db *sql.DB) ArticleRepository {
	return &articleRepository{posts: newPostRepository(db)}
}

func (repository *articleRepository) FindAllArticles(keyword string) ([]domain.Article, error) {
	return repository.posts.findAll(postKindArticle, keyword)
}

func (repository *articleRepository) FindArticleByID(articleID int) (*domain.Article, error) {
	article, err := repository.posts.findByID(postKindArticle, articleID)
	if errors.Is(err, sql.ErrNoRows) {
		return nil, domain.ErrArticleNotFound
	}
	return article, err
}

func (repository *articleRepository) CreateArticle(request domain.CreateArticleRequest) (*domain.Article, error) {
	return repository.posts.create(postKindArticle, request)
}

func (repository *articleRepository) UpdateArticle(articleID int, request domain.UpdateArticleRequest) (*domain.Article, error) {
	article, err := repository.posts.update(postKindArticle, articleID, request)
	if errors.Is(err, sql.ErrNoRows) {
		return nil, domain.ErrArticleNotFound
	}
	return article, err
}

func (repository *articleRepository) DeleteArticle(articleID int) error {
	err := repository.posts.delete(postKindArticle, articleID)
	if errors.Is(err, sql.ErrNoRows) {
		return domain.ErrArticleNotFound
	}
	return err
}
