package controller

import (
	"errors"
	"net/http"
	"strconv"

	"portfolio-back/core/domain"
	"portfolio-back/core/usecase"

	"github.com/labstack/echo/v4"
)

type DailyController struct {
	dailyUsecase usecase.DailyUsecase
}

func NewDailyController(dailyUsecase usecase.DailyUsecase) *DailyController {
	return &DailyController{dailyUsecase: dailyUsecase}
}

func (controller *DailyController) GetAllDailies(ctx echo.Context) error {
	dailies, err := controller.dailyUsecase.GetAllDailies(ctx.QueryParam("keyword"))
	if err != nil {
		return ctx.JSON(http.StatusInternalServerError, map[string]string{"message": "failed to get dailies"})
	}
	return ctx.JSON(http.StatusOK, dailies)
}

func (controller *DailyController) GetDailyByID(ctx echo.Context) error {
	dailyID, err := strconv.Atoi(ctx.Param("id"))
	if err != nil {
		return ctx.JSON(http.StatusBadRequest, map[string]string{"message": "invalid daily id"})
	}

	daily, err := controller.dailyUsecase.GetDailyByID(dailyID)
	if errors.Is(err, domain.ErrDailyNotFound) {
		return ctx.JSON(http.StatusNotFound, map[string]string{"message": "daily not found"})
	}
	if err != nil {
		return ctx.JSON(http.StatusInternalServerError, map[string]string{"message": "failed to get daily"})
	}
	return ctx.JSON(http.StatusOK, daily)
}

func (controller *DailyController) PostDaily(ctx echo.Context) error {
	var request domain.CreateDailyRequest
	if err := ctx.Bind(&request); err != nil {
		return ctx.JSON(http.StatusBadRequest, map[string]string{"message": "invalid request body"})
	}
	if request.Title == "" || request.Text == "" {
		return ctx.JSON(http.StatusBadRequest, map[string]string{"message": "title and text are required"})
	}

	daily, err := controller.dailyUsecase.PostDaily(request)
	if err != nil {
		return ctx.JSON(http.StatusInternalServerError, map[string]string{"message": "failed to create daily"})
	}
	return ctx.JSON(http.StatusCreated, daily)
}

func (controller *DailyController) PatchDaily(ctx echo.Context) error {
	dailyID, err := strconv.Atoi(ctx.Param("id"))
	if err != nil {
		return ctx.JSON(http.StatusBadRequest, map[string]string{"message": "invalid daily id"})
	}

	var request domain.UpdateDailyRequest
	if err := ctx.Bind(&request); err != nil {
		return ctx.JSON(http.StatusBadRequest, map[string]string{"message": "invalid request body"})
	}
	if request.Title == "" || request.Text == "" {
		return ctx.JSON(http.StatusBadRequest, map[string]string{"message": "title and text are required"})
	}

	daily, err := controller.dailyUsecase.PatchDaily(dailyID, request)
	if errors.Is(err, domain.ErrDailyNotFound) {
		return ctx.JSON(http.StatusNotFound, map[string]string{"message": "daily not found"})
	}
	if err != nil {
		return ctx.JSON(http.StatusInternalServerError, map[string]string{"message": "failed to update daily"})
	}
	return ctx.JSON(http.StatusOK, daily)
}

func (controller *DailyController) DeleteDaily(ctx echo.Context) error {
	dailyID, err := strconv.Atoi(ctx.Param("id"))
	if err != nil {
		return ctx.JSON(http.StatusBadRequest, map[string]string{"message": "invalid daily id"})
	}

	response, err := controller.dailyUsecase.DeleteDaily(dailyID)
	if errors.Is(err, domain.ErrDailyNotFound) {
		return ctx.JSON(http.StatusNotFound, map[string]string{"message": "daily not found"})
	}
	if err != nil {
		return ctx.JSON(http.StatusInternalServerError, map[string]string{"message": "failed to delete daily"})
	}
	return ctx.JSON(http.StatusOK, response)
}
