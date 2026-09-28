package usecase

import (
	"portfolio-back/core/domain"
	"portfolio-back/core/repository"
)

type ArticleTagUsecase interface {
	GetTagsByArticleID(articleID int) ([]domain.Tag, error)
	PutArticleTags(articleID int, request domain.UpdateArticleTagsRequest) ([]domain.Tag, error)
}

type articleTagUsecase struct {
	articleTagRepository repository.ArticleTagRepository
}

func NewArticleTagUsecase(articleTagRepository repository.ArticleTagRepository) ArticleTagUsecase {
	return &articleTagUsecase{
		articleTagRepository: articleTagRepository,
	}
}

func (usecase *articleTagUsecase) GetTagsByArticleID(articleID int) ([]domain.Tag, error) {
	return usecase.articleTagRepository.FindTagsByArticleID(articleID)
}

func (usecase *articleTagUsecase) PutArticleTags(articleID int, request domain.UpdateArticleTagsRequest) ([]domain.Tag, error) {
	return usecase.articleTagRepository.UpdateArticleTags(articleID, request.TagIDs)
}
