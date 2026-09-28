package controller

import (
	"errors"
	"net/http"
	"portfolio-back/core/domain"
	"portfolio-back/core/usecase"
	"strconv"

	"github.com/labstack/echo/v4"
)

type ArticleTagController struct {
	articleTagUsecase usecase.ArticleTagUsecase
}

func NewArticleTagController(articleTagUsecase usecase.ArticleTagUsecase) *ArticleTagController {
	return &ArticleTagController{
		articleTagUsecase: articleTagUsecase,
	}
}

func (controller *ArticleTagController) GetArticleTags(ctx echo.Context) error {
	articleID, err := strconv.Atoi(ctx.Param("id"))
	if err != nil {
		return ctx.JSON(http.StatusBadRequest, map[string]string{
			"message": "invalid article id",
		})
	}

	tags, err := controller.articleTagUsecase.GetTagsByArticleID(articleID)
	if err != nil {
		return ctx.JSON(http.StatusInternalServerError, map[string]string{
			"message": "failed to get article tags",
		})
	}

	return ctx.JSON(http.StatusOK, tags)
}

func (controller *ArticleTagController) PutArticleTags(ctx echo.Context) error {
	articleID, err := strconv.Atoi(ctx.Param("id"))
	if err != nil {
		return ctx.JSON(http.StatusBadRequest, map[string]string{
			"message": "invalid article id",
		})
	}

	var request domain.UpdateArticleTagsRequest

	if err := ctx.Bind(&request); err != nil {
		return ctx.JSON(http.StatusBadRequest, map[string]string{
			"message": "invalid request body",
		})
	}

	if request.TagIDs == nil {
		return ctx.JSON(http.StatusBadRequest, map[string]string{
			"message": "tag_ids is required",
		})
	}

	for _, tagID := range request.TagIDs {
		if tagID <= 0 {
			return ctx.JSON(http.StatusBadRequest, map[string]string{
				"message": "invalid tag id",
			})
		}
	}

	tags, err := controller.articleTagUsecase.PutArticleTags(articleID, request)
	if err != nil {
		if errors.Is(err, domain.ErrArticleNotFound) {
			return ctx.JSON(http.StatusNotFound, map[string]string{
				"message": "article not found",
			})
		}

		if errors.Is(err, domain.ErrTagNotFound) {
			return ctx.JSON(http.StatusNotFound, map[string]string{
				"message": "tag not found",
			})
		}

		return ctx.JSON(http.StatusInternalServerError, map[string]string{
			"message": "failed to update article tags",
		})
	}

	return ctx.JSON(http.StatusOK, tags)
}
