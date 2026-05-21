package controller

import (
	"errors"
	"net/http"
	"strconv"

	"portfolio-back/core/domain"
	"portfolio-back/core/usecase"

	"github.com/labstack/echo/v4"
)

// ArticleController型は、ArticleUsecase型のフィールドを1つ持つ
type ArticleController struct {
	articleUsecase usecase.ArticleUsecase
}

// NewArticleControllerは、ArticleUsecase型の値を受け取り、ArticleController型のポインタを返す
func NewArticleController(articleUsecase usecase.ArticleUsecase) *ArticleController {
	return &ArticleController{
		articleUsecase: articleUsecase,
	}
}

func (controller *ArticleController) GetAllArticles(ctx echo.Context) error {
	keyword := ctx.QueryParam("keyword")

	articles, err := controller.articleUsecase.GetAllArticles(keyword)
	if err != nil {
		return ctx.JSON(http.StatusInternalServerError, map[string]string{
			"message": "failed to get all articles",
		})
	}

	return ctx.JSON(http.StatusOK, articles)
}

func (controller *ArticleController) GetArticleByID(ctx echo.Context) error {
	articleID, err := strconv.Atoi(ctx.Param("id"))
	if err != nil {
		return ctx.JSON(http.StatusBadRequest, map[string]string{
			"message": "invalid article id",
		})
	}

	article, err := controller.articleUsecase.GetArticleByID(articleID)
	if err != nil {
		if errors.Is(err, domain.ErrArticleNotFound) {
			return ctx.JSON(http.StatusNotFound, map[string]string{
				"message": "article not found",
			})
		}

		return ctx.JSON(http.StatusInternalServerError, map[string]string{
			"message": "failed to get article",
		})
	}

	return ctx.JSON(http.StatusOK, article)
}

func (controller *ArticleController) PostArticle(ctx echo.Context) error {
	var request domain.CreateArticleRequest

	if err := ctx.Bind(&request); err != nil {
		return ctx.JSON(http.StatusBadRequest, map[string]string{
			"message": "invalid request body",
		})
	}

	if request.Title == "" || request.Text == "" {
		return ctx.JSON(http.StatusBadRequest, map[string]string{
			"message": "title and text are required",
		})
	}

	article, err := controller.articleUsecase.PostArticle(request)
	if err != nil {
		return ctx.JSON(http.StatusInternalServerError, map[string]string{
			"message": "failed to create article",
		})
	}

	return ctx.JSON(http.StatusCreated, article)
}

func (controller *ArticleController) PatchArticle(ctx echo.Context) error {
	articleID, err := strconv.Atoi(ctx.Param("id"))
	if err != nil {
		return ctx.JSON(http.StatusBadRequest, map[string]string{
			"message": "invalid article id",
		})
	}

	var request domain.UpdateArticleRequest

	if err := ctx.Bind(&request); err != nil {
		return ctx.JSON(http.StatusBadRequest, map[string]string{
			"message": "invalid request body",
		})
	}

	if request.Title == "" || request.Text == "" {
		return ctx.JSON(http.StatusBadRequest, map[string]string{
			"message": "title and text are required",
		})
	}

	article, err := controller.articleUsecase.PatchArticle(articleID, request)
	if err != nil {
		if errors.Is(err, domain.ErrArticleNotFound) {
			return ctx.JSON(http.StatusNotFound, map[string]string{
				"message": "article not found",
			})
		}

		return ctx.JSON(http.StatusInternalServerError, map[string]string{
			"message": "failed to update article",
		})
	}

	return ctx.JSON(http.StatusOK, article)
}

func (controller *ArticleController) DeleteArticle(ctx echo.Context) error {
	articleID, err := strconv.Atoi(ctx.Param("id"))
	if err != nil {
		return ctx.JSON(http.StatusBadRequest, map[string]string{
			"message": "invalid article id",
		})
	}

	response, err := controller.articleUsecase.DeleteArticle(articleID)
	if err != nil {
		if errors.Is(err, domain.ErrArticleNotFound) {
			return ctx.JSON(http.StatusNotFound, map[string]string{
				"message": "article not found",
			})
		}

		return ctx.JSON(http.StatusInternalServerError, map[string]string{
			"message": "failed to delete article",
		})
	}

	return ctx.JSON(http.StatusOK, response)
}
