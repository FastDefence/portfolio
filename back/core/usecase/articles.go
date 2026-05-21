package usecase

import (
	"portfolio-back/core/domain"
	"portfolio-back/core/repository"
)

// ArticleUsecaseは、Controllerから呼び出せるメソッド群を定義する
type ArticleUsecase interface {
	GetAllArticles() ([]domain.Article, error)
	GetArticleByID(articleID int) (*domain.Article, error)
	PostArticle(request domain.CreateArticleRequest) (*domain.Article, error)
	PatchArticle(articleID int, request domain.UpdateArticleRequest) (*domain.Article, error)
	DeleteArticle(articleID int) (*domain.DeleteArticleResponse, error)
}

// articleUsecase型は、ArticleRepository型のフィールドを1つ持つ
// 小文字始まりなので、usecaseパッケージ外からは直接参照できない
type articleUsecase struct {
	articleRepository repository.ArticleRepository
}

// NewArticleUsecaseは、ArticleRepository型の値を受け取り、ArticleUsecase型のポインタを返す
func NewArticleUsecase(articleRepository repository.ArticleRepository) ArticleUsecase {
	return &articleUsecase{
		articleRepository: articleRepository,
	}
}

func (usecase *articleUsecase) GetAllArticles() ([]domain.Article, error) {
	return usecase.articleRepository.FindAllArticles()
}

func (usecase *articleUsecase) GetArticleByID(articleID int) (*domain.Article, error) {
	return usecase.articleRepository.FindArticleByID(articleID)
}

func (usecase *articleUsecase) PostArticle(request domain.CreateArticleRequest) (*domain.Article, error) {
	return usecase.articleRepository.CreateArticle(request)
}

func (usecase *articleUsecase) PatchArticle(articleID int, request domain.UpdateArticleRequest) (*domain.Article, error) {
	return usecase.articleRepository.UpdateArticle(articleID, request)
}

func (usecase *articleUsecase) DeleteArticle(articleID int) (*domain.DeleteArticleResponse, error) {
	err := usecase.articleRepository.DeleteArticle(articleID)
	if err != nil {
		return nil, err
	}

	return &domain.DeleteArticleResponse{
		ID:      articleID,
		Message: "article deleted",
	}, nil
}
