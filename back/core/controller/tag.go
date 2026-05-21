package controller

import (
	"errors"
	"net/http"
	"portfolio-back/core/domain"
	"portfolio-back/core/usecase"
	"strconv"

	"github.com/labstack/echo/v4"
)

type TagController struct {
	tagUsecase usecase.TagUsecase
}

func NewTagController(tagUsecase usecase.TagUsecase) *TagController {
	return &TagController{
		tagUsecase: tagUsecase,
	}
}

func (controller *TagController) GetAllTags(ctx echo.Context) error {
	tags, err := controller.tagUsecase.GetAllTags()
	if err != nil {
		return ctx.JSON(http.StatusInternalServerError, map[string]string{
			"message": "failed to get all tags",
		})
	}

	return ctx.JSON(http.StatusOK, tags)
}

func (controller *TagController) GetTagByID(ctx echo.Context) error {
	tagID, err := strconv.Atoi(ctx.Param("id"))
	if err != nil {
		return ctx.JSON(http.StatusBadRequest, map[string]string{
			"message": "invalid tag id",
		})
	}

	tag, err := controller.tagUsecase.GetTagByID(tagID)
	if err != nil {
		if errors.Is(err, domain.ErrTagNotFound) {
			return ctx.JSON(http.StatusNotFound, map[string]string{
				"message": "tag not found",
			})
		}

		return ctx.JSON(http.StatusInternalServerError, map[string]string{
			"message": "failed to get tag",
		})
	}

	return ctx.JSON(http.StatusOK, tag)
}

func (controller *TagController) PostTag(ctx echo.Context) error {
	var request domain.CreateTagRequest

	if err := ctx.Bind(&request); err != nil {
		return ctx.JSON(http.StatusBadRequest, map[string]string{
			"message": "invalid request body",
		})
	}

	if request.Name == "" {
		return ctx.JSON(http.StatusBadRequest, map[string]string{
			"message": "name is required",
		})
	}

	tag, err := controller.tagUsecase.PostTag(request)
	if err != nil {
		return ctx.JSON(http.StatusInternalServerError, map[string]string{
			"message": "failed to create tag",
		})
	}

	return ctx.JSON(http.StatusCreated, tag)
}

func (controller *TagController) PatchTag(ctx echo.Context) error {
	tagID, err := strconv.Atoi(ctx.Param("id"))
	if err != nil {
		return ctx.JSON(http.StatusBadRequest, map[string]string{
			"message": "invalid tag id",
		})
	}

	var request domain.UpdateTagRequest

	if err := ctx.Bind(&request); err != nil {
		return ctx.JSON(http.StatusBadRequest, map[string]string{
			"message": "invalid request body",
		})
	}

	if request.Name == "" {
		return ctx.JSON(http.StatusBadRequest, map[string]string{
			"message": "name is required",
		})
	}

	tag, err := controller.tagUsecase.PatchTag(tagID, request)
	if err != nil {
		if errors.Is(err, domain.ErrTagNotFound) {
			return ctx.JSON(http.StatusNotFound, map[string]string{
				"message": "tag not found",
			})
		}

		return ctx.JSON(http.StatusInternalServerError, map[string]string{
			"message": "failed to update tag",
		})
	}

	return ctx.JSON(http.StatusOK, tag)
}

func (controller *TagController) DeleteTag(ctx echo.Context) error {
	tagID, err := strconv.Atoi(ctx.Param("id"))
	if err != nil {
		return ctx.JSON(http.StatusBadRequest, map[string]string{
			"message": "invalid tag id",
		})
	}

	response, err := controller.tagUsecase.DeleteTag(tagID)
	if err != nil {
		if errors.Is(err, domain.ErrTagNotFound) {
			return ctx.JSON(http.StatusNotFound, map[string]string{
				"message": "tag not found",
			})
		}

		return ctx.JSON(http.StatusInternalServerError, map[string]string{
			"message": "failed to delete tag",
		})
	}

	return ctx.JSON(http.StatusOK, response)
}
