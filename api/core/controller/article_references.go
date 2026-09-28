package controller

import (
	"errors"
	"net/http"
	"strconv"

	"portfolio-back/core/domain"
	"portfolio-back/core/usecase"

	"github.com/labstack/echo/v4"
)

type ReferenceController struct {
	referenceUsecase usecase.ReferenceUsecase
}

func NewReferenceController(referenceUsecase usecase.ReferenceUsecase) *ReferenceController {
	return &ReferenceController{
		referenceUsecase: referenceUsecase,
	}
}

func (controller *ReferenceController) GetReferencesByArticleID(ctx echo.Context) error {
	articleID, err := strconv.Atoi(ctx.Param("id"))
	if err != nil {
		return ctx.JSON(http.StatusBadRequest, map[string]string{
			"message": "invalid article id",
		})
	}

	references, err := controller.referenceUsecase.GetReferencesByArticleID(articleID)
	if err != nil {
		if errors.Is(err, domain.ErrArticleNotFound) {
			return ctx.JSON(http.StatusNotFound, map[string]string{
				"message": "article not found",
			})
		}

		return ctx.JSON(http.StatusInternalServerError, map[string]string{
			"message": "failed to get references",
		})
	}

	return ctx.JSON(http.StatusOK, references)
}

func (controller *ReferenceController) PostReference(ctx echo.Context) error {
	articleID, err := strconv.Atoi(ctx.Param("id"))
	if err != nil {
		return ctx.JSON(http.StatusBadRequest, map[string]string{
			"message": "invalid article id",
		})
	}

	var request domain.CreateReferenceRequest

	if err := ctx.Bind(&request); err != nil {
		return ctx.JSON(http.StatusBadRequest, map[string]string{
			"message": "invalid request body",
		})
	}

	if request.Title == "" || request.URL == "" {
		return ctx.JSON(http.StatusBadRequest, map[string]string{
			"message": "title and url are required",
		})
	}

	reference, err := controller.referenceUsecase.PostReference(articleID, request)
	if err != nil {
		if errors.Is(err, domain.ErrArticleNotFound) {
			return ctx.JSON(http.StatusNotFound, map[string]string{
				"message": "article not found",
			})
		}

		return ctx.JSON(http.StatusInternalServerError, map[string]string{
			"message": "failed to create reference",
		})
	}

	return ctx.JSON(http.StatusCreated, reference)
}

func (controller *ReferenceController) PatchReference(ctx echo.Context) error {
	referenceID, err := strconv.Atoi(ctx.Param("id"))
	if err != nil {
		return ctx.JSON(http.StatusBadRequest, map[string]string{
			"message": "invalid reference id",
		})
	}

	var request domain.UpdateReferenceRequest

	if err := ctx.Bind(&request); err != nil {
		return ctx.JSON(http.StatusBadRequest, map[string]string{
			"message": "invalid request body",
		})
	}

	if request.Title == "" || request.URL == "" {
		return ctx.JSON(http.StatusBadRequest, map[string]string{
			"message": "title and url are required",
		})
	}

	reference, err := controller.referenceUsecase.PatchReference(referenceID, request)
	if err != nil {
		if errors.Is(err, domain.ErrReferenceNotFound) {
			return ctx.JSON(http.StatusNotFound, map[string]string{
				"message": "reference not found",
			})
		}

		return ctx.JSON(http.StatusInternalServerError, map[string]string{
			"message": "failed to update reference",
		})
	}

	return ctx.JSON(http.StatusOK, reference)
}

func (controller *ReferenceController) DeleteReference(ctx echo.Context) error {
	referenceID, err := strconv.Atoi(ctx.Param("id"))
	if err != nil {
		return ctx.JSON(http.StatusBadRequest, map[string]string{
			"message": "invalid reference id",
		})
	}

	response, err := controller.referenceUsecase.DeleteReference(referenceID)
	if err != nil {
		if errors.Is(err, domain.ErrReferenceNotFound) {
			return ctx.JSON(http.StatusNotFound, map[string]string{
				"message": "reference not found",
			})
		}

		return ctx.JSON(http.StatusInternalServerError, map[string]string{
			"message": "failed to delete reference",
		})
	}

	return ctx.JSON(http.StatusOK, response)
}
