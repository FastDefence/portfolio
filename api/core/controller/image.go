package controller

import (
	"net/http"

	"portfolio-back/core/usecase"

	"github.com/labstack/echo/v4"
)

type ImageController struct {
	imageUsecase usecase.ImageUsecase
}

func NewImageController(imageUsecase usecase.ImageUsecase) *ImageController {
	return &ImageController{
		imageUsecase: imageUsecase,
	}
}

func (controller *ImageController) PostArticleImage(context echo.Context) error {
	articleID := context.Param("id")
	name := context.QueryParam("name")

	fileHeader, err := context.FormFile("file")
	if err != nil {
		return context.JSON(http.StatusBadRequest, map[string]string{
			"message": "file is required",
		})
	}

	file, err := fileHeader.Open()
	if err != nil {
		return context.JSON(http.StatusInternalServerError, map[string]string{
			"message": "failed to open file",
		})
	}
	defer file.Close()

	image, err := controller.imageUsecase.PostArticleImage(articleID, name, file, fileHeader)
	if err != nil {
		return context.JSON(http.StatusBadRequest, map[string]string{
			"message": err.Error(),
		})
	}

	return context.JSON(http.StatusCreated, image)
}

func (controller *ImageController) GetArticleImages(context echo.Context) error {
	articleID := context.Param("id")

	images, err := controller.imageUsecase.GetArticleImages(articleID)
	if err != nil {
		return context.JSON(http.StatusBadRequest, map[string]string{
			"message": err.Error(),
		})
	}

	return context.JSON(http.StatusOK, map[string]interface{}{
		"images": images,
	})
}

func (controller *ImageController) DeleteArticleImage(context echo.Context) error {
	articleID := context.Param("id")
	name := context.Param("name")

	err := controller.imageUsecase.DeleteArticleImage(articleID, name)
	if err != nil {
		return context.JSON(http.StatusBadRequest, map[string]string{
			"message": err.Error(),
		})
	}

	return context.JSON(http.StatusOK, map[string]string{
		"message": "image deleted",
	})
}
